import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { Resend } from 'resend';

const TO = 'ayastracker@gmail.com';
const FROM =
  process.env.RESEND_FROM_EMAIL || 'Ayabonga Qwabi <onboarding@qwabi.co.za>';

const HEADER_KEYS = [
  'content-type',
  'content-length',
  'user-agent',
  'x-forwarded-for',
  'x-real-ip',
  'x-vercel-id',
  'x-vercel-ip-country',
  'accept',
  'host',
] as const;

type PhoneStatusRecord = {
  id: string;
  receivedAt: string;
  method: string;
  url: string;
  query: Record<string, string | string[]>;
  headers: Record<string, string>;
  body: string;
  bodyLength: number;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

function readRawBody(req: VercelRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer | string) => {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function getBlobToken(): string | undefined {
  return (
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN?.trim()
  );
}

function extractRequestData(req: VercelRequest, body: string): PhoneStatusRecord {
  const receivedAt = new Date().toISOString();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const headers: Record<string, string> = {};

  for (const key of HEADER_KEYS) {
    const value = req.headers[key];
    if (typeof value === 'string') {
      headers[key] = value;
    } else if (Array.isArray(value)) {
      headers[key] = value.join(', ');
    }
  }

  const query: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(req.query ?? {})) {
    if (typeof value === 'string' || Array.isArray(value)) {
      query[key] = value;
    }
  }

  return {
    id,
    receivedAt,
    method: req.method || 'UNKNOWN',
    url: req.url || '/api/phonestatus',
    query,
    headers,
    body,
    bodyLength: body.length,
  };
}

async function savePhoneStatusRecord(
  record: PhoneStatusRecord,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = getBlobToken();
  if (!token) {
    console.warn('[api/phonestatus] BLOB_READ_WRITE_TOKEN missing, skipping save');
    return { ok: false, error: 'Blob storage is not configured' };
  }

  const pathname = `phonestatus/${record.receivedAt.replace(/[:.]/g, '-')}-${record.id}.json`;

  try {
    await put(pathname, JSON.stringify(record, null, 2), {
      access: 'private',
      contentType: 'application/json',
      token,
    });
    console.log('[api/phonestatus] Saved record', { id: record.id, pathname });
    return { ok: true };
  } catch (error) {
    console.error('[api/phonestatus] Blob save failed', error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to save record',
    };
  }
}

async function sendPhoneStatusEmail(text: string): Promise<{
  status: number;
  body: { ok: true } | { error: string };
}> {
  const body = text.trim();
  if (!body) {
    return { status: 400, body: { error: 'Request body is required' } };
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) {
    return { status: 503, body: { error: 'Email service is not configured' } };
  }

  const resend = new Resend(resendKey);
  const sentAt = new Date().toISOString();

  const { error } = await resend.emails.send({
    from: FROM,
    to: [TO],
    subject: `Phone status · ${sentAt}`,
    text: body,
  });

  if (error) {
    console.error('[api/phonestatus] Email send failed', error);
    return {
      status: 400,
      body: { error: error.message || 'Failed to send email' },
    };
  }

  return { status: 200, body: { ok: true } };
}

/** Vercel serverless route: POST /api/phonestatus (plain text body → blob + email) */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const text = await readRawBody(req);
    const record = extractRequestData(req, text);
    const saved = await savePhoneStatusRecord(record);

    if (!saved.ok) {
      console.warn('[api/phonestatus] Record not saved', { error: saved.error });
    }

    const result = await sendPhoneStatusEmail(text);

    if (result.status !== 200 && 'error' in result.body) {
      console.error('[api/phonestatus] Request failed', {
        status: result.status,
        error: result.body.error,
        saved: saved.ok,
      });
    }

    return res.status(result.status).json({
      ...result.body,
      saved: saved.ok,
    });
  } catch (error: unknown) {
    console.error('[api/phonestatus] Critical handler error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

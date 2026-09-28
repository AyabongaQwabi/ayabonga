import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const TO = 'ayastracker@gmail.com';
const FROM =
  process.env.RESEND_FROM_EMAIL || 'Ayabonga Qwabi <onboarding@qwabi.co.za>';

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

/** Vercel serverless route: POST /api/phonestatus (plain text body → email) */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const text = await readRawBody(req);
    const result = await sendPhoneStatusEmail(text);

    if (result.status !== 200 && 'error' in result.body) {
      console.error('[api/phonestatus] Request failed', {
        status: result.status,
        error: result.body.error,
      });
    }

    return res.status(result.status).json(result.body);
  } catch (error: unknown) {
    console.error('[api/phonestatus] Critical handler error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}

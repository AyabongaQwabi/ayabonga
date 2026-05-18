import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  handleQuoteSend,
  isDevLogEnv,
  parseQuoteSendBody,
} from './lib/handleQuoteSend';

function parseRequestBody(
  req: VercelRequest,
): Record<string, unknown> | null {
  const raw = req.body;
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
  if (typeof raw === 'object') {
    return raw as Record<string, unknown>;
  }
  return null;
}

/** Vercel serverless route: POST /api/send (Resend quote export + nurture) */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const parsed = parseRequestBody(req);
    if (parsed === null && req.body) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }

    const body = parseQuoteSendBody(parsed);
    const result = await handleQuoteSend(body);

    if (result.status !== 200 && 'error' in result.body) {
      console.error('[api/send] Request failed', {
        status: result.status,
        error: result.body.error,
      });
    }

    return res.status(result.status).json(result.body);
  } catch (error: any) {
    console.error(`[api/send] Critical handler error:`, error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}

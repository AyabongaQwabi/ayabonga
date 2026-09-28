import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handlePhoneStatus } from './lib/handlePhoneStatus';

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
    const result = await handlePhoneStatus(text);

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

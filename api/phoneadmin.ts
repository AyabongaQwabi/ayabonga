import type { VercelRequest, VercelResponse } from '@vercel/node';
import { list } from '@vercel/blob';

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

type PhoneAdminRecord = PhoneStatusRecord & {
  pathname: string;
  uploadedAt: string;
};

function getBlobToken(): string | undefined {
  return (
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
    process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN?.trim()
  );
}

function parseLimit(value: unknown): number {
  const parsed = Number(typeof value === 'string' ? value : '50');
  if (!Number.isFinite(parsed)) return 50;
  return Math.min(200, Math.max(1, Math.floor(parsed)));
}

async function fetchBlobJson(
  url: string,
  token: string,
): Promise<PhoneStatusRecord | null> {
  try {
    const response = await fetch(url, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return (await response.json()) as PhoneStatusRecord;
  } catch (error) {
    console.warn('[api/phoneadmin] Failed to read blob', { url, error });
    return null;
  }
}

async function listPhoneStatusRecords(limit: number): Promise<{
  records: PhoneAdminRecord[];
  total: number;
}> {
  const token = getBlobToken();
  if (!token) {
    throw new Error('Blob storage is not configured');
  }

  const allBlobs: Array<{
    url: string;
    pathname: string;
    uploadedAt: Date;
  }> = [];

  let cursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const page = await list({
      prefix: 'phonestatus/',
      limit: 1000,
      cursor,
      token,
    });

    allBlobs.push(
      ...page.blobs.map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt,
      })),
    );

    cursor = page.cursor;
    hasMore = page.hasMore;
  }

  allBlobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());

  const selected = allBlobs.slice(0, limit);
  const records: PhoneAdminRecord[] = [];

  await Promise.all(
    selected.map(async (blob) => {
      const data = await fetchBlobJson(blob.url, token);
      if (!data) return;

      records.push({
        ...data,
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt.toISOString(),
      });
    }),
  );

  records.sort(
    (a, b) =>
      new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
  );

  return { records, total: allBlobs.length };
}

/** Vercel serverless route: GET /api/phoneadmin */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const limit = parseLimit(req.query.limit);
    const { records, total } = await listPhoneStatusRecords(limit);

    return res.status(200).json({ records, total, limit });
  } catch (error: unknown) {
    console.error('[api/phoneadmin] Handler error:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to load phone status records';
    const status = message.includes('not configured') ? 503 : 500;
    return res.status(status).json({ error: message });
  }
}

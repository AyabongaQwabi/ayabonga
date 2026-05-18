import type { VercelRequest, VercelResponse } from '@vercel/node';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function isDevLog(): boolean {
  return false;
}

function isAuthorized(req: VercelRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.log('[cron/social-post] CRON_SECRET is missing');
    return process.env.VERCEL_ENV === 'development' || process.env.NODE_ENV === 'development';
  }
  console.log('[cron/social-post] CRON_SECRET is present');
  console.log('[cron/social-post] Authorization header:', req.headers.authorization);
  console.log('[cron/social-post] Expected value:', `Bearer ${secret}`);
  console.log('[cron/social-post] Authorization header matches:', req.headers.authorization === `Bearer ${secret}`);
  return req.headers.authorization === `Bearer ${secret}`;
}

function buildArgs(req: VercelRequest): string[] {
  const args: string[] = [];
  const platform = 'facebook-only'; // TODO we will add instagram later
  const dryRun = req.query.dry_run === 'true' || req.query.dry_run === '1';

  // If no date provided, default to today in YYYY-MM-DD so post.js uses the
  // correct local date rather than relying on UTC new Date() inside the script.
  const rawDate =
    typeof req.query.date === 'string' && req.query.date.trim()
      ? req.query.date.trim()
      : process.env.SOCIAL_POST_DATE?.trim() || '';
  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
  const date = rawDate || todayStr;

  const slot =
    typeof req.query.slot === 'string' && req.query.slot.trim()
      ? req.query.slot.trim()
      : process.env.SOCIAL_POST_SLOT?.trim() || '';

  console.log('[cron/social-post] Building args', { platform, dryRun, date, slot });

  if (platform === 'facebook-only') args.push('--facebook-only');
  if (platform === 'instagram-only') args.push('--instagram-only');
  if (dryRun) args.push('--dry-run');
  // Always pass --date so post.js never falls back to UTC ambiguity
  args.push('--date', date);
  if (slot) args.push('--slot', slot);

  return args;
}

/** Vercel Cron: GET /api/cron/social-post (Mon/Wed/Fri schedules in vercel.json) */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    console.log('[cron/social-post] Method not allowed');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAuthorized(req)) {
    console.log('[cron/social-post] Unauthorized');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const scriptPath = path.join(process.cwd(), 'scripts/social/post.js');
  const args = buildArgs(req);

  if (isDevLog()) {
    console.log('[cron/social-post] Running', { scriptPath, args });
  }

  try {
    const { stdout, stderr } = await execFileAsync('node', [scriptPath, ...args], {
      env: process.env,
      maxBuffer: 10 * 1024 * 1024,
    });

    if (stderr) {
      console.log('[cron/social-post] stderr', stderr.slice(-2000));
    }

    return res.status(200).json({
      ok: true,
      args,
      stdout: stdout.slice(-4000),
      stderr: stderr?.slice(-4000) ?? '',
    });
  } catch (err: unknown) {
    const e = err as {
      code?: number | string;
      message?: string;
      stdout?: string;
      stderr?: string;
    };

    // Always log the full error so Vercel logs show what went wrong
    console.log('[cron/social-post] failed', {
      code: e.code,
      message: e.message,
      stdout: e.stdout?.slice(-2000),
      stderr: e.stderr?.slice(-2000),
    });

    const exitCode = typeof e.code === 'number' ? e.code : 1;

    return res.status(exitCode === 0 ? 200 : 500).json({
      ok: false,
      error: e.message ?? 'Social post failed',
      args,
      stdout: e.stdout?.slice(-4000),
      stderr: e.stderr?.slice(-4000),
    });
  }
}

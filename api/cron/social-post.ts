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
  return req.headers.authorization === `Bearer ${secret}`;
}

function buildArgs(req: VercelRequest): string[] {
  const args: string[] = [];
  const platform =
    typeof req.query.platform === 'string' ? req.query.platform : 'facebook-only';
  const dryRun = req.query.dry_run === 'true' || req.query.dry_run === '1';
  const date =
    typeof req.query.date === 'string'
      ? req.query.date
      : process.env.SOCIAL_POST_DATE?.trim() || '';

  console.log('[cron/social-post] Building args', { platform, dryRun, date });

  if (platform === 'facebook-only') args.push('--facebook-only');
  if (platform === 'instagram-only') args.push('--instagram-only');
  if (dryRun) args.push('--dry-run');
  if (date) args.push('--date', date);

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

    if (isDevLog() && stderr) {
      console.log('[cron/social-post] stderr', stderr);
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

    if (isDevLog()) {
      console.log('[cron/social-post] failed', {
        code: e.code,
        message: e.message,
        stdout: e.stdout,
        stderr: e.stderr,
      });
    }

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

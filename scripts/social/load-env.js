/**
 * Load .env from repo root into process.env (does not override existing vars).
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

export function loadEnvFiles() {
  const files = ['.env.local', '.env'];
  const loaded = [];

  for (const name of files) {
    const path = join(repoRoot, name);
    if (!existsSync(path)) continue;
    applyEnvFile(path);
    loaded.push(name);
  }

  return loaded;
}

function applyEnvFile(path) {
  const text = readFileSync(path, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

export function envStatus() {
  return {
    SOCIAL_INSTAGRAM_ENABLED: process.env.SOCIAL_INSTAGRAM_ENABLED === 'true' ? 'on' : 'paused',
    GRAPH_API_VERSION: process.env.GRAPH_API_VERSION || '25.0 (default)',
    FACEBOOK_PAGE_ID: !!process.env.FACEBOOK_PAGE_ID,
    FACEBOOK_PAGE_ACCESS_TOKEN: !!(
      process.env.FACEBOOK_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN
    ),
    APP_SCOPED_USER_ID: !!process.env.APP_SCOPED_USER_ID,
    FACEBOOK_USER_TOKEN: !!process.env.FACEBOOK_USER_TOKEN,
    FACEBOOK_USER_TOKEN_EXPIRES_IN_DAYS: process.env.FACEBOOK_USER_TOKEN_EXPIRES_IN_DAYS || '(not set)',
    INSTAGRAM_ACCOUNT_ID: !!process.env.INSTAGRAM_ACCOUNT_ID,
    INSTAGRAM_ACCESS_TOKEN: !!process.env.INSTAGRAM_ACCESS_TOKEN,
    PEXELS_API_KEY: !!process.env.PEXELS_API_KEY,
    VECTEEZY_ACCOUNT_ID: !!process.env.VECTEEZY_ACCOUNT_ID,
    VECTEEZY_SECRET_KEY: !!process.env.VECTEEZY_SECRET_KEY,
  };
}

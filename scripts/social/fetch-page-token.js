#!/usr/bin/env node
/**
 * Resolve long-lived Page access token via GET /{app-scoped-user-id}/accounts
 *
 * Requires in .env.local:
 *   FACEBOOK_USER_TOKEN (long-lived user token)
 *   APP_SCOPED_USER_ID
 *   FACEBOOK_PAGE_ID
 *
 * Optional: exchange short-lived user token first if FACEBOOK_USER_TOKEN is short-lived:
 *   node scripts/social/exchange-user-token.js
 */

import { loadEnvFiles } from './load-env.js';
import { log, logBanner } from './log.js';
import { graphVersion } from './graph-config.js';
import { ensurePageAccessToken } from './meta-tokens.js';

loadEnvFiles();

try {
  const token = await ensurePageAccessToken();
  logBanner('PAGE ACCESS TOKEN', [
    `Graph API v${graphVersion()}`,
    `Page ID: ${process.env.FACEBOOK_PAGE_ID}`,
    '',
    'Add to .env.local (do not commit):',
    'FACEBOOK_PAGE_ACCESS_TOKEN=<token below>',
    '',
    token,
    '',
    'Long-lived page tokens do not expire unless revoked.',
  ]);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

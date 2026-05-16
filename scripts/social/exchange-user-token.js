#!/usr/bin/env node
/**
 * Exchange short-lived FACEBOOK_USER_TOKEN for long-lived user token.
 * @see https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-long-lived
 *
 * Requires: FACEBOOK_DEVELOPER_APP_ID, FACEBOOK_DEVELOPER_APP_SECRET, FACEBOOK_USER_TOKEN (short-lived)
 *
 * Prints the new token to paste into .env.local as FACEBOOK_USER_TOKEN
 */

import { loadEnvFiles } from './load-env.js';
import { log, logBanner } from './log.js';
import { userAccessToken, graphVersion } from './graph-config.js';
import { exchangeLongLivedUserToken } from './meta-tokens.js';

loadEnvFiles();

const shortToken = userAccessToken();
if (!shortToken) {
  console.error('Set FACEBOOK_USER_TOKEN to your short-lived user access token first.');
  process.exit(1);
}

try {
  const longToken = await exchangeLongLivedUserToken(shortToken);
  logBanner('LONG-LIVED USER TOKEN', [
    `Graph API v${graphVersion()}`,
    '',
    'Update .env.local:',
    'FACEBOOK_USER_TOKEN=<token below>',
    '',
    longToken,
    '',
    'Then run: node scripts/social/fetch-page-token.js',
  ]);
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

/**
 * Long-lived user + page token helpers (Meta Login docs).
 * @see https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-long-lived
 */

import { log } from './log.js';
import {
  graphApiBase,
  graphVersion,
  facebookAppId,
  facebookAppSecret,
  userAccessToken,
  appScopedUserId,
  pageAccessToken,
  setPageAccessToken,
} from './graph-config.js';

/**
 * Exchange short-lived user token for long-lived user token (~60 days).
 */
export async function exchangeLongLivedUserToken(shortLivedToken) {
  const appId = facebookAppId();
  const appSecret = facebookAppSecret();
  if (!appId || !appSecret) {
    throw new Error('FACEBOOK_DEVELOPER_APP_ID and FACEBOOK_DEVELOPER_APP_SECRET required for token exchange');
  }

  const url = new URL(`${graphApiBase()}/oauth/access_token`);
  url.searchParams.set('grant_type', 'fb_exchange_token');
  url.searchParams.set('client_id', appId);
  url.searchParams.set('client_secret', appSecret);
  url.searchParams.set('fb_exchange_token', shortLivedToken);

  log('tokens', 'Exchanging short-lived user token for long-lived', { graphVersion: graphVersion() });

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(`Token exchange failed: ${JSON.stringify(data.error || data)}`);
  }

  log('tokens', 'Long-lived user token received', {
    expires_in: data.expires_in,
    token_type: data.token_type,
  });

  return data.access_token;
}

/**
 * GET /{app-scoped-user-id}/accounts → long-lived page access_token for FACEBOOK_PAGE_ID.
 */
export async function fetchPageTokenFromAccounts(userId, longLivedUserToken, targetPageId) {
  const url = new URL(`${graphApiBase()}/${userId}/accounts`);
  url.searchParams.set('access_token', longLivedUserToken);

  log('tokens', 'Fetching managed pages', { userId, targetPageId });

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(`accounts request failed: ${JSON.stringify(data.error || data)}`);
  }

  const pages = data.data ?? [];
  const match = pages.find((p) => String(p.id) === String(targetPageId));

  if (!match?.access_token) {
    throw new Error(
      `Page ${targetPageId} not in /accounts response. Pages found: ${pages.map((p) => p.id).join(', ') || 'none'}`
    );
  }

  log('tokens', 'Page access token resolved', { pageId: match.id, pageName: match.name });
  return match.access_token;
}

/**
 * Ensure FACEBOOK_PAGE_ACCESS_TOKEN is set (direct env, /me, or /accounts).
 */
export async function ensurePageAccessToken() {
  let token = pageAccessToken();
  if (token) {
    setPageAccessToken(token);
    return token;
  }

  const pageId = process.env.FACEBOOK_PAGE_ID;
  const userId = appScopedUserId();
  let userToken = userAccessToken();

  if (userToken && userId && pageId) {
    token = await fetchPageTokenFromAccounts(userId, userToken, pageId);
    setPageAccessToken(token);
    return token;
  }

  throw new Error(
    'Set FACEBOOK_PAGE_ACCESS_TOKEN (page token), or FACEBOOK_USER_TOKEN + APP_SCOPED_USER_ID + FACEBOOK_PAGE_ID'
  );
}

/**
 * Resolve page token, FACEBOOK_PAGE_ID, and INSTAGRAM_ACCOUNT_ID when missing.
 */

import { log } from './log.js';
import { graphApiBase, graphVersion, pageAccessToken } from './graph-config.js';
import { ensurePageAccessToken } from './meta-tokens.js';

export async function resolveMetaIds() {
  log('meta', 'Resolving Meta credentials', { graphVersion: graphVersion() });

  await ensurePageAccessToken();
  const token = pageAccessToken();

  if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
    process.env.INSTAGRAM_ACCESS_TOKEN = token;
    log('meta', 'Using page access token for INSTAGRAM_ACCESS_TOKEN');
  }

  if (!process.env.FACEBOOK_PAGE_ID) {
    log('meta', 'FACEBOOK_PAGE_ID missing, resolving from /me');
    const res = await fetch(
      `${graphApiBase()}/me?fields=id,name&access_token=${encodeURIComponent(token)}`
    );
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(`Could not resolve page ID: ${JSON.stringify(data.error || data)}`);
    }
    process.env.FACEBOOK_PAGE_ID = data.id;
    log('meta', 'Resolved Facebook Page', { pageId: data.id, name: data.name });
  }

  if (!process.env.INSTAGRAM_ACCOUNT_ID && process.env.FACEBOOK_PAGE_ID) {
    log('meta', 'INSTAGRAM_ACCOUNT_ID missing, resolving from page');
    const res = await fetch(
      `${graphApiBase()}/${process.env.FACEBOOK_PAGE_ID}?fields=instagram_business_account&access_token=${encodeURIComponent(token)}`
    );
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(`Could not resolve Instagram account: ${JSON.stringify(data.error || data)}`);
    }
    const igId = data.instagram_business_account?.id;
    if (!igId) {
      throw new Error('Page has no linked instagram_business_account');
    }
    process.env.INSTAGRAM_ACCOUNT_ID = igId;
    log('meta', 'Resolved Instagram Business account', { instagramAccountId: igId });
  }

  if (process.env.FACEBOOK_USER_TOKEN_EXPIRES_IN_DAYS) {
    log('meta', 'User token expiry hint', {
      FACEBOOK_USER_TOKEN_EXPIRES_IN_DAYS: process.env.FACEBOOK_USER_TOKEN_EXPIRES_IN_DAYS,
    });
  }
}

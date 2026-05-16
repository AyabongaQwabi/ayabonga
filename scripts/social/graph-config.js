/**
 * Shared Meta Graph API config and env aliases.
 * @see https://developers.facebook.com/docs/pages-api
 */

export function graphVersion() {
  return process.env.GRAPH_API_VERSION || process.env.META_GRAPH_API_VERSION || '25.0';
}

export function graphApiBase() {
  return `https://graph.facebook.com/v${graphVersion()}`;
}

/** Long-lived Page access token used for POST /{page-id}/feed */
export function pageAccessToken() {
  return (
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN ||
    process.env.FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN ||
    ''
  );
}

export function userAccessToken() {
  return process.env.FACEBOOK_USER_TOKEN || '';
}

export function appScopedUserId() {
  return process.env.APP_SCOPED_USER_ID || '';
}

export function facebookAppId() {
  return process.env.FACEBOOK_DEVELOPER_APP_ID || process.env.FACEBOOK_APP_ID || '';
}

export function facebookAppSecret() {
  return process.env.FACEBOOK_DEVELOPER_APP_SECRET || '';
}

/** Write canonical names so older code paths keep working */
export function setPageAccessToken(token) {
  process.env.FACEBOOK_PAGE_ACCESS_TOKEN = token;
  process.env.FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN = token;
}

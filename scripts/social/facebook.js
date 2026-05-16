/**
 * Posts a text message to a Facebook Page.
 * Requires: FACEBOOK_PAGE_ID and FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN
 */

const GRAPH_API = 'https://graph.facebook.com/v20.0';

export async function postToFacebook(message) {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = process.env.FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN;

  if (!pageId) throw new Error('Missing env var: FACEBOOK_PAGE_ID');
  if (!token) throw new Error('Missing env var: FACEBOOK_DEVELOPER_APP_PAGE_ACCESS_TOKEN');

  const url = `${GRAPH_API}/${pageId}/feed`;
  const body = new URLSearchParams({ message, access_token: token });

  const res = await fetch(url, { method: 'POST', body });
  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(`Facebook post failed: ${JSON.stringify(data.error || data)}`);
  }

  console.log(`✅ Facebook posted. Post ID: ${data.id}`);
  return data;
}

/**
 * Facebook Page posts via Pages API.
 * @see https://developers.facebook.com/docs/pages-api/posts
 *
 * - Text:  POST /{page-id}/feed   (message)
 * - Photo: POST /{page-id}/photos (url + message) → returns post_id for permalink
 */

import { log, logError } from './log.js';
import { graphApiBase, graphVersion, pageAccessToken } from './graph-config.js';

function requirePageCredentials() {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const token = pageAccessToken();

  if (!pageId) throw new Error('Missing env var: FACEBOOK_PAGE_ID');
  if (!token) {
    throw new Error(
      'Missing page token: set FACEBOOK_PAGE_ACCESS_TOKEN or run token resolution (FACEBOOK_USER_TOKEN + APP_SCOPED_USER_ID)'
    );
  }

  return { pageId, token };
}

/**
 * Text-only post (link posts use optional `link` param).
 */
export async function postToFacebook(message, options = {}) {
  const { pageId, token } = requirePageCredentials();
  const url = `${graphApiBase()}/${pageId}/feed`;

  log('facebook', 'POST /{page-id}/feed (text post)', {
    graphVersion: graphVersion(),
    pageId,
    endpoint: url,
    messageLength: message.length,
    published: options.published ?? true,
  });

  const body = new URLSearchParams({
    message,
    access_token: token,
    published: String(options.published ?? true),
  });

  if (options.link) body.set('link', options.link);
  if (options.published === false && options.scheduledPublishTime) {
    body.set('scheduled_publish_time', String(options.scheduledPublishTime));
  }

  const data = await graphPost(url, body);
  log('facebook', 'Feed post created', { postId: data.id });

  const permalink = await resolvePostPermalink(data.id, token);
  log('facebook', 'Permalink', { permalink });

  return { id: data.id, permalink, type: 'feed' };
}

/**
 * Photo post — image must be a public URL (same as Instagram image_url).
 * @see https://developers.facebook.com/docs/pages-api/posts#publish-a-photo
 */
export async function postPhotoToFacebook(imageUrl, message, options = {}) {
  const { pageId, token } = requirePageCredentials();
  const url = `${graphApiBase()}/${pageId}/photos`;

  log('facebook', 'POST /{page-id}/photos (media post)', {
    graphVersion: graphVersion(),
    pageId,
    endpoint: url,
    imageUrl,
    messageLength: message.length,
    published: options.published ?? true,
  });

  const body = new URLSearchParams({
    url: imageUrl,
    message,
    access_token: token,
    published: String(options.published ?? true),
  });

  if (options.published === false && options.scheduledPublishTime) {
    body.set('scheduled_publish_time', String(options.scheduledPublishTime));
  }

  const data = await graphPost(url, body);
  log('facebook', 'Photo published', { photoId: data.id, postId: data.post_id });

  const postId = data.post_id || data.id;
  const permalink = pagePostPermalink(postId);
  log('facebook', 'Permalink', { permalink, postId });

  return {
    id: postId,
    photoId: data.id,
    permalink,
    type: 'photo',
    imageUrl,
  };
}

/**
 * Video post — video must be a public URL.
 * @see https://developers.facebook.com/docs/video-api/guides/publishing
 */
export async function postVideoToFacebook(videoUrl, description, options = {}) {
  const { pageId, token } = requirePageCredentials();
  const url = `${graphApiBase()}/${pageId}/videos`;

  log('facebook', 'POST /{page-id}/videos (video post)', {
    graphVersion: graphVersion(),
    pageId,
    endpoint: url,
    videoUrl,
    descriptionLength: description?.length ?? 0,
    published: options.published ?? true,
  });

  const body = new URLSearchParams({
    file_url: videoUrl,
    description: description || '',
    access_token: token,
    published: String(options.published ?? true),
  });

  if (options.published === false && options.scheduledPublishTime) {
    body.set('scheduled_publish_time', String(options.scheduledPublishTime));
  }

  const data = await graphPost(url, body);
  log('facebook', 'Video published', { videoId: data.id });

  const permalink = pagePostPermalink(data.id);
  log('facebook', 'Permalink', { permalink, videoId: data.id });

  return {
    id: data.id,
    permalink,
    type: 'video',
    videoUrl,
  };
}

/** Docs: permalink is https://www.facebook.com/{page_post_id} */
function pagePostPermalink(pagePostId) {
  return `https://www.facebook.com/${pagePostId}`;
}

async function graphPost(url, body) {
  const res = await fetch(url, { method: 'POST', body });
  const data = await res.json();

  if (!res.ok || data.error) {
    logError('facebook', 'Graph API error', new Error(JSON.stringify(data.error || data)));
    throw new Error(`Facebook API failed: ${JSON.stringify(data.error || data)}`);
  }

  return data;
}

async function resolvePostPermalink(postId, token) {
  const url = `${graphApiBase()}/${postId}?fields=permalink_url&access_token=${encodeURIComponent(token)}`;
  log('facebook', 'Fetching permalink_url', { postId });

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    log('facebook', 'Using fallback permalink format', {
      status: res.status,
      error: data.error?.message,
    });
    return pagePostPermalink(postId);
  }

  return data.permalink_url || pagePostPermalink(postId);
}

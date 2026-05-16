/**
 * Posts an image + caption to Instagram Business Account via Graph API.
 */

import { log, logError } from './log.js';
import { graphApiBase, graphVersion, pageAccessToken } from './graph-config.js';

export async function postToInstagram(imageUrl, caption) {
  const GRAPH_API = graphApiBase();
  const GRAPH_VER = graphVersion();
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  // Page token works for Instagram Graph when IG is linked to the Page.
  // A separate INSTAGRAM_ACCESS_TOKEN often causes error 190 if malformed or wrong type.
  const token = pageAccessToken();

  if (!accountId) throw new Error('Missing env var: INSTAGRAM_ACCOUNT_ID');
  if (!token) throw new Error('Missing env var: INSTAGRAM_ACCESS_TOKEN');
  if (!imageUrl) throw new Error('Instagram requires an image URL');

  log('instagram', 'Starting publish flow', {
    graphVersion: GRAPH_VER,
    accountId,
    imageUrl,
    captionLength: caption.length,
  });

  const containerUrl = `${GRAPH_API}/${accountId}/media`;
  log('instagram', 'Step 1/3: create media container', { endpoint: containerUrl });

  const containerRes = await fetch(containerUrl, {
    method: 'POST',
    body: new URLSearchParams({
      image_url: imageUrl,
      caption,
      access_token: token,
    }),
  });
  const container = await containerRes.json();

  if (!containerRes.ok || container.error) {
    logError('instagram', 'Container creation failed', new Error(JSON.stringify(container.error || container)));
    throw new Error(`Instagram container error: ${JSON.stringify(container.error || container)}`);
  }

  const creationId = container.id;
  log('instagram', 'Container created', { creationId });

  log('instagram', 'Step 2/3: wait for container processing');
  await waitForContainer(creationId, token);

  log('instagram', 'Step 3/3: publish media', { creationId });
  const publishRes = await fetch(`${GRAPH_API}/${accountId}/media_publish`, {
    method: 'POST',
    body: new URLSearchParams({
      creation_id: creationId,
      access_token: token,
    }),
  });
  const published = await publishRes.json();

  if (!publishRes.ok || published.error) {
    logError('instagram', 'Publish failed', new Error(JSON.stringify(published.error || published)));
    throw new Error(`Instagram publish error: ${JSON.stringify(published.error || published)}`);
  }

  log('instagram', 'Media published', { mediaId: published.id });

  const details = await fetchMediaDetails(published.id, token);

  return {
    id: published.id,
    permalink: details.permalink,
    mediaUrl: details.media_url,
  };
}

async function waitForContainer(creationId, token, maxAttempts = 12) {
  const base = graphApiBase();
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(
      `${base}/${creationId}?fields=status_code&access_token=${encodeURIComponent(token)}`
    );
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Instagram status check failed: ${JSON.stringify(data.error || data)}`);
    }

    log('instagram', `Container status (attempt ${i + 1}/${maxAttempts})`, {
      status_code: data.status_code,
    });

    if (data.status_code === 'FINISHED') return;
    if (data.status_code === 'ERROR') {
      throw new Error('Instagram media container processing failed');
    }

    await sleep(2500);
  }

  throw new Error('Instagram media container timed out waiting for FINISHED status');
}

async function fetchMediaDetails(mediaId, token) {
  const url = `${graphApiBase()}/${mediaId}?fields=permalink,media_url&access_token=${encodeURIComponent(token)}`;
  log('instagram', 'Fetching permalink and media_url', { mediaId });

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data.error) {
    log('instagram', 'Could not fetch media details', { error: data.error?.message });
    return { permalink: null, media_url: null };
  }

  return data;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Posts an image + caption to Instagram Business Account via Graph API.
 * 
 * Flow:
 * 1. Create media container (image_url + caption)
 * 2. Publish the container
 * 
 * Requires: INSTAGRAM_ACCOUNT_ID and INSTAGRAM_ACCESS_TOKEN
 */

const GRAPH_API = 'https://graph.facebook.com/v20.0';

export async function postToInstagram(imageUrl, caption) {
  const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accountId) throw new Error('Missing env var: INSTAGRAM_ACCOUNT_ID');
  if (!token) throw new Error('Missing env var: INSTAGRAM_ACCESS_TOKEN');
  if (!imageUrl) throw new Error('Instagram requires an image URL');

  // Step 1: Create media container
  const containerRes = await fetch(`${GRAPH_API}/${accountId}/media`, {
    method: 'POST',
    body: new URLSearchParams({
      image_url: imageUrl,
      caption,
      access_token: token,
    }),
  });
  const container = await containerRes.json();

  if (!containerRes.ok || container.error) {
    throw new Error(`Instagram container error: ${JSON.stringify(container.error || container)}`);
  }

  const creationId = container.id;
  console.log(`📦 Instagram media container created: ${creationId}`);

  // Step 2: Wait until Meta finishes processing the image
  await waitForContainer(creationId, token);

  const publishRes = await fetch(`${GRAPH_API}/${accountId}/media_publish`, {
    method: 'POST',
    body: new URLSearchParams({
      creation_id: creationId,
      access_token: token,
    }),
  });
  const published = await publishRes.json();

  if (!publishRes.ok || published.error) {
    throw new Error(`Instagram publish error: ${JSON.stringify(published.error || published)}`);
  }

  console.log(`✅ Instagram posted. Media ID: ${published.id}`);
  return published;
}

async function waitForContainer(creationId, token, maxAttempts = 12) {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(
      `${GRAPH_API}/${creationId}?fields=status_code&access_token=${token}`
    );
    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(`Instagram status check failed: ${JSON.stringify(data.error || data)}`);
    }

    if (data.status_code === 'FINISHED') return;
    if (data.status_code === 'ERROR') {
      throw new Error('Instagram media container processing failed');
    }

    await sleep(2500);
  }

  throw new Error('Instagram media container timed out waiting for FINISHED status');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

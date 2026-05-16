/**
 * Instagram image URLs by media type:
 * - photo  → Pexels (stock photography)
 * - vector → Vecteezy (vectors / illustrations)
 */

import { log, logError } from './log.js';

const BRAND_IMAGE_URL =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/634131924_4362348684012184_2809328754212142225_n%20%281%29-n9dEY5Noh5Y0nxfTCK3TwAMABTs8KG.jpg';

const VECTEEZY_API = 'https://api.vecteezy.com';

export async function fetchImageUrl(query, options = {}) {
  if (options.source === 'brand') {
    log('image', 'Using brand image', { imageUrl: BRAND_IMAGE_URL });
    return BRAND_IMAGE_URL;
  }
  if (options.url) {
    log('image', 'Using fixed imageUrl from calendar', { imageUrl: options.url });
    return options.url;
  }

  const media = normalizeMedia(options.media);
  log('image', 'Fetching stock asset', { media, query, provider: media === 'photo' ? 'Pexels' : 'Vecteezy' });

  try {
    if (media === 'photo') {
      const key = process.env.PEXELS_API_KEY;
      if (!key) throw new Error('Photo posts require PEXELS_API_KEY (pexels.com/api).');
      const imageUrl = await fetchPexelsPhoto(query, key);
      log('image', 'Pexels photo selected', { imageUrl });
      return imageUrl;
    }

    const accountId = process.env.VECTEEZY_ACCOUNT_ID;
    const apiKey = process.env.VECTEEZY_SECRET_KEY;
    if (!accountId || !apiKey) {
      throw new Error(
        'Vector posts require VECTEEZY_ACCOUNT_ID and VECTEEZY_SECRET_KEY (vecteezy.com/developers).'
      );
    }
    const imageUrl = await fetchVecteezyVector(query, accountId, apiKey);
    log('image', 'Vecteezy vector selected', { imageUrl });
    return imageUrl;
  } catch (err) {
    logError('image', 'Failed to fetch image', err);
    throw err;
  }
}

function normalizeMedia(media) {
  if (media === 'vector') return 'vector';
  return 'photo';
}

async function fetchPexelsPhoto(query, key) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=square`;
  log('image', 'Pexels search request', { query });

  const res = await fetch(url, { headers: { Authorization: key } });
  const bodyText = await res.text();
  if (!res.ok) throw new Error(`Pexels ${res.status}: ${bodyText}`);

  const data = JSON.parse(bodyText);
  if (!data.photos?.length) throw new Error(`Pexels: no photos for "${query}"`);

  const photo = data.photos[Math.floor(Math.random() * data.photos.length)];
  log('image', 'Pexels match', { photoId: photo.id, photographer: photo.photographer });

  return photo.src.large2x || photo.src.large || photo.src.original;
}

async function fetchVecteezyVector(query, accountId, apiKey) {
  const searchUrl = new URL(`${VECTEEZY_API}/v2/${accountId}/resources`);
  searchUrl.searchParams.set('query', query);
  searchUrl.searchParams.set('content_type', 'vector');
  searchUrl.searchParams.set('per_page', '5');

  log('image', 'Vecteezy search request', { query, accountId });

  const searchRes = await vecteezyFetch(searchUrl, apiKey);
  const searchData = await searchRes.json();

  if (!searchRes.ok) {
    throw new Error(`Vecteezy search ${formatVecteezyError(searchData, searchRes.status)}`);
  }

  const resources = searchData.resources ?? searchData.data ?? [];
  if (!resources.length) throw new Error(`Vecteezy: no vectors for "${query}"`);

  const resource = resources[Math.floor(Math.random() * resources.length)];
  const resourceId = resource.id ?? resource.resource_id;
  log('image', 'Vecteezy match', { resourceId });

  const previewUrl = pickPublicUrl(resource);
  if (previewUrl) return previewUrl;

  if (!resourceId) throw new Error('Vecteezy: resource missing id');

  const downloadUrl = new URL(
    `${VECTEEZY_API}/v2/${accountId}/resources/${resourceId}/download`
  );
  log('image', 'Vecteezy download request', { resourceId });

  const downloadRes = await vecteezyFetch(downloadUrl, apiKey);
  const downloadData = await downloadRes.json();

  if (!downloadRes.ok) {
    throw new Error(`Vecteezy download ${formatVecteezyError(downloadData, downloadRes.status)}`);
  }

  const url = pickPublicUrl(downloadData);
  if (!url) throw new Error('Vecteezy: download response missing public URL');
  return url;
}

function vecteezyFetch(url, apiKey) {
  return fetch(url, {
    headers: {
      Authorization: apiKey,
      Accept: 'application/json',
    },
  });
}

function pickPublicUrl(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const candidates = [
    obj.url,
    obj.download_url,
    obj.downloadUrl,
    obj.preview_url,
    obj.previewUrl,
    obj.thumbnail_url,
    obj.thumbnailUrl,
    obj.file_url,
    obj.fileUrl,
    obj.data?.url,
    obj.data?.download_url,
  ];
  return candidates.find((u) => typeof u === 'string' && /^https?:\/\//i.test(u)) ?? null;
}

function formatVecteezyError(data, status) {
  const msg = data?.errors?.[0]?.message ?? data?.message ?? JSON.stringify(data);
  return `${status} ${msg}`;
}

/**
 * Fetches a relevant image URL from Unsplash for Instagram posts.
 * Falls back to Pexels if PEXELS_API_KEY is set.
 */

const BRAND_IMAGE_URL =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/634131924_4362348684012184_2809328754212142225_n%20%281%29-n9dEY5Noh5Y0nxfTCK3TwAMABTs8KG.jpg';

export async function fetchImageUrl(query, options = {}) {
  if (options.source === 'brand') return BRAND_IMAGE_URL;
  if (options.url) return options.url;

  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  const pexelsKey = process.env.PEXELS_API_KEY;

  if (unsplashKey) {
    return fetchUnsplash(query, unsplashKey);
  }
  if (pexelsKey) {
    return fetchPexels(query, pexelsKey);
  }
  throw new Error('No image API key set. Add UNSPLASH_ACCESS_KEY or PEXELS_API_KEY to your secrets.');
}

async function fetchUnsplash(query, key) {
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=squarish&client_id=${key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Unsplash error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  // Use the regular size (1080px) for Instagram quality
  return data.urls.regular;
}

async function fetchPexels(query, key) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Pexels error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  if (!data.photos?.length) throw new Error(`No Pexels results for query: ${query}`);
  return data.photos[0].src.large;
}

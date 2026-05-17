/**
 * Download remote images (Pexels CDN pattern from download-marketing-images.mjs)
 * and optionally optimize to WebP with sharp.
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

export function pexelsUrl(photoId, width = 1200) {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

export async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {string} url
 * @param {string} destPath
 */
export async function downloadUrl(url, destPath) {
  await mkdir(path.dirname(destPath), { recursive: true });
  const res = await fetch(url, {
    headers: { 'User-Agent': 'ayabonga-blog-pipeline/1.0' },
  });
  if (!res.ok) {
    throw new Error(`Download failed ${url}: ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(destPath, buf);
  if (process.env.NODE_ENV === 'development') {
    console.log(`[blog-image-fetch] Saved ${destPath} (${Math.round(buf.length / 1024)} KB)`);
  }
  return destPath;
}

/**
 * @param {string} inputPath
 * @param {string} [webpPath]
 * @returns {Promise<string>} best output path (webp if created)
 */
export async function optimizeToWebp(inputPath, webpPath) {
  const out = webpPath ?? inputPath.replace(/\.(jpe?g|png)$/i, '.webp');
  try {
    const sharp = (await import('sharp')).default;
    await sharp(inputPath)
      .rotate()
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out);
    return out;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[blog-image-fetch] sharp optimize skipped', err.message);
    }
    return inputPath;
  }
}

/**
 * Download Pexels photo by id → webp in destDir.
 * @param {number} photoId
 * @param {string} destDir
 * @param {string} baseName
 */
export async function fetchPexelsToWebp(photoId, destDir, baseName) {
  const jpg = path.join(destDir, `${baseName}.jpg`);
  await downloadUrl(pexelsUrl(photoId), jpg);
  const webp = path.join(destDir, `${baseName}.webp`);
  return optimizeToWebp(jpg, webp);
}

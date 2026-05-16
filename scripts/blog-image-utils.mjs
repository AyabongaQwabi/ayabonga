/**
 * Shared helpers for blog hero download, resize, and WebP export.
 */
import { access, unlink } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export const HERO_MAX_WIDTH = 1200;
export const HERO_TARGET_BYTES = 300 * 1024;
export const WEBP_QUALITY = 82;

export async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function fileSize(filePath) {
  const { stat } = await import('node:fs/promises');
  return (await stat(filePath)).size;
}

/** Resize JPEG in place with macOS sips (no ImageMagick required). */
export async function resizeJpegInPlace(jpgPath, maxWidth = HERO_MAX_WIDTH) {
  try {
    await execFileAsync('sips', ['-Z', String(maxWidth), jpgPath], {
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch {
    // sips missing on Linux CI; keep original
  }
}

/** Write WebP next to JPEG; returns path if under target size. */
export async function jpegToWebp(jpgPath, webpPath, quality = WEBP_QUALITY) {
  try {
    await execFileAsync(
      'cwebp',
      ['-q', String(quality), jpgPath, '-o', webpPath],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );
    return webpPath;
  } catch {
    return null;
  }
}

/**
 * Pick best public path: prefer WebP when small enough, else optimized JPEG.
 * Returns { publicPath, format, heroPath, inlinePath } (paths on disk).
 */
export async function finalizeHeroAssets(slug, jpgHeroPath, jpgInlinePath) {
  await resizeJpegInPlace(jpgHeroPath);
  await resizeJpegInPlace(jpgInlinePath);

  const webpHeroPath = jpgHeroPath.replace(/\.jpe?g$/i, '.webp');
  const webpInlinePath = jpgInlinePath.replace(/\.jpe?g$/i, '.webp');

  const webpHero = await jpegToWebp(jpgHeroPath, webpHeroPath);
  if (webpHero) {
    await jpegToWebp(jpgInlinePath, webpInlinePath);
  }

  let useWebp = false;
  if (webpHero && (await fileExists(webpHeroPath))) {
    const webpSize = await fileSize(webpHeroPath);
    const jpgSize = await fileSize(jpgHeroPath);
    if (webpSize <= HERO_TARGET_BYTES && webpSize < jpgSize) {
      useWebp = true;
    }
  }

  if (useWebp) {
    return {
      format: 'webp',
      publicPath: `/images/blog/${slug}.webp`,
      heroPath: webpHeroPath,
      inlinePath: webpInlinePath,
    };
  }

  return {
    format: 'jpg',
    publicPath: `/images/blog/${slug}.jpg`,
    heroPath: jpgHeroPath,
    inlinePath: jpgInlinePath,
  };
}

export async function removeIfExists(filePath) {
  if (await fileExists(filePath)) {
    await unlink(filePath);
  }
}

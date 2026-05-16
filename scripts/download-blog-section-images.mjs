#!/usr/bin/env node
/**
 * Downloads distinct Pexels section images for priority blog posts.
 *
 * Usage:
 *   node scripts/download-blog-section-images.mjs
 *   node scripts/download-blog-section-images.mjs --slug=ai-tools-building-apps-2026
 *   node scripts/download-blog-section-images.mjs --force
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  fileExists,
  resizeJpegInPlace,
  jpegToWebp,
  HERO_TARGET_BYTES,
} from './blog-image-utils.mjs';
import {
  PRIORITY_SECTION_SLUGS,
  SECTION_IMAGE_SOURCES,
} from './blog-section-images.mjs';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/images/blog');
const MANIFEST_PATH = path.join(OUT_DIR, '.section-manifest.json');

async function downloadWithCurl(url, dest, force) {
  if (!force && (await fileExists(dest))) {
    return false;
  }
  await execFileAsync(
    'curl',
    [
      '-fsSL',
      '--max-time',
      '120',
      '-A',
      'ayabonga-blog-section-script/1.0',
      '-o',
      dest,
      url,
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  return true;
}

async function fileSize(filePath) {
  const { stat } = await import('node:fs/promises');
  return (await stat(filePath)).size;
}

/** Resize JPEG and export WebP; prefer WebP when under target size. */
async function finalizeSectionAsset(key) {
  const jpgPath = path.join(OUT_DIR, `${key}.jpg`);
  const webpPath = path.join(OUT_DIR, `${key}.webp`);

  await resizeJpegInPlace(jpgPath);
  const webp = await jpegToWebp(jpgPath, webpPath);

  let publicPath = `/images/blog/${key}.jpg`;
  if (webp && (await fileExists(webpPath))) {
    const webpSize = await fileSize(webpPath);
    const jpgSize = await fileSize(jpgPath);
    if (webpSize <= HERO_TARGET_BYTES && webpSize < jpgSize) {
      publicPath = `/images/blog/${key}.webp`;
    }
  }

  return { key, publicPath, format: publicPath.endsWith('.webp') ? 'webp' : 'jpg' };
}

async function processKey(key, url, force) {
  const jpgPath = path.join(OUT_DIR, `${key}.jpg`);
  try {
    const downloaded = await downloadWithCurl(url, jpgPath, force);
    if (downloaded) {
      console.log(`saved: ${key}.jpg`);
    } else if (force) {
      await downloadWithCurl(url, jpgPath, true);
      console.log(`saved: ${key}.jpg`);
    } else {
      console.log(`skip download (exists): ${key}.jpg`);
    }
    return await finalizeSectionAsset(key);
  } catch (err) {
    console.error(`failed: ${key}`, err.message ?? err);
    return { key, error: String(err.message ?? err) };
  }
}

function keysForSlug(slug) {
  return Object.keys(SECTION_IMAGE_SOURCES).filter((k) => k.startsWith(`${slug}-`));
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1];

  await mkdir(OUT_DIR, { recursive: true });

  const slugs = slugArg ? [slugArg] : PRIORITY_SECTION_SLUGS;
  const manifest = [];
  const failures = [];

  for (const slug of slugs) {
    const keys = keysForSlug(slug);
    if (!keys.length) {
      console.warn(`no section keys for slug: ${slug}`);
      continue;
    }
    for (const key of keys) {
      const url = SECTION_IMAGE_SOURCES[key];
      if (!url) {
        console.warn(`no source: ${key}`);
        failures.push(key);
        continue;
      }
      const entry = await processKey(key, url, force);
      if (entry.error) failures.push(key);
      else manifest.push(entry);
    }
  }

  if (manifest.length) {
    let existing = [];
    if (await fileExists(MANIFEST_PATH)) {
      try {
        existing = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
      } catch {
        existing = [];
      }
    }
    const byKey = new Map(existing.map((e) => [e.key, e]));
    for (const e of manifest) {
      if (!e.error) byKey.set(e.key, e);
    }
    await writeFile(
      MANIFEST_PATH,
      `${JSON.stringify([...byKey.values()], null, 2)}\n`,
    );
  }

  if (failures.length) {
    console.error('failures:', failures.join(', '));
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

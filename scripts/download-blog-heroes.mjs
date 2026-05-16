#!/usr/bin/env node
/**
 * Downloads curated Pexels hero images for blog posts (curl, no API key).
 * Resizes with sips, optionally exports WebP via cwebp when smaller.
 *
 * Usage:
 *   node scripts/download-blog-heroes.mjs [--slug=name] [--force]
 *   node scripts/download-blog-heroes.mjs --culture [--force]
 *   node scripts/download-blog-heroes.mjs --seo [--force]
 *   node scripts/download-blog-heroes.mjs --optimize-existing
 */
import { mkdir, copyFile, writeFile, readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  fileExists,
  finalizeHeroAssets,
} from './blog-image-utils.mjs';
import {
  ALL_HERO_SOURCES,
  CULTURE_HERO_SOURCES,
  SEO_HERO_SOURCES,
  PHASE_0A_BACKFILL_SLUGS,
} from './blog-hero-sources.mjs';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/images/blog');
const MANIFEST_PATH = path.join(OUT_DIR, '.hero-manifest.json');

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
      'ayabonga-blog-hero-script/1.0',
      '-o',
      dest,
      url,
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  return true;
}

async function processSlug(slug, url, force) {
  const jpgHero = path.join(OUT_DIR, `${slug}.jpg`);
  const jpgInline = path.join(OUT_DIR, `${slug}-inline.jpg`);

  const downloaded = await downloadWithCurl(url, jpgHero, force);
  if (downloaded) {
    console.log(`saved: ${slug}.jpg`);
  } else if (force) {
    await downloadWithCurl(url, jpgHero, true);
    console.log(`saved: ${slug}.jpg`);
  } else {
    console.log(`skip download (exists): ${slug}.jpg`);
  }

  if (force || !(await fileExists(jpgInline))) {
    await copyFile(jpgHero, jpgInline);
    console.log(`inline copy: ${slug}-inline.jpg`);
  }

  const assets = await finalizeHeroAssets(slug, jpgHero, jpgInline);
  console.log(`format: ${assets.format} -> ${assets.publicPath}`);
  return { slug, publicPath: assets.publicPath, format: assets.format };
}

async function optimizeExistingSlugs(slugs, force) {
  const results = [];
  for (const slug of slugs) {
    const jpgHero = path.join(OUT_DIR, `${slug}.jpg`);
    const jpgInline = path.join(OUT_DIR, `${slug}-inline.jpg`);
    if (!(await fileExists(jpgHero))) {
      console.warn(`skip optimize (no jpg): ${slug}`);
      continue;
    }
    if (!(await fileExists(jpgInline))) {
      await copyFile(jpgHero, jpgInline);
    }
    const assets = await finalizeHeroAssets(slug, jpgHero, jpgInline);
    console.log(`optimized: ${slug} (${assets.format})`);
    results.push({ slug, publicPath: assets.publicPath, format: assets.format });
  }
  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1];
  const cultureOnly = args.includes('--culture');
  const seoOnly = args.includes('--seo');
  const optimizeExisting = args.includes('--optimize-existing');
  const phase0a = args.includes('--phase-0a');

  await mkdir(OUT_DIR, { recursive: true });

  let sources = ALL_HERO_SOURCES;
  if (cultureOnly) sources = CULTURE_HERO_SOURCES;
  if (seoOnly) sources = SEO_HERO_SOURCES;

  let slugs;
  if (slugArg) {
    slugs = [slugArg];
  } else if (phase0a) {
    slugs = PHASE_0A_BACKFILL_SLUGS.filter((s) => sources[s] || CULTURE_HERO_SOURCES[s]);
    sources = { ...CULTURE_HERO_SOURCES, ...SEO_HERO_SOURCES };
  } else if (optimizeExisting) {
    slugs = Object.keys(SEO_HERO_SOURCES);
    const manifest = await optimizeExistingSlugs(slugs, force);
    await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
    return;
  } else {
    slugs = Object.keys(sources);
  }

  const manifest = [];
  for (const slug of slugs) {
    const url = sources[slug];
    if (!url) {
      console.warn(`no source for slug: ${slug}`);
      continue;
    }
    try {
      const entry = await processSlug(slug, url, force);
      manifest.push(entry);
    } catch (err) {
      console.error(`failed: ${slug}`, err.message ?? err);
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
    const bySlug = new Map(existing.map((e) => [e.slug, e]));
    for (const e of manifest) bySlug.set(e.slug, e);
    await writeFile(
      MANIFEST_PATH,
      `${JSON.stringify([...bySlug.values()], null, 2)}\n`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

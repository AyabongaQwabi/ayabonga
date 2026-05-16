#!/usr/bin/env node
/**
 * Sets headerImage + ogImage from on-disk heroes (manifest or /images/blog/{slug}.webp|jpg).
 *
 * Usage:
 *   node scripts/sync-blog-image-frontmatter.mjs
 *   node scripts/sync-blog-image-frontmatter.mjs --phase-0a
 *   node scripts/sync-blog-image-frontmatter.mjs --slug=my-post
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_HERO_SOURCES, PHASE_0A_BACKFILL_SLUGS } from './blog-hero-sources.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = path.join(ROOT, 'src/content/blog');
const IMG_DIR = path.join(ROOT, 'public/images/blog');
const MANIFEST_PATH = path.join(IMG_DIR, '.hero-manifest.json');

const SEO_SLUGS = Object.keys(SEO_HERO_SOURCES);

function setFrontmatterField(block, key, value) {
  const re = new RegExp(`^${key}:.*$`, 'm');
  const line = `${key}: ${value}`;
  if (re.test(block)) return block.replace(re, line);
  return `${block.trimEnd()}\n${line}`;
}

function removeFrontmatterField(block, key) {
  return block.replace(new RegExp(`^${key}:.*\\n?`, 'm'), '');
}

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolvePublicPath(slug, manifestMap) {
  if (manifestMap.has(slug)) return manifestMap.get(slug);
  if (await exists(path.join(IMG_DIR, `${slug}.webp`))) {
    return `/images/blog/${slug}.webp`;
  }
  if (await exists(path.join(IMG_DIR, `${slug}.jpg`))) {
    return `/images/blog/${slug}.jpg`;
  }
  return null;
}

async function loadManifest() {
  const map = new Map();
  if (!(await exists(MANIFEST_PATH))) return map;
  try {
    const list = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
    for (const { slug, publicPath } of list) {
      if (slug && publicPath) map.set(slug, publicPath);
    }
  } catch {
    // ignore
  }
  return map;
}

async function syncSlug(slug, manifestMap) {
  const img = await resolvePublicPath(slug, manifestMap);
  if (!img) {
    console.warn(`skip (no image file): ${slug}`);
    return false;
  }

  const file = path.join(BLOG_DIR, `${slug}.md`);
  let raw = await readFile(file, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) {
    console.warn(`skip (no frontmatter): ${slug}`);
    return false;
  }

  let fm = m[1];
  fm = removeFrontmatterField(fm, 'image');
  fm = setFrontmatterField(fm, 'headerImage', img);
  fm = setFrontmatterField(fm, 'ogImage', img);
  raw = `---\n${fm}\n---\n${m[2]}`;
  await writeFile(file, raw);
  console.log(`updated: ${slug} -> ${img}`);
  return true;
}

const args = process.argv.slice(2);
const slugArg = args.find((a) => a.startsWith('--slug='))?.split('=')[1];
const phase0a = args.includes('--phase-0a');

const manifestMap = await loadManifest();
let slugs = slugArg ? [slugArg] : [...SEO_SLUGS];
if (phase0a) {
  slugs = PHASE_0A_BACKFILL_SLUGS;
} else if (!slugArg) {
  slugs = [...new Set([...SEO_SLUGS, ...PHASE_0A_BACKFILL_SLUGS])];
}

let ok = 0;
for (const slug of slugs) {
  if (await syncSlug(slug, manifestMap)) ok++;
}
console.log(`synced ${ok}/${slugs.length}`);

// ntsikana-prophet: ensure header matches og when only og was set
const ntsikanaSlug = 'ntsikana-prophet-pacification-xhosa';
if (slugs.includes(ntsikanaSlug) || phase0a) {
  await syncSlug(ntsikanaSlug, manifestMap);
}

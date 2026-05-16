#!/usr/bin/env node
/** Insert inline hero image after first ## heading if missing */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { access, constants } from 'node:fs/promises';
import { SEO_HERO_SOURCES } from './blog-hero-sources.mjs';
import {
  PHASE_0A_BACKFILL_SLUGS,
  INLINE_ALT_BY_SLUG,
} from './blog-hero-sources.mjs';

const BLOG = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src/content/blog');
const IMG_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/images/blog');

const SEO_SLUGS = Object.keys(SEO_HERO_SOURCES);
const EXTRA_INLINE_SLUGS = [
  'technical-cofounder-cost-south-africa-2026',
  'hidden-cost-junior-mvp',
  'sa-payment-gateways-react-next-2026',
];

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function inlinePathForSlug(slug) {
  if (await exists(path.join(IMG_DIR, `${slug}-inline.webp`))) {
    return `/images/blog/${slug}-inline.webp`;
  }
  if (await exists(path.join(IMG_DIR, `${slug}-inline.jpg`))) {
    return `/images/blog/${slug}-inline.jpg`;
  }
  if (await exists(path.join(IMG_DIR, `${slug}.webp`))) {
    return `/images/blog/${slug}.webp`;
  }
  if (await exists(path.join(IMG_DIR, `${slug}.jpg`))) {
    return `/images/blog/${slug}.jpg`;
  }
  return null;
}

const args = process.argv.slice(2);
const phase0a = args.includes('--phase-0a');
const slugs = phase0a
  ? [...PHASE_0A_BACKFILL_SLUGS, 'ntsikana-prophet-pacification-xhosa']
  : [...SEO_SLUGS, ...EXTRA_INLINE_SLUGS];

/** Upgrade legacy -inline.jpg markdown paths when -inline.webp exists. */
async function upgradeInlineRefs(slug) {
  const webpInline = path.join(IMG_DIR, `${slug}-inline.webp`);
  if (!(await exists(webpInline))) return;
  const file = path.join(BLOG, `${slug}.md`);
  let raw = await readFile(file, 'utf8');
  const from = `/images/blog/${slug}-inline.jpg`;
  const to = `/images/blog/${slug}-inline.webp`;
  if (!raw.includes(from)) return;
  raw = raw.split(from).join(to);
  await writeFile(file, raw);
  console.log('inline webp refs:', slug);
}

for (const slug of slugs) {
  const file = path.join(BLOG, `${slug}.md`);
  let raw;
  try {
    raw = await readFile(file, 'utf8');
  } catch {
    continue;
  }

  const inline = await inlinePathForSlug(slug);
  if (!inline) {
    console.warn(`skip inline (no file): ${slug}`);
    continue;
  }

  if (raw.includes(inline) || raw.includes(`${slug}-inline.`)) continue;

  const m = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  if (!m) continue;
  let body = m[1];

  const alt =
    INLINE_ALT_BY_SLUG[slug] ?? 'Supporting visual for this section';
  const insert = `\n![${alt}](${inline})\n`;

  const heading = body.match(/^## .+$/m) ?? body.match(/^### .+$/m);
  let idx;
  if (heading) {
    idx = body.indexOf(heading[0]) + heading[0].length;
  } else {
    const paraEnd = body.search(/\n\n/);
    idx = paraEnd === -1 ? body.length : paraEnd;
  }

  body = body.slice(0, idx) + insert + body.slice(idx);
  raw = raw.replace(m[1], body);
  await writeFile(file, raw);
  console.log('inline:', slug);
}

const allSlugs = [...new Set([...SEO_SLUGS, ...PHASE_0A_BACKFILL_SLUGS, ...EXTRA_INLINE_SLUGS])];
for (const slug of allSlugs) {
  await upgradeInlineRefs(slug);
}

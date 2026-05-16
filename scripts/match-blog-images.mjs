#!/usr/bin/env node
/**
 * List unmapped blog images and optionally wire posts (see wire-blog-images.mjs).
 * Usage:
 *   node scripts/match-blog-images.mjs          # report only
 *   node scripts/match-blog-images.mjs --check  # exit 1 if broken refs remain
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BLOG_IMG = path.join(ROOT, 'public/images/blog');
const MD_DIR = path.join(ROOT, 'src/content/blog');

function encodeBlogPath(publicPath) {
  if (!publicPath.startsWith('/images/blog/')) return publicPath;
  const prefix = '/images/blog/';
  const rest = publicPath.slice(prefix.length);
  return prefix + rest.split('/').map((seg) => encodeURIComponent(seg)).join('/');
}

function pathToFilename(publicPath) {
  const prefix = '/images/blog/';
  if (!publicPath.startsWith(prefix)) return null;
  const rel = publicPath.slice(prefix.length);
  try {
    return decodeURIComponent(rel);
  } catch {
    return rel;
  }
}

function listFiles(dir) {
  const out = new Set();
  for (const f of fs.readdirSync(dir)) {
    if (f.startsWith('.')) continue;
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      for (const sub of fs.readdirSync(full)) {
        if (!sub.startsWith('.')) out.add(`${f}/${sub}`);
      }
    } else {
      out.add(f);
    }
  }
  return out;
}

function collectRefs() {
  const refs = new Map();
  for (const file of fs.readdirSync(MD_DIR).filter((f) => f.endsWith('.md'))) {
    const slug = file.replace(/\.md$/, '');
    const text = fs.readFileSync(path.join(MD_DIR, file), 'utf8');
    const paths = new Set();
    for (const m of text.matchAll(/\/images\/blog[^"'`\s]+/g)) {
      let p = m[0].replace(/[),.;]+$/, '');
      try {
        p = decodeURIComponent(p);
      } catch {
        /* keep raw */
      }
      paths.add(p);
    }
    for (const key of ['headerImage', 'ogImage', 'image']) {
      const re = new RegExp(`^${key}:\\s*(\\S+)`, 'm');
      const m = text.match(re);
      if (m?.[1]?.startsWith('/images/blog')) {
        const decoded = pathToFilename(m[1]) ?? m[1];
        paths.add(`/images/blog/${decoded}`);
      }
    }
    refs.set(slug, [...paths]);
  }
  return refs;
}

const files = new Set(listFiles(BLOG_IMG));
const refs = collectRefs();
const used = new Set();
for (const paths of refs.values()) {
  for (const p of paths) {
    const name = pathToFilename(p);
    if (name) used.add(name);
  }
}

const unmapped = [...files].filter((f) => !used.has(f)).sort();
const missing = [];
for (const [slug, paths] of refs) {
  for (const p of paths) {
    const name = pathToFilename(p);
    if (name && !files.has(name)) missing.push({ slug, path: p });
  }
}

console.log(`Blog images on disk: ${files.size}`);
console.log(`Referenced paths: ${used.size}`);
console.log(`Unmapped files: ${unmapped.length}`);
console.log(`Broken refs: ${missing.length}\n`);

if (unmapped.length) {
  console.log('--- Unmapped files (sample) ---');
  unmapped.slice(0, 40).forEach((f) => console.log(`  ${f}`));
  if (unmapped.length > 40) console.log(`  ... +${unmapped.length - 40} more`);
}

if (missing.length) {
  console.log('\n--- Broken references ---');
  missing.forEach(({ slug, path: p }) => console.log(`  ${slug}: ${p}`));
}

const check = process.argv.includes('--check');
if (check && missing.length > 0) process.exit(1);

export { encodeBlogPath, listFiles, collectRefs };

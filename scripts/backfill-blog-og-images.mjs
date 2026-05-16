#!/usr/bin/env node
/**
 * Adds headerImage + ogImage to engineering posts that lack them.
 * Culture/History posts use scripts/download-blog-heroes.mjs + sync-blog-image-frontmatter.mjs instead.
 */
import { readFile, writeFile, readdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BLOG = path.join(ROOT, 'src/content/blog');
const IMG_DIR = path.join(ROOT, 'public/images/blog');
const DEFAULT =
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200';
const SKIP_CATEGORIES = new Set(['Culture', 'History']);

const files = await readdir(BLOG);
let n = 0;
for (const name of files) {
  if (!name.endsWith('.md')) continue;
  const file = path.join(BLOG, name);
  let raw = await readFile(file, 'utf8');
  if (/ogImage:|headerImage:/.test(raw.split('---')[1] ?? '')) continue;
  const catMatch = raw.match(/^categories:\s*(.+)$/m);
  const cats = catMatch ? catMatch[1] : '';
  if ([...SKIP_CATEGORIES].some((c) => cats.includes(c))) continue;
  if (!/Engineering|Product|AI|Cloud|Career/.test(cats)) continue;
  const slug = name.replace(/\.md$/, '');
  let ogPath = DEFAULT;
  for (const ext of ['webp', 'jpg']) {
    const disk = path.join(IMG_DIR, `${slug}.${ext}`);
    try {
      await access(disk, constants.F_OK);
      ogPath = `/images/blog/${slug}.${ext}`;
      break;
    } catch {
      // try next ext
    }
  }
  raw = raw.replace(/^---\r?\n/, `---\nogImage: ${ogPath}\nheaderImage: ${ogPath}\n`);
  await writeFile(file, raw);
  n++;
  console.log('og:', slug);
}
console.log('updated', n);

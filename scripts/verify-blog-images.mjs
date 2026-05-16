#!/usr/bin/env node
/**
 * Audit blog markdown image paths against public/images/blog.
 * Run: node scripts/verify-blog-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = path.join(root, 'src/content/blog');
const imgRoot = path.join(root, 'public/images/blog');

const allFiles = fs.readdirSync(imgRoot, { recursive: true }).map((rel) => {
  const full = path.join(imgRoot, rel);
  if (!fs.statSync(full).isFile()) return null;
  return rel.split(path.sep).join('/');
}).filter(Boolean);

const allSet = new Set(allFiles);
const allLower = new Map(allFiles.map((f) => [f.toLowerCase(), f]));

function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
const normMap = new Map();
for (const f of allFiles) normMap.set(norm(f), f);

function resolveRef(ref) {
  if (!ref || /^https?:/i.test(ref)) return { ok: true, ref };
  const rel = ref.replace(/^\/images\/blog\//, '');
  let decoded;
  try {
    decoded = decodeURIComponent(rel);
  } catch {
    decoded = rel;
  }
  if (allSet.has(decoded)) return { ok: true, file: decoded };
  if (allLower.has(decoded.toLowerCase())) {
    return { ok: true, file: allLower.get(decoded.toLowerCase()), note: 'case' };
  }
  const n = norm(decoded);
  if (normMap.has(n)) return { ok: true, file: normMap.get(n), note: 'fuzzy' };
  return { ok: false, ref, decoded };
}

function collectPaths(raw) {
  const paths = new Set();
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  for (const line of fm.split(/\r?\n/)) {
    const m = line.match(/^(ogImage|headerImage|image):\s*(.+)/);
    if (m) paths.add(m[2].trim());
  }
  for (const m of raw.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    paths.add(m[1].trim().split(/\s/)[0]);
  }
  for (const m of raw.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    paths.add(m[1].trim());
  }
  for (const m of raw.matchAll(/(\/images\/blog\/[^\s"'<>]+?\.(?:webp|jpg|jpeg|png|gif|svg|avif))/gi)) {
    paths.add(m[1]);
  }
  return [...paths];
}

const posts = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));
const broken = [];

for (const file of posts) {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf8');
  const slug = file.replace(/\.md$/, '');
  for (const ref of collectPaths(raw)) {
    if (!ref.startsWith('/images/')) continue;
    const r = resolveRef(ref);
    if (!r.ok) broken.push({ slug, ref, decoded: r.decoded });
  }
}

console.log(`Posts: ${posts.length}`);
console.log(`Image files under public/images/blog: ${allFiles.length}`);
console.log(`Broken references: ${broken.length}`);
if (broken.length) {
  for (const b of broken) {
    console.log(`- ${b.slug}: ${b.ref} (${b.decoded})`);
  }
  process.exit(1);
}
console.log('All /images/blog references resolve to files on disk.');

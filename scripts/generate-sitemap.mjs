/**
 * Runs after `vite build`. Writes dist/sitemap.xml from static routes + every blog slug.
 * New markdown files under src/content/blog/ are picked up automatically on the next build.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import { SitemapStream } from 'sitemap';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const blogDir = path.join(root, 'src/content/blog');

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://www.ayabonga.com').replace(
  /\/$/,
  '',
);

function parseFrontmatterDate(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return undefined;
  const dateLine = m[1].split(/\r?\n/).find((line) => /^date:\s*/i.test(line));
  if (!dateLine) return undefined;
  let v = dateLine.replace(/^date:\s*/i, '').trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1);
  }
  const t = Date.parse(v);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toISOString().split('T')[0];
}

function collectBlogEntries() {
  if (!fs.existsSync(blogDir)) return [];
  const entries = [];
  for (const name of fs.readdirSync(blogDir)) {
    if (!name.endsWith('.md')) continue;
    const slug = name.replace(/\.md$/i, '');
    const raw = fs.readFileSync(path.join(blogDir, name), 'utf8');
    const lastmod = parseFrontmatterDate(raw);
    entries.push({ slug, lastmod });
  }
  return entries.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function main() {
  if (!fs.existsSync(distDir)) {
    console.error('generate-sitemap: dist/ not found. Run vite build first.');
    process.exit(1);
  }

  const blogEntries = collectBlogEntries();

  const links = [
    { url: '/', changefreq: 'weekly', priority: 1 },
    { url: '/blog', changefreq: 'weekly', priority: 0.9 },
    ...blogEntries.map(({ slug, lastmod }) => ({
      url: `/blog/${slug}`,
      changefreq: 'monthly',
      priority: 0.8,
      lastmod,
    })),
  ];

  const outPath = path.join(distDir, 'sitemap.xml');
  const sm = new SitemapStream({ hostname: SITE_URL });
  const write = createWriteStream(outPath);

  await pipeline(Readable.from(links), sm, write);

  console.log(`generate-sitemap: wrote ${links.length} URLs to ${outPath} (${SITE_URL})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

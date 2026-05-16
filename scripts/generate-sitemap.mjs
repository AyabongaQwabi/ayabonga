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
const pseoDataPath = path.join(root, 'src/data/pseo-pages.json');
const comparisonsDataPath = path.join(root, 'src/data/comparisons.json');
const localDevelopersPath = path.join(root, 'src/data/local-developers.json');
const buyerIntentPath = path.join(root, 'src/data/buyer-intent-pages.ts');


const isBusinessSite = process.env.VITE_SITE_VARIANT === 'business';

const SITE_URL = (
  process.env.SITE_URL ||
  process.env.VITE_SITE_URL ||
  (isBusinessSite ? 'https://business.qwabi.co.za' : 'https://www.qwabi.co.za')
).replace(/\/$/, '');

function writeRobotsTxt() {
  const lines = [
    'User-agent: *',
    'Allow: /',
    ...(isBusinessSite ? ['Disallow: /blog'] : []),
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ];
  fs.writeFileSync(path.join(distDir, 'robots.txt'), lines.join('\n'), 'utf8');
}

function parseFrontmatterDate(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return undefined;
  const dateLine = m[1].split(/\r?\n/).find((line) => /^date:\s*/i.test(line));
  if (!dateLine) return undefined;
  let v = dateLine.replace(/^date:\s*/i, '').trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
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

  const blogEntries = isBusinessSite ? [] : collectBlogEntries();
  
  let pseoEntries = [];
  try {
    pseoEntries = JSON.parse(fs.readFileSync(pseoDataPath, 'utf8'));
  } catch (e) {
    console.warn('generate-sitemap: could not read pseo-pages.json');
  }

  let comparisonEntries = [];
  try {
    comparisonEntries = JSON.parse(fs.readFileSync(comparisonsDataPath, 'utf8'));
  } catch (e) {
    console.warn('generate-sitemap: could not read comparisons.json');
  }

  let localDev = { cities: [], roles: {} };
  try {
    localDev = JSON.parse(fs.readFileSync(localDevelopersPath, 'utf8'));
  } catch (e) {
    console.warn('generate-sitemap: could not read local-developers.json');
  }

  const ecCities = (localDev.cities || []).filter((c) => c.region === 'eastern-cape');
  const roleSlugs = Object.keys(localDev.roles || {});
  const localPageLinks = ecCities.flatMap((city) =>
    roleSlugs.map((role) => ({
      url: `/developers/eastern-cape/${city.slug}/${role}`,
      changefreq: 'monthly',
      priority: 0.8,
    })),
  );

  let buyerIntentPaths = [];
  try {
    const raw = fs.readFileSync(buyerIntentPath, 'utf8');
    const matches = [...raw.matchAll(/path:\s*'(\/[^']+)'/g)];
    buyerIntentPaths = matches.map((m) => m[1]);
  } catch {
    console.warn('generate-sitemap: could not read buyer-intent-pages.ts');
  }

  const links = [
    { url: '/', changefreq: 'weekly', priority: 1 },
    { url: '/services', changefreq: 'monthly', priority: 0.9 },
    { url: '/technical-cofounder', changefreq: 'monthly', priority: 0.95 },
    { url: '/developers/eastern-cape', changefreq: 'weekly', priority: 0.92 },
    { url: '/developers/south-africa', changefreq: 'weekly', priority: 0.9 },
    ...localPageLinks,
    { url: '/about', changefreq: 'monthly', priority: 0.9 },
    { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { url: '/editorial', changefreq: 'yearly', priority: 0.35 },
    { url: '/corrections', changefreq: 'yearly', priority: 0.3 },
    { url: '/get-a-quote', changefreq: 'monthly', priority: 0.85 },
    ...buyerIntentPaths.map((url) => ({
      url,
      changefreq: 'monthly',
      priority: url.includes('cost') ? 0.95 : 0.9,
    })),
    { url: '/projects/espazza', changefreq: 'monthly', priority: 0.75 },
    ...(isBusinessSite
      ? []
      : [
          { url: '/blog', changefreq: 'weekly', priority: 0.9 },
          ...blogEntries.map(({ slug, lastmod }) => ({
            url: `/blog/${slug}`,
            changefreq: 'monthly',
            priority: 0.8,
            lastmod,
          })),
        ]),
    ...pseoEntries.map((p) => ({
      url: `/solutions/${p.slug}`,
      changefreq: 'monthly',
      priority: 0.85,
    })),
    ...comparisonEntries.map((c) => ({
      url: `/vs/${c.slug}`,
      changefreq: 'monthly',
      priority: 0.7,
    })),
  ];

  const outPath = path.join(distDir, 'sitemap.xml');
  const sm = new SitemapStream({ hostname: SITE_URL });
  const write = createWriteStream(outPath);

  await pipeline(Readable.from(links), sm, write);
  writeRobotsTxt();

  console.log(
    `generate-sitemap: wrote ${links.length} URLs to ${outPath} (${SITE_URL})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

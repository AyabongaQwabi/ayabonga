/**
 * Runs after `vite build`. Writes dist/sitemap.xml from collect-indexable-routes.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import { SitemapStream } from 'sitemap';
import { collectSitemapLinks, getSiteUrl } from './collect-indexable-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');

function writeRobotsTxt(siteUrl) {
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ];
  fs.writeFileSync(path.join(distDir, 'robots.txt'), lines.join('\n'), 'utf8');
}

async function main() {
  if (!fs.existsSync(distDir)) {
    console.error('generate-sitemap: dist/ not found. Run vite build first.');
    process.exit(1);
  }

  const siteUrl = getSiteUrl();
  const links = collectSitemapLinks();
  const outPath = path.join(distDir, 'sitemap.xml');
  const sm = new SitemapStream({ hostname: siteUrl });
  const write = createWriteStream(outPath);

  await pipeline(Readable.from(links), sm, write);
  writeRobotsTxt(siteUrl);

  console.log(
    `generate-sitemap: wrote ${links.length} URLs to ${outPath} (${siteUrl})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

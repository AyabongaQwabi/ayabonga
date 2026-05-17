import path from 'node:path';
import sharp from 'sharp';
import { ensureDir } from '../utils/fs.js';

/** Composite OG card (1200x630) from hero + title text overlay via SVG. */
export async function buildOgCard(
  heroImagePath: string,
  title: string,
  outputPath: string,
): Promise<string> {
  await ensureDir(path.dirname(outputPath));
  const safeTitle = escapeXml(title.slice(0, 90));

  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a0a0a" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <text x="64" y="520" fill="#fafafa" font-family="system-ui, sans-serif" font-size="48" font-weight="700">${safeTitle}</text>
  <text x="64" y="570" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="22">qwabi.co.za</text>
  <rect width="1200" height="630" fill="url(#g)"/>
</svg>`;

  await sharp(heroImagePath)
    .resize(1200, 630, { fit: 'cover' })
    .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    .webp({ quality: 85 })
    .toFile(outputPath);

  return outputPath;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

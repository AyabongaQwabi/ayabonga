/**
 * Match IMAGE/DIAGRAM placeholder descriptions to local assets or Pexels ids.
 */
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileExists } from './blog-image-fetch.mjs';

/** Screenshot filename stems in content/blog/{slug}/screenshots/ */
export const SCREENSHOT_KEYWORDS = [
  { keywords: ['webflow'], file: 'webflow' },
  { keywords: ['wix'], file: 'wix' },
  { keywords: ['framer'], file: 'framer' },
  { keywords: ['bolt', 'bolt.new', 'ai coding tool'], file: 'bolt' },
  { keywords: ['v0', 'vercel v0'], file: 'vercel-v0' },
  { keywords: ['tailwind ui'], file: 'tailwind-ui' },
  { keywords: ['bubble'], file: 'bubble' },
  { keywords: ['vercel'], file: 'vercel' },
];

/** Ordered Pexels ids for IMAGE placeholders (dev / SaaS editorial) */
export const IMAGE_PEXELS_POOL = [
  3861969, 3184418, 4974915, 1181263, 546819, 7688336, 3183197, 3861949, 265072,
  196644, 11035471, 1092644, 3184296, 3184360, 4386321, 607812, 577210, 574071,
];

/** Ordered Pexels ids for DIAGRAM-style placeholders (architecture / abstract) */
export const DIAGRAM_PEXELS_POOL = [
  1181467, 325229, 577210, 574071, 3861969, 3184292, 7376, 1181244,
];

/**
 * Keyword → preferred Pexels photo id (checked before pools).
 * @type {Array<{ keywords: string[], id: number }>}
 */
export const KEYWORD_PEXELS = [
  { keywords: ['hero', 'editorial', 'workspace'], id: 3861969 },
  { keywords: ['webflow', 'designer interface', 'box model'], id: 6969945 },
  { keywords: ['website builder', 'layout panels', 'drag'], id: 3184292 },
  { keywords: ['low-code', 'workflow', 'database schema'], id: 3184465 },
  { keywords: ['wordpress', 'architecture'], id: 1181244 },
  { keywords: ['ai coding', 'prompt panel', 'generated react'], id: 3861949 },
  { keywords: ['marketplace', 'template previews'], id: 265072 },
  { keywords: ['tailwind', 'vs code', 'live preview'], id: 1181263 },
  { keywords: ['component documentation', 'button variants'], id: 4974915 },
  { keywords: ['framework logos', 'ssr', 'ssg', 'islands'], id: 546819 },
  { keywords: ['html', 'css', 'javascript', 'split editor'], id: 577210 },
  { keywords: ['architecture whiteboard', 'api layer'], id: 3183197 },
  { keywords: ['headless cms', 'content model'], id: 3184360 },
  { keywords: ['ecommerce', 'orders list', 'payment'], id: 4386321 },
  { keywords: ['comparison infographic', 'matrix'], id: 7688336 },
  { keywords: ['ci/cd', 'pipeline', 'git push', 'deploy'], id: 1181467 },
  { keywords: ['closing', 'laptop and phone', 'analytics'], id: 607812 },
  { keywords: ['flowchart', 'decision'], id: 3184296 },
  { keywords: ['jamstack', 'cdn', 'serverless'], id: 325229 },
  { keywords: ['checkout', 'cart', 'payment provider'], id: 196644 },
  { keywords: ['content flow', 'cms api', 'static build'], id: 574071 },
  { keywords: ['rendering model', 'csr', 'ssr'], id: 11035471 },
  { keywords: ['browser parsing', 'cssom', 'render tree'], id: 1092638 },
  { keywords: ['no-code', 'low-code', 'spectrum'], id: 3182814 },
];

/**
 * @param {string} description
 * @returns {number | undefined}
 */
export function pickPexelsId(description, kind, index) {
  const lower = description.toLowerCase();
  for (const rule of KEYWORD_PEXELS) {
    if (rule.keywords.some((k) => lower.includes(k))) {
      return rule.id;
    }
  }
  const pool = kind === 'DIAGRAM' ? DIAGRAM_PEXELS_POOL : IMAGE_PEXELS_POOL;
  return pool[index % pool.length];
}

/**
 * @param {string} description
 * @returns {string | undefined} screenshot stem e.g. webflow
 */
export function detectScreenshotStem(description) {
  const lower = description.toLowerCase();
  for (const { keywords, file } of SCREENSHOT_KEYWORDS) {
    if (keywords.some((k) => lower.includes(k))) {
      return file;
    }
  }
  return undefined;
}

/**
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function listImageFiles(dir) {
  try {
    const names = await readdir(dir);
    return names.filter((n) => /\.(webp|png|jpe?g|svg)$/i.test(n));
  } catch {
    return [];
  }
}

/**
 * Resolve local file under article package.
 * @returns {Promise<{ absPath: string, markdownPath: string } | undefined>}
 */
export async function findLocalAsset(articleDir, kind, description, index) {
  const screenshotsDir = path.join(articleDir, 'screenshots');
  const imagesDir = path.join(articleDir, 'images');
  const diagramsDir = path.join(articleDir, 'diagrams');

  if (index === 0) {
    for (const name of ['hero.webp', 'hero.png', 'hero.jpg']) {
      const p = path.join(articleDir, name);
      if (await fileExists(p)) {
        return { absPath: p, markdownPath: `./${name}` };
      }
    }
  }

  const stem = detectScreenshotStem(description);
  if (stem) {
    for (const ext of ['.webp', '.png', '.jpg']) {
      const p = path.join(screenshotsDir, `${stem}${ext}`);
      if (await fileExists(p)) {
        return { absPath: p, markdownPath: `./screenshots/${stem}${ext}` };
      }
    }
  }

  if (kind === 'DIAGRAM') {
    const diagrams = await listImageFiles(diagramsDir);
    const svg = diagrams.filter((f) => f.endsWith('.svg'));
    const raster = diagrams.filter((f) => /\.(webp|png|jpe?g)$/i.test(f));
    const pick = svg[index % Math.max(svg.length, 1)] ?? raster[index % Math.max(raster.length, 1)];
    if (pick) {
      return {
        absPath: path.join(diagramsDir, pick),
        markdownPath: `./diagrams/${pick}`,
      };
    }
  }

  const images = (await listImageFiles(imagesDir)).sort();
  const indexed = images.find((f) => f.startsWith(String(index).padStart(2, '0')));
  if (indexed) {
    return { absPath: path.join(imagesDir, indexed), markdownPath: `./images/${indexed}` };
  }

  return undefined;
}

export function slugifyFilename(description, max = 48) {
  return description
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max);
}

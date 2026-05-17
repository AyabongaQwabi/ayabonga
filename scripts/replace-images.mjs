#!/usr/bin/env node
/**
 * Replace ![IMAGE: desc](AUTO_IMAGE_PLACEHOLDER) and ![DIAGRAM: desc](AUTO_IMAGE_PLACEHOLDER)
 * with local assets from the slug folder, or fetch stock images (--fetch).
 *
 * Usage:
 *   node scripts/replace-images.mjs --slug different-ways-to-build-a-website-in-2026 --fetch
 *   node scripts/replace-images.mjs --slug my-post --fetch --sync-public
 *   node scripts/replace-images.mjs --file content/blog/my-post/article.md --dry-run
 */
import { readFile, writeFile, access, mkdir, copyFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchPexelsToWebp, fileExists } from './blog-image-fetch.mjs';
import {
  findLocalAsset,
  pickPexelsId,
  detectScreenshotStem,
  slugifyFilename,
} from './blog-image-matcher.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const CONTENT_BLOG = path.join(REPO_ROOT, 'content/blog');
const PUBLIC_BLOG = path.join(REPO_ROOT, 'public/images/blog');

const PLACEHOLDER = 'AUTO_IMAGE_PLACEHOLDER';
const IMAGE_PATTERN = new RegExp(
  `!\\[(IMAGE|DIAGRAM): ([^\\]]+)\\]\\(${PLACEHOLDER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`,
  'g',
);
/** Resolved markdown images: ![alt](./images|screenshots|diagrams/...) */
const RESOLVED_IMAGE_PATTERN = /!\[([^\]]+)\]\((\.\/(?:images|screenshots|diagrams)\/[^)]+)\)/g;

function parseArgs(argv) {
  const args = {
    slug: null,
    file: null,
    dryRun: false,
    fetch: false,
    syncPublic: false,
    capture: false,
    refreshScreenshots: false,
    targets: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug' && argv[i + 1]) args.slug = argv[++i];
    else if (a === '--file' && argv[i + 1]) args.file = argv[++i];
    else if (a === '--targets' && argv[i + 1]) args.targets = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--fetch') args.fetch = true;
    else if (a === '--sync-public') args.syncPublic = true;
    else if (a === '--capture') args.capture = true;
    else if (a === '--refresh-screenshots') args.refreshScreenshots = true;
    else if (a === '--help' || a === '-h') {
      console.log(`Usage:
  node scripts/replace-images.mjs --slug <slug> [--fetch] [--sync-public] [--capture]
  node scripts/replace-images.mjs --slug <slug> --capture --refresh-screenshots --sync-public
  node scripts/replace-images.mjs --file <path> [--fetch]

  --fetch                 Download missing images from Pexels (same pattern as download-marketing-images.mjs)
  --sync-public           Copy resolved assets to public/images/blog/<slug>/
  --capture               Run Playwright screenshots (tsx blog-pipeline capture-screenshots)
  --refresh-screenshots   Swap existing markdown image paths when matching screenshots/ exist
  --targets webflow,bolt  Comma-separated capture ids (with --capture, when no placeholders remain)
  --dry-run               Report without writing`);
      process.exit(0);
    }
  }
  return args;
}

async function resolveArticlePath(slug) {
  for (const name of ['article.md', 'article.mdx']) {
    const p = path.join(CONTENT_BLOG, slug, name);
    try {
      await access(p, constants.F_OK);
      return p;
    } catch {
      // continue
    }
  }
  throw new Error(`No article.md(x) for slug: ${slug}`);
}

/**
 * @typedef {{ kind: string, description: string, index: number }} PlaceholderEntry
 */

/**
 * @param {string} markdown
 * @returns {PlaceholderEntry[]}
 */
export function parseImagePlaceholders(markdown) {
  const entries = [];
  let index = 0;
  let m;
  const re = new RegExp(IMAGE_PATTERN.source, IMAGE_PATTERN.flags);
  while ((m = re.exec(markdown)) !== null) {
    entries.push({ kind: m[1], description: m[2].trim(), index: index++ });
  }
  return entries;
}

/**
 * @param {PlaceholderEntry[]} entries
 * @returns {string[]}
 */
function screenshotTargetsFromEntries(entries) {
  const stems = new Set();
  for (const e of entries) {
    const stem = detectScreenshotStem(e.description);
    if (stem) stems.add(stem);
  }
  return [...stems];
}

async function runCaptureScreenshots(slug, targets) {
  if (!targets.length) return;
  const { spawn } = await import('node:child_process');
  await new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      [
        'tsx',
        'scripts/blog-pipeline/src/cli.ts',
        'capture-screenshots',
        '--slug',
        slug,
        '--targets',
        targets.join(','),
      ],
      { cwd: REPO_ROOT, stdio: 'inherit' },
    );
    child.on('close', (code) => {
      if (code !== 0) {
        console.warn(`capture-screenshots exited with code ${code} (continuing if screenshots exist)`);
      }
      resolve();
    });
  });
}

/**
 * @param {string} articleDir
 * @param {PlaceholderEntry} entry
 * @param {boolean} allowFetch
 */
async function resolveAssetForPlaceholder(articleDir, entry, allowFetch) {
  const local = await findLocalAsset(
    articleDir,
    entry.kind,
    entry.description,
    entry.index,
  );
  if (local) return local;

  if (!allowFetch) return undefined;

  const imagesDir = path.join(articleDir, 'images');
  await mkdir(imagesDir, { recursive: true });
  const baseName = `${String(entry.index).padStart(2, '0')}-${slugifyFilename(entry.description)}`;
  const photoId = pickPexelsId(entry.description, entry.kind, entry.index);
  const webpPath = await fetchPexelsToWebp(photoId, imagesDir, baseName);

  return {
    absPath: webpPath,
    markdownPath: `./images/${path.basename(webpPath)}`,
  };
}

/**
 * @param {string} markdown
 * @param {string} articleDir
 * @param {{ fetch?: boolean }} options
 */
export async function replaceImagePlaceholders(markdown, articleDir, options = {}) {
  const entries = parseImagePlaceholders(markdown);
  const resolved = [];
  const unresolved = [];

  for (const entry of entries) {
    const asset = await resolveAssetForPlaceholder(articleDir, entry, options.fetch);
    if (asset) {
      resolved.push({ entry, asset });
    } else {
      unresolved.push(entry);
    }
  }

  let index = 0;
  let output = markdown.replace(IMAGE_PATTERN, (full, kind, description) => {
    const entry = entries[index++];
    const match = resolved.find((r) => r.entry.index === entry.index);
    if (!match) return full;
    const alt = description.trim();
    return `![${alt}](${match.asset.markdownPath})`;
  });

  return { output, entries, resolved, unresolved };
}

async function syncToPublic(slug, resolved) {
  const publicDir = path.join(PUBLIC_BLOG, slug);
  await mkdir(publicDir, { recursive: true });
  await mkdir(path.join(publicDir, 'images'), { recursive: true });
  await mkdir(path.join(publicDir, 'screenshots'), { recursive: true });
  await mkdir(path.join(publicDir, 'diagrams'), { recursive: true });

  for (const { asset } of resolved) {
    const rel = asset.markdownPath.replace(/^\.\//, '');
    const src = asset.absPath;
    const dest = path.join(publicDir, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(src, dest);
  }
}

/**
 * Collect screenshot stems from manifest or resolved markdown image alts.
 * @param {string} source
 * @param {string} articleDir
 * @returns {Promise<string[]>}
 */
async function screenshotTargetsFromArticle(source, articleDir) {
  const stems = new Set();
  const manifestPath = path.join(articleDir, 'image-manifest.json');
  try {
    const raw = await readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);
    for (const asset of manifest.assets ?? []) {
      const stem = detectScreenshotStem(asset.description ?? '');
      if (stem) stems.add(stem);
    }
  } catch {
    // no manifest
  }
  let m;
  const re = new RegExp(RESOLVED_IMAGE_PATTERN.source, RESOLVED_IMAGE_PATTERN.flags);
  while ((m = re.exec(source)) !== null) {
    const stem = detectScreenshotStem(m[1]);
    if (stem) stems.add(stem);
  }
  return [...stems];
}

/**
 * Replace stock image paths with ./screenshots/{stem}.webp when captures exist.
 * @returns {Promise<{ output: string, refreshed: Array<{ alt: string, from: string, to: string, absPath: string }> }>}
 */
export async function refreshScreenshotPaths(source, articleDir) {
  const refreshed = [];
  const replacements = [];

  let m;
  const re = new RegExp(RESOLVED_IMAGE_PATTERN.source, RESOLVED_IMAGE_PATTERN.flags);
  while ((m = re.exec(source)) !== null) {
    const alt = m[1];
    const oldPath = m[2];
    const stem = detectScreenshotStem(alt);
    if (!stem) continue;

    const shot = await findLocalAsset(articleDir, 'IMAGE', alt, 0);
    if (!shot || !shot.markdownPath.startsWith('./screenshots/')) continue;
    if (shot.markdownPath === oldPath) continue;

    replacements.push({ alt, oldPath, newPath: shot.markdownPath, absPath: shot.absPath });
  }

  let output = source;
  for (const { alt, oldPath, newPath, absPath } of replacements) {
    const escaped = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const before = output;
    output = output.replace(
      new RegExp(`!\\[${alt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]\\(${escaped}\\)`),
      `![${alt}](${newPath})`,
    );
    if (output !== before) {
      refreshed.push({ alt, from: oldPath, to: newPath, absPath });
    }
  }

  return { output, refreshed };
}

async function writeManifest(articleDir, slug, resolved, unresolved) {
  const manifest = {
    slug,
    generatedAt: new Date().toISOString(),
    assets: resolved.map(({ entry, asset }) => ({
      index: entry.index,
      kind: entry.kind,
      description: entry.description,
      path: asset.markdownPath,
      absPath: asset.absPath,
    })),
    unresolved: unresolved.map((e) => ({
      index: e.index,
      kind: e.kind,
      description: e.description,
    })),
  };
  const manifestPath = path.join(articleDir, 'image-manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return manifestPath;
}

async function updateManifestPaths(articleDir, slug, refreshed) {
  const manifestPath = path.join(articleDir, 'image-manifest.json');
  try {
    const raw = await readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(raw);
    for (const item of refreshed) {
      for (const asset of manifest.assets ?? []) {
        if (asset.description === item.alt || item.from === asset.path) {
          asset.path = item.to;
          asset.absPath = item.absPath;
        }
      }
    }
    manifest.generatedAt = new Date().toISOString();
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    return manifestPath;
  } catch {
    return null;
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.slug && !args.file) {
    console.error('Provide --slug <slug> or --file <path>');
    process.exit(1);
  }

  const filePath = args.file
    ? path.resolve(REPO_ROOT, args.file)
    : await resolveArticlePath(args.slug);

  const slug = args.slug ?? path.basename(path.dirname(filePath));
  const articleDir = path.dirname(filePath);
  let source = await readFile(filePath, 'utf8');

  const placeholders = parseImagePlaceholders(source);
  const refreshOnly =
    args.refreshScreenshots || (placeholders.length === 0 && args.capture);

  if (placeholders.length === 0 && !refreshOnly) {
    console.log('No AUTO_IMAGE_PLACEHOLDER entries found. Use --capture --refresh-screenshots to swap in Playwright shots.');
    process.exit(0);
  }

  if (args.capture) {
    const targets = args.targets
      ? args.targets.split(',').map((s) => s.trim()).filter(Boolean)
      : placeholders.length
        ? screenshotTargetsFromEntries(placeholders)
        : await screenshotTargetsFromArticle(source, articleDir);
    console.log(`Capturing screenshots: ${targets.join(', ') || '(none detected)'}`);
    if (targets.length) {
      await runCaptureScreenshots(slug, targets);
    }
  }

  if (refreshOnly) {
    const { output, refreshed } = await refreshScreenshotPaths(source, articleDir);
    console.log(`File: ${filePath}`);
    console.log(`Screenshot paths refreshed: ${refreshed.length}`);
    for (const r of refreshed) {
      console.log(`  ${r.from} → ${r.to}`);
    }

    if (args.dryRun) {
      console.log('\nDry run: no files written.');
      process.exit(0);
    }

    if (refreshed.length === 0) {
      console.log('No screenshot swaps applied (capture targets may not match image alt text).');
      process.exit(args.capture ? 0 : 1);
    }

    await writeFile(filePath, output, 'utf8');
    const manifestPath = await updateManifestPaths(articleDir, slug, refreshed);
    if (manifestPath) console.log(`Manifest: ${manifestPath}`);

    if (args.syncPublic) {
      const forSync = refreshed.map((r) => ({
        asset: { markdownPath: r.to, absPath: r.absPath },
      }));
      await syncToPublic(slug, forSync);
      console.log(`Synced assets to public/images/blog/${slug}/`);
    }

    console.log('Updated.');
    process.exit(0);
  }

  const { output, resolved, unresolved } = await replaceImagePlaceholders(
    source,
    articleDir,
    { fetch: args.fetch },
  );

  console.log(`File: ${filePath}`);
  console.log(`Placeholders: ${placeholders.length}`);
  console.log(`Resolved: ${resolved.length}`);
  console.log(`Unresolved: ${unresolved.length}`);

  if (unresolved.length) {
    console.log('\nUnresolved (run with --fetch or add files under screenshots/, images/, diagrams/):');
    for (const u of unresolved) {
      console.log(`  [${u.index}] ${u.kind}: ${u.description.slice(0, 70)}…`);
    }
  }

  if (args.dryRun) {
    console.log('\nDry run: no files written.');
    process.exit(unresolved.length > 0 ? 1 : 0);
  }

  if (resolved.length === 0) {
    console.log('Nothing to replace.');
    process.exit(1);
  }

  let finalOutput = output;
  if (args.capture) {
    const targets = screenshotTargetsFromEntries(placeholders);
    if (targets.length) await runCaptureScreenshots(slug, targets);
    const refresh = await refreshScreenshotPaths(finalOutput, articleDir);
    finalOutput = refresh.output;
    if (refresh.refreshed.length) {
      console.log(`Screenshot paths refreshed: ${refresh.refreshed.length}`);
    }
  }

  await writeFile(filePath, finalOutput, 'utf8');
  const manifestPath = await writeManifest(articleDir, slug, resolved, unresolved);
  console.log(`Manifest: ${manifestPath}`);

  if (args.syncPublic) {
    const refresh = await refreshScreenshotPaths(finalOutput, articleDir);
    const syncItems = [
      ...resolved,
      ...refresh.refreshed.map((r) => ({
        asset: { markdownPath: r.to, absPath: r.absPath },
      })),
    ];
    await syncToPublic(slug, syncItems);
    console.log(`Synced assets to public/images/blog/${slug}/`);
  }

  const remaining = (finalOutput.match(/AUTO_IMAGE_PLACEHOLDER/g) ?? []).length;
  if (remaining > 0) {
    console.log(`Warning: ${remaining} placeholders remain.`);
    process.exit(1);
  }

  console.log('Updated.');
  process.exit(unresolved.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

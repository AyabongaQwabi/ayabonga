#!/usr/bin/env node
/**
 * Replace [Label](AUTO_LINK_PLACEHOLDER) with official URLs from blog-link-registry.mjs
 *
 * Usage:
 *   node scripts/replace-links.mjs --slug different-ways-to-build-a-website-in-2026
 *   node scripts/replace-links.mjs --file content/blog/my-post/article.md
 *   node scripts/replace-links.mjs --slug my-post --dry-run
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveLinkUrl } from './blog-link-registry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const CONTENT_BLOG = path.join(REPO_ROOT, 'content/blog');

const PLACEHOLDER = 'AUTO_LINK_PLACEHOLDER';
const LINK_PATTERN = new RegExp(
  `\\[([^\\]]+)\\]\\(${PLACEHOLDER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`,
  'g',
);

function parseArgs(argv) {
  const args = { slug: null, file: null, dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--slug' && argv[i + 1]) {
      args.slug = argv[++i];
    } else if (a === '--file' && argv[i + 1]) {
      args.file = argv[++i];
    } else if (a === '--dry-run') {
      args.dryRun = true;
    } else if (a === '--help' || a === '-h') {
      console.log(`Usage:
  node scripts/replace-links.mjs --slug <slug>
  node scripts/replace-links.mjs --file <path>
  --dry-run   Report changes without writing`);
      process.exit(0);
    }
  }
  return args;
}

async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveArticlePath(slug) {
  const candidates = [
    path.join(CONTENT_BLOG, slug, 'article.md'),
    path.join(CONTENT_BLOG, slug, 'article.mdx'),
  ];
  for (const p of candidates) {
    if (await fileExists(p)) return p;
  }
  throw new Error(`No article.md or article.mdx found for slug: ${slug}`);
}

/**
 * @param {string} markdown
 * @returns {{ output: string, replaced: number, unresolved: Map<string, number> }}
 */
export function replaceLinkPlaceholders(markdown) {
  const unresolved = new Map();
  let replaced = 0;

  const output = markdown.replace(LINK_PATTERN, (full, label) => {
    const url = resolveLinkUrl(label);
    if (!url) {
      unresolved.set(label, (unresolved.get(label) ?? 0) + 1);
      return full;
    }
    replaced += 1;
    return `[${label}](${url})`;
  });

  return { output, replaced, unresolved };
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

  const source = await readFile(filePath, 'utf8');
  const { output, replaced, unresolved } = replaceLinkPlaceholders(source);

  if (process.env.NODE_ENV === 'development') {
    console.log('[replace-links]', { filePath, replaced, unresolved: unresolved.size });
  }

  console.log(`File: ${filePath}`);
  console.log(`Replaced: ${replaced} link(s)`);

  if (unresolved.size > 0) {
    console.log('\nUnresolved labels (add to scripts/blog-link-registry.mjs):');
    for (const [label, count] of [...unresolved.entries()].sort((a, b) =>
      a[0].localeCompare(b[0]),
    )) {
      console.log(`  - ${label} (${count}x)`);
    }
  }

  const remaining = (output.match(/AUTO_LINK_PLACEHOLDER/g) ?? []).length;
  if (remaining > 0) {
    console.log(`\nWarning: ${remaining} AUTO_LINK_PLACEHOLDER still in file.`);
  }

  if (args.dryRun) {
    console.log('\nDry run: no file written.');
    process.exit(unresolved.size > 0 ? 1 : 0);
  }

  if (replaced === 0 && unresolved.size === 0) {
    console.log('Nothing to replace.');
    process.exit(0);
  }

  await writeFile(filePath, output, 'utf8');
  console.log('Updated.');

  process.exit(unresolved.size > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

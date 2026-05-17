import path from 'node:path';
import { getArticlePaths, CONTENT_BLOG_ROOT } from '../config.js';
import { ensureDir, writeJson } from '../utils/fs.js';
import type { ArticleMetadata } from '../types.js';

export async function scaffoldArticle(slug: string, metadata?: Partial<ArticleMetadata>): Promise<void> {
  const paths = getArticlePaths(slug);
  await ensureDir(paths.articleDir);
  await ensureDir(paths.imagesDir);
  await ensureDir(paths.diagramsDir);
  await ensureDir(paths.screenshotsDir);

  const meta: ArticleMetadata = {
    title: metadata?.title ?? 'Untitled Article',
    slug,
    excerpt: metadata?.excerpt ?? '',
    tags: metadata?.tags ?? ['Web Development'],
    categories: metadata?.categories ?? ['Engineering'],
    date: metadata?.date ?? new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    readTime: metadata?.readTime ?? '8 min read',
    seoDescription: metadata?.seoDescription ?? '',
    ogTitle: metadata?.ogTitle ?? metadata?.title ?? 'Untitled Article',
    ogDescription: metadata?.ogDescription ?? metadata?.excerpt ?? '',
    ...metadata,
  };

  await writeJson(paths.metadataPath, meta);

  const placeholderMdx = path.join(paths.articleDir, 'article.mdx');
  const { writeFile, access } = await import('node:fs/promises');
  try {
    await access(placeholderMdx);
  } catch {
    await writeFile(
      placeholderMdx,
      `import { HeroImage } from '@/components/blog/mdx'\n\n# ${meta.title}\n\n_Draft placeholder._\n`,
      'utf8',
    );
  }
}

export async function listArticleSlugs(): Promise<string[]> {
  const { readdir } = await import('node:fs/promises');
  try {
    const entries = await readdir(CONTENT_BLOG_ROOT, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

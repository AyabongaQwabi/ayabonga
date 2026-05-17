import path from 'node:path';
import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { getArticlePaths, PUBLIC_BLOG_IMAGES, SITE_BLOG_MD } from '../config.js';
import { readJson, readText, writeText, fileExists } from '../utils/fs.js';
import type { ArticleMetadata } from '../types.js';

function stripMarkdownFrontmatter(raw: string): string {
  const text = raw.replace(/^\uFEFF/, '');
  const match = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  return match ? match[1].trim() : text.trim();
}

function rewriteMarkdownAssetPaths(body: string, slug: string): string {
  return body.replace(
    /!\[([^\]]*)\]\((\.\/(?:images|screenshots|diagrams)\/[^)]+)\)/g,
    (_full, alt: string, rel: string) => `![${alt}](${resolvePublicPath(slug, rel)})`,
  );
}

/** Flatten article package into src/content/blog/{slug}.md for the Vite site. */
export async function publishArticleToSite(slug: string): Promise<void> {
  const paths = getArticlePaths(slug);
  const meta = await readJson<ArticleMetadata & { structuredData?: unknown }>(
    paths.metadataPath,
  );

  const hasMdx = await fileExists(paths.mdxPath);
  const hasMarkdown = await fileExists(paths.markdownPath);
  if (!hasMdx && !hasMarkdown) {
    throw new Error(
      `No article source for "${slug}". Expected article.mdx or article.md in ${paths.articleDir}`,
    );
  }

  let body: string;
  if (hasMdx) {
    let mdx = await readText(paths.mdxPath);
    mdx = mdx
      .replace(/^import[\s\S]*?from\s+['"][^'"]+['"]\s*\n/gm, '')
      .replace(/<HeroImage[^>]*\/>\s*/g, '')
      .replace(/<ArticleImage([^>]*)\/>/g, (_, attrs: string) => {
        const src = attrs.match(/src="([^"]+)"/)?.[1];
        const alt = attrs.match(/alt="([^"]+)"/)?.[1] ?? '';
        if (!src) return '';
        const publicSrc = resolvePublicPath(slug, src);
        return `![${alt}](${publicSrc})`;
      })
      .replace(/<Callout[^>]*>([\s\S]*?)<\/Callout>/g, (_, inner: string) => `> ${inner.trim()}\n`)
      .replace(/<ComparisonTable[\s\S]*?\/>/g, '');
    body = mdx.trim();
  } else {
    const raw = await readText(paths.markdownPath);
    body = rewriteMarkdownAssetPaths(stripMarkdownFrontmatter(raw), slug);
  }

  const publicDir = path.join(PUBLIC_BLOG_IMAGES, slug);
  await mkdir(publicDir, { recursive: true });
  await copyAssets(paths.articleDir, publicDir, slug);

  const heroWebp = path.join(paths.articleDir, 'hero.webp');
  const ogCard = path.join(paths.articleDir, 'og-card.webp');
  const firstImage = path.join(
    publicDir,
    'images',
    '00-editorial-hero-illustration-of-a-developer-works.webp',
  );

  let headerImage = `/images/blog/${slug}/hero.webp`;
  let ogImage = headerImage;

  if (await fileExists(ogCard)) {
    await copyFile(ogCard, path.join(publicDir, 'og-card.webp'));
    ogImage = `/images/blog/${slug}/og-card.webp`;
  } else if (await fileExists(heroWebp)) {
    ogImage = headerImage;
  } else if (await fileExists(firstImage)) {
    headerImage = `/images/blog/${slug}/images/00-editorial-hero-illustration-of-a-developer-works.webp`;
    ogImage = headerImage;
  }

  const fmLines = [
    '---',
    `title: '${meta.title.replace(/'/g, "''")}'`,
    `excerpt: '${meta.excerpt.replace(/'/g, "''")}'`,
    `date: ${meta.date}`,
    `readTime: ${meta.readTime}`,
    `tags: ${meta.tags.join(', ')}`,
    `categories: ${meta.categories.join(', ')}`,
    `headerImage: ${headerImage}`,
    `ogImage: ${ogImage}`,
    ...(meta.featured ? ['featured: true'] : []),
    '---',
  ];

  const markdown = `${fmLines.join('\n')}\n\n${body}\n`;
  await writeText(path.join(SITE_BLOG_MD, `${slug}.md`), markdown);

  if (process.env.NODE_ENV === 'development') {
    console.log('[publish] Wrote', path.join(SITE_BLOG_MD, `${slug}.md`));
  }
}

async function copyAssets(articleDir: string, publicDir: string, slug: string): Promise<void> {
  const subdirs = ['', 'images', 'screenshots', 'diagrams'];
  for (const sub of subdirs) {
    const srcDir = sub ? path.join(articleDir, sub) : articleDir;
    try {
      const files = await readdir(srcDir);
      for (const file of files) {
        if (!/\.(webp|png|jpg|jpeg|svg)$/i.test(file)) continue;
        const src = path.join(srcDir, file);
        const dest = path.join(publicDir, sub ? path.join(sub, file) : file);
        await mkdir(path.dirname(dest), { recursive: true });
        await copyFile(src, dest);
      }
    } catch {
      // missing dir
    }
  }
}

function resolvePublicPath(slug: string, relative: string): string {
  const clean = relative.replace(/^\.\//, '');
  if (clean.startsWith('screenshots/')) {
    return `/images/blog/${slug}/${clean.replace(/\.(png|jpe?g)$/i, '.webp')}`;
  }
  if (clean.startsWith('images/') || clean.startsWith('diagrams/')) {
    return `/images/blog/${slug}/${clean}`;
  }
  return `/images/blog/${slug}/${clean}`;
}

import path from 'node:path';
import { getArticlePaths } from '../config.js';
import { generateArticle } from '../llm/write-article.js';
import { generateSocialPack } from '../llm/social.js';
import { captureScreenshotsForArticle } from '../capture/playwright.js';
import { generateHeroImage, generateSectionImages } from '../assets/openai-images.js';
import { buildOgCard } from '../assets/og-composite.js';
import { optimizeDirectory } from '../assets/optimize.js';
import { renderMermaidDiagrams, writeMermaidSources } from '../diagrams/mermaid.js';
import { assembleMdxDocument } from '../mdx/assemble.js';
import { ensureDir, writeJson, writeText, readJson } from '../utils/fs.js';
import { scaffoldArticle } from './scaffold.js';
import { suggestRelatedSlugs } from '../llm/related.js';
import type { ArticleMetadata, SectionImagePlan } from '../types.js';

export interface GenerateOptions {
  topic: string;
  slug?: string;
  skipScreenshots?: boolean;
  skipImages?: boolean;
  skipDiagrams?: boolean;
  screenshotTargets?: string[];
  social?: boolean;
}

export async function runFullPipeline(options: GenerateOptions): Promise<string> {
  const article = await generateArticle(options.topic, options.slug);
  const slug = article.metadata.slug;
  const paths = getArticlePaths(slug);

  await scaffoldArticle(slug, article.metadata);
  await ensureDir(paths.imagesDir);
  await ensureDir(paths.diagramsDir);
  await ensureDir(paths.screenshotsDir);

  const relatedSlugs = await suggestRelatedSlugs(
    slug,
    article.metadata.tags,
  ).catch(() => []);

  await writeJson(paths.metadataPath, {
    ...article.metadata,
    relatedSlugs,
    structuredData: article.structuredData,
    imagePlans: article.imagePlans,
  });

  // Diagrams
  if (!options.skipDiagrams) {
    await writeMermaidSources(article.imagePlans, paths.diagramsDir);
    await renderMermaidDiagrams(paths.diagramsDir);
  }

  // Screenshots
  if (!options.skipScreenshots) {
    const screenshotIds = article.imagePlans
      .filter((p) => p.kind === 'screenshot' && p.screenshotTarget)
      .map((p) => p.screenshotTarget as string);
    const unique = [...new Set(screenshotIds)];
    if (unique.length) {
      await captureScreenshotsForArticle(slug, paths.screenshotsDir, unique);
    }
  }

  // AI images
  let heroPath: string | undefined;
  if (!options.skipImages) {
    const hero = await generateHeroImage(
      article.metadata.title,
      article.metadata.excerpt,
      paths.articleDir,
    );
    heroPath = path.relative(paths.articleDir, hero.heroPath);

    const illustrationPlans = article.imagePlans.filter(
      (p) =>
        p.kind === 'ai-illustration' ||
        p.kind === 'infographic' ||
        p.kind === 'ui-composition',
    );
    await generateSectionImages(illustrationPlans, paths.imagesDir);

    const heroForOg = hero.heroPath;
    await buildOgCard(
      heroForOg,
      article.metadata.ogTitle,
      path.join(paths.articleDir, 'og-card.webp'),
    );
  }

  const mdx = assembleMdxDocument(article.metadata, article.mdxBody, {
    heroPath,
    imagePlans: article.imagePlans,
  });
  await writeText(paths.mdxPath, mdx);

  await optimizeDirectory(paths.articleDir);

  if (options.social) {
    const social = await generateSocialPack(article.metadata, article.mdxBody);
    await writeJson(paths.socialPath, social);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[pipeline] Article ready at', paths.articleDir);
  }

  return paths.articleDir;
}

export async function runScreenshotsOnly(slug: string, targetIds?: string[]): Promise<void> {
  const paths = getArticlePaths(slug);
  await captureScreenshotsForArticle(slug, paths.screenshotsDir, targetIds);
  await optimizeDirectory(paths.screenshotsDir);
}

export async function runDiagramsOnly(slug: string): Promise<void> {
  const paths = getArticlePaths(slug);
  const meta = await readJson<{ imagePlans?: SectionImagePlan[] }>(paths.metadataPath);
  const plans = meta.imagePlans ?? [];
  await writeMermaidSources(plans, paths.diagramsDir);
  await renderMermaidDiagrams(paths.diagramsDir);
}

export async function runOptimizeOnly(slug: string): Promise<void> {
  const paths = getArticlePaths(slug);
  await optimizeDirectory(paths.articleDir);
}

export async function runSocialOnly(slug: string): Promise<void> {
  const paths = getArticlePaths(slug);
  const meta = await readJson<ArticleMetadata>(paths.metadataPath);
  const { readFile } = await import('node:fs/promises');
  const mdx = await readFile(paths.mdxPath, 'utf8');
  const body = mdx.replace(/^import[\s\S]*?\n\n/, '');
  const social = await generateSocialPack(meta, body);
  await writeJson(paths.socialPath, social);
}

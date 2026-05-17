import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PipelinePaths } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(__dirname, '../../..');

export const CONTENT_BLOG_ROOT = path.join(REPO_ROOT, 'content/blog');
export const PUBLIC_BLOG_IMAGES = path.join(REPO_ROOT, 'public/images/blog');
export const SITE_BLOG_MD = path.join(REPO_ROOT, 'src/content/blog');
export const MDX_COMPONENTS_ALIAS = '@/components/blog/mdx';

export function getArticlePaths(slug: string): PipelinePaths {
  const articleDir = path.join(CONTENT_BLOG_ROOT, slug);
  return {
    articleDir,
    mdxPath: path.join(articleDir, 'article.mdx'),
    markdownPath: path.join(articleDir, 'article.md'),
    metadataPath: path.join(articleDir, 'metadata.json'),
    imagesDir: path.join(articleDir, 'images'),
    diagramsDir: path.join(articleDir, 'diagrams'),
    screenshotsDir: path.join(articleDir, 'screenshots'),
    socialPath: path.join(articleDir, 'social.json'),
  };
}

export const DEFAULT_VIEWPORT = { width: 1440, height: 900 };

export const LLM_CONFIG = {
  provider: (process.env.BLOG_LLM_PROVIDER ?? 'openai') as 'openai' | 'anthropic',
  openaiModel: process.env.BLOG_OPENAI_MODEL ?? 'gpt-4.1',
  anthropicModel: process.env.BLOG_ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514',
  imageModel: process.env.BLOG_IMAGE_MODEL ?? 'gpt-image-1',
};

export const BRAND_WRITING_RULES = `
Voice: direct, technical without being academic, personal without casual, never corporate.
Never use em dashes (—). Use commas, parentheses, or new sentences instead.
Never use colon-style titles like "Topic: Subtitle".
Avoid AI clichés: "hot take", "delve", "unlock", "empower", "elevate", "no fluff", "dynamic landscape".
Blog titles: max 10 words, no internal colons, no em dashes.
Excerpts: one or two sentences, value-focused.
`.trim();

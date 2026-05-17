import { SITE_BLOG_MD } from '../config.js';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

/** Suggest related posts by tag overlap (no LLM). */
export async function suggestRelatedSlugs(
  slug: string,
  tags: string[],
  limit = 3,
): Promise<string[]> {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  const files = await readdir(SITE_BLOG_MD);
  const scores: Array<{ slug: string; score: number }> = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const s = file.replace(/\.md$/, '');
    if (s === slug) continue;
    const raw = await readFile(path.join(SITE_BLOG_MD, file), 'utf8');
    const tagsLine = raw.match(/^tags:\s*(.+)$/m)?.[1] ?? '';
    const postTags = tagsLine.split(',').map((t) => t.trim().toLowerCase());
    const score = postTags.filter((t) => tagSet.has(t)).length;
    if (score > 0) scores.push({ slug: s, score });
  }

  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.slug);
}

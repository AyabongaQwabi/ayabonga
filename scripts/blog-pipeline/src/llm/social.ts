import { completeJson } from './client.js';
import type { ArticleMetadata, SocialPack } from '../types.js';
import { BRAND_WRITING_RULES } from '../config.js';

export async function generateSocialPack(
  metadata: ArticleMetadata,
  mdxBody: string,
): Promise<SocialPack> {
  const excerpt = mdxBody.slice(0, 4000);
  return completeJson<SocialPack>([
    {
      role: 'system',
      content: `Generate social copy for a technical blog post. ${BRAND_WRITING_RULES}`,
    },
    {
      role: 'user',
      content: `Title: ${metadata.title}
Excerpt: ${metadata.excerpt}
Tags: ${metadata.tags.join(', ')}

Article excerpt:
${excerpt}

Return JSON:
{
  "tweetThread": string[] (5-8 tweets, each under 280 chars, no em dashes),
  "linkedInPost": string (under 3000 chars, line breaks ok),
  "newsletterSummary": string (2 short paragraphs + bullet CTA)
}`,
    },
  ]);
}

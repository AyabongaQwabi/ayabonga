import { BRAND_WRITING_RULES } from '../config.js';
import { injectOfficialLinks } from './link-registry.js';
import { completeJson, completeText, type ChatMessage } from './client.js';
import type { ArticleMetadata, ArticleOutline, GeneratedArticle, SectionImagePlan } from '../types.js';
import { estimateReadTime, slugify, countWords } from '../utils/slug.js';

const SYSTEM: ChatMessage = {
  role: 'system',
  content: `You are a senior technical editor writing long-form developer content for qwabi.co.za.
${BRAND_WRITING_RULES}
Output valid JSON when asked. Use MDX-friendly markdown in body fields (no raw HTML unless tables).
Prefer comparison tables, pros/cons lists, callouts, and FAQ blocks where useful.`,
};

export async function generateOutline(topic: string, slug?: string): Promise<ArticleOutline> {
  const resolvedSlug = slug ?? slugify(topic);
  return completeJson<ArticleOutline>([
    SYSTEM,
    {
      role: 'user',
      content: `Create an editorial outline for a technical blog post.

Topic: ${topic}
Slug: ${resolvedSlug}

Return JSON:
{
  "metadata": {
    "title": string (max 10 words, no colon in title),
    "slug": "${resolvedSlug}",
    "excerpt": string (1-2 sentences),
    "tags": string[],
    "categories": string[],
    "date": "Month DD, YYYY",
    "readTime": "N min read",
    "seoDescription": string (150-160 chars),
    "ogTitle": string,
    "ogDescription": string,
    "featured": boolean,
    "faq": [{ "question": string, "answer": string }]
  },
  "sections": [{
    "id": "kebab-id",
    "heading": string,
    "level": 2 | 3,
    "bullets": string[],
    "imagePlan": {
      "sectionId": string,
      "heading": string,
      "kind": "screenshot" | "ai-illustration" | "architecture-diagram" | "flowchart" | "comparison-graphic" | "infographic",
      "prompt": string (for ai kinds),
      "screenshotTarget": string (site id for screenshots),
      "mermaidSource": string (for diagrams, valid mermaid),
      "alt": string,
      "caption": string,
      "filename": "section-id.webp"
    }
  }]
}

Include 6-10 sections with at least 3 image plans (mix screenshot, diagram, illustration).
Target software builders, founders, and technical leads in South Africa and globally.`,
    },
  ]);
}

export async function writeArticleBody(
  outline: ArticleOutline,
): Promise<{ mdxBody: string; imagePlans: SectionImagePlan[] }> {
  const imagePlans = outline.sections
    .map((s) => s.imagePlan)
    .filter((p): p is SectionImagePlan => Boolean(p));

  const body = await completeText([
    SYSTEM,
    {
      role: 'user',
      content: `Write the full article MDX body (imports will be prepended later).

Metadata: ${JSON.stringify(outline.metadata, null, 2)}

Sections to cover:
${outline.sections.map((s) => `- ${'#'.repeat(s.level)} ${s.heading}\n  ${s.bullets.join('; ')}`).join('\n')}

Rules:
- Use ## and ### headings matching the outline
- Add <!-- section:id --> HTML comments before each major section for image placement
- Include at least one markdown comparison table
- Include pros/cons lists where relevant
- Use blockquote callouts for key warnings or tips
- Add internal anchor-friendly headings (no special chars in ids)
- End with ## FAQ using the metadata faq items
- Do NOT include frontmatter or import statements
- Placeholder images as: ![alt](./images/filename.webp "caption") matching image plans
- Length: 2200-3200 words`,
    },
  ]);

  const linked = injectOfficialLinks(body);
  return { mdxBody: linked, imagePlans };
}

export async function generateArticle(
  topic: string,
  slug?: string,
): Promise<GeneratedArticle> {
  const outline = await generateOutline(topic, slug);
  const { mdxBody, imagePlans } = await writeArticleBody(outline);

  const wordCount = countWords(mdxBody);
  const metadata: ArticleMetadata = {
    ...outline.metadata,
    slug: outline.metadata.slug || slugify(topic),
    readTime: estimateReadTime(wordCount),
    wordCount,
  };

  const structuredData = buildArticleJsonLd(metadata, metadata.faq);

  return {
    metadata,
    mdxBody,
    imagePlans,
    structuredData,
  };
}

function buildArticleJsonLd(
  meta: ArticleMetadata,
  faq?: ArticleMetadata['faq'],
): Record<string, unknown> {
  const graph: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: meta.title,
      description: meta.seoDescription,
      datePublished: meta.date,
      author: {
        '@type': 'Person',
        name: 'Ayabonga Qwabi',
      },
    },
  ];

  if (faq?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return { '@graph': graph };
}

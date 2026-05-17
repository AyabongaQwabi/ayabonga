import type { ArticleMetadata, SectionImagePlan } from '../types.js';
import { MDX_COMPONENTS_ALIAS } from '../config.js';

export function buildMdxImports(): string {
  return `import { HeroImage, ArticleImage, Callout, ComparisonTable } from '${MDX_COMPONENTS_ALIAS}'

`;
}

export function wrapHero(heroRelativePath: string, alt: string): string {
  return `<HeroImage src="${heroRelativePath}" alt="${escapeAttr(alt)}" />\n\n`;
}

export function imageComponent(
  src: string,
  alt: string,
  caption?: string,
): string {
  const cap = caption ? ` caption="${escapeAttr(caption)}"` : '';
  return `<ArticleImage src="${src}" alt="${escapeAttr(alt)}"${cap} />\n\n`;
}

export function assembleMdxDocument(
  metadata: ArticleMetadata,
  body: string,
  options?: {
    heroPath?: string;
    imagePlans?: SectionImagePlan[];
  },
): string {
  const parts: string[] = [buildMdxImports()];

  if (options?.heroPath) {
    parts.push(wrapHero('./hero.webp', metadata.title));
  }

  parts.push(`# ${metadata.title}\n\n`);
  parts.push(body.trim());
  parts.push('\n');

  return parts.join('');
}

export function frontmatterBlock(metadata: ArticleMetadata): string {
  const lines = [
    '---',
    `title: '${metadata.title.replace(/'/g, "''")}'`,
    `excerpt: '${metadata.excerpt.replace(/'/g, "''")}'`,
    `date: ${metadata.date}`,
    `readTime: ${metadata.readTime}`,
    `tags: ${metadata.tags.join(', ')}`,
    `categories: ${metadata.categories.join(', ')}`,
    `seoDescription: '${metadata.seoDescription.replace(/'/g, "''")}'`,
    `ogTitle: '${metadata.ogTitle.replace(/'/g, "''")}'`,
    `ogDescription: '${metadata.ogDescription.replace(/'/g, "''")}'`,
  ];
  if (metadata.featured) {
    lines.push('featured: true');
  }
  lines.push('---', '');
  return lines.join('\n');
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, '&quot;');
}

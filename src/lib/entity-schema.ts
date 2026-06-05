import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  parsePostDateForSchema,
  SITE_NAME,
  SITE_ORIGIN,
} from './site-config';
import {
  authorPersonSchema,
  ORGANIZATION_NAME,
} from './author-profile';
import type { BlogPost } from '../data/blog-posts';

export const ORGANIZATION_LOGO_URL = absoluteUrl('/og.png');

/** @id reference to the site Person entity (use inside @graph). */
export function personRef() {
  return { '@id': `${SITE_ORIGIN}/#person` };
}

/** @id reference to the site Organization entity (use inside @graph). */
export function organizationRef() {
  return { '@id': `${SITE_ORIGIN}/#organization` };
}

/** @id reference to the site WebSite entity (use inside @graph). */
export function websiteRef() {
  return { '@id': `${SITE_ORIGIN}/#website` };
}

/** Strip top-level @context so a node can live inside @graph. */
export function asGraphNode(
  schema: Record<string, unknown>,
): Record<string, unknown> {
  if (!schema['@context']) {
    return schema;
  }
  const { ['@context']: _ctx, ...node } = schema;
  return node;
}

/**
 * Build one JSON-LD document with a single @context and @graph array.
 * Nested schemas from buildBreadcrumbSchema / buildFaqPageSchema are stripped automatically.
 */
export function buildJsonLdGraph(
  nodes: Record<string, unknown>[],
): { '@context': string; '@graph': Record<string, unknown>[] } {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.map((n) => asGraphNode(n)),
  };
}

/** Person node for @graph (stable @id for cross-references). */
export function authorGraphNode() {
  return {
    ...authorPersonSchema({ url: absoluteUrl('/about') }),
    '@id': `${SITE_ORIGIN}/#person`,
  };
}

export function buildOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: ORGANIZATION_NAME,
    url: SITE_ORIGIN,
    logo: {
      '@type': 'ImageObject',
      url: ORGANIZATION_LOGO_URL,
    },
    founder: personRef(),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'aya@qwabi.co.za',
      telephone: '+27-60-311-6777',
      areaServed: 'ZA',
      availableLanguage: ['English'],
    },
  };
}

export function buildPublisherSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: ORGANIZATION_NAME,
    url: SITE_ORIGIN,
    logo: {
      '@type': 'ImageObject',
      url: ORGANIZATION_LOGO_URL,
    },
  };
}

export function buildWebSiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    url: SITE_ORIGIN,
    name: SITE_NAME,
    description:
      'Portfolio and writing by Ayabonga Qwabi: product engineering, AI, cloud architecture, and shipped work for South African founders.',
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    inLanguage: 'en-ZA',
  };
}

/** Standard WebPage + site entities for trust and utility pages. */
export function buildSimplePageGraph(options: {
  name: string;
  description: string;
  canonical: string;
}) {
  const { name, description, canonical } = options;
  return buildJsonLdGraph([
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    authorGraphNode(),
    {
      '@type': 'WebPage',
      '@id': canonical,
      name,
      description,
      url: canonical,
      isPartOf: websiteRef(),
      inLanguage: 'en-ZA',
    },
  ]);
}

export function buildProfilePageSchema() {
  const person = authorPersonSchema({ url: absoluteUrl('/about') });
  return buildJsonLdGraph([
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    {
      ...person,
      '@id': `${SITE_ORIGIN}/#person`,
      mainEntityOfPage: { '@id': `${SITE_ORIGIN}/about#webpage` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_ORIGIN}/about#webpage`,
      url: absoluteUrl('/about'),
      name: `About ${SITE_NAME}`,
      isPartOf: websiteRef(),
      about: personRef(),
      inLanguage: 'en-ZA',
    },
  ]);
}

export function buildBreadcrumbSchema(
  items: { name: string; path: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** Article node for @graph (insights, comparisons, and similar). */
export function buildArticleGraphNode(options: {
  headline: string;
  description: string;
  canonical: string;
  shareImageUrl?: string;
  datePublished: string;
  dateModified?: string;
  articleSection?: string;
}) {
  const {
    headline,
    description,
    canonical,
    shareImageUrl = DEFAULT_OG_IMAGE,
    datePublished,
    dateModified,
    articleSection,
  } = options;
  const modified = dateModified ?? datePublished;

  const doc: Record<string, unknown> = {
    '@type': 'Article',
    '@id': `${canonical}#article`,
    headline,
    description,
    url: canonical,
    author: personRef(),
    publisher: organizationRef(),
    image: shareImageUrl,
    mainEntityOfPage: { '@id': canonical },
    inLanguage: 'en-ZA',
    datePublished: `${datePublished}T12:00:00+02:00`,
    dateModified: `${modified}T12:00:00+02:00`,
  };

  if (articleSection) {
    doc.articleSection = articleSection;
  }

  return doc;
}

/** BlogPosting node for @graph. */
export function buildBlogPostingGraphNode(options: {
  post: BlogPost;
  canonical: string;
  shareImageUrl: string;
  dateModified?: string;
}) {
  const { post, canonical, shareImageUrl, dateModified } = options;
  const datePublished = parsePostDateForSchema(post.date);
  const modified =
    dateModified ?? parsePostDateForSchema(post.dateModified ?? '') ?? datePublished;

  const doc: Record<string, unknown> = {
    '@type': 'BlogPosting',
    '@id': `${canonical}#article`,
    headline: post.title,
    description: post.excerpt,
    url: canonical,
    author: personRef(),
    publisher: organizationRef(),
    image: shareImageUrl,
    mainEntityOfPage: { '@id': canonical },
    inLanguage: 'en-ZA',
  };

  if (datePublished) {
    doc.datePublished = `${datePublished}T12:00:00+02:00`;
    doc.dateModified = `${(modified ?? datePublished)}T12:00:00+02:00`;
  }

  const primarySection = post.categories[0];
  if (primarySection) {
    doc.articleSection = primarySection;
  }

  return doc;
}

export function buildBlogPostingSchema(options: {
  post: BlogPost;
  canonical: string;
  shareImageUrl: string;
  dateModified?: string;
}) {
  const { post, canonical, shareImageUrl, dateModified } = options;
  const datePublished = parsePostDateForSchema(post.date);
  const modified =
    dateModified ?? parsePostDateForSchema(post.dateModified ?? '') ?? datePublished;

  const doc: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: canonical,
    author: authorPersonSchema(),
    publisher: buildPublisherSchema(),
    image: shareImageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    inLanguage: 'en-ZA',
  };

  if (datePublished) {
    doc.datePublished = `${datePublished}T12:00:00+02:00`;
    doc.dateModified = `${(modified ?? datePublished)}T12:00:00+02:00`;
  }

  const primarySection = post.categories[0];
  if (primarySection) {
    doc.articleSection = primarySection;
  }

  return doc;
}

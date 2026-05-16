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

export function buildOrganizationSchema() {
  const founder = authorPersonSchema();
  return {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: ORGANIZATION_NAME,
    url: SITE_ORIGIN,
    logo: {
      '@type': 'ImageObject',
      url: ORGANIZATION_LOGO_URL,
    },
    founder: {
      ...founder,
      '@id': `${SITE_ORIGIN}/#person`,
    },
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

export function buildProfilePageSchema() {
  const person = authorPersonSchema({ url: absoluteUrl('/about') });
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationSchema(),
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
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': `${SITE_ORIGIN}/#person` },
        inLanguage: 'en-ZA',
      },
    ],
  };
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

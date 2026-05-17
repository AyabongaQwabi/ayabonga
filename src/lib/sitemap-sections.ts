import { blogPosts } from '../data/blog-posts';
import pseoPages from '../data/pseo-pages.json';
import comparisons from '../data/comparisons.json';
import {
  cityDisplayName,
  easternCapeHubPath,
  getAllRoles,
  getEasternCapeCities,
  localPagePath,
  southAfricaHubPath,
} from './local-developers';

export type SitemapEntry = {
  /** Omit for section group labels (e.g. city names under the Eastern Cape hub). */
  path?: string;
  label: string;
  children?: SitemapEntry[];
};

export type SitemapSection = {
  id: string;
  title: string;
  items: SitemapEntry[];
};

function buildDeveloperSection(): SitemapEntry[] {
  const roles = getAllRoles();
  const cities = getEasternCapeCities();

  const easternCapeCities: SitemapEntry[] = cities.map((city) => ({
    label: cityDisplayName(city),
    children: roles.map((role) => ({
      path: localPagePath(city.slug, role.slug),
      label: role.label,
    })),
  }));

  return [
    { path: southAfricaHubPath(), label: 'Developers in South Africa' },
    {
      path: easternCapeHubPath(),
      label: 'Developers in the Eastern Cape',
      children: easternCapeCities,
    },
  ];
}

/** Human-readable site map sections for /sitemap and tooling. */
export function buildSitemapSections(): SitemapSection[] {
  return [
    {
      id: 'main',
      title: 'Main pages',
      items: [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About' },
        { path: '/services', label: 'Services' },
        { path: '/technical-cofounder', label: 'Technical co-founder (TaaS)' },
        { path: '/blog', label: 'Writing' },
        { path: '/get-a-quote', label: 'Get a quote' },
        { path: '/projects/espazza', label: 'eSpazza project' },
        { path: '/privacy', label: 'Privacy' },
        { path: '/editorial', label: 'Editorial standards' },
        { path: '/corrections', label: 'Corrections' },
      ],
    },
    {
      id: 'blog',
      title: 'Blog posts',
      items: blogPosts.map((post) => ({
        path: `/blog/${post.slug}`,
        label: post.title,
      })),
    },
    {
      id: 'solutions',
      title: 'Solutions',
      items: pseoPages.map((page) => ({
        path: `/solutions/${page.slug}`,
        label: page.title,
      })),
    },
    {
      id: 'comparisons',
      title: 'Comparisons',
      items: comparisons.map((page) => ({
        path: `/vs/${page.slug}`,
        label: page.title,
      })),
    },
    {
      id: 'developers',
      title: 'Developer hub',
      items: buildDeveloperSection(),
    },
  ];
}

/** Flat list of every routable path (for audits). */
export function flattenSitemapPaths(sections = buildSitemapSections()): string[] {
  const paths = new Set<string>();

  function walk(entries: SitemapEntry[]) {
    for (const entry of entries) {
      if (entry.path) paths.add(entry.path);
      if (entry.children?.length) walk(entry.children);
    }
  }

  for (const section of sections) {
    walk(section.items);
  }

  return [...paths].sort((a, b) => a.localeCompare(b));
}

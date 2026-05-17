import data from '../data/local-developers.json';
import { SITE_NAME } from './site-config';

export type RegionSlug = 'eastern-cape' | 'south-africa';
export type RoleSlug =
  | 'software-developer'
  | 'software-engineer'
  | 'web-developer'
  | 'web-designer'
  | 'cloud-architect';

export interface LocalCity {
  slug: string;
  name: string;
  alternateName: string | null;
  region: string;
  localIntro: string;
  nearbyProof: string;
}

export interface LocalRole {
  slug: RoleSlug;
  label: string;
  labelPlural: string;
  shortFocus: string;
  keywords: string[];
}

export interface LocalRegion {
  slug: RegionSlug;
  name: string;
  title: string;
  description: string;
  hubKeywords: string[];
}

const regions = data.regions as Record<RegionSlug, LocalRegion>;
const roles = data.roles as Record<RoleSlug, LocalRole>;
const cities = data.cities as LocalCity[];

export function getRegion(slug: string): LocalRegion | undefined {
  return regions[slug as RegionSlug];
}

export function getRole(slug: string): LocalRole | undefined {
  return roles[slug as RoleSlug];
}

export function getCity(slug: string): LocalCity | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getEasternCapeCities(): LocalCity[] {
  return cities.filter((c) => c.region === 'eastern-cape');
}

export function getAllRoles(): LocalRole[] {
  return Object.values(roles);
}

export function getAllLocalPages(): { region: RegionSlug; city: string; role: RoleSlug }[] {
  const ecCities = getEasternCapeCities();
  const roleSlugs = Object.keys(roles) as RoleSlug[];
  return ecCities.flatMap((city) =>
    roleSlugs.map((role) => ({
      region: 'eastern-cape' as const,
      city: city.slug,
      role,
    })),
  );
}

export function cityDisplayName(city: LocalCity): string {
  if (city.alternateName) {
    return `${city.name} (${city.alternateName})`;
  }
  return city.name;
}

export function buildLocalPageTitle(role: LocalRole, city: LocalCity): string {
  return `${role.label} in ${city.name}, Eastern Cape`;
}

export function buildLocalPageDescription(role: LocalRole, city: LocalCity): string {
  const alt = city.alternateName ? ` (${city.alternateName})` : '';
  return `Hire a senior ${role.label.toLowerCase()} in ${city.name}${alt}, Eastern Cape. ${role.shortFocus}. Based in Queenstown, serving ${city.name} and all of SA remotely.`;
}

export function buildLocalPageKeywords(role: LocalRole, city: LocalCity): string[] {
  const alt = city.alternateName?.toLowerCase();
  const base = [
    `${role.label.toLowerCase()} ${city.name}`,
    `${role.label.toLowerCase()} ${city.name} eastern cape`,
    `${role.keywords[0]} ${city.name}`,
    `${role.label.toLowerCase()} eastern cape`,
    'software developer south africa',
  ];
  if (alt) {
    base.push(`${role.label.toLowerCase()} ${alt}`);
    if (city.slug === 'gqeberha') {
      base.push(`${role.label.toLowerCase()} port elizabeth`);
    }
    if (city.slug === 'makhanda') {
      base.push(`${role.label.toLowerCase()} grahamstown`);
    }
    if (city.slug === 'qonce') {
      base.push(`${role.label.toLowerCase()} king williams town`);
    }
    if (city.slug === 'queenstown') {
      base.push(`${role.label.toLowerCase()} komani`);
    }
  }
  return [...new Set([...base, ...role.keywords.map((k) => `${k} ${city.name}`)])];
}

export function buildLocalFaqs(role: LocalRole, city: LocalCity) {
  const place = cityDisplayName(city);
  return [
    {
      id: 'on-site',
      question: `Do you work on-site in ${city.name}?`,
      answer: `I am based in Queenstown and work with ${city.name} clients remote-first. For discovery workshops or launch support in ${place}, we can arrange on-site time. Day-to-day delivery is async with visible demos every few days.`,
    },
    {
      id: 'cost',
      question: `How much does a ${role.label.toLowerCase()} cost in the Eastern Cape?`,
      answer: `Rates depend on scope: MVP, rebuild, or retainer. I scope Phase 1 as a fixed build so you are not stuck in hourly drift. Use the quote tool on this site for a ballpark, or message on WhatsApp with your timeline and budget.`,
    },
    {
      id: 'agency',
      question: `Are you a software agency in ${city.name}?`,
      answer: `No. I am a senior product engineer (one accountable builder), not a room of juniors behind account managers. You get direct access, test-driven code, and local payment expertise (Paystack, Stitch) without agency overhead.`,
    },
    {
      id: 'remote',
      question: `Can you build for ${city.name} while based elsewhere?`,
      answer: `Yes. Most Eastern Cape clients work with me remotely. Products are built mobile-first for SA networks, with staging links you can test from ${city.name} on real devices before launch.`,
    },
  ];
}

export function localPagePath(citySlug: string, roleSlug: string): string {
  return `/developers/eastern-cape/${citySlug}/${roleSlug}`;
}

export function easternCapeHubPath(): string {
  return '/developers/eastern-cape';
}

export function southAfricaHubPath(): string {
  return '/developers/south-africa';
}

export function buildLocalSchema(role: LocalRole, city: LocalCity, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${role.label}, ${city.name}, Eastern Cape`,
    description: buildLocalPageDescription(role, city),
    url: pageUrl,
    provider: {
      '@type': 'Person',
      name: SITE_NAME,
      jobTitle: role.label,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Queenstown',
        addressRegion: 'Eastern Cape',
        addressCountry: 'ZA',
      },
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'State',
        name: 'Eastern Cape',
      },
    },
    serviceType: role.label,
  };
}

export function buildHubSchema(region: LocalRegion, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: region.title,
    description: region.description,
    url: pageUrl,
    about: {
      '@type': 'ProfessionalService',
      name: `${SITE_NAME}, ${region.name}`,
      areaServed: region.slug === 'eastern-cape' ? 'Eastern Cape, South Africa' : 'South Africa',
    },
  };
}

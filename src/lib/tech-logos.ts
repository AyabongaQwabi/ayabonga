import manifest from '../data/tech-logos.json';

export type TechLogoEntry = {
  file: string;
  blogIcon?: string;
  aliases: string[];
};

const entries = manifest as Record<string, TechLogoEntry>;

const SLUG_ALIASES: Record<string, string> = {
  golang: 'go',
  postgres: 'postgresql',
  mongo: 'mongodb',
  k8s: 'kubernetes',
  ts: 'typescript',
  js: 'javascript',
  nextjs: 'nextjs',
  next: 'nextjs',
  nodejs: 'nodejs',
  node: 'nodejs',
  vuejs: 'vue',
  expressjs: 'express',
  nestjs: 'nestjs',
  gcp: 'google-cloud',
  claude: 'anthropic',
  chatgpt: 'openai',
  huggingface: 'huggingface',
  'hugging-face': 'huggingface',
  shadcnui: 'shadcn',
  'shadcn-ui': 'shadcn',
  reactjs: 'react',
  gatsbyjs: 'gatsby',
};

/** Normalize a tech name to a lookup key (lowercase slug). */
export function normalizeTechName(name: string): string {
  const trimmed = name.trim().toLowerCase();
  const slug = trimmed
    .replace(/\.(svg|png|webp|jpe?g)$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return SLUG_ALIASES[slug] ?? slug;
}

const aliasToSlug = new Map<string, string>();

for (const [slug, entry] of Object.entries(entries)) {
  aliasToSlug.set(normalizeTechName(slug), slug);
  for (const alias of entry.aliases ?? []) {
    aliasToSlug.set(normalizeTechName(alias), slug);
  }
}

/** Resolve a public URL for a tech logo, or null if unknown. */
export function resolveTechLogo(name: string): string | null {
  const key = normalizeTechName(name);
  const slug = aliasToSlug.get(key) ?? (entries[key] ? key : null);
  if (!slug || !entries[slug]) return null;
  return entries[slug].file;
}

/** Blog icon path (legacy `/images/blog/icons/…`) when available. */
export function resolveBlogTechIcon(name: string): string | null {
  const key = normalizeTechName(name);
  const slug = aliasToSlug.get(key) ?? (entries[key] ? key : null);
  if (!slug || !entries[slug]) return null;
  return entries[slug].blogIcon ?? entries[slug].file;
}

export function getTechLogoEntry(name: string): TechLogoEntry | null {
  const key = normalizeTechName(name);
  const slug = aliasToSlug.get(key) ?? (entries[key] ? key : null);
  if (!slug) return null;
  return entries[slug] ?? null;
}

export function listTechLogoSlugs(): string[] {
  return Object.keys(entries);
}

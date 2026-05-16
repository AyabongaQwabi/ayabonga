export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
  tags: string[];
  categories: string[];
  /** When true, post is eligible for the blog index hero (`featured: true` in frontmatter). */
  featured?: boolean;
  /** Site-root path (`/images/...`) or absolute `https://` URL for og:image / Twitter card / JSON-LD. */
  ogImage?: string;
  /** Optional hero image in the article; if omitted but `ogImage` is set, the OG image is shown in the header. */
  headerImage?: string;
  /** Optional ISO or display date for `dateModified` in JSON-LD when a post is revised. */
  dateModified?: string;
}

const rawModules = import.meta.glob<string>('../content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function slugFromFilename(path: string): string {
  const name = path.split('/').pop() ?? '';
  return name.replace(/\.md$/i, '');
}

/** Split comma-separated frontmatter lists (tags, categories). */
function parseCommaList(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseFeatured(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === 'true';
}

/** YAML-like frontmatter (single-line key: value only). Browser-safe — no Node Buffer. */
function parseMarkdownWithFrontmatter(raw: string): {
  data: Record<string, string>;
  content: string;
} {
  const text = raw.replace(/^\uFEFF/, '');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: text.trim() };
  }

  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }

  return { data, content: match[2].trim() };
}

interface PostFrontmatter {
  title?: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  slug?: string;
  tags?: string;
  categories?: string;
  featured?: string;
  ogImage?: string;
  headerImage?: string;
  /** Alias for `headerImage` in some posts. */
  image?: string;
  dateModified?: string;
}

function resolveHeaderImage(fm: PostFrontmatter): string | undefined {
  const header =
    typeof fm.headerImage === 'string' && fm.headerImage.trim().length > 0
      ? fm.headerImage.trim()
      : undefined;
  if (header) return header;
  return typeof fm.image === 'string' && fm.image.trim().length > 0 ? fm.image.trim() : undefined;
}

function loadBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, raw] of Object.entries(rawModules)) {
    const { data, content } = parseMarkdownWithFrontmatter(raw);
    const fm = data as PostFrontmatter;
    const fileSlug = slugFromFilename(path);
    const slug =
      typeof fm.slug === 'string' && fm.slug.trim().length > 0 ? fm.slug.trim() : fileSlug;

    const ogImage =
      typeof fm.ogImage === 'string' && fm.ogImage.trim().length > 0 ? fm.ogImage.trim() : undefined;
    const headerImage = resolveHeaderImage(fm);
    const featured = parseFeatured(fm.featured);

    const dateModified =
      typeof fm.dateModified === 'string' && fm.dateModified.trim().length > 0
        ? fm.dateModified.trim()
        : undefined;

    posts.push({
      slug,
      title: typeof fm.title === 'string' ? fm.title : fileSlug,
      excerpt: typeof fm.excerpt === 'string' ? fm.excerpt : '',
      date: typeof fm.date === 'string' ? fm.date : '',
      readTime: typeof fm.readTime === 'string' ? fm.readTime : '',
      content,
      tags: parseCommaList(fm.tags),
      categories: parseCommaList(fm.categories),
      ...(featured ? { featured: true } : {}),
      ...(ogImage ? { ogImage } : {}),
      ...(headerImage ? { headerImage } : {}),
      ...(dateModified ? { dateModified } : {}),
    });
  }

  posts.sort((a, b) => {
    const ta = Date.parse(a.date);
    const tb = Date.parse(b.date);
    if (!Number.isNaN(ta) && !Number.isNaN(tb) && ta !== tb) {
      return tb - ta;
    }
    return a.slug.localeCompare(b.slug);
  });

  return posts;
}

export const blogPosts: BlogPost[] = loadBlogPosts();

/** Card / listing thumbnail: prefers article hero, falls back to OG image. */
export function getPostThumbnail(post: BlogPost): string | undefined {
  const path = post.headerImage?.trim() || post.ogImage?.trim();
  return path && path.length > 0 ? path : undefined;
}

/**
 * Preferred + fallback paths for listing thumbnails.
 * Tries WebP when the canonical path is JPEG, and JPEG when the canonical path is WebP.
 */
export function getPostThumbnailSources(
  post: BlogPost,
): { primary: string; fallback?: string } | undefined {
  const thumbnail = getPostThumbnail(post);
  if (!thumbnail) return undefined;
  return getImageVariantPair(thumbnail);
}

function getImageVariantPair(path: string): { primary: string; fallback?: string } {
  if (/^https?:\/\//i.test(path)) {
    return { primary: path };
  }

  if (/\.webp$/i.test(path)) {
    const jpg = path.replace(/\.webp$/i, '.jpg');
    return jpg !== path ? { primary: path, fallback: jpg } : { primary: path };
  }

  if (/\.jpe?g$/i.test(path)) {
    const webp = path.replace(/\.jpe?g$/i, '.webp');
    return webp !== path ? { primary: webp, fallback: path } : { primary: path };
  }

  return { primary: path };
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

/** All distinct categories across posts (for filters and nav). */
export function getAllCategories(): string[] {
  return uniqueSorted(blogPosts.flatMap((p) => p.categories));
}

/** All distinct tags across posts. */
export function getAllTags(): string[] {
  return uniqueSorted(blogPosts.flatMap((p) => p.tags));
}

/**
 * Featured post for the blog index hero.
 * Uses the newest post with `featured: true`; if none are flagged, returns undefined.
 */
export function getFeaturedPost(): BlogPost | undefined {
  return blogPosts.find((p) => p.featured === true);
}

function normalizeTaxonomy(value: string): string {
  return value.trim().toLowerCase();
}

function relatedPostScore(source: BlogPost, candidate: BlogPost): number {
  if (candidate.slug === source.slug) return -1;

  const sourceTags = new Set(source.tags.map(normalizeTaxonomy));
  const sourceCategories = new Set(source.categories.map(normalizeTaxonomy));

  let score = 0;
  for (const tag of candidate.tags) {
    if (sourceTags.has(normalizeTaxonomy(tag))) score += 2;
  }
  for (const category of candidate.categories) {
    if (sourceCategories.has(normalizeTaxonomy(category))) score += 3;
  }
  return score;
}

/**
 * Related posts for article footers and sidebars.
 * Ranks by shared categories (weight 3) and tags (weight 2), then recency.
 */
export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const scored = blogPosts
    .map((candidate) => ({
      post: candidate,
      score: relatedPostScore(post, candidate),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const ta = Date.parse(a.post.date);
      const tb = Date.parse(b.post.date);
      if (!Number.isNaN(ta) && !Number.isNaN(tb) && ta !== tb) {
        return tb - ta;
      }
      return a.post.slug.localeCompare(b.post.slug);
    });

  const related = scored.slice(0, limit).map((entry) => entry.post);
  if (related.length >= limit) return related;

  const used = new Set([post.slug, ...related.map((p) => p.slug)]);
  const filler = blogPosts
    .filter((candidate) => !used.has(candidate.slug))
    .sort((a, b) => {
      const ta = Date.parse(a.date);
      const tb = Date.parse(b.date);
      if (!Number.isNaN(ta) && !Number.isNaN(tb) && ta !== tb) return tb - ta;
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, limit - related.length);

  return [...related, ...filler];
}

/** Case-insensitive match for URL ?category= / ?tag= params. */
export function postMatchesFilters(
  post: BlogPost,
  categoryParam: string | null,
  tagParam: string | null,
): boolean {
  if (categoryParam) {
    const want = categoryParam.trim().toLowerCase();
    if (!post.categories.some((c) => c.toLowerCase() === want)) return false;
  }
  if (tagParam) {
    const want = tagParam.trim().toLowerCase();
    if (!post.tags.some((t) => t.toLowerCase() === want)) return false;
  }
  return true;
}

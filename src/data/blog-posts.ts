export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  content: string;
  tags: string[];
  categories: string[];
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
}

function loadBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [path, raw] of Object.entries(rawModules)) {
    const { data, content } = parseMarkdownWithFrontmatter(raw);
    const fm = data as PostFrontmatter;
    const fileSlug = slugFromFilename(path);
    const slug =
      typeof fm.slug === 'string' && fm.slug.trim().length > 0 ? fm.slug.trim() : fileSlug;

    posts.push({
      slug,
      title: typeof fm.title === 'string' ? fm.title : fileSlug,
      excerpt: typeof fm.excerpt === 'string' ? fm.excerpt : '',
      date: typeof fm.date === 'string' ? fm.date : '',
      readTime: typeof fm.readTime === 'string' ? fm.readTime : '',
      content,
      tags: parseCommaList(fm.tags),
      categories: parseCommaList(fm.categories),
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

import { useId, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { BlogCardImage } from '../components/BlogCardImage';
import {
  blogPosts,
  getAllCategories,
  getAllTags,
  getPostThumbnail,
  postMatchesFilters,
  type BlogPost,
} from '../data/blog-posts';
import { BlogTaxonomy, BlogFilterChip } from '../components/BlogTaxonomy';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
} from '../lib/site-config';
import { SiteFooter } from '../components/SiteFooter';
import { ScrollReveal } from '../components/ScrollReveal';
import { authorPersonSchema } from '../lib/author-profile';
import { normalizeBlogImageSrc } from '../lib/blog-image-path';

const BLOG_INDEX_TITLE = 'AI, cloud and product engineering for SA startups';
const BLOG_INDEX_DESCRIPTION =
  'Writing on product engineering, AI, cloud architecture, and shipping software in South Africa. Plus Eastern Cape culture and heritage.';

const FEATURED_FALLBACK_SLUG = 'ai-tools-building-apps-2026';

type BlogPostWithFeatured = BlogPost & { featured?: boolean };

function buildListUrl(category: string | null, tag: string | null): string {
  const p = new URLSearchParams();
  if (category) p.set('category', category);
  if (tag) p.set('tag', tag);
  const q = p.toString();
  return q ? `/blog?${q}` : '/blog';
}

function isFeaturedPost(post: BlogPost): boolean {
  const extended = post as BlogPostWithFeatured;
  if (extended.featured === true) return true;
  return post.slug === FEATURED_FALLBACK_SLUG;
}

function postMatchesSearch(post: BlogPost, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (post.title.toLowerCase().includes(q)) return true;
  if (post.excerpt.toLowerCase().includes(q)) return true;
  return post.tags.some((t) => t.toLowerCase().includes(q));
}

function HeroGlowOrbs() {
  return (
    <>
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl motion-reduce:blur-none"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-primary/5 blur-3xl motion-reduce:blur-none"
        aria-hidden
      />
    </>
  );
}

function BlogIndexHero({
  heroImageSrc,
  heroImageAlt,
}: {
  heroImageSrc?: string;
  heroImageAlt?: string;
}) {
  const hasImage = Boolean(heroImageSrc);

  return (
    <header className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-[#0A192F] via-background to-secondary/80">
      <HeroGlowOrbs />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden
      />

      <div
        className={`relative z-10 grid gap-10 p-6 md:p-10 ${
          hasImage
            ? 'lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12'
            : ''
        }`}
      >
        <div className={hasImage ? '' : 'max-w-3xl'}>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            Writing
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
            {BLOG_INDEX_TITLE}
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {BLOG_INDEX_DESCRIPTION}
          </p>
        </div>

        {hasImage && heroImageSrc ? (
          <div className="relative group lg:justify-self-end w-full max-w-lg mx-auto lg:mx-0">
            <div
              className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary/40 via-primary/10 to-transparent blur-md opacity-60 group-hover:opacity-80 transition-opacity duration-300 motion-reduce:transition-none motion-reduce:blur-none"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 shadow-2xl shadow-black/40 aspect-[3/2] bg-card">
              <img
                src={heroImageSrc}
                alt={heroImageAlt ?? ''}
                className="h-full w-full object-cover"
                width={960}
                height={640}
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function TagAccentRow({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  const visible = tags.slice(0, 3);
  return (
    <ul className="flex flex-wrap gap-1.5 mb-3" aria-label="Topics">
      {visible.map((tag) => (
        <li key={tag}>
          <Link
            to={`/blog?tag=${encodeURIComponent(tag)}`}
            className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function PostMeta({ date, readTime }: { date: string; readTime: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <time dateTime={date}>{date}</time>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {readTime}
      </span>
    </div>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 motion-reduce:transition-none motion-reduce:hover:transform-none focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
      <Link
        to={`/blog/${post.slug}`}
        className="flex min-h-0 flex-1 flex-col outline-none"
      >
        <BlogCardImage
          post={post}
          className="mb-0 rounded-none border-0 border-b border-border"
        />
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <PostMeta date={post.date} readTime={post.readTime} />
          <TagAccentRow tags={post.tags} />
          <h2 className="mt-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary group-focus-within:text-primary md:text-xl">
            {post.title}
          </h2>
          <p className="mt-2 flex-1 text-base leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            Read article
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </span>
        </div>
      </Link>
      <div className="border-t border-border px-5 pb-5 pt-3 md:px-6 md:pb-6">
        <BlogTaxonomy categories={post.categories} tags={post.tags} size="sm" />
      </div>
    </article>
  );
}

function FeaturedPick({ post }: { post: BlogPost }) {
  return (
    <section aria-labelledby="featured-pick-heading" className="mb-12 md:mb-14">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" aria-hidden />
        <h2
          id="featured-pick-heading"
          className="text-sm font-semibold uppercase tracking-widest text-primary"
        >
          Editor&apos;s pick
        </h2>
      </div>
      <article className="group overflow-hidden rounded-2xl border border-primary/25 bg-card shadow-lg shadow-black/20 transition-[border-color,box-shadow] duration-200 hover:border-primary/40 hover:shadow-xl motion-reduce:transition-none focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
        <div className="grid lg:grid-cols-2">
          <Link
            to={`/blog/${post.slug}`}
            className="relative block min-h-[12rem] overflow-hidden outline-none sm:min-h-[14rem]"
          >
            <BlogCardImage
              post={post}
              className="mb-0 h-full min-h-[12rem] rounded-none border-0 sm:min-h-[14rem] [&_img]:h-full [&_img]:min-h-[12rem] [&_img]:object-cover sm:[&_img]:min-h-[14rem]"
            />
          </Link>
          <div className="flex flex-col justify-center p-6 md:p-8 lg:p-10">
            <PostMeta date={post.date} readTime={post.readTime} />
            <TagAccentRow tags={post.tags} />
            <Link to={`/blog/${post.slug}`} className="outline-none">
              <h3 className="mt-3 text-2xl font-bold text-foreground transition-colors group-hover:text-primary md:text-3xl">
                {post.title}
              </h3>
            </Link>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground md:text-lg">
              {post.excerpt}
            </p>
            <Link
              to={`/blog/${post.slug}`}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-[opacity,transform] hover:opacity-95 active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Read the full piece
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="mt-6">
              <BlogTaxonomy categories={post.categories} tags={post.tags} size="sm" />
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default function Blog() {
  const searchInputId = useId();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const categoryFilter = searchParams.get('category');
  const tagFilter = searchParams.get('tag');

  const categories = useMemo(() => getAllCategories(), []);
  const tags = useMemo(() => getAllTags(), []);

  const taxonomyFilteredPosts = useMemo(
    () => blogPosts.filter((p) => postMatchesFilters(p, categoryFilter, tagFilter)),
    [categoryFilter, tagFilter],
  );

  const filteredPosts = useMemo(
    () => taxonomyFilteredPosts.filter((p) => postMatchesSearch(p, searchQuery)),
    [taxonomyFilteredPosts, searchQuery],
  );

  const featuredPost = useMemo(
    () => filteredPosts.find(isFeaturedPost),
    [filteredPosts],
  );

  const gridPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    return filteredPosts.filter((p) => p.slug !== featuredPost.slug);
  }, [filteredPosts, featuredPost]);

  const heroImageSrc = useMemo(() => {
    const fromFeatured = featuredPost ? getPostThumbnail(featuredPost) : undefined;
    if (fromFeatured) return normalizeBlogImageSrc(fromFeatured);
    const fallback = blogPosts.find((p) => p.slug === FEATURED_FALLBACK_SLUG);
    const fromFallback = fallback ? getPostThumbnail(fallback) : undefined;
    return fromFallback ? normalizeBlogImageSrc(fromFallback) : undefined;
  }, [featuredPost]);

  const hasFilters = Boolean(categoryFilter || tagFilter);
  const hasSearch = searchQuery.trim().length > 0;
  const emptyFilterResult = hasFilters && filteredPosts.length === 0;
  const emptySearchResult = hasSearch && filteredPosts.length === 0;
  const robotsContent =
    hasFilters || emptyFilterResult ? 'noindex, follow' : 'index, follow';

  const keywordStr = useMemo(() => tags.slice(0, 24).join(', '), [tags]);

  const blogListingJsonLd = useMemo(() => {
    if (hasFilters) return null;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `Writing: ${SITE_NAME}`,
      description: BLOG_INDEX_DESCRIPTION,
      url: absoluteUrl('/blog'),
      author: authorPersonSchema(),
      blogPost: blogPosts.map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        url: absoluteUrl(`/blog/${p.slug}`),
        description: p.excerpt,
      })),
    });
  }, [hasFilters]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Helmet>
        <title>{`${BLOG_INDEX_TITLE} | ${SITE_NAME}`}</title>
        <meta name="description" content={BLOG_INDEX_DESCRIPTION} />
        {keywordStr ? <meta name="keywords" content={keywordStr} /> : null}
        <link rel="canonical" href={absoluteUrl('/blog')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl('/blog')} />
        <meta property="og:title" content={`${BLOG_INDEX_TITLE} | ${SITE_NAME}`} />
        <meta property="og:description" content={BLOG_INDEX_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${BLOG_INDEX_TITLE} | ${SITE_NAME}`} />
        <meta name="twitter:description" content={BLOG_INDEX_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="robots" content={robotsContent} />
        {blogListingJsonLd ? (
          <script type="application/ld+json">{blogListingJsonLd}</script>
        ) : null}
      </Helmet>

      <nav className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span>Back to home</span>
          </Link>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <BlogIndexHero
          heroImageSrc={heroImageSrc}
          heroImageAlt={featuredPost?.title ?? 'Featured article'}
        />

        <ScrollReveal
          aria-label="Filter and search posts"
          className="mt-10 rounded-xl border border-border bg-card/50 p-4 md:p-6 block"
        >
          <label htmlFor={searchInputId} className="sr-only">
            Search posts by title, excerpt, or tag
          </label>
          <div className="relative mb-6">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              id={searchInputId}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, excerpt, or tags"
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-10 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              autoComplete="off"
            />
            {hasSearch ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Categories
              </p>
              <div className="flex flex-wrap gap-1.5">
                <BlogFilterChip
                  label="All posts"
                  to="/blog"
                  active={!hasFilters}
                  variant="category"
                />
                {categories.map((c) => (
                  <BlogFilterChip
                    key={c}
                    label={c}
                    to={buildListUrl(c, tagFilter)}
                    active={categoryFilter === c}
                    variant="category"
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tags
              </p>
              <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto pr-1">
                {tags.map((t) => (
                  <BlogFilterChip
                    key={t}
                    label={t}
                    to={buildListUrl(categoryFilter, t)}
                    active={tagFilter === t}
                    variant="tag"
                  />
                ))}
              </div>
            </div>
            {(hasFilters || hasSearch) && (
              <p className="border-t border-border pt-3 text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground">{filteredPosts.length}</span> of{' '}
                <span className="font-medium text-foreground">{blogPosts.length}</span> posts
                {categoryFilter ? (
                  <>
                    {' '}
                    · category <span className="text-primary">{categoryFilter}</span>
                  </>
                ) : null}
                {tagFilter ? (
                  <>
                    {' '}
                    · tag <span className="text-foreground">{tagFilter}</span>
                  </>
                ) : null}
                {hasSearch ? (
                  <>
                    {' '}
                    · search <span className="text-foreground">&ldquo;{searchQuery.trim()}&rdquo;</span>
                  </>
                ) : null}
                .{' '}
                <Link
                  to="/blog"
                  onClick={() => setSearchQuery('')}
                  className="text-primary hover:underline"
                >
                  Clear all
                </Link>
              </p>
            )}
          </div>
        </ScrollReveal>

        {featuredPost ? (
          <ScrollReveal className="block">
            <FeaturedPick post={featuredPost} />
          </ScrollReveal>
        ) : null}

        {gridPosts.length > 0 ? (
          <section aria-label="All posts" className="mt-12 md:mt-14">
            <h2 className="mb-6 font-display text-xl font-semibold text-foreground md:text-2xl">
              All posts
              <span className="ml-2 font-technical text-sm font-normal text-muted-foreground">
                ({gridPosts.length}
                {featuredPost ? ` plus editor's pick` : ''})
              </span>
            </h2>
            <ScrollReveal
              stagger
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8"
            >
              {gridPosts.map((post) => (
                <div key={post.slug} className="min-h-0">
                  <BlogPostCard post={post} />
                </div>
              ))}
            </ScrollReveal>
          </section>
        ) : null}

        {(emptyFilterResult || emptySearchResult) && blogPosts.length > 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <p className="mb-4 text-base text-muted-foreground">
              No posts match{hasSearch ? ' your search' : ''}
              {hasFilters ? ' and filters' : ''}.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {hasSearch ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  Clear search
                </button>
              ) : null}
              {hasFilters ? (
                <Link
                  to="/blog"
                  className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  View all posts
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        {blogPosts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-base text-muted-foreground">No posts yet. Check back soon.</p>
          </div>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}

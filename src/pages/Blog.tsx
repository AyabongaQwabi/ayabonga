import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, X } from 'lucide-react';
import {
  blogPosts,
  getAllCategories,
  getAllTags,
  postMatchesFilters,
  resolveTaxonomyParam,
  type BlogPost,
} from '../data/blog-posts';
import { FeaturedPost } from '../components/blog/FeaturedPost';
import { BlogNewsletterStrip } from '../components/blog/BlogNewsletterStrip';
import { PostGrid } from '../components/blog/PostGrid';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
} from '../lib/site-config';
import { PageShell } from '../components/layout/PageShell';
import { TransitionLink } from '../components/ui/TransitionLink';
import { authorPersonSchema } from '../lib/author-profile';
import {
  lineReveal,
  registerEasings,
  scheduleAfterPageCurtain,
  wordReveal,
  whenMotionReady,
} from '../lib/animations';
import { cn } from '../lib/utils';

const BLOG_INDEX_TITLE = 'Writing on AI, web development, and SA engineering';
const BLOG_INDEX_DESCRIPTION =
  'Guides on web development, AI agents, payments, mobile apps, and shipping software in South Africa. Plus isiXhosa names and Eastern Cape heritage.';

const FEATURED_FALLBACK_SLUG = 'ai-tools-building-apps-2026';
const HERO_CATEGORIES = ['Engineering', 'Systems', 'Africa'] as const;

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

function taxonomyMatches(a: string | null, b: string): boolean {
  if (!a) return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function BlogIndexHero({
  categories,
  activeCategory,
}: {
  categories: string[];
  activeCategory: string | null;
}) {
  const thinkingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const chips = useMemo(() => {
    const fromData = categories.filter((c) =>
      HERO_CATEGORIES.some(
        (h) => h.toLowerCase() === c.toLowerCase() || c.includes(h),
      ),
    );
    if (fromData.length >= 2) return fromData.slice(0, 3);
    return [...HERO_CATEGORIES];
  }, [categories]);

  useEffect(() => {
    let cancelled = false;
    let cancelCurtain: (() => void) | undefined;
    let cleanupThinking: (() => void) | null = null;
    let subtitleTimer: number | undefined;

    registerEasings();

    void whenMotionReady().then(() => {
      if (cancelled) return;

      cancelCurtain = scheduleAfterPageCurtain(() => {
        if (cancelled) return;

        if (thinkingRef.current) {
          cleanupThinking = lineReveal(thinkingRef.current, {
            delay: 0.05,
            stagger: 0.08,
          });
        }

        subtitleTimer = window.setTimeout(() => {
          if (!cancelled && subtitleRef.current) {
            wordReveal(subtitleRef.current);
          }
        }, 380);
      });
    });

    return () => {
      cancelled = true;
      cancelCurtain?.();
      cleanupThinking?.();
      if (subtitleTimer !== undefined) window.clearTimeout(subtitleTimer);
    };
  }, []);

  return (
    <header className="relative min-h-[65vh] overflow-x-clip overflow-y-visible bg-[var(--navy-dark)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)]/30 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-[12%] top-[18%] h-64 w-64 rounded-full bg-[var(--gold)]/5 blur-3xl md:h-80 md:w-80"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex min-h-[65vh] max-w-7xl flex-col justify-end px-4 pb-14 pt-28 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12 lg:px-8 lg:pb-20">
        <div className="min-w-0 flex-1">
          <h1
            ref={thinkingRef}
            className="max-w-full break-words font-display text-display-xl font-semibold leading-[var(--leading-display)] text-transparent select-none md:motion-safe:-translate-x-6 lg:max-w-[110%]"
            style={{ WebkitTextStroke: '2px var(--gold)' }}
          >
            THINKING
          </h1>
          <p
            ref={subtitleRef}
            className="mt-6 max-w-lg font-technical text-lg leading-[var(--leading-body)] text-[var(--text-muted)] md:text-xl"
          >
            Writing on engineering, systems, and building in Africa.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 lg:mt-0 lg:max-w-xs lg:justify-end">
          {chips.map((label) => {
            const match = categories.find(
              (c) => c.toLowerCase() === label.toLowerCase(),
            );
            const value = match ?? label;
            const active = taxonomyMatches(activeCategory, value);
            return (
              <TransitionLink
                key={label}
                to={buildListUrl(value, null)}
                className={cn(
                  'rounded-full border px-4 py-2 font-technical text-label-sm uppercase tracking-[var(--tracking-label)]',
                  'motion-safe:transition-colors motion-reduce:transition-none',
                  active
                    ? 'border-[var(--gold)] bg-[var(--gold)]/15 text-[var(--gold)]'
                    : 'border-[var(--gold)]/60 text-[var(--gold)] hover:bg-[var(--gold)]/10',
                )}
              >
                {label}
              </TransitionLink>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function GoldStripPill({
  label,
  to,
  active,
}: {
  label: string;
  to: string;
  active: boolean;
}) {
  return (
    <TransitionLink
      to={to}
      className={cn(
        'rounded-full px-3 py-1.5 font-technical text-label-sm uppercase tracking-[var(--tracking-label)]',
        'motion-safe:transition-colors motion-reduce:transition-none',
        active
          ? 'bg-[var(--navy-dark)] text-[var(--warm-white)]'
          : 'bg-transparent text-[var(--navy-dark)]/80 hover:bg-[var(--navy-dark)]/10',
      )}
    >
      {label}
    </TransitionLink>
  );
}

function CategoryGoldStrip({
  categories,
  tags,
  categoryFilter,
  tagFilter,
}: {
  categories: string[];
  tags: string[];
  categoryFilter: string | null;
  tagFilter: string | null;
}) {
  return (
    <div className="sticky top-[var(--site-nav-height)] z-30 border-y border-[var(--navy-dark)]/20 bg-[var(--gold)] text-[var(--navy-dark)]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <span className="shrink-0 font-technical text-label-sm font-semibold uppercase tracking-[var(--tracking-label)]">
          Filter by topic
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          <GoldStripPill
            label="All"
            to="/blog"
            active={!categoryFilter && !tagFilter}
          />
          {categories.map((c) => (
            <GoldStripPill
              key={c}
              label={c}
              to={buildListUrl(c, tagFilter)}
              active={taxonomyMatches(categoryFilter, c)}
            />
          ))}
          {tags.slice(0, 8).map((t) => (
            <GoldStripPill
              key={t}
              label={t}
              to={buildListUrl(categoryFilter, t)}
              active={taxonomyMatches(tagFilter, t)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const searchInputId = useId();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const categoryParam = searchParams.get('category');
  const tagParam = searchParams.get('tag');

  const categories = useMemo(() => getAllCategories(), []);
  const tags = useMemo(() => getAllTags(), []);

  const categoryFilter = useMemo(
    () => resolveTaxonomyParam(categoryParam, categories),
    [categoryParam, categories],
  );
  const tagFilter = useMemo(
    () => resolveTaxonomyParam(tagParam, tags),
    [tagParam, tags],
  );

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
    <PageShell className="bg-[var(--navy)] text-[var(--warm-white)]">
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

      <main id="main-content" className="w-full flex-1">
        <BlogIndexHero categories={categories} activeCategory={categoryFilter} />

        <CategoryGoldStrip
          categories={categories}
          tags={tags}
          categoryFilter={categoryFilter}
          tagFilter={tagFilter}
        />

        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <section
            aria-label="Search posts"
            className="rounded-xl border border-[var(--gold)]/10 bg-[var(--slate)]/40 p-4 md:p-5"
          >
            <label htmlFor={searchInputId} className="sr-only">
              Search posts by title, excerpt, or tag
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
                aria-hidden
              />
              <input
                id={searchInputId}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, excerpt, or tags"
                className="w-full rounded-lg border border-[var(--gold)]/15 bg-[var(--navy-dark)] py-2.5 pl-10 pr-10 font-technical text-base text-[var(--warm-white)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                autoComplete="off"
              />
              {hasSearch ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--warm-white)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            {(hasFilters || hasSearch) && (
              <p className="mt-3 font-technical text-sm text-[var(--text-muted)]">
                Showing{' '}
                <span className="font-medium text-[var(--warm-white)]">
                  {filteredPosts.length}
                </span>{' '}
                of{' '}
                <span className="font-medium text-[var(--warm-white)]">
                  {blogPosts.length}
                </span>{' '}
                posts.{' '}
                <TransitionLink
                  to="/blog"
                  className="text-[var(--gold)] hover:underline"
                  onClick={() => setSearchQuery('')}
                >
                  Clear all
                </TransitionLink>
              </p>
            )}
          </section>
        </div>

        {featuredPost ? <FeaturedPost post={featuredPost} /> : null}

        {gridPosts.length > 0 ? (
          <section className="bg-[var(--navy)] py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 font-display text-heading-lg text-[var(--warm-white)]">
                All posts
              </h2>
              <PostGrid posts={gridPosts} />
            </div>
          </section>
        ) : null}

        {blogPosts.length > 0 ? <BlogNewsletterStrip /> : null}

        {(emptyFilterResult || emptySearchResult) && blogPosts.length > 0 ? (
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <p className="font-technical text-base text-[var(--text-muted)]">
              No posts match{hasSearch ? ' your search' : ''}
              {hasFilters ? ' and filters' : ''}.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {hasSearch ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="font-technical text-sm font-medium text-[var(--gold)] hover:underline"
                >
                  Clear search
                </button>
              ) : null}
              {hasFilters ? (
                <TransitionLink
                  to="/blog"
                  className="font-technical text-sm font-medium text-[var(--gold)] hover:underline"
                >
                  View all posts
                </TransitionLink>
              ) : null}
            </div>
          </div>
        ) : null}

        {blogPosts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-technical text-[var(--text-muted)]">
              No posts yet. Check back soon.
            </p>
          </div>
        ) : null}
      </main>
    </PageShell>
  );
}

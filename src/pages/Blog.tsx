import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import {
  blogPosts,
  getAllCategories,
  getAllTags,
  postMatchesFilters,
} from '../data/blog-posts';
import { BlogTaxonomy, BlogFilterChip } from '../components/BlogTaxonomy';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
} from '../lib/site-config';

const BLOG_INDEX_TITLE = 'Writing — AI, cloud, culture & code';
const BLOG_INDEX_DESCRIPTION =
  'Articles on AI agents, cloud architecture, South African tech, isiXhosa heritage, vibe coding, payments, and building software that matters.';

function buildListUrl(category: string | null, tag: string | null): string {
  const p = new URLSearchParams();
  if (category) p.set('category', category);
  if (tag) p.set('tag', tag);
  const q = p.toString();
  return q ? `/blog?${q}` : '/blog';
}

export default function Blog() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const tagFilter = searchParams.get('tag');

  const categories = useMemo(() => getAllCategories(), []);
  const tags = useMemo(() => getAllTags(), []);

  const filteredPosts = useMemo(
    () => blogPosts.filter((p) => postMatchesFilters(p, categoryFilter, tagFilter)),
    [categoryFilter, tagFilter],
  );

  const hasFilters = Boolean(categoryFilter || tagFilter);

  const keywordStr = useMemo(() => tags.slice(0, 24).join(', '), [tags]);

  const blogListingJsonLd = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `Writing — ${SITE_NAME}`,
        description: BLOG_INDEX_DESCRIPTION,
        url: absoluteUrl('/blog'),
        author: {
          '@type': 'Person',
          name: SITE_NAME,
          url: absoluteUrl('/'),
        },
        blogPost: blogPosts.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          url: absoluteUrl(`/blog/${p.slug}`),
          description: p.excerpt,
        })),
      }),
    [blogPosts],
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
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
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{blogListingJsonLd}</script>
      </Helmet>
      <nav className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Writing</h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Thoughts on technology, cloud engineering, and building software that makes an impact.
          </p>

          <div className="space-y-4 p-4 rounded-xl bg-card border border-border">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
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
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
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
            {hasFilters && (
              <p className="text-sm text-muted-foreground pt-1 border-t border-border">
                Showing <span className="text-foreground font-medium">{filteredPosts.length}</span> of{' '}
                <span className="text-foreground font-medium">{blogPosts.length}</span> posts
                {categoryFilter && (
                  <>
                    {' '}
                    · category <span className="text-primary">{categoryFilter}</span>
                  </>
                )}
                {tagFilter && (
                  <>
                    {' '}
                    · tag <span className="text-foreground">{tagFilter}</span>
                  </>
                )}
                .{' '}
                <Link to="/blog" className="text-primary hover:underline">
                  Clear filters
                </Link>
              </p>
            )}
          </div>
        </header>

        <div className="space-y-8">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group p-6 -mx-6 rounded-lg hover:bg-card transition-colors border border-transparent hover:border-border"
            >
              <Link to={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {post.title}
                </h2>

                <p className="text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>

                <div className="flex items-center gap-2 text-sm text-primary mb-4">
                  <span>Read more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <BlogTaxonomy categories={post.categories} tags={post.tags} size="sm" />
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && blogPosts.length > 0 && (
          <div className="text-center py-16 rounded-lg border border-dashed border-border">
            <p className="text-muted-foreground mb-4">No posts match these filters.</p>
            <Link to="/blog" className="text-primary hover:underline text-sm font-medium">
              View all posts
            </Link>
          </div>
        )}

        {blogPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No posts yet. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}

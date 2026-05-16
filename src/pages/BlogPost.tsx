import { useMemo, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { blogPosts, getPostThumbnailSources } from '../data/blog-posts';
import type { BlogPost } from '../data/blog-posts';
import { BlogTaxonomy } from '../components/BlogTaxonomy';
import BlogCommercialCta from '../components/BlogCommercialCta';
import { BlogPostHero } from '../components/BlogPostHero';
import { BlogToc } from '../components/BlogToc';
import { BlogShare } from '../components/BlogShare';
import { BlogRelatedPosts } from '../components/BlogRelatedPosts';
import { BlogImageDisclaimer } from '../components/BlogImageDisclaimer';
import EspazzaStatusBanner, { postMentionsEspazza } from '../components/EspazzaStatusBanner';
import NotFound from './NotFound';
import { DiscussionEmbed } from 'disqus-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import {
  absoluteUrl,
  absoluteMediaUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  parsePostDateForSchema,
  DISQUS_SHORTNAME,
} from '../lib/site-config';
import {
  extractHeadingsFromMarkdown,
  headingToId,
  type TocEntry,
} from '../lib/blog-headings';
import { normalizeBlogImageSrc } from '../lib/blog-image-path';
import { AuthorBio, AuthorByline } from '../components/AuthorBio';
import { PageBreadcrumbs } from '../components/PageBreadcrumbs';
import { SiteFooter } from '../components/SiteFooter';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
} from '../lib/entity-schema';

const CITE_HREF = /^#cite-(\d+)$/;

/** In-article citation: small superscript-style [n] linking to Works cited. */
function CitationRef({ href }: { href: string }) {
  const m = href.match(CITE_HREF);
  const n = m?.[1] ?? '';
  return (
    <a
      href={href}
      title={`Source [${n}] in Works cited`}
      className='not-prose ms-0.5 inline-block align-super text-[0.68em] font-semibold leading-none text-primary no-underline hover:underline decoration-primary/70 underline-offset-2'
    >
      [{n}]
    </a>
  );
}

function MarkdownAnchor({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (href && CITE_HREF.test(href)) {
    return <CitationRef href={href} />;
  }
  return (
    <a
      href={href}
      className='text-primary hover:underline'
      target='_blank'
      rel='noopener noreferrer'
    >
      {children}
    </a>
  );
}

function getHeadingText(children: ReactNode): string {
  if (children == null) return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(getHeadingText).join('');
  if (typeof children === 'object' && 'props' in children) {
    const props = (children as { props?: { children?: ReactNode } }).props;
    return getHeadingText(props?.children);
  }
  return '';
}

function makeHeadingRenderer(level: 2 | 3, entries: TocEntry[]) {
  let cursor = 0;
  const Tag = level === 2 ? 'h2' : 'h3';
  const className =
    level === 2
      ? 'scroll-mt-28 text-xl font-semibold text-foreground mt-10 mb-4'
      : 'scroll-mt-28 text-lg font-semibold text-foreground mt-8 mb-3';

  return function MarkdownHeading({ children }: { children?: ReactNode }) {
    let id = headingToId(getHeadingText(children));
    while (cursor < entries.length && entries[cursor].level !== level) {
      cursor += 1;
    }
    if (cursor < entries.length && entries[cursor].level === level) {
      id = entries[cursor].id;
      cursor += 1;
    }
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  };
}

function MarkdownImage({
  src,
  alt,
}: {
  src?: string;
  alt?: string;
}) {
  const normalized = normalizeBlogImageSrc(src);
  if (!normalized) return null;
  return (
    <img
      src={normalized}
      alt={alt ?? ''}
      loading='lazy'
      decoding='async'
      className='my-8 w-full max-w-full rounded-lg border border-border object-cover'
    />
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  return <BlogPostView post={post} />;
}

function BlogPostView({ post }: { post: BlogPost }) {
  const canonical = absoluteUrl(`/blog/${post.slug}`);
  const pageTitle = `${post.title} | Writing | ${SITE_NAME}`;
  const datePublished = parsePostDateForSchema(post.date);
  const keywords = [...post.categories, ...post.tags]
    .filter(Boolean)
    .join(', ');
  const shareImagePath = post.ogImage || post.headerImage;
  const shareImageUrl = shareImagePath
    ? absoluteMediaUrl(shareImagePath)
    : DEFAULT_OG_IMAGE;
  const heroImagePath = post.headerImage || post.ogImage;
  const heroSources = heroImagePath
    ? getPostThumbnailSources({
        ...post,
        headerImage: heroImagePath,
        ogImage: heroImagePath,
      })
    : undefined;

  const tocEntries = useMemo(
    () => extractHeadingsFromMarkdown(post.content),
    [post.content],
  );

  const markdownComponents = useMemo(
    () => ({
      h1: ({ children }: { children?: ReactNode }) => (
        <h1 className='scroll-mt-28 text-2xl font-bold text-foreground mt-12 mb-4'>
          {children}
        </h1>
      ),
      h2: makeHeadingRenderer(2, tocEntries),
      h3: makeHeadingRenderer(3, tocEntries),
      p: ({ children }: { children?: ReactNode }) => (
        <p className='text-muted-foreground leading-relaxed mb-6'>{children}</p>
      ),
      ul: ({ children }: { children?: ReactNode }) => (
        <ul className='list-disc list-inside space-y-2 text-muted-foreground mb-6'>
          {children}
        </ul>
      ),
      ol: ({ children }: { children?: ReactNode }) => (
        <ol className='list-decimal list-inside space-y-2 text-muted-foreground mb-6'>
          {children}
        </ol>
      ),
      li: ({ children }: { children?: ReactNode }) => (
        <li className='text-muted-foreground'>{children}</li>
      ),
      a: ({ href, children }: { href?: string; children?: ReactNode }) => (
        <MarkdownAnchor href={href}>{children}</MarkdownAnchor>
      ),
      img: MarkdownImage,
      code: ({
        className,
        children,
      }: {
        className?: string;
        children?: ReactNode;
      }) => {
        const isBlock = className?.includes('language-');
        if (isBlock) {
          return (
            <pre className='bg-card border border-border rounded-lg p-4 overflow-x-auto mb-6'>
              <code className='text-sm font-mono text-foreground'>
                {children}
              </code>
            </pre>
          );
        }
        return (
          <code className='bg-card px-1.5 py-0.5 rounded text-sm font-mono text-primary'>
            {children}
          </code>
        );
      },
      pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
      blockquote: ({ children }: { children?: ReactNode }) => (
        <blockquote className='border-l-2 border-primary pl-4 italic text-muted-foreground mb-6'>
          {children}
        </blockquote>
      ),
      hr: () => <hr className='border-border my-8' />,
      strong: ({ children }: { children?: ReactNode }) => (
        <strong className='text-foreground font-semibold'>{children}</strong>
      ),
      em: ({ children }: { children?: ReactNode }) => (
        <em className='italic'>{children}</em>
      ),
      table: ({ children }: { children?: ReactNode }) => (
        <div className='not-prose my-6 overflow-x-auto rounded-lg border border-border'>
          <table className='w-full min-w-[min(100%,20rem)] border-collapse text-sm'>
            {children}
          </table>
        </div>
      ),
      thead: ({ children }: { children?: ReactNode }) => (
        <thead className='border-b border-border bg-card/50'>{children}</thead>
      ),
      tbody: ({ children }: { children?: ReactNode }) => <tbody>{children}</tbody>,
      tr: ({ children }: { children?: ReactNode }) => (
        <tr className='border-b border-border/50 last:border-0'>{children}</tr>
      ),
      th: ({ children }: { children?: ReactNode }) => (
        <th className='px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-foreground'>
          {children}
        </th>
      ),
      td: ({ children }: { children?: ReactNode }) => (
        <td className='px-3 py-2.5 align-top text-muted-foreground first:text-foreground/90'>
          {children}
        </td>
      ),
    }),
    [tocEntries],
  );

  const disqusConfig = useMemo(
    () => ({
      url: canonical,
      identifier: post.slug,
      title: post.title,
    }),
    [canonical, post.slug, post.title],
  );

  const dateModifiedIso = parsePostDateForSchema(post.dateModified ?? '');

  const articleJsonLd = useMemo(
    () =>
      JSON.stringify(
        buildBlogPostingSchema({
          post,
          canonical,
          shareImageUrl,
          dateModified: dateModifiedIso,
        }),
      ),
    [post, canonical, shareImageUrl, dateModifiedIso],
  );

  const breadcrumbJsonLd = useMemo(
    () =>
      JSON.stringify(
        buildBreadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Writing', path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]),
      ),
    [post.slug, post.title],
  );

  return (
    <div className='min-h-screen bg-background text-foreground font-sans flex flex-col'>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name='description' content={post.excerpt} />
        {keywords ? <meta name='keywords' content={keywords} /> : null}
        <link rel='canonical' href={canonical} />
        <meta property='og:type' content='article' />
        <meta property='og:url' content={canonical} />
        <meta property='og:title' content={post.title} />
        <meta property='og:description' content={post.excerpt} />
        <meta property='og:image' content={shareImageUrl} />
        <meta property='og:image:alt' content={post.title} />
        <meta property='og:locale' content='en_ZA' />
        <meta property='article:author' content={SITE_NAME} />
        {datePublished ? (
          <meta
            property='article:published_time'
            content={`${datePublished}T12:00:00+02:00`}
          />
        ) : null}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={post.title} />
        <meta name='twitter:description' content={post.excerpt} />
        <meta name='twitter:image' content={shareImageUrl} />
        <meta name='twitter:site' content={TWITTER_HANDLE} />
        <meta name='twitter:creator' content={TWITTER_HANDLE} />
        <meta name='robots' content='index, follow, max-image-preview:large' />
        <script type='application/ld+json'>{articleJsonLd}</script>
        <script type='application/ld+json'>{breadcrumbJsonLd}</script>
      </Helmet>

      <nav className='border-b border-border'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 py-4'>
          <Link
            to='/blog'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Back to writing</span>
          </Link>
        </div>
      </nav>

      <main className='flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12'>
        <PageBreadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Writing', to: '/blog' },
            { label: post.title },
          ]}
        />
        <article className='mt-6 md:mt-8'>
          {heroSources ? (
            <BlogPostHero
              src={normalizeBlogImageSrc(heroSources.primary) ?? heroSources.primary}
              alt={`Featured image for ${post.title}`}
              fallbackSrc={
                heroSources.fallback
                  ? normalizeBlogImageSrc(heroSources.fallback) ??
                    heroSources.fallback
                  : undefined
              }
            />
          ) : null}

          <ScrollReveal className='mb-10 mt-8 md:mt-10 block'>
            <AuthorByline
              date={post.date}
              readTime={post.readTime}
              className='mb-6'
            />

            <h1 className='text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground mb-4 text-balance leading-tight'>
              {post.title}
            </h1>

            <p className='text-lg text-muted-foreground mb-6 max-w-3xl leading-relaxed'>
              {post.excerpt}
            </p>

            <BlogTaxonomy
              categories={post.categories}
              tags={post.tags}
              size='md'
            />

            {postMentionsEspazza(post.tags) ? (
              <div className='mt-6'>
                <EspazzaStatusBanner />
              </div>
            ) : null}
          </ScrollReveal>

          <div className='lg:grid lg:grid-cols-[minmax(0,13.5rem)_minmax(0,1fr)] lg:gap-x-10 xl:gap-x-12'>
            <BlogToc markdown={post.content} className='mb-8 lg:mb-0' />

            <div className='min-w-0'>
              <BlogImageDisclaimer />
              <div className='prose prose-invert prose-lg max-w-none'>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={markdownComponents}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              <ScrollReveal className='block'>
                <BlogCommercialCta
                  variant={
                    post.categories.some((c) =>
                      ['Engineering', 'AI', 'Product', 'Career', 'Cloud'].includes(
                        c,
                      ),
                    )
                      ? 'engineering'
                      : 'default'
                  }
                />
              </ScrollReveal>

              <AuthorBio />

              <BlogShare
                url={`/blog/${post.slug}`}
                title={post.title}
                className='mt-10'
              />

              <section
                className='not-prose mt-16 border-t border-border pt-10'
                aria-labelledby='blog-comments-heading'
              >
                <h2
                  id='blog-comments-heading'
                  className='text-xl font-semibold text-foreground mb-6'
                >
                  Comments
                </h2>
                <DiscussionEmbed
                  shortname={DISQUS_SHORTNAME}
                  config={disqusConfig}
                />
              </section>
            </div>
          </div>

          <ScrollReveal className='mt-16 md:mt-20 block'>
            <BlogRelatedPosts post={post} />
          </ScrollReveal>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

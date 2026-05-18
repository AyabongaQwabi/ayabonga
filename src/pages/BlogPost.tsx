import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Helmet } from 'react-helmet-async';
import { blogPosts, getPostThumbnailSources } from '../data/blog-posts';
import type { BlogPost } from '../data/blog-posts';
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
  headingLabelFromRaw,
  headingToId,
  type TocEntry,
} from '../lib/blog-headings';
import { normalizeBlogImageSrc } from '../lib/blog-image-path';
import { AuthorBio, AuthorByline } from '../components/AuthorBio';
import { PageBreadcrumbs } from '../components/PageBreadcrumbs';
import { ReadingProgress } from '../components/ui/ReadingProgress';
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
} from '../lib/entity-schema';
import {
  lineReveal,
  refreshScrollTriggers,
  registerEasings,
  scheduleAfterPageCurtain,
  scrambleDecode,
  subtleFadeUp,
  whenMotionReady,
} from '../lib/animations';
import { getLenis } from '../lib/lenis';
import { cn } from '../lib/utils';
import { TransitionLink } from '../components/ui/TransitionLink';
import { TechLogo } from '../components/ui/TechLogo';
import { resolveTechLogo } from '../lib/tech-logos';

const CITE_HREF = /^#cite-(\d+)$/;

function CitationRef({ href }: { href: string }) {
  const m = href.match(CITE_HREF);
  const n = m?.[1] ?? '';
  return (
    <a
      href={href}
      title={`Source [${n}] in Works cited`}
      className="not-prose ms-0.5 inline-block align-super text-[0.68em] font-semibold leading-none text-[var(--gold)] no-underline hover:underline decoration-[var(--gold)]/70 underline-offset-2"
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
  if (href?.startsWith('#')) {
    return (
      <a
        href={href}
        className="text-[var(--gold)] no-underline hover:underline"
      >
        {children}
      </a>
    );
  }
  if (href?.startsWith('/')) {
    return (
      <TransitionLink
        to={href}
        className="text-[var(--gold)] no-underline hover:underline"
      >
        {children}
      </TransitionLink>
    );
  }
  return (
    <a
      href={href}
      className="text-[var(--gold)] no-underline hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function getHeadingText(children: ReactNode): string {
  if (children == null) return '';
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) {
    return children
      .map(getHeadingText)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  if (typeof children === 'object' && 'props' in children) {
    const el = children as {
      type?: string;
      props?: { children?: ReactNode; alt?: string };
    };
    if (el.type === 'img' && typeof el.props?.alt === 'string') {
      return el.props.alt;
    }
    return getHeadingText(el.props?.children);
  }
  return '';
}

function AnimatedHeading({
  level,
  id,
  className,
  children,
}: {
  level: 2 | 3;
  id: string;
  className: string;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const Tag = level === 2 ? 'h2' : 'h3';

  useEffect(() => {
    if (ref.current) subtleFadeUp(ref.current);
  }, []);

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

function makeHeadingRenderer(level: 2 | 3, entries: TocEntry[]) {
  let cursor = 0;
  const className =
    level === 2
      ? 'scroll-mt-32 font-sans text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-[var(--warm-white)] mt-10 mb-4'
      : 'scroll-mt-32 font-sans text-[clamp(1.25rem,2vw,1.625rem)] font-semibold text-[var(--warm-white)] mt-8 mb-3';

  return function MarkdownHeading({ children }: { children?: ReactNode }) {
    let id = headingToId(headingLabelFromRaw(getHeadingText(children)));
    while (cursor < entries.length && entries[cursor].level !== level) {
      cursor += 1;
    }
    if (cursor < entries.length && entries[cursor].level === level) {
      id = entries[cursor].id;
      cursor += 1;
    }
    return (
      <AnimatedHeading level={level} id={id} className={className}>
        {children}
      </AnimatedHeading>
    );
  };
}

function isBlogFigureElement(child: ReactNode): boolean {
  return (
    isValidElement(child) &&
    typeof child.props === 'object' &&
    child.props !== null &&
    'data-blog-figure' in child.props &&
    (child.props as { 'data-blog-figure'?: boolean })['data-blog-figure'] === true
  );
}

function createMarkdownImageRenderer(heroImageSrc: string | undefined) {
  return function MarkdownImage({
    src,
    alt,
  }: {
    src?: string;
    alt?: string;
  }) {
    const normalized = normalizeBlogImageSrc(src);
    if (!normalized) return null;
    if (heroImageSrc && normalized === heroImageSrc) return null;

    const isSvg = /\.svg(?:$|[?#])/i.test(normalized);

    return (
      <figure
        data-blog-figure
        className="not-prose -mx-4 my-10 sm:-mx-8"
      >
        <img
          src={normalized}
          alt={alt ?? ''}
          loading="lazy"
          decoding="async"
          className={cn(
            'w-full rounded-sm border border-[var(--gold)]/10',
            isSvg
              ? 'h-auto max-h-[min(70vh,32rem)] bg-[var(--navy-dark)]/50 object-contain p-4'
              : 'object-cover opacity-90 mix-blend-luminosity',
          )}
        />
      </figure>
    );
  };
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  return <BlogPostView key={post.slug} post={post} />;
}

function BlogPostView({ post }: { post: BlogPost }) {
  const categoryRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

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
  const heroImageNormalized = heroImagePath
    ? normalizeBlogImageSrc(heroImagePath)
    : undefined;
  const heroSources = heroImagePath
    ? getPostThumbnailSources({
        ...post,
        headerImage: heroImagePath,
        ogImage: heroImagePath,
      })
    : undefined;

  const primaryCategory = post.categories[0] ?? 'Writing';

  const tocEntries = useMemo(
    () => extractHeadingsFromMarkdown(post.content),
    [post.content],
  );

  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    refreshScrollTriggers();
  }, [post.slug]);

  useEffect(() => {
    let cancelled = false;
    let cancelCurtain: (() => void) | undefined;
    let cleanupTitle: (() => void) | null = null;

    registerEasings();

    void whenMotionReady().then(() => {
      if (cancelled) return;

      cancelCurtain = scheduleAfterPageCurtain(() => {
        if (cancelled) return;

        if (categoryRef.current) {
          scrambleDecode(categoryRef.current, { delay: 0.1 });
        }
        if (titleRef.current) {
          cleanupTitle = lineReveal(titleRef.current, {
            delay: 0.12,
            stagger: 0.08,
          });
        }
        if (metaRef.current) {
          const reduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
          ).matches;
          if (!reduced) {
            metaRef.current.style.opacity = '0';
            metaRef.current.animate(
              [
                { opacity: 0, transform: 'translateY(8px)' },
                { opacity: 1, transform: 'translateY(0)' },
              ],
              {
                delay: 850,
                duration: 400,
                fill: 'forwards',
                easing: 'ease-out',
              },
            );
          }
        }
      });
    });

    return () => {
      cancelled = true;
      cancelCurtain?.();
      cleanupTitle?.();
      if (metaRef.current) {
        metaRef.current.style.opacity = '';
      }
    };
  }, [post.slug]);

  const markdownComponents = useMemo(() => {
    let isFirstParagraph = true;
    return {
      h1: ({ children }: { children?: ReactNode }) => (
        <h1 className="scroll-mt-32 font-sans text-2xl font-bold text-[var(--warm-white)] mt-12 mb-4">
          {children}
        </h1>
      ),
      h2: makeHeadingRenderer(2, tocEntries),
      h3: makeHeadingRenderer(3, tocEntries),
      p: ({ children }: { children?: ReactNode }) => {
        const childList = Children.toArray(children);
        if (
          childList.length === 1 &&
          isBlogFigureElement(childList[0])
        ) {
          return <>{children}</>;
        }

        const isDropCap = isFirstParagraph;
        if (isFirstParagraph) isFirstParagraph = false;
        return (
          <p
            className={cn(
              'mb-6 font-technical text-[17px] leading-[1.72] text-[#C8D3E0]',
              isDropCap &&
                'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[5em] first-letter:leading-[0.8] first-letter:text-[var(--gold)]',
            )}
          >
            {children}
          </p>
        );
      },
      ul: ({ children }: { children?: ReactNode }) => (
        <ul className="mb-6 list-disc space-y-2 pl-5 font-technical text-[17px] leading-[1.72] text-[#C8D3E0]">
          {children}
        </ul>
      ),
      ol: ({ children }: { children?: ReactNode }) => (
        <ol className="mb-6 list-decimal space-y-2 pl-5 font-technical text-[17px] leading-[1.72] text-[#C8D3E0]">
          {children}
        </ol>
      ),
      li: ({ children }: { children?: ReactNode }) => (
        <li className="text-[#C8D3E0]">{children}</li>
      ),
      a: ({ href, children }: { href?: string; children?: ReactNode }) => (
        <MarkdownAnchor href={href}>{children}</MarkdownAnchor>
      ),
      img: createMarkdownImageRenderer(heroImageNormalized),
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
            <pre className="mb-6 overflow-x-auto rounded-lg border-l-[3px] border-[var(--emerald)] bg-[var(--navy-dark)] p-4">
              <code className="font-mono text-sm text-[var(--warm-white)]">
                {children}
              </code>
            </pre>
          );
        }
        const inlineText =
          typeof children === 'string'
            ? children
            : Array.isArray(children)
              ? children.map((c) => (typeof c === 'string' ? c : '')).join('')
              : '';
        const techLabel = inlineText.trim();
        const techLogo =
          techLabel && !/\s/.test(techLabel) ? resolveTechLogo(techLabel) : null;
        if (techLogo) {
          return (
            <code className="inline-flex items-center gap-1 rounded bg-[var(--slate)] px-1.5 py-0.5 font-mono text-sm text-[var(--gold)] align-middle">
              <TechLogo name={techLabel} size={14} className="translate-y-px" />
              {children}
            </code>
          );
        }
        return (
          <code className="rounded bg-[var(--slate)] px-1.5 py-0.5 font-mono text-sm text-[var(--gold)]">
            {children}
          </code>
        );
      },
      pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
      blockquote: ({ children }: { children?: ReactNode }) => (
        <blockquote className="mb-6 border-l-[3px] border-[var(--gold)] pl-6 text-lg italic text-[var(--warm-white)]">
          {children}
        </blockquote>
      ),
      hr: () => <hr className="my-10 border-[var(--gold)]/15" />,
      strong: ({ children }: { children?: ReactNode }) => (
        <strong className="font-semibold text-[var(--warm-white)]">{children}</strong>
      ),
      em: ({ children }: { children?: ReactNode }) => (
        <em className="italic">{children}</em>
      ),
      table: ({ children }: { children?: ReactNode }) => (
        <div className="not-prose my-6 overflow-x-auto rounded-lg border border-[var(--gold)]/10">
          <table className="w-full min-w-[min(100%,20rem)] border-collapse text-sm">
            {children}
          </table>
        </div>
      ),
      thead: ({ children }: { children?: ReactNode }) => (
        <thead className="border-b border-[var(--gold)]/15 bg-[var(--slate)]/50">
          {children}
        </thead>
      ),
      tbody: ({ children }: { children?: ReactNode }) => <tbody>{children}</tbody>,
      tr: ({ children }: { children?: ReactNode }) => (
        <tr className="border-b border-[var(--gold)]/10 last:border-0">{children}</tr>
      ),
      th: ({ children }: { children?: ReactNode }) => (
        <th className="px-3 py-2.5 text-left font-technical text-xs font-semibold uppercase tracking-wide text-[var(--warm-white)]">
          {children}
        </th>
      ),
      td: ({ children }: { children?: ReactNode }) => (
        <td className="px-3 py-2.5 align-top font-technical text-[17px] leading-[1.72] text-[#C8D3E0]">
          {children}
        </td>
      ),
    };
  }, [tocEntries, heroImageNormalized]);

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
    <PageShell className="bg-[var(--navy)] text-[var(--warm-white)]">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={post.excerpt} />
        {keywords ? <meta name="keywords" content={keywords} /> : null}
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={shareImageUrl} />
        <meta property="og:image:alt" content={post.title} />
        <meta property="og:locale" content="en_ZA" />
        <meta property="article:author" content={SITE_NAME} />
        {datePublished ? (
          <meta
            property="article:published_time"
            content={`${datePublished}T12:00:00+02:00`}
          />
        ) : null}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={shareImageUrl} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <script type="application/ld+json">{articleJsonLd}</script>
        <script type="application/ld+json">{breadcrumbJsonLd}</script>
      </Helmet>

      <ReadingProgress />

      <main id="main-content" className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PageBreadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Writing', to: '/blog' },
              { label: post.title },
            ]}
          />
        </div>

        <header className="relative flex min-h-[70vh] flex-col justify-end bg-[var(--navy-dark)] lg:min-h-[80vh]">
          <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-end lg:gap-12">
              <div className="min-w-0 max-w-4xl">
                <p
                  ref={categoryRef}
                  className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--gold)]"
                >
                  {primaryCategory}
                  {post.readTime ? ` · ${post.readTime}` : ''}
                </p>

                <h1
                  ref={titleRef}
                  className="mt-6 font-display text-display-lg font-semibold leading-[var(--leading-editorial)] tracking-[var(--tracking-display)] text-[var(--warm-white)] text-balance"
                >
                  {post.title}
                </h1>

                <p className="mt-6 max-w-2xl font-technical text-lg leading-[var(--leading-body)] text-[var(--text-muted)]">
                  {post.excerpt}
                </p>

                <hr
                  className="mt-8 border-0 border-t border-[var(--gold)]/20"
                  aria-hidden
                />

                <div ref={metaRef} className="mt-8 space-y-6">
                  <AuthorByline date={post.date} readTime={post.readTime} />
                  <BlogShare
                    url={`/blog/${post.slug}`}
                    title={post.title}
                    className="not-prose"
                  />
                </div>

                {postMentionsEspazza(post.tags) ? (
                  <div className="mt-6">
                    <EspazzaStatusBanner />
                  </div>
                ) : null}
              </div>

              {heroSources ? (
                <BlogPostHero
                  src={
                    normalizeBlogImageSrc(heroSources.primary) ??
                    heroSources.primary
                  }
                  alt={`Featured image for ${post.title}`}
                  fallbackSrc={
                    heroSources.fallback
                      ? normalizeBlogImageSrc(heroSources.fallback) ??
                        heroSources.fallback
                      : undefined
                  }
                  className="lg:mb-2"
                />
              ) : null}
            </div>
          </div>
        </header>

        <article data-reading-article className="bg-[var(--navy)] py-12 md:py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-stretch lg:gap-12 lg:px-8">
            <aside className="lg:order-2 lg:w-60 lg:shrink-0">
              <BlogToc headings={tocEntries} />
            </aside>

            <div className="min-w-0 flex-1 lg:order-1">
              <div className="mx-auto max-w-[680px]">
                
                <div className="blog-post-body">
                  <ReactMarkdown
                    key={post.slug}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={markdownComponents}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>

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

                <AuthorBio />

                <section
                  className="not-prose mt-16 border-t border-[var(--gold)]/15 pt-10"
                  aria-labelledby="blog-comments-heading"
                >
                  <h2
                    id="blog-comments-heading"
                    className="mb-6 font-display text-heading-md font-semibold text-[var(--warm-white)]"
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
          </div>

          <div className="mx-auto mt-16 max-w-7xl border-t border-[var(--gold)]/10 bg-[var(--slate)] px-4 py-16 sm:px-6 lg:px-8">
            <BlogRelatedPosts post={post} />
          </div>
          <BlogImageDisclaimer />
        </article>
      </main>
    </PageShell>
  );
}

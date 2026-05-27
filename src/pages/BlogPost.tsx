import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { Helmet } from 'react-helmet-async';
import { blogPosts, getPostThumbnailSources } from '../data/blog-posts';
import type { BlogPost } from '../data/blog-posts';
import { designCategories } from '../data/design-styles';
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
import { BlogMermaid } from '../components/BlogMermaid';
import './design-styles.css';

const CITE_HREF = /^#cite-(\d+)$/;
const DESIGN_STYLES_SLUG = 'modern-web-design-styles';

/** Plain text inside react-markdown `code` nodes (used for Mermaid source). */
function markdownCodeChildrenToString(children: ReactNode): string {
  const parts: string[] = [];
  const walk = (node: ReactNode) => {
    if (node == null || node === false) return;
    if (typeof node === 'string' || typeof node === 'number') {
      parts.push(String(node));
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (isValidElement(node) && node.props && 'children' in node.props) {
      walk((node.props as { children?: ReactNode }).children);
    }
  };
  walk(children);
  return parts.join('');
}

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

function DesignStylesGuide() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const normalizedQuery = query.trim().toLowerCase();
  const visibleCategories = useMemo(
    () =>
      designCategories
        .map((category) => ({
          ...category,
          styles: category.styles.filter((style) => {
            const matchesCategory =
              activeCategory === 'all' || style.category === activeCategory;
            const matchesQuery =
              !normalizedQuery ||
              [style.title, style.desc, style.bestFor, style.tag]
                .join(' ')
                .toLowerCase()
                .includes(normalizedQuery);
            return matchesCategory && matchesQuery;
          }),
        }))
        .filter((category) => category.styles.length > 0),
    [activeCategory, normalizedQuery],
  );

  const visibleCount = visibleCategories.reduce(
    (total, category) => total + category.styles.length,
    0,
  );
  const totalCount = designCategories.reduce(
    (total, category) => total + category.styles.length,
    0,
  );

  return (
    <div className="design-styles-post not-prose -mx-4 sm:-mx-6 lg:-mx-8">
      <section className="intro">
        <div className="container">
          <div className="intro-grid">
            <div>
              <h2 className="section-title">What is web design, really?</h2>
              <p className="section-text">
                Web design is the discipline of shaping how a digital product
                looks, feels, and communicates. It is decision-making: every
                colour, font, layout, and animation either builds trust or
                weakens it.
              </p>
              <p className="section-text">
                At its core, design is a communication tool. It says who this is
                for, what it does, and why you should care before you read a
                single word.
              </p>
              <div className="callout-box">
                <p>
                  <strong>Design is the first language users read.</strong>{' '}
                  Before they process your copy, they have already decided
                  whether they trust you. That decision happens in milliseconds,
                  driven by visual choices.
                </p>
              </div>
            </div>
            <div>
              <h2 className="section-title">What are design styles?</h2>
              <p className="section-text">
                A design style, or aesthetic direction, is a coherent visual
                language. It is a collection of decisions about typography,
                colour, spacing, imagery, interaction, and layout that create a
                specific feeling.
              </p>
              <p className="section-text">
                Think of it like genre in music. Jazz and punk both use
                instruments, but they produce completely different feelings.
                Brutalism and luxury minimalism both use HTML and CSS, but they
                communicate entirely different things.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="count-strip" aria-label="Guide summary">
        <div className="container">
          <div className="count-grid">
            <div className="count-card">
              <div className="count-num">{totalCount}</div>
              <div className="count-label">Design Styles</div>
            </div>
            <div className="count-card">
              <div className="count-num">{designCategories.length}</div>
              <div className="count-label">Categories</div>
            </div>
            <div className="count-card">
              <div className="count-num">~80</div>
              <div className="count-label">Years Covered</div>
            </div>
            <div className="count-card">
              <div className="count-num">∞</div>
              <div className="count-label">Combinations</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon" aria-hidden>
              ⌕
            </span>
            <input
              type="search"
              className="search-input"
              placeholder="Search design styles..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="results-count" aria-live="polite">
            Showing <span>{visibleCount}</span> styles
          </div>
        </div>
      </div>

      <div className="cat-nav">
        <div className="container">
          <div className="cat-nav-scroll">
            <button
              type="button"
              className={cn('cat-pill', activeCategory === 'all' && 'active')}
              onClick={() => setActiveCategory('all')}
            >
              All Styles
            </button>
            {designCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={cn(
                  'cat-pill',
                  activeCategory === category.id && 'active',
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {visibleCategories.map((category) => (
        <section
          key={category.id}
          className="category-section"
          id={category.id}
        >
          <div className="container">
            <div className="category-header">
              <div className="category-icon">{category.icon}</div>
              <div className="category-header-text">
                <h2>{category.name}</h2>
                <p>{category.description}</p>
              </div>
            </div>
            <div className="styles-grid">
              {category.styles.map((style) => (
                <article
                  key={`${category.id}-${style.name}`}
                  className="style-card"
                  data-category={style.category}
                  data-name={style.name}
                >
                  <div
                    className={cn('style-preview', style.previewClass)}
                    {...(style.previewHtml
                      ? {
                          dangerouslySetInnerHTML: {
                            __html: style.previewHtml,
                          },
                        }
                      : {})}
                  />
                  <div className="style-card-body">
                    <div className="style-card-header">
                      <h3 className="style-card-title">{style.title}</h3>
                      <span className={cn('style-tag', style.tagClass)}>
                        {style.tag}
                      </span>
                    </div>
                    <p className="style-card-desc">{style.desc}</p>
                    <div className="style-card-meta">
                      <div className="style-card-use">
                        Best for: {style.bestFor}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="cta-section">
        <div className="container">
          <h2>
            Design is a
            <br />
            <span>language</span> you can learn.
          </h2>
          <p>
            Understanding design styles is how engineers stop building things
            that only work and start building things that resonate. The style is
            the signal. Choose intentionally.
          </p>
          <TransitionLink to="/get-a-quote" className="cta-btn">
            Work with me →
          </TransitionLink>
        </div>
      </section>
    </div>
  );
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
  const isDesignStylesPost = post.slug === DESIGN_STYLES_SLUG;

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
          if (className?.includes('language-mermaid')) {
            return (
              <BlogMermaid chart={markdownCodeChildrenToString(children)} />
            );
          }
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
            {!isDesignStylesPost ? (
              <aside className="lg:order-2 lg:w-60 lg:shrink-0">
                <BlogToc headings={tocEntries} />
              </aside>
            ) : null}

            <div className="min-w-0 flex-1 lg:order-1">
              <div
                className={cn(
                  'mx-auto',
                  isDesignStylesPost ? 'max-w-6xl' : 'max-w-[680px]',
                )}
              >
                
                <div className="blog-post-body">
                  {isDesignStylesPost ? (
                    <DesignStylesGuide />
                  ) : (
                    <ReactMarkdown
                      key={post.slug}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={markdownComponents}
                    >
                      {post.content}
                    </ReactMarkdown>
                  )}
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

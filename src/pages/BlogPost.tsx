import { useMemo, type ReactNode } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogPosts } from '../data/blog-posts';
import type { BlogPost } from '../data/blog-posts';
import { BlogTaxonomy } from '../components/BlogTaxonomy';
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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to='/blog' replace />;
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

  const disqusConfig = useMemo(
    () => ({
      url: canonical,
      identifier: post.slug,
      title: post.title,
    }),
    [canonical, post.slug, post.title],
  );

  const articleJsonLd = useMemo(() => {
    const doc: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: canonical,
      author: {
        '@type': 'Person',
        name: SITE_NAME,
        url: absoluteUrl('/'),
      },
      publisher: {
        '@type': 'Person',
        name: SITE_NAME,
        url: absoluteUrl('/'),
      },
      image: shareImageUrl,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonical,
      },
      inLanguage: 'en-ZA',
    };
    if (datePublished) {
      doc.datePublished = `${datePublished}T12:00:00+02:00`;
      doc.dateModified = `${datePublished}T12:00:00+02:00`;
    }
    const primarySection = post.categories[0];
    if (primarySection) {
      doc.articleSection = primarySection;
    }
    return JSON.stringify(doc);
  }, [
    post.title,
    post.excerpt,
    post.categories,
    canonical,
    datePublished,
    shareImageUrl,
  ]);

  return (
    <div className='min-h-screen bg-background text-foreground font-sans'>
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
      </Helmet>

      <nav className='border-b border-border'>
        <div className='max-w-3xl mx-auto px-6 py-4'>
          <Link
            to='/blog'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>Back to writing</span>
          </Link>
        </div>
      </nav>

      <main className='max-w-3xl mx-auto px-6 py-16'>
        <article>
          <header className='mb-12'>
            <div className='flex items-center gap-4 text-sm text-muted-foreground mb-4'>
              <span className='flex items-center gap-1.5'>
                <Calendar className='w-3.5 h-3.5' />
                {post.date}
              </span>
              <span className='flex items-center gap-1.5'>
                <Clock className='w-3.5 h-3.5' />
                {post.readTime}
              </span>
            </div>

            <h1 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
              {post.title}
            </h1>

            <p className='text-lg text-muted-foreground mb-6'>{post.excerpt}</p>

            {heroImagePath ? (
              <figure className='mb-8 rounded-lg overflow-hidden border border-border bg-card'>
                <img
                  src={heroImagePath}
                  alt='Historical illustration titled Ntsikana Ongcwele — Ntsikana kaGaba with raised hand and cross, used to frame a decolonial critique of missionary hagiography.'
                  className='w-full h-auto object-cover max-h-[min(70vh,520px)] object-top'
                  width={920}
                  height={1200}
                  loading='eager'
                  decoding='async'
                />
                <figcaption className='px-4 py-3 text-xs text-muted-foreground border-t border-border'>
                  Archival-style portrait labelled “Ntsikana Ongcwele” — the
                  visual language of sainthood that colonial and mission presses
                  popularised.
                </figcaption>
              </figure>
            ) : null}

            <BlogTaxonomy
              categories={post.categories}
              tags={post.tags}
              size='md'
            />
          </header>

          <div className='prose prose-invert prose-lg max-w-none'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ children }) => (
                  <h1 className='text-2xl font-bold text-foreground mt-12 mb-4'>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className='text-xl font-semibold text-foreground mt-10 mb-4'>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className='text-lg font-semibold text-foreground mt-8 mb-3'>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className='text-muted-foreground leading-relaxed mb-6'>
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className='list-disc list-inside space-y-2 text-muted-foreground mb-6'>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className='list-decimal list-inside space-y-2 text-muted-foreground mb-6'>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className='text-muted-foreground'>{children}</li>
                ),
                a: ({ href, children }) => (
                  <MarkdownAnchor href={href}>{children}</MarkdownAnchor>
                ),
                code: ({ className, children }) => {
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
                pre: ({ children }) => <>{children}</>,
                blockquote: ({ children }) => (
                  <blockquote className='border-l-2 border-primary pl-4 italic text-muted-foreground mb-6'>
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className='border-border my-8' />,
                strong: ({ children }) => (
                  <strong className='text-foreground font-semibold'>
                    {children}
                  </strong>
                ),
                em: ({ children }) => <em className='italic'>{children}</em>,
                table: ({ children }) => (
                  <div className='not-prose my-6 overflow-x-auto rounded-lg border border-border'>
                    <table className='w-full min-w-[min(100%,20rem)] border-collapse text-sm'>
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className='border-b border-border bg-card/50'>
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => <tbody>{children}</tbody>,
                tr: ({ children }) => (
                  <tr className='border-b border-border/50 last:border-0'>
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className='px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-foreground'>
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className='px-3 py-2.5 align-top text-muted-foreground first:text-foreground/90'>
                    {children}
                  </td>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

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
        </article>
      </main>
    </div>
  );
}

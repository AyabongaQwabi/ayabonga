import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogPosts } from '../data/blog-posts';
import type { BlogPost } from '../data/blog-posts';
import { BlogTaxonomy } from '../components/BlogTaxonomy';
import ReactMarkdown from 'react-markdown';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  parsePostDateForSchema,
} from '../lib/site-config';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return <BlogPostView post={post} />;
}

function BlogPostView({ post }: { post: BlogPost }) {
  const canonical = absoluteUrl(`/blog/${post.slug}`);
  const pageTitle = `${post.title} | Writing | ${SITE_NAME}`;
  const datePublished = parsePostDateForSchema(post.date);
  const keywords = [...post.categories, ...post.tags].filter(Boolean).join(', ');

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
      image: DEFAULT_OG_IMAGE,
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
    return JSON.stringify(doc);
  }, [post.title, post.excerpt, canonical, datePublished]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={post.excerpt} />
        {keywords ? <meta name="keywords" content={keywords} /> : null}
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta property="article:author" content={SITE_NAME} />
        {datePublished ? (
          <meta property="article:published_time" content={`${datePublished}T12:00:00+02:00`} />
        ) : null}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <script type="application/ld+json">{articleJsonLd}</script>
      </Helmet>

      <nav className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to writing</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <article>
          <header className="mb-12">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{post.title}</h1>

            <p className="text-lg text-muted-foreground mb-6">{post.excerpt}</p>

            <BlogTaxonomy categories={post.categories} tags={post.tags} size="md" />
          </header>

          <div className="prose prose-invert prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-foreground mt-12 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-semibold text-foreground mt-10 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold text-foreground mt-8 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-muted-foreground leading-relaxed mb-6">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">{children}</ol>
                ),
                li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                code: ({ className, children }) => {
                  const isBlock = className?.includes('language-');
                  if (isBlock) {
                    return (
                      <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto mb-6">
                        <code className="text-sm font-mono text-foreground">{children}</code>
                      </pre>
                    );
                  }
                  return (
                    <code className="bg-card px-1.5 py-0.5 rounded text-sm font-mono text-primary">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <>{children}</>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground mb-6">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="border-border my-8" />,
                strong: ({ children }) => (
                  <strong className="text-foreground font-semibold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}

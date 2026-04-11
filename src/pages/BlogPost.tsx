import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogPosts } from '../data/blog-posts';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
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
            
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {post.title}
            </h1>
            
            <p className="text-lg text-muted-foreground">
              {post.excerpt}
            </p>
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
                li: ({ children }) => (
                  <li className="text-muted-foreground">{children}</li>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
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
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
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

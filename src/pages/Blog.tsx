import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blog-posts';

export default function Blog() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
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
        <header className="mb-16">
          <h1 className="text-3xl font-bold text-foreground mb-4">Writing</h1>
          <p className="text-muted-foreground leading-relaxed">
            Thoughts on technology, cloud engineering, and building software that makes an impact.
          </p>
        </header>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article key={post.slug} className="group">
              <Link 
                to={`/blog/${post.slug}`}
                className="block p-6 -mx-6 rounded-lg hover:bg-card transition-colors"
              >
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
                
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-2 text-sm text-primary">
                  <span>Read more</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </article>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No posts yet. Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}

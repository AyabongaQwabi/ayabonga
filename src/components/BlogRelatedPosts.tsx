import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import {
  getRelatedPosts,
  getPostThumbnail,
  type BlogPost,
} from '../data/blog-posts';
import { cn } from '../lib/utils';

export interface BlogRelatedPostsProps {
  post: BlogPost;
  /** Max cards (default 3). */
  limit?: number;
  className?: string;
  /** Section heading (default: "More to read"). */
  heading?: string;
}

export function BlogRelatedPosts({
  post,
  limit = 3,
  className,
  heading = 'More to read',
}: BlogRelatedPostsProps) {
  const related = getRelatedPosts(post, limit);

  if (related.length === 0) return null;

  return (
    <section
      className={cn('not-prose', className)}
      aria-labelledby="blog-related-heading"
    >
      <h2
        id="blog-related-heading"
        className="mb-6 text-xl font-semibold text-foreground"
      >
        {heading}
      </h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <li key={item.slug}>
            <RelatedPostCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RelatedPostCard({ item }: { item: BlogPost }) {
  const thumb = getPostThumbnail(item);

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/60',
        'motion-safe:transition-[border-color,box-shadow,transform] motion-reduce:transition-none',
        'hover:border-primary/30 hover:shadow-[0_0_24px_-8px_hsl(var(--primary)/0.25)]',
      )}
    >
      <Link to={`/blog/${item.slug}`} className="flex flex-1 flex-col p-5">
        {thumb ? (
          <div className="mb-4 overflow-hidden rounded-xl border border-border bg-background">
            <img
              src={thumb}
              alt={item.title}
              className="aspect-video w-full object-cover motion-safe:transition-transform motion-reduce:transition-none group-hover:scale-[1.02]"
              width={400}
              height={225}
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}

        <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {item.date ? (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              {item.date}
            </span>
          ) : null}
          {item.readTime ? (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {item.readTime}
            </span>
          ) : null}
        </div>

        <h3 className="mb-2 text-base font-semibold text-foreground group-hover:text-primary motion-safe:transition-colors motion-reduce:transition-none">
          {item.title}
        </h3>

        {item.excerpt ? (
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {item.excerpt}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
          Read article
          <ArrowRight
            className="h-3.5 w-3.5 motion-safe:transition-transform motion-reduce:transition-none group-hover:translate-x-0.5"
            aria-hidden
          />
        </span>
      </Link>
    </article>
  );
}

import { Calendar, Clock } from 'lucide-react';
import { getRelatedPosts, type BlogPost } from '../data/blog-posts';
import { TransitionLink } from './ui/TransitionLink';
import { cn } from '../lib/utils';

export interface BlogRelatedPostsProps {
  post: BlogPost;
  limit?: number;
  className?: string;
  heading?: string;
}

export function BlogRelatedPosts({
  post,
  limit = 3,
  className,
  heading = 'Keep reading',
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
        className="mb-8 font-display text-display-md font-semibold leading-none text-transparent"
        style={{ WebkitTextStroke: '1px rgba(255,215,0,0.35)' }}
      >
        {heading.toUpperCase()}
      </h2>
      <ul className="grid gap-8 sm:grid-cols-2 sm:items-stretch lg:grid-cols-3">
        {related.map((item) => (
          <li key={item.slug} className="flex min-h-0">
            <RelatedPostCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function RelatedPostCard({ item }: { item: BlogPost }) {
  const category = item.categories[0] ?? 'Writing';

  return (
    <article className="blog-post-card group flex h-full min-h-0 flex-col border-b border-[var(--gold)]/15 pb-6">
      <TransitionLink
        to={`/blog/${item.slug}`}
        className="flex min-h-0 flex-1 flex-col outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
      >
        <span className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--gold)]">
          {category}
        </span>

        <h3 className="mt-2 font-display text-heading-md font-semibold text-[var(--warm-white)] motion-safe:transition-transform group-hover:translate-x-1">
          {item.title}
        </h3>

        {item.excerpt ? (
          <p className="mt-2 line-clamp-2 font-technical text-sm leading-relaxed text-[var(--text-muted)]">
            {item.excerpt}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-4 font-technical text-label-sm text-[var(--text-muted)]">
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
      </TransitionLink>
    </article>
  );
}

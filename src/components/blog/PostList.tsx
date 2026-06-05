import { useEffect, useRef } from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '../../data/blog-posts';
import { TransitionLink } from '../ui/TransitionLink';
import { staggerCards } from '../../lib/animations';
import { cn } from '../../lib/utils';

type PostListProps = {
  posts: BlogPost[];
  className?: string;
};

export function PostList({ posts, className }: PostListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!listRef.current || posts.length === 0) return;
    const cleanup = staggerCards(listRef.current, '.blog-post-list-item', {
      stagger: 0.04,
      y: 12,
    });
    return () => cleanup?.();
  }, [posts]);

  if (posts.length === 0) return null;

  return (
    <ul
      ref={listRef}
      className={cn('list-none border-t border-[var(--gold)]/15', className)}
      aria-label="All posts"
    >
      {posts.map((post) => {
        const category = post.categories[0] ?? 'Writing';
        return (
          <li
            key={post.slug}
            className="blog-post-list-item border-b border-[var(--gold)]/15"
          >
            <TransitionLink
              to={`/blog/${post.slug}`}
              data-cursor-read
              className={cn(
                'group flex flex-col gap-2 px-1 py-4 outline-none sm:py-5',
                'motion-safe:transition-colors motion-reduce:transition-none duration-200',
                'hover:bg-[rgba(255,215,0,0.03)]',
                'focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]',
                'md:flex-row md:items-center md:justify-between md:gap-6',
              )}
            >
              <div className="min-w-0 flex-1">
                <span className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--gold)]">
                  {category}
                </span>
                <h3
                  className={cn(
                    'mt-1 font-display text-heading-md font-semibold leading-snug text-[var(--warm-white)]',
                    'motion-safe:transition-transform motion-reduce:transition-none duration-200',
                    'group-hover:translate-x-1 group-focus-visible:translate-x-1',
                  )}
                >
                  {post.title}
                </h3>
                {post.excerpt ? (
                  <p className="mt-1.5 line-clamp-1 font-technical text-sm leading-[var(--leading-body)] text-[var(--text-muted)] md:max-w-2xl">
                    {post.excerpt}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 font-technical text-label-sm text-[var(--text-muted)] md:justify-end">
                {post.date ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <time dateTime={post.date}>{post.date}</time>
                  </span>
                ) : null}
                {post.readTime ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {post.readTime}
                  </span>
                ) : null}
              </div>
            </TransitionLink>
          </li>
        );
      })}
    </ul>
  );
}

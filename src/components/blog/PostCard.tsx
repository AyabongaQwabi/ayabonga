import { useEffect, useRef } from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '../../data/blog-posts';
import { TransitionLink } from '../ui/TransitionLink';
import { cn } from '../../lib/utils';

export type PostCardVariant = 'large' | 'small';

type PostCardProps = {
  post: BlogPost;
  variant?: PostCardVariant;
  index?: number;
  className?: string;
};

export function PostCard({
  post,
  variant = 'small',
  index,
  className,
}: PostCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const isLarge = variant === 'large';
  const category = post.categories[0] ?? 'Writing';
  const displayIndex =
    index !== undefined ? String(index + 1).padStart(2, '0') : null;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const onEnter = () => card.classList.add('is-hovered');
    const onLeave = () => card.classList.remove('is-hovered');
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <article
      ref={cardRef}
      data-cursor-read
      className={cn(
        'blog-post-card group relative flex h-full flex-col overflow-hidden',
        'border-b border-[var(--gold)]/15 bg-transparent',
        'motion-safe:transition-[background-color,transform] motion-reduce:transition-none duration-200',
        'hover:bg-[rgba(255,215,0,0.03)]',
        'before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:origin-top',
        'before:scale-y-0 before:bg-[var(--gold)] before:transition-transform before:duration-200',
        'group-hover:before:scale-y-100 motion-reduce:before:transition-none',
        'focus-within:before:scale-y-100',
        className,
      )}
    >
      {displayIndex && isLarge ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 top-2 select-none font-display text-display-md leading-none text-transparent opacity-[0.07]"
          style={{ WebkitTextStroke: '1px rgba(255,215,0,0.35)' }}
        >
          {displayIndex}
        </span>
      ) : null}

      <TransitionLink
        to={`/blog/${post.slug}`}
        className="flex min-h-0 flex-1 flex-col px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]"
      >
        <span className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--gold)]">
          {category}
        </span>

        <h2
          className={cn(
            'mt-3 font-display font-semibold text-[var(--warm-white)]',
            'motion-safe:transition-transform motion-reduce:transition-none duration-200',
            'group-hover:translate-x-[6px] group-focus-within:translate-x-[6px]',
            isLarge
              ? 'text-display-md leading-[var(--leading-editorial)] max-w-2xl'
              : 'text-heading-md leading-tight',
          )}
        >
          {post.title}
        </h2>

        {isLarge && post.excerpt ? (
          <p className="mt-4 max-w-xl font-technical text-base leading-[var(--leading-body)] text-[var(--text-muted)] line-clamp-3">
            {post.excerpt}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5 font-technical text-label-sm text-[var(--text-muted)]">
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

        <span className="mt-4 inline-flex items-center gap-2 font-technical text-label-sm font-medium uppercase tracking-[var(--tracking-label)] text-[var(--gold)]">
          Read
          <span aria-hidden className="motion-safe:transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </TransitionLink>
    </article>
  );
}

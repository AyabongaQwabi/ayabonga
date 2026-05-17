import { useEffect, useRef } from 'react';
import type { BlogPost } from '../../data/blog-posts';
import { PostCard, type PostCardVariant } from './PostCard';
import { staggerCards } from '../../lib/animations';
import { cn } from '../../lib/utils';

type PostGridProps = {
  posts: BlogPost[];
  className?: string;
};

/** 7-post cycle: large+small row, small+large row, then three smalls. */
function getCardLayout(index: number): {
  variant: PostCardVariant;
  placement: string;
} {
  const pos = index % 7;
  switch (pos) {
    case 0:
      return { variant: 'large', placement: 'lg:col-span-2' };
    case 1:
      return { variant: 'small', placement: 'lg:col-span-1' };
    case 2:
      return { variant: 'small', placement: 'lg:col-span-1' };
    case 3:
      return { variant: 'large', placement: 'lg:col-span-2 lg:col-start-2' };
    case 4:
    case 5:
    case 6:
    default:
      return { variant: 'small', placement: 'lg:col-span-1' };
  }
}

export function PostGrid({ posts, className }: PostGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current || posts.length === 0) return;
    const cleanup = staggerCards(gridRef.current, '.blog-post-card', {
      stagger: 0.08,
      y: 20,
    });
    return () => cleanup?.();
  }, [posts]);

  if (posts.length === 0) return null;

  return (
    <div
      ref={gridRef}
      className={cn(
        'grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3',
        className,
      )}
      aria-label="All posts"
    >
      {posts.map((post, index) => {
        const { variant, placement } = getCardLayout(index);
        return (
          <div key={post.slug} className={cn('min-h-0', placement)}>
            <PostCard post={post} variant={variant} index={index} />
          </div>
        );
      })}
    </div>
  );
}

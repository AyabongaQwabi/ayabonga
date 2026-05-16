import { useState, type ReactNode } from 'react';
import { getPostThumbnailSources, type BlogPost } from '../data/blog-posts';
import { normalizeBlogImageSrc } from '../lib/blog-image-path';

type BlogCardImageProps = {
  post: BlogPost;
  className?: string;
};

const CARD_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px';

const frameClass =
  'group overflow-hidden rounded-lg border border-border bg-card mb-4 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background';

const mediaMotionClass =
  'motion-safe:transition-[transform,opacity] motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-[1.02] motion-safe:group-hover:opacity-95 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:opacity-100';

function titleInitials(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'AQ';
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase();
}

function CardFrame({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`${frameClass} ${className}`.trim()}>{children}</div>;
}

function CardMedia({
  className = '',
  children,
  ...rest
}: {
  className?: string;
  children: ReactNode;
  'aria-hidden'?: boolean;
}) {
  return (
    <div
      className={`relative aspect-video w-full overflow-hidden ${mediaMotionClass} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

function BlogCardPlaceholder({ post, className = '' }: BlogCardImageProps) {
  const initials = titleInitials(post.title);

  return (
    <CardFrame className={className}>
      <CardMedia
        className="flex items-center justify-center bg-gradient-to-br from-secondary via-card to-accent/30"
        aria-hidden
      >
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(var(--primary)/0.18),transparent_55%)]" />
        <span className="relative font-sans text-3xl font-semibold tracking-tight text-primary/90 sm:text-4xl">
          {initials}
        </span>
      </CardMedia>
    </CardFrame>
  );
}

function BlogCardPhoto({
  post,
  primary,
  fallback,
  className = '',
}: BlogCardImageProps & { primary: string; fallback?: string }) {
  const normalizedPrimary = normalizeBlogImageSrc(primary) ?? primary;
  const normalizedFallback = fallback
    ? normalizeBlogImageSrc(fallback) ?? fallback
    : undefined;
  const [src, setSrc] = useState(normalizedPrimary);
  const useWebpSource = Boolean(
    normalizedFallback && /\.webp$/i.test(normalizedPrimary),
  );

  return (
    <CardFrame className={className}>
      <CardMedia className="bg-muted">
        <picture>
          {useWebpSource ? (
            <source
              srcSet={normalizedPrimary}
              type="image/webp"
              sizes={CARD_SIZES}
            />
          ) : null}
          <img
            src={src}
            alt={post.title}
            className="h-full w-full object-cover"
            width={640}
            height={360}
            loading="lazy"
            decoding="async"
            sizes={CARD_SIZES}
            onError={() => {
              if (normalizedFallback && src !== normalizedFallback) {
                setSrc(normalizedFallback);
              }
            }}
          />
        </picture>
      </CardMedia>
    </CardFrame>
  );
}

export function BlogCardImage({ post, className = '' }: BlogCardImageProps) {
  const sources = getPostThumbnailSources(post);

  if (!sources) {
    return <BlogCardPlaceholder post={post} className={className} />;
  }

  return (
    <BlogCardPhoto
      post={post}
      primary={sources.primary}
      fallback={sources.fallback}
      className={className}
    />
  );
}

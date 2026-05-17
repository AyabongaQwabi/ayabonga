type BlogPostHeroProps = {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
};

/**
 * Featured image with duotone treatment for article headers.
 */
export function BlogPostHero({
  src,
  alt,
  fallbackSrc,
  className = '',
}: BlogPostHeroProps) {
  return (
    <figure
      className={`not-prose relative w-full overflow-hidden rounded-sm border border-[var(--gold)]/15 ${className}`}
    >
      <div className="relative aspect-[16/10] min-h-[12rem] w-full sm:aspect-[3/2]">
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-90 mix-blend-luminosity"
          width={1280}
          height={800}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={(e) => {
            if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
              e.currentTarget.src = fallbackSrc;
            }
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--navy-dark)] via-[var(--navy-dark)]/40 to-[var(--gold)]/5"
          aria-hidden
        />
      </div>
    </figure>
  );
}

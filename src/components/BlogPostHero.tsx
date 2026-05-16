type BlogPostHeroProps = {
  src: string;
  alt: string;
  fallbackSrc?: string;
};

/**
 * Full-width featured image with framed gradient overlay (blog article hero).
 */
export function BlogPostHero({ src, alt, fallbackSrc }: BlogPostHeroProps) {
  return (
    <figure className='not-prose relative w-full overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-[#0A192F] via-card to-secondary/80 shadow-2xl shadow-black/30'>
      <div
        className='pointer-events-none absolute -top-20 -right-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl motion-reduce:blur-none'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-primary/5 blur-3xl motion-reduce:blur-none'
        aria-hidden
      />
      <div
        className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent'
        aria-hidden
      />

      <div className='relative aspect-[21/9] min-h-[12rem] w-full sm:aspect-[2/1] md:min-h-[14rem]'>
        <img
          src={src}
          alt={alt}
          className='absolute inset-0 h-full w-full object-cover object-center'
          width={1280}
          height={640}
          loading='eager'
          decoding='async'
          fetchPriority='high'
          onError={(e) => {
            if (fallbackSrc && e.currentTarget.src !== fallbackSrc) {
              e.currentTarget.src = fallbackSrc;
            }
          }}
        />
        <div
          className='absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent'
          aria-hidden
        />
        <div
          className='absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-80'
          aria-hidden
        />
      </div>
    </figure>
  );
}

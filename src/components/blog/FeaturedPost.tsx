import { useEffect, useRef } from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { BlogPost } from '../../data/blog-posts';
import { getPostThumbnail } from '../../data/blog-posts';
import { normalizeBlogImageSrc } from '../../lib/blog-image-path';
import { TransitionLink } from '../ui/TransitionLink';
import { lineReveal } from '../../lib/animations';
import { cn } from '../../lib/utils';

type FeaturedPostProps = {
  post: BlogPost;
  className?: string;
};

export function FeaturedPost({ post, className }: FeaturedPostProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const thumb = getPostThumbnail(post);
  const imageSrc = thumb ? normalizeBlogImageSrc(thumb) : undefined;
  const category = post.categories[0] ?? 'Featured';

  useEffect(() => {
    if (!titleRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        lineReveal(titleRef.current!, { stagger: 0.1 });
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [post.slug]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="featured-post-title"
      className={cn(
        'group relative overflow-hidden bg-[var(--navy)] py-12 md:py-16',
        'motion-safe:transition-colors motion-reduce:transition-none duration-200',
        'hover:bg-[var(--slate)]',
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-14 lg:px-8">
        <div className="min-w-0">
          <TransitionLink
            to={`/blog/${post.slug}`}
            className="block outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--navy)]"
          >
            <span className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--gold)]">
              {category}
            </span>

            <h2
              id="featured-post-title"
              ref={titleRef}
              className={cn(
                'mt-4 max-w-3xl font-display text-display-md font-semibold leading-[var(--leading-editorial)] text-[var(--warm-white)]',
                'motion-safe:transition-transform motion-reduce:transition-none duration-200',
                'group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0',
              )}
            >
              {post.title}
            </h2>

            {post.excerpt ? (
              <p className="mt-5 max-w-xl font-technical text-lg leading-[var(--leading-body)] text-[var(--text-muted)]">
                {post.excerpt}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-technical text-label-sm text-[var(--text-muted)]">
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

            <span className="mt-8 inline-flex items-center gap-2 font-technical text-label-sm font-semibold uppercase tracking-[var(--tracking-label)] text-[var(--gold)]">
              Read
              <span aria-hidden>→</span>
            </span>
          </TransitionLink>
        </div>

        <div className="relative flex min-h-[14rem] items-center justify-center lg:min-h-[18rem]">
          {imageSrc ? (
            <div className="relative w-full max-w-md overflow-hidden rounded-sm border border-[var(--gold)]/20">
              <img
                src={imageSrc}
                alt=""
                className="aspect-[4/3] w-full object-cover opacity-90 mix-blend-luminosity"
                width={640}
                height={480}
                loading="lazy"
                decoding="async"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[var(--navy)]/80 via-[var(--navy)]/30 to-[var(--gold)]/10"
                aria-hidden
              />
            </div>
          ) : (
            <span
              aria-hidden
              className="select-none font-display text-display-lg leading-none text-transparent"
              style={{ WebkitTextStroke: '1px rgba(255,215,0,0.2)' }}
            >
              01
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

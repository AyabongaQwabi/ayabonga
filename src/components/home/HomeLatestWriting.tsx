import { useEffect, useRef } from 'react';
import type { BlogPost } from '../../data/blog-posts';
import { TransitionLink } from '../ui/TransitionLink';
import { lineReveal, staggerCards, whenMotionReady } from '../../lib/animations';

type HomeLatestWritingProps = {
  posts: BlogPost[];
};

function formatPostDate(iso: string): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function HomeLatestWriting({ posts }: HomeLatestWritingProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    void whenMotionReady().then(() => {
      if (cancelled) return;
      if (headingRef.current) {
        const cleanup = lineReveal(headingRef.current);
        if (cleanup) cleanups.push(cleanup);
      }
      if (sectionRef.current) {
        const cleanup = staggerCards(sectionRef.current, '[data-writing-row]', {
          stagger: 0.1,
          y: 16,
        });
        if (cleanup) cleanups.push(cleanup);
      }
    });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  if (posts.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="writing"
      className="scroll-mt-24 bg-[var(--slate)] py-[clamp(80px,12vw,180px)]"
      aria-labelledby="writing-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2
            id="writing-heading"
            ref={headingRef}
            className="font-display text-display-md font-semibold text-transparent"
            style={{ WebkitTextStroke: '1px rgba(245, 240, 232, 0.35)' }}
          >
            THINKING
          </h2>
          <TransitionLink
            to="/blog"
            className="interactive-link shrink-0 font-technical text-sm font-semibold text-[var(--warm-white)]/80 hover:text-[var(--warm-white)]"
          >
            All posts →
          </TransitionLink>
        </div>

        <ul className="mt-14 list-none border-t border-white/10">
          {posts.map((post) => (
            <li key={post.slug} data-writing-row className="border-b border-white/10">
              <TransitionLink
                to={`/blog/${post.slug}`}
                className="group flex flex-col gap-2 py-8 transition-colors duration-200 md:flex-row md:items-baseline md:justify-between md:gap-8"
                data-cursor="project"
              >
                <span className="font-display text-heading-lg font-semibold text-[var(--warm-white)] transition-[transform,color] duration-200 group-hover:-translate-x-1 group-hover:text-[var(--gold)] motion-reduce:group-hover:translate-x-0">
                  {post.title}
                </span>
                <time
                  dateTime={post.date}
                  className="shrink-0 font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)] transition-colors duration-200 group-hover:text-[var(--warm-white)]/70"
                >
                  {formatPostDate(post.date)}
                </time>
              </TransitionLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import { scrollMarquee, wordReveal, whenMotionReady } from '../../lib/animations';

const MARQUEE_TEXT = 'Strategy · Craft · Scale · ';

export function HomeManifesto() {
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    void whenMotionReady().then(() => {
      if (cancelled) return;
      if (quoteRef.current) {
        const cleanup = wordReveal(quoteRef.current);
        if (cleanup) cleanups.push(cleanup);
      }
      if (marqueeRef.current) {
        const cleanup = scrollMarquee(marqueeRef.current, 1);
        if (cleanup) cleanups.push(cleanup);
      }
    });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      id="manifesto"
      className="relative min-h-[80vh] scroll-mt-24 overflow-hidden bg-[var(--navy)] py-24 md:py-40"
      aria-labelledby="manifesto-quote"
    >
      <div
        className="pointer-events-none absolute inset-y-0 left-0 flex w-[200%] select-none items-center"
        aria-hidden
      >
        <div
          ref={marqueeRef}
          className="flex shrink-0 whitespace-nowrap font-display text-[clamp(80px,12vw,200px)] font-semibold uppercase leading-none text-transparent"
          style={{ WebkitTextStroke: '1px rgba(245, 240, 232, 0.12)' }}
        >
          <span className="opacity-[0.08]">{MARQUEE_TEXT.repeat(4)}</span>
          <span className="opacity-[0.08]">{MARQUEE_TEXT.repeat(4)}</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[50vh] max-w-7xl items-center px-6">
        <p
          id="manifesto-quote"
          ref={quoteRef}
          className="max-w-5xl font-display text-display-lg font-medium text-[var(--warm-white)]"
          style={{ lineHeight: 'var(--leading-editorial)' }}
        >
          <span className="block">I don&apos;t write code.</span>
          <span className="block">I build systems</span>
          <span className="block">
            that <span className="text-[var(--gold)]">compound</span>.
          </span>
        </p>
      </div>
    </section>
  );
}

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { lineReveal, scrambleDecode, whenMotionReady } from '../../lib/animations';
import { ScrollIndicator } from '../ui/ScrollIndicator';

type HomeArtHeroProps = {
  onScrollTo: (id: string) => void;
};

export function HomeArtHero({ onScrollTo }: HomeArtHeroProps) {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const scrollWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    void whenMotionReady().then(() => {
      if (cancelled) return;

      if (eyebrowRef.current) scrambleDecode(eyebrowRef.current, { delay: 0.2 });

      if (headlineRef.current) {
        const cleanup = lineReveal(headlineRef.current, { delay: 0.55, stagger: 0.1 });
        if (cleanup) cleanups.push(cleanup);
      }

      if (subRef.current) {
        gsap.fromTo(
          subRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, delay: 1.1, duration: 0.55, ease: 'power2.out' },
        );
      }

      if (scrollWrapRef.current) {
        gsap.fromTo(
          scrollWrapRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, delay: 1.6, duration: 0.5, ease: 'power2.out' },
        );
      }
    });

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[var(--navy-dark)] scroll-mt-0"
      aria-labelledby="home-hero-title"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_18%_45%,rgba(30,58,95,0.45),transparent_65%)]"
        aria-hidden={true}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl min-w-0 px-4 pb-28 pt-32 sm:px-6 md:pb-32 md:pt-40 motion-safe:max-md:translate-x-0 md:motion-safe:-translate-x-6">
        <p
          ref={eyebrowRef}
          className="relative z-10 font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]"
        >
          Ayabonga Qwabi · Johannesburg
        </p>

        <div className="relative z-20 mt-8 min-w-0 md:mt-10">
          <h1
            id="home-hero-title"
            ref={headlineRef}
            className="font-display text-display-xl font-semibold uppercase tracking-[var(--tracking-tight)] text-[var(--warm-white)]"
            style={{ lineHeight: 'var(--leading-display)' }}
          >
            <span className="block">Senior</span>
            <span className="block">Product</span>
            <span
              className="block text-transparent"
              style={{ WebkitTextStroke: '2px var(--gold)' }}
            >
              Engineer.
            </span>
          </h1>
        </div>

        <p
          ref={subRef}
          className="relative z-10 mt-8 max-w-[520px] font-technical text-[clamp(15px,1.5vw,18px)] leading-[var(--leading-body)] text-[var(--text-muted)] opacity-0"
        >
          I build scalable software with strategic depth, from architecture to launch.
        </p>
      </div>

      <div ref={scrollWrapRef} className="absolute inset-x-0 bottom-0 z-20 opacity-0">
        <ScrollIndicator showLabel={false} onActivate={() => onScrollTo('manifesto')} />
      </div>
    </section>
  );
}

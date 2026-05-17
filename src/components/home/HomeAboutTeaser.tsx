import { useEffect, useRef } from 'react';
import { clipReveal, scrambleDecode, wordReveal, whenMotionReady } from '../../lib/animations';
import { TransitionLink } from '../ui/TransitionLink';
import { HOME_PORTRAIT, HOME_PORTRAIT_ALT } from '../../lib/home-images';

export function HomeAboutTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    let cancelled = false;

    void whenMotionReady().then(() => {
      if (cancelled) return;
      if (labelRef.current) scrambleDecode(labelRef.current, { delay: 0.2 });
      if (quoteRef.current) {
        const cleanup = wordReveal(quoteRef.current, {
          trigger: sectionRef.current ?? undefined,
        });
        if (cleanup) cleanups.push(cleanup);
      }
      if (imageRef.current) {
        const cleanup = clipReveal(imageRef.current, {
          trigger: sectionRef.current ?? undefined,
        });
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
      ref={sectionRef}
      id="about"
      className="scroll-mt-24 overflow-hidden bg-[var(--warm-white)] py-[clamp(80px,12vw,180px)] text-[var(--navy)]"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)] lg:items-center lg:gap-16">
          <div>
            <p
              ref={labelRef}
              className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]"
            >
              About
            </p>
            <p
              ref={quoteRef}
              id="about-heading"
              className="mt-8 max-w-2xl font-display text-display-md font-medium leading-[var(--leading-editorial)] text-[var(--navy)]"
            >
              I&apos;m the engineer who stays on a call until the problem is actually solved.
            </p>
            <p className="mt-8 max-w-xl font-technical text-base leading-[var(--leading-body)] text-[var(--navy)]/75">
              AI specialist and cloud architect based in Queenstown, Eastern Cape. About ten years
              shipping across web, mobile, and cloud for founders who need one senior partner from
              architecture through launch.
            </p>
            <p className="mt-4 max-w-xl font-technical text-base leading-[var(--leading-body)] text-[var(--navy)]/75">
              I work with teams who want accountability for delivery, not another handoff queue.
            </p>
            <TransitionLink
              to="/about"
              className="interactive-link mt-10 inline-block font-technical text-sm font-semibold text-[var(--emerald)] underline decoration-[var(--emerald)] underline-offset-4 hover:opacity-80"
            >
              About me →
            </TransitionLink>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <div
              className="pointer-events-none absolute -left-3 -top-3 h-full w-full border border-[var(--navy)]/15 motion-reduce:hidden lg:-left-4 lg:-top-4"
              aria-hidden
            />
            <figure ref={imageRef} className="relative overflow-hidden">
              <img
                src={HOME_PORTRAIT}
                alt={HOME_PORTRAIT_ALT}
                width={640}
                height={640}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover object-[center_15%]"
              />
              <figcaption className="sr-only">{HOME_PORTRAIT_ALT}</figcaption>
            </figure>
            <p className="mt-6 text-center font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)] lg:mt-12 lg:text-left">
              Queenstown · Eastern Cape
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

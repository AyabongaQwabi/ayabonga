import { useEffect, useRef } from 'react';

export type UseScrollRevealOptions = IntersectionObserverInit;

function isPrerenderEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean((window as Window & { __PRERENDER__?: boolean }).__PRERENDER__);
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    isPrerenderEnvironment() ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Observes an element and toggles `is-visible` when it enters the viewport. */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: UseScrollRevealOptions,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px',
        ...options,
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options?.root, options?.rootMargin, options?.threshold]);

  return ref;
}

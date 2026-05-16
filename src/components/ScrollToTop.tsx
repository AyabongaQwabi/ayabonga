import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scroll window to top on route change; preserves hash navigation. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [pathname, hash]);

  return null;
}

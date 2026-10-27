import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { readLaunchSession } from '../lib/samsung-launch-session';

/** Scroll window to top on route change; preserves hash navigation. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    // The activity launcher restores its own filters and position after mounting.
    // A concurrent smooth scroll to zero would fight that restoration.
    if (pathname === '/samsung-intents') {
      try {
        if (readLaunchSession(window.sessionStorage).view.scrollY > 0) return;
      } catch { /* Restricted browser storage: retain the usual route behavior. */ }
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [pathname, hash]);

  return null;
}

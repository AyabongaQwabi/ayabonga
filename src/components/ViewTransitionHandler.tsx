import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** Progressive enhancement: cross-fade between routes when View Transitions API is supported. */
export function ViewTransitionHandler() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (navigationType === 'POP') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof document.startViewTransition !== 'function') return;

    document.startViewTransition(() => {
      /* React Router already updated the tree; transition wraps paint. */
    });
  }, [location.pathname, navigationType]);

  return null;
}

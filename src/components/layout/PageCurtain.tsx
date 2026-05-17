import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

export function PageCurtain() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const curtainColor = (() => {
    const p = location.pathname;
    if (p.startsWith('/blog')) return '#060E1C';
    if (p === '/about') return '#0A192F';
    if (p === '/get-a-quote') return '#1E293B';
    return '#060E1C';
  })();

  useEffect(() => {
    if (!curtainRef.current) return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(curtainRef.current, { scaleY: 0 });
      return;
    }
    gsap.set(curtainRef.current, { scaleY: 1, transformOrigin: 'top' });
    gsap.to(curtainRef.current, {
      scaleY: 0,
      duration: 0.65,
      ease: 'power3.inOut',
      transformOrigin: 'top',
      delay: 0.05,
    });
  }, [location.pathname, location.search, location.key]);

  return (
    <div
      ref={curtainRef}
      data-page-curtain
      aria-hidden
      className="page-curtain"
      style={{
        position: 'fixed',
        inset: 0,
        background: curtainColor,
        zIndex: 10000,
        transformOrigin: 'top',
        pointerEvents: 'none',
      }}
    />
  );
}

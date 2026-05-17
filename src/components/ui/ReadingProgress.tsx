import { useEffect, useRef, useState } from 'react';
import { getLenis } from '../../lib/lenis';

type ReadingProgressProps = {
  targetSelector?: string;
};

export function ReadingProgress({
  targetSelector = '[data-reading-article]',
}: ReadingProgressProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const article = document.querySelector(targetSelector);
    if (!article) return;

    const update = () => {
      const rect = article.getBoundingClientRect();
      const articleTop = window.scrollY + rect.top;
      const articleHeight = article.offsetHeight;
      const viewport = window.innerHeight;
      const scrolled = window.scrollY - articleTop + viewport * 0.15;
      const total = articleHeight - viewport * 0.5;
      const pct = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      setProgress(pct);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${pct})`;
      }
    };

    update();
    const lenis = getLenis();
    if (lenis) {
      lenis.on('scroll', update);
      return () => lenis.off('scroll', update);
    }
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [targetSelector]);

  return (
    <div
      className="fixed left-0 right-0 z-[999] h-0.5 origin-left bg-transparent"
      style={{ top: 'var(--site-nav-height)' }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-valuetext={`${Math.round(progress * 100)} percent read`}
      aria-label="Reading progress"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-[var(--gold)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

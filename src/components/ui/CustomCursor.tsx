import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

type CursorMode = 'default' | 'view' | 'link' | 'cta';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const modeRef = useRef<CursorMode>('default');

  useEffect(() => {
    const finePointerMq = window.matchMedia('(pointer: fine)');
    const coarsePointerMq = window.matchMedia('(pointer: coarse)');
    const mobileMq = window.matchMedia('(max-width: 767px)');
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncEnabled = () => {
      const finePointer = finePointerMq.matches;
      const coarsePointer = coarsePointerMq.matches;
      const isMobile = mobileMq.matches;
      const reduced = reducedMq.matches;
      setEnabled(finePointer && !coarsePointer && !isMobile && !reduced);
    };

    syncEnabled();
    finePointerMq.addEventListener('change', syncEnabled);
    coarsePointerMq.addEventListener('change', syncEnabled);
    mobileMq.addEventListener('change', syncEnabled);
    reducedMq.addEventListener('change', syncEnabled);

    return () => {
      finePointerMq.removeEventListener('change', syncEnabled);
      coarsePointerMq.removeEventListener('change', syncEnabled);
      mobileMq.removeEventListener('change', syncEnabled);
      reducedMq.removeEventListener('change', syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !cursorRef.current) return;

    const cursor = cursorRef.current;
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.06, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.06, ease: 'power3' });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const setMode = (mode: CursorMode) => {
      modeRef.current = mode;
      if (!labelRef.current) return;
      if (mode === 'view') {
        gsap.to(cursor, {
          width: 80,
          height: 80,
          borderRadius: '50%',
          duration: 0.12,
        });
        labelRef.current.textContent = 'VIEW';
        labelRef.current.style.opacity = '1';
      } else if (mode === 'link') {
        gsap.to(cursor, {
          width: 24,
          height: 2,
          borderRadius: 0,
          duration: 0.12,
        });
        labelRef.current.style.opacity = '0';
      } else if (mode === 'cta') {
        gsap.to(cursor, {
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 215, 0, 0.2)',
          duration: 0.12,
        });
        labelRef.current.style.opacity = '0';
      } else {
        gsap.to(cursor, {
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          duration: 0.12,
        });
        labelRef.current.style.opacity = '0';
      }
    };

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="view"]')) setMode('view');
      else if (target.closest('[data-cursor="cta"]')) setMode('cta');
      else if (target.closest('a, button, [data-cursor="link"]')) setMode('link');
      else setMode('default');
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[10001] flex items-center justify-center border border-[var(--gold)]"
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      aria-hidden
    >
      <span
        ref={labelRef}
        className="font-technical text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)] opacity-0"
      >
        VIEW
      </span>
    </div>
  );
}

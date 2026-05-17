import { useEffect, useState } from 'react';

type ScrollIndicatorProps = {
  showLabel?: boolean;
  onActivate?: () => void;
};

export function ScrollIndicator({ showLabel = true, onActivate }: ScrollIndicatorProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY < 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  const line = (
    <div className="relative h-10 w-px bg-[var(--gold)]/40">
      <span className="scroll-indicator-dot absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--gold)]" />
    </div>
  );

  if (onActivate) {
    return (
      <button
        type="button"
        onClick={onActivate}
        className="pointer-events-auto absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]"
        aria-label="Scroll to manifesto"
      >
        {showLabel ? (
          <span className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
            Scroll
          </span>
        ) : null}
        {line}
      </button>
    );
  }

  return (
    <div
      className="pointer-events-none absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      aria-hidden
    >
      {showLabel ? (
        <span className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
          Scroll
        </span>
      ) : null}
      {line}
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { getMermaid } from '../lib/mermaid-blog';

let renderSeq = 0;

function formatMermaidError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export function BlogMermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const trimmed = chart.trim();
    if (!trimmed) {
      setError('Empty diagram');
      return;
    }

    let cancelled = false;
    const renderId = `mermaid-blog-${++renderSeq}`;

    void (async () => {
      try {
        const mermaid = await getMermaid();
        const { svg, bindFunctions } = await mermaid.render(renderId, trimmed);
        if (cancelled) return;
        el.innerHTML = svg;
        bindFunctions?.(el);
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setError(formatMermaidError(e));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (error) {
    return (
      <div className="not-prose mb-6 rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
        <p className="mb-2 font-technical text-sm font-semibold text-amber-200">
          Could not render diagram
        </p>
        <pre className="overflow-x-auto rounded bg-[var(--navy-dark)] p-3 font-mono text-xs text-[var(--warm-white)]">
          {chart.trim()}
        </pre>
        <p className="mt-2 font-mono text-xs text-amber-200/80">{error}</p>
      </div>
    );
  }

  return (
    <div className="not-prose mb-6 overflow-x-auto rounded-lg border-l-[3px] border-[var(--emerald)] bg-[var(--navy-dark)] p-4 [&_svg]:max-w-full">
      <div ref={containerRef} className="flex min-h-[4rem] justify-center [&_svg]:h-auto" />
    </div>
  );
}

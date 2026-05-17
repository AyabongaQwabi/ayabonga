import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, List } from 'lucide-react';
import { cn } from '../lib/utils';
import {
  extractHeadingsFromMarkdown,
  type TocEntry,
} from '../lib/blog-headings';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';

export type TocHeading = TocEntry;

export interface BlogTocProps {
  markdown?: string;
  headings?: TocHeading[];
  className?: string;
  label?: string;
}

export { extractHeadingsFromMarkdown } from '../lib/blog-headings';

function TocLinkList({
  entries,
  activeId,
  onNavigate,
}: {
  entries: TocEntry[];
  activeId: string | null;
  onNavigate: (id: string) => void;
}) {
  return (
    <ol className="space-y-0.5 text-sm">
      {entries.map((entry) => {
        const isActive = activeId === entry.id;
        return (
          <li
            key={entry.id}
            className={cn(entry.level === 3 && 'border-s border-[var(--gold)]/25 ps-3')}
          >
            <a
              href={`#${entry.id}`}
              className={cn(
                'block rounded-md px-2 py-1.5 leading-snug font-technical',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]',
                'motion-safe:transition-colors motion-reduce:transition-none',
                isActive
                  ? 'font-medium text-[var(--gold)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--warm-white)]',
                entry.level === 2 && !isActive && 'font-medium',
              )}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(entry.id);
              }}
            >
              {entry.text}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function BlogToc({
  markdown = '',
  headings: headingsProp,
  className,
  label = 'On this page',
}: BlogTocProps) {
  const entries = useMemo(() => {
    if (headingsProp && headingsProp.length > 0) return headingsProp;
    if (markdown.trim()) return extractHeadingsFromMarkdown(markdown);
    return [];
  }, [headingsProp, markdown]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (entries.length === 0) return;

    const elements = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => el != null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((o) => o.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [entries]);

  const handleNavigate = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start',
      });
      history.replaceState(null, '', `#${id}`);
      setActiveId(id);
    }
    setMobileOpen(false);
  };

  if (entries.length < 2) return null;

  const panelClassName =
    'rounded-xl border border-[var(--gold)]/10 bg-[var(--slate)]/60 p-4 backdrop-blur-sm';

  const list = (
    <TocLinkList
      entries={entries}
      activeId={activeId}
      onNavigate={handleNavigate}
    />
  );

  return (
    <>
      <div className={cn('not-prose lg:hidden', className)}>
        <Collapsible open={mobileOpen} onOpenChange={setMobileOpen}>
          <div className={panelClassName}>
            <CollapsibleTrigger
              type="button"
              className={cn(
                'flex w-full items-center justify-between gap-3 text-left',
                'rounded-lg font-technical text-sm font-semibold text-[var(--warm-white)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]',
              )}
              aria-expanded={mobileOpen}
            >
              <span className="inline-flex items-center gap-2">
                <List className="h-4 w-4 text-[var(--gold)]" aria-hidden />
                {label}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-[var(--text-muted)] motion-safe:transition-transform',
                  mobileOpen && 'rotate-180',
                )}
                aria-hidden
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <nav aria-label={label}>{list}</nav>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>

      <nav
        className={cn(
          'not-prose hidden w-60 shrink-0 lg:sticky lg:top-[var(--site-nav-height)] lg:z-20 lg:block lg:max-h-[calc(100vh-var(--site-nav-height))] lg:self-start',
          className,
        )}
        aria-labelledby="blog-toc-heading-desktop"
      >
        <div
          className={cn(
            panelClassName,
            'lg:max-h-[calc(100vh-var(--site-nav-height)-1rem)] lg:overflow-y-auto lg:overscroll-contain',
          )}
        >
          <h2
            id="blog-toc-heading-desktop"
            className="mb-4 font-technical text-label-sm font-semibold uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]"
          >
            {label}
          </h2>
          {list}
        </div>
      </nav>
    </>
  );
}

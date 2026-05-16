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
  /** Raw markdown; parsed when `headings` is omitted. */
  markdown?: string;
  /** Pre-built headings (wins over `markdown`). */
  headings?: TocHeading[];
  className?: string;
  /** Nav landmark label (default: "On this page"). */
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
    <ol className="space-y-1 text-sm">
      {entries.map((entry) => {
        const isActive = activeId === entry.id;
        return (
          <li
            key={entry.id}
            className={cn(
              entry.level === 3 && 'border-s border-primary/20 ps-3',
            )}
          >
            <a
              href={`#${entry.id}`}
              className={cn(
                'block rounded-lg px-2 py-1.5 leading-snug',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'motion-safe:transition-colors motion-reduce:transition-none',
                isActive
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-card/60 hover:text-foreground',
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
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
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
    'rounded-2xl border border-border bg-card/80 p-4 shadow-sm backdrop-blur-sm';

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
                'rounded-xl text-sm font-semibold text-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'motion-safe:transition-colors motion-reduce:transition-none',
              )}
              aria-expanded={mobileOpen}
            >
              <span className="inline-flex items-center gap-2">
                <List className="h-4 w-4 text-primary" aria-hidden />
                {label}
              </span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-muted-foreground motion-safe:transition-transform motion-reduce:transition-none',
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
        className={cn('not-prose hidden lg:block', className)}
        aria-labelledby="blog-toc-heading-desktop"
      >
        <div
          className={cn(
            panelClassName,
            'lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:overscroll-contain',
          )}
        >
          <h2
            id="blog-toc-heading-desktop"
            className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            <List className="h-3.5 w-3.5 text-primary" aria-hidden />
            {label}
          </h2>
          {list}
        </div>
      </nav>
    </>
  );
}

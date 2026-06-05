import { LayoutGrid, List } from 'lucide-react';
import { cn } from '../../lib/utils';

export type BlogViewMode = 'grid' | 'list';

const STORAGE_KEY = 'blog-index-view';

export function getStoredBlogView(): BlogViewMode {
  if (typeof window === 'undefined') return 'grid';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'list' ? 'list' : 'grid';
}

export function storeBlogView(view: BlogViewMode): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, view);
  } catch {
    // Ignore quota or private-mode errors.
  }
}

type BlogViewToggleProps = {
  view: BlogViewMode;
  onChange: (view: BlogViewMode) => void;
  className?: string;
};

export function BlogViewToggle({ view, onChange, className }: BlogViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Post layout"
      className={cn(
        'inline-flex items-center rounded-lg border border-[var(--gold)]/20 bg-[var(--navy-dark)]/60 p-1',
        className,
      )}
    >
      <button
        type="button"
        aria-pressed={view === 'grid'}
        onClick={() => onChange('grid')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-technical text-label-sm uppercase tracking-[var(--tracking-label)]',
          'motion-safe:transition-colors motion-reduce:transition-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]',
          view === 'grid'
            ? 'bg-[var(--gold)]/15 text-[var(--gold)]'
            : 'text-[var(--text-muted)] hover:text-[var(--warm-white)]',
        )}
      >
        <LayoutGrid className="h-4 w-4 shrink-0" aria-hidden />
        <span>Grid</span>
      </button>
      <button
        type="button"
        aria-pressed={view === 'list'}
        onClick={() => onChange('list')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-technical text-label-sm uppercase tracking-[var(--tracking-label)]',
          'motion-safe:transition-colors motion-reduce:transition-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]',
          view === 'list'
            ? 'bg-[var(--gold)]/15 text-[var(--gold)]'
            : 'text-[var(--text-muted)] hover:text-[var(--warm-white)]',
        )}
      >
        <List className="h-4 w-4 shrink-0" aria-hidden />
        <span>List</span>
      </button>
    </div>
  );
}

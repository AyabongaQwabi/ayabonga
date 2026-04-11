import { Link } from 'react-router-dom';
import { FolderOpen, Tag } from 'lucide-react';

type Props = {
  categories: string[];
  tags: string[];
  /** List cards: slightly smaller chips */
  size?: 'sm' | 'md';
};

function chipBase(size: 'sm' | 'md', active: boolean, variant: 'category' | 'tag') {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const cat = active
    ? 'bg-primary/20 text-primary border-primary/50'
    : 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/15';
  const tag = active
    ? 'bg-muted text-foreground border-border'
    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:border-muted-foreground/40';
  return `inline-flex items-center gap-1 rounded-full border font-medium transition-colors ${pad} ${variant === 'category' ? cat : tag}`;
}

export function BlogTaxonomy({ categories, tags, size = 'md' }: Props) {
  if (categories.length === 0 && tags.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <FolderOpen className="w-3.5 h-3.5 text-muted-foreground shrink-0" aria-hidden />
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <Link
                key={c}
                to={`/blog?category=${encodeURIComponent(c)}`}
                className={chipBase(size, false, 'category')}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-start gap-2">
          <Tag className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-1" aria-hidden />
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Link
                key={t}
                to={`/blog?tag=${encodeURIComponent(t)}`}
                className={chipBase(size, false, 'tag')}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type FilterChipProps = {
  label: string;
  to: string;
  active: boolean;
  variant: 'category' | 'tag';
};

export function BlogFilterChip({ label, to, active, variant }: FilterChipProps) {
  return (
    <Link
      to={to}
      className={chipBase('sm', active, variant)}
    >
      {label}
    </Link>
  );
}

import { Code2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { resolveTechLogo, normalizeTechName } from '../../lib/tech-logos';

export type TechLogoProps = {
  /** Slug (`react`) or display name (`React`, `Node.js`). */
  name: string;
  size?: number;
  className?: string;
  title?: string;
};

export function TechLogo({
  name,
  size = 14,
  className,
  title,
}: TechLogoProps) {
  const src = resolveTechLogo(name);
  const label = title ?? name;
  const dimension = `${size}px`;

  if (src) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--slate)]/80 ring-1 ring-[var(--gold)]/20',
          className,
        )}
        style={{ width: dimension, height: dimension }}
        title={label}
        aria-hidden={title ? undefined : true}
      >
        <img
          src={src}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          decoding="async"
          className="h-[70%] w-[70%] object-contain"
        />
      </span>
    );
  }

  const initial = normalizeTechName(name).charAt(0).toUpperCase() || '?';

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--slate)] font-mono text-[0.55rem] font-semibold uppercase text-[var(--gold)] ring-1 ring-[var(--gold)]/25',
        className,
      )}
      style={{ width: dimension, height: dimension }}
      title={label}
      aria-hidden={title ? undefined : true}
    >
      {initial === '?' ? (
        <Code2
          className="text-[var(--gold)]/80"
          style={{ width: size * 0.62, height: size * 0.62 }}
          strokeWidth={2.25}
          aria-hidden
        />
      ) : (
        initial
      )}
    </span>
  );
}

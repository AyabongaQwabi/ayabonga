import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { TechLogo } from './TechLogo';

export type InlineTechMentionProps = {
  name: string;
  children?: ReactNode;
  size?: number;
  className?: string;
};

/** Inline tech label with a round logo (blog prose, cards, lists). */
export function InlineTechMention({
  name,
  children,
  size = 14,
  className,
}: InlineTechMentionProps) {
  const label = children ?? name;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 align-middle whitespace-nowrap',
        className,
      )}
    >
      <TechLogo name={name} size={size} title={typeof label === 'string' ? label : name} />
      <span>{label}</span>
    </span>
  );
}

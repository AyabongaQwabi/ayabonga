import type { ReactNode } from 'react';
import { SiteNav } from './SiteNav';
import { SiteFooter } from '../SiteFooter';
import { CustomCursor } from '../ui/CustomCursor';

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <div
      className={`min-h-screen bg-[var(--navy)] text-[var(--warm-white)] ${className}`}
      data-cursor-root
    >
      <CustomCursor />
      <SiteNav />
      <div className="pt-20">{children}</div>
      <SiteFooter />
    </div>
  );
}

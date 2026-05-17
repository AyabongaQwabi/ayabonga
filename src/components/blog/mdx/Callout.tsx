import type { ReactNode } from 'react';

type CalloutVariant = 'info' | 'warning' | 'tip';

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const styles: Record<CalloutVariant, string> = {
  info: 'border-sky-500/40 bg-sky-500/10 text-foreground',
  warning: 'border-amber-500/40 bg-amber-500/10 text-foreground',
  tip: 'border-emerald-500/40 bg-emerald-500/10 text-foreground',
};

export function Callout({ variant = 'info', title, children }: CalloutProps) {
  return (
    <aside
      className={`not-prose my-6 rounded-xl border-l-4 px-4 py-3 ${styles[variant]}`}
      role="note"
    >
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div className="text-sm leading-relaxed [&>p]:m-0">{children}</div>
    </aside>
  );
}

import { Link } from 'react-router-dom';
import { FileDown } from 'lucide-react';
import { QUOTE_PAGE } from '../lib/site-config';

type LeadMagnetCardProps = {
  title?: string;
  description?: string;
  ctaLabel?: string;
};

export function LeadMagnetCard({
  title = 'South Africa App Cost Guide (2026)',
  description =
    'Use the quote tool for a scoped ballpark on your idea. It walks through platforms, payments, admin needs, and timeline so you are not comparing apples to broken Android builds.',
  ctaLabel = 'Start scoped estimate',
}: LeadMagnetCardProps) {
  return (
    <aside className="p-6 md:p-8 rounded-2xl border border-primary/20 bg-primary/5">
      <div className="flex items-start gap-3 mb-3">
        <span className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
          <FileDown className="w-5 h-5 text-primary" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{description}</p>
        </div>
      </div>
      <Link
        to={QUOTE_PAGE}
        className="inline-flex items-center justify-center mt-4 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {ctaLabel}
      </Link>
    </aside>
  );
}

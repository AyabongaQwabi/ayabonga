import { Link } from 'react-router-dom';
import { ArrowRight, Calculator } from 'lucide-react';

type BlogCommercialCtaProps = {
  variant?: 'default' | 'engineering';
};

export default function BlogCommercialCta({ variant = 'default' }: BlogCommercialCtaProps) {
  const isEngineering = variant === 'engineering';

  return (
    <aside
      className="not-prose my-12 rounded-xl border border-primary/20 bg-card/80 p-6"
      aria-label="Work with Ayabonga"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-primary mb-2">
        {isEngineering ? 'Building in South Africa?' : 'Need a senior builder?'}
      </p>
      <h2 className="text-lg font-semibold text-foreground mb-2">
        {isEngineering
          ? 'Technical co-founder and product engineering'
          : 'From idea to production without agency overhead'}
      </h2>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        I scope MVPs, ship on React and Node, and own cloud and payments for SA startups.
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <Link
          to="/technical-cofounder"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Technical co-founder
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
        <Link
          to="/get-a-quote"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-background transition-colors"
        >
          <Calculator className="w-4 h-4" aria-hidden />
          Get a quote
        </Link>
      </div>
    </aside>
  );
}

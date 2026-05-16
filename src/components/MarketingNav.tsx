import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Menu, X } from 'lucide-react';
import { QUOTE_PAGE } from '../lib/site-config';
import { isBusinessSite } from '../lib/site-variant';

const navLinks = [
  { label: 'What I build', href: '#build' },
  { label: 'Work', href: '#work' },
  { label: 'Pricing', to: '/app-development-cost-south-africa' },
  { label: 'Services', to: '/services' },
  ...(isBusinessSite
    ? [{ label: 'MVP builds', to: '/mvp-developer-south-africa' as const }]
    : [{ label: 'Writing', to: '/blog' as const }]),
];

type MarketingNavProps = {
  onNavigateSection?: (id: string) => void;
};

export function MarketingNav({ onNavigateSection }: MarketingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goSection = (id: string) => {
    onNavigateSection?.(id);
    setOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 motion-reduce:transition-none ${
        scrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="w-2 h-2 rounded-full bg-primary group-hover:scale-110 transition-transform" />
          <span className="font-bold text-foreground tracking-tight">
            {isBusinessSite ? 'Qwabi Engineering' : 'Ayabonga Qwabi'}
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 text-sm" aria-label="Primary">
          {navLinks.map((item) =>
            'to' in item && item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={() => goSection((item as { href: string }).href.replace('#', ''))}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </button>
            ),
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to={QUOTE_PAGE}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-semibold hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Calculator className="w-4 h-4 text-primary" aria-hidden />
            Get a quote
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open ? (
        <nav
          className="lg:hidden border-t border-border bg-background/98 backdrop-blur-md px-6 py-4 flex flex-col gap-3"
          aria-label="Mobile"
        >
          {navLinks.map((item) =>
            'to' in item && item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className="text-left text-sm text-muted-foreground hover:text-foreground py-1"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={() => goSection((item as { href: string }).href.replace('#', ''))}
                className="text-left text-sm text-muted-foreground hover:text-foreground py-1"
              >
                {item.label}
              </button>
            ),
          )}
          <Link
            to={QUOTE_PAGE}
            className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
            onClick={() => setOpen(false)}
          >
            <Calculator className="w-4 h-4" aria-hidden />
            Get a quote
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

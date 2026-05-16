import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Menu, X } from 'lucide-react';

type HomeNavProps = {
  scrolled: boolean;
  onScrollTo: (id: string) => void;
};

const sectionLinks = [
  { id: 'manifesto', label: 'Position' },
  { id: 'expertise', label: 'Expertise' },
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'Story' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
] as const;

export function HomeNav({ scrolled, onScrollTo }: HomeNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSection = (id: string) => {
    onScrollTo(id);
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-border/80 bg-background/90 backdrop-blur-md'
          : 'bg-gradient-to-b from-[#0A192F]/80 to-transparent'
      }`}
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => handleSection('hero')}
          className="interactive-link flex items-center gap-2 text-left"
        >
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            Ayabonga Qwabi
          </span>
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {sectionLinks.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => handleSection(id)}
              className="interactive-link font-technical text-sm text-muted-foreground hover:text-foreground"
            >
              {label}
            </button>
          ))}
          <Link
            to="/blog"
            className="interactive-link font-technical text-sm text-muted-foreground hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            to="/get-a-quote"
            className="interactive-link inline-flex items-center gap-1.5 font-technical text-sm text-muted-foreground hover:text-foreground"
          >
            <Calculator className="h-3.5 w-3.5" aria-hidden />
            Quote
          </Link>
        </div>

        <button
          type="button"
          className="interactive-button p-2 text-muted-foreground hover:text-foreground md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="home-mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          id="home-mobile-menu"
          className="mobile-menu-enter border-t border-border bg-background/95 px-6 py-4 backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col gap-4">
            {sectionLinks.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSection(id)}
                className="interactive-link text-left font-technical text-sm text-muted-foreground hover:text-foreground"
              >
                {label}
              </button>
            ))}
            <Link
              to="/blog"
              className="interactive-link font-technical text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/get-a-quote"
              className="interactive-link inline-flex items-center gap-2 font-technical text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              <Calculator className="h-4 w-4" aria-hidden />
              Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

import { useEffect, useState } from 'react';
import { lineReveal } from '../../lib/animations';
import {
  NAV_CTA_BLOG,
  NAV_CTA_QUOTE,
  PRIMARY_NAV_LINKS,
} from '../../lib/site-nav-links';
import { TransitionLink } from '../ui/TransitionLink';
import { NavHamburger } from '../layout/NavHamburger';

type HomeNavProps = {
  scrolled: boolean;
  onScrollTo: (id: string) => void;
};

export function HomeNav({ scrolled, onScrollTo }: HomeNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSection = (id: string) => {
    onScrollTo(id);
    setMobileOpen(false);
  };

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const links = document.querySelectorAll('[data-home-mobile-link]');
    lineReveal(Array.from(links), { stagger: 0.07 });
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 z-[1000] w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--gold)]/15 bg-[rgba(6,14,28,0.88)] backdrop-blur-[20px]'
          : 'bg-gradient-to-b from-[var(--navy)]/80 to-transparent'
      }`}
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => handleSection('hero')}
          className="interactive-link font-display text-2xl font-semibold text-[var(--gold)]"
        >
          AQ
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {PRIMARY_NAV_LINKS.map((item) =>
            item.homeSectionId ? (
              <button
                key={item.label}
                type="button"
                onClick={() => handleSection(item.homeSectionId!)}
                className="nav-link font-sans text-[13px] uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)] hover:text-[var(--warm-white)]"
              >
                {item.label}
              </button>
            ) : (
              <TransitionLink
                key={item.label}
                to={item.to}
                className="nav-link font-sans text-[13px] uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)] hover:text-[var(--warm-white)]"
              >
                {item.label}
              </TransitionLink>
            ),
          )}
          <TransitionLink
            to={NAV_CTA_BLOG.to}
            className="interactive-button rounded-full border border-[var(--gold)] px-4 py-2 font-sans text-xs uppercase tracking-[var(--tracking-label)] text-[var(--gold)]"
          >
            {NAV_CTA_BLOG.label}
          </TransitionLink>
          <TransitionLink
            to={NAV_CTA_QUOTE.to}
            className="interactive-button rounded-full bg-[var(--emerald)] px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[var(--tracking-label)] text-[var(--navy-dark)]"
          >
            {NAV_CTA_QUOTE.label}
          </TransitionLink>
        </div>

        <NavHamburger
          open={mobileOpen}
          onToggle={() => setMobileOpen((open) => !open)}
          controlsId="home-mobile-menu"
        />
      </div>

      {mobileOpen ? (
        <div
          id="home-mobile-menu"
          className="mobile-menu-enter fixed inset-0 z-[200] flex flex-col bg-[var(--navy-dark)] px-8 pt-28 md:hidden"
        >
          <div className="absolute right-6 top-6">
            <NavHamburger
              open
              onToggle={() => setMobileOpen(false)}
              controlsId="home-mobile-menu"
            />
          </div>
          <div className="flex flex-col gap-6">
            {PRIMARY_NAV_LINKS.map((item) =>
              item.homeSectionId ? (
                <span key={item.label} data-home-mobile-link>
                  <button
                    type="button"
                    onClick={() => handleSection(item.homeSectionId!)}
                    className="interactive-link flex min-h-11 w-full items-center text-left font-display text-display-md text-[var(--warm-white)]"
                  >
                    {item.label}
                  </button>
                </span>
              ) : (
                <span key={item.label} data-home-mobile-link>
                  <TransitionLink
                    to={item.to}
                    className="interactive-link flex min-h-11 items-center font-display text-display-md text-[var(--warm-white)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </TransitionLink>
                </span>
              ),
            )}
            <span data-home-mobile-link>
              <TransitionLink
                to={NAV_CTA_BLOG.to}
                className="interactive-link flex min-h-11 items-center font-display text-display-md text-[var(--warm-white)]"
                onClick={() => setMobileOpen(false)}
              >
                {NAV_CTA_BLOG.label}
              </TransitionLink>
            </span>
            <span data-home-mobile-link>
              <TransitionLink
                to={NAV_CTA_QUOTE.to}
                className="interactive-link flex min-h-11 items-center font-display text-display-md text-[var(--gold)]"
                onClick={() => setMobileOpen(false)}
              >
                {NAV_CTA_QUOTE.label}
              </TransitionLink>
            </span>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

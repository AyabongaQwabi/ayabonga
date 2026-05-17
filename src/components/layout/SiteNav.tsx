import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionLink } from '../ui/TransitionLink';
import { lineReveal } from '../../lib/animations';
import {
  NAV_CTA_BLOG,
  NAV_CTA_QUOTE,
  SITE_NAV_LINKS,
} from '../../lib/site-nav-links';
import { NavHamburger } from './NavHamburger';

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const links = document.querySelectorAll('[data-mobile-nav-link]');
    lineReveal(Array.from(links), { stagger: 0.07 });
  }, [mobileOpen]);

  const linkClass = (to: string) => {
    const active =
      to === '/'
        ? location.pathname === '/'
        : location.pathname.startsWith(to);
    return `nav-link font-sans text-[13px] uppercase tracking-[var(--tracking-label)] ${
      active
        ? 'nav-link-active text-[var(--warm-white)]'
        : 'text-[var(--text-muted)] hover:text-[var(--warm-white)]'
    }`;
  };

  return (
    <nav
      className={`fixed top-0 z-[1000] w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-[var(--gold)]/15 bg-[rgba(6,14,28,0.88)] backdrop-blur-[20px]'
          : 'bg-transparent'
      }`}
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <TransitionLink
          to="/"
          className="font-display text-2xl font-semibold text-[var(--gold)]"
        >
          AQ
        </TransitionLink>

        <div className="hidden items-center gap-8 md:flex">
          {SITE_NAV_LINKS.map(({ to, label }) => (
            <TransitionLink key={to} to={to} className={linkClass(to)}>
              {label}
            </TransitionLink>
          ))}
          <TransitionLink
            to={NAV_CTA_BLOG.to}
            className="interactive-button rounded-full border border-[var(--gold)] px-4 py-2 font-sans text-[13px] uppercase tracking-[var(--tracking-label)] text-[var(--gold)]"
          >
            {NAV_CTA_BLOG.label}
          </TransitionLink>
          <TransitionLink
            to={NAV_CTA_QUOTE.to}
            className="interactive-button rounded-full bg-[var(--emerald)] px-4 py-2 font-sans text-[13px] font-semibold uppercase tracking-[var(--tracking-label)] text-[var(--navy-dark)]"
          >
            {NAV_CTA_QUOTE.label}
          </TransitionLink>
        </div>

        <NavHamburger
          open={mobileOpen}
          onToggle={() => setMobileOpen((open) => !open)}
          controlsId="site-mobile-menu"
        />
      </div>

      {mobileOpen ? (
        <div
          id="site-mobile-menu"
          className="mobile-menu-enter fixed inset-0 z-[200] flex flex-col bg-[var(--navy-dark)] px-8 pt-28 md:hidden"
        >
          <div className="absolute right-6 top-6">
            <NavHamburger
              open
              onToggle={() => setMobileOpen(false)}
              controlsId="site-mobile-menu"
            />
          </div>
          <div className="flex flex-col gap-6">
            {SITE_NAV_LINKS.map(({ to, label }) => {
              const active =
                to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(to);
              return (
                <span key={to} data-mobile-nav-link>
                  <TransitionLink
                    to={to}
                    className={`flex min-h-11 items-center font-display text-display-md ${
                      active ? 'text-[var(--gold)]' : 'text-[var(--warm-white)]'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </TransitionLink>
                </span>
              );
            })}
            <span data-mobile-nav-link>
              <TransitionLink
                to={NAV_CTA_BLOG.to}
                className="flex min-h-11 items-center font-display text-display-md text-[var(--warm-white)]"
                onClick={() => setMobileOpen(false)}
              >
                {NAV_CTA_BLOG.label}
              </TransitionLink>
            </span>
            <span data-mobile-nav-link>
              <TransitionLink
                to={NAV_CTA_QUOTE.to}
                className="flex min-h-11 items-center font-display text-display-md text-[var(--gold)]"
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

import { useEffect, useRef } from 'react';
import { Brain } from 'lucide-react';
import { BUSINESS_SITE_ORIGIN, SITE_NAME } from '../lib/site-config';
import { AUTHOR_JOB_TITLE } from '../lib/author-profile';
import { parallaxElement } from '../lib/animations';
import { TransitionLink } from './ui/TransitionLink';

export function SiteFooter() {
  const monogramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!monogramRef.current) return;
    parallaxElement(monogramRef.current, { speed: 0.3 });
  }, []);

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[var(--gold)]/10 bg-[var(--navy-dark)] py-16">
      <div
        ref={monogramRef}
        aria-hidden
        className="pointer-events-none absolute -left-8 top-1/2 -translate-y-1/2 select-none font-display text-[clamp(100px,20vw,300px)] leading-none text-transparent"
        style={{ WebkitTextStroke: '1px rgba(255,215,0,0.08)' }}
      >
        AQ
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-heading-md text-[var(--warm-white)]">
              Built to compound, not just ship.
            </p>
            <p className="mt-2 max-w-md font-technical text-sm text-[var(--text-muted)]">
              Senior product engineering for founders who need architecture, not
              another agency handoff.
            </p>
          </div>
          <TransitionLink
            to="/get-a-quote"
            className="interactive-button inline-flex w-fit rounded-full bg-[var(--emerald)] px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[var(--tracking-label)] text-[var(--navy-dark)]"
          >
            Start a project
          </TransitionLink>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-technical text-label-sm uppercase text-[var(--text-muted)]">
            {new Date().getFullYear()} {SITE_NAME}. {AUTHOR_JOB_TITLE}.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <TransitionLink
              to="/about"
              className="interactive-link text-[var(--text-muted)] hover:text-[var(--warm-white)]"
            >
              About
            </TransitionLink>
            <TransitionLink
              to="/services"
              className="interactive-link text-[var(--text-muted)] hover:text-[var(--warm-white)]"
            >
              Services
            </TransitionLink>
            <TransitionLink
              to="/blog"
              className="interactive-link text-[var(--text-muted)] hover:text-[var(--warm-white)]"
            >
              Writing
            </TransitionLink>
            <TransitionLink
              to="/get-a-quote"
              className="interactive-link text-[var(--text-muted)] hover:text-[var(--warm-white)]"
            >
              Quote
            </TransitionLink>
            <a
              href="https://business.qwabi.co.za"
              className="interactive-link hover:text-[var(--warm-white)]"
              rel="noopener noreferrer"
            >
              Qwabi Engineering
            </a>
            <a
              href="/llms.txt"
              className="interactive-link inline-flex items-center gap-1 text-[var(--text-muted)] hover:text-[var(--warm-white)]"
            >
              <Brain className="h-3.5 w-3.5" aria-hidden />
              llms.txt
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs text-[var(--text-muted)]">
          <TransitionLink
            to="/privacy"
            className="interactive-link hover:text-[var(--warm-white)]"
          >
            Privacy
          </TransitionLink>
          <TransitionLink
            to="/editorial"
            className="interactive-link hover:text-[var(--warm-white)]"
          >
            Editorial standards
          </TransitionLink>
          <TransitionLink
            to="/corrections"
            className="interactive-link hover:text-[var(--warm-white)]"
          >
            Corrections
          </TransitionLink>
            <TransitionLink
              to="/sitemap"
              className="interactive-link hover:text-[var(--warm-white)]"
            >
              Sitemap
            </TransitionLink>
            <a
              href={BUSINESS_SITE_ORIGIN}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-link hover:text-[var(--warm-white)]"
            >
              Qwabi Engineering
            </a>
            <a
              href="https://github.com/ayabongaqwabi"
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-link hover:text-[var(--warm-white)]"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ayabongaqwabi"
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-link hover:text-[var(--warm-white)]"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

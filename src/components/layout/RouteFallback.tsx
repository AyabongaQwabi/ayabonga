import { SiteNav } from './SiteNav';
import { SiteFooter } from '../SiteFooter';

/** Route-level Suspense fallback; prerender waits for real page `#main-content h1`. */
export function RouteFallback() {
  return (
    <div className="min-h-screen bg-[var(--navy)] text-[var(--warm-white)]">
      <SiteNav />
      <main
        id="main-content"
        className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center px-6 pt-24"
        aria-busy="true"
        aria-live="polite"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold)]/80">
          Loading…
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}


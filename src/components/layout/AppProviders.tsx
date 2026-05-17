import { useEffect, type ReactNode } from 'react';
import { PageCurtain } from './PageCurtain';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    let cancelled = false;

    void Promise.all([
      import('../../lib/animations'),
      import('../../lib/lenis'),
    ]).then(([{ registerEasings, notifyScrollInfrastructureReady }, { initLenis, destroyLenis }]) => {
      if (cancelled) {
        destroyLenis();
        return;
      }
      registerEasings();
      const lenis = initLenis();
      if (!lenis) notifyScrollInfrastructureReady();
    });

    return () => {
      cancelled = true;
      void import('../../lib/lenis').then(({ destroyLenis }) => destroyLenis());
    };
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10001] focus:rounded-md focus:bg-[var(--gold-dim)] focus:px-4 focus:py-2 focus:text-[var(--navy-dark)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy-dark)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--gold-dim)]"
      >
        Skip to content
      </a>
      <PageCurtain />
      {children}
    </>
  );
}

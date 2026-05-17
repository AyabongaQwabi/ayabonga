import { PageShell } from '../components/layout/PageShell';
import { TransitionLink } from '../components/ui/TransitionLink';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Home } from 'lucide-react';
import { absoluteUrl, SITE_NAME } from '../lib/site-config';

export default function NotFound() {
  return (
    <PageShell className="bg-background text-foreground font-sans flex flex-col">
      <Helmet>
        <title>{`Page not found | ${SITE_NAME}`}</title>
        <meta name="description" content="This page does not exist on qwabi.co.za." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={absoluteUrl('/')} />
      </Helmet>
      <main id="main-content" className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-md text-center">
          <p className="text-6xl font-bold text-primary/80 mb-4">404</p>
          <h1 className="text-2xl font-semibold text-foreground mb-3">Page not found</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The URL may be outdated or mistyped. Try the homepage or writing archive.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <TransitionLink
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Home className="w-4 h-4" aria-hidden />
              Home
            </TransitionLink>
            <TransitionLink
              to="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground hover:bg-card transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
              Writing
            </TransitionLink>
          </div>
        </div>
      </main>
    </PageShell>
  );
}

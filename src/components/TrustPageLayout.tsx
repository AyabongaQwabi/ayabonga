import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { absoluteUrl, TWITTER_HANDLE } from '../lib/site-config';
import { SiteFooter } from './SiteFooter';

type TrustPageLayoutProps = {
  title: string;
  description: string;
  canonicalPath: string;
  children: ReactNode;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export function TrustPageLayout({
  title,
  description,
  canonicalPath,
  children,
  jsonLd,
}: TrustPageLayoutProps) {
  const canonical = absoluteUrl(canonicalPath);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />
        {jsonLd ? (
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        ) : null}
      </Helmet>

      <nav className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Home
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 md:py-16 prose prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-a:text-primary">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}

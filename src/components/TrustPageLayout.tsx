import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { absoluteUrl, TWITTER_HANDLE } from '../lib/site-config';
import { PageShell } from './layout/PageShell';

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
    <PageShell>
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

      <main
        id="main-content"
        className="mx-auto max-w-3xl px-6 py-12 md:py-16 prose prose-invert prose-headings:font-display prose-headings:text-[var(--warm-white)] prose-p:text-[var(--text-muted)] prose-li:text-[var(--text-muted)] prose-a:text-[var(--gold)]"
      >
        {children}
      </main>
    </PageShell>
  );
}

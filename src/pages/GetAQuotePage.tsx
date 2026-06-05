import { Helmet } from 'react-helmet-async';
import GetAQuote from '../components/GetAQuote.jsx';
import { PageShell } from '../components/layout/PageShell';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
} from '../lib/site-config';
import {
  CLIENT_QUOTE_BUFFER_PERCENT,
  CLIENT_QUOTE_HOURLY_RATE_ZAR,
  CLIENT_QUOTE_HOURS_PER_DAY,
  CLIENT_QUOTE_YEARS_EXPERIENCE,
} from '../config/quoteToolConfig';
import { buildSimplePageGraph } from '../lib/entity-schema';

const PAGE_TITLE = 'Project quote estimator';
const PAGE_DESCRIPTION = `Interactive estimator for app and website builds: feature selection and timeline-adjusted pricing. Assumptions are fixed at R${CLIENT_QUOTE_HOURLY_RATE_ZAR}/hr, ${CLIENT_QUOTE_YEARS_EXPERIENCE} years experience, ${CLIENT_QUOTE_HOURS_PER_DAY} billable hours per day, ${CLIENT_QUOTE_BUFFER_PERCENT}% buffer, ZAR display.`;

export default function GetAQuotePage() {
  return (
    <PageShell>
      <Helmet>
        <title>{`${PAGE_TITLE} | ${SITE_NAME}`}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={absoluteUrl('/get-a-quote')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl('/get-a-quote')} />
        <meta property="og:title" content={`${PAGE_TITLE} | ${SITE_NAME}`} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${PAGE_TITLE} | ${SITE_NAME}`} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify(
            buildSimplePageGraph({
              name: `${PAGE_TITLE} | ${SITE_NAME}`,
              description: PAGE_DESCRIPTION,
              canonical: absoluteUrl('/get-a-quote'),
            }),
          )}
        </script>
      </Helmet>

      <main id="main-content" className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        <header className="mb-10 max-w-3xl">
          <p className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--gold)]">
            Scope and pricing
          </p>
          <h1 className="mt-4 font-display text-heading-lg font-semibold text-[var(--warm-white)]">
            {PAGE_TITLE}
          </h1>
          <p className="mt-4 font-technical text-base leading-relaxed text-[var(--text-muted)]">
            {PAGE_DESCRIPTION}
          </p>
        </header>

        <div className="quote-tool-shell">
          <GetAQuote />
        </div>
      </main>
    </PageShell>
  );
}

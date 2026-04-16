import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import GetAQuote from '../components/GetAQuote.jsx';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
} from '../lib/site-config';

const PAGE_TITLE = 'Project quote estimator';
const PAGE_DESCRIPTION =
  'Interactive estimator for app and website builds: feature selection and timeline-adjusted pricing. Assumptions are fixed at R300/hr, 10 years experience, 4 billable hours per day, 10% buffer, ZAR display.';

export default function GetAQuotePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
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
      </Helmet>

      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl font-bold text-foreground mb-3">{PAGE_TITLE}</h1>
          <p className="text-muted-foreground leading-relaxed">{PAGE_DESCRIPTION}</p>
        </header>

        <GetAQuote />
      </main>
    </div>
  );
}

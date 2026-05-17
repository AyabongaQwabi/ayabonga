import { PageShell } from '../components/layout/PageShell';
import { TransitionLink } from '../components/ui/TransitionLink';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ExternalLink, Music, MessageCircle } from 'lucide-react';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  WHATSAPP_URL,
} from '../lib/site-config';

const ESPAZZA_DOMAIN = 'https://xhosahiphop.co.za';
const PAGE_TITLE = 'eSpazza | Xhosa hip hop streaming (by Ayabonga Qwabi)';
const PAGE_DESCRIPTION =
  'eSpazza is Eastern Cape Xhosa hip hop streaming and culture, built by Ayabonga Qwabi. The public site is temporarily offline while infrastructure is restored.';

export default function EspazzaProject() {
  const canonical = absoluteUrl('/projects/espazza');

  const projectJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'eSpazza',
    applicationCategory: 'MusicApplication',
    operatingSystem: 'Web',
    url: ESPAZZA_DOMAIN,
    description: PAGE_DESCRIPTION,
    author: {
      '@type': 'Person',
      name: SITE_NAME,
      url: absoluteUrl('/'),
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'ZAR',
    },
  });

  return (
    <PageShell className="bg-background text-foreground font-sans">
      <Helmet>
        <title>{`${PAGE_TITLE} | ${SITE_NAME}`}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{projectJsonLd}</script>
      </Helmet>

      <main id="main-content" className="max-w-3xl mx-auto px-6 py-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          <Music className="w-4 h-4" aria-hidden />
          Project
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">eSpazza</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">{PAGE_DESCRIPTION}</p>

        <div
          className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-4 mb-10"
          role="status"
        >
          <p className="text-sm font-medium text-foreground mb-1">Site temporarily offline</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {ESPAZZA_DOMAIN.replace('https://', '')} is down for maintenance. Music and blog content
            will return on that domain. For press, partnerships, or relaunch updates, contact me on
            WhatsApp.
          </p>
        </div>

        <section className="space-y-4 mb-10">
          <h2 className="text-xl font-semibold text-foreground">What it is</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Xhosa hip hop streaming and blogging for Eastern Cape culture</li>
            <li>React and Express with MongoDB (original build)</li>
            <li>Designed and shipped by {SITE_NAME} as a culture-first product</li>
          </ul>
        </section>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#25D366] text-white font-medium hover:bg-[#128C7E] transition-colors"
          >
            <MessageCircle className="w-4 h-4" aria-hidden />
            Ask about eSpazza
          </a>
          <a
            href={ESPAZZA_DOMAIN}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-border text-foreground hover:bg-card transition-colors"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4" aria-hidden />
            Try {ESPAZZA_DOMAIN.replace('https://', '')}
          </a>
          <TransitionLink
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-muted-foreground hover:text-[var(--gold)] transition-colors"
          >
            Hire me for product work
          </TransitionLink>
        </div>
      </main>
        </PageShell>
  );
}

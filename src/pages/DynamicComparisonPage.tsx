import React from 'react';
import { useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { TransitionLink } from '../components/ui/TransitionLink';
import { ScrollReveal } from '../components/ScrollReveal';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  MessageCircle,
  Scale,
} from 'lucide-react';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  WHATSAPP_URL,
} from '../lib/site-config';
import comparisonData from '../data/comparisons.json';
import NotFound from './NotFound';

const DynamicComparisonPage = () => {
  const { slug } = useParams();
  const page = comparisonData.find((p) => p.slug === slug);

  if (!page) {
    return <NotFound />;
  }

  const canonicalPath = `/vs/${page.slug}`;
  const canonical = absoluteUrl(canonicalPath);
  const metaDescription = `Comparing ${page.target} with senior technical co-founder services. ${page.verdict}`;

  return (
    <PageShell className="bg-background text-foreground font-sans selection:bg-emerald-500/30">
      <Helmet>
        <title>{`${page.title} | ${SITE_NAME}`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={`${page.title} | ${SITE_NAME}`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.title,
            description: page.verdict,
            mainEntity: {
              '@type': 'Article',
              headline: page.title,
              author: {
                '@type': 'Person',
                name: 'Ayabonga Qwabi',
              },
            },
          })}
        </script>
      </Helmet>

      <main id="main-content">
      <div className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(5,150,105,0.12),transparent_50%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 uppercase tracking-widest">
            <Scale className="w-4 h-4" aria-hidden />
            <span>Competitive Analysis</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
            {page.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Why founders who care about{' '}
            <span className="text-foreground font-semibold">business ROI</span> choose senior product
            engineering over {page.target.toLowerCase()}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-button inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-lg shadow-lg w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-4 h-4" aria-hidden />
              Message Me on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <ScrollReveal className="py-24 border-t border-border relative block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-card/50 p-8 md:p-12 rounded-2xl border border-border backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 text-destructive">
              <AlertCircle className="w-6 h-6" aria-hidden />
              <h2 className="text-2xl font-bold">The Real Problem</h2>
            </div>
            <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed italic">
              &ldquo;{page.pain_point}&rdquo;
            </p>
          </div>
        </div>
      </ScrollReveal>

      <section className="py-24 bg-card/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Direct Comparison</h2>
            <p className="text-muted-foreground">Hard facts on why senior engineering wins.</p>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden bg-background/40">
            <div
              className="hidden md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] border-b border-border bg-background/60"
              role="row"
            >
              <div className="p-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground" role="columnheader">
                Feature
              </div>
              <div
                className="p-6 text-xs font-semibold uppercase tracking-wider text-emerald-400 border-x border-emerald-500/20 bg-emerald-950/30"
                role="columnheader"
              >
                WITH AYABONGA
              </div>
              <div className="p-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80" role="columnheader">
                {page.target}
              </div>
            </div>

            <ScrollReveal stagger className="block divide-y divide-border">
              {page.comparison_table.map((row) => (
                <div
                  key={row.feature}
                  className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] md:divide-x md:divide-border hover:bg-background/20 transition-colors"
                  role="row"
                >
                  <div className="p-5 md:p-6 font-medium text-foreground border-b md:border-b-0 border-border/50 md:border-none" role="cell">
                    <span className="md:hidden text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                      Feature
                    </span>
                    {row.feature}
                  </div>
                  <div
                    className="p-5 md:p-6 border-b md:border-b-0 border-emerald-500/15 bg-emerald-950/20 md:border-x md:border-emerald-500/20"
                    role="cell"
                  >
                    <span className="md:hidden text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
                      WITH AYABONGA
                    </span>
                    <div className="flex items-start gap-2 text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden />
                      <span>{row.me}</span>
                    </div>
                  </div>
                  <div className="p-5 md:p-6 text-muted-foreground" role="cell">
                    <span className="md:hidden text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 block mb-2">
                      {page.target}
                    </span>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" aria-hidden />
                      <span>{row.them}</span>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ScrollReveal className="py-24 block">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <TrendingUp className="w-12 h-12 text-emerald-500 mx-auto mb-8" aria-hidden />
          <h2 className="text-3xl font-bold mb-6">The Verdict</h2>
          <p className="text-2xl font-medium text-foreground leading-relaxed">{page.verdict}</p>
        </div>
      </ScrollReveal>

      <ScrollReveal className="py-24 relative overflow-hidden bg-emerald-600/5 block">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8">Ready to build a real asset?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Stop gambling with your technical foundation. Hire a senior product engineer who owns the
            result.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-button inline-flex items-center gap-2 px-10 py-5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-xl"
              >
                <MessageCircle className="w-5 h-5" aria-hidden />
                Message Me on WhatsApp
              </a>
              <TransitionLink
                to="/"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 group font-medium"
              >
                Back to Home{' '}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform motion-reduce:group-hover:translate-x-0" />
              </TransitionLink>
            </div>
            <p className="text-sm text-muted-foreground">
              Want a cost estimate first?{' '}
              <TransitionLink
                to="/get-a-quote"
                className="text-emerald-400/90 hover:text-emerald-300 underline underline-offset-4"
              >
                See how I scope and price work
              </TransitionLink>
              .
            </p>
          </div>
        </div>
      </ScrollReveal>

      <div className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <TransitionLink to="/" className="hover:text-emerald-400">
                  Home
                </TransitionLink>
              </li>
              <li aria-hidden>
                <ChevronRight className="w-4 h-4" />
              </li>
              <li>
                <TransitionLink to="/services" className="hover:text-emerald-400">
                  Services
                </TransitionLink>
              </li>
              <li aria-hidden>
                <ChevronRight className="w-4 h-4" />
              </li>
              <li className="text-foreground font-medium">{page.title}</li>
            </ol>
          </nav>
        </div>
      </div>
      </main>
    </PageShell>
  );
};

export default DynamicComparisonPage;

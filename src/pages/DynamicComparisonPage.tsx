import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Scale,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  MessageCircle
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
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
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

        {/* Schema.org for Comparison */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": page.title,
            "description": page.verdict,
            "mainEntity": {
              "@type": "Article",
              "headline": page.title,
              "author": {
                "@type": "Person",
                "name": "Ayabonga Qwabi"
              }
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 uppercase tracking-widest">
            <Scale className="w-4 h-4" />
            <span>Competitive Analysis</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
            {page.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Why founders who care about <span className="text-foreground font-semibold">Business ROI</span> choose senior product engineering over {page.target.toLowerCase()}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-lg transition-all duration-300 shadow-lg w-full sm:w-auto justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              Message Me on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* The Problem Section */}
      <section className="py-24 border-t border-border relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-card/50 p-8 md:p-12 rounded-2xl border border-border backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6 text-destructive">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-2xl font-bold">The Real Problem</h2>
            </div>
            <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed italic">
              "{page.pain_point}"
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Direct Comparison</h2>
            <p className="text-muted-foreground">Hard facts on why senior engineering wins.</p>
          </div>
          
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border">
                  <th className="p-6 text-sm font-semibold uppercase tracking-wider">Feature</th>
                  <th className="p-6 text-sm font-semibold uppercase tracking-wider text-primary">Technical Co-founder</th>
                  <th className="p-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{page.target}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {page.comparison_table.map((row, i) => (
                  <tr key={i} className="hover:bg-background/30 transition-colors">
                    <td className="p-6 font-medium">{row.feature}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                        {row.me}
                      </div>
                    </td>
                    <td className="p-6 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-destructive/50" />
                        {row.them}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Verdict Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <TrendingUp className="w-12 h-12 text-primary mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-6">The Verdict</h2>
          <p className="text-2xl font-medium text-foreground leading-relaxed">
            {page.verdict}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-primary/5">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8">Ready to build a real asset?</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Stop gambling with your technical foundation. Hire a senior product engineer who owns the result.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition-all shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                Message Me on WhatsApp
              </a>
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 group font-medium"
              >
                Back to Home <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Want a cost estimate first?{' '}
              <Link to="/get-a-quote" className="text-primary hover:underline underline-offset-4">See how I scope and price work</Link>.
            </p>
          </div>
        </div>
      </section>
      
      {/* Breadcrumbs */}
      <div className="py-8 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex text-sm text-muted-foreground" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li><Link to="/services" className="hover:text-primary">Services</Link></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li className="text-foreground font-medium">{page.title}</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DynamicComparisonPage;

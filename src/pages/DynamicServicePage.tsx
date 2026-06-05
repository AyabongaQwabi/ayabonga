import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { TransitionLink } from '../components/ui/TransitionLink';
import { Helmet } from 'react-helmet-async';
import { 
  Wallet, 
  Truck, 
  Stethoscope, 
  GraduationCap, 
  ShoppingBag, 
  Brain,
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Zap,
  ChevronRight,
  Home,
  Sun,
  Globe,
  Shield,
  Activity,
  MessageCircle
} from 'lucide-react';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_ORIGIN, TWITTER_HANDLE, WHATSAPP_URL } from '../lib/site-config';
import {
  authorGraphNode,
  buildJsonLdGraph,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from '../lib/entity-schema';
import pseoData from '../data/pseo-pages.json';
import { ScrollReveal } from '../components/ScrollReveal';
import { PageShell } from '../components/layout/PageShell';
import {
  lineReveal,
  registerEasings,
  scrambleDecode,
  scrollMarquee,
} from '../lib/animations';
import NotFound from './NotFound';

type PseoPage = (typeof pseoData)[number];

const bgKeywords: Record<string, string> = {
  'fintech-founders-south-africa': 'FINTECH',
  'logistics-apps-cape-town': 'LOGISTICS',
  'healthcare-startups-johannesburg': 'HEALTH',
  'edutech-platforms-south-africa': 'EDUTECH',
  'marketplace-founders-south-africa': 'MARKET',
  'digital-transformation-experts-south-africa': 'TRANSFORM',
  'ai-integration-specialist-south-africa': 'AI',
  'technical-cofounder-as-a-service-south-africa': 'TAAS',
  'proptech-solutions-south-africa': 'PROPTECH',
  'ecommerce-scale-south-africa': 'ECOMMERCE',
  'saas-product-engineering-south-africa': 'SAAS',
  'solar-energy-platforms-south-africa': 'SOLAR',
};

const iconMap = {
  Wallet,
  Truck,
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  Brain,
  Zap,
  Home,
  Sun,
  Globe,
  Shield,
  Activity
};

function PseoHero({
  page,
  Icon,
}: {
  page: PseoPage;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const bgKeywordRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bgKeyword =
    bgKeywords[page.slug] ?? page.industry?.toUpperCase().slice(0, 12) ?? 'BUILD';

  useEffect(() => {
    registerEasings();
    if (bgKeywordRef.current) scrollMarquee(bgKeywordRef.current, 1);
    if (eyebrowRef.current) scrambleDecode(eyebrowRef.current, { delay: 0.2 });
    if (headlineRef.current) lineReveal(headlineRef.current, { delay: 0.4, stagger: 0.1 });
  }, [page.slug]);

  return (
    <div className="relative overflow-hidden px-6 pb-20 pt-32 lg:px-8">
      <div
        ref={bgKeywordRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[clamp(4rem,18vw,12rem)] font-bold leading-none text-transparent opacity-[0.05]"
        style={{ WebkitTextStroke: '1px rgba(255,215,0,0.35)' }}
      >
        {bgKeyword}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.05),transparent_50%)]" />
      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <div className="glass glow-primary mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-primary">
          <Icon className="h-4 w-4 animate-pulse" />
          <span ref={eyebrowRef} className="uppercase tracking-wider">
            {page.industry} Solutions
          </span>
        </div>
        <h1
          ref={headlineRef}
          className="mb-8 text-4xl font-bold leading-tight tracking-tighter md:text-7xl"
        >
          The Technical Co-founder your <br />
          <span className="text-gradient">{page.industry} Business</span> Actually Needs.
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-slate-400">
          For {page.audience} in {page.location} who are tired of the junior dev lottery and want a partner who builds for business ROI.
        </p>
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-10 py-5 font-bold text-white shadow-xl transition-all duration-300 hover:bg-[#128C7E] sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" />
            Message Me on WhatsApp
          </a>
          <TransitionLink
            to="/technical-cofounder"
            className="glass-dark w-full rounded-xl border-white/5 px-10 py-5 text-center font-bold text-slate-300 transition-all duration-300 hover:bg-white/5 sm:w-auto"
          >
            How TaaS Works
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}

const DynamicServicePage = () => {
  const { slug } = useParams();
  const page = pseoData.find((p) => p.slug === slug);

  if (!page) {
    return <NotFound />;
  }

  const Icon = iconMap[page.icon as keyof typeof iconMap] || Zap;

  const canonicalPath = `/solutions/${page.slug}`;
  const canonical = absoluteUrl(canonicalPath);
  const metaDescription = `Are you an ${page.audience} in ${page.location}? ${page.solution}. Senior technical leadership for your ${page.industry} startup.`;

  return (
    <PageShell className="selection:bg-emerald-500/30">
      <Helmet>
        <title>{`${page.title} | ${SITE_NAME}`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={page.keywords.join(', ')} />
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
          {JSON.stringify(
            buildJsonLdGraph([
              buildOrganizationSchema(),
              buildWebSiteSchema(),
              authorGraphNode(),
              {
                '@type': 'Service',
                '@id': `${canonical}#service`,
                name: page.title,
                description: metaDescription,
                url: canonical,
                provider: { '@id': `${SITE_ORIGIN}/#organization` },
                areaServed: {
                  '@type': 'Country',
                  name: 'South Africa',
                },
                serviceType: page.industry,
              },
            ]),
          )}
        </script>
      </Helmet>

      <main id="main-content">
      <PseoHero page={page} Icon={Icon} />

      {/* Pain Point Section */}
      <ScrollReveal className="py-24 border-t border-slate-900 relative block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">The {page.industry} Build Problem.</h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                {page.pain_point}
              </p>
              <ul className="space-y-4">
                {[
                  "No visibility into technical progress",
                  "Fragile codebases that break under load",
                  "Expensive agency fees with junior talent",
                  "Misalignment between code and business goals"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-500 text-xs font-bold">×</div>
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="interactive-card glass-dark p-10 rounded-2xl border-white/5 shadow-2xl relative group overflow-hidden motion-reduce:hover:translate-y-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                The Senior Engineering Solution
              </h3>
              <p className="text-slate-300 mb-8 leading-relaxed italic text-lg border-l-2 border-primary/30 pl-6">
                "{page.solution}"
              </p>
              <div className="p-6 bg-primary/5 border border-primary/10 rounded-xl glow-primary">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Primary Objective</p>
                <p className="text-white font-semibold text-lg">{page.benefit}</p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Feature Grid */}
      <ScrollReveal className="py-24 bg-slate-900/30 block">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 uppercase tracking-widest text-emerald-500 text-sm">Full-Stack Capability</h2>
          <p className="text-4xl font-bold">End-to-End Ownership of your {page.industry} Platform.</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Product Design",
              desc: "From user journeys to conversion-optimized UIs built with modern React frameworks.",
              icon: Zap,
              color: "text-primary"
            },
            {
              title: "Scalable Backend",
              desc: "Real-time infrastructure using Node.js, Go, or Clojure that scales as you grow.",
              icon: Clock,
              color: "text-accent"
            },
            {
              title: "Secure Payments",
              desc: "Deep integration with Paystack, Stitch, and custom ledger systems.",
              icon: ShieldCheck,
              color: "text-primary"
            }
          ].map((feature, i) => (
            <div key={i} className="interactive-card group p-8 rounded-2xl glass-dark border-white/5 hover:border-primary/50 motion-reduce:hover:translate-y-0">
              <div className={`w-14 h-14 rounded-xl glass mb-6 flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-500 motion-reduce:group-hover:scale-100`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{feature.desc}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* CTA Footer */}
      <ScrollReveal className="py-24 relative overflow-hidden block">
        <div className="absolute inset-0 bg-emerald-600/5" />
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8">Ready to build your {page.industry} MVP?</h2>
          <p className="text-xl text-slate-400 mb-12">
            Stop waiting for an agency. Start building with a partner who owns the outcome.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-button inline-flex items-center gap-2 px-10 py-5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                Message Me on WhatsApp
              </a>
              <TransitionLink
                to="/"
                className="text-slate-400 hover:text-white flex items-center gap-2 group font-medium"
              >
                Back to Home <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform motion-reduce:group-hover:translate-x-0" />
              </TransitionLink>
            </div>
            <p className="text-sm text-slate-500">
              Want a cost estimate first?{' '}
              <TransitionLink to="/get-a-quote" className="text-slate-400 hover:text-white underline underline-offset-4">See how I scope and price work</TransitionLink>.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Breadcrumbs for SEO */}
      <div className="py-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><TransitionLink to="/" className="hover:text-emerald-400">Home</TransitionLink></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li><TransitionLink to="/services" className="hover:text-emerald-400">Services</TransitionLink></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li className="text-slate-300 font-medium">{page.title}</li>
            </ol>
          </nav>
        </div>
      </div>
      </main>
    </PageShell>
  );
};

export default DynamicServicePage;

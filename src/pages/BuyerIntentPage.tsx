import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calculator, ChevronDown, MessageCircle } from 'lucide-react';
import { useId, useState } from 'react';
import { PageBreadcrumbs } from '../components/PageBreadcrumbs';
import { LeadMagnetCard } from '../components/LeadMagnetCard';
import { PricingTable } from '../components/PricingTable';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { SiteFooter } from '../components/SiteFooter';
import { buyerIntentPagesByPath } from '../data/buyer-intent-pages';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  QUOTE_PAGE,
  SITE_ORIGIN,
  TWITTER_HANDLE,
  WHATSAPP_URL,
} from '../lib/site-config';
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildOrganizationSchema,
} from '../lib/entity-schema';
import { authorPersonSchema } from '../lib/author-profile';
import NotFound from './NotFound';

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
        <button
          type="button"
          id={`${panelId}-trigger`}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-expanded={open}
        >
          <span className="font-semibold text-foreground">{question}</span>
          <ChevronDown
            className={`w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        {open ? (
          <p
            id={panelId}
            role="region"
            aria-labelledby={`${panelId}-trigger`}
            className="px-5 pb-4 text-muted-foreground leading-relaxed"
          >
            {answer}
          </p>
        ) : null}
    </div>
  );
}

export default function BuyerIntentPage() {
  const { pathname } = useLocation();
  const page = buyerIntentPagesByPath[pathname];

  if (!page) {
    return <NotFound />;
  }

  const canonical = absoluteUrl(page.path);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: page.h1, path: page.path },
  ]);
  const faqSchema = buildFaqPageSchema(page.faqs);
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganizationSchema(),
      authorPersonSchema({ url: absoluteUrl('/about') }),
      {
        '@type': 'Service',
        name: page.h1,
        description: page.metaDescription,
        provider: { '@id': `${SITE_ORIGIN}/#organization` },
        areaServed: {
          '@type': 'Country',
          name: 'South Africa',
        },
        serviceType: page.serviceType,
        url: canonical,
      },
      breadcrumbSchema,
      faqSchema,
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Helmet>
        <title>{page.metaTitle}</title>
        <meta name="description" content={page.metaDescription} />
        <meta name="keywords" content={page.keywords.join(', ')} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={page.metaTitle} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>

      <nav className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
              Home
            </Link>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <Link
                to="/services"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Services
              </Link>
              <Link
                to={QUOTE_PAGE}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Get a quote
              </Link>
            </div>
          </div>
      </nav>

      <FloatingWhatsApp />

      <main
        className={`flex-1 mx-auto px-6 py-10 md:py-14 w-full ${
          page.pricingTables?.length ? 'max-w-4xl' : 'max-w-3xl'
        }`}
      >
        <PageBreadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Services', to: '/services' },
            { label: page.h1 },
          ]}
        />

        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
          {page.eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-5">
          {page.h1}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12">{page.heroSubhead}</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-14">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#128C7E] transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <MessageCircle className="w-5 h-5" aria-hidden />
              Message on WhatsApp
            </a>
            <Link
              to={QUOTE_PAGE}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-card border border-border rounded-xl font-semibold hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Calculator className="w-5 h-5 text-primary" aria-hidden />
              Scope and estimate
            </Link>
        </div>

        {page.pricingTables?.length ? (
          <section className="mb-16 space-y-10" aria-labelledby="pricing-tables-heading">
            <h2 id="pricing-tables-heading" className="text-2xl font-bold text-foreground">
              Pricing by app type (ZAR, 2026)
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed -mt-6">
              Ballpark ranges for planning. Your quote depends on scope, integrations, and who writes
              production code.{' '}
              <Link to={QUOTE_PAGE} className="text-primary hover:underline underline-offset-4">
                Get a scoped estimate
              </Link>
              .
            </p>
            {page.pricingTables.map((table) => (
              <PricingTable key={table.id} table={table} />
            ))}
          </section>
        ) : null}

        {page.showLeadMagnet ? (
          <div className="mb-16">
            <LeadMagnetCard />
          </div>
        ) : null}

        <div className="space-y-12">
          {page.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xl font-bold text-foreground mb-4">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 48)}
                  className="text-muted-foreground leading-relaxed mb-4"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="space-y-2.5 text-muted-foreground">
                  {section.bullets.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed">
                      <span className="text-primary mt-1.5 shrink-0" aria-hidden>
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <section className="mt-16 pt-12 border-t border-border" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold text-foreground mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {page.faqs.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        <section className="mt-14 p-8 rounded-2xl bg-primary/5 border border-primary/15">
          <h2 className="text-xl font-bold text-foreground mb-2">{page.ctaHeadline}</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">{page.ctaSubhead}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#128C7E] transition-colors"
            >
              <MessageCircle className="w-5 h-5" aria-hidden />
              WhatsApp
            </a>
            <Link
              to={QUOTE_PAGE}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border rounded-xl font-semibold hover:border-primary/50 transition-colors"
            >
              Get a quote
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Related
          </h2>
          <ul className="space-y-2">
            {page.relatedLinks.map((link) => {
              const external = link.path.startsWith('http');
              return (
                <li key={link.path}>
                  {external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline underline-offset-4"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className="text-primary hover:underline underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  MessageCircle,
  Shield,
  Smartphone,
  Store,
  Stethoscope,
  Workflow,
} from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import ProjectCard from '../components/ProjectCard';
import { MarketingNav } from '../components/MarketingNav';
import { FloatingWhatsApp } from '../components/FloatingWhatsApp';
import { LeadMagnetCard } from '../components/LeadMagnetCard';
import { SiteFooter } from '../components/SiteFooter';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  QUOTE_PAGE,
  TWITTER_HANDLE,
  WHATSAPP_URL,
} from '../lib/site-config';
import { authorPersonSchema } from '../lib/author-profile';
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from '../lib/entity-schema';

const HOME_TITLE =
  'Custom App Developer South Africa | Ecommerce, Marketplaces & MVPs';
const HOME_DESCRIPTION =
  'Senior AI and cloud engineer for South African founders. Ecommerce apps, marketplaces, fintech, health systems, WhatsApp bots, and MVPs. WhatsApp or scoped quote.';

const buildTypes = [
  {
    icon: Store,
    title: 'Ecommerce & marketplaces',
    copy: 'Catalog, checkout, vendor payouts, and ops dashboards. Laundry Marketplace is a live reference.',
    link: '/app-development-cost-south-africa#ecommerce',
  },
  {
    icon: Smartphone,
    title: 'Android & iOS apps',
    copy: 'React Native, Flutter, or native when NFC and performance demand it. UTap shipped campus wallet patterns.',
    link: '/app-development-cost-south-africa#mobile',
  },
  {
    icon: Stethoscope,
    title: 'Health & patient systems',
    copy: 'Bookings, occupational health, staff workflows. ClinicPlus covers mining-sector clinic access.',
    link: '/app-development-cost-south-africa#health',
  },
  {
    icon: Workflow,
    title: 'Business operations software',
    copy: 'Replace spreadsheets with role-based tools, approvals, and integrations your team actually uses.',
    link: '/app-development-cost-south-africa#business-ops',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp AI & automation',
    copy: 'Lead capture and support where your customers already chat. Grounded bots, human handoff.',
    link: '/whatsapp-ai-chatbot-south-africa',
  },
  {
    icon: Shield,
    title: 'Fintech & payments',
    copy: 'Paystack, PayFast, Ozow, Yoco. Webhooks, reconciliation, and failed-payment paths built in.',
    link: '/app-development-cost-south-africa#fintech',
  },
];

const serviceLinks = [
  { label: 'App development cost (2026)', path: '/app-development-cost-south-africa' },
  { label: 'MVP developer South Africa', path: '/mvp-developer-south-africa' },
  { label: 'Technical co-founder (TaaS)', path: '/technical-cofounder' },
  { label: 'All engineering services', path: '/services' },
];

const projects = [
  {
    title: 'Laundry Marketplace',
    description: 'Multi-sided laundry marketplace: customers, providers, and operations.',
    url: 'https://laundry.qwabi.co.za',
    tech: ['Next.js', 'Marketplace', 'Payments'],
  },
  {
    title: 'ClinicPlus',
    description: 'Occupational health bookings for mining companies in Witbank.',
    url: 'https://clinicplusbookings.co.za',
    tech: ['React', 'Health', 'Bookings'],
  },
  {
    title: 'UTap',
    description: 'University NFC wallet for campus access and payments.',
    url: 'https://utaptech.co.za',
    tech: ['React Native', 'NFC', 'Fintech'],
  },
  {
    title: 'Queens Connect',
    description: 'Community AI assistant for Queenstown with local context.',
    url: 'https://queensconnect.qwabi.co.za',
    tech: ['AI', 'WhatsApp-ready patterns'],
  },
];

const proofPoints = [
  '10+ years shipping production software in South Africa',
  'Fintech, marketplaces, and health bookings in portfolio',
  'One senior engineer on your build, not a bait-and-switch agency bench',
  'Honest scope: what ships in v1 vs what waits',
  'Local payments and POPIA-aware design by default',
];

export default function HomePage() {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 88;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Helmet>
        <title>{HOME_TITLE}</title>
        <meta name="description" content={HOME_DESCRIPTION} />
        <meta
          name="keywords"
          content="app development cost south africa, mvp developer south africa, ecommerce app developer south africa, marketplace app developer, custom software developer south africa, whatsapp chatbot developer south africa"
        />
        <link rel="canonical" href={absoluteUrl('/')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl('/')} />
        <meta property="og:title" content={HOME_TITLE} />
        <meta property="og:description" content={HOME_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={HOME_TITLE} />
        <meta name="twitter:description" content={HOME_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              buildOrganizationSchema(),
              {
                ...authorPersonSchema({ url: absoluteUrl('/about') }),
                '@id': `${absoluteUrl('/')}#person`,
              },
              buildWebSiteSchema(),
              {
                '@type': 'ProfessionalService',
                name: 'Ayabonga Qwabi — App & Software Development',
                url: absoluteUrl('/'),
                areaServed: { '@type': 'Country', name: 'South Africa' },
                description: HOME_DESCRIPTION,
                provider: { '@id': `${absoluteUrl('/')}#person` },
              },
            ],
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background text-foreground font-sans">
        <MarketingNav onNavigateSection={scrollTo} />
        <FloatingWhatsApp />

        <main className="max-w-6xl mx-auto px-6">
          <section className="pt-28 pb-16 md:pt-36 md:pb-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              Senior technical partner · South Africa
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-balance max-w-4xl">
              Business-right app development for founders who cannot afford a rebuild
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              I am Ayabonga Qwabi, an AI Specialist and Cloud Architect with 10+ years in production
              software. I build ecommerce platforms, marketplaces, mobile apps, health systems,
              fintech integrations, and MVPs without agency overhead or the junior dev lottery.
            </p>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3 max-w-2xl">
              {proofPoints.slice(0, 4).map((point) => (
                <li key={point} className="flex gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#128C7E] transition-colors shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <MessageCircle className="w-5 h-5" aria-hidden />
                WhatsApp me
              </a>
              <Link
                to={QUOTE_PAGE}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Calculator className="w-5 h-5" aria-hidden />
                Get a scoped quote
              </Link>
              <Link
                to="/app-development-cost-south-africa"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border rounded-xl font-semibold hover:border-primary/40 bg-card transition-colors"
              >
                2026 cost guide
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </section>

          <section id="build" className="py-16 border-t border-border scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">What I build</h2>
            <p className="text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              From startup MVPs to operations software for established businesses. If it runs on
              phones, browsers, or WhatsApp, and it must survive real South African users, I have
              likely shipped something adjacent before.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buildTypes.map(({ icon: Icon, title, copy, link }) => (
                <Link
                  key={title}
                  to={link}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Icon className="w-8 h-8 text-primary mb-4" aria-hidden />
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{copy}</p>
                </Link>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Also: bespoke custom apps, portfolio sites, app rescues, and scaling existing products.{' '}
              <Link to="/services" className="text-primary hover:underline underline-offset-4">
                View all services
              </Link>
            </p>
          </section>

          <section className="py-16 border-t border-border">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Technical cofounder energy without giving up equity
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You get one accountable senior engineer across product decisions, architecture,
                  and delivery. I tell you what is realistic for budget and timeline before you sign,
                  including hidden costs like admin tools, payment edge cases, and post-launch
                  maintenance.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Cheap quotes often mean junior execution and a paid rewrite six months later. I
                  would rather scope an honest MVP than promise a full marketplace at R50k.
                </p>
                <ul className="space-y-2">
                  {serviceLinks.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="inline-flex items-center gap-2 text-primary hover:underline underline-offset-4 text-sm font-medium"
                      >
                        {item.label}
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <LeadMagnetCard />
            </div>
          </section>

          <section id="work" className="py-16 border-t border-border scroll-mt-24">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Shipped work</h2>
            <p className="text-muted-foreground max-w-2xl mb-10">
              Real products in market, not mockups. Collaborations include Simply, Warner Music
              Africa, and Western Cape Labs.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </section>

          <section id="contact" className="py-16 md:py-24 border-t border-border scroll-mt-24">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Tell me what you are building</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Send a voice note on WhatsApp or use the quote tool. I reply with whether I am a fit,
                a rough budget band, and what I would put in phase one.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#128C7E] transition-colors"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden />
                  WhatsApp
                </a>
                <Link
                  to={QUOTE_PAGE}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Get a quote
                </Link>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
        <SpeedInsights />
        <Analytics />
      </div>
    </>
  );
}

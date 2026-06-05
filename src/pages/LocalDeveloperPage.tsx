import { Navigate, useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { TransitionLink } from '../components/ui/TransitionLink';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code2,
  Layout,
  MessageCircle,
  Server,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  WHATSAPP_URL,
} from '../lib/site-config';
import { ScrollReveal } from '../components/ScrollReveal';
import {
  buildLocalFaqs,
  buildLocalFaqSchema,
  buildLocalPageDescription,
  buildLocalPageKeywords,
  buildLocalPageTitle,
  buildLocalSchema,
  cityDisplayName,
  easternCapeHubPath,
  getAllRoles,
  getCity,
  getRole,
  localPagePath,
  type RoleSlug,
} from '../lib/local-developers';
import {
  authorGraphNode,
  buildJsonLdGraph,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from '../lib/entity-schema';

const localServices: Record<RoleSlug, string[]> = {
  'software-developer': [
    'MVPs and product builds (React, Node, TypeScript)',
    'API design and third-party integrations',
    'Paystack-ready payments and auth flows',
  ],
  'software-engineer': [
    'Production architecture and code review',
    'CI/CD, testing, and deployment pipelines',
    'Performance tuning and technical debt reduction',
  ],
  'web-developer': [
    'Marketing sites and web apps with strong SEO',
    'Responsive UI built for SA mobile networks',
    'CMS or headless content when you need it',
  ],
  'web-designer': [
    'UI systems and conversion-focused layouts',
    'Design-to-code handoff in React and Tailwind',
    'Accessible components and brand-consistent pages',
  ],
  'cloud-architect': [
    'GCP, AWS, or Azure architecture and IaC',
    'Serverless and container workloads',
    'Security baselines and cost-aware scaling',
  ],
};

const roleIcons: Record<RoleSlug, typeof Code2> = {
  'software-developer': Code2,
  'software-engineer': Server,
  'web-developer': Layout,
  'web-designer': Layout,
  'cloud-architect': Cloud,
};

export default function LocalDeveloperPage() {
  const { city: citySlug, role: roleSlug } = useParams();
  const city = citySlug ? getCity(citySlug) : undefined;
  const role = roleSlug ? getRole(roleSlug) : undefined;

  if (!city || !role || city.region !== 'eastern-cape') {
    return <Navigate to={easternCapeHubPath()} replace />;
  }

  const pageTitle = buildLocalPageTitle(role, city);
  const pageDescription = buildLocalPageDescription(role, city);
  const keywords = buildLocalPageKeywords(role, city);
  const canonicalPath = localPagePath(city.slug, role.slug);
  const canonical = absoluteUrl(canonicalPath);
  const faqs = buildLocalFaqs(role, city);
  const RoleIcon = roleIcons[role.slug];
  const ogTitle = `${pageTitle} | ${SITE_NAME}`;
  const otherRoles = getAllRoles().filter((r) => r.slug !== role.slug);

  const pageJsonLd = JSON.stringify(
    buildJsonLdGraph([
      buildOrganizationSchema(),
      buildWebSiteSchema(),
      authorGraphNode(),
      buildLocalSchema(role, city, canonical),
      buildLocalFaqSchema(role, city),
    ]),
  );

  return (
    <PageShell className="bg-background text-foreground font-sans">
      <Helmet>
        <title>{ogTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{pageJsonLd}</script>
      </Helmet>

      <main id="main-content" className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-12 max-w-3xl">
          <div className="relative overflow-hidden rounded-2xl border border-border p-8 md:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `linear-gradient(135deg, transparent 46%, rgba(255, 215, 0, 0.35) 50%, transparent 54%), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)`,
                backgroundSize: '64px 64px, 24px 24px, 24px 24px',
              }}
            />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                <RoleIcon className="w-3.5 h-3.5" aria-hidden />
                <span>{cityDisplayName(city)} · Eastern Cape</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight text-balance">
                {pageTitle}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{pageDescription}</p>
            </div>
          </div>
        </header>

        <ScrollReveal className="mb-14 max-w-none block">
          <p className="text-foreground leading-relaxed text-lg">{city.localIntro}</p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            As a senior {role.label.toLowerCase()}, I focus on {role.shortFocus}. You work directly with
            me (not a junior bench). Builds include automated tests, Paystack-ready payments, and cloud
            deployment on GCP, AWS, or Azure when you need scale.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            <span className="text-foreground font-medium">Relevant work:</span> {city.nearbyProof}.
          </p>
        </ScrollReveal>

        <ScrollReveal stagger className="mb-14 grid sm:grid-cols-2 gap-4">
          {[
            'Mobile-first for SA networks and load shedding realities',
            'Visible progress every few days, not months of silence',
            'Queenstown-based, serving all of the Eastern Cape remotely',
            'Fixed-scope Phase 1 so you avoid endless hourly drift',
          ].map((item) => (
            <div
              key={item}
              className="interactive-card flex items-start gap-3 p-4 rounded-lg border border-border bg-card/50 motion-reduce:hover:translate-y-0"
            >
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden />
              <span className="text-sm text-foreground">{item}</span>
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal className="mb-14 block">
          <h2 className="text-2xl font-bold mb-6">Services for {city.name}</h2>
          <ul className="space-y-3">
            {localServices[role.slug].map((item) => (
              <li key={item} className="flex items-start gap-3 text-muted-foreground">
                <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-1" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal className="mb-14 flex flex-col sm:flex-row gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive-button inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-lg"
          >
            <MessageCircle className="w-5 h-5" aria-hidden />
            WhatsApp from {city.name}
          </a>
          <TransitionLink
            to="/get-a-quote"
            className="interactive-button inline-flex items-center justify-center gap-2 px-6 py-3 border border-border hover:border-primary/50 hover:text-[var(--gold)] text-foreground font-semibold rounded-lg"
          >
            Get a project quote
          </TransitionLink>
        </ScrollReveal>

        <ScrollReveal className="mb-14 block">
          <h2 className="text-2xl font-bold mb-6">Common questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>

        <ScrollReveal className="mb-14 block">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Other roles in {city.name}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {otherRoles.map((r) => (
              <li key={r.slug}>
                <TransitionLink
                  to={localPagePath(city.slug, r.slug)}
                  className="interactive-link inline-block text-sm px-3 py-1.5 rounded-md border border-border hover:border-primary/50 text-muted-foreground hover:text-[var(--gold)]"
                >
                  {r.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal className="mb-14 rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-10 text-center block">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Start a project in {city.name}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Tell me what you are building. I will reply with scope, timeline, and a fixed Phase 1 quote.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-button inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-lg w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" aria-hidden />
              WhatsApp
            </a>
            <TransitionLink
              to="/get-a-quote"
              className="interactive-button inline-flex items-center justify-center gap-2 px-6 py-3 border border-border hover:border-primary/50 hover:text-[var(--gold)] font-semibold rounded-lg w-full sm:w-auto"
            >
              Get a quote
            </TransitionLink>
          </div>
        </ScrollReveal>

        <ScrollReveal className="border-t border-border pt-10 block">
          <TransitionLink
            to="/technical-cofounder"
            className="inline-flex items-center gap-1 text-sm text-primary hover:text-[var(--gold)] underline-offset-4 hover:underline"
          >
            Technical co-founder as a Service
            <ChevronRight className="w-4 h-4" aria-hidden />
          </TransitionLink>
        </ScrollReveal>
      </main>

      <footer className="border-t border-border py-6">
        <nav className="max-w-5xl mx-auto px-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <TransitionLink to="/" className="hover:text-[var(--gold)]">
                Home
              </TransitionLink>
            </li>
            <li aria-hidden>
              <ChevronRight className="w-4 h-4 inline" />
            </li>
            <li>
              <TransitionLink to={easternCapeHubPath()} className="hover:text-[var(--gold)]">
                Eastern Cape
              </TransitionLink>
            </li>
            <li aria-hidden>
              <ChevronRight className="w-4 h-4 inline" />
            </li>
            <li>
              <span className="text-foreground">{city.name}</span>
            </li>
            <li aria-hidden>
              <ChevronRight className="w-4 h-4 inline" />
            </li>
            <li>
              <span className="text-foreground">{role.label}</span>
            </li>
          </ol>
        </nav>
      </footer>
        </PageShell>
  );
}

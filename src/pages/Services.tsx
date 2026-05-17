import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageShell } from '../components/layout/PageShell';
import { HomeFinalCta } from '../components/home/HomeFinalCta';
import { TransitionLink } from '../components/ui/TransitionLink';
import {
  countUp,
  killScrollTriggers,
  lineReveal,
  pinScrollSection,
  registerEasings,
  scrambleDecode,
} from '../lib/animations';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
} from '../lib/site-config';

const PAGE_TITLE = 'Engineering Services';
const PAGE_DESCRIPTION =
  'Senior product engineering for founders and agencies in South Africa. Technical partnership, MVPs, white-label delivery, and cloud systems without agency overhead.';

const DECORATIVE_SERVICES = [
  'TAAS',
  'MVP',
  'SAAS',
  'AI',
  'CLOUD',
  'BUILD',
] as const;

const HERO_STATS = [
  { id: 'years', target: 10, suffix: '+', label: 'Years shipping' },
  { id: 'products', target: 6, suffix: '+', label: 'Products live' },
  { id: 'mvp', target: 8, suffix: ' wks', label: 'Typical MVP window' },
] as const;

const SERVICES = [
  {
    num: 1,
    name: 'Technical co-founder as a Service',
    tagline: 'Senior product ownership without giving up equity.',
    bullets: [
      'Architecture, full-stack build, and launch in one engagement',
      'Paystack, Stitch, and Ozow-ready payment flows',
      'POPIA-aware data patterns from day one',
      'Testable progress every few days, not monthly demos',
    ],
    idealFor: 'Non-technical founders who need a production MVP in 4–8 weeks.',
    cta: { to: '/technical-cofounder', label: 'Discuss TaaS' },
    largeTitle: true,
  },
  {
    num: 2,
    name: 'White-label engineering',
    tagline: 'Your client sees your brand. I ship the codebase.',
    bullets: [
      'Agency-grade delivery without bench rotation',
      'React, Next.js, and Supabase stacks you can hand off',
      'Documentation and deploy runbooks included',
      'NDA-first workflow for client confidentiality',
    ],
    idealFor: 'Consultancies and studios protecting reputation on big accounts.',
    cta: { to: '/get-a-quote', label: 'Discuss white-label' },
    largeTitle: false,
  },
  {
    num: 3,
    name: 'Digital transformation & SaaS',
    tagline: 'Turn manual chaos into software your team trusts.',
    bullets: [
      'Booking, ops, and customer portals that replace WhatsApp workflows',
      'Role-based access and audit trails for growing teams',
      'Integrations with accounting and messaging tools you already use',
      'Roadmaps that phase cost instead of big-bang rewrites',
    ],
    idealFor: 'Established businesses ready to digitize without losing what works.',
    cta: { to: '/solutions/digital-transformation-experts-south-africa', label: 'Discuss transformation' },
    largeTitle: false,
  },
  {
    num: 4,
    name: 'AI & cloud systems',
    tagline: 'LLM features and infrastructure that survive production traffic.',
    bullets: [
      'GCP, AWS, and Azure architecture with clear cost guardrails',
      'RAG pipelines, agents, and evals before you ship to users',
      'Serverless and Kubernetes when scale actually demands it',
      'Observability, backups, and incident playbooks included',
    ],
    idealFor: 'Teams adding intelligence or scaling beyond a single region.',
    cta: { to: '/solutions/ai-integration-specialist-south-africa', label: 'Discuss AI & cloud' },
    largeTitle: false,
  },
] as const;

const PROCESS_STEPS = [
  {
    num: '01',
    phase: 'Discovery',
    description:
      'We map the problem, constraints, and success metrics. You get a written scope, stack recommendation, and realistic timeline before any build starts.',
  },
  {
    num: '02',
    phase: 'Architecture',
    description:
      'Data models, API contracts, and deployment shape are locked early. No surprise rewrites when payments or compliance show up mid-build.',
  },
  {
    num: '03',
    phase: 'Build',
    description:
      'Iterative delivery with demos every few days. You see working software, not slide decks. Changes stay small because the foundation was set in phase two.',
  },
  {
    num: '04',
    phase: 'Launch',
    description:
      'Production deploy, monitoring, and handoff docs. I stay through the first real users so you are not alone on launch weekend.',
  },
] as const;

const outlineNumStyle = {
  WebkitTextStroke: '1px var(--gold)',
  color: 'transparent',
} as const;

export default function ServicesPage() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const processRef = useRef<HTMLElement>(null);

  useEffect(() => {
    registerEasings();
    if (eyebrowRef.current) scrambleDecode(eyebrowRef.current, { delay: 0.2 });
    if (headlineRef.current) lineReveal(headlineRef.current, { delay: 0.35 });

    HERO_STATS.forEach((stat) => {
      const el = document.querySelector(`[data-stat="${stat.id}"]`);
      if (el) countUp(el, stat.target, { suffix: stat.suffix, duration: 1.4 });
    });

    SERVICES.forEach((service) => {
      const el = document.querySelector(`[data-service-num="${service.num}"]`);
      if (el) countUp(el, service.num, { duration: 1.2 });
    });

    const unpinProcess = processRef.current
      ? pinScrollSection(processRef.current, '.process-step')
      : undefined;

    return () => {
      unpinProcess?.();
      killScrollTriggers();
    };
  }, []);

  return (
    <PageShell>
      <Helmet>
        <title>{`${PAGE_TITLE} | ${SITE_NAME}`}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={absoluteUrl('/services')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl('/services')} />
        <meta property="og:title" content={`${PAGE_TITLE} | ${SITE_NAME}`} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main id="main-content">
        {/* Section 1: Hero */}
        <section
          className="relative flex min-h-[80svh] items-end overflow-hidden bg-[var(--navy-dark)]"
          aria-labelledby="services-hero-heading"
        >
          <div
            className="pointer-events-none absolute right-0 top-1/4 hidden w-[min(42vw,320px)] select-none lg:block"
            aria-hidden
          >
            <ul
              className="flex flex-col gap-1 font-display text-display-md leading-none opacity-[0.15]"
              style={{ transform: 'rotate(-3deg)' }}
            >
              {DECORATIVE_SERVICES.map((label) => (
                <li key={label} style={outlineNumStyle}>
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--navy-dark)]"
            aria-hidden
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-28 md:pb-24">
            <p
              ref={eyebrowRef}
              className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]"
            >
              Capabilities
            </p>
            <h1
              id="services-hero-heading"
              ref={headlineRef}
              className="mt-6 max-w-[16ch] font-display text-display-lg font-semibold text-[var(--warm-white)]"
            >
              Engineering services built for momentum.
            </h1>
            <p className="mt-6 max-w-xl font-technical text-lg leading-[var(--leading-body)] text-[var(--text-muted)]">
              Not project shops. Not junior-dev lotteries. Senior technical partnership from
              discovery through launch.
            </p>

            <ul className="mt-12 flex flex-wrap gap-8 border-t border-[var(--warm-white)]/10 pt-8 md:gap-12">
              {HERO_STATS.map((stat) => (
                <li key={stat.id}>
                  <p
                    data-stat={stat.id}
                    className="font-display text-heading-lg font-semibold text-[var(--gold)] tabular-nums"
                  >
                    0{stat.suffix}
                  </p>
                  <p className="mt-1 font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 2: Service detail */}
        {SERVICES.map((service, index) => (
          <section
            key={service.num}
            className={`border-t border-[var(--warm-white)]/5 py-20 md:py-28 ${
              index % 2 === 0 ? 'bg-[var(--navy)]' : 'bg-[var(--slate)]'
            }`}
            aria-labelledby={`service-${service.num}-title`}
          >
            <div className="mx-auto max-w-7xl px-6">
              <article className="group relative max-w-5xl border-l-2 border-transparent pl-6 transition-[border-color] duration-300 hover:border-[var(--gold)] md:pl-10">
                <p
                  data-service-num={service.num}
                  className="font-display text-display-md font-semibold tabular-nums leading-none"
                  style={outlineNumStyle}
                  aria-hidden
                >
                  00
                </p>
                <p className="sr-only">Service {service.num}</p>

                <h2
                  id={`service-${service.num}-title`}
                  className={`mt-4 font-display font-semibold text-[var(--warm-white)] ${
                    service.largeTitle ? 'text-display-lg' : 'text-display-md'
                  }`}
                >
                  {service.name}
                </h2>
                <p className="mt-4 max-w-2xl font-display text-heading-md text-[var(--text-muted)]">
                  {service.tagline}
                </p>

                <ul className="mt-8 space-y-3">
                  {service.bullets.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 font-technical text-base leading-relaxed text-[var(--warm-white)]/90"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--emerald)]"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 font-technical text-sm italic text-[var(--text-muted)]">
                  Ideal for: {service.idealFor}
                </p>

                <TransitionLink
                  to={service.cta.to}
                  className="interactive-link mt-8 inline-flex items-center gap-2 font-technical text-sm font-semibold text-[var(--gold)]"
                >
                  {service.cta.label}
                  <span aria-hidden>→</span>
                </TransitionLink>
              </article>
            </div>
          </section>
        ))}

        {/* Section 3: Process (pinned) */}
        <section
          ref={processRef}
          className="relative min-h-[100svh] overflow-hidden bg-[var(--navy)]"
          aria-labelledby="process-heading"
        >
          <p
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-display-xl leading-none opacity-[0.06]"
            style={outlineNumStyle}
            aria-hidden
          >
            PROCESS
          </p>

          <div className="relative z-10 flex min-h-[100svh] flex-col justify-center px-6 py-20">
            <p className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--gold)]">
              The process
            </p>
            <h2
              id="process-heading"
              className="sr-only"
            >
              How we work
            </h2>

            <div className="relative mx-auto mt-12 h-[55vh] w-full max-w-4xl md:h-[60vh]">
              {PROCESS_STEPS.map((step, i) => (
                <article
                  key={step.num}
                  className={`process-step flex min-h-[50vh] flex-col justify-center md:min-h-[60vh] ${
                    i > 0 ? 'absolute inset-x-6 top-0 md:inset-x-auto md:left-1/2 md:w-full md:max-w-4xl md:-translate-x-1/2' : ''
                  }`}
                >
                  {i < PROCESS_STEPS.length - 1 && (
                    <div
                      className="absolute bottom-8 left-0 hidden h-px w-full max-w-xs bg-[var(--gold)]/25 md:block"
                      aria-hidden
                    />
                  )}
                  <p
                    className="font-display text-display-md font-semibold leading-none"
                    style={outlineNumStyle}
                  >
                    {step.num}
                  </p>
                  <h3 className="mt-4 font-display text-heading-lg font-semibold text-[var(--warm-white)]">
                    {step.phase}
                  </h3>
                  <p className="mt-4 max-w-xl font-technical text-lg leading-[var(--leading-body)] text-[var(--text-muted)]">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Pricing philosophy */}
        <section
          className="gold-band py-24 md:py-32"
          aria-labelledby="pricing-heading"
        >
          <div className="mx-auto max-w-7xl px-6">
            <h2
              id="pricing-heading"
              className="max-w-3xl font-display text-display-md font-semibold text-[var(--gold-band-fg)]"
            >
              Project-based. Retainer-based. Direct.
            </h2>
            <p className="gold-band-muted mt-6 max-w-2xl font-technical text-lg leading-relaxed">
              I price against outcomes and scope, not hours billed to juniors. Fixed-phase builds
              for MVPs, monthly retainers when you need ongoing product leadership, and clear
              change control when scope shifts. No surprise invoices, no account-manager layer.
            </p>
            <TransitionLink
              to="/get-a-quote"
              className="interactive-link mt-10 inline-flex items-center gap-2 font-technical text-sm font-semibold text-[var(--gold-band-fg)]"
            >
              See cost ranges
              <span aria-hidden>→</span>
            </TransitionLink>
          </div>
        </section>

        {/* Section 5: CTA */}
        <HomeFinalCta />
      </main>
    </PageShell>
  );
}

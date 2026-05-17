import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageShell } from '../components/layout/PageShell';
import { TransitionLink } from '../components/ui/TransitionLink';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import {
  countUp,
  killScrollTriggers,
  lineReveal,
  pinScrollSection,
  refreshScrollTriggers,
  registerEasings,
  scaleXReveal,
  scrambleDecode,
  staggerCards,
  subtleFadeUp,
  whenMotionReady,
} from '../lib/animations';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  WHATSAPP_URL,
} from '../lib/site-config';

const PAGE_TITLE = 'Technical Co-founder as a Service';
const PAGE_DESCRIPTION =
  'Technical co-founder as a Service for founders in South Africa. Senior product engineer on your MVP without equity. Strategy, build, and launch from one partner.';
const PAGE_OG_TITLE = `${PAGE_TITLE} | ${SITE_NAME}`;

const TAAS_FAQ = [
  {
    id: 'what-is-taas',
    question: 'What is technical co-founder as a Service?',
    answer:
      'Technical co-founder as a Service (TaaS) is a senior product engineering partnership for non-technical founders. You get architecture, full-stack build, payments, cloud, and launch ownership without giving away equity or managing a junior dev bench. It is built for founders in South Africa who need to ship a production-ready MVP, not a prototype that needs a rewrite.',
  },
  {
    id: 'equity',
    question: 'Do I need to give up equity?',
    answer:
      'No. TaaS is a paid engagement, typically scoped as a fixed-price Phase 1 build. You keep full ownership of your company and your codebase. Equity is for long-term co-founders; this model is for founders who need a senior technical partner now and want a clean handoff when the product is live.',
  },
  {
    id: 'vs-agency',
    question: 'How is TaaS different from a software agency in South Africa?',
    answer:
      'Agencies bill for layers of overhead (account managers, sales, juniors) and often slow decisions. TaaS is one senior engineer who builds directly with you, with testable progress every few days and deep familiarity with local payments (Paystack, Stitch, Ozow) and POPIA-aware patterns. You talk to the person writing the code, not a relay team.',
  },
] as const;

const PAIN_POINTS = [
  {
    num: '01',
    title: 'Junior devs who learn on your dime',
    body: 'Cheap talent looks affordable until the rewrite. You pay twice: once for the broken MVP, again for someone senior to fix architecture, security, and scale.',
  },
  {
    num: '02',
    title: 'Agencies that disappear after handoff',
    body: 'Account managers sell the dream. Juniors build the first version. When bugs pile up, your retainer buys meetings, not ownership of the outcome.',
  },
  {
    num: '03',
    title: 'CTOs who have never shipped at speed',
    body: 'Strategy decks without delivery discipline burn runway. You need someone who has shipped products, not someone who has only advised on them.',
  },
] as const;

const SOLUTION_CARDS = [
  {
    title: 'Ownership',
    body: 'One senior engineer owns architecture, delivery, and launch. You talk to the person writing the code, every week, with testable progress.',
  },
  {
    title: 'Speed',
    body: 'AI-assisted workflows and a team-of-one model mean weeks to live, not quarters. Scope stays tight; the core loop ships first.',
  },
  {
    title: 'Depth',
    body: 'Paystack, Stitch, Ozow, POPIA-aware patterns, and cloud that scales. Built for South African founders, not a generic offshore playbook.',
  },
] as const;

const PROOF_STATS = [
  { id: 'products', target: 5, suffix: '+', label: 'products shipped' },
  { id: 'startups', target: 12, suffix: '', label: 'startups served' },
  { id: 'zar', static: 'ZAR', label: 'based pricing' },
] as const;

export default function TechnicalCofounderPage() {
  const heroEyebrowRef = useRef<HTMLParagraphElement>(null);
  const heroHeadingRef = useRef<HTMLHeadingElement>(null);
  const heroRuleRef = useRef<HTMLDivElement>(null);
  const painSectionRef = useRef<HTMLElement>(null);
  const painHeaderRef = useRef<HTMLHeadingElement>(null);
  const painListRef = useRef<HTMLDivElement>(null);
  const solutionPinRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    const cleanups: Array<() => void> = [];

    const run = async () => {
      registerEasings();
      await whenMotionReady();
      if (cancelled) return;

      if (heroEyebrowRef.current) scrambleDecode(heroEyebrowRef.current, { delay: 0.2 });
      if (heroHeadingRef.current) {
        const undo = lineReveal(heroHeadingRef.current, { delay: 0.45, stagger: 0.12 });
        if (undo) cleanups.push(undo);
      }
      if (heroRuleRef.current) scaleXReveal(heroRuleRef.current, { delay: 1.1, duration: 0.6 });

      PROOF_STATS.forEach((stat) => {
        if ('static' in stat) return;
        const el = document.querySelector(`[data-taas-stat="${stat.id}"]`);
        const undo = el ? countUp(el, stat.target, { suffix: stat.suffix, duration: 1.4 }) : undefined;
        if (undo) cleanups.push(undo);
      });

      if (painHeaderRef.current) {
        const undo = lineReveal(painHeaderRef.current, {
          trigger: painSectionRef.current ?? painHeaderRef.current,
          start: 'top 82%',
        });
        if (undo) cleanups.push(undo);
      }
      if (painListRef.current) {
        const undo = staggerCards(painListRef.current, '[data-pain-item]');
        if (undo) cleanups.push(undo);
      }

      if (solutionPinRef.current) {
        const undo = pinScrollSection(solutionPinRef.current, '[data-solution-card]');
        if (undo) cleanups.push(undo);
      }
      if (faqRef.current) {
        const undo = subtleFadeUp(faqRef.current);
        if (undo) cleanups.push(undo);
      }

      refreshScrollTriggers();
    };

    void run();

    return () => {
      cancelled = true;
      cleanups.forEach((undo) => undo());
      killScrollTriggers();
    };
  }, []);

  return (
    <PageShell>
      <Helmet>
        <title>{PAGE_OG_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={absoluteUrl('/technical-cofounder')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl('/technical-cofounder')} />
        <meta property="og:title" content={PAGE_OG_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_OG_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="twitter:creator" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: TAAS_FAQ.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          })}
        </script>
      </Helmet>

      <main id="main-content">
      <section
        className="relative flex min-h-[100svh] flex-col justify-end bg-[var(--navy-dark)]"
        aria-labelledby="taas-hero-heading"
      >
        <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-32 md:pb-28">
          <p
            ref={heroEyebrowRef}
            className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--gold)]"
          >
            Technical co-founder as a Service
          </p>

          <h1
            id="taas-hero-heading"
            ref={heroHeadingRef}
            className="mt-10 max-w-4xl font-display text-display-lg font-semibold leading-[var(--leading-display)]"
          >
            <span
              className="block text-transparent"
              style={{ WebkitTextStroke: '1px var(--gold)' }}
            >
              You have the vision.
            </span>
            <span className="mt-2 block text-[var(--warm-white)]">I have the architecture.</span>
          </h1>

          <div
            ref={heroRuleRef}
            className="mt-8 h-px w-full max-w-md origin-left bg-[var(--gold)]/40"
            aria-hidden
          />

          <p className="home-hero-enter home-hero-enter-delay-2 mt-8 max-w-[560px] font-technical text-lg leading-[var(--leading-body)] text-[var(--text-muted)]">
            Stop burning runway on teams that cannot own the outcome. Get a senior engineer
            with a founder&apos;s mindset.
          </p>

          <div className="home-hero-enter home-hero-enter-delay-3 mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="cta"
              className="interactive-button inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--emerald)] px-6 py-3.5 font-technical text-sm font-semibold text-[var(--navy-dark)]"
            >
              Book a discovery call
            </a>
            <a
              href="#taas-solution"
              className="interactive-link font-technical text-sm font-semibold text-[var(--gold)]"
            >
              See how it works →
            </a>
          </div>

          <dl className="home-hero-enter home-hero-enter-delay-3 mt-14 flex flex-wrap gap-8 border-t border-white/10 pt-10">
            {PROOF_STATS.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-8">
                {i > 0 && (
                  <div className="hidden h-8 w-px bg-white/15 sm:block" aria-hidden />
                )}
                <div>
                  <dt
                    {...('static' in stat
                      ? {}
                      : { 'data-taas-stat': stat.id })}
                    className="font-display text-heading-md font-semibold text-[var(--gold)] tabular-nums"
                  >
                    {'static' in stat ? stat.static : `0${stat.suffix}`}
                  </dt>
                  <dd className="mt-1 font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]">
                    {stat.label}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        ref={painSectionRef}
        className="bg-[var(--slate)] py-24 md:py-32"
        aria-labelledby="taas-pain-heading"
      >
        <div className="mx-auto max-w-7xl px-6">
          <h2
            id="taas-pain-heading"
            ref={painHeaderRef}
            className="max-w-3xl font-display text-display-md font-semibold text-[var(--warm-white)]"
          >
            The problem with how you&apos;re building
          </h2>

          <div ref={painListRef} className="mt-16 space-y-14 md:mt-20 md:space-y-20">
            {PAIN_POINTS.map((point) => (
              <article
                key={point.num}
                data-pain-item
                className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-12"
              >
                <p
                  className="font-display text-display-md font-semibold leading-none text-transparent"
                  style={{ WebkitTextStroke: '1px rgba(255,215,0,0.5)' }}
                  aria-hidden
                >
                  {point.num}
                </p>
                <div>
                  <h3 className="font-display text-heading-lg font-semibold text-[var(--warm-white)]">
                    {point.title}
                  </h3>
                  <p className="mt-4 max-w-2xl font-technical text-base leading-[var(--leading-body)] text-[var(--text-muted)]">
                    {point.body}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-14 font-technical text-sm text-[var(--text-muted)]">
            <TransitionLink
              to="/vs/technical-cofounder-vs-agency"
              className="text-[var(--gold)] hover:text-[var(--warm-white)]"
            >
              Why TaaS beats traditional agencies →
            </TransitionLink>
            {' · '}
            <TransitionLink
              to="/blog/hidden-cost-junior-mvp"
              className="text-[var(--gold)] hover:text-[var(--warm-white)]"
            >
              What junior-built MVPs cost your runway
            </TransitionLink>
          </p>
        </div>
      </section>

      <section
        id="taas-solution"
        ref={solutionPinRef}
        className="relative min-h-[100svh] overflow-hidden bg-[var(--navy)]"
        aria-labelledby="taas-solution-heading"
      >
        <div className="relative z-10 flex min-h-[100svh] flex-col justify-center px-6 py-20">
          <div className="mx-auto w-full max-w-7xl">
            <p className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--gold)]">
              The solution
            </p>
            <h2
              id="taas-solution-heading"
              className="mt-6 max-w-2xl font-display text-display-md font-semibold text-[var(--warm-white)]"
            >
              What you get with TaaS
            </h2>
            <p className="mt-4 max-w-xl font-technical text-base text-[var(--text-muted)]">
              Scroll to see what you get when one senior engineer owns the build.
            </p>

            <div className="relative mx-auto mt-14 h-[min(52vh,420px)] w-full max-w-4xl md:h-[min(58vh,480px)]">
              {SOLUTION_CARDS.map((card, i) => (
                <article
                  key={card.title}
                  data-solution-card
                  className={`flex h-full flex-col justify-center rounded-xl border border-[var(--gold)]/15 bg-[var(--slate)] p-8 md:p-10 ${
                    i > 0
                      ? 'absolute inset-x-0 top-0 md:left-1/2 md:w-full md:max-w-4xl md:-translate-x-1/2'
                      : ''
                  }`}
                >
                  <h3 className="font-display text-heading-md font-semibold text-[var(--gold)]">
                    {card.title}
                  </h3>
                  <p className="mt-4 max-w-xl font-technical text-base leading-relaxed text-[var(--text-muted)]">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        ref={faqRef}
        className="border-t border-white/10 bg-[var(--navy-dark)] py-24 md:py-32"
        aria-labelledby="taas-faq-heading"
      >
        <div className="mx-auto max-w-3xl px-6">
          <h2
            id="taas-faq-heading"
            className="font-display text-heading-lg font-semibold text-[var(--warm-white)]"
          >
            Frequently asked questions
          </h2>
          <p className="mt-3 font-technical text-base text-[var(--text-muted)]">
            Straight answers on TaaS for founders in South Africa.
          </p>
          <Accordion
            type="single"
            collapsible
            className="mt-10 w-full rounded-xl border border-white/10 bg-[var(--slate)]/50 px-4"
          >
            {TAAS_FAQ.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-white/10">
                <AccordionTrigger className="text-left font-technical text-base text-[var(--warm-white)] hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="font-technical text-sm leading-relaxed text-[var(--text-muted)]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section
        className="gold-band py-24 md:py-32"
        aria-labelledby="taas-cta-heading"
      >
        <div className="mx-auto max-w-7xl px-6 text-center md:text-left">
          <h2
            id="taas-cta-heading"
            className="font-display text-display-md font-semibold text-[var(--gold-band-fg)]"
          >
            Ready to stop the lottery?
          </h2>
          <p className="gold-band-muted mx-auto mt-6 max-w-xl font-technical text-base leading-relaxed md:mx-0">
            I take on a limited number of Phase 1 builds at a time. Message me with what
            you are building and where you are stuck.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 md:flex-row md:items-start">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="cta"
              className="interactive-button inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--navy-dark)] px-8 py-3.5 font-technical text-sm font-semibold text-[var(--warm-white)]"
            >
              Secure a build slot on WhatsApp
            </a>
            <TransitionLink
              to="/get-a-quote"
              data-cursor="cta"
              className="interactive-button inline-flex min-h-[48px] items-center justify-center rounded-full border border-[var(--navy-dark)]/30 px-8 py-3.5 font-technical text-sm font-semibold text-[var(--navy-dark)]"
            >
              Scope and pricing first
            </TransitionLink>
          </div>
        </div>
      </section>
      </main>
    </PageShell>
  );
}

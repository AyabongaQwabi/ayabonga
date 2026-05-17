import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageShell } from '../components/layout/PageShell';
import { TransitionLink } from '../components/ui/TransitionLink';
import {
  clipReveal,
  lineReveal,
  registerEasings,
  staggerCards,
  subtleFadeUp,
  wordReveal,
} from '../lib/animations';
import {
  AUTHOR_EXPERIENCE_YEARS,
  AUTHOR_JOB_TITLE,
  AUTHOR_LOCATION,
  AUTHOR_PROFILE_IMAGE,
  AUTHOR_SHORT_BIO,
} from '../lib/author-profile';
import { buildProfilePageSchema } from '../lib/entity-schema';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
} from '../lib/site-config';

const PAGE_TITLE = `About ${SITE_NAME}`;
const PAGE_DESCRIPTION = `${AUTHOR_SHORT_BIO} Product engineering, AI, and cloud work for founders in South Africa.`;

const values = [
  {
    num: '01',
    title: 'Systems before shortcuts',
    body: 'I map the problem, the constraints, and what “done” means before writing code. A clean architecture pays you back on every feature after launch.',
    className: 'max-w-xl',
  },
  {
    num: '02',
    title: 'Shipped beats slideware',
    body: 'Demos are useful. Production traffic is the test. I bias toward working software, observability, and handoffs you can run without me in the room.',
    className: 'ml-auto max-w-xl md:mr-[12%] md:mt-16',
  },
  {
    num: '03',
    title: 'Direct by default',
    body: 'You talk to the person building the product. Scope, tradeoffs, and timeline stay visible so you are never guessing what happened last sprint.',
    className: 'max-w-xl md:mt-24',
  },
] as const;

const experience = [
  {
    range: '2022–present',
    role: 'Senior Product Engineer',
    company: 'Qwabi Technologies',
    note: 'Full-stack builds, AI tooling, and cloud architecture for founders across South Africa.',
  },
  {
    range: '2019–2022',
    role: 'Product & platform engineering',
    company: 'Client and product work',
    note: 'Marketplaces, booking platforms, and mobile wallets on React, Node.js, and managed cloud.',
  },
  {
    range: '2015–2019',
    role: 'Software engineering',
    company: 'Production systems',
    note: 'End-to-end delivery, APIs, and the foundation for scalable architecture and clear ownership.',
  },
] as const;

const outlineStroke = { WebkitTextStroke: '1px rgba(255, 215, 0, 0.85)' } as const;

export default function About() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const originHeadingRef = useRef<HTMLHeadingElement>(null);
  const originBodyRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLParagraphElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerEasings();
    if (nameRef.current) lineReveal(nameRef.current, { delay: 0.35 });
    if (titleRef.current) lineReveal(titleRef.current, { delay: 0.55 });
    if (portraitRef.current) clipReveal(portraitRef.current, { duration: 1.1 });
    if (originHeadingRef.current) {
      wordReveal(originHeadingRef.current, { trigger: originHeadingRef.current });
    }
    if (originBodyRef.current) subtleFadeUp(originBodyRef.current);
    if (philosophyRef.current) {
      wordReveal(philosophyRef.current, { trigger: philosophyRef.current });
    }
    if (valuesRef.current) {
      staggerCards(valuesRef.current, '[data-value-block]', { stagger: 0.12, y: 28 });
    }
    if (timelineRef.current) {
      staggerCards(timelineRef.current, '[data-timeline-entry]', {
        stagger: 0.1,
        y: 16,
        duration: 0.55,
      });
    }
  }, []);

  return (
    <PageShell>
      <Helmet>
        <title>{PAGE_TITLE} | Senior product engineer</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={absoluteUrl('/about')} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={absoluteUrl('/about')} />
        <meta property="og:title" content={`${PAGE_TITLE} | Senior product engineer`} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:locale" content="en_ZA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${PAGE_TITLE} | Senior product engineer`} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:site" content={TWITTER_HANDLE} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">{JSON.stringify(buildProfilePageSchema())}</script>
      </Helmet>

      <main id="main-content">
        {/* Section 1: Hero */}
        <section
          className="relative flex min-h-[100svh] items-center overflow-hidden bg-[var(--navy)]"
          aria-labelledby="about-hero-name"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[-18%] left-[-4%] select-none font-display text-display-xl leading-[0.88] text-transparent"
            style={{ WebkitTextStroke: '1px rgba(255, 215, 0, 0.08)' }}
          >
            ABOUT
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 py-28 md:grid-cols-[1fr_minmax(240px,360px)] md:items-center md:gap-16">
            <div>
              <h1
                id="about-hero-name"
                ref={nameRef}
                className="font-display text-display-lg font-semibold text-[var(--warm-white)]"
              >
                {SITE_NAME}
              </h1>
              <p
                ref={titleRef}
                className="mt-4 font-display text-display-md font-medium leading-[var(--leading-editorial)] text-transparent"
                style={outlineStroke}
              >
                Senior Product Engineer.
              </p>
              <p className="mt-8 max-w-[520px] font-technical text-lg leading-[var(--leading-body)] text-[var(--text-muted)]">
                I build things that matter. I think in systems. I work from {AUTHOR_LOCATION.split(',')[0]}.
              </p>
            </div>

            <div
              ref={portraitRef}
              className="relative mx-auto w-full max-w-[320px] md:mx-0 md:max-w-none"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-[var(--navy-dark)]">
                <img
                  src={AUTHOR_PROFILE_IMAGE}
                  alt={`Portrait of ${SITE_NAME}`}
                  width={360}
                  height={480}
                  className="h-full w-full object-cover mix-blend-luminosity opacity-90"
                />
                <div className="absolute inset-0 bg-[var(--navy)]/35" />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Origin */}
        <section
          className="bg-[var(--warm-white)] py-24 text-[var(--navy)] md:py-32"
          aria-labelledby="about-origin-heading"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[minmax(80px,140px)_1fr] md:gap-16">
            <p
              aria-hidden
              className="font-display text-display-lg font-semibold leading-none text-transparent"
              style={outlineStroke}
            >
              01
            </p>
            <div>
              <h2
                id="about-origin-heading"
                ref={originHeadingRef}
                className="font-display text-display-md font-semibold leading-[var(--leading-editorial)] text-[var(--navy)]"
              >
                Where I come from.
              </h2>
              <div
                ref={originBodyRef}
                className="mt-8 max-w-[680px] space-y-6 font-technical text-base leading-[var(--leading-body)] text-[var(--navy)]/80 md:text-lg"
              >
                <p>
                  I am a product engineer and cloud architect with about {AUTHOR_EXPERIENCE_YEARS}{' '}
                  years in software, based in {AUTHOR_LOCATION}. I grew up in the Eastern Cape and
                  build from a region where strong product work should not require relocating to
                  Johannesburg or Cape Town.
                </p>
                <p>
                  {AUTHOR_JOB_TITLE} is the short version. The longer version is that I help founders
                  turn ideas into apps, platforms, and AI tools without agency overhead or a bench of
                  juniors learning on your runway.
                </p>
                <p>
                  My stack is React, Next.js, Node.js, TypeScript, and Python, with cloud work on GCP,
                  AWS, and Azure. I use Supabase and Firebase when a product needs a fast, real-time
                  backend. See{' '}
                  <TransitionLink
                    to="/blog"
                    className="font-medium text-[var(--navy)] underline decoration-[var(--gold)] decoration-2 underline-offset-4 hover:text-[var(--gold-dim)]"
                  >
                    writing
                  </TransitionLink>{' '}
                  for how I think in public, or{' '}
                  <TransitionLink
                    to="/get-a-quote"
                    className="font-medium text-[var(--navy)] underline decoration-[var(--gold)] decoration-2 underline-offset-4 hover:text-[var(--gold-dim)]"
                  >
                    scope a project
                  </TransitionLink>{' '}
                  when you are ready to talk build.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Philosophy */}
        <section className="bg-[var(--navy)] py-24 md:py-40" aria-labelledby="about-philosophy">
          <div className="mx-auto max-w-7xl px-6">
            <p
              id="about-philosophy"
              ref={philosophyRef}
              className="max-w-5xl font-display text-display-md font-medium leading-[1.15] text-[var(--warm-white)]"
            >
              I have never believed that good engineering is about writing clever code. It is about
              solving the right problem, at the right time, with the{' '}
              <span className="text-[var(--gold)]">right tradeoff</span>.
            </p>
            <hr className="mt-12 border-0 border-t border-[var(--gold)]/20" />
            <p className="mt-8 max-w-2xl font-technical text-base leading-[var(--leading-body)] text-[var(--text-muted)] md:text-lg">
              {AUTHOR_SHORT_BIO} I care about products that stay maintainable after the launch
              party, especially when payments, auth, and compliance matter in South Africa.
            </p>
          </div>
        </section>

        {/* Section 4: Values */}
        <section
          className="bg-[var(--slate)] py-24 md:py-32"
          aria-labelledby="about-values-heading"
        >
          <div className="mx-auto max-w-7xl px-6">
            <p
              id="about-values-heading"
              className="font-technical text-label-sm uppercase tracking-[var(--tracking-label)] text-[var(--gold)]"
            >
              How I work
            </p>
            <div ref={valuesRef} className="mt-16 space-y-12 md:space-y-0">
              {values.map((item) => (
                <article
                  key={item.num}
                  data-value-block
                  className={item.className}
                >
                  <p
                    aria-hidden
                    className="font-display text-display-md font-semibold leading-none text-transparent"
                    style={outlineStroke}
                  >
                    {item.num}
                  </p>
                  <h3 className="mt-4 font-display text-heading-lg font-semibold text-[var(--warm-white)]">
                    {item.title}
                  </h3>
                  <p className="mt-4 font-technical text-base leading-[var(--leading-body)] text-[var(--text-muted)]">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: Experience */}
        <section
          className="bg-[var(--navy-dark)] py-24 md:py-32"
          aria-labelledby="about-experience-heading"
        >
          <div className="mx-auto max-w-7xl px-6">
            <h2
              id="about-experience-heading"
              className="font-display text-heading-lg font-semibold text-[var(--warm-white)]"
            >
              Experience
            </h2>
            <div
              ref={timelineRef}
              className="relative mt-14 border-l border-[var(--gold)]/20 pl-8 md:pl-12"
            >
              <ul className="space-y-14 md:space-y-16">
                {experience.map((entry) => (
                  <li key={entry.range} data-timeline-entry className="relative">
                    <p
                      className="font-display text-display-md font-semibold leading-none text-transparent"
                      style={outlineStroke}
                    >
                      {entry.range}
                    </p>
                    <h3 className="mt-4 font-display text-heading-md font-semibold text-[var(--warm-white)]">
                      {entry.role}
                    </h3>
                    <p className="mt-1 font-technical text-sm uppercase tracking-[var(--tracking-label)] text-[var(--gold)]">
                      {entry.company}
                    </p>
                    <p className="mt-3 max-w-xl font-technical text-base leading-relaxed text-[var(--text-muted)]">
                      {entry.note}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

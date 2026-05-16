import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle2, AlertCircle, TrendingUp, Code, GraduationCap, Rocket } from 'lucide-react';
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

export default function TechnicalCofounderPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
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

      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to home</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Technical Co-founder as a Service (TaaS)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Technical Co-founder in South Africa,{' '}
              <span className="text-primary">without the equity split.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Finding a technical co-founder in South Africa is hard. Managing a junior developer is risky.
              Hiring an agency is slow. With Technical Co-founder as a Service, you get a senior product
              engineer who owns architecture, delivery, and launch from day one, not a rotating bench of
              juniors or account managers.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-emerald-500/50 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="/hero-taas.png" 
              alt="Technical co-founder as a Service for South African founders"
              className="relative rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </header>

        {/* The Problem */}
        <section className="mb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">The Junior Dev Lottery vs. agency slowdown</h2>
            <p className="text-muted-foreground mb-8">
              Most non-technical founders in South Africa end up in one of two traps:
            </p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
                <div>
                  <h3 className="font-bold text-lg">The Liability Trap</h3>
                  <p className="text-sm text-muted-foreground">Hiring a "cheap" junior developer who builds a product that breaks under pressure, has no tests, and becomes a technical liability you have to pay to rewrite later.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
                <div>
                  <h3 className="font-bold text-lg">The Overhead Trap</h3>
                  <p className="text-sm text-muted-foreground">Hiring a slow agency where you pay for account managers, sales reps, and office space, all while waiting weeks for simple product decisions.</p>
                </div>
              </div>
            </div>
            <div className="mt-10 space-y-3">
              <Link
                to="/vs/technical-cofounder-vs-agency"
                className="text-primary font-bold hover:underline inline-flex items-center gap-2"
              >
                Why TaaS beats traditional agencies <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
              <p className="text-sm text-muted-foreground">
                <Link
                  to="/blog/hidden-cost-junior-mvp"
                  className="hover:text-foreground underline underline-offset-4"
                >
                  What the Junior Dev Lottery costs your runway
                </Link>
              </p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-bold mb-6">How TaaS Solves This</h3>
            <ul className="space-y-4">
              {[
                "Senior-level architecture (10+ years experience)",
                "Product-minded decision making",
                "Visible, testable progress every few days",
                "Deep integration with local SA infrastructure",
                "AI-powered speed (ship in days, not months)",
                "Zero long-term management overhead"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* The Methodology */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How I Build for Founders</h2>
            <p className="text-muted-foreground">A disciplined, "Business-Right" engineering approach.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold mb-3 text-lg">1. Product Strategy</h3>
              <p className="text-sm text-muted-foreground">We define the core loop that makes your business work. I help you decide what to build and, more importantly, what NOT to build.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Code className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold mb-3 text-lg">2. Senior Execution</h3>
              <p className="text-sm text-muted-foreground">I build the full stack using AI as a force multiplier. You get senior-quality code with TDD and security baked in from the start.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold mb-3 text-lg">3. Launch & Scale</h3>
              <p className="text-sm text-muted-foreground">We go from zero to live in weeks. I handle the cloud, the payments, and the scaling so you can focus on winning customers.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-24" aria-labelledby="taas-faq-heading">
          <div className="mb-10 max-w-2xl">
            <h2 id="taas-faq-heading" className="text-3xl font-bold mb-4">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground">
              Straight answers on technical co-founder as a Service for founders in South Africa.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full rounded-2xl border border-border bg-card px-6">
            {TAAS_FAQ.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA */}
        <section className="bg-foreground text-background rounded-3xl p-8 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Stop searching for a co-founder. Start building.</h2>
          <p className="text-background/80 mb-10 max-w-2xl mx-auto">
            I only take on a limited number of "Phase 1" builds at a time to ensure senior-level attention for every project.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all"
              >
                Secure a Build Slot
              </a>
            </div>
            <p className="text-sm text-background/60">
              Want a cost estimate first?{' '}
              <Link to="/get-a-quote" className="text-background/80 hover:text-background underline underline-offset-4">
                See how I scope and price work
              </Link>.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

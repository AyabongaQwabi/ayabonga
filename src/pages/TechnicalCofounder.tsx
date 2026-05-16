import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle2, AlertCircle, TrendingUp, Code, GraduationCap } from 'lucide-react';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  WHATSAPP_URL,
} from '../lib/site-config';

const PAGE_TITLE = 'Technical Co-founder as a Service';
const PAGE_DESCRIPTION = 'Hire a senior product engineer as your technical partner without giving away equity. I bridge the gap between vision and execution for founders in South Africa.';

export default function TechnicalCofounderPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>{`${PAGE_TITLE} | ${SITE_NAME}`}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={absoluteUrl('/technical-cofounder')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absoluteUrl('/technical-cofounder')} />
        <meta property="og:title" content={`${PAGE_TITLE} | ${SITE_NAME}`} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
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
              <span>The TaaS Model</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Your Technical Partner, <span className="text-primary">Without the Equity Split.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Finding a technical co-founder is hard. Managing a junior developer is risky. Hiring an agency is slow. My "Technical Co-founder as a Service" model gives you a senior partner to own your vision from day one.
            </p>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-emerald-500/50 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src="/hero-taas.png" 
              alt="Strategic Technical Leadership" 
              className="relative rounded-2xl shadow-2xl border border-white/10"
            />
          </div>
        </header>

        {/* The Problem */}
        <section className="mb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">The "Junior Dev Lottery" vs. The Agency Slowdown</h2>
            <p className="text-muted-foreground mb-8">
              Most non-technical founders end up in one of two traps:
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
            <div className="mt-10">
              <Link 
                to="/vs/taas-vs-agency" 
                className="text-primary font-bold hover:underline inline-flex items-center gap-2"
              >
                Read: Why TaaS beats traditional agencies <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
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

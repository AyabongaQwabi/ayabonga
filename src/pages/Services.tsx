import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, Rocket, Users, BarChart, Zap, ShieldCheck, Cpu, MessageCircle } from 'lucide-react';
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  TWITTER_HANDLE,
  WHATSAPP_URL,
} from '../lib/site-config';

const PAGE_TITLE = 'Engineering Services';
const PAGE_DESCRIPTION = 'Senior Product Engineering at 5x Speed. I provide Technical Co-founder as a Service for founders and agencies in South Africa.';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
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
        <header className="mb-16 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Senior Product Engineering <span className="text-primary">at 5x Speed.</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            I don't just build apps. I build businesses. By leveraging AI force multipliers and a "Team of One" workflow, I deliver production-ready software without the agency overhead.
          </p>
        </header>

        {/* Persona Sections */}
        <section className="grid md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
            <Rocket className="w-10 h-10 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-4">The Visionary Founder</h2>
            <p className="text-muted-foreground mb-6">
              You have a business idea but no technical partner. You don't want to manage a team of junior devs; you want someone you can trust to own the build.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>MVP in 4-8 weeks</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Strategic Technical Partner</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Zero Equity Required</span>
              </li>
            </ul>
            <Link to="/solutions/technical-cofounder-as-a-service-south-africa" className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-primary hover:underline">
              Learn about TaaS <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
            <Users className="w-10 h-10 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-4">The Orchestrator</h2>
            <p className="text-muted-foreground mb-6">
              You're an agency or consultant who wins big clients but needs a reliable builder behind the scenes to protect your reputation and deliver quality.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>White-label Execution</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Senior-level Reliability</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Rapid Scaling Capacity</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
            <BarChart className="w-10 h-10 text-primary mb-6" />
            <h2 className="text-2xl font-bold mb-4">The Scaler</h2>
            <p className="text-muted-foreground mb-6">
              You have an established business operating on manual chaos (WhatsApp/IG). You need to digitize to build credibility and unlock professional scale.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Custom SaaS Platforms</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Operational Automation</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Data-Driven Growth</span>
              </li>
            </ul>
            <Link to="/solutions/digital-transformation-experts-south-africa" className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-primary hover:underline">
              Digital Transformation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Why One Person? */}
        <section className="mb-24 bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why the "Team of One" is Your Secret Advantage</h2>
            <div className="grid sm:grid-cols-2 gap-8 text-left mt-12">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Zero Communication Overhead</h3>
                  <p className="text-sm text-muted-foreground">No meetings to discuss meetings. Decisions that take an agency two weeks happen in an afternoon.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Senior Accountability</h3>
                  <p className="text-sm text-muted-foreground">You aren't paying for a senior to sell you and a junior to build for you. I own every line of code.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Focus - pSEO Links */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center">Strategic Industry Focus</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Fintech", slug: "fintech-founders-south-africa", desc: "Payments, ledgers, and secure transaction engines." },
              { name: "Logistics", slug: "logistics-apps-cape-town", desc: "Real-time tracking, dispatching, and fleet management." },
              { name: "HealthTech", slug: "healthcare-startups-johannesburg", desc: "Secure records, bookings, and HIPAA-aligned platforms." },
              { name: "EduTech", slug: "edutech-platforms-south-africa", desc: "Student management and cashless campus ecosystems." },
              { name: "Marketplaces", slug: "marketplace-founders-south-africa", desc: "Multi-sided platforms for on-demand services." },
              { name: "Established Brands", slug: "digital-transformation-experts-south-africa", desc: "Digitizing successful businesses for professional scale." },
              { name: "AI & Automation", slug: "ai-integration-specialist-south-africa", desc: "Strategic LLM integration and production-ready AI agents." }
            ].map((industry) => (
              <Link 
                key={industry.slug}
                to={`/solutions/${industry.slug}`}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{industry.name} →</h3>
                <p className="text-sm text-muted-foreground">{industry.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <footer className="text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to ship something real?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-all shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Message Me on WhatsApp
            </a>
            <Link
              to="/technical-cofounder"
              className="px-8 py-4 bg-card border border-border rounded-xl font-bold hover:border-primary transition-all"
            >
              Learn about TaaS
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Want a ballpark first?{' '}
            <Link to="/get-a-quote" className="text-primary hover:underline underline-offset-4">See how I scope and price work</Link>.
          </p>
        </footer>
      </main>
    </div>
  );
}

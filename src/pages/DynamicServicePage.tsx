import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Wallet, 
  Truck, 
  Stethoscope, 
  GraduationCap, 
  ShoppingBag, 
  Brain as BrainIcon,
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
  Activity
} from 'lucide-react';
import pseoData from '../data/pseo-pages.json';

const iconMap = {
  Wallet,
  Truck,
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  Brain: BrainIcon,
  Zap,
  Home,
  Sun,
  Globe,
  Shield,
  Activity
};

const DynamicServicePage = () => {
  const { slug } = useParams();
  const page = pseoData.find((p) => p.slug === slug);

  if (!page) {
    return <Navigate to="/404" replace />;
  }

  const Icon = iconMap[page.icon as keyof typeof iconMap] || Zap;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      <Helmet>
        <title>{page.title} | Ayabonga Qwabi</title>
        <meta name="description" content={`Are you an ${page.audience} in ${page.location}? ${page.solution}. Get senior-level technical leadership for your ${page.industry} startup.`} />
        <meta name="keywords" content={page.keywords.join(', ')} />
        
        {/* Schema.org for Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": page.title,
            "description": page.pain_point,
            "provider": {
              "@type": "Person",
              "name": "Ayabonga Qwabi"
            },
            "areaServed": {
              "@type": "Place",
              "name": page.location
            },
            "category": page.industry
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Icon className="w-4 h-4" />
            <span>{page.industry} Solutions</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            The Technical Co-founder your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">{page.industry} Business</span> Actually Needs.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            For {page.audience} in {page.location} who are tired of the junior dev lottery and want a partner who builds for business ROI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/get-a-quote"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center gap-2 group w-full sm:w-auto justify-center"
            >
              Get a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/technical-cofounder"
              className="px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold rounded-lg transition-all duration-300 w-full sm:w-auto text-center"
            >
              How TaaS Works
            </Link>
          </div>
        </div>
      </div>

      {/* Pain Point Section */}
      <section className="py-24 border-t border-slate-900 relative">
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
            <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                The Senior Engineering Solution
              </h3>
              <p className="text-slate-400 mb-6 italic">
                "{page.solution}"
              </p>
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                <p className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-2">Primary Objective</p>
                <p className="text-white font-medium">{page.benefit}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 uppercase tracking-widest text-emerald-500 text-sm">Full-Stack Capability</h2>
          <p className="text-4xl font-bold">End-to-End Ownership of your {page.industry} Platform.</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Product Design",
              desc: "From user journeys to conversion-optimized UIs built with modern React frameworks.",
              icon: Zap
            },
            {
              title: "Scalable Backend",
              desc: "Real-time infrastructure using Node.js, Go, or Clojure that scales as you grow.",
              icon: Clock
            },
            {
              title: "Secure Payments",
              desc: "Deep integration with Paystack, Stitch, and custom ledger systems.",
              icon: ShieldCheck
            }
          ].map((feature, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300">
              <feature.icon className="w-10 h-10 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-600/5" />
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-8">Ready to build your {page.industry} MVP?</h2>
          <p className="text-xl text-slate-400 mb-12">
            Stop waiting for an agency. Start building with a partner who owns the outcome.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              to="/get-a-quote"
              className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-emerald-500/20"
            >
              Request an Estimate
            </Link>
            <Link
              to="/"
              className="text-slate-400 hover:text-white flex items-center gap-2 group font-medium"
            >
              Back to Home <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Breadcrumbs for SEO */}
      <div className="py-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link to="/" className="hover:text-emerald-400">Home</Link></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li><Link to="/services" className="hover:text-emerald-400">Services</Link></li>
              <li><ChevronRight className="w-4 h-4" /></li>
              <li className="text-slate-300 font-medium">{page.title}</li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DynamicServicePage;

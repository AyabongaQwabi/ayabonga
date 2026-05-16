import type { PricingTableBlock } from '../components/PricingTable';

/** Ballpark ZAR ranges for 2026 — scoped with founders; not a binding quote. */
export const appCostPricingTables: PricingTableBlock[] = [
  {
    id: 'ecommerce',
    title: 'Ecommerce app development',
    intro:
      'Catalog, cart, checkout, and order ops. Local payment methods (Paystack, PayFast, Ozow, Yoco) add integration and webhook work.',
    tiers: [
      {
        name: 'Storefront MVP',
        rangeZar: 'R120k – R280k',
        summary: 'Web shop, basic admin, one payment provider, email notifications.',
        timeline: '8–12 weeks',
      },
      {
        name: 'Production ecommerce',
        rangeZar: 'R280k – R650k',
        summary: 'Mobile + web, inventory, promos, refunds, reporting, multiple payment paths.',
        timeline: '12–20 weeks',
      },
      {
        name: 'Multi-channel retail',
        rangeZar: 'R650k – R1.2m+',
        summary: 'POS sync, ERP hooks, loyalty, complex shipping or B2B pricing.',
        timeline: '5–9 months',
      },
    ],
    note: 'Excludes inventory purchase, marketing spend, and payment provider fees.',
  },
  {
    id: 'marketplace',
    title: 'Marketplace app development',
    intro:
      'Two-sided products (buyer + seller/provider) need separate apps or roles, payouts, disputes, and heavy admin.',
    tiers: [
      {
        name: 'Single-city MVP',
        rangeZar: 'R200k – R450k',
        summary: 'One region, core booking or listing loop, manual payouts or simple commission.',
        timeline: '10–14 weeks',
      },
      {
        name: 'Production marketplace',
        rangeZar: 'R450k – R950k',
        summary: 'Provider onboarding, ratings, in-app payments, ops dashboard, notifications.',
        timeline: '4–7 months',
      },
      {
        name: 'Multi-vendor platform',
        rangeZar: 'R950k – R1.8m+',
        summary: 'Split payments, KYC-style onboarding, fraud controls, analytics, multiple cities.',
        timeline: '7–12 months',
      },
    ],
    note: 'Reference: Laundry Marketplace-style flows (customer app + provider tools + admin).',
  },
  {
    id: 'health',
    title: 'Health management & patient systems',
    intro:
      'Booking, records, and staff workflows touch privacy and uptime expectations. Scope POPIA-aligned design early.',
    tiers: [
      {
        name: 'Clinic booking MVP',
        rangeZar: 'R150k – R350k',
        summary: 'Appointments, patient profiles, reminders, basic admin (similar to ClinicPlus scope).',
        timeline: '8–12 weeks',
      },
      {
        name: 'Occupational / enterprise health',
        rangeZar: 'R350k – R800k',
        summary: 'Multi-site, employer dashboards, reporting, integrations to HR or mining ops.',
        timeline: '4–8 months',
      },
      {
        name: 'Full patient platform',
        rangeZar: 'R800k – R1.5m+',
        summary: 'EHR-lite modules, labs, billing, role-heavy staff tools, audit trails.',
        timeline: '9–14 months',
      },
    ],
  },
  {
    id: 'mobile',
    title: 'Android & iOS apps',
    intro:
      'Native (Kotlin/Swift) costs more than one cross-platform codebase (React Native / Flutter). Pick based on NFC, performance, and long-term team skills.',
    tiers: [
      {
        name: 'One platform MVP',
        rangeZar: 'R100k – R250k',
        summary: 'React Native or Flutter, API backend, auth, core screens only.',
        timeline: '6–10 weeks',
      },
      {
        name: 'iOS + Android production',
        rangeZar: 'R250k – R600k',
        summary: 'Both stores, push, offline basics, analytics, release pipeline.',
        timeline: '10–16 weeks',
      },
      {
        name: 'Native or hardware-heavy',
        rangeZar: 'R500k – R1m+',
        summary: 'NFC wallets (UTap-style), BLE, background location, strict performance.',
        timeline: '4–8 months',
      },
    ],
  },
  {
    id: 'business-ops',
    title: 'Business operations & custom software',
    intro:
      'Internal tools replace spreadsheets and WhatsApp chaos. Value is measured in hours saved and errors prevented.',
    tiers: [
      {
        name: 'Focused workflow tool',
        rangeZar: 'R80k – R200k',
        summary: 'One department, approvals, exports, role-based access.',
        timeline: '6–10 weeks',
      },
      {
        name: 'Company operations hub',
        rangeZar: 'R200k – R500k',
        summary: 'CRM-lite, inventory, tasks, integrations to accounting or ERP.',
        timeline: '3–6 months',
      },
      {
        name: 'Enterprise automation',
        rangeZar: 'R500k – R1.2m+',
        summary: 'Multi-module, SSO, audit logs, SLA expectations, legacy system bridges.',
        timeline: '6–12 months',
      },
    ],
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp AI chatbots & automation',
    intro:
      'Meta conversation charges apply separately. Production bots need human handoff and grounded answers.',
    tiers: [
      {
        name: 'FAQ + lead capture',
        rangeZar: 'R35k – R90k',
        summary: 'Templates, knowledge base, escalation to inbox.',
        timeline: '3–5 weeks',
      },
      {
        name: 'Bookings or order lookup',
        rangeZar: 'R90k – R200k',
        summary: 'API to your app, calendar slots, CRM sync.',
        timeline: '6–10 weeks',
      },
      {
        name: 'AI agent with guardrails',
        rangeZar: 'R150k – R350k',
        summary: 'RAG over your docs, analytics, multi-branch routing, compliance review.',
        timeline: '8–14 weeks',
      },
    ],
  },
  {
    id: 'mvp-startup',
    title: 'MVP builds for startups',
    tiers: [
      {
        name: 'Idea validation',
        rangeZar: 'R40k – R120k',
        summary: 'Landing + waitlist or clickable prototype, no production payments.',
        timeline: '3–6 weeks',
      },
      {
        name: 'Fundable MVP',
        rangeZar: 'R120k – R350k',
        summary: 'Real users, one core loop, basic admin, launch on one platform.',
        timeline: '6–10 weeks',
      },
      {
        name: 'Post-seed v1',
        rangeZar: 'R350k – R750k',
        summary: 'Payments, growth hooks, monitoring, second platform or role.',
        timeline: '3–6 months',
      },
    ],
  },
  {
    id: 'websites',
    title: 'Portfolio & professional websites',
    tiers: [
      {
        name: 'Personal portfolio',
        rangeZar: 'R15k – R45k',
        summary: 'Fast static or Vite site, CMS optional, strong performance.',
        timeline: '2–4 weeks',
      },
      {
        name: 'Business marketing site',
        rangeZar: 'R45k – R120k',
        summary: 'Service pages, blog, forms, SEO baseline, analytics.',
        timeline: '4–8 weeks',
      },
      {
        name: 'Content + lead gen site',
        rangeZar: 'R120k – R250k',
        summary: 'Programmatic pages, calculators, CRM hooks, multi-language.',
        timeline: '8–12 weeks',
      },
    ],
  },
  {
    id: 'rescue',
    title: 'App rescue, rewrite & scaling',
    intro:
      'Rescue pricing depends on audit findings. Often 30–70% of a greenfield build if architecture is salvageable.',
    tiers: [
      {
        name: 'Stabilise & ship',
        rangeZar: 'R60k – R180k',
        summary: 'Critical bugs, payment fixes, store rejection unblock.',
        timeline: '2–6 weeks',
      },
      {
        name: 'Partial rewrite',
        rangeZar: 'R180k – R450k',
        summary: 'New API or mobile shell, migrate users and data carefully.',
        timeline: '2–4 months',
      },
      {
        name: 'Full rebuild',
        rangeZar: 'R350k – R900k+',
        summary: 'Greenfield with lessons learned; parallel run or hard cutover plan.',
        timeline: '4–9 months',
      },
    ],
  },
  {
    id: 'fintech',
    title: 'Fintech & payment gateway integration',
    intro:
      'South Africa: Paystack, PayFast, Ozow, Stitch, Yoco. Each adds webhooks, reconciliation, and failed-payment handling.',
    tiers: [
      {
        name: 'Single gateway checkout',
        rangeZar: 'R40k – R100k',
        summary: 'Hosted or embedded checkout, webhook logging, basic admin.',
        timeline: '3–5 weeks',
      },
      {
        name: 'In-app wallets or subscriptions',
        rangeZar: 'R120k – R300k',
        summary: 'Saved methods, retries, refunds, reporting exports.',
        timeline: '8–14 weeks',
      },
      {
        name: 'Marketplace payouts / splits',
        rangeZar: 'R250k – R600k+',
        summary: 'KYC flows, ledger model, dispute tooling, compliance review with your legal advisor.',
        timeline: '4–8 months',
      },
    ],
  },
];

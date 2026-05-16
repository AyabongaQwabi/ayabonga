import type { PricingTableBlock } from '../components/PricingTable';
import { appCostPricingTables } from './app-cost-pricing-tables';

export type BuyerIntentSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type BuyerIntentFaq = {
  question: string;
  answer: string;
};

export type BuyerIntentPage = {
  slug: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  heroSubhead: string;
  sections: BuyerIntentSection[];
  pricingTables?: PricingTableBlock[];
  showLeadMagnet?: boolean;
  faqs: BuyerIntentFaq[];
  relatedLinks: { label: string; path: string }[];
  ctaHeadline: string;
  ctaSubhead: string;
  serviceType: string;
};

export const buyerIntentPages: BuyerIntentPage[] = [
  {
    slug: 'app-development-cost-south-africa',
    path: '/app-development-cost-south-africa',
    metaTitle:
      'App Development Cost South Africa 2026 | Ecommerce, MVP & Marketplace',
    metaDescription:
      'How much does it cost to build an app in South Africa in 2026? ZAR pricing tables for ecommerce, marketplace, health, mobile, fintech, MVPs, and rescues.',
    keywords: [
      'app development cost south africa',
      'how much does it cost to build an app',
      'mobile app development price south africa',
      'mvp cost south africa',
    ],
    eyebrow: 'Founder guide · South Africa · 2026',
    h1: 'How Much Does It Cost to Build an App in South Africa in 2026',
    heroSubhead:
      'Most quotes look cheap until you need admin tooling, payment edge cases, and ops workflows. Below are realistic ZAR bands by product type, plus what drives quotes up or down.',
    serviceType: 'Mobile and web application development',
    pricingTables: appCostPricingTables,
    showLeadMagnet: true,
    sections: [
      {
        id: 'ranges',
        heading: 'Typical cost ranges (ZAR, 2026)',
        paragraphs: [
          'Ranges below are ballparks for founder-led products with a senior engineer or small senior-led team. Agency retainers and offshore-only shops sit in different bands.',
        ],
        bullets: [
          'Proof-of-concept or landing + light backend: roughly R40k–R120k',
          'Focused MVP (one platform, core flows, basic admin): roughly R120k–R350k',
          'Production v1 (mobile + API + admin + payments): roughly R350k–R900k+',
          'Marketplace or multi-app ecosystem (customer, provider, admin): often R600k–R1.5m+ depending on sides and compliance',
        ],
      },
      {
        id: 'mvp-vs-production',
        heading: 'MVP vs production: not the same budget line',
        paragraphs: [
          'An MVP should prove demand and one critical workflow. Production means auth hardening, monitoring, role-based admin, reconciliation, support tooling, and load you have not felt yet.',
          'Founders who buy an MVP scope but expect production behaviour usually pay twice: once for the cheap build, again for the rewrite.',
        ],
      },
      {
        id: 'hidden',
        heading: 'Costs quotes often skip',
        paragraphs: [
          'These are where "affordable" projects become expensive rebuilds.',
        ],
        bullets: [
          'Admin dashboards and internal ops tools (refunds, disputes, manual overrides)',
          'Payment integrations (Paystack, Stitch, Ozow) plus webhooks, failed payment retries, and reconciliation',
          'Notifications (SMS, email, push) and template management',
          'Multi-role permissions (customer, staff, partner, super-admin)',
          'Hosting, observability, backups, and incident response',
          'App store fees, compliance reviews, and release pipelines',
          'Post-launch maintenance (security patches, OS updates, dependency drift)',
        ],
      },
      {
        id: 'rewrite',
        heading: 'The junior-dev rewrite tax',
        paragraphs: [
          'A low day rate with junior execution often produces UI that demos well and breaks under real users. Fixing architecture later costs more than building once with someone who has shipped payments, marketplaces, or health bookings before.',
          'If you are comparing quotes, ask who writes production code, who owns the database design, and what happens when payments fail at 10pm on a Saturday.',
        ],
      },
      {
        id: 'variables',
        heading: 'Why two quotes for the "same app" can differ 3x',
        paragraphs: [],
        bullets: [
          'Native iOS + Android vs one cross-platform codebase',
          'Real-time features (chat, live tracking, collaborative edits)',
          'Offline-first or low-connectivity behaviour',
          'Integrations (ERP, CRM, WhatsApp Business API, legacy APIs)',
          'Regulated data (health, financial, education records)',
          'Who owns design, QA, DevOps, and product decisions',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much does it cost to build an app in South Africa?',
        answer:
          'Most serious MVPs land between roughly R120k and R350k. Production platforms with payments, admin, and two mobile stores often run R350k–R900k or more. The biggest variable is scope honesty, not the hourly rate on the proposal.',
      },
      {
        question: 'Is a R50k app quote realistic?',
        answer:
          'It can be for a narrow prototype: marketing site, simple form flows, or a demo without production payments and admin. If the quote promises a full marketplace or fintech app at that price, expect missing scope or junior execution.',
      },
      {
        question: 'Should I hire a freelancer, agency, or technical partner?',
        answer:
          'Freelancers work for contained tasks. Agencies add layers. A senior technical partner fits when the product is the business and you need one accountable owner across architecture, build, and launch tradeoffs.',
      },
      {
        question: 'How long does an MVP take?',
        answer:
          'A well-scoped MVP with a senior builder is often 6–10 weeks. Timelines stretch when requirements change weekly, integrations are undefined, or "MVP" secretly means three apps and a full admin suite.',
      },
    ],
    relatedLinks: [
      { label: 'MVP developer South Africa', path: '/mvp-developer-south-africa' },
      { label: 'How to choose an app developer', path: '/best-app-developers-south-africa' },
      { label: 'Get a scoped estimate', path: '/get-a-quote' },
    ],
    ctaHeadline: 'Want a practical MVP estimate?',
    ctaSubhead:
      'Share your idea on WhatsApp or use the quote tool. I will tell you what is realistic for scope, timeline, and budget before you commit.',
  },
  {
    slug: 'mvp-developer-south-africa',
    path: '/mvp-developer-south-africa',
    metaTitle: 'MVP Developer South Africa | Build Without Junior Dev Chaos',
    metaDescription:
      'Senior MVP development for South African founders: scoped builds, production-minded architecture, and no agency overhead. Ship a real v1 in weeks, not months of rework.',
    keywords: [
      'mvp developer south africa',
      'startup app development south africa',
      'mvp development company',
      'technical cofounder south africa',
    ],
    eyebrow: 'For founders · MVP · South Africa',
    h1: 'MVP Developer in South Africa',
    heroSubhead:
      'Build your first real version without agency overhead or the junior dev lottery. One senior engineer owns architecture, delivery, and the tradeoffs that keep you out of a rebuild.',
    serviceType: 'MVP and startup product development',
    sections: [
      {
        id: 'what-mvp',
        heading: 'What an MVP should actually do',
        paragraphs: [
          'An MVP is not a half-finished product. It is the smallest build that lets real users complete one valuable workflow so you can learn fast.',
          'That usually means one primary user type, one core loop, basic admin visibility, and hooks for payments or data you will need next, even if v1 is manual behind the scenes.',
        ],
      },
      {
        id: 'how-i-work',
        heading: 'How I work with founders',
        paragraphs: [
          'I operate as a senior product engineer and technical partner, not a ticket-taking dev shop. You get direct access, fast decisions, and code written by the person you hired.',
        ],
        bullets: [
          'Scope workshop: what ships in v1 vs what waits',
          'Architecture that can grow (auth, roles, API boundaries)',
          'Weekly visible progress, no black-box sprints',
          'Launch support: stores, hosting, monitoring basics',
          'Handoff docs so you are not locked in blindly',
        ],
      },
      {
        id: 'stack',
        heading: 'Typical stack (chosen for speed and sanity)',
        paragraphs: [
          'Stack depends on the product, but most founder MVPs land on proven tools: React or Next.js on the web, React Native or Expo when mobile is required, Node.js or serverless APIs, Supabase or Firebase when you need speed, Postgres when you need control.',
        ],
      },
      {
        id: 'fit',
        heading: 'Good fit vs bad fit',
        paragraphs: [],
        bullets: [
          'Good fit: fintech, marketplaces, ops tools, community apps, AI-assisted workflows, founders who want a partner not a body shop',
          'Bad fit: "just need a WordPress site", unlimited scope with startup budget, teams that want to micromanage every line without product clarity',
        ],
      },
      {
        id: 'proof',
        heading: 'Shipped patterns I reuse',
        paragraphs: [
          'Marketplace flows from Laundry Marketplace, booking systems from ClinicPlus, community AI from Queens Connect, and campus wallet patterns from UTap. You are not paying me to learn your domain from zero on your dime.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How fast can you ship an MVP?',
        answer:
          'Many scoped MVPs ship in 6–10 weeks with a senior builder. Speed comes from clear scope and reused patterns, not cutting QA and security.',
      },
      {
        question: 'Do you take equity?',
        answer:
          'Usually no. Technical co-founder style work is available as paid engagement (TaaS) when alignment and runway make sense. Cash keeps scope honest on both sides.',
      },
      {
        question: 'Can you rescue an MVP that is failing?',
        answer:
          'Yes. Rescue work is common: audit the codebase, stabilise payments or auth, then decide patch vs rewrite. Rescue clients often move faster because they have already felt the cost of a weak build.',
      },
      {
        question: 'Do you work with agencies?',
        answer:
          'Yes, as white-label senior execution when an agency needs reliable delivery without exposing their client to junior churn.',
      },
    ],
    relatedLinks: [
      { label: 'App development cost guide', path: '/app-development-cost-south-africa' },
      { label: 'Technical co-founder (TaaS)', path: '/technical-cofounder' },
      { label: 'WhatsApp AI chatbot South Africa', path: '/whatsapp-ai-chatbot-south-africa' },
    ],
    ctaHeadline: 'Ready to scope your MVP?',
    ctaSubhead:
      'Tell me the one workflow that must work in v1. I will respond with timeline, risks, and a realistic budget band.',
  },
  {
    slug: 'whatsapp-ai-chatbot-south-africa',
    path: '/whatsapp-ai-chatbot-south-africa',
    metaTitle: 'WhatsApp AI Chatbot South Africa | Business Automation',
    metaDescription:
      'WhatsApp AI chatbots for South African businesses: lead capture, support, bookings, and local language-aware assistants. Built on real shipped community AI experience.',
    keywords: [
      'whatsapp chatbot south africa',
      'whatsapp ai chatbot',
      'whatsapp business automation',
      'ai customer support south africa',
    ],
    eyebrow: 'WhatsApp · AI · South Africa',
    h1: 'WhatsApp AI Chatbot for South African Businesses',
    heroSubhead:
      'Meet customers where they already are. Automate FAQs, bookings, and lead qualification on WhatsApp without a clunky web form funnel nobody completes on mobile data.',
    serviceType: 'WhatsApp Business API and AI assistant development',
    sections: [
      {
        id: 'why-whatsapp',
        heading: 'Why WhatsApp beats another login page',
        paragraphs: [
          'In South Africa, WhatsApp is often the real front door for SMEs, clinics, logistics desks, and community businesses. A chatbot there reduces friction compared to forcing users through a heavy web signup.',
        ],
      },
      {
        id: 'use-cases',
        heading: 'High-value use cases',
        paragraphs: [],
        bullets: [
          'Lead qualification before a human sales call',
          'FAQ and product info in English, isiXhosa, or mixed local language where needed',
          'Appointment or booking requests synced to your admin or calendar',
          'Order status and delivery updates for logistics or marketplaces',
          'Internal ops: staff checklists, shift handovers, lightweight ticketing',
          'Community information bots (local services, events, council-style FAQs)',
        ],
      },
      {
        id: 'how-built',
        heading: 'How these bots are built properly',
        paragraphs: [
          'A template spam bot breaks trust fast. Production setups use the WhatsApp Business Platform (or approved providers), clear handoff to humans, logging, rate limits, and guardrails so the model does not invent prices or policies.',
        ],
        bullets: [
          'Grounded answers from your docs, Notion, or CMS, not pure hallucination',
          'Escalation to a human inbox with conversation context',
          'CRM or spreadsheet sync for leads',
          'Analytics on drop-off, top questions, and conversion',
        ],
      },
      {
        id: 'experience',
        heading: 'Grounded in shipped work',
        paragraphs: [
          'Queens Connect is a community AI assistant built for Queenstown: local context, helpful tone, and constraints that matter when users are on mobile networks and tight data budgets. That same discipline applies to business bots: useful, bounded, and maintainable.',
        ],
      },
      {
        id: 'cost',
        heading: 'What it costs',
        paragraphs: [
          'Simple FAQ bots with approved templates and a small knowledge base often start lower than full custom apps. Flows with payments, CRM sync, multi-branch routing, or voice notes cost more. Meta conversation fees and provider costs apply on top of build fees.',
          'For full app budgets, see the app development cost guide.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do I need the WhatsApp Business API?',
        answer:
          'For automated, scalable bots beyond the basic Business app, yes. Setup depends on your provider, verification, and message templates. I help you choose a path that matches your volume and compliance needs.',
      },
      {
        question: 'Can the bot speak isiXhosa or mix languages?',
        answer:
          'Yes, with the right prompts, examples, and review. Local language quality improves when we test with real user phrasing, not textbook sentences only.',
      },
      {
        question: 'Will AI hallucinate prices or policies?',
        answer:
          'Not if we design for retrieval-first answers, strict fallbacks, and human handoff on unknowns. Production bots should say "I will connect you to the team" instead of guessing.',
      },
      {
        question: 'Can this connect to Paystack or my existing app?',
        answer:
          'Often yes via your backend API: payment links, order lookup, or booking slots. Deep integration is scoped separately from a standalone FAQ bot.',
      },
    ],
    relatedLinks: [
      { label: 'AI integration for startups', path: '/solutions/ai-integration-specialist-south-africa' },
      { label: 'App development cost guide', path: '/app-development-cost-south-africa' },
      { label: 'Queens Connect (community AI)', path: 'https://queensconnect.qwabi.co.za/' },
    ],
    ctaHeadline: 'Want a WhatsApp bot that survives real customers?',
    ctaSubhead:
      'Describe your business, daily messages, and what should be automated vs human. I will suggest architecture and a realistic build band.',
  },
  {
    slug: 'best-app-developers-south-africa',
    path: '/best-app-developers-south-africa',
    metaTitle: 'How to Choose an App Developer in South Africa',
    metaDescription:
      'Not a fake top-10 list. How South African founders should compare app developers: freelancer vs agency, senior vs junior, technical debt, and red flags before you sign.',
    keywords: [
      'best app developers in south africa',
      'app developers johannesburg',
      'app developers cape town',
      'how to choose app developer',
    ],
    eyebrow: 'Buyer guide · South Africa',
    h1: 'How to Choose an App Developer in South Africa',
    heroSubhead:
      'Skip the listicle SEO. Here is how to compare freelancers, agencies, and senior partners so you hire for outcomes, not buzzwords.',
    serviceType: 'App development consulting and delivery',
    sections: [
      {
        id: 'models',
        heading: 'Freelancer, agency, or senior partner',
        paragraphs: [],
        bullets: [
          'Freelancer: best for bounded tasks with clear specs. Risky as sole owner of a complex product.',
          'Agency: adds PM and design bench. Watch for senior sales / junior delivery mismatch.',
          'Senior partner (TaaS style): one accountable engineer across product, architecture, and launch. Fits founders who need speed without hiring a full team yet.',
        ],
      },
      {
        id: 'senior-vs-junior',
        heading: 'Senior vs junior: what you are actually buying',
        paragraphs: [
          'Junior teams cost less per hour and more per mistake: wrong data models, payment bugs, missing admin, and rebuilds. Seniors cost more upfront and ship fewer surprises.',
          'Ask for production apps they personally shipped, not portfolio screenshots from a team they barely touched.',
        ],
      },
      {
        id: 'questions',
        heading: 'Questions to ask before you sign',
        paragraphs: [],
        bullets: [
          'Who writes the code day to day?',
          'How do you handle failed payments and webhooks?',
          'What admin tools exist for support staff?',
          'What is in v1 vs phase 2 (in writing)?',
          'Who owns hosting, domains, and store accounts?',
          'What happens after launch for bugs and OS updates?',
        ],
      },
      {
        id: 'red-flags',
        heading: 'Red flags',
        paragraphs: [],
        bullets: [
          'Fixed price for unlimited scope',
          'No mention of admin, analytics, or ops',
          'Cannot explain their database or auth model simply',
          'Demo-only UI with no error states',
          'You do not get access to repos or staging until "launch"',
        ],
      },
      {
        id: 'geo',
        heading: 'Johannesburg, Cape Town, or remote',
        paragraphs: [
          'Strong developers work across South Africa remotely. Local presence helps for on-site ops or regulated industries, but daily product decisions do not require shared offices if communication is disciplined.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Who are the best app developers in South Africa?',
        answer:
          'There is no universal top 10. The best fit depends on your industry, budget, and whether you need a narrow feature or a full product owner. Use the questions above to compare candidates on risk, not marketing copy.',
      },
      {
        question: 'Should I hire in Johannesburg or Cape Town?',
        answer:
          'Hire for seniority and relevant shipped work. City matters less than experience with payments, marketplaces, or your regulatory context.',
      },
      {
        question: 'How do I compare quotes?',
        answer:
          'Normalize scope: same platforms, same admin needs, same payment flows. Then compare. A cheap quote missing half the system is not cheaper.',
      },
    ],
    relatedLinks: [
      { label: 'App development cost (2026)', path: '/app-development-cost-south-africa' },
      { label: 'MVP developer South Africa', path: '/mvp-developer-south-africa' },
      { label: 'Eastern Cape developers hub', path: '/developers/eastern-cape' },
    ],
    ctaHeadline: 'Want a second opinion on a quote or codebase?',
    ctaSubhead:
      'Send your scope or repo access. I will tell you what looks solid, what is missing, and what a realistic fix costs.',
  },
];

export const buyerIntentPagesByPath = Object.fromEntries(
  buyerIntentPages.map((page) => [page.path, page]),
) as Record<string, BuyerIntentPage>;

export const buyerIntentPaths = buyerIntentPages.map((p) => p.path);

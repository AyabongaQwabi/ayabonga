#!/usr/bin/env node
/**
 * One-off generator for SA company roundup blog posts 9–12.
 * Run: node scripts/generate-sa-company-roundup-posts.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../src/content/blog');

const WHATSAPP =
  'https://wa.me/27603116777?text=' +
  encodeURIComponent("Hi Ayabonga, I'm comparing dev partners in SA and would like to chat.");

function fm({
  title,
  excerpt,
  seoTitle,
  seoDescription,
  slug,
  readTime,
  tags,
  categories,
}) {
  return `---
title: "${title}"
excerpt: "${excerpt}"
seoTitle: "${seoTitle}"
seoDescription: "${seoDescription}"
slug: ${slug}
date: May 16, 2026
readTime: ${readTime}
tags: ${tags}
categories: ${categories}
headerImage: /images/blog/${slug}.png
---

`;
}

const disclaimer = `**Disclaimer:** Company names, ownership, and service focus change. This guide was researched in **May 2026** using public directories, vendor sites, and industry listings. Treat every name as a starting point for your own due diligence, not a ranking or endorsement. I am not paid to feature any firm on this list.

`;

const ctaBlock = `
## Next step if you are still deciding

If you have a **specific product** (marketplace, fintech flow, AI feature, internal tool) and want a senior-led scope conversation before you sign with an agency, use the [project quote estimator](/get-a-quote) for a structured ballpark, or [message me on WhatsApp](${WHATSAPP}) with a one-paragraph brief.

Related reading:

- [What a technical co-founder costs in South Africa (2026)](/blog/technical-cofounder-cost-south-africa-2026)
- [The hidden cost of junior-built MVPs](/blog/hidden-cost-junior-mvp)
- [Technical co-founder as a Service](/technical-cofounder)
- [MVP developer South Africa](/mvp-developer-south-africa)
- [App development cost South Africa](/app-development-cost-south-africa)
`;

const ayabongaBlock = `
## Where Ayabonga Qwabi fits (honest placement)

I am **Ayabonga Qwabi**, a senior product engineer based in Queenstown, Eastern Cape. I work as a **technical co-founder style partner** ([TaaS](/technical-cofounder)), not a 200-person delivery factory.

**A fit when:**

- You need one accountable senior builder for Phase 1 (MVP, rebuild, or AI feature slice).
- You want direct communication without account-manager layers.
- Your budget is founder-scale (roughly **R280k–R850k** for serious Phase 1 scope, depending on payments, multi-app, and compliance), not enterprise RFP scale.

**Not a fit when:**

- You need 15 contractors on a bench next month.
- Procurement requires B-BBEE certificates, formal SI (systems integrator) panels, or on-site teams in Sandton five days a week.
- You only want a WordPress brochure site at the lowest ticket price.

If that sounds like your stage, [get a scoped quote](/get-a-quote) or [WhatsApp me](${WHATSAPP}).
`;

const chooseBlock = `
## How to choose a software development company in South Africa

Use the same checklist whether you are hiring Warp-scale delivery or a five-person studio.

| Question | Why it matters |
|----------|----------------|
| Who writes code day to day? | Account managers are not architects. Ask for named tech leads. |
| What shipped in the last 12 months? | Case studies beat slide decks. Ask for live URLs or store links. |
| How do they handle scope change? | Fixed price without change control creates resentment on both sides. |
| Payments and POPIA | If you take money or health data, ask about Paystack/Ozow patterns and data retention early. |
| Loadshedding and support | Ask about hosting region, monitoring, and who answers at 21:00 on a Sunday. |
| Exit plan | You should own repos, domains, and cloud accounts from day one. |

**Red flags:** vague timelines, no mention of testing, "we'll use AI to cut time in half" with no architecture talk, or refusal to do a paid discovery week before a six-figure quote.
`;

const customVsAgency = `
## When a custom build (or senior partner) beats a traditional agency

| Your situation | Agency / large shop | Senior custom partner or small specialist team |
|----------------|---------------------|-----------------------------------------------|
| Greenfield MVP with one core workflow | Often over-scoped with PM + design + dev tiers | Faster path if one senior owns product and code |
| Enterprise integration (SAP, mainframe, 50 stakeholders) | Strong fit | You still need enterprise process; partner augments |
| Brand site on WordPress | Web agency is fine | Overkill to hire full custom software house |
| Failed junior build needs audit + rebuild | New agency may repeat sales layers | [Takeover-style](/blog/hidden-cost-junior-mvp) senior engagement can be cheaper |
| Need 8 engineers in 30 days | Staff augmentation or DVT-scale firm | Solo operator will not scale |

Agencies earn their fees when coordination is the product. When **speed to validated revenue** matters more than headcount, a smaller senior-led build often wins.
`;

// --- Post 9 ---
const post9 = fm({
  title: 'Software Development Companies in South Africa (2026)',
  excerpt:
    'A buyer-focused map of 45+ South African software development companies by category, plus how to choose a partner and when a senior custom build beats agency overhead.',
  seoTitle: 'Software Development Companies in South Africa (2026) | Buyer Guide',
  seoDescription:
    'Compare 45+ software development companies in South Africa by category: enterprise, boutique, product studios, and nearshore. How to choose and when custom build wins.',
  slug: 'software-development-companies-south-africa-2026',
  readTime: '18 min read',
  tags: 'South Africa, Software development, Agencies, Startups, Hiring',
  categories: 'Engineering, Business',
}) + `${disclaimer}
Searching for a **software development company in South Africa** usually means one of three things: you need enterprise delivery capacity, a product studio to ship an app, or a senior team that can own architecture without fifty people in the room. This guide is for buyers, founders, and CTOs who want a **structured shortlist**, not a spam directory.

Lists on the internet mix Cape Town product studios with Polish offshore firms that once bid on a Johannesburg RFP. I filtered for **firms with a meaningful South African presence** (HQ or delivery office), grouped them by how they actually sell, and added selection criteria you can reuse in procurement.

## Categories that actually matter

| Category | Typical buyer | What you are buying | Watch out for |
|----------|---------------|---------------------|---------------|
| **Enterprise & scale delivery** | Corporate IT, banks, insurers | Teams, governance, SLAs (service level agreements) | Minimum spend and long sales cycles |
| **Boutique custom software** | Mid-market, funded startups | Bespoke web/mobile, direct senior access | Capacity limits on peak months |
| **Product studios & venture builders** | Founders, innovation units | MVP → v1, design + dev packaged | May push their process over yours |
| **Nearshore / offshore with SA office** | Cost-sensitive scale-ups | Rate arbitrage + English + SAST timezone | Delivery hub may be split across countries |
| **Staff augmentation** | Teams that need bodies | Developers on your Jira | You still own management quality |

## Enterprise and large-scale delivery

These firms employ hundreds of engineers (or operate like they do). Strong when you need **audit trails, multi-team programmes, and vendor stability**.

| Company | HQ / major SA hubs | Notes |
|---------|-------------------|--------|
| **DVT** | Johannesburg (+ global) | 500+ technologists; custom software, mobile, Microsoft, AI, staff augmentation |
| **BBD** | Johannesburg, Cape Town, Pretoria | Long-running SA software engineering firm; enterprise systems |
| **Synthesis** | Johannesburg | Cloud, data, software engineering for financial and enterprise clients |
| **Entelect** | Johannesburg, Cape Town, Durban | High-calibre engineering culture; consulting + delivery |
| **Haefele Software** | Cape Town | Microsoft-focused outsourcing; international clients |
| **SovTech / Scrums.com** | Randburg, Johannesburg | Custom software and app delivery at scale; also productised offerings |
| **Netgen Custom Software** | Randburg, Cape Town | Established 2000; web, mobile, digital strategy |
| **Realm Digital** | Cape Town | Consulting, web, mobile, business systems (since 2000) |
| **Retro Rabbit** | Pretoria | Enterprise software and Microsoft ecosystem delivery |
| **Open Box Software** | Johannesburg | Financial services and enterprise-focused engineering |
| **Chillisoft** | Durban | Enterprise DevOps and software delivery |
| **Andile Solutions** | Johannesburg | Financial markets and enterprise platforms |
| **Accenture / Deloitte / Cognizant** (SA practices) | Major cities | Global SI (systems integrator) capacity when RFP requires brand |

## Boutique custom software (10–100 people)

Sweet spot for **defined products** where you want a named team but not a tender document the size of a novel.

| Company | Location | Focus |
|---------|----------|--------|
| **Warp Development** | Cape Town, Pretoria, Somerset West | Custom software, ecommerce, CMS, UX; long track record since 2002 |
| **Bluegrass Digital** | Cape Town, Johannesburg | Web, mobile, low-code, staff augmentation |
| **Polymorph** | Stellenbosch | Custom software for product companies |
| **CubeZoo** | Randburg, Johannesburg | Web and mobile platforms; enterprise modernisation |
| **Elemental** | Cape Town | Custom web, ecommerce, applications (since 2005) |
| **Haefele Software** | Cape Town | Outsourced Microsoft development |
| **Webtonic Solutions** | Sandton | Ecommerce, custom software, web |
| **Liorra Tech** | Sandton | Custom software, mobile, IT strategy |
| **Softserve Digital Development** | Edenvale | Custom dev, UX, mobile |
| **TypeDev.io** | Centurion, Cape Town | Custom software |
| **Melsoft** | Johannesburg | Software products and delivery |
| **Bermont** | Cape Town | Web, ecommerce, SEO-aware builds |
| **SIVOXI** | Sandton | UX-led design and development |
| **Modern Day Strategy** | Cape Town | Web design + development + mobile |
| **Digital Design Agency Group** | Sandton, Johannesburg | Software, web, mobile, consulting |
| **Exceed IT** | Pretoria | Web, mobile, ecommerce (newer firm, growing presence) |
| **Codenatics** | Cape Town | Custom software, ecommerce, mobile |
| **ZonkeTech** | Durban (Umhlanga) | Custom software for gaming and enterprise clients |
| **CRT Group (Creative Rock Technologies)** | George | Custom software, ecommerce, mobile |
| **Neslo Tech** | Sandton | UX and web for corporate clients |
| **Pineconepixel** | Johannesburg | Custom software and web at midsize scale |

## Product studios, app shops, and venture-style builders

When the buyer says **"we need an MVP in twelve weeks"**, these names come up first.

| Company | Location | Focus |
|---------|----------|--------|
| **Specno** | Cape Town (+ international studios) | Mobile-first product studio; retail and fintech names on public case studies |
| **SovTech** | Randburg | High-volume app delivery; enterprise and startup mix |
| **Netgen** | Randburg, Cape Town | Digital product and mobile |
| **CubeZoo** | Gauteng | Product-grade web and mobile |
| **Kodeln** | Johannesburg | Mobile, web, AI, API development |
| **DevIgnite** | Johannesburg | Custom web and mobile (ASP.NET, Kotlin, Firebase) |

## Nearshore, offshore, and hybrid delivery

Useful when **cost per hour** dominates and you can manage remote teams.

| Company | Model | SA angle |
|---------|-------|----------|
| **Haefele Software** | Outsourcing | Cape Town delivery for overseas clients |
| **DVT** | Hybrid | SA talent + global offices |
| **BBD** | Enterprise outsourcing | Strong local graduate pipeline |
| **ValueLabs** | Global delivery | SA presence for enterprise programmes (verify current office status) |
| **Innowise / global vendors on Clutch** | Offshore | Often listed in SA directories; confirm where code is written |

Always ask: **Where will my team sit, and who appears on my standups?**

## Additional names worth shortlisting (regional coverage)

These firms appear consistently in **Clutch**, **The Manifest**, and local referrals. Worth a discovery call if your category above did not fit.

| Company | Location | Why include |
|---------|----------|-------------|
| **Kri8tive** | Cape Town | Web and brand-forward digital |
| **Galactic Digital** | Cape Town (remote-first) | Development-first web agency |
| **RogueWeb** | Johannesburg | Web, ecommerce, marketing blend |
| **3SixT5** | Gauteng | Web, apps, SEO, design |
| **Ethos & Ember** | National | Web design and development |
| **WebDevX** | Johannesburg | WordPress, ecommerce, custom web |
| **AfriNova Digital** | Cape Town | Software and integration projects |
| **Smartt Software** | Johannesburg | Line-of-business systems |
| **Appstrax** | Cape Town | Mobile and web products |
| **Specno** | Cape Town | Already listed; dominates app studio searches |
| **Synthesis** | Johannesburg | Cloud-native enterprise |
| **DVT** | National | Already listed; dominates enterprise searches |

That brings the **named shortlist to 45+** distinct firms across categories. If you need more, search "software development company South Africa" on [The Manifest](https://themanifest.com/za/software-development/companies) or [Clutch](https://clutch.co/za/developers) and **filter by city and verified reviews**.

${chooseBlock}

${customVsAgency}

## Johannesburg vs Cape Town vs "rest of SA"

| Hub | Strength | Trade-off |
|-----|----------|-----------|
| **Johannesburg / Sandton / Randburg** | Enterprise clients, fintech HQs, larger vendors | Higher rates; more process |
| **Cape Town** | Product studios, startup density, design culture | Talent competition; remote hybrid norms |
| **Durban / KZN** | Growing boutique scene (e.g. ZonkeTech) | Smaller pool for niche stacks |
| **Eastern Cape / remote** | Lower cost of living; senior operators increasingly remote-first | Fewer large agencies locally; plan for distributed collaboration |

I work from **Queenstown** with clients across SA and abroad. Location matters less than **who owns your codebase** and whether they have shipped under SA connectivity and payment realities.

## Keywords buyers actually type

If you are optimising your own search or Google Ads, these phrases overlap heavily:

- software development company south africa
- custom software development south africa
- software development companies cape town
- software development companies johannesburg
- app development company south africa (see our [mobile app company guide](/blog/mobile-app-development-companies-south-africa))

## Frequently asked questions

### How much does a software development company charge in South Africa?

Project quotes often start around **R150k–R250k** for small web builds and run **R400k–R1M+** for serious mobile or enterprise integrations. Day rates for seniors vary by city and firm. Use the [quote estimator](/get-a-quote) to sanity-check scope before you sign.

### Are South African developers good value for international clients?

Same timezone as EU afternoon, English-first communication, and strong engineering schools. Many US and UK companies use SA as **nearshore**. Compare total cost including management overhead, not hourly rate alone.

### Should I hire a company or a freelancer?

Companies give you bench depth and continuity. Freelancers or solo seniors give you speed and direct accountability. For **regulated or payment-heavy** products, prefer a structure with code review and backup coverage.

${ayabongaBlock}

${ctaBlock}
`;

// --- Post 10 ---
const post10 = fm({
  title: 'Web Development Companies in South Africa',
  excerpt:
    '40+ web development companies in South Africa compared by stack, city, and buyer fit, with tables for WordPress, React, and enterprise web teams.',
  seoTitle: 'Web Development Companies in South Africa (2026 Guide)',
  seoDescription:
    'Find a web development company in South Africa: Cape Town, Johannesburg, Durban, and remote teams. Compare stacks, pricing signals, and how to choose.',
  slug: 'web-development-companies-south-africa',
  readTime: '17 min read',
  tags: 'South Africa, Web development, React, WordPress, Agencies',
  categories: 'Engineering, Business',
}) + `${disclaimer}
A **web development company in South Africa** is not the same as a software house, and neither is the same as a design-only studio. Web firms usually lead with **sites, ecommerce, and marketing technology**. Software firms lead with **products, APIs, and long-lived platforms**. This article lists both flavours where their primary offer is **building for the browser**.

## What "web development company" means in 2026

| Type | Typical deliverable | Stack signals |
|------|---------------------|---------------|
| **Marketing web agency** | Corporate site, campaigns | WordPress, Webflow, Elementor |
| **Product web shop** | SaaS (Software as a Service) dashboards, portals | React, Next.js, Vue, .NET |
| **Ecommerce implementer** | Shopify, WooCommerce, Magento | PHP, JS storefronts |
| **Enterprise web integrator** | Portals, intranets, CMS at scale | Java, .NET, headless CMS |

Ask every vendor: **"Is this a theme install or a product codebase?"** The price and maintenance story differ by an order of magnitude.

## Large list: web development companies by region

### Cape Town and Western Cape

| Company | Services | Good for |
|---------|----------|----------|
| **Elemental** | Custom web, ecommerce, apps | Established mid-size web programmes |
| **Warp Development** | Custom web, ecommerce, CMS | Complex commerce and content platforms |
| **Bluegrass Digital** | Web, mobile, UX | Brands needing design + engineering |
| **Specno** | Web + mobile product builds | Startup-grade product velocity |
| **Polymorph** | Custom web platforms | Product companies |
| **Realm Digital** | Web, consulting, integration | Corporate web modernisation |
| **Galactic Digital** | Web design + dev, technical SEO | Founders who want code-quality sites |
| **Bermont** | Web, ecommerce, SEO | SME ecommerce |
| **Modern Day Strategy** | Web design and development | Marketing sites with custom features |
| **CubeZoo** | Web and mobile | Platforms, not brochure sites |
| **Haefele Software** | Microsoft web stacks | .NET-heavy organisations |
| **Appstrax** | Web and mobile | Startups |

### Johannesburg, Pretoria, and Gauteng

| Company | Services | Good for |
|---------|----------|----------|
| **Netgen Custom Software** | Web, mobile, strategy | Long-term digital products |
| **SovTech** | Web applications at scale | Apps with ongoing roadmaps |
| **Webtonic Solutions** | Web, ecommerce, custom software | Retail and services |
| **Liorra Tech** | Web, mobile, consulting | Sandton corporate clients |
| **DevIgnite** | Custom web apps | ASP.NET Core and Firebase shops |
| **WebDevX** | WordPress, ecommerce, marketing sites | SMEs wanting fast marketing sites |
| **Kodeln** | Web apps, APIs, AI features | Product teams in JHB |
| **RogueWeb** | Web design, ecommerce, marketing | Brand-heavy web presence |
| **3SixT5** | Web, apps, SEO | Full digital packages |
| **Digital Design Agency Group** | Web + software | Hybrid marketing and product |
| **Melsoft** | Web and software products | B2B platforms |
| **Pineconepixel** | Web development | Midsize custom builds |
| **Softserve Digital Development** | Web, UX, mobile | Edenvale/Gauteng corporates |
| **TypeDev.io** | Custom web | Centurion tech corridor |
| **Exceed IT** | Web, mobile, ecommerce | Newer Pretoria-based delivery |

### Durban and KwaZulu-Natal

| Company | Services | Good for |
|---------|----------|----------|
| **ZonkeTech** | Web, mobile, custom software | Enterprise KZN clients |
| **Chillisoft** | Enterprise delivery incl. web | DevOps-aware programmes |

### National / multi-city / remote-first

| Company | Notes |
|---------|--------|
| **DVT** | Enterprise web and cloud programmes |
| **BBD** | Large-scale web and backend systems |
| **Synthesis** | Cloud-native web and data platforms |
| **Entelect** | High-standard engineering across web stacks |
| **Ethos & Ember** | 20+ years in web design and development |
| **Scrums.com (SovTech)** | Subscription-style app and web delivery |

## WordPress vs custom React (how to pick a web dev company)

| If your need is… | Lean toward… | Example vendors from list |
|------------------|--------------|---------------------------|
| Blog, brochure, SEO landing pages | WordPress agency | WebDevX, RogueWeb, 3SixT5 |
| Online store < 500 SKUs | WooCommerce / Shopify partner | Webtonic, Bermont, RogueWeb |
| Logged-in product, roles, APIs | Custom web shop | Elemental, Warp, Netgen, Kodeln |
| Integration with existing .NET enterprise | Microsoft shop | Haefele, DevIgnite, BBD |

**Honest opinion:** paying Netgen rates for a five-page WordPress site is misaligned budget. Paying a WordPress freelancer for a multi-tenant SaaS is how rebuilds get funded.

## How to evaluate a web development company

1. **Ask for Core Web Vitals on a live client site**, not Lighthouse on localhost.
2. **Confirm who hosts** (Vercel, AWS Cape Town region, Afrihost, etc.) and who holds DNS.
3. **Request accessibility spot-check** (keyboard nav, form labels). POPIA privacy policy is separate from WCAG (Web Content Accessibility Guidelines).
4. **Define content responsibility** (who writes copy, who migrates SKUs).
5. **Plan loadshedding**: static generation and CDN caching matter for SA users.

## When custom web development beats a template agency

Custom build wins when you have **authentication, payments, webhooks, admin roles, or a roadmap beyond six months**. Template agencies win when you need **speed to market for marketing content** and your backend is email + spreadsheet.

If you are a founder building a **revenue product**, read [technical co-founder cost bands](/blog/technical-cofounder-cost-south-africa-2026) before you compare web agency quotes.

## Web development vs software development (label confusion)

Many companies on this list also appear in our [software development companies guide](/blog/software-development-companies-south-africa-2026). The label on the website matters less than **the team that will maintain your repo in year two**.

## Headless CMS and JAMstack (JavaScript, APIs, and Markup) in SA

More web development companies now deliver **headless** architectures: Contentful, Sanity, Strapi, or WordPress headless + Next.js front end. Benefits for SA sites:

- **CDN-first delivery** survives traffic spikes and loadshedding-induced retries better than a single PHP server in one office park.
- **Preview workflows** let marketing edit without redeploying code.
- **Multi-channel content** (web, app, kiosk) from one source.

Ask vendors if they have shipped **ISR (incremental static regeneration)** or edge caching, not only "we know React."

## Hosting and domain checklist (South Africa buyers)

| Item | Question for the web dev company |
|------|----------------------------------|
| DNS | Will the domain sit in my registrar account? |
| SSL | Auto-renew via Let's Encrypt or Cloudflare? |
| Email | Are MX records documented after launch? |
| Backups | Daily DB backups with tested restore? |
| Uptime monitoring | Who gets paged when the site is down? |
| POPIA forms | Is consent logged for newsletter signups? |

## RFP (request for proposal) shortcuts for corporate buyers

If you must run a formal procurement process, score vendors on **weighted criteria** instead of cheapest hourly rate:

1. **Relevant case study** (40%): same industry or integration pattern.
2. **Team stability** (20%): named leads, not rotating juniors.
3. **Methodology** (20%): discovery, UAT (user acceptance testing), launch runbook.
4. **Total cost** (20%): include year-one maintenance.

Cap the shortlist at **four companies**. More than four discovery calls rarely improves decision quality.

## Additional web development names (second pass)

| Company | Region | Stack / niche |
|---------|--------|----------------|
| **Afrihost Web Services** | National | Hosting-adjacent; verify custom dev vs reseller |
| **IT Lec** | Gauteng | Corporate web and integration |
| **Smartt Software** | Johannesburg | Line-of-business web portals |
| **Kri8tive** | Cape Town | Creative web builds |
| **Cirrus Bridge** | National | Cloud and custom development (verify web focus) |
| **Codestream** | Cape Town | Boutique web and product |
| **Blankpage Creative** | Cape Town | Design-forward marketing sites |
| **Blink Digital** | Johannesburg | Performance marketing + web |
| **Quirk (Accenture Song)** | National | Enterprise marketing technology |
| **Flow Communications** | Johannesburg | Corporate communications web |

## Frequently asked questions

### What is the average cost of a website in South Africa in 2026?

Brochure sites: **R15k–R60k** (template-heavy). Custom marketing sites: **R60k–R200k**. Web applications with login and APIs: **R250k+**. Always separate **once-off build** from **monthly hosting and maintenance**.

### Should I use a local web development company if my customers are global?

Yes, if they understand CDN and multi-region hosting. Location matters for **workshops and stakeholder meetings**, not for serving US users from Cloudflare edge.

### How long does a corporate website take?

Marketing sites: **6–12 weeks** with content ready. Portals with integrations: **4–9 months**. Late content is the number one delay, not coding.

${chooseBlock}

${customVsAgency}

${ayabongaBlock}

${ctaBlock}
`;

// --- Post 11 ---
const post11 = fm({
  title: 'Web Design Companies in South Africa',
  excerpt:
    'A practical directory of web design companies in South Africa, when to hire design-only vs design-and-build, and how to avoid pretty mockups that never ship.',
  seoTitle: 'Web Design Companies in South Africa (2026)',
  seoDescription:
    'Web design companies in South Africa for brands, ecommerce, and UI systems. Compare agencies in Cape Town and Johannesburg and when you need a developer too.',
  slug: 'web-design-companies-south-africa',
  readTime: '16 min read',
  tags: 'South Africa, Web design, UX, UI, Agencies',
  categories: 'Design, Business',
}) + `${disclaimer}
**Web design companies in South Africa** sell visual language, layout, and often marketing execution. Some ship production code. Others hand Figma files to your nephew. This guide separates **design-led agencies** from **development-first shops** so you hire the right discipline.

## Design-only vs design-and-build

| Model | You get | Risk |
|-------|---------|------|
| **Design agency** | Brand, UI kit, marketing pages in Figma | Dev implementation quality unknown |
| **Design + dev studio** | End-to-end launch | Higher cost, single throat to choke |
| **Freelance designer** | Fast iteration | May lack design system discipline |
| **Senior product engineer** | UX-aware code, lighter brand polish | You supply brand or accept minimal visual layer |

If you need payments, admin, or APIs, a **web design company alone is not enough**. Pair design with a [web development company](/blog/web-development-companies-south-africa) or a senior builder.

## Web design companies and studios (South Africa)

### Gauteng (Johannesburg, Sandton, Pretoria)

| Company | Focus |
|---------|--------|
| **RogueWeb** | Website design, branding, digital marketing |
| **3SixT5** | Web design, graphic design, ecommerce creative |
| **Digital Design Agency Group** | Design-led digital, Sandton |
| **Webtonic Solutions** | Design + ecommerce execution |
| **Neslo Tech** | UX/UI with corporate web delivery |
| **Liorra Tech** | UX/UI alongside software builds |
| **Modern Day Strategy** | Web design with development arm (Cape Town HQ, national work) |

### Cape Town and Western Cape

| Company | Focus |
|---------|--------|
| **Ethos & Ember** | Web design, WordPress, performance |
| **Galactic Digital** | Design with development-first implementation |
| **SIVOXI** | UX/UI and product design |
| **Bluegrass Digital** | UX/UI + engineering |
| **Bermont** | Web design, ecommerce visuals, SEO |
| **Specno** | Product design for apps and web |
| **Elemental** | Long-running web design and build |
| **CubeZoo** | UX for platforms |

### Durban and other cities

| Company | Focus |
|---------|--------|
| **ZonkeTech** | UX for software products |
| **CRT Group** | Creative + web for smaller enterprises |

### Agencies often hired for brand + web (national)

| Company | Notes |
|---------|--------|
| **King James Group** | Advertising with digital design (verify current web dev capacity) |
| **Hellocomputer / FCB** | Campaign digital; usually not custom product shops |
| **Wonderlust** | Brand and digital experiences |
| **Yellow Door Collective** | Creative agency with digital |

For **product UI systems** (dashboards, not billboards), prefer studios with **in-house React or .NET developers** over pure advertising creatives.

## What to ask before you sign a web design contract

| Question | Good answer sounds like… |
|----------|---------------------------|
| Do you hand off dev-ready Figma with components? | Yes, auto-layout, states, spacing tokens |
| Who owns fonts and stock assets? | License transferred to us |
| How many revision rounds? | Defined rounds, then change order |
| Mobile breakpoints included? | Yes, 320 / 768 / 1024+ |
| Accessibility standard? | WCAG AA target on key flows |
| Content migration? | Scoped separately with timeline |

## Pricing signals (indicative, not quotes)

Web design-only projects in SA often land in these **very rough** bands in 2026:

| Scope | Indicative range (ZAR) |
|-------|-------------------------|
| Landing page + style tile | R15,000–R45,000 |
| SME marketing site (5–8 pages) | R40,000–R120,000 |
| Ecommerce visual system + templates | R80,000–R250,000+ |
| Product UI for app (no backend) | R60,000–R200,000+ |

Development is usually **additional**. If a quote looks too cheap for both design and build, ask what is excluded (SEO, copy, hosting, forms, analytics).

## When web design companies are the wrong hire

- You need **Paystack checkout and webhook idempotency** → hire engineering-first.
- You need **POPIA-grade data model** for minors or health → not a marketing agency solo.
- You need **one founder MVP in eight weeks** → consider [TaaS](/technical-cofounder) or a product studio from the [software company list](/blog/software-development-companies-south-africa-2026).

## Design + SEO + performance

South African users on mobile networks reward **light pages**. Ask designers to specify:

- Image formats (WebP/AVIF)
- Font subsetting
- Hero weight limits
- Component reuse (design system)

Pretty mockups with 4 MB PNG heroes become your problem after handoff.

## Web design trends in South Africa (2026, practical not hype)

| Trend | Worth it when… | Skip when… |
|-------|----------------|------------|
| **Bold typography** | Brand differentiation matters | Readability suffers on small screens |
| **Dark mode** | Product UI, dev tools, premium brands | Content-heavy marketing sites with long articles |
| **3D / WebGL heroes** | Campaign microsites | You need fast LCP (Largest Contentful Paint) on mobile data |
| **AI-generated imagery** | Mood boards, placeholders | Final brand assets without legal review |
| **Bento grids** | Portfolio and feature pages | Complex forms and checkout flows |

Local brands also win with **authentic photography** (real teams, real townships and cities) rather than stock "diverse handshake" imagery.

## How to review a web design portfolio like a buyer

1. Open the site on **mobile data**, not office Wi-Fi.
2. Tab through forms with keyboard only.
3. Check **contrast** on buttons (grey on grey fails WCAG).
4. Read **microcopy** on errors (does it help or blame the user?).
5. Ask whether the agency **also built** the site or only designed it.

A stunning Behance case study that never went live is not proof.

## Design systems worth paying for

If you will ship **more than one product surface** (marketing site + logged-in app), pay for:

- Colour tokens (primary, surface, danger)
- Type scale (not six random font sizes)
- Button and input components with states
- Spacing grid (4/8 px rhythm)

Without a system, every new page becomes a negotiation.

## More web design and UX studios

| Company | City | Notes |
|---------|------|--------|
| **Think Creative** | Cape Town | Brand and digital |
| **Mango Graphic Design** | National | SME-focused |
| **Lemonade Design** | Johannesburg | Branding + digital |
| **Atom Design** | Cape Town | UX consultancy |
| **UX Labs** | Johannesburg | Research and UX |
| **Blankpage** | Cape Town | Creative campaigns |
| **Pigeon Pie** | Cape Town | Boutique digital design |
| **Wonderlust** | Cape Town | Experiential + digital |
| **King James Digital** | Cape Town / JHB | Campaign digital |
| **Hellocomputer Digital** | National | Large brand campaigns |

Pair any design-only winner with a dev partner from the [web development list](/blog/web-development-companies-south-africa) before you announce a launch date.

## Frequently asked questions

### What is the difference between web design and web development?

**Design** decides how it looks and feels. **Development** makes it work in browsers, databases, and integrations. Many SA firms do both; confirm which side you are buying.

### Can I hire a web design company for a mobile app?

You can hire them for **UI/UX screens**, but you still need mobile engineering for store submission, push, and offline behaviour. See [mobile app companies](/blog/mobile-app-development-companies-south-africa).

### How do I protect my brand files after handoff?

Contract should list: Figma source, font licenses, icon SVGs, style guide PDF, and **no withholding files for unpaid disputes unrelated to IP**.

${chooseBlock.replace('software development company', 'web design partner')}

${customVsAgency.replace('agency', 'design agency').replace('Agency', 'Design agency')}

${ayabongaBlock}

${ctaBlock}
`;

// --- Post 12 ---
const post12 = fm({
  title: 'Mobile App Development Companies in South Africa',
  excerpt:
    'South Africa mobile app development companies compared: native, React Native, Flutter, and enterprise app shops, with buyer checklists and cost context.',
  seoTitle: 'Mobile App Development Companies in South Africa (2026)',
  seoDescription:
    'Find a mobile app development company or app making company in South Africa. Compare Specno, SovTech, Bluegrass, Netgen, and 35+ firms with buyer tips.',
  slug: 'mobile-app-development-companies-south-africa',
  readTime: '18 min read',
  tags: 'South Africa, Mobile apps, React Native, Flutter, iOS, Android',
  categories: 'Engineering, Business',
}) + `${disclaimer}
Hiring a **mobile app development company in South Africa** is high stakes. Store fees, device fragmentation, offline behaviour, and payment integrations (Paystack, Ozow, in-app rules) punish shortcuts. This is a **buyer guide to app making companies**, not a ranking. Names change; verify everything before you sign.

## Native vs cross-platform (what to ask every app company)

| Approach | Pros | Cons |
|----------|------|------|
| **Native (Swift / Kotlin)** | Best performance and platform APIs | Two codebases, higher cost |
| **React Native / Expo** | One team, fast iteration, web skill overlap | Native module gaps need experts |
| **Flutter** | Consistent UI, good performance | Dart hiring pool smaller in SA |
| **PWA (Progressive Web App)** | No store gatekeeping | Limited push, weaker "app" presence |

Most SA **app making companies** sell React Native or Flutter for startup MVPs, native for regulated or hardware-heavy apps (NFC, Bluetooth, complex background tasks).

## Top-tier app studios (frequently reviewed)

These names dominate **Clutch** and **The Manifest** SA app categories in 2026:

| Company | Location | Public positioning |
|---------|----------|-------------------|
| **Specno** | Cape Town | Product studio; retail and fintech case studies |
| **Bluegrass Digital** | Cape Town, JHB | Mobile, custom software, staff augmentation |
| **SovTech** | Randburg | High-volume custom apps; enterprise and startup |
| **Netgen Custom Software** | Randburg, Cape Town | Mobile + web product delivery |
| **CubeZoo** | Gauteng | Mobile platforms for brands |
| **Warp Development** | Cape Town | Custom apps and commerce |
| **Kodeln** | Johannesburg | Mobile, AI, APIs |

## More mobile app development companies (broader list)

| Company | Location | Notes |
|---------|----------|--------|
| **Haefele Software** | Cape Town | Microsoft and mobile solutions |
| **Elemental** | Cape Town | Web + mobile |
| **Liorra Tech** | Sandton | Mobile + custom software |
| **Softserve Digital Development** | Edenvale | Mobile + UX |
| **TypeDev.io** | Centurion | Custom apps |
| **Melsoft** | Johannesburg | Product engineering |
| **Bermont** | Cape Town | Mobile-friendly web + apps |
| **SIVOXI** | Sandton | UX-led mobile |
| **Modern Day Strategy** | Cape Town | Mobile + web |
| **Digital Design Agency Group** | Gauteng | Mobile in mixed engagements |
| **ZonkeTech** | Durban | Gaming and enterprise mobile |
| **CRT Group** | George | SME mobile projects |
| **Codenatics** | Cape Town | Mobile for SMB |
| **Realm Digital** | Cape Town | Corporate mobile programmes |
| **Pineconepixel** | Johannesburg | Larger mobile/web teams |
| **Appstrax** | Cape Town | Startup mobile |
| **DevIgnite** | Johannesburg | Kotlin + Firebase mobile |
| **Exceed IT** | Pretoria | Growing mobile practice |
| **DVT** | National | Enterprise mobile at scale |
| **BBD** | National | Enterprise mobile and backend |
| **Entelect** | National | Strong engineering mobile teams |
| **Retro Rabbit** | Pretoria | Microsoft ecosystem mobile |
| **Open Box Software** | Johannesburg | Financial services apps |

That is **35+ named firms** before you open directory sites. Search **"mobile app development company south africa"** and filter reviews from the last 24 months.

## Enterprise and B2B app delivery

When your buyer is **IT procurement**, not a founder with a pitch deck:

| Company | Why enterprises shortlist them |
|---------|------------------------------|
| **DVT** | Scale, governance, AI and mobile practices |
| **BBD** | Long-term banking and insurance relationships |
| **Synthesis** | Cloud and data-heavy programmes |
| **Entelect** | Engineering excellence and consulting |
| **SovTech** | Packaged delivery models and volume |

Founders with **R300k–R600k** Phase 1 budgets often get better ROI from a **studio or senior partner** than from enterprise sales cycles.

## What an app making company should cover in discovery

| Topic | Why |
|-------|-----|
| **Offline / loadshedding** | Cache, queue actions, honest error states |
| **Auth** | Phone OTP, social login, session expiry |
| **Payments** | Paystack, Apple/Google IAP rules, refunds |
| **Push notifications** | FCM (Firebase Cloud Messaging), APNs setup |
| **Store submission** | Apple review, Google Play policies, metadata |
| **Analytics** | Events, crash reporting (Sentry, Firebase Crashlytics) |
| **POPIA** | Privacy policy, data deletion, minors |

See [SA payment gateways for React/Next](/blog/sa-payment-gateways-react-next-2026) if your app includes checkout.

## Cost context (indicative)

Mobile projects are rarely "cheap" if done properly.

| Scope | Indicative Phase 1 (ZAR) | Timeline |
|-------|---------------------------|----------|
| Single-platform MVP (one role) | R280,000–R420,000 | 8–12 weeks |
| iOS + Android cross-platform MVP | R350,000–R550,000 | 10–14 weeks |
| Marketplace (customer + provider apps) | R550,000–R850,000+ | 12–20 weeks |

For methodology behind the numbers, see [app development cost South Africa](/app-development-cost-south-africa) and the [quote tool](/get-a-quote).

## How to choose (app-specific checklist)

1. **Ask for TestFlight / Play Internal Testing builds**, not demo videos.
2. **Check who owns Apple Developer and Google Play accounts** (must be you).
3. **Confirm backend ownership** (Supabase, Firebase, custom Node).
4. **Review API versioning strategy** before v1 launch.
5. **Plan post-launch** (bug window, retainer, or internal hire).

## When a smaller senior build beats a big app factory

Big **app making companies** excel when you need volume, account management, and multi-team roadmaps. A **senior-led custom build** excels when:

- One workflow must work perfectly before you fund v2.
- You are pre-revenue and cannot carry PM + BA + three devs.
- You already got burned by a low-cost offshore MVP ([junior lottery](/blog/hidden-cost-junior-mvp)).

## App store submission (what SA app companies should handle)

| Platform | Vendor should demonstrate… |
|----------|------------------------------|
| **Apple App Store** | Certificates, provisioning, review guidelines, IAP rules |
| **Google Play** | Signing keys, data safety form, target API level compliance |
| **Huawei AppGallery** | Optional; only if you target Huawei devices |

You own the developer accounts. The app company advises; they do not hold your keys hostage.

## Maintenance retainer (plan before launch)

Typical post-launch needs:

- OS updates breaking layouts
- Payment gateway certificate changes
- Crash spikes after marketing campaigns
- Feature flags for gradual rollout

Ask for **retainer hours per month** and response time SLA (service level agreement). R10k/month retainers exist; enterprise programmes cost more. No retainer often means no priority when you are on fire.

## White-label and reseller apps

Some **app making companies** offer white-label templates (ordering, booking, membership). Works when your process matches the template. Fails when you need novel workflows (dynamic pricing, multi-sided marketplaces, custom compliance).

For marketplace patterns in SA, see [laundry marketplace white-label lessons](/blog/laundry-marketplace-white-label-sa).

## Security questions for fintech and health apps

| Area | Minimum bar |
|------|-------------|
| Transport | TLS everywhere; certificate pinning for high-risk |
| Storage | Encrypted local storage for tokens; no passwords in plain text |
| Auth | Refresh token rotation; device binding where needed |
| Logs | No card numbers or ID numbers in analytics events |
| POPIA | Lawful basis documented; data subject requests process |

If a mobile app development company cannot discuss these plainly, keep looking.

## More boutique app developers and studios

| Company | Notes |
|---------|--------|
| **Flowgear** | Integration-heavy mobile backends (verify current app focus) |
| **Smartt Software** | Business apps |
| **Appstrax** | Startup mobile |
| **Blankpage / creative agencies** | Often partner with dev shops for build |
| **Freelance collectives on OfferZen / local networks** | Vet individuals like a company |

## Frequently asked questions

### How much does it cost to build an app in South Africa?

Serious MVPs often land **R280k–R550k+** for cross-platform Phase 1. Enterprise programmes run higher. Use [app development cost](/app-development-cost-south-africa) and the [quote estimator](/get-a-quote).

### How long does mobile app development take?

Discovery: 1–3 weeks. Build: 8–16 weeks for many MVPs. Store review: add 1–2 weeks first time. Marketing before the product works is the usual mistake.

### React Native or Flutter in South Africa?

Both are viable. React Native has a larger pool if you already have React web developers. Flutter can be excellent for greenfield UI-heavy apps. Pick based on **who maintains v2**, not Twitter polls.

### Can one person build my app?

Solo seniors can ship focused MVPs with AI tooling. You trade bench depth for speed. For regulated domains, add review capacity (security, legal).

${chooseBlock}

${customVsAgency}

${ayabongaBlock}

## Related guides

- [Software development companies in South Africa](/blog/software-development-companies-south-africa-2026)
- [Web development companies](/blog/web-development-companies-south-africa)
- [Laundry marketplace patterns (white-label SA)](/blog/laundry-marketplace-white-label-sa)

${ctaBlock}
`;

const files = [
  ['software-development-companies-south-africa-2026.md', post9],
  ['web-development-companies-south-africa.md', post10],
  ['web-design-companies-south-africa.md', post11],
  ['mobile-app-development-companies-south-africa.md', post12],
];

for (const [name, content] of files) {
  const path = join(OUT, name);
  writeFileSync(path, content, 'utf8');
  const words = content.split(/\s+/).filter(Boolean).length;
  console.log(`${name}: ${words} words`);
}

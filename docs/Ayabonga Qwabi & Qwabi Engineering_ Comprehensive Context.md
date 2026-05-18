# Ayabonga Qwabi & Qwabi Engineering: Comprehensive Context

This document synthesizes the product marketing context, brand identity, and technical infrastructure for Ayabonga Qwabi's dual-brand presence: the personal portfolio (Ayabonga Qwabi) and the business entity (Qwabi Engineering).

## 1. Brand Architecture & Positioning

The brand operates on a strict split between the personal identity and the company identity, ensuring clear messaging for different audiences.

### Qwabi Engineering (Business Brand)
Qwabi Engineering, accessible at [business.qwabi.co.za](https://business.qwabi.co.za), is positioned as a custom software development company and AI-powered software systems studio tailored for South African businesses and agencies. The brand communicates using a "we" voice that is simple, relatable, natural, and constructive. The tone is outcomes-first, direct like a WhatsApp message but professionally polished. 

The primary target audience includes B2B startups, SMMEs that are digitising or scaling, operations leads, and agencies in need of a white-label technical delivery partner. The core value proposition centers on building systems that run the business, rather than just creating websites. This is achieved through engineering-led delivery that prioritizes discovery and architecture upfront, followed by staged builds and optional retainers for ongoing growth and support. Key differentiators for the business include its AI-powered systems capability, a focus on custom software over templates, staged delivery processes, and transparent ZAR pricing.

### Ayabonga Qwabi (Personal Brand)
The personal brand, found at [qwabi.co.za](https://www.qwabi.co.za), positions Ayabonga Qwabi as a Senior Product Engineer and Technical Co-founder as a Service (TaaS). This brand utilizes an "I" voice, maintaining a knowledgeable, humble, approachable, and direct tone that allows more room for personal story, opinion, and craft.

The target audience for the personal brand consists of founders seeking a technical partner, engineers interested in the craft of software development, and community builders. The core value proposition is encapsulated in the statement: "I don't write code. I build systems that compound." The services offered include product engineering, technical leadership, architecture, and MVP-to-scale builds. The brand identity is deeply rooted in the Eastern Cape (AbaThembu/AmaQithi), with a strong focus on bridging the digital divide in Africa through AI-powered cloud solutions.

## 2. Business Model & Pricing

Qwabi Engineering operates on a clear, transparent pricing model focused on long-term partnerships rather than one-off handoffs.

### Project Builds
The scope of project builds encompasses custom software, mobile apps, business systems, and web platforms. Pricing for these scoped builds is presented in ZAR, with a sweet spot ranging roughly from R30,000 to R250,000. Larger, more complex systems are priced at R250,000 and above. The minimum fit for a project is approximately R10,000 to R15,000, deliberately repelling low-budget "quick website" requests.

### Retainers (Core Revenue)
Retainers are positioned as the logical next step after a successful launch, providing an ongoing engineering partnership.

| Retainer Tier | Starting Price | Target Audience | Key Inclusions |
| :--- | :--- | :--- | :--- |
| **Essential** | R18,000 / month | SMMEs, MVPs, internal tools | Uptime monitoring, bug fixes, small updates, basic support |
| **Growth** | R45,000 / month | Evolving businesses shipping features | Continuous feature development, integrations, performance improvements |
| **Ecosystem** | R85,000 / month | Complex platforms needing high uptime | Multi-system architecture, cloud infrastructure, AI integrations, scaling |

## 3. Key Projects & Proof Points

Both brands leverage a shared portfolio of shipped work to build credibility, emphasizing the creation of robust systems over simple brochure sites.

| Project | Description | Key Focus |
| :--- | :--- | :--- |
| **Future Start** | Student success services and accommodation requests | Ideal client profile, staged delivery |
| **ClinicPlus** | Occupational health bookings for mining/construction | Systems replacing manual ops |
| **Ilithiyana** | Bookings and CRM for a service business in Mthatha | Secondary city tech empowerment |
| **eStudio Glam** | Educational platform for hairstylist training | Edutech and online learning |
| **Warner Music Africa** | Custom participant management system | Enterprise-level coordination |
| **uTap** (In Progress) | Campus digital wallet for SA students | Mobile-first, local payments |
| **Trip** (In Progress) | Compliance-first ride-hailing | Complex onboarding, ops tooling |
| **Laundry Marketplace** | Turnkey laundry marketplace | Multi-sided platform architecture |

## 4. Social Media Automation Infrastructure

The brand maintains a consistent social media presence through an automated, cron-driven system.

### Architecture
The automation is triggered by Vercel Cron jobs defined in `vercel.json`, which hit the `/api/cron/social-post.ts` endpoint. The schedule is set for five slots per day (06:00, 09:00, 12:00, 15:00, 18:00 UTC) on Mondays, Wednesdays, and Fridays. When triggered, the Vercel serverless function executes a Node.js script (`scripts/social/post.js`) using `execFile`. The entire process is secured by a `CRON_SECRET` bearer token.

### Content Strategy (The Calendar)
The source of the content is `scripts/social/calendar.json`, which contains a comprehensive 10-week schedule featuring 140 pre-written posts. These posts are distributed across Facebook (text-only) and Instagram (caption plus image). For Instagram, media generation is automated; the system fetches relevant stock imagery based on a specific `query` and `media` type, utilizing Pexels for photos or Vecteezy for vectors. The content themes heavily reinforce the brand positioning, discussing topics such as the "Junior Dev Lottery," the value of retainers, building for African realities like load shedding and offline-first requirements, and showcasing case studies of shipped work.

## 5. Technical Stack & Preferences

The technical infrastructure relies on modern, scalable frameworks. The frontend is typically built with React Native (Expo) for mobile applications, and Next.js or Vite/React for web platforms. The backend is powered by Node.js, Express, and Supabase. For styling, NativeWind (Tailwind) is used in React Native projects, prioritizing clean and reusable components. 

The design aesthetic is defined as "Technical Glassmorphism" and "High-Fidelity Detail," utilizing a color palette that features Deep Navy, Vibrant Amber, and Emerald accents. Furthermore, the brand actively integrates AI for development speed, as seen in projects like Kingly and Queens Connect, but carefully avoids adopting an "AI influencer" hype tone in its messaging.

## 6. AI Agent Rules & Hygiene

The repositories contain strict rules for AI assistants, documented in `.agents/rules.md`. These rules mandate that AI tool changes, such as those in `.agents` or `.claude` directories, must be bundled together logically in commits. Additionally, the AI is required to act as a "Brutal Bullshit Detector," appending a short, brutally honest commentary at the end of every response to rate the "bullshit level" and suggest a sharp follow-up question. Finally, all output must strictly align with Ayabonga's Senior Product Engineer persona and the broader African tech context.

# CURSOR PROMPT — Ayabonga Qwabi Full Site Design System
### Large Type · Kinetic Scroll · Editorial Layout · All Pages

> This document is the single source of truth for implementing the full site design.
> Hand it to Cursor as a task reference. Every page type has its own specification.
> The homepage spec lives in `CURSOR-HOMEPAGE-PROMPT.md`. This doc covers everything else.

---

## DESIGN SYSTEM INHERITANCE

All pages share the same foundation from the homepage prompt:
- Same CSS custom properties (colors, type scale, easings)
- Same font stack (Clash Display + Outfit + Space Grotesk)
- Same GSAP animation utilities from `lib/animations.ts`
- Same Lenis smooth scroll
- Same PageCurtain transition
- Same custom cursor

**The difference between pages is intensity.** The homepage is a 10. The blog index is a 7. A blog post is a 5. The about page is an 8. The rule: the further you are from a conversion moment, the more the design can breathe and be expressive.

---

## PAGE INTENSITY SCALE

| Page | Intensity | Primary Visual Language |
|---|---|---|
| `/` Homepage | 10 | Full kinetic, cinematic, all effects live |
| `/about` | 8 | Expressive editorial, strong type, story-driven |
| `/blog` index | 7 | Magazine grid, large type, hover-rich |
| `/blog/:slug` | 5 | Expressive but readable, editorial post layout |
| `/services` | 7 | Bold claims, scroll reveals, clear conversion |
| `/technical-cofounder` | 8 | TaaS landing — persuasive, animated, direct |
| `/get-a-quote` | 4 | Functional-first, clean, trust-building |
| `/solutions/:slug` | 6 | Programmatic but designed, not generic |
| `/vs/:slug` | 6 | Confident, direct, comparison-focused |
| `/developers/...` | 5 | Helpful, clear, locally relevant |

---

## SHARED COMPONENTS (build once, use everywhere)

### `components/layout/SiteNav.tsx`

The navigation is *the same on every page* — just different active states.

**Spec:**
- Position: `fixed`, `top: 0`, `width: 100%`, `z-index: 1000`
- Background: `transparent` on load → `rgba(6, 14, 28, 0.85)` + `backdrop-filter: blur(20px)` after scrolling 80px
- Left side: `AQ` monogram in Clash Display, `var(--gold)`, `font-size: 24px`
- Right side: nav links + two CTA buttons
- Nav links: Outfit, uppercase, `var(--tracking-label)`, `font-size: 13px`, color `var(--muted)` default → `var(--warm-white)` on hover
- Hover state: an underline that draws in left-to-right using `::after { scaleX: 0 → 1 }` on hover, `150ms ease-out`
- Active page link: `var(--warm-white)` always, permanent underline
- CTA "Blog": outline button, `var(--gold)` border + text, `font-size: 13px`
- CTA "Get a Quote": solid `var(--emerald)` background, `var(--navy-dark)` text
- Mobile: hamburger icon (3 lines → X on open). Opens a fullscreen overlay (see below).

**Mobile Menu Overlay:**
- Background: `var(--navy-dark)` full screen
- Nav links displayed at `--type-display-md` size, stacked vertically
- Each link: line-reveal animation staggered 0.08s on open
- Close button top-right
- Links in `var(--warm-white)` except active in `var(--gold)`

---

### `components/layout/SiteFooter.tsx`

**Spec:**
- Background: `var(--navy-dark)` (deepest dark, matches CTA section)
- Top section: Large "AQ" monogram in outline — `var(--font-display)`, `font-size: clamp(100px, 20vw, 300px)`, `-webkit-text-stroke: 1px rgba(255,215,0,0.15)`, `color: transparent`. It sits behind the footer content, partially cropped.
- Content sits on top: tagline left, newsletter/CTA right
- Footer nav links: two rows as per your existing structure
- Legal: Privacy · Editorial · Corrections — tiny, `var(--muted)`
- Social icons: GitHub, LinkedIn — minimal, 24px, color `var(--muted)` → `var(--warm-white)` on hover
- Bottom bar: copyright line, site version, "Built by Ayabonga Qwabi" — all in `--type-label` size

**Animation:** The giant `AQ` behind the footer does a slow parallax drift (moves slightly upward as user scrolls to footer) using `scrollMarquee` utility.

---

### `components/ui/ReadingProgress.tsx`

A thin horizontal progress bar at the very top of the page (below nav), tracking scroll progress.

```tsx
// Only rendered on /blog/:slug pages
// A 2px tall bar, background var(--gold), grows from 0% to 100% width as user scrolls
// scaleX: 0 → 1, transform-origin: left, linked to Lenis scroll progress
```

---

### `components/ui/ScrollIndicator.tsx`

Used on pages with long content to signal scrollability. A vertical line with a small dot that bounces downward, then fades out after first scroll.

---

## `/about` — About Page

### Concept

The About page is a personal manifesto told in scroll chapters. It uses the same expressive typography as the homepage but the *content* is the star — this is where personality, story, and values live.

### Structure

**Section 1 — About Hero**
```
Background: var(--navy)
Full viewport height

Content:
[LARGE LABEL]   "ABOUT" — outline text, var(--type-display-xl), very large, partially cropped
                at the bottom. Treated as background decoration not foreground content.

[FOREGROUND]    Left-aligned, vertical center:
  - Name: "Ayabonga Qwabi" — Clash Display, --type-display-lg, warm white
  - Title: "Senior Product Engineer." — same size, OUTLINE text (gold stroke)
  - Two-line summary: "I build things that matter. I think in systems. I work from Emalahleni."
    Space Grotesk, --type-body, var(--muted), max-width 520px

[IMAGE]         Your square image — right side, clipped to a tall rectangle
                mix-blend-mode: luminosity on a navy layer = duotone brand treatment
                Clip-path reveal animation on page load (not scroll-triggered)
```

**Section 2 — Origin Story**
```
Background: var(--warm-white) — light section
Color: var(--navy)

Layout: Two columns. Left: large pull-number "01". Right: heading + body.
  - Section number: "01" — Clash Display, --type-display-lg, var(--gold), outline style
  - Heading: "Where I come from." — --type-display-md, tight, dark navy
  - Body: 2–3 paragraphs, --type-body, 680px max-width, generous line-height

Word-reveal animation on scroll for the heading. Body fades in as a block.
```

**Section 3 — Philosophy**
```
Background: var(--navy)
This is the expressive section — no columns, just a statement.

A massive block-quote style paragraph:
  "I've never believed that good engineering is about writing clever code.
   It's about solving the right problem, at the right time, with the right tradeoff."

Font: Clash Display, --type-display-md, line-height: 1.15
Color: var(--warm-white)
A gold highlighted word: "right tradeoff" — color var(--gold)

Word-by-word reveal on scroll, stagger 0.04s, power2.out ease.

Below the quote: a horizontal rule (1px, gold, 20% opacity) then a 2-line bio in body font.
```

**Section 4 — Values (Three Cards)**
```
Background: var(--slate)

Section header: "HOW I WORK" — small, uppercase, tracked wide, gold

Three large text blocks, staggered layout (not a neat grid):
  Each block:
  - Number: "01", "02", "03" in var(--gold), outline style, --type-display-md
  - Value title: --type-heading-lg, warm white
  - Short description: 2 sentences, body font, muted

  Layout: 01 is left-aligned, 02 is right-aligned (pushed right by 20%),
          03 is left-aligned with extra-top margin. Asymmetric, editorial.

Staggered scroll reveal: each block animates in as it enters viewport.
```

**Section 5 — Experience / Timeline**
```
Background: var(--navy-dark)

A horizontal scroll section (pin + scrub) OR a vertical list depending on preference.

Recommended: Vertical stacked list.
  - Each entry: Year range (outline, large) + Role title (large) + Company + 1-line note
  - Very minimal. Let the typography be the UI.
  - A thin vertical timeline line on the left in var(--gold), 20% opacity.
  - Each entry fades in with a slight x-translate as it enters view.
```

**Section 6 — CTA**
```
Identical to homepage CTA section — gold background, dark text, two buttons.
Headline variant: "Let's work together."
```

---

## `/blog` — Blog Index Page

### Concept

This is the page that most developers phone in. For you, it's a **magazine front cover and table of contents** — a full editorial experience with expressive type, varied card sizes, and a scroll experience that makes people want to read.

Think: *The Verge* meets *Offscreen Magazine* meets *early Medium* — but yours.

### Structure

**Section 1 — Blog Hero**
```
Background: var(--navy-dark)
Height: 65vh (not full — this is an index, content matters more than spectacle)

Content:
  Left side:
    - "THINKING" — Clash Display, var(--type-display-xl), outline style (gold stroke),
      partially overflowing beyond the section boundary. This IS the visual.
    - Below: "Writing on engineering, systems, and building in Africa."
      Space Grotesk, --type-body, var(--muted)

  Right side (desktop only):
    - Three category chips: "Engineering" · "Systems" · "Africa"
    - Each a pill shape, border 1px gold, transparent bg, gold text, --type-label size
    - On click: filters the post list (existing query param functionality)

Animation:
  - "THINKING" does the masked line-reveal on page load
  - Subtitle: word-reveal with 0.3s delay after headline
  - The text overflows deliberately — this sets the editorial tone
```

**Section 2 — Featured Post (First / Latest)**
```
Background: var(--navy) — slightly lighter than hero

This is a full-width showcase of the most recent or featured post.
No card. A magazine-spread layout:

  Left (60% width):
    - Category label: uppercase, tracked, gold, --type-label
    - Post title: Clash Display, --type-display-md, warm white, tight tracking
    - Excerpt: 2 sentences, Space Grotesk, muted, max-width 540px
    - Read time + date: small, muted
    - CTA: "Read →" in gold, no underline, small caps

  Right (40% width):
    - Post category or abstract: a large outlined number (01) or decorative element
    - OR: if the post has a featured image, use it with duotone treatment

  On hover: the entire section gets a subtle background shift to var(--slate).
  Post title shifts right by 4px, `200ms ease-out`.

Animation: Line-reveal on section scroll-trigger. Stagger 0.1s between elements.
```

**Section 3 — Post Grid (Remaining Posts)**
```
Background: alternates var(--navy) and var(--slate) per group of posts, creating rhythm

Layout: NOT a uniform grid. Use a CSS Grid with named areas:

Desktop (3 posts per row):
  Row 1: [LARGE card spanning 2 cols] [SMALL card 1 col]
  Row 2: [SMALL card 1 col] [LARGE card spanning 2 cols]
  Row 3: [SMALL] [SMALL] [SMALL] — standard 3-col
  ...alternates

Mobile: single column stack.

Each post card:
  - No image by default (typography-first design)
  - Category label: --type-label, uppercase, gold
  - Title: Clash Display or Outfit Bold, --type-heading-md (small cards) or --type-heading-lg (large cards)
  - Excerpt: 1 sentence, Space Grotesk, muted (large cards only)
  - Date + read time: --type-label, muted
  - Bottom: a thin gold line (1px, 15% opacity) as separator

LARGE card variant:
  - Title at --type-display-md — this is a statement, not a label
  - Excerpt visible
  - Optional: a large outlined number in the background (post index number)

Hover state on all cards:
  - Background shifts from transparent to a very subtle gold tint (rgba(255,215,0,0.03))
  - Title slides right by 6px
  - A gold left-border slides in from top (scaleY: 0 → 1, 200ms ease-out)
  - Cursor changes to the "READ" custom cursor variant

Scroll animation: Cards stagger in (opacity 0→1, y 20→0) as the grid enters viewport.
Stagger: 0.08s between items, triggering from the first visible row.
```

**Section 4 — Category Navigation Strip**
```
Background: var(--gold) — use the gold section sparingly and powerfully

Dark navy text. A horizontal strip:
  "FILTER BY TOPIC:" label + clickable category pills
  Active category: navy background + warm white text (inverted)
  
  This strip is sticky within its scroll context — stays visible while browsing.
```

**Section 5 — Newsletter / Subscription**
```
Background: var(--navy-dark)

A single bold line: "Get the thinking." — --type-display-md, warm white
Subline: "New posts on engineering, systems, and product building in South Africa."
Email input + Subscribe button — minimal, refined.
```

---

## `/blog/:slug` — Individual Blog Post Page

### Concept

This is where expressive design *serves reading* rather than competing with it. The post page has three distinct zones:

1. **The Header** (expressive, full intensity) — makes an impression before reading begins
2. **The Body** (clean, optimized for long-form reading) — typography serves the words
3. **The Exit** (re-engagement) — pulls the reader into more content

### Section 1 — Post Header

```
Background: var(--navy-dark)
Height: 70-80vh

Layout:
  - Category + read time at very top: --type-label, uppercase, tracked, gold
  - POST TITLE: Clash Display, var(--type-display-lg), warm white, tight tracking
    Line-height: var(--leading-editorial) = 1.08
    Max-width: 900px — let long titles wrap naturally, the wrapping IS part of the design
  - Published date + author line: Space Grotesk, --type-body, muted
  - A horizontal rule: 1px, gold, 20% opacity, full width

  Bottom of header:
    - A short author callout: small avatar placeholder (initials in a circle) + "By Ayabonga Qwabi"
    - Reading time estimate
    - Share icons (3 max: X/Twitter, LinkedIn, Copy Link)

Animation (on page load, after curtain exit):
  - Category label: scramble-decode, 0.2s delay
  - Title: masked line-reveal, 0.4s delay, stagger 0.08s per line
  - Author/date row: fade-up, 0.9s delay
```

**Reading Progress Bar:** A `2px` gold horizontal bar at the very top of the viewport (fixed), tracks scroll progress from 0% to 100% of the post body. Start it off at 0 width, grow as user reads.

### Section 2 — Post Body

```
Background: var(--navy) — slightly lighter than header for visual separation
Max content width: 680px
Centered with generous padding

Typography (this is the product layer — readability is king):
  - Body text: Space Grotesk, 17px, line-height: 1.72, color: #C8D3E0 (slightly blue-white, easier on eyes against navy)
  - H2: Outfit Bold, 28-36px, warm white, margin-top: 2.5em
  - H3: Outfit SemiBold, 22-26px, warm white, margin-top: 2em
  - Links: gold color, no underline by default, underline on hover
  - Blockquotes: left border 3px solid var(--gold), padding-left 24px,
                 font-size 1.15em, italic, color var(--warm-white)
  - Code inline: Space Grotesk Mono fallback, background var(--slate), gold text, padding 2px 6px, border-radius 4px
  - Code blocks: full-width, dark background (var(--navy-dark)), syntax highlighted, border-left 3px solid var(--emerald)

DROP CAP on first paragraph:
  The opening letter of the article is a drop cap.
  Font: Clash Display, color: var(--gold), float: left, font-size: 5em, line-height: 0.8
  This is an editorial touch that signals "this is a serious, craft piece"

Image handling (if post has images):
  - Full-width images (breaking out of the 680px content column) by default
  - Duotone treatment: mix-blend-mode + navy overlay
  - Caption below in --type-label size, muted, centered
  - On scroll into view: clip-path reveal from bottom

Post body animations (VERY SUBTLE — reading mode):
  - NO split text on body paragraphs. Zero. Paragraphs just exist.
  - H2/H3 headings: a very subtle fade-up (y: 8px → 0, opacity: 0 → 1, 400ms ease-out) on scroll
  - Blockquotes: a gentle fade-in as they enter viewport
  - Code blocks: fade-in from left (x: -12px → 0) as they enter view
  - Nothing else moves.

Sidebar (desktop, sticky):
  Position: fixed right side, 240px wide, starts at top of body section
  Contents:
    - "ON THIS PAGE" label
    - Auto-generated table of contents from H2/H3s
    - Active section highlighted in gold
    - Newsletter signup below (compact)
  
  Mobile: Collapsible accordion above body section
```

### Section 3 — Post Exit

```
Background: var(--slate)

Three parts:

[AUTHOR BIO]
  Horizontal layout: Large initials circle (or photo) left + bio text right
  Name: Outfit Bold, --type-heading-md
  1-paragraph bio, body font
  Links: GitHub, LinkedIn — small, gold

[NEXT/PREV POST]
  Two side-by-side large text links:
    ← Prev: [Post Title] in --type-heading-md
    Next: [Post Title] → in --type-heading-md
  Both do the hover right-shift micro-interaction

[RELATED POSTS]
  Header: "KEEP READING" in large outline text, gold stroke
  3 post cards using the SMALL variant from the blog index
  Stagger-in on scroll entry
```

---

## `/services` — Engineering Services Page

### Concept

This is a services page but it should feel like a capabilities manifesto — confident, direct, and technically authoritative. Every service is positioned as a strategic offering, not a commodity.

### Structure

**Section 1 — Services Hero**
```
Background: var(--navy-dark)
Height: 80vh

Left:
  - Eyebrow: "CAPABILITIES" — --type-label, tracked, muted
  - Headline: "Engineering services built for momentum." — Clash Display, --type-display-lg
  - Subline: "Not project shops. Not junior-dev lotteries. Senior technical partnership." — body font, muted

Right (desktop):
  - A large vertical list of service names stacked, each in outline text
  - They sit at an angle (-3deg rotation), acting as decorative type
  - Opacity: 0.15 — purely atmospheric

Animation: Title does masked line-reveal on load. Right side fades in at 0.6s.
```

**Section 2 — Service Detail List**

For each service (4 total from your data):
```
Alternating background: navy and slate

Service block layout:
  - Large number: "01" in outline gold, --type-display-md
  - Service name: Clash Display, --type-display-md, warm white
    On the FIRST service, this is huge (--type-display-lg). Others are --type-display-md.
  - Tagline: 1 sentence, --type-heading-md, muted
  - What's included: 3-5 bullet points in body font
    Each bullet: emerald dot + text. No excessive padding.
  - Ideal for: 1 short line, italic, muted
  - CTA: "Discuss this →" — gold text link, no button box

On scroll into viewport: Number does a count-up from 00. Title does line-reveal.
Hover on entire block: subtle gold left-border slides in.
```

**Section 3 — How We Work (Process)**
```
Background: var(--navy)

Section label: "THE PROCESS" — outline text, large, background decoration
Foreground: 4 numbered steps in a HORIZONTAL scroll section

Each step card:
  - Step number + phase name as the primary type
  - 2-3 sentence description
  - A thin connecting line between cards (horizontal arrow or dashed line)

This section is PINNED while user scrolls through the 4 steps.
GSAP ScrollTrigger: pin: true, scrub: 1. Cards animate in from right as user scrolls.
```

**Section 4 — Pricing Philosophy**
```
Not a pricing table. A statement.

Background: var(--gold) — use the gold section
Text: var(--navy-dark)

Large headline: "Project-based. Retainer-based. Direct."
One short paragraph on the pricing approach.
CTA: "See cost ranges →" linked to /get-a-quote
```

**Section 5 — CTA**
Standard, same as homepage CTA section.

---

## `/technical-cofounder` — TaaS Landing Page

### Concept

This is your highest-stakes landing page. Founders land here with a specific pain. The design should feel urgent, intelligent, and like the person writing it *gets it.* Maximum intensity for a landing page (8/10).

### Structure

**Section 1 — TaaS Hero**
```
Background: var(--navy-dark)
Full viewport height

Eyebrow: "TECHNICAL CO-FOUNDER AS A SERVICE" — gold, tracked
Headline (two lines):
  Line 1: "You have the vision." — --type-display-lg, outline text
  Line 2: "I have the architecture." — --type-display-lg, filled warm white

These two lines animate in sequence:
  Line 1 enters first (line-reveal, 0.4s delay)
  Line 2 enters second (line-reveal, 0.2s after line 1)

A horizontal separator line between them — 1px gold, 40% opacity, animates from 0 width to full width.

Subline:
  "Stop burning runway on teams that can't own the outcome.
   Get a senior engineer with a founder's mindset."
  Body font, muted, max-width 560px. Appears at 0.9s.

CTA row (appears at 1.2s):
  Primary: "Book a discovery call" — emerald button
  Secondary: "See how it works →" — text link in gold

Proof below CTAs:
  Three micro-stats: "5+ products shipped", "12 startups served", "ZAR-based pricing"
  Each: number in gold, label in muted. Separated by dividers.
```

**Section 2 — The Problem (Pain Points)**
```
Background: var(--slate)
Section header: "THE PROBLEM WITH HOW YOU'RE BUILDING" — large, line-reveal on scroll

Three pain points in a stacked list:
  Each: A large number (01, 02, 03) in gold outline + Problem statement in --type-heading-lg
  Below each: 2-sentence description in body font

The three problems are classic:
  - "Junior devs who learn on your dime"
  - "Agencies that disappear after handoff"  
  - "CTOs who've never shipped at speed"

Animation: Each pain point slides in from bottom as user scrolls.
```

**Section 3 — The Solution**
```
Background: var(--navy)
A PINNED section with scrub animation:

As user scrolls, three cards reveal one by one:
  Each card: what TaaS provides (Ownership / Speed / Depth)
  When fully revealed: all three are visible side-by-side

Card design: var(--slate) background, gold accent, Clash Display title
```

**Section 4 — Case Studies / Social Proof**
```
Background: var(--navy-dark)

Testimonials and case study references.
Layout: Large testimonial takes 70% width. A sidebar shows client names/logos at 30%.
Testimonial quote in Outfit Italic, --type-heading-lg.
Attribution below: name, company, role — small, muted.
```

**Section 5 — Final TaaS CTA**
```
Gold background section.
"Ready to stop the lottery?" as the headline.
Single primary CTA: WhatsApp.
```

---

## `/get-a-quote` — Interactive Quote Tool

### Concept

Intensity: 4/10. This is a *tool* not a showcase. The design should feel clean, precise, and trustworthy. Small moments of brand personality, but the focus is usability and completing the form/flow.

### Design Rules

```
Background: var(--navy) for the page wrapper
Form container: var(--slate), border-radius: 12px, subtle border: 1px solid rgba(255,215,0,0.12)

Typography:
  - Section headers in Clash Display, --type-heading-lg
  - Labels in Outfit, --type-label, uppercase, tracked
  - Input text: Space Grotesk, --type-body

Inputs:
  - Background: var(--navy-dark)
  - Border: 1px solid var(--slate)
  - Focus: border-color shifts to var(--gold), a subtle gold glow (box-shadow)
  - Transition: 150ms ease-out

Progress indicator at top (if multi-step):
  - A step counter: "Step 2 of 4" in --type-label
  - A thin progress bar below it in var(--gold)
  - Very clean. No animations on the steps themselves — this is function.

Buttons:
  - "Next →" : var(--emerald) background
  - "Back" : transparent, gold border
  - "Submit" : var(--gold) background, var(--navy-dark) text — the reward

The ONLY animation on this page:
  - Each form step transitions with a gentle slide: current step slides left and fades,
    new step slides in from right. Duration: 300ms ease-out.
  - Success state: a checkmark animation (simple CSS circle-draw) + a line-reveal for
    the confirmation message. This is the one moment of delight on the page.
```

---

## `/solutions/:slug` — pSEO Solution Pages (12 pages)

### Concept

These are programmatically generated pages. The risk: they feel generic. The fix: apply the design system aggressively so they feel designed even if content is templated.

### Template Structure

**Section 1 — Solution Hero**
```
Same component as Services hero, but content comes from the solution data:
  - Category: "SOLUTION FOR" — gold, tracked label
  - Headline: solution.headline — Clash Display, --type-display-lg
    Line-reveal animation fires on page load

  - Subline: solution.subheadline — body font, muted
  - CTA: "Get a quote →" — gold text link + "Book a call" — emerald button

The background: same dark navy. But add a subtle decorative element unique to each page:
  A large, very low-opacity (5%) version of the industry keyword in outline text.
  E.g., for fintech: "FINTECH" in giant outline letters behind the hero content.
  This is atmospheric, not content. Helps differentiate pages visually.
```

**Section 2 — The Challenge (Pain Points)**
Template: 3 industry-specific challenges, same layout as TaaS pain points section.

**Section 3 — The Solution**
Template: 3 value propositions with icons/numbers, standard scroll-reveal.

**Section 4 — Mini Case Study Reference**
One relevant project reference with a quote, if applicable.

**Section 5 — CTA**
Standard gold CTA section with industry-relevant headline variant.

---

## `/vs/:slug` — Comparison Pages (5 pages)

### Concept

These are direct comparison pages. The design should feel confident and authoritative — like you're stating facts, not defending yourself. No aggressive "we're better" energy. Just clarity.

### Template Structure

**Section 1 — Comparison Hero**
```
Background: var(--navy-dark)
Headline: comparison.headline — e.g., "Technical Co-founder vs. Agency" — line-reveal
Subline: "Here's what actually matters." — body, muted
```

**Section 2 — The Comparison Table**
```
NOT a standard HTML table. A visual, editorial layout:

Left column (header): "WITH AYABONGA" — emerald accent
Right column (header): "WITH [COMPARISON]" — muted, var(--slate) text

Each row:
  - Feature/dimension in center (label style)
  - Left: green checkmark + statement in body font
  - Right: red circle + statement in body font (or just muted text)
  
  Each row fades in on scroll, staggered 0.1s.

Bottom of section: A summary statement in --type-heading-lg: 
  "The difference is ownership." or similar.
  Line-reveal on scroll.
```

**Section 3 — CTA**
Standard, with comparison-relevant headline.

---

## `/developers/south-africa` & `/developers/eastern-cape` — Hub Pages

### Concept

These pages are part of your local SEO strategy. Design them to feel like genuinely useful local resources — not thin SEO pages. The design is clean, helpful, editorial. Intensity: 5/10.

**Structure:**

```
Section 1 — Local Hub Hero:
  Headline: "Software Development in [Region]" — Clash Display, --type-display-md
  Subline: 1-2 sentences about the local tech scene
  A soft pattern background: subtle diagonal lines or a grid in var(--slate) at 20% opacity

Section 2 — Local Context:
  A short editorial section about engineering in that region.
  Body font. Real content. Not filler.

Section 3 — Services Grid:
  Links to city/role combination pages in a clean grid.
  Each cell: Role name + City in Outfit Bold, hover state in gold.

Section 4 — CTA:
  Standard. Headline: "Building in [Region]? Let's talk."
```

**City/Role pages (`/developers/eastern-cape/:city/:role`):**
These are leaf pages (40 total). Apply the hub page template but with city/role-specific content.

---

## `/developers/eastern-cape/:city/:role` — Local Leaf Pages

These are highly templated. The key principle: they must NOT feel like they were machine-generated. Apply the following:

- Hero headline uses the actual city and role with proper capitalization and rhythm
- One hand-written (not templated) sentence about that specific city in the intro
- Services section remains consistent
- CTA is consistent
- No decorative text backgrounds on these — keep them clean and fast

---

## PAGE TRANSITIONS — FULL SYSTEM

Every navigation between pages uses the PageCurtain component.

**Routing with transitions (React Router / Next.js):**

```tsx
// In your router config, wrap routes with the transition logic
// On link click:
// 1. Curtain slides DOWN over the current page (scaleY: 0→1 from top, 500ms, power3.inOut)
// 2. After 500ms: route changes
// 3. New page mounts: curtain slides UP revealing the page (scaleY: 1→0 from top, 600ms, power3.inOut)
// 4. Page entrance animations fire

// The curtain color matches the destination page for a seamless feel:
// → Navigating to /about: curtain is var(--navy)
// → Navigating to /blog: curtain is var(--navy-dark)  
// → Navigating to /get-a-quote: curtain is var(--slate)
```

**Scroll position on transition:** Always reset to top of page on navigation. Do NOT restore scroll position.

---

## ANIMATION CONSISTENCY TABLE

This table defines exactly which animation pattern fires where. Use it to avoid both under-animating (boring) and over-animating (chaotic).

| Element | Pattern | Duration | Trigger |
|---|---|---|---|
| Page hero headline | Masked line-reveal | 1.1s, stagger 0.1s | On load, after curtain exit |
| Section headlines (h2) | Line-reveal | 0.9s, stagger 0.08s | ScrollTrigger, start "top 85%" |
| Body headings (h3) | Fade-up (y:8 opacity) | 0.4s | ScrollTrigger, start "top 90%" |
| Manifesto/large paragraph | Word-wave | 0.75s, stagger 0.04s | ScrollTrigger |
| Category labels | Scramble-decode | 1s | On load, delay 0.2s |
| Post cards (grid) | Stagger fade-up | 0.5s, stagger 0.08s | Section entry |
| Images | Clip-path reveal | 1.2s | ScrollTrigger |
| Numbers/stats | Count-up | 1.5s | ScrollTrigger |
| Service blocks | Line-reveal + fade | 0.9s | ScrollTrigger |
| Body paragraphs | NONE | — | Static |
| Nav hover | Underline scaleX | 0.15s | :hover |
| Button hover | Scale 1.02 | 0.15s | :hover |
| Card hover | translateY -6px | 0.2s | :hover |
| Gold CTA button | — | — | Static (no animation needed) |
| Footer AQ monogram | Parallax drift | scrub:1 | ScrollTrigger |

---

## PERFORMANCE TARGETS

| Metric | Target |
|---|---|
| LCP (Largest Contentful Paint) | < 2.0s (text-first) |
| CLS (Cumulative Layout Shift) | < 0.05 |
| FID / INP | < 100ms |
| Lighthouse Performance (desktop) | ≥ 92 |
| Lighthouse Performance (mobile) | ≥ 75 |
| JS bundle (initial) | < 250kb gzipped |
| Animation jank | 0 dropped frames on mid-range Android |

**To hit these:**
- Preload Clash Display (woff2) in `<head>` with `rel="preload"`
- Use `font-display: swap` on all web fonts
- Lazy-load all GSAP plugins after first paint
- Intersection Observer for scroll triggers (not constant scroll listener)
- `will-change: transform` applied only during active animations, removed after
- Image assets: WebP, max 300kb for above-fold, lazy-load everything else

---

## ACCESSIBILITY CHECKLIST (per page)

- [ ] All animated headlines have `aria-label` on parent (GSAP SplitText handles this if using its built-in aria option)
- [ ] All animations respect `prefers-reduced-motion` media query
- [ ] Reading progress bar is `role="progressbar"` with `aria-valuenow`
- [ ] Custom cursor has a fallback (if CSS pointer: none, ensure normal cursor shows for keyboard users)
- [ ] All color combinations meet WCAG AA contrast (4.5:1 body, 3:1 large text)
- [ ] Gold (#FFD700) on Navy (#0A192F) — passes AA for large text ✓
- [ ] Gold (#FFD700) on Navy (#0A192F) — check AA for body text (may need gold-dim #C9A900)
- [ ] All interactive elements have visible `:focus` rings
- [ ] Skip-to-content link at the very top of every page
- [ ] Blog post has proper heading hierarchy (one H1, logical H2/H3)
- [ ] Images have descriptive alt text
- [ ] Lenis smooth scroll does not block keyboard Tab navigation

---

## IMPLEMENTATION ORDER

Build in this sequence. Each step produces something shippable:

**Phase 1 — Foundation (before any page work)**
1. Global CSS custom properties + font imports
2. GSAP + Lenis setup + `lib/animations.ts` utility functions
3. `SiteNav.tsx` with mobile overlay
4. `SiteFooter.tsx`
5. `PageCurtain.tsx` + router integration
6. Custom cursor component

**Phase 2 — High-Value Pages First**
7. Homepage (from `CURSOR-HOMEPAGE-PROMPT.md`)
8. `/blog` index
9. `/blog/:slug` post template
10. `/about`

**Phase 3 — Conversion Pages**
11. `/technical-cofounder` TaaS landing
12. `/services`
13. `/get-a-quote`

**Phase 4 — SEO Pages (template work)**
14. `/solutions/:slug` template
15. `/vs/:slug` template
16. `/developers/...` hub + leaf page templates

---

*This is the complete design specification for qwabi.co.za. Every page has a purpose, every animation has a reason, and every typographic decision communicates something about who Ayabonga is and how they think.*

*The site, taken as a whole, should feel like a single authored work — not a collection of pages.*

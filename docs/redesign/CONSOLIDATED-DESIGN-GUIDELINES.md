# Ayabonga Qwabi — Consolidated Design Guidelines
### Synthesized from 5+ expert sources per category · 2025–2026

---

## ⚠️ What Went Wrong With The Previous Guidelines

Your existing docs were a good start but suffered from three problems:
1. **Generic advice** — copied from broad "web design tips" articles, not opinionated enough
2. **Contradictions** — the animation guide said "subtle and restrained" while the homepage guide said "kinetic and expressive." Both are right but they speak to different layers of the site.
3. **No implementation hierarchy** — no clear distinction between the *marketing layer* (homepage, landing pages) and the *product layer* (dashboard, docs, blog reading).

These consolidated guidelines fix all three.

---

## TABLE OF CONTENTS
1. [Design Philosophy & Layer Model](#1-design-philosophy--layer-model)
2. [Homepage & Large Type Design](#2-homepage--large-type-design-the-big-one)
3. [Animation System](#3-animation-system)
4. [Typography System](#4-typography-system)
5. [Brand & Visual Identity](#5-brand--visual-identity)
6. [Landing Page Conversion Design](#6-landing-page-conversion-design)
7. [Blog Design](#7-blog-design)
8. [Image Placement & Visual Strategy](#8-image-placement--visual-strategy)

---

## 1. Design Philosophy & Layer Model

**Sources synthesized:** Figma Web Design Trends 2026, Line25 Definitive Trends Guide, UX Pilot 2025 Trends, Bubble.io Design Trends, Orbix Studio Trends Report

### The Two-Layer Rule

Every page on your site belongs to one of two layers. The rules are *different* for each:

| Layer | Pages | Visual Goal | Typography | Motion |
|---|---|---|---|---|
| **Marketing Layer** | Homepage, landing pages, hero sections | Make a statement, create desire, demonstrate craft | Giant, expressive, kinetic | Aggressive, scroll-driven, cinematic |
| **Product Layer** | Blog posts, docs, dashboards, case studies | Build trust, communicate clearly, reduce friction | Clean, readable, functional | Subtle micro-interactions only |

Never mix layers. A homepage that reads like a doc page is forgettable. A blog post that animates every word is unreadable.

### The Governing Principle

> *Typography is the product.* On the marketing layer, text is not content — it is the visual. Design it like a poster, not a document.

### What This Means for Ayabonga

- **Homepage:** Typography-first editorial design. Oversized. Kinetic. Expressive. Uses typography to communicate "senior engineer who thinks in systems, not just code."
- **Work/Projects:** Portfolio-style showcase. Let the work breathe. Strong type, restrained motion.
- **Blog posts:** Clean reading experience. Professional, intelligent. Type serves content, not the other way.
- **Contact/CTA sections:** Bold conversion design. Clear hierarchy. One action.

---

## 2. Homepage & Large Type Design (The Big One)

**Sources synthesized:** Line25 Definitive Guide 2026, Figma Web Trends 2026, Webflow Parallax Guide, Framer Parallax Examples, DesignModo Oversized Typography, Bubble.io Design Trends, Orbix Studio, Creative Bloq Kinetic Typography

### 2.1 The Core Philosophy

In 2026, type isn't just a vehicle for content — it is the content. Large-scale, expressive headlines that fill the viewport, sometimes clipped by the browser edge, have replaced the stock hero image as the default attention-grabber for design-forward brands.

Typography is taking center stage, moving beyond legibility into storytelling. Brands are using custom fonts, oversized headlines, motion, and layered styles to make bold first impressions. Hero sections now often feature kinetic lettering, dynamic font pairings, and variable fonts that respond to interaction or context.

### 2.2 Homepage Structure (Marketing Layer)

This is the exact section-by-section architecture for your homepage. Each section has a defined role. Do not reorder them.

**Section 1 — The Hero (Above the Fold)**
- Full-viewport. Instant impact. No scroll needed to understand what this is.
- Giant headline: your name or tagline at 180–400px on desktop. Not a title — a statement.
- Subheadline: a fraction of the size (contrast is everything). One sharp line.
- One subtle scroll indicator — not a CTA button. The whole page is the CTA.
- Motion: entrance sequence on load (characters assemble, lines slide up, opacity fades). Parallax layer between background and text on scroll.

**Section 2 — The Manifesto Line**
- A single massive line of text: your philosophy in one sentence.
- No subtext. No icons. Just the statement — enormous, possibly spanning multiple lines.
- This is a scroll-trigger moment: the text appears word-by-word or line-by-line as the user enters this section.
- Example: *"I build software that compounds in value, not complexity."*

**Section 3 — What I Do (Service Areas)**
- Large numbered headings (01, 02, 03). Oversized labels, minimal descriptions.
- Each item has a hover state: slight scale, background color shift, or a text reveal.
- Layout: broken grid — not a neat 3-column. Offset. Asymmetric. Editorial.

**Section 4 — Selected Work**
- Large project titles. Not thumbnails — type-led.
- Optional: image revealed on hover (cursor-following image, or fade reveal).
- Staggered entrance on scroll: titles slide in from bottom with stagger per item.

**Section 5 — Personality / About Teaser**
- Your square image used creatively: masked by text, clipped, or heavily treated.
- Large pull-quote about your approach.
- Minimal. Breathing room. Let the typography and image do the work.

**Section 6 — Social Proof / Credibility**
- Logos, a testimonial, a stat. Compact.
- Not a 2×2 grid. A single horizontal strip or a statement-style layout.

**Section 7 — Latest Writing**
- 2–3 blog post links. Titles large, dates small. Minimal but present.

**Section 8 — Final CTA**
- Full-width bold section: *"Let's build something."* or *"Ready to ship something that matters?"*
- Two options: WhatsApp (primary) and email (secondary).
- This section can use high contrast (gold on navy, or reversed).

### 2.3 Editorial Layout Principles

These are not suggestions — they are the defining characteristics of the aesthetic you're building:

**Broken Grid:** Elements deliberately escape their column. A headline that starts at grid column 2 but extends past column 6. An image that overlaps a text block.

**Asymmetry:** Left-heavy and right-heavy sections alternate. Not everything centered. Not everything left-aligned.

**Oversized Negative Space:** Let sections breathe. Generous padding (120px–240px vertical sections). Don't fill every pixel.

**Vertical Rhythm via Scale:** Hierarchy through size contrast, not color or weight alone. A 400px headline next to a 14px label creates more drama than two different font weights.

**Clipping and Cropping:** Text that gets cut off at the viewport edge. Text that hides behind an image. Text revealed by a clip-path animation on scroll.

**Mixed Axis Typography:** Some text rotated 90°. Some text tracking wide across the full width. Vertical labels alongside horizontal content.

### 2.4 The Parallax & Scroll Effect System

When the large text blends into changing images as you scroll, with backgrounds shifting and multiple layers at different scroll speeds, the parallax effect brings everything together — making the site visually stunning without being overwhelming.

Layer your scroll effects at three levels:

| Level | Elements | Speed Multiplier | Effect |
|---|---|---|---|
| Background | Gradient, grain texture, dark overlay | 0.3× scroll speed | Slow drift creates depth |
| Midground | Images, abstract shapes | 0.6× scroll speed | Standard parallax depth |
| Foreground | Text, UI elements | 1.0× (normal) | Anchored, readable |

Beyond basic parallax, add these trigger-based effects:

- **Scroll Progress Text:** Horizontal text that moves left or right as the user scrolls (marquee-style, scroll-linked). Shows as a section label or a repeated tagline.
- **Sticky Section Pinning:** Pin a section, animate content *within* it as the user scrolls past. GSAP ScrollTrigger `pin: true` with `scrub`.
- **Clip Path Reveal:** Images start masked (clip-path: inset(100% 0 0 0)) and reveal from bottom as section enters viewport.
- **Scale on Scroll:** A large background word (outline only) that scales from 80% to 100% as user scrolls through a section.

Scroll-driven reveals of product benefits with parallax resulted in 22% higher CTA clicks in tested implementations — the most impactful single animation pattern for engagement.

---

## 3. Animation System

**Sources synthesized:** Raw Studio Kinetic Typography 2025, Natha Studio Web Animation Trends, VA Web SEO Animation Guide, GSAP Vault Text Animation Guide, Codrops GSAP SplitText Demos, Annnimate GSAP SplitText Guide

### 3.1 The Hierarchy of Motion

Motion exists at four scales. Apply them differently across your site:

```
1. CINEMATIC  — Full section takeovers, scroll-pinned sequences, page transitions
                Used only on homepage. Maximum 2–3 per page.

2. REVEAL     — Elements entering the viewport (text lines, image clips, card slides)
                Used on all marketing pages. Every major section element.

3. AMBIENT    — Subtle perpetual motion (floating elements, scrolling marquees, gradient shifts)
                Used for atmosphere. One per section maximum.

4. MICRO      — Response to user input (hover, click, focus, cursor proximity)
                Used everywhere. This is where polish lives.
```

### 3.2 Split Text Animation Patterns

GSAP SplitText splits HTML elements into individual characters, words, and lines, allowing gorgeous staggered animations with automatic screen reader accessibility via aria-label on the parent and aria-hidden on child elements.

Use these four patterns with purpose, not randomly:

**Pattern A — Line Reveal (Masked)**
Each line of a headline slides up from behind an invisible mask. The most elegant and professional effect for hero text.
```js
SplitText.create(".headline", {
  type: "lines",
  mask: "lines", // Creates overflow-hidden wrapper per line
  onSplit(self) {
    return gsap.from(self.lines, {
      yPercent: 110, duration: 1, stagger: 0.12,
      ease: "power4.out",
      scrollTrigger: { trigger: self.lines[0], start: "top 85%" }
    });
  }
});
```

**Pattern B — Word Wave (Staggered Opacity + Y)**
Words fade and rise in sequence. Use for manifestos and paragraph reveals.
```js
gsap.from(split.words, {
  y: 30, opacity: 0, stagger: 0.04, duration: 0.7,
  ease: "power2.out",
  scrollTrigger: { trigger: el, start: "top 80%" }
});
```

**Pattern C — Character Scramble / Decode**
Characters randomize through glyphs then resolve to final text. Use for the site name on load or for label elements.
```js
// Use GSAP ScrambleTextPlugin — creates a techy, intelligent feel
gsap.to(".label", {
  scrambleText: { text: "AYABONGA QWABI", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  duration: 1.2, ease: "none"
});
```

**Pattern D — Variable Weight Morph**
Animate font-weight or font-variation-settings per character for a fluid morphing effect. Best for display headlines with variable fonts.
```js
// Requires a variable font (e.g., Cabinet Grotesk, Fraunces)
split.chars.forEach((char, i) => {
  gsap.to(char, {
    fontVariationSettings: "'wght' 900",
    duration: 0.6, delay: i * 0.04, ease: "power2.inOut",
    scrollTrigger: { trigger: char, start: "top 90%" }
  });
});
```

### 3.3 Custom Easing Standards

The stagger value controls the delay between each word. Lower values (0.02–0.05) create a fast wave. Higher values (0.1–0.2) create a deliberate, word-by-word read.

Define these custom easings in your animation system and use them consistently:

```js
// Register these once
CustomEase.create("smooth-enter", "0.16, 1, 0.3, 1"); // Snappy entry
CustomEase.create("editorial", "0.77, 0, 0.175, 1");  // Dramatic editorial
CustomEase.create("soft-out", "0.25, 0.46, 0.45, 0.94"); // Gentle, natural
CustomEase.create("hard-snap", "0.7, 0, 0.3, 1");     // Sharp & confident

// Use these as:
ease: "smooth-enter"  // Hero entrances
ease: "editorial"     // Scroll reveal headlines
ease: "soft-out"      // Micro-interactions
ease: "hard-snap"     // Section transitions
```

### 3.4 Micro-Interaction Standards

Define motion like typography: create rules, tokens, and usage patterns. Buttons should have 120–180ms hover/tap feedback. Modals: 240–360ms. Never animate text color only — low visibility.

| Element | Effect | Duration | Easing |
|---|---|---|---|
| Navigation links | Underline draw (scaleX 0→1) | 200ms | `ease-out` |
| CTA buttons | Slight scale (1→1.03) + background shift | 150ms | `ease-out` |
| Project cards | Y translate (-6px) + subtle shadow | 200ms | `ease-out` |
| Cursor | Custom cursor that morphs on hover over links | 100ms | `ease` |
| Section labels | Tracking expansion (letter-spacing) | 300ms | `ease-in-out` |
| Form fields | Border color + subtle glow | 150ms | `ease` |

### 3.5 Page Transition System

Use a curtain/overlay transition between pages:

1. User clicks a link → curtain slides in (vertical or diagonal wipe) covering the current page
2. New page loads
3. Curtain slides out revealing the new page
4. Entrance animations fire

```js
// Pseudo-implementation with GSAP + Barba.js
barba.hooks.before(() => {
  gsap.to(".page-curtain", { scaleY: 1, duration: 0.5, ease: "power3.inOut", transformOrigin: "top" });
});
barba.hooks.after(() => {
  gsap.to(".page-curtain", { scaleY: 0, duration: 0.5, ease: "power3.inOut", transformOrigin: "bottom" });
});
```

### 3.6 Performance & Accessibility Rules (Non-Negotiable)

- **Only animate `transform` and `opacity`** on GPU-accelerated layers. Never `width`, `height`, `margin`, `top`, `left`.
- **Always check `prefers-reduced-motion`** before registering any split text or scroll animation.
- **Use `will-change: transform`** on elements before animating, remove it after animation completes.
- **Lenis or native smooth scroll** — do not use `scroll-behavior: smooth` globally (it fights GSAP).
- **Test on a mid-range Android device.** If it stutters there, simplify.

```js
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReduced) {
  // register all heavy animations here
}
```

---

## 4. Typography System

**Sources synthesized:** Line25 Web Trends 2026, Creative Bloq Kinetic Typography, GSAP Text Guide, Figma Trends 2026, DesignModo Oversized Typography, UX Pilot 2025

### 4.1 Font Selection for Ayabonga

Your existing brand uses Outfit + Space Grotesk. These are good but not *expressive* enough for the homepage marketing layer. Use a **three-tier font system**:

| Tier | Role | Recommended Options | Usage |
|---|---|---|---|
| **Display** | Giant hero headlines, manifesto lines | Clash Display, Cabinet Grotesk, Neue Haas Grotesk Display, Aktiv Grotesk Ex | 120px–400px |
| **Interface** | Section headings, labels, navigation | Outfit (existing brand) | 14px–72px |
| **Body** | All readable prose | Space Grotesk (existing brand) | 15px–20px |

Variable fonts have made expressive typography even more dynamic. A single typeface file can express dozens of weights and widths, animating fluidly as users scroll or hover. The effect is both performant and visually rich. Tools to explore: Fraunces, Cabinet Grotesk, Clash Display, and Inter — all variable-font enabled with dramatic weight ranges.

**Google Fonts alternatives (free, expressive):**
- `Big Shoulders Display` — condensed, heavy, industrial
- `DM Serif Display` — elegant serif contrast paired with grotesk
- `Syne` — geometric, modern with display variant
- `Unbounded` — ultra-bold, geometric

### 4.2 Scale System

Use `clamp()` everywhere. No fixed pixel sizes for headlines.

```css
:root {
  /* Display — Hero Headlines */
  --type-display-xl: clamp(80px, 14vw, 260px);
  --type-display-lg: clamp(56px, 9vw, 160px);
  --type-display-md: clamp(40px, 6vw, 96px);

  /* Interface — Section headers, labels */
  --type-heading-lg: clamp(28px, 4vw, 56px);
  --type-heading-md: clamp(22px, 3vw, 36px);
  --type-label: clamp(10px, 1.2vw, 14px);

  /* Body */
  --type-body: clamp(15px, 1.6vw, 18px);

  /* Leading (line-height) */
  --leading-display: 0.9;  /* Tight — for giant headlines */
  --leading-editorial: 1.1; /* Slightly open — large text */
  --leading-body: 1.65;    /* Comfortable for reading */

  /* Tracking */
  --tracking-display: -0.03em;  /* Tight tracking for big type */
  --tracking-label: 0.15em;     /* Wide tracking for small labels */
  --tracking-body: 0;
}
```

### 4.3 Typography as Layout

These techniques turn text from content into design element:

**Full-Viewport Overflow Text:** Headline text that's intentionally too wide for the viewport — creates an editorial, non-web feel.
```css
.overflow-headline {
  font-size: var(--type-display-xl);
  white-space: nowrap;
  overflow: hidden;
  line-height: var(--leading-display);
}
```

**Outline / Stroke Type:** Alternating filled and outlined versions of the same word creates a layered, poster-like effect.
```css
.outline-text {
  -webkit-text-stroke: 2px var(--color-gold);
  color: transparent;
}
```

**Mixed Weight Within a Line:** One word heavy, the next thin, on the same line.
```html
<h1 class="mixed-weight">
  <span class="weight-900">Build</span>
  <span class="weight-100">products</span>
  <span class="weight-900">that</span>
  <span class="weight-100">scale</span>
</h1>
```

**Rotated / Vertical Type:** Section numbers or labels rotated 90° to the left, acting as a side axis label.

---

## 5. Brand & Visual Identity

**Sources synthesized:** Your existing brand-guidelines.md (strong foundation), Figma Trends 2026, Line25 Guide

Your existing brand guidelines are solid. These additions elevate them for the marketing layer:

### 5.1 Color System (Expanded)

Your existing palette stays. Add these marketing-layer variations:

```css
:root {
  /* Existing palette */
  --navy: #0A192F;
  --gold: #FFD700;
  --emerald: #059669;
  --slate: #1E293B;

  /* Added for homepage marketing layer */
  --navy-dark: #060E1C;        /* Hero section depth */
  --gold-dim: #C9A900;         /* Muted gold for secondary elements */
  --white-warm: #F5F0E8;       /* Not pure white — warmer, more editorial */
  --text-muted: #64748B;       /* Body copy in lighter sections */

  /* Grain overlay — applied via pseudo-element */
  --grain-opacity: 0.04;
}
```

### 5.2 Grain & Texture

Every high-end site in your reference set uses grain. It elevates flat colors to feel tactile and premium.

```css
/* Add to the body or hero section */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise pattern */
  opacity: 0.04;
  pointer-events: none;
  z-index: 9999;
}
```

### 5.3 Dark Mode as Default

Your brand navy is a dark background. **Dark mode is your default.** Light sections are used sparingly as contrast moments (e.g., a white section in the middle of the page creates rhythm and surprise).

---

## 6. Landing Page Conversion Design

**Sources synthesized:** Your existing landing-page-design-guide.md, homepage-hero-design-guide.md, GSAP animation data showing 22% CTA lift from scroll reveals, DesignModo, Webflow Blog

Your existing docs here are well-structured. Key improvements:

### What Changes

**Old approach:** Hero → Value Props → Social Proof → CTA

**Improved approach:**
1. **Hero** — Statement (not explanation). Big claim, primary CTA immediately.
2. **Evidence** — One scroll away. Numbers, logos, or a case study teaser. Compact.
3. **Mechanism** — *How* you work, not *what* you do. Short, visual, benefit-led.
4. **Social Proof** — Real quotes with real names. Not generic.
5. **Objection Handling** — FAQ, but styled as editorial copy, not an accordion.
6. **CTA** — Repeated with a slightly different angle. Urgency without manipulation.

### Animation on Landing Pages

- Scroll reveal on every section — but keep it to one type (e.g., all fade-up). Consistency over variety on conversion pages.
- Hero headline entrance: use the masked line-reveal (Pattern A above).
- CTA button: gentle pulse or a subtle border animation to draw the eye without being distracting.

---

## 7. Blog Design

**Sources synthesized:** Your existing blog-design-guide.md, Natha Studio Web Animation Trends, Figma Trends 2026, Creative Bloq Typography

Your existing blog guide is solid. These changes make it exceptional:

### Reading Experience (Product Layer)

- **Font:** Space Grotesk at 17–18px, 1.7 line-height. Generous.
- **Max reading width:** 680px. Never wider.
- **No animations on body copy.** The only motion: a reading progress bar at the top (thin, gold, scroll-linked).
- **Section transitions:** Subtle opacity fade on the section as it enters view. Duration 400ms max. Once.
- **Code blocks:** Syntax-highlighted, dark background even in light sections.

### Blog Index (Marketing Adjacent)

This page gets slightly more marketing treatment:
- Large post title on hover expands or changes color.
- Featured post gets an oversized treatment — title at `--type-display-md`.
- Category labels: small, uppercase, tracked wide.

---

## 8. Image Placement & Visual Strategy

**Sources synthesized:** Your existing image-placement-guide.md, Framer Parallax Examples, Webflow Parallax Guide, Line25 2026 Trends

Given your limited image set (one wide B&W, one square), these techniques maximize impact:

### Techniques for Your Specific Images

**The wide B&W image:**
- Used in the hero: full-bleed, with a dark overlay gradient. Text sits on top.
- Apply a CSS mix-blend-mode or duotone filter (navy + gold) to integrate it with brand colors.
- Give it a slow parallax scroll: moves at 0.5× the page scroll speed.

**The square image:**
- Use for the About section with a clip-path mask that reveals on scroll.
- Apply a grain overlay and slight desaturation to match the editorial aesthetic.
- On mobile: full width. On desktop: contained in an asymmetric layout.

### CSS Techniques for Premium Image Treatment

```css
/* Duotone filter using brand colors */
.hero-image {
  filter: grayscale(100%) contrast(1.1);
  mix-blend-mode: luminosity;
  /* Place over a navy background for instant brand integration */
}

/* Clip-path reveal on scroll */
.image-reveal {
  clip-path: inset(100% 0 0 0);
  transition: clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
.image-reveal.in-view {
  clip-path: inset(0% 0 0 0);
}
```

---

## Implementation Priority

Build in this order:

1. **Typography system** — Set up the CSS custom properties, import the display font, establish scale.
2. **GSAP + Lenis** — Install smooth scroll and GSAP with SplitText + ScrollTrigger. Build the animation utility functions once.
3. **Hero section** — This is your make-or-break section. Perfect it first.
4. **Global page transition** — The curtain. Install once, applies everywhere.
5. **Scroll reveals** — Apply the word/line reveal pattern to all major section headlines.
6. **Micro-interactions** — Hover states on links, buttons, and cards last.
7. **Blog/product layer** — Keep it clean, add only the reading progress bar and subtle section fades.

---

*These guidelines are a living document. As the site evolves, update them to reflect decisions made in production. What you build will always be smarter than what you plan.*

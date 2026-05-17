# CURSOR PROMPT — Ayabonga Qwabi Homepage (Large Type + Full Animation System)

Use this prompt in Cursor as a system/task description when building or rebuilding the homepage.

---

## CONTEXT

You are implementing the homepage for **Ayabonga Qwabi** — a senior software engineer and technical partner for high-growth South African startups. The site is at `business.qwabi.co.za`.

**Brand:**
- Deep Navy background: `#0A192F`
- African Sun Gold accent: `#FFD700`
- Deep Emerald: `#059669`
- Slate secondary: `#1E293B`
- Warm white: `#F5F0E8`

**Existing tech stack:** React / Next.js. Use TypeScript.

**Existing brand fonts:** Outfit (headings), Space Grotesk (body). You will ADD a display font for hero sections.

---

## WHAT TO BUILD

Implement a **homepage** that demonstrates world-class typographic web design, scroll-driven animation, and parallax effects. This is the marketing layer — it must make a strong first impression and communicate confidence, craft, and intelligence.

Reference aesthetic direction (do NOT copy, use for inspiration only):
- `bymondaystudio.com` — how type and motion create a visual system
- `moah.studio` — editorial asymmetry and scroll storytelling
- `alovehatestory.com` — expressive large type and kinetic effects

The design must be **uniquely Ayabonga's** — rooted in the brand palette, voice, and South African engineering identity.

---

## STEP 1: INSTALL DEPENDENCIES

```bash
npm install gsap @gsap/react lenis
```

Import in your root layout or `_app.tsx`:
```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, ScrambleTextPlugin);
```

Initialize Lenis smooth scroll and connect it to GSAP's ticker:
```ts
// In a useEffect in your layout
const lenis = new Lenis();
function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Connect Lenis to ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

---

## STEP 2: TYPOGRAPHY SETUP

Add to your global CSS (`globals.css`):

```css
@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Outfit:wght@300;400;600;700&family=Space+Grotesk:wght@300;400;500;700&display=swap');

:root {
  /* Display font for hero elements */
  --font-display: 'Clash Display', 'Outfit', sans-serif;
  --font-ui: 'Outfit', sans-serif;
  --font-body: 'Space Grotesk', sans-serif;

  /* Type Scale — fluid using clamp() */
  --type-display-xl:  clamp(72px, 13vw, 240px);
  --type-display-lg:  clamp(52px, 9vw,  140px);
  --type-display-md:  clamp(36px, 5.5vw, 88px);
  --type-heading-lg:  clamp(26px, 3.5vw, 52px);
  --type-heading-md:  clamp(20px, 2.5vw, 36px);
  --type-label:       clamp(10px, 1.1vw, 13px);
  --type-body:        clamp(15px, 1.5vw, 18px);

  /* Line heights */
  --leading-display:   0.88;
  --leading-editorial: 1.08;
  --leading-body:      1.68;

  /* Tracking */
  --tracking-tight:   -0.04em;
  --tracking-display: -0.02em;
  --tracking-label:   0.15em;

  /* Brand Colors */
  --navy:    #0A192F;
  --navy-dark: #060E1C;
  --gold:    #FFD700;
  --gold-dim: #C9A900;
  --emerald: #059669;
  --slate:   #1E293B;
  --warm-white: #F5F0E8;
  --muted:   #64748B;

  /* Easings (registered with CustomEase) */
  /* Register in JS, reference here by name */
}

/* Grain overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.035;
  pointer-events: none;
  z-index: 9999;
}

/* Accessibility: disable all animations for reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## STEP 3: ANIMATION UTILITIES

Create `lib/animations.ts`:

```ts
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

// Register custom easings
export function registerEasings() {
  CustomEase.create("smooth-enter",  "0.16, 1, 0.3, 1");
  CustomEase.create("editorial",     "0.77, 0, 0.175, 1");
  CustomEase.create("soft-out",      "0.25, 0.46, 0.45, 0.94");
  CustomEase.create("hard-snap",     "0.7, 0, 0.3, 1");
}

/** Pattern A: Masked line reveal — for hero headlines */
export function lineReveal(el: Element, delay = 0) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.1,
        delay,
        ease: "smooth-enter",
      });
    }
  });
}

/** Pattern B: Word wave — for manifestos and body text on scroll */
export function wordReveal(el: Element, trigger?: Element) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  SplitText.create(el, {
    type: "words",
    onSplit(self) {
      return gsap.from(self.words, {
        y: 28,
        opacity: 0,
        stagger: 0.04,
        duration: 0.75,
        ease: "power2.out",
        scrollTrigger: {
          trigger: trigger || el,
          start: "top 82%",
        }
      });
    }
  });
}

/** Pattern C: Scramble decode — for labels and nav elements on load */
export function scrambleDecode(el: Element, delay = 0) {
  const text = el.textContent || '';
  gsap.to(el, {
    delay,
    scrambleText: {
      text,
      chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      revealDelay: 0.3,
      speed: 0.8,
    },
    duration: 1.2,
    ease: "none",
  });
}

/** Scroll-linked horizontal marquee text */
export function scrollMarquee(el: Element, direction: 1 | -1 = 1) {
  gsap.to(el, {
    xPercent: direction * -20,
    ease: "none",
    scrollTrigger: {
      scrub: 1,
      start: "top bottom",
      end: "bottom top",
    }
  });
}

/** Clip-path image reveal */
export function clipReveal(el: Element) {
  gsap.from(el, {
    clipPath: "inset(100% 0 0 0)",
    duration: 1.2,
    ease: "smooth-enter",
    scrollTrigger: { trigger: el, start: "top 80%" }
  });
}

/** Parallax depth effect */
export function parallaxElement(el: Element, speed = 0.5) {
  gsap.to(el, {
    yPercent: -30 * speed,
    ease: "none",
    scrollTrigger: {
      scrub: true,
      start: "top bottom",
      end: "bottom top",
    }
  });
}

/** Pin section + scrub internal animation */
export function pinnedSection(trigger: Element, animation: gsap.core.Tween | gsap.core.Timeline) {
  ScrollTrigger.create({
    trigger,
    start: "top top",
    end: "+=150%",
    pin: true,
    scrub: 1,
    animation,
  });
}
```

---

## STEP 4: PAGE TRANSITION COMPONENT

Create `components/PageCurtain.tsx`:

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function PageCurtain() {
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entry: curtain already gone, slide out on mount
    gsap.fromTo(curtainRef.current,
      { scaleY: 1, transformOrigin: "top" },
      { scaleY: 0, duration: 0.7, ease: "power3.inOut", transformOrigin: "top", delay: 0.05 }
    );
  }, []);

  return (
    <div
      ref={curtainRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--navy-dark)',
        zIndex: 10000,
        transformOrigin: 'top',
      }}
    />
  );
}
```

Add to `_app.tsx` or root layout. Wire navigation clicks to trigger the curtain-in animation before routing.

---

## STEP 5: HOMEPAGE SECTIONS

Build `app/page.tsx` with the following section components. Each section is a separate component file.

### Section 1: Hero

**File:** `components/home/HeroSection.tsx`

**Visual spec:**
- Full viewport height (`100svh`)
- Background: `var(--navy-dark)` with a very subtle radial glow at the center-left in dark navy/blue
- No images in the first viewport (text-only hero on desktop)
- Content is left-aligned, positioned roughly center-left of the viewport

**Content layout (top to bottom):**
```
[EYEBROW]  ← small scramble-decode text: "AYABONGA QWABI — JOHANNESBURG" letter-spacing wide, uppercase
            font-size: var(--type-label), color: var(--muted)

[HEADLINE LINE 1]  ← HUGE. Line reveal animation. "SENIOR"
[HEADLINE LINE 2]  ← HUGE. "PRODUCT"
[HEADLINE LINE 3]  ← HUGE. Outline text (gold stroke, transparent fill). "ENGINEER."

[SUBHEADLINE]  ← Appears after 0.8s. Small. 
               "I build scalable software with strategic depth — from architecture to launch."
               font-size: var(--type-body). Color: var(--muted). Max-width: 520px.

[SCROLL INDICATOR]  ← Bottom center. A small vertical line that pulses. No text needed.
```

**Headline styling:**
- Font: `var(--font-display)`
- Size: `var(--type-display-xl)` — scales between 72px and 240px
- Line height: `var(--leading-display)` (0.88)
- Letter spacing: `var(--tracking-tight)` (-0.04em)
- Color line 1 & 2: `var(--warm-white)`
- Color line 3: transparent with `-webkit-text-stroke: 2px var(--gold)`

**Animations:**
1. On load (after curtain exits): Eyebrow scramble-decode at `delay: 0.3`
2. Headline lines: masked line reveal staggered, `delay: 0.5`, `stagger: 0.1`
3. Subheadline: fade + slide up at `delay: 1.1`
4. Scroll indicator: fade in at `delay: 1.6`, then perpetual slow pulse

**Parallax:**
- The headline group moves at `yPercent: -15` as user scrolls out of hero (creates a subtle depth pull)

---

### Section 2: Manifesto

**File:** `components/home/ManifestoSection.tsx`

**Visual spec:**
- Full width, tall section (min-height: `80vh`)
- Background: `var(--navy)` (slightly lighter than hero)
- A horizontal scrolling marquee in the background at about 20% opacity: repeated text "STRATEGY · CRAFT · SCALE ·" in very large outline letters
- Foreground: a single enormous statement

**Content:**
```
[MARQUEE BG]  ← Scroll-linked horizontal marquee (moves left as user scrolls down)
              Text: "STRATEGY · CRAFT · SCALE ·"
              Font-size: clamp(80px, 12vw, 200px), outline only, opacity: 0.08

[MANIFESTO TEXT]  ← Center of section
                   "I don't write code.
                    I build systems
                    that compound."
                   Font: var(--font-display), var(--type-display-lg)
                   Color: var(--warm-white)
                   Word-reveal animation on scroll trigger
```

The word "compound" should be in `var(--gold)` color.

---

### Section 3: What I Do

**File:** `components/home/ServicesSection.tsx`

**Visual spec:**
- Background: `var(--slate)` — creates contrast rhythm between sections
- Large numbered items: `01`, `02`, `03`, `04`
- Number in outline gold, large (`--type-display-md`)
- Service title in warm white, large (`--type-heading-lg`)
- Description: 1–2 lines, small, muted color
- Layout: NOT a grid. Stacked list with alternating left/right offset (odd items push right margin 15%, even items push left margin 10%)

**Services:**
- 01 — Product Engineering
- 02 — Technical Leadership  
- 03 — Architecture & Systems Design
- 04 — MVP to Scale

**Animations:**
- Each service item reveals on scroll: number fades in, then title does a line-reveal, then description fades
- Hover: the service block gets a subtle gold left-border that slides in from top, and the number fills from outline to gold

---

### Section 4: Selected Work

**File:** `components/home/WorkSection.tsx`

**Visual spec:**
- Background: `var(--navy-dark)` — back to deep dark
- Section label: "SELECTED WORK" — small, tracked, top of section
- 3–4 project items in a staggered list (not a grid)
- Each item: large project name (`--type-display-md`), a one-line category tag, and a year
- A faint horizontal rule between items
- On hover: a project description appears with a slide-down reveal. The project title shifts slightly to the right (+8px translateX).

**Animations:**
- Project titles: line-reveal, staggered 0.15s between items, triggered on section scroll
- Hover state: `200ms ease-out` for all hover transitions

---

### Section 5: About Teaser

**File:** `components/home/AboutSection.tsx`

**Visual spec:**
- Background: `var(--warm-white)` — a LIGHT section for contrast and rhythm
- Text: `var(--navy)` — reversed from site default
- Your square image: positioned right side, slightly overlapping the section boundary
- Large pull-quote on the left: `"I'm the engineer who stays on a call until the problem is actually solved."`
- Font: `var(--font-display)`, `--type-display-md`, dark navy color
- Below the quote: a short 2-sentence bio in body font
- A text link: "About me →" — no button, just an underlined link in emerald

**Animations:**
- Image: `clipReveal` animation on scroll trigger
- Pull quote: word-reveal on scroll
- The section itself: as it enters the viewport, the transition from dark to light should feel like a page turn — use a mild clip-path reveal on the whole section background

---

### Section 6: Social Proof Strip

**File:** `components/home/ProofSection.tsx`

**Visual spec:**
- Background: `var(--navy)`
- A single horizontal row: two or three compact proof items
- Examples: "5+ years building production systems", "Worked with 12 funded startups", "Based in South Africa, building globally"
- Each item: a number in `var(--gold)` (`--type-display-md`), a label below in small muted text
- A single testimonial quote below: brief, real name, company
- Layout: centered, clean, max-width 900px

**Animations:**
- Numbers: count-up animation (0 → final value) triggered on scroll entry
- Quote: word-reveal on scroll

---

### Section 7: Latest Writing

**File:** `components/home/WritingSection.tsx`

**Visual spec:**
- Background: `var(--slate)`
- Section header: "THINKING" — large, left-aligned, `--type-display-md`, outline text
- 2–3 blog post links displayed as large text links (not cards)
- Each: post title at `--type-heading-lg`, date small and muted to the right, a faint separator line below
- Hover: title shifts left slightly and changes to `var(--gold)`, date color changes too

**Animations:**
- Title and section header: line-reveal on scroll
- Individual post items stagger in at 0.1s intervals

---

### Section 8: Final CTA

**File:** `components/home/CTASection.tsx`

**Visual spec:**
- Background: `var(--gold)` — FULL GOLD background. Bold contrast moment. Only place on the site.
- Text: `var(--navy-dark)` — dark on gold
- Headline: "LET'S BUILD SOMETHING." — `--type-display-lg`, tight tracking, full width, possibly overflowing at mobile
- Subline: "Available for product engineering partnerships, retainers, and senior technical advisory."
- Two CTAs side by side:
  - Primary: WhatsApp link — dark navy button, `var(--warm-white)` text
  - Secondary: Email — outline style, `var(--navy)` border and text
- No background grain here — the gold section should feel clean and warm

**Animations:**
- Headline: line-reveal on scroll entry, but REVERSED — text slides DOWN into place (not up). Unique moment.
- CTAs: fade in `delay: 0.4` after headline

---

## STEP 6: CUSTOM CURSOR (OPTIONAL BUT RECOMMENDED)

Create `components/CustomCursor.tsx`:

```tsx
// A circular cursor that follows the mouse with a slight lag
// Morphs to a larger circle with "VIEW" text when hovering project links
// Morphs to a horizontal line when hovering navigation links
```

Use `gsap.quickTo` for cursor X/Y tracking (smooth, performance-optimized).

---

## STEP 7: NAVIGATION

**Spec:**
- Fixed, top of page. Transparent background initially. Becomes `var(--navy)` at 80% opacity with backdrop-blur after scrolling 100px.
- Left: "AQ" monogram in `var(--gold)`, `var(--font-display)`
- Right: 4 nav links in small caps, tracked wide. "Work · About · Writing · Contact"
- Hover on nav links: underline draws in from left (scaleX: 0 → 1)
- Mobile: hamburger menu that triggers a full-screen overlay with giant link text

---

## STEP 8: ACCESSIBILITY & PERFORMANCE CHECKLIST

Before shipping:
- [ ] All SplitText elements have `aria-label` on parent and `aria-hidden` on children (GSAP handles this automatically)
- [ ] All scroll animations wrapped in `prefers-reduced-motion` check
- [ ] Lenis does not interfere with keyboard scrolling — test Tab navigation
- [ ] Lighthouse Performance score ≥ 90 on desktop, ≥ 75 on mobile
- [ ] Hero LCP is text-based (fast), not an image
- [ ] Test on a mid-range Android device at 1× speed — animations must not stutter
- [ ] All interactive elements have visible focus rings
- [ ] Contrast ratio on all body text: WCAG AA minimum (4.5:1)
- [ ] Page transitions do not block back/forward browser navigation

---

## STYLE NOTES

- **Never** use box shadows as the primary decorative element. Use spacing, type scale, and color instead.
- The gold color (`#FFD700`) should feel earned — use it sparingly. Accent, not flood.
- Every section should have a slightly different background value from your palette so the scroll rhythm feels intentional, not random.
- Avoid stock imagery. Your two brand images + CSS-driven visual elements are enough.
- Spacing between sections: `padding-block: clamp(80px, 12vw, 180px)`. Never less.
- Inner content max-width on most sections: 1200px centered. Some sections break this intentionally (marquee, full-bleed type).

---

## WHAT SUCCESS LOOKS LIKE

A visitor who lands on this homepage should feel:
- **Immediately**: "This is someone who thinks differently — not another dev site."
- **After scrolling**: "I understand what this person does and I want to work with them."
- **On hover/interact**: "The level of detail here shows real craft."

The site should feel like a well-designed editorial magazine that happens to be a portfolio — where typography is the primary visual element, motion is purposeful and choreographed, and personality comes through in every decision.

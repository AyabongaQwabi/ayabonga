# CURSOR EXECUTION PROMPT
## Ayabonga Qwabi — Full Site Design Execution
### Parallel Agent Orchestration · Up to 10 Agents

---

## YOUR ROLE

You are the **orchestrating agent** for a full design system implementation on the Ayabonga Qwabi website. You will read the specification documents, plan the work, and spawn up to **10 parallel sub-agents** to execute simultaneously. You coordinate. You do not do all the implementation yourself.

---

## AUTHORITY HIERARCHY (READ THIS FIRST, FOLLOW IT EXACTLY)

There are multiple documents in this repo that may give design guidance. This is the strict priority order. **Higher number = higher authority. Never let a lower-authority document override a higher one.**

```
Priority 1 (LOWEST)  — /Users/nonwork/dev/ayabonga/docs/brand-guidelines.md
                        Reference for brand values and voice only.
                        DO NOT use its typography or layout suggestions.
                        The CONSOLIDATED-DESIGN-GUIDELINES.md supersedes it entirely
                        for all visual, layout, and motion decisions.

Priority 2           — /Users/nonwork/dev/ayabonga/CLAUDE.md
                        Hard rules: no em dashes, no AI clichés, no colon titles.
                        These writing rules apply to ALL user-facing copy produced
                        by every agent. Non-negotiable.

Priority 3           — /Users/nonwork/dev/ayabonga/files/CONSOLIDATED-DESIGN-GUIDELINES.md
                        The visual system authority. Font scale, color tokens,
                        animation patterns, layer model, component specs.
                        All visual decisions derive from here.

Priority 4 (HIGHEST) — /Users/nonwork/dev/ayabonga/files/CURSOR-FULL-SITE-PROMPT.md
                        The implementation specification. Page-by-page build instructions.
                        Where the guidelines say HOW, this says WHAT to build.
                        Where they conflict, this document wins on implementation detail.
```

**Before any agent writes a single line of code**, it must have read all four documents. Non-negotiable. If an agent is unsure about a decision, it consults the documents in priority order and follows the highest-authority answer.

---

## STACK CONTEXT (READ BEFORE SPAWNING AGENTS)

The codebase is at `/Users/nonwork/dev/ayabonga/`.

```
Framework:      Vite + React 18 + TypeScript
Routing:        React Router v7 (react-router-dom) — NOT Next.js
Styling:        Tailwind CSS v3 with custom tokens in src/index.css
Animation:      Currently none (GSAP not yet installed — agents must add it)
Fonts:          Currently Inter + Outfit + Space Grotesk (Google Fonts)
                Clash Display must be ADDED from Fontshare
State:          React hooks only, no external state library
Markdown:       react-markdown, content in src/content/blog/
Data:           src/data/pseo-pages.json, src/data/blog-posts.ts, src/lib/site-config.ts
Build:          vite build + two post-build scripts (do not break these)
Deploy:         Vercel
```

**Existing files that must NOT be deleted, only modified:**
```
src/main.tsx          — Router config. Agents can add routes but not remove them.
src/index.css         — Tailwind base. Agents extend this, do not replace it.
tailwind.config.js    — Extend the existing config. Do not replace it.
CLAUDE.md             — Writing rules. Read-only. Never edit.
src/lib/site-config.ts — Site config. Agents may update values, not structure.
src/content/blog/     — Markdown files. Agents do not touch blog content.
src/data/             — JSON/TS data files. Agents do not touch unless explicitly needed.
```

---

## PHASE 0 — ORCHESTRATOR READS SPECS (You, not a sub-agent)

Before spawning anything, you (the orchestrator) must:

1. Read `/Users/nonwork/dev/ayabonga/files/CONSOLIDATED-DESIGN-GUIDELINES.md` in full
2. Read `/Users/nonwork/dev/ayabonga/files/CURSOR-FULL-SITE-PROMPT.md` in full
3. Read `/Users/nonwork/dev/ayabonga/CLAUDE.md` in full
4. Read the existing `src/index.css`, `tailwind.config.js`, and `src/main.tsx`
5. Confirm you understand:
   - The two-layer design model (marketing vs. product layer)
   - The intensity scale per page (10 → 4)
   - The four GSAP animation patterns (lineReveal, wordReveal, scrambleDecode, clipReveal)
   - The custom easing names (smooth-enter, editorial, soft-out, hard-snap)
   - The font hierarchy (Clash Display display / Outfit UI / Space Grotesk body)
   - The CLAUDE.md hard writing rules (no em dashes, no AI phrases, max 10-word blog titles)

Only after confirming all of the above do you spawn agents.

---

## PHASE 1 — FOUNDATION (Agents 1 + 2, run in parallel)

Spawn these two agents simultaneously. They have no dependencies on each other.

### AGENT 1 — "Design Tokens + Animation Foundation"

**Task:** Install dependencies, extend the design system, and build the animation utility library.

**Reads first:** CONSOLIDATED-DESIGN-GUIDELINES.md sections 3 (Animation System), 4 (Typography System), 5 (Brand & Visual Identity).

**Deliverables — complete all before marking done:**

**1a. Install packages**
```bash
cd /Users/nonwork/dev/ayabonga
npm install gsap lenis
npm install --save-dev @types/gsap
```

**1b. Extend `tailwind.config.js`**

Add to the existing `extend` block — DO NOT replace what's there. Add:

```js
fontFamily: {
  // Keep existing entries, ADD:
  'display': ['"Clash Display"', 'Outfit', 'system-ui', 'sans-serif'],
},
fontSize: {
  // Keep existing entries, ADD:
  'display-xl':  ['clamp(72px, 13vw, 240px)', { lineHeight: '0.88', letterSpacing: '-0.04em' }],
  'display-lg':  ['clamp(52px, 9vw, 140px)',  { lineHeight: '0.92', letterSpacing: '-0.03em' }],
  'display-md':  ['clamp(36px, 5.5vw, 88px)', { lineHeight: '1.0',  letterSpacing: '-0.02em' }],
  'heading-lg':  ['clamp(26px, 3.5vw, 52px)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
  'heading-md':  ['clamp(20px, 2.5vw, 36px)', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
  'label-sm':    ['clamp(10px, 1.1vw, 13px)',  { lineHeight: '1.4',  letterSpacing: '0.15em' }],
},
```

**1c. Extend `src/index.css`**

After the existing @import line, ADD the Fontshare import for Clash Display:
```css
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
```

Then inside the existing `:root` block, ADD these custom properties (do not remove existing ones):

```css
/* === DESIGN SYSTEM ADDITIONS (do not remove existing tokens) === */

/* Raw hex values for GSAP and non-Tailwind use */
--navy:       #0A192F;
--navy-dark:  #060E1C;
--gold:       #FFD700;
--gold-dim:   #C9A900;
--emerald:    #059669;
--slate:      #1E293B;
--warm-white: #F5F0E8;
--text-muted: #64748B;

/* Leading */
--leading-display:   0.88;
--leading-editorial: 1.08;
--leading-body:      1.68;

/* Tracking */
--tracking-tight:   -0.04em;
--tracking-display: -0.02em;
--tracking-label:   0.15em;

/* Animation tokens */
--dur-fast:   120ms;
--dur-normal: 300ms;
--dur-slow:   500ms;
--dur-enter:  1100ms;
--ease-smooth-enter: cubic-bezier(0.16, 1, 0.3, 1);
--ease-editorial:    cubic-bezier(0.77, 0, 0.175, 1);
--ease-soft-out:     cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-hard-snap:    cubic-bezier(0.7, 0, 0.3, 1);
```

Also ADD to the body selector in `@layer base`:
```css
font-family: 'Space Grotesk', 'Inter', sans-serif;
```
(Space Grotesk is the default body font per the guidelines. Inter stays as fallback.)

And ADD this global grain overlay rule:
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.032;
  pointer-events: none;
  z-index: 9999;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**1d. Create `src/lib/animations.ts`**

This is the central animation utility. Every agent that needs animations imports from here — never inline GSAP calls directly in components.

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, ScrambleTextPlugin);

// ─── Custom Easings ───────────────────────────────────────────────────────────
export function registerEasings(): void {
  CustomEase.create('smooth-enter', '0.16, 1, 0.3, 1');
  CustomEase.create('editorial',    '0.77, 0, 0.175, 1');
  CustomEase.create('soft-out',     '0.25, 0.46, 0.45, 0.94');
  CustomEase.create('hard-snap',    '0.7, 0, 0.3, 1');
}

const prefersReduced = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Pattern A: Masked line reveal ───────────────────────────────────────────
// Use for: hero headlines, page titles, section headers
export function lineReveal(
  el: Element | Element[] | string,
  opts: { delay?: number; stagger?: number; duration?: number } = {}
): gsap.core.Timeline | null {
  if (prefersReduced()) return null;
  const { delay = 0, stagger = 0.1, duration = 1.1 } = opts;
  const tl = gsap.timeline();
  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    onSplit(self) {
      return tl.from(self.lines, {
        yPercent: 110,
        duration,
        stagger,
        delay,
        ease: 'smooth-enter',
      });
    },
  });
  return tl;
}

// ─── Pattern B: Word wave ────────────────────────────────────────────────────
// Use for: manifesto text, large paragraphs, scroll-triggered statements
export function wordReveal(
  el: Element | string,
  opts: { trigger?: Element | string; stagger?: number; duration?: number } = {}
): void {
  if (prefersReduced()) return;
  const { trigger, stagger = 0.04, duration = 0.75 } = opts;
  SplitText.create(el, {
    type: 'words',
    onSplit(self) {
      return gsap.from(self.words, {
        y: 28,
        opacity: 0,
        stagger,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: trigger || (el as Element),
          start: 'top 82%',
        },
      });
    },
  });
}

// ─── Pattern C: Scramble decode ──────────────────────────────────────────────
// Use for: eyebrow labels, category tags, nav items on load
export function scrambleDecode(
  el: Element | string,
  opts: { delay?: number; chars?: string } = {}
): void {
  if (prefersReduced()) return;
  const { delay = 0, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' } = opts;
  const target = typeof el === 'string' ? document.querySelector(el) : el;
  if (!target) return;
  const text = (target as HTMLElement).textContent ?? '';
  gsap.to(target, {
    delay,
    scrambleText: { text, chars, revealDelay: 0.3, speed: 0.8 },
    duration: 1.2,
    ease: 'none',
  });
}

// ─── Pattern D: Clip-path image reveal ──────────────────────────────────────
// Use for: images entering the viewport
export function clipReveal(
  el: Element | string,
  opts: { trigger?: Element | string; duration?: number } = {}
): void {
  if (prefersReduced()) return;
  const { trigger, duration = 1.2 } = opts;
  gsap.from(el, {
    clipPath: 'inset(100% 0 0 0)',
    duration,
    ease: 'smooth-enter',
    scrollTrigger: {
      trigger: trigger || (el as Element),
      start: 'top 80%',
    },
  });
}

// ─── Scroll-linked parallax ──────────────────────────────────────────────────
// Use for: hero background layers, large decorative type, footer monogram
export function parallaxElement(
  el: Element | string,
  opts: { speed?: number; axis?: 'y' | 'x' } = {}
): void {
  if (prefersReduced()) return;
  const { speed = 0.5, axis = 'y' } = opts;
  const prop = axis === 'y' ? 'yPercent' : 'xPercent';
  gsap.to(el, {
    [prop]: axis === 'y' ? -30 * speed : -20 * speed,
    ease: 'none',
    scrollTrigger: {
      scrub: true,
      start: 'top bottom',
      end: 'bottom top',
    },
  });
}

// ─── Horizontal scroll marquee (scroll-linked) ───────────────────────────────
// Use for: background decorative text that drifts on scroll
export function scrollMarquee(
  el: Element | string,
  direction: 1 | -1 = 1
): void {
  if (prefersReduced()) return;
  gsap.to(el, {
    xPercent: direction * -20,
    ease: 'none',
    scrollTrigger: {
      scrub: 1,
      start: 'top bottom',
      end: 'bottom top',
    },
  });
}

// ─── Count-up for stats ──────────────────────────────────────────────────────
export function countUp(
  el: Element | string,
  target: number,
  opts: { duration?: number; prefix?: string; suffix?: string } = {}
): void {
  if (prefersReduced()) {
    const elem = typeof el === 'string' ? document.querySelector(el) : el;
    if (elem) (elem as HTMLElement).textContent = `${opts.prefix ?? ''}${target}${opts.suffix ?? ''}`;
    return;
  }
  const { duration = 1.5, prefix = '', suffix = '' } = opts;
  const obj = { val: 0 };
  const elem = typeof el === 'string' ? document.querySelector(el) : el;
  if (!elem) return;
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      (elem as HTMLElement).textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
    },
    scrollTrigger: { trigger: elem as Element, start: 'top 85%' },
  });
}

// ─── Subtle heading fade-up (product layer only — blog posts, docs) ───────────
export function subtleFadeUp(el: Element | string): void {
  if (prefersReduced()) return;
  gsap.from(el, {
    y: 8,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out',
    scrollTrigger: { trigger: el as Element, start: 'top 90%' },
  });
}

// ─── Stagger card entrance (for grids / lists) ───────────────────────────────
export function staggerCards(
  container: Element | string,
  selector: string,
  opts: { stagger?: number; y?: number; duration?: number } = {}
): void {
  if (prefersReduced()) return;
  const { stagger = 0.08, y = 20, duration = 0.5 } = opts;
  const parent = typeof container === 'string' ? document.querySelector(container) : container;
  if (!parent) return;
  const cards = parent.querySelectorAll(selector);
  gsap.from(cards, {
    y,
    opacity: 0,
    stagger,
    duration,
    ease: 'power2.out',
    scrollTrigger: { trigger: parent, start: 'top 85%' },
  });
}
```

**1e. Create `src/lib/lenis.ts`**

```typescript
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenisInstance: Lenis | null = null;

export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time: number) => {
    lenisInstance?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis(): void {
  lenisInstance?.destroy();
  lenisInstance = null;
}
```

**1f. Update `src/App.tsx` and layout root to initialize Lenis + register easings**

In the root App component (or whichever component wraps all routes), add a useEffect:

```typescript
import { useEffect } from 'react';
import { initLenis } from './lib/lenis';
import { registerEasings } from './lib/animations';

// Inside the component:
useEffect(() => {
  registerEasings();
  initLenis();
}, []);
```

**Completion check for Agent 1:**
- [ ] `npm install gsap lenis` succeeded
- [ ] Tailwind config extended (no existing entries removed)
- [ ] Clash Display font imported in index.css
- [ ] All CSS custom properties added to :root without removing existing ones
- [ ] `src/lib/animations.ts` created with all 8 functions
- [ ] `src/lib/lenis.ts` created
- [ ] Lenis + easings initialized in app root
- [ ] `npm run build` passes without errors

---

### AGENT 2 — "Navigation + Footer + Page Transitions"

**Task:** Rebuild the global navigation, footer, and page transition system. These appear on every page so they must be done first and done correctly.

**Reads first:** CURSOR-FULL-SITE-PROMPT.md sections "Shared Components", then CONSOLIDATED-DESIGN-GUIDELINES.md section 2 (navigation spec) and 3.5 (page transitions).

**Deliverables:**

**2a. Rebuild `src/components/home/HomeNav.tsx`**

Keep the same props interface (`scrolled: boolean`, `onScrollTo`) so existing code doesn't break. Redesign the visual implementation:

- Logo: `AQ` monogram in Clash Display, gold color. Keep the existing click handler for scroll-to-hero.
- Nav links: uppercase, letter-spacing 0.15em, 12px, `var(--text-muted)` → `var(--warm-white)` on hover
- Hover underline: CSS `::after` pseudo-element, `scaleX: 0 → 1` from left, `150ms ease-out`
- Scrolled state: `rgba(6, 14, 28, 0.88)` background + `backdrop-filter: blur(20px)` + thin gold bottom border at 15% opacity
- Blog link: outlined in gold border, gold text, 12px
- Quote link: solid emerald background, navy text

Mobile menu: Replace the current dropdown with a **full-screen overlay**:
- Background: `var(--navy-dark)` full screen, `z-index: 200`
- Nav links at `--type-display-md` scale
- Each link does a line-reveal animation (staggered 0.07s) when menu opens
- Hamburger → X animated transform on toggle

**2b. Create `src/components/layout/SiteNav.tsx`** (a standalone nav for non-home pages)

Non-home pages use React Router `<Link>` instead of scroll handlers. Same visual design as HomeNav but all links are `<Link to="...">`. Import and use on `/about`, `/blog`, `/services`, `/technical-cofounder`, `/get-a-quote`, and all template pages.

Current non-home pages use whatever nav they have — update each page file to import `SiteNav` instead.

**2c. Update `src/components/SiteFooter.tsx`**

Add the giant `AQ` monogram behind the footer content (positioned absolute, decorative). It uses `var(--gold)` with `-webkit-text-stroke: 1px` and `color: transparent` at very low opacity (8%). Apply `parallaxElement` from animations.ts to give it a slow drift on scroll.

Keep all existing footer link structure and content — only update the visual treatment.

**2d. Create `src/components/layout/PageCurtain.tsx`**

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';

export function PageCurtain() {
  const curtainRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Curtain color maps to destination page for seamless feel
  const curtainColor = (() => {
    const p = location.pathname;
    if (p.startsWith('/blog')) return '#060E1C';
    if (p === '/about') return '#0A192F';
    if (p === '/get-a-quote') return '#1E293B';
    return '#060E1C';
  })();

  useEffect(() => {
    // Slide curtain OUT on every route change (reveal new page)
    if (!curtainRef.current) return;
    gsap.set(curtainRef.current, { scaleY: 1, transformOrigin: 'top' });
    gsap.to(curtainRef.current, {
      scaleY: 0,
      duration: 0.65,
      ease: 'power3.inOut',
      transformOrigin: 'top',
      delay: 0.05,
    });
  }, [location.pathname]);

  return (
    <div
      ref={curtainRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: curtainColor,
        zIndex: 10000,
        transformOrigin: 'top',
        pointerEvents: 'none',
      }}
    />
  );
}
```

Add `<PageCurtain />` to `src/main.tsx` inside the `<BrowserRouter>` wrapper, alongside the existing `<ScrollToTop />`.

For **outgoing transitions** (curtain slides IN before route changes): use a custom link component that triggers curtain-in before navigation. Create `src/components/ui/TransitionLink.tsx`:

```tsx
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { getLenis } from '../../lib/lenis';

type Props = { to: string; children: React.ReactNode; className?: string };

export function TransitionLink({ to, children, className }: Props) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const curtain = document.querySelector('[data-page-curtain]') as HTMLElement;
    if (!curtain) { navigate(to); return; }

    // Slide curtain IN
    gsap.to(curtain, {
      scaleY: 1,
      duration: 0.5,
      ease: 'power3.inOut',
      transformOrigin: 'bottom',
      onComplete: () => {
        getLenis()?.scrollTo(0, { immediate: true });
        navigate(to);
      },
    });
  };

  return <a href={to} onClick={handleClick} className={className}>{children}</a>;
}
```

Add `data-page-curtain` attribute to the curtain div.

**Completion check for Agent 2:**
- [ ] HomeNav rebuilt with new visual design, same props interface
- [ ] SiteNav.tsx created for non-home pages
- [ ] All non-home page files updated to import SiteNav
- [ ] SiteFooter.tsx updated with AQ monogram + parallax
- [ ] PageCurtain.tsx created and added to main.tsx
- [ ] TransitionLink.tsx created
- [ ] `npm run build` passes

---

## PHASE 2 — HIGH-VALUE PAGES (Agents 3, 4, 5, 6 — all in parallel)

Wait for Phase 1 agents to complete. Then spawn all four simultaneously.

### AGENT 3 — "Homepage Sections Rebuild"

**Task:** Implement all 8 homepage sections. The homepage is the highest-intensity page (10/10). This is the centrepiece of the entire design.

**Primary spec:** `/Users/nonwork/dev/ayabonga/files/CURSOR-HOMEPAGE-PROMPT.md` — read this entirely. Execute every section specification verbatim.

**Secondary spec:** CONSOLIDATED-DESIGN-GUIDELINES.md sections 2.2 and 2.3.

**Existing files to rebuild (keep filenames, replace internals):**
```
src/components/home/HomeArtHero.tsx      → Section 1 (Hero)
src/components/home/HomeManifesto.tsx    → Section 2 (Manifesto)  
src/components/home/HomeWhatIDo.tsx      → Section 3 (Services)
src/components/home/HomeSelectedWork.tsx → Section 4 (Work)
src/components/home/HomeAboutTeaser.tsx  → Section 5 (About)
src/components/home/HomeFinalCta.tsx     → Section 8 (CTA)
```

**New files to create:**
```
src/components/home/HomeProofStrip.tsx   → Section 6 (Social Proof)
src/components/home/HomeLatestWriting.tsx → Section 7 (Already exists — update it)
```

**Critical rules for this agent:**
- Import ALL animation utilities from `src/lib/animations.ts` — never inline GSAP calls
- The hero headline uses `lineReveal()` with `delay: 0.5` after curtain exits
- The manifesto text uses `wordReveal()` with scroll trigger
- The eyebrow label uses `scrambleDecode()` with `delay: 0.3`
- Gold (`var(--gold)` / `#FFD700`) floods the CTA section background — nowhere else on the homepage
- No em dashes in any copy (CLAUDE.md rule)

**Copy guidance (CLAUDE.md rules apply):**
- No colon titles. No "unlock". No "empower". No em dashes.
- All copy must be direct, technical, and personal.

**Completion check:**
- [ ] All 8 sections implemented
- [ ] Hero entrance sequence works (scramble → line-reveal → subhead → indicator)
- [ ] Manifesto word-reveal fires on scroll
- [ ] Services section has broken-grid asymmetric layout
- [ ] Work section has large staggered list with hover reveal
- [ ] CTA section has gold background
- [ ] `npm run dev` renders homepage correctly

---

### AGENT 4 — "Blog Index + Blog Post Pages"

**Task:** Redesign the blog index (`/blog`) and the individual post template (`/blog/:slug`). These are intensity 7 and 5 respectively.

**Primary spec:** CURSOR-FULL-SITE-PROMPT.md sections "/blog" and "/blog/:slug"

**Existing files to rebuild:**
```
src/pages/Blog.tsx       → Blog index (full redesign)
src/pages/BlogPost.tsx   → Post page (full redesign)
```

**Existing components to update:**
```
src/components/BlogPostHero.tsx    → Animated post header (line-reveal title)
src/components/BlogToc.tsx         → Sticky table of contents sidebar
src/components/BlogRelatedPosts.tsx → "KEEP READING" section
src/components/AuthorBio.tsx       → Author exit section
```

**New components to create:**
```
src/components/ui/ReadingProgress.tsx  → Scroll-linked gold progress bar
src/components/blog/FeaturedPost.tsx   → Magazine-spread layout for latest post
src/components/blog/PostCard.tsx       → Small and large card variants
src/components/blog/PostGrid.tsx       → Asymmetric broken grid
```

**Blog Index key specs:**
- Hero: "THINKING" in Clash Display at `--type-display-xl`, outline (gold stroke), partially overflowing viewport. Line-reveal on load.
- Featured post: full-width magazine spread layout (not a card)
- Post grid: alternating large/small card layout (not uniform 3-col)
- Category filter strip: gold background section
- All post titles in Clash Display
- Hover: gold left-border slides in from top (`scaleY: 0 → 1`), title shifts right 6px

**Blog Post key specs:**
- Post header: 70–80vh, post title in `lineReveal()` on page load, category label in `scrambleDecode()`
- Reading progress bar: 2px gold, fixed at top, scroll-linked via Lenis
- Drop cap on first paragraph: Clash Display, gold, `float: left`, `font-size: 5em`
- Body: NO animations on paragraphs. Only subtle `subtleFadeUp()` on H2/H3 elements.
- Sticky sidebar (desktop): table of contents with active section highlight in gold
- Max reading width: 680px centered

**CLAUDE.md rules:** No em dashes in any generated copy. Blog post titles max 10 words. No colon title structures.

**Completion check:**
- [ ] Blog index renders with magazine-layout hero and featured post
- [ ] Post grid has alternating card sizes
- [ ] Individual post has animated header + reading progress bar
- [ ] Drop cap renders on first paragraph
- [ ] Body text has no scroll animations (paragraphs are static)
- [ ] Sticky ToC works on desktop
- [ ] `npm run dev` renders blog routes correctly

---

### AGENT 5 — "About Page + Services Page"

**Task:** Redesign the About page and Services page. About is intensity 8, Services is intensity 7.

**Primary spec:** CURSOR-FULL-SITE-PROMPT.md sections "/about" and "/services"

**Existing files to rebuild:**
```
src/pages/About.tsx    → Full redesign
src/pages/Services.tsx → Full redesign
```

**About page key specs:**
- Section 1: Full-viewport hero with large "ABOUT" outline text as background decoration
- Section 2: Origin story, two-column with large gold number "01"
- Section 3: Philosophy quote, word-by-word reveal on scroll, "right tradeoff" in gold
- Section 4: Three values in broken asymmetric layout (01 left, 02 pushed right, 03 left with extra margin)
- Section 5: Experience timeline (vertical stacked list, thin gold vertical rule on left)
- Light section (`var(--warm-white)` background with dark navy text) for origin story — creates contrast rhythm

**Services page key specs:**
- Section 3 (Process) is a PINNED scroll section using GSAP `pin: true, scrub: 1`
- Four steps animate in one-by-one as user scrolls through the pinned section
- Section 4 uses gold background (same as homepage CTA)
- Service detail layout: large outlined number + service name at `--type-display-md` minimum
- Numbers use `countUp()` utility from animations.ts

**Both pages:**
- Import `SiteNav` from `src/components/layout/SiteNav.tsx`
- Import `SiteFooter` from `src/components/SiteFooter.tsx`
- Use `TransitionLink` for all internal navigation links
- All animations import from `src/lib/animations.ts`
- No em dashes in any copy

**Completion check:**
- [ ] About page has 5 distinct sections with correct background rhythm
- [ ] Philosophy quote does word-reveal on scroll
- [ ] Services process section is pinned with scrub animation
- [ ] Both pages use SiteNav
- [ ] `npm run dev` renders both pages

---

### AGENT 6 — "TaaS Landing + Get a Quote"

**Task:** Redesign the TaaS landing page and the quote tool. TaaS is intensity 8, Quote is intensity 4 (functional-first).

**Primary spec:** CURSOR-FULL-SITE-PROMPT.md sections "/technical-cofounder" and "/get-a-quote"

**Existing files to rebuild:**
```
src/pages/TechnicalCofounder.tsx → Full redesign
src/pages/GetAQuotePage.tsx      → Functional redesign (light touch)
src/components/GetAQuote.jsx     → Update form styling only
```

**TaaS key specs:**
- Hero: Two-line contrast headline — Line 1 "You have the vision." (outline), Line 2 "I have the architecture." (filled). They animate in sequence.
- Pain points section: "THE PROBLEM WITH HOW YOU'RE BUILDING" — large line-reveal header
- Solution section: PINNED scroll section, 3 cards reveal sequentially (same technique as Services process)
- Final CTA: gold background

**Quote page key specs:**
- Intensity 4: functional, clean, trustworthy. Minimal animation.
- Form container: `var(--slate)` background, subtle gold border at 12% opacity
- Focus states on inputs: gold border + subtle gold glow `box-shadow`
- The ONLY animation: slide transition between form steps (current step slides left, new slides in from right, 300ms ease-out)
- Success state: CSS circle-draw checkmark + line-reveal for confirmation message

**Completion check:**
- [ ] TaaS hero two-line sequence works
- [ ] TaaS has pinned solution section
- [ ] Quote form has correct focus states
- [ ] Quote step transitions work
- [ ] Success state has checkmark animation

---

## PHASE 3 — TEMPLATE PAGES (Agents 7, 8, 9 — all in parallel)

Wait for Phase 2 agents to complete. Spawn all three simultaneously.

### AGENT 7 — "pSEO Solution Pages Template"

**Task:** Redesign the solution page template used for all 12 `/solutions/:slug` pages.

**Primary spec:** CURSOR-FULL-SITE-PROMPT.md section "/solutions/:slug"

**Existing file to rebuild:**
```
src/pages/DynamicServicePage.tsx → Template redesign
```

**Key requirement:** Each page gets a large (5% opacity) industry keyword in outline letters behind the hero. This keyword comes from the solution data (`src/data/pseo-pages.json`). Map the slug to a short keyword:

```typescript
const bgKeywords: Record<string, string> = {
  'fintech-founders-south-africa': 'FINTECH',
  'logistics-apps-cape-town': 'LOGISTICS',
  'healthcare-startups-johannesburg': 'HEALTH',
  'edutech-platforms-south-africa': 'EDUTECH',
  'marketplace-founders-south-africa': 'MARKET',
  'digital-transformation-experts-south-africa': 'TRANSFORM',
  'ai-integration-specialist-south-africa': 'AI',
  'technical-cofounder-as-a-service-south-africa': 'TAAS',
  'proptech-solutions-south-africa': 'PROPTECH',
  'ecommerce-scale-south-africa': 'ECOMMERCE',
  'saas-product-engineering-south-africa': 'SAAS',
  'solar-energy-platforms-south-africa': 'SOLAR',
};
```

This background keyword uses `scrollMarquee()` for a slow horizontal drift on scroll.

**Completion check:**
- [ ] Template renders correctly for all 12 slugs
- [ ] Background keyword renders and drifts on scroll
- [ ] Template uses SiteNav and SiteFooter
- [ ] All existing data from pseo-pages.json still renders correctly

---

### AGENT 8 — "Comparison Pages Template + Developer Hub Pages"

**Task:** Redesign the comparison page template (5 pages) and the developer hub pages.

**Primary spec:** CURSOR-FULL-SITE-PROMPT.md sections "/vs/:slug" and "/developers/..."

**Existing files to rebuild:**
```
src/pages/DynamicComparisonPage.tsx  → Template redesign
src/pages/DevelopersRegionHub.tsx    → Hub page redesign
src/pages/LocalDeveloperPage.tsx     → Leaf page redesign (light touch)
```

**Comparison page key spec:**
- Comparison table is NOT an HTML `<table>`. Use a CSS Grid with styled rows.
- Each row animates in on scroll, staggered 0.1s
- Left column header: emerald accent ("WITH AYABONGA")
- Right column header: muted ("WITH [COMPARISON]")
- Summary statement at bottom: line-reveal on scroll

**Developer hub pages key spec:**
- Intensity 5: clear, helpful, locally relevant
- Subtle pattern background in hero: diagonal lines or grid in var(--slate) at 20% opacity (CSS only, no image)
- City/role links in a clean CSS grid, hover state in gold
- Leaf pages (/developers/eastern-cape/:city/:role): same template but lighter — just hero + services + CTA. No decorative backgrounds.

**Completion check:**
- [ ] Comparison template renders for all 5 slugs with styled grid (not HTML table)
- [ ] Developer hub has subtle pattern background
- [ ] Leaf pages render correctly
- [ ] All existing routing still works

---

### AGENT 9 — "Custom Cursor + Scroll Indicator + Reading Progress"

**Task:** Implement the three remaining micro-experience components.

**Existing file to update:**
```
src/components/CursorEffect.tsx → Rebuild custom cursor
```

**New files to create:**
```
src/components/ui/ReadingProgress.tsx   → Scroll progress bar (blog posts only)
src/components/ui/ScrollIndicator.tsx   → Animated scroll indicator (homepage hero)
```

**Custom Cursor spec:**
- A circle (32px) that follows the mouse with a slight lag using `gsap.quickTo()`
- Default state: thin gold border, transparent fill
- Hovering a project link or card: expands to 80px, inner text "VIEW" appears
- Hovering navigation links: collapses to a horizontal line (24px wide × 2px tall)
- Hovering a CTA button: fills with gold (20% opacity)
- Transition speed: 120ms on scale, 60ms lag on position
- On mobile/touch: cursor component renders nothing (detect via pointer media query)
- Apply `data-cursor="view"` attribute to project cards, `data-cursor="link"` to nav links

```tsx
// Do not use CSS cursor: none globally — only hide the cursor within the main content area
// Apply `style={{ cursor: 'none' }}` to the main wrapper div only
```

**Reading Progress spec:**
- Fixed at the very top of the viewport (not inside the nav, but below it)
- Height: 2px
- Background: `var(--gold)` / `#FFD700`
- Width grows from 0% to 100% linked to scroll progress in the post body section only
- Use Lenis scroll event + ScrollTrigger progress to calculate percentage
- `role="progressbar"` aria attribute with `aria-valuenow` updated dynamically

**Scroll Indicator spec (homepage hero only):**
- A vertical line (1px wide, 40px tall) in gold at the bottom-center of the hero
- A small dot that moves down the line on a loop
- Fades out after user scrolls 200px
- Implemented with CSS animation (not GSAP) — keep it lightweight

**Completion check:**
- [ ] Custom cursor works on desktop, hidden on mobile
- [ ] Cursor morphs correctly on hover states
- [ ] Reading progress bar renders only on blog post pages
- [ ] Scroll indicator renders on homepage hero and fades on scroll

---

## PHASE 4 — POLISH + INTEGRATION (Agent 10)

Wait for Phase 3 to complete. One final agent runs a full integration pass.

### AGENT 10 — "Integration, Accessibility + Performance Audit"

**Task:** Final integration pass across the whole site. Fix any broken imports, missing components, or visual inconsistencies. Run the accessibility and performance checks.

**Read first:** The completion checks from Agents 1–9. Verify all are done.

**Deliverables:**

**10a. Cross-page consistency check**
- Every page file imports `SiteNav` (not `HomeNav`) except `App.tsx`
- Every page has a `<PageCurtain />` route via `main.tsx`
- Every internal navigation link uses `<TransitionLink>` or `<Link>` — no plain `<a href>` for internal routes
- Footer renders on every page

**10b. Animation consistency audit**
Run through this table and verify each pattern fires correctly:

| Element | Expected Pattern | Check |
|---|---|---|
| Every hero headline | lineReveal, stagger 0.08–0.12s | |
| Every manifesto/large text | wordReveal, stagger 0.04s | |
| Every eyebrow label | scrambleDecode, 0.2s delay | |
| Every image | clipReveal | |
| Every stat number | countUp | |
| Every card grid | staggerCards | |
| Body paragraphs (blog) | NONE — static | |
| Nav hover underline | CSS only, scaleX | |

**10c. Accessibility fixes**
- Add `aria-label` to all SplitText targets (GSAP handles this if `aria: 'auto'` is set in SplitText options — verify it's set everywhere)
- Verify all color combinations pass WCAG AA:
  - `#FFD700` on `#0A192F`: passes for large text (≥ 18px bold or ≥ 24px regular)
  - `#C9A900` (gold-dim) on `#0A192F`: check if needed for smaller text
  - `#F5F0E8` on `#0A192F`: always passes
- Add `role="progressbar"` to ReadingProgress component
- Verify skip-to-content link exists in the root layout
- Verify all images have alt text

**10d. Performance check**
- Verify Clash Display font has `<link rel="preload">` in `index.html`
- Verify `font-display: swap` is set (Fontshare adds this by default, confirm)
- Confirm no `will-change: transform` is left permanently on any element after animation ends
- Run `npm run build` — confirm no TypeScript errors, no broken imports
- Confirm build produces no files over 500kb (GSAP will add ~100kb — acceptable)

**10e. Mobile test list**
- Homepage hero text is readable at 375px viewport
- Blog post body is 17px+ on mobile
- Navigation mobile overlay opens and closes correctly
- Custom cursor does NOT appear on mobile (touch devices)
- All touch targets are ≥ 44px × 44px (especially navigation links in mobile menu)

**10f. CLAUDE.md compliance scan**
Do a grep across all modified `.tsx` files for:
- Em dashes (—) in JSX string content → flag and fix
- "unlock", "empower", "elevate", "dynamic landscape" → flag and fix
- Blog post titles with colons → flag and fix

**Completion check:**
- [ ] `npm run build` passes with zero errors
- [ ] All routes render without console errors in `npm run dev`
- [ ] Color contrast passes WCAG AA on all critical text
- [ ] CLAUDE.md scan finds zero violations
- [ ] Performance build: no files over 500kb
- [ ] Accessibility: skip-to-content + aria labels present

---

## AGENT COMMUNICATION PROTOCOL

Each agent writes a brief status update at the end of its work:

```
AGENT [N] COMPLETE
Files modified: [list]
Files created: [list]
Build status: PASS / FAIL (if fail, describe error)
Blockers for downstream agents: [none / description]
```

The orchestrator collects these before advancing to the next phase.

---

## HARD CONSTRAINTS (for all agents, always)

```
NEVER DO:
  ✗ Remove existing routes from src/main.tsx
  ✗ Delete src/content/blog/ files
  ✗ Use em dashes (—) in any user-facing string
  ✗ Use "unlock", "empower", "elevate", "dynamic landscape" in copy
  ✗ Animate body paragraph text (only headlines and display elements)
  ✗ Apply cursor: none globally (only to main content wrapper)
  ✗ Add will-change: transform permanently to any element
  ✗ Use brand-guidelines.md for visual decisions (it's superseded)
  ✗ Inline GSAP calls in components (always import from src/lib/animations.ts)
  ✗ Break npm run build

ALWAYS DO:
  ✓ Read all four authority documents before writing code
  ✓ Import animations from src/lib/animations.ts
  ✓ Check prefers-reduced-motion before any animation
  ✓ Use TransitionLink for internal navigation
  ✓ Apply SiteNav on all non-home pages
  ✓ Keep Space Grotesk as default body font
  ✓ Keep gold (#FFD700) scarce — only accent use unless it's a CTA section
  ✓ Test that npm run build passes after your changes
```

---

## EXECUTION ORDER SUMMARY

```
PHASE 0  Orchestrator reads all spec documents          [You, ~5 min]
         ↓
PHASE 1  Agent 1: Tokens + GSAP + Lenis                [parallel]
         Agent 2: Nav + Footer + Transitions
         ↓ (wait for both to complete)
PHASE 2  Agent 3: Homepage sections                    [parallel]
         Agent 4: Blog index + blog post
         Agent 5: About + Services
         Agent 6: TaaS landing + Quote tool
         ↓ (wait for all to complete)
PHASE 3  Agent 7: Solution page template (12 pages)    [parallel]
         Agent 8: Comparison + Developer hub templates
         Agent 9: Cursor + Scroll indicator + Progress bar
         ↓ (wait for all to complete)
PHASE 4  Agent 10: Integration audit + accessibility   [single]
         ↓
         DONE — npm run build passes, all routes render
```

---

*Authority: CURSOR-FULL-SITE-PROMPT.md > CONSOLIDATED-DESIGN-GUIDELINES.md > CLAUDE.md > brand-guidelines.md*
*Stack: Vite + React 18 + TypeScript + Tailwind v3 + React Router v7 + GSAP + Lenis*
*Total pages: ~130 indexable routes across 10 page templates*
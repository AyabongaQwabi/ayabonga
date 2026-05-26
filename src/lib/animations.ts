import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, ScrambleTextPlugin);

let easingsRegistered = false;
let motionReadyPromise: Promise<void> | null = null;
let resolveMotionReady: (() => void) | null = null;

const splitRegistry = new WeakMap<Element, SplitText>();

export function registerEasings(): void {
  if (easingsRegistered) return;
  CustomEase.create('smooth-enter', '0.16, 1, 0.3, 1');
  CustomEase.create('editorial', '0.77, 0, 0.175, 1');
  CustomEase.create('soft-out', '0.25, 0.46, 0.45, 0.94');
  CustomEase.create('hard-snap', '0.7, 0, 0.3, 1');
  easingsRegistered = true;
}

/** Resolve after Lenis (or native scroll) and fonts are ready for ScrollTrigger. */
export function whenMotionReady(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (prefersReduced()) return Promise.resolve();

  if (!motionReadyPromise) {
    motionReadyPromise = new Promise<void>((resolve) => {
      resolveMotionReady = resolve;
    });
    registerEasings();
    void document.fonts.ready
      .catch(() => undefined)
      .then(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            resolveMotionReady?.();
            resolveMotionReady = null;
          });
        });
      });
  }

  return motionReadyPromise;
}

/** Call from Lenis init so homepage effects wait for smooth scroll wiring. */
export function notifyScrollInfrastructureReady(): void {
  registerEasings();
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    resolveMotionReady?.();
    resolveMotionReady = null;
  });
}

export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh();
}

export type MotionPreference = 'system' | 'play' | 'reduce';

export function getMotionPreference(): MotionPreference {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem('ayabonga-motion-preference');
  if (stored === 'play' || stored === 'reduce') return stored;
  return 'system';
}

export function setMotionPreference(pref: MotionPreference): void {
  if (typeof window === 'undefined') return;
  if (pref === 'system') {
    localStorage.removeItem('ayabonga-motion-preference');
  } else {
    localStorage.setItem('ayabonga-motion-preference', pref);
  }
  
  // Propagate the change via DOM attribute so CSS selectors can react immediately
  const resolved = prefersReduced() ? 'reduce' : 'play';
  document.documentElement.setAttribute('data-motion-preference', resolved);
  
  window.dispatchEvent(new Event('motion-preference-changed'));
}

export function prefersReduced(): boolean {
  if (typeof window === 'undefined') return false;
  if ((window as Window & { __PRERENDER__?: boolean }).__PRERENDER__) return true;

  // Strategic URL override flags
  if (window.location.search.includes('motion=play') || window.location.search.includes('animate=true')) {
    return false;
  }
  if (window.location.search.includes('motion=reduce') || window.location.search.includes('animate=false')) {
    return true;
  }

  const pref = getMotionPreference();
  if (pref === 'play') return false;
  if (pref === 'reduce') return true;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Page curtain exit: delay 50ms + duration 650ms (see PageCurtain.tsx). */
export const PAGE_CURTAIN_EXIT_MS = 720;

/** Run after the route curtain finishes on load or client navigation. */
export function scheduleAfterPageCurtain(callback: () => void): () => void {
  if (prefersReduced()) {
    callback();
    return () => {};
  }
  const id = window.setTimeout(callback, PAGE_CURTAIN_EXIT_MS);
  return () => window.clearTimeout(id);
}

function resolveElement(el: Element | string): Element | null {
  if (typeof el === 'string') return document.querySelector(el);
  return el as Element;
}

function revertSplit(el: Element): void {
  const existing = splitRegistry.get(el);
  if (existing) {
    existing.revert();
    splitRegistry.delete(el);
  }
}

function revealElements(
  targets: gsap.TweenTarget,
  opts: { y?: number; stagger?: number; duration?: number },
): gsap.core.Tween {
  const { y = 20, stagger = 0.08, duration = 0.5 } = opts;
  return gsap.to(targets, {
    y: 0,
    opacity: 1,
    stagger,
    duration,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

function scrollRevealTween(
  trigger: Element,
  targets: gsap.TweenTarget,
  opts: { y?: number; stagger?: number; duration?: number; start?: string },
): () => void {
  const { y = 20, stagger = 0.08, duration = 0.5, start = 'top 88%' } = opts;
  gsap.set(targets, { opacity: 0, y });

  let played = false;
  let activeTween: gsap.core.Tween | null = null;

  const play = () => {
    if (played) return;
    played = true;
    activeTween = revealElements(targets, { y, stagger, duration });
  };

  const st = ScrollTrigger.create({
    trigger,
    start,
    once: true,
    onEnter: play,
  });

  if (ScrollTrigger.isInViewport(trigger, 0.15)) {
    play();
    st.kill();
  }

  return () => {
    st.kill();
    activeTween?.kill();
    gsap.set(targets, { opacity: 1, y: 0, clearProps: 'opacity,transform' });
  };
}

export function lineReveal(
  el: Element | Element[] | string,
  opts: {
    delay?: number;
    stagger?: number;
    duration?: number;
    trigger?: Element | string;
    start?: string;
  } = {},
): (() => void) | null {
  const target = resolveElement(el);
  if (!target) return null;

  if (prefersReduced()) {
    gsap.set(target, { opacity: 1, clearProps: 'transform' });
    return null;
  }

  registerEasings();
  revertSplit(target);

  const { delay = 0, stagger = 0.1, duration = 1.1, trigger, start = 'top 82%' } = opts;
  const triggerEl = trigger ? resolveElement(trigger) : null;

  if (triggerEl) {
    let scrollCleanup: (() => void) | undefined;

    const split = SplitText.create(target, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      aria: 'auto',
      onSplit(self) {
        splitRegistry.set(target, self);
        gsap.set(self.lines, { yPercent: 110 });

        let played = false;
        let activeTween: gsap.core.Tween | null = null;

        const play = () => {
          if (played) return;
          played = true;
          activeTween = gsap.to(self.lines, {
            yPercent: 0,
            duration,
            stagger,
            ease: 'smooth-enter',
          });
        };

        const st = ScrollTrigger.create({
          trigger: triggerEl,
          start,
          once: true,
          onEnter: play,
        });

        if (ScrollTrigger.isInViewport(triggerEl, 0.12)) {
          play();
          st.kill();
        }

        scrollCleanup = () => {
          st.kill();
          activeTween?.kill();
          gsap.set(self.lines, { yPercent: 0 });
        };

        return undefined;
      },
    });

    return () => {
      scrollCleanup?.();
      split.revert();
      splitRegistry.delete(target);
      gsap.set(target, { opacity: 1, clearProps: 'transform' });
    };
  }

  const tl = gsap.timeline({
    delay,
    onComplete: () => {
      gsap.set(target, { opacity: 1 });
    },
  });

  const split = SplitText.create(target, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    aria: 'auto',
    onSplit(self) {
      splitRegistry.set(target, self);
      gsap.set(self.lines, { yPercent: 110 });
      tl.to(
        self.lines,
        {
          yPercent: 0,
          duration,
          stagger,
          ease: 'smooth-enter',
        },
        0,
      );
      return tl;
    },
  });

  return () => {
    tl.kill();
    split.revert();
    splitRegistry.delete(target);
    gsap.set(target, { opacity: 1, clearProps: 'transform' });
  };
}

export function wordReveal(
  el: Element | string,
  opts: { trigger?: Element | string; stagger?: number; duration?: number } = {},
): (() => void) | undefined {
  const target = resolveElement(el);
  if (!target) return undefined;

  if (prefersReduced()) {
    gsap.set(target, { opacity: 1, y: 0 });
    return undefined;
  }

  registerEasings();
  revertSplit(target);

  const { trigger, stagger = 0.04, duration = 0.75 } = opts;
  const triggerEl = trigger ? resolveElement(trigger) : target;
  if (!triggerEl) return undefined;

  let scrollCleanup: (() => void) | undefined;

  const split = SplitText.create(target, {
    type: 'words',
    aria: 'auto',
    onSplit(self) {
      splitRegistry.set(target, self);
      scrollCleanup = scrollRevealTween(triggerEl, self.words, {
        y: 28,
        stagger,
        duration,
        start: 'top 82%',
      });
      return undefined;
    },
  });

  return () => {
    scrollCleanup?.();
    split.revert();
    splitRegistry.delete(target);
    gsap.set(target, { opacity: 1, clearProps: 'transform' });
  };
}

export function scrambleDecode(
  el: Element | string,
  opts: { delay?: number; chars?: string } = {},
): gsap.core.Tween | undefined {
  if (prefersReduced()) return undefined;
  registerEasings();
  const { delay = 0, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' } = opts;
  const target = resolveElement(el);
  if (!target) return undefined;
  const text = (target as HTMLElement).textContent ?? '';
  return gsap.to(target, {
    delay,
    scrambleText: { text, chars, revealDelay: 0.3, speed: 0.8 },
    duration: 1.2,
    ease: 'none',
  });
}

export function clipReveal(
  el: Element | string,
  opts: { trigger?: Element | string; duration?: number } = {},
): (() => void) | undefined {
  const target = resolveElement(el);
  if (!target) return undefined;

  if (prefersReduced()) {
    gsap.set(target, { clipPath: 'none', opacity: 1 });
    return undefined;
  }

  registerEasings();
  const { trigger, duration = 1.2 } = opts;
  const triggerEl = trigger ? resolveElement(trigger) : target;
  if (!triggerEl) return undefined;

  gsap.set(target, { clipPath: 'inset(100% 0 0 0)' });

  const tween = gsap.to(target, {
    clipPath: 'inset(0% 0 0 0)',
    duration,
    ease: 'smooth-enter',
    paused: true,
  });

  const st = ScrollTrigger.create({
    trigger: triggerEl,
    start: 'top 80%',
    once: true,
    onEnter: () => tween.play(),
  });

  if (ScrollTrigger.isInViewport(triggerEl, 0.15)) {
    tween.play();
    st.kill();
  }

  return () => {
    st.kill();
    tween.kill();
    gsap.set(target, { clipPath: 'none', opacity: 1 });
  };
}

export function parallaxElement(
  el: Element | string,
  opts: { speed?: number; axis?: 'y' | 'x' } = {},
): (() => void) | undefined {
  if (prefersReduced()) return undefined;
  const { speed = 0.5, axis = 'y' } = opts;
  const target = resolveElement(el);
  if (!target) return undefined;
  const prop = axis === 'y' ? 'yPercent' : 'xPercent';
  const tween = gsap.to(target, {
    [prop]: axis === 'y' ? -30 * speed : -20 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: target,
      scrub: true,
      start: 'top bottom',
      end: 'bottom top',
    },
  });
  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(target, { clearProps: 'transform' });
  };
}

export function scrollMarquee(el: Element | string, direction: 1 | -1 = 1): (() => void) | undefined {
  if (prefersReduced()) return undefined;
  const target = resolveElement(el);
  if (!target) return undefined;
  const tween = gsap.to(target, {
    xPercent: direction * -20,
    ease: 'none',
    scrollTrigger: {
      trigger: target,
      scrub: 1,
      start: 'top bottom',
      end: 'bottom top',
    },
  });
  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

export function countUp(
  el: Element | string,
  target: number,
  opts: { duration?: number; prefix?: string; suffix?: string } = {},
): (() => void) | undefined {
  const elem = resolveElement(el);
  if (!elem) return undefined;
  const { duration = 1.5, prefix = '', suffix = '' } = opts;
  if (prefersReduced()) {
    (elem as HTMLElement).textContent = `${prefix}${target}${suffix}`;
    return undefined;
  }
  const obj = { val: 0 };
  const tween = gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      (elem as HTMLElement).textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
    },
    scrollTrigger: { trigger: elem, start: 'top 85%', once: true },
  });
  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

export function scaleXReveal(
  el: Element | string,
  opts: { delay?: number; duration?: number } = {},
): gsap.core.Tween | undefined {
  if (prefersReduced()) return undefined;
  const { delay = 0, duration = 0.6 } = opts;
  return gsap.from(el, {
    scaleX: 0,
    duration,
    delay,
    ease: 'power2.out',
    transformOrigin: 'left center',
  });
}

export function subtleFadeUp(el: Element | string): (() => void) | undefined {
  const target = resolveElement(el);
  if (!target) return undefined;
  if (prefersReduced()) {
    gsap.set(target, { opacity: 1, y: 0 });
    return undefined;
  }
  return scrollRevealTween(target, target, { y: 8, duration: 0.4, start: 'top 90%' });
}

export function staggerCards(
  container: Element | string,
  selector: string,
  opts: { stagger?: number; y?: number; duration?: number } = {},
): (() => void) | undefined {
  const parent = resolveElement(container);
  if (!parent) return undefined;
  const cards = parent.querySelectorAll(selector);
  if (cards.length === 0) return undefined;

  if (prefersReduced()) {
    gsap.set(cards, { opacity: 1, y: 0 });
    return undefined;
  }

  registerEasings();
  return scrollRevealTween(parent, cards, opts);
}

/** Kill every ScrollTrigger instance (use in page effect cleanup). */
export function killScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

export function pinScrollSection(
  container: Element | string,
  items: Element | string,
  _opts: { stagger?: number } = {},
): (() => void) | undefined {
  if (prefersReduced()) return undefined;
  const parent = resolveElement(container);
  if (!parent) return undefined;
  const nodes =
    typeof items === 'string'
      ? Array.from(parent.querySelectorAll(items))
      : Array.isArray(items)
        ? items
        : [items];

  if (nodes.length === 0) return undefined;

  if (nodes.length === 1) {
    gsap.set(nodes[0], { opacity: 1, y: 0 });
    return undefined;
  }

  const stepCount = nodes.length - 1;

  gsap.set(nodes, { opacity: 0, y: 24 });
  gsap.set(nodes[0], { opacity: 1, y: 0 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top top',
      end: `+=${stepCount * 100}%`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  nodes.forEach((node, index) => {
    if (index === 0) return;
    const at = index;
    tl.to(
      nodes[index - 1],
      { opacity: 0, y: -20, duration: 0.45, ease: 'power2.in' },
      at,
    ).to(node, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, at);
  });

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
    gsap.set(nodes, { clearProps: 'opacity,y,transform' });
  };
}

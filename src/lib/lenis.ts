import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { notifyScrollInfrastructureReady } from './animations';

let lenisInstance: Lenis | null = null;

function shouldSkipLenis(): boolean {
  if (typeof window === 'undefined') return true;
  if ((window as Window & { __PRERENDER__?: boolean }).__PRERENDER__) return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initLenis(): Lenis | null {
  if (shouldSkipLenis()) return null;
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

  notifyScrollInfrastructureReady();

  return lenisInstance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function destroyLenis(): void {
  lenisInstance?.destroy();
  lenisInstance = null;
}

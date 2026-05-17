import type { ScreenshotTarget } from '../types.js';

export const DEFAULT_SCREENSHOT_TARGETS: ScreenshotTarget[] = [
  {
    id: 'webflow',
    name: 'Webflow',
    url: 'https://webflow.com/',
    darkMode: true,
    scrollCapture: false,
    waitMs: 3000,
    cookieBannerSelectors: ['#onetrust-accept-btn-handler', '[data-testid="accept-cookies"]'],
  },
  {
    id: 'framer',
    name: 'Framer',
    url: 'https://www.framer.com/',
    darkMode: true,
    waitMs: 3000,
  },
  {
    id: 'wix',
    name: 'Wix',
    url: 'https://www.wix.com/',
    darkMode: false,
    waitMs: 3000,
  },
  {
    id: 'vercel-v0',
    name: 'Vercel v0',
    url: 'https://v0.dev/',
    darkMode: true,
    waitMs: 4000,
  },
  {
    id: 'bolt',
    name: 'Bolt.new',
    url: 'https://bolt.new/',
    darkMode: true,
    waitMs: 4000,
  },
  {
    id: 'tailwind-ui',
    name: 'Tailwind UI',
    url: 'https://tailwindui.com/',
    darkMode: true,
    waitMs: 3000,
  },
  {
    id: 'bubble',
    name: 'Bubble',
    url: 'https://bubble.io/',
    darkMode: false,
    waitMs: 3000,
  },
  {
    id: 'vercel',
    name: 'Vercel',
    url: 'https://vercel.com/',
    darkMode: true,
    waitMs: 3000,
  },
];

export function getTargetById(id: string): ScreenshotTarget | undefined {
  return DEFAULT_SCREENSHOT_TARGETS.find((t) => t.id === id);
}

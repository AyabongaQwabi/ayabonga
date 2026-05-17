import path from 'node:path';
import { chromium, type Browser, type Page } from 'playwright';
import { DEFAULT_VIEWPORT } from '../config.js';
import type { ScreenshotTarget } from '../types.js';
import { DEFAULT_SCREENSHOT_TARGETS, getTargetById } from './targets.js';
import { ensureDir } from '../utils/fs.js';
import { optimizeImageFile } from '../assets/optimize.js';

async function preparePage(page: Page, target: ScreenshotTarget): Promise<void> {
  if (target.darkMode) {
    await page.emulateMedia({ colorScheme: 'dark' });
  }

  await page.setViewportSize(target.viewport ?? DEFAULT_VIEWPORT);
  await page.goto(target.url, {
    waitUntil: target.waitUntil ?? 'load',
    timeout: target.gotoTimeoutMs ?? 90_000,
  });
  await page.waitForTimeout(target.waitMs ?? 2500);

  for (const selector of target.cookieBannerSelectors ?? []) {
    try {
      const el = page.locator(selector).first();
      if (await el.isVisible({ timeout: 1500 })) {
        await el.click();
        await page.waitForTimeout(500);
      }
    } catch {
      // optional dismiss
    }
  }

  // Lazy-load: scroll page in steps
  if (target.scrollCapture) {
    await autoScroll(page);
  } else {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let total = 0;
        const distance = 400;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          total += distance;
          if (total >= document.body.scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 120);
      });
    });
    await page.waitForTimeout(800);
  }
}

async function autoScroll(page: Page): Promise<void> {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let y = 0;
      const step = 500;
      const id = setInterval(() => {
        y += step;
        window.scrollTo(0, y);
        if (y >= document.body.scrollHeight) {
          clearInterval(id);
          resolve();
        }
      }, 150);
    });
  });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
}

export async function captureScreenshot(
  target: ScreenshotTarget,
  outputPath: string,
  browser?: Browser,
): Promise<string> {
  const ownsBrowser = !browser;
  const b =
    browser ??
    (await chromium.launch({
      headless: true,
    }));

  try {
    const page = await b.newPage();
    await preparePage(page, target);
    await ensureDir(path.dirname(outputPath));

    await page.screenshot({
      path: outputPath,
      fullPage: target.fullPage ?? false,
      type: 'png',
    });

    const optimized = await optimizeImageFile(outputPath, {
      maxWidth: 1400,
      formats: ['webp'],
    });

    return optimized.webpPath ?? outputPath;
  } finally {
    if (ownsBrowser) {
      await b.close();
    }
  }
}

export async function captureScreenshotsForArticle(
  slug: string,
  screenshotsDir: string,
  targetIds?: string[],
): Promise<Record<string, string>> {
  const ids = targetIds?.length
    ? targetIds
    : DEFAULT_SCREENSHOT_TARGETS.map((t) => t.id);
  const results: Record<string, string> = {};

  const browser = await chromium.launch({ headless: true });
  try {
    for (const id of ids) {
      const target = getTargetById(id);
      if (!target) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[capture] Unknown screenshot target: ${id}`);
        }
        continue;
      }
      const pngPath = path.join(screenshotsDir, `${id}.png`);
      try {
        const finalPath = await captureScreenshot(target, pngPath, browser);
        results[id] = path.relative(path.join(screenshotsDir, '..'), finalPath);
      } catch (err) {
        console.error(`[capture] Failed ${id}:`, err instanceof Error ? err.message : err);
      }
    }
  } finally {
    await browser.close();
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[capture] Screenshots for', slug, results);
  }

  return results;
}

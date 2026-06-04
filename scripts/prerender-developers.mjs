/**
 * Post-build: static HTML for indexable routes so crawlers get titles, meta, and body copy.
 * Route list is shared with generate-sitemap.mjs. Skips when SKIP_PRERENDER=1.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import http from 'node:http';
import { collectPrerenderRoutes } from './collect-indexable-routes.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const PREVIEW_PORT = Number(process.env.PRERENDER_PORT || 4173);
const PREVIEW_HOST = '127.0.0.1';

function routeToHtmlPath(route) {
  const segments = route.replace(/^\//, '').split('/').filter(Boolean);
  return path.join(distDir, ...segments, 'index.html');
}

function useBundledChromium() {
  return (
    process.env.VERCEL === '1' ||
    (process.env.CI === 'true' && process.platform === 'linux')
  );
}

async function launchBrowser() {
  if (useBundledChromium()) {
    const puppeteer = await import('puppeteer-core');
    const chromium = await import('@sparticuz/chromium');
    chromium.default.setGraphicsMode = false;
    return puppeteer.default.launch({
      args: [...chromium.default.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 800 },
      executablePath: await chromium.default.executablePath(),
      headless: chromium.default.headless,
    });
  }

  const puppeteer = await import('puppeteer');
  return puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}

function waitForServer(url, maxAttempts = 60) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const tick = () => {
      attempts += 1;
      http
        .get(url, (res) => {
          res.resume();
          if (res.statusCode && res.statusCode < 500) {
            resolve();
          } else if (attempts >= maxAttempts) {
            reject(new Error(`Preview server returned ${res.statusCode}`));
          } else {
            setTimeout(tick, 250);
          }
        })
        .on('error', () => {
          if (attempts >= maxAttempts) {
            reject(new Error(`Preview server not ready at ${url}`));
          } else {
            setTimeout(tick, 250);
          }
        });
    };
    tick();
  });
}

function startPreview() {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      ['vite', 'preview', '--host', PREVIEW_HOST, '--port', String(PREVIEW_PORT), '--strictPort'],
      { cwd: root, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env } },
    );
    let stderr = '';
    child.stderr?.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    const baseUrl = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;
    waitForServer(baseUrl)
      .then(() => resolve({ child, baseUrl }))
      .catch((err) => {
        child.kill('SIGTERM');
        reject(new Error(`${err.message}\n${stderr}`));
      });
  });
}

const PRERENDER_SELECTOR = '#main-content h1, main h1, h1';
const GOTO_TIMEOUT_MS = 90_000;
const CONTENT_TIMEOUT_MS = 90_000;

async function waitForPrerenderContent(page) {
  await page.waitForFunction(
    (selector) => {
      const main = document.querySelector('#main-content');
      if (main?.getAttribute('aria-busy') === 'true') return false;

      document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
        el.classList.add('is-visible');
      });

      const heading = document.querySelector(selector);
      return Boolean(heading?.textContent?.trim());
    },
    { timeout: CONTENT_TIMEOUT_MS },
    PRERENDER_SELECTOR,
  );
}

async function prerenderRoute(page, baseUrl, route) {
  const url = `${baseUrl}${route}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: GOTO_TIMEOUT_MS });
  await waitForPrerenderContent(page);
  const html = await page.content();
  const outFile = routeToHtmlPath(route);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html, 'utf8');
  return outFile;
}

async function main() {
  if (process.env.SKIP_PRERENDER === '1') {
    console.log('prerender-developers: skipped (SKIP_PRERENDER=1)');
    return;
  }

  if (!fs.existsSync(distDir)) {
    console.error('prerender-developers: dist/ not found. Run vite build first.');
    process.exit(1);
  }

  const routes = collectPrerenderRoutes().sort((a, b) => {
    if (a === '/') return 1;
    if (b === '/') return -1;
    return a.localeCompare(b);
  });
  let preview;

  try {
    preview = await startPreview();
    const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(() => {
      window.__PRERENDER__ = true;
      const revealAll = () => {
        document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
          el.classList.add('is-visible');
        });
      };
      document.addEventListener('DOMContentLoaded', revealAll);
      window.addEventListener('load', revealAll);
    });

    for (const route of routes) {
      const outFile = await prerenderRoute(page, preview.baseUrl, route);
      console.log(`prerender-developers: ${route} → ${path.relative(root, outFile)}`);
    }

    await browser.close();
    console.log(`prerender-developers: wrote ${routes.length} HTML files`);
  } finally {
    if (preview?.child) {
      preview.child.kill('SIGTERM');
    }
  }
}

main().catch((err) => {
  console.error('prerender-developers failed:', err);
  process.exit(1);
});

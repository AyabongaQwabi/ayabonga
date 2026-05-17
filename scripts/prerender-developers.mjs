/**
 * Post-build: static HTML for /developers/* routes so crawlers get full titles, meta, and body copy.
 * Requires dist/ from `vite build`. Skips when SKIP_PRERENDER=1.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import http from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const localDataPath = path.join(root, 'src/data/local-developers.json');
const PREVIEW_PORT = Number(process.env.PRERENDER_PORT || 4173);
const PREVIEW_HOST = '127.0.0.1';

const STATIC_PRERENDER_ROUTES = [
  '/',
  '/about',
  '/privacy',
  '/editorial',
  '/corrections',
  '/services',
  '/technical-cofounder',
  '/get-a-quote',
  '/blog',
  '/projects/espazza',
  '/blog/sa-payment-gateways-tco-2026',
  '/blog/build-ai-agents-libraries-2026',
  '/blog/xhosa-meaningful-baby-name-ideas',
];

function collectDeveloperRoutes() {
  const data = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));
  const routes = [...STATIC_PRERENDER_ROUTES, '/developers/eastern-cape', '/developers/south-africa'];
  const ecCities = (data.cities || []).filter((c) => c.region === 'eastern-cape');
  const roleSlugs = Object.keys(data.roles || {});
  for (const city of ecCities) {
    for (const role of roleSlugs) {
      routes.push(`/developers/eastern-cape/${city.slug}/${role}`);
    }
  }
  return routes;
}

function routeToHtmlPath(route) {
  const segments = route.replace(/^\//, '').split('/').filter(Boolean);
  return path.join(distDir, ...segments, 'index.html');
}

/** Vercel/CI Linux images lack system libs for Puppeteer's downloaded Chrome. */
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

const PRERENDER_SELECTOR = '#main-content h1';
const GOTO_TIMEOUT_MS = 60_000;
const CONTENT_TIMEOUT_MS = 45_000;

/** Scroll-reveal hides content until IntersectionObserver runs; headless often never fires. */
async function waitForPrerenderContent(page) {
  await page.waitForFunction(
    (selector) => {
      const heading = document.querySelector(selector);
      if (!heading?.textContent?.trim()) return false;
      const reveal = heading.closest('.reveal, .reveal-stagger');
      if (reveal && !reveal.classList.contains('is-visible')) {
        reveal.classList.add('is-visible');
      }
      return true;
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

  const routes = collectDeveloperRoutes();
  let preview;

  try {
    preview = await startPreview();
    const browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(() => {
      window.__PRERENDER__ = true;
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

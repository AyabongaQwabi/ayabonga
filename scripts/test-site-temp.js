import puppeteer from 'puppeteer';

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Listen to console logs
  page.on('console', msg => {
    console.log(`[PAGE CONSOLE] [${msg.type().toUpperCase()}]:`, msg.text());
  });

  // Listen to errors
  page.on('pageerror', err => {
    console.error('[PAGE ERROR]:', err.stack || err.toString());
  });

  console.log('Navigating to http://localhost:5177/...');
  await page.goto('http://localhost:5177/', { waitUntil: 'networkidle0' });

  console.log('Checking initial element states...');
  const initialStates = await page.evaluate(() => {
    const reveals = Array.from(document.querySelectorAll('.reveal, .reveal-stagger'));
    return reveals.map(el => ({
      tagName: el.tagName,
      id: el.id,
      className: el.className,
      isVisible: el.classList.contains('is-visible'),
      text: el.textContent ? el.textContent.substring(0, 50).trim() + '...' : ''
    }));
  });
  console.log('Initial elements:', JSON.stringify(initialStates, null, 2));

  console.log('Scrolling down to trigger reveals...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });

  console.log('Waiting 2 seconds for animations to settle...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('Checking post-scroll element states...');
  const postScrollStates = await page.evaluate(() => {
    const reveals = Array.from(document.querySelectorAll('.reveal, .reveal-stagger'));
    return reveals.map(el => ({
      tagName: el.tagName,
      id: el.id,
      className: el.className,
      isVisible: el.classList.contains('is-visible'),
      text: el.textContent ? el.textContent.substring(0, 50).trim() + '...' : ''
    }));
  });
  console.log('Post-scroll elements:', JSON.stringify(postScrollStates, null, 2));

  await browser.close();
  console.log('Done!');
}

run().catch(console.error);

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click the link (should jump via native anchor)
  await page.click('header a[href="#contact"]');
  await page.waitForTimeout(500);

  const result = await page.evaluate(() => ({
    scrollY: window.scrollY,
    hash: location.hash,
    contactRect: document.getElementById('contact')?.getBoundingClientRect(),
  }));
  console.log('No JS result:', JSON.stringify(result, null, 2));

  await browser.close();
})();
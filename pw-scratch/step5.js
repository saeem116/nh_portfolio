const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Sample scrollY every 50ms
  const samples = [];
  await page.click('header a[href="#contact"]');
  for (let i = 0; i < 30; i++) {
    const y = await page.evaluate(() => window.scrollY);
    samples.push(y);
    await page.waitForTimeout(50);
  }
  const distinct = [...new Set(samples)];
  console.log('reducedMotion samples:', samples.slice(0, 10));
  console.log('distinctCount:', distinct.length);
  console.log('finalY:', samples[samples.length - 1]);

  await browser.close();
})();
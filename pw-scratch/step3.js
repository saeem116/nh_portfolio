const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Test: click again while already there
  await page.click('header a[href="#contact"]');
  await page.waitForTimeout(500);
  const afterClick = await page.evaluate(() => window.scrollY);
  console.log('After second click scrollY:', afterClick);

  // Scroll back to top and click again
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const atTop = await page.evaluate(() => window.scrollY);
  console.log('After scroll to top:', atTop);

  await page.click('header a[href="#contact"]');
  await page.waitForTimeout(1500);
  const afterSecond = await page.evaluate(() => window.scrollY);
  console.log('After third click:', afterSecond);

  await browser.close();
})();
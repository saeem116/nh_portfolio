const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // First click
  await page.click('header a[href="#contact"]');
  await page.waitForTimeout(1200);
  const afterFirst = await page.evaluate(() => ({ y: window.scrollY, active: document.activeElement.id }));
  console.log('After first click:', JSON.stringify(afterFirst));

  // Click again while already there
  await page.click('header a[href="#contact"]');
  await page.waitForTimeout(1200);
  const afterSecond = await page.evaluate(() => ({ y: window.scrollY, active: document.activeElement.id }));
  console.log('After second click:', JSON.stringify(afterSecond));

  await browser.close();
})();
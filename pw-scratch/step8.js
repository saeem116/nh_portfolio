const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Check mobile header - feature hidden on mobile (< 768px)
  const header = await page.evaluate(() => {
    const rightGroup = document.querySelector('div.hidden');
    return {
      rightGroupDisplay: rightGroup ? getComputedStyle(rightGroup).display : 'not-found',
      spans: Array.from(document.querySelectorAll('header span')).map(el => ({
        text: (el.textContent||'').trim(),
        rect: el.getBoundingClientRect()
      }))
    };
  });
  console.log('Mobile header:', JSON.stringify(header, null, 2));

  await browser.close();
})();
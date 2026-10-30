const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const header = document.querySelector('header');
    const cs = getComputedStyle(header);
    const hr = header.getBoundingClientRect();
    const rightGroup = header.querySelector('.hidden');
    const rgs = rightGroup ? getComputedStyle(rightGroup) : null;
    const spans = Array.from(header.querySelectorAll('span')).map(el => {
      const r = el.getBoundingClientRect();
      return { text: (el.textContent||'').trim().slice(0,30), rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } };
    });
    return {
      headerRect: { x: hr.x, y: hr.y, w: hr.width, h: hr.height },
      rightGroup: rightGroup ? { display: rgs.display, rect: rightGroup.getBoundingClientRect() } : null,
      spans,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await page.screenshot({ path: 'pw-scratch/mobile.png', fullPage: false });
  await page.screenshot({ path: 'pw-scratch/mobile-header.png', clip: { x: 0, y: 0, width: 390, height: 120 } });
  await browser.close();
})();
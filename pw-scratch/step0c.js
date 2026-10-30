const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  await page.screenshot({ path: 'pw-scratch/full.png', fullPage: true });
  await page.screenshot({ path: 'pw-scratch/header-clip.png', clip: { x: 0, y: 0, width: 1897, height: 120 } });

  const data = await page.evaluate(() => {
    const header = document.querySelector('header');
    const cs = getComputedStyle(header);
    const hdrR = header.getBoundingClientRect();
    return {
      header: { x: hdrR.x, y: hdrR.y, w: hdrR.width, h: hdrR.height, position: cs.position, top: cs.top, py: cs.paddingTop, pb: cs.paddingBottom },
      scrollHeight: document.body.scrollHeight,
      scrollY: window.scrollY,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
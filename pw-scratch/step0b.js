const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const data = await page.evaluate(() => {
    const header = document.querySelector('header');
    const inner = header.querySelector('div');
    const cs = getComputedStyle(header);
    const innerCs = getComputedStyle(inner);
    const hdrR = header.getBoundingClientRect();
    const innerR = inner.getBoundingClientRect();
    return {
      header: { x: hdrR.x, y: hdrR.y, w: hdrR.width, h: hdrR.height, position: cs.position, top: cs.top },
      inner: { x: innerR.x, y: innerR.y, w: innerR.width, h: innerR.height, pt: innerCs.paddingTop, pb: innerCs.paddingBottom },
      scrollHeight: document.body.scrollHeight,
      scrollY: window.scrollY,
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await page.screenshot({ path: 'pw-scratch/header-before.png', fullPage: false });
  await browser.close();
})();
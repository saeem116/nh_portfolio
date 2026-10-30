const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  for (const width of [320, 390]) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 844 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const data = await page.evaluate((w) => {
      const header = document.querySelector('header');
      const inner = header.querySelector('div.site-container');
      const hcs = getComputedStyle(header);
      const ics = getComputedStyle(inner);
      const hRect = header.getBoundingClientRect();
      const iRect = inner.getBoundingClientRect();

      return {
        width: w,
        headerCS: { height: hcs.height, paddingTop: hcs.paddingTop, paddingBottom: hcs.paddingBottom },
        innerCS: { height: ics.height, paddingTop: ics.paddingTop, paddingBottom: ics.paddingBottom, paddingLeft: ics.paddingLeft, paddingRight: ics.paddingRight },
        headerRect: { x: Math.round(hRect.x), y: Math.round(hRect.y), w: Math.round(hRect.width), h: Math.round(hRect.height) },
        innerRect: { x: Math.round(iRect.x), y: Math.round(iRect.y), w: Math.round(iRect.width), h: Math.round(iRect.height) },
      };
    }, width);

    console.log(`\nWidth ${width}px:`);
    console.log(JSON.stringify(data, null, 2));

    await page.close();
  }

  await browser.close();
})();
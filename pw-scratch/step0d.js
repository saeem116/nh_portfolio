const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const before = await page.evaluate(() => {
    const h = document.querySelector('header');
    const r = h.getBoundingClientRect();
    return { y: r.y, h: r.height, scrollY: window.scrollY };
  });

  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(300);

  const after = await page.evaluate(() => {
    const h = document.querySelector('header');
    const r = h.getBoundingClientRect();
    return { y: r.y, h: r.height, scrollY: window.scrollY };
  });

  console.log('before:', JSON.stringify(before));
  console.log('after scroll 500:', JSON.stringify(after));

  // Check the actual header inner div padding and the header's full height including padding
  const detail = await page.evaluate(() => {
    const header = document.querySelector('header');
    const inner = header.querySelector('div');
    const hcs = getComputedStyle(header);
    const ics = getComputedStyle(inner);
    const hr = header.getBoundingClientRect();
    const ir = inner.getBoundingClientRect();
    return {
      headerRect: { x: hr.x, y: hr.y, w: hr.width, h: hr.height },
      innerRect: { x: ir.x, y: ir.y, w: ir.width, h: ir.height },
      headerCS: { position: hcs.position, top: hcs.top, height: hcs.height, paddingTop: hcs.paddingTop, paddingBottom: hcs.paddingBottom },
      innerCS: { paddingTop: ics.paddingTop, paddingBottom: ics.paddingBottom, paddingLeft: ics.paddingLeft, paddingRight: ics.paddingRight },
    };
  });
  console.log('detail:', JSON.stringify(detail, null, 2));

  await browser.close();
})();
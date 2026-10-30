const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Dump the header DOM and all computed styles
  const data = await page.evaluate(() => {
    const header = document.querySelector('header');
    const inner = header.querySelector('div');
    const cs = getComputedStyle(header);
    const ics = getComputedStyle(inner);
    const hr = header.getBoundingClientRect();
    const ir = inner.getBoundingClientRect();
    const allDivs = Array.from(header.querySelectorAll('div,span,svg,a')).map(el => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        text: (el.textContent||'').trim().slice(0,60),
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        cs: { display: cs.display, position: cs.position, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, marginTop: cs.marginTop, marginBottom: cs.marginBottom, height: cs.height },
      };
    });
    return {
      headerHTML: header.outerHTML.slice(0, 800),
      headerCS: { position: cs.position, top: cs.top, height: cs.height, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, marginTop: cs.marginTop },
      innerCS: { paddingTop: ics.paddingTop, paddingBottom: ics.paddingBottom, height: ics.height },
      headerRect: { x: hr.x, y: hr.y, w: hr.width, h: hr.height },
      innerRect: { x: ir.x, y: ir.y, w: ir.width, h: ir.height },
      allDivs,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
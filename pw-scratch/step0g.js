const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const header = document.querySelector('header');
    const cs = getComputedStyle(header);
    const hr = header.getBoundingClientRect();
    const spans = Array.from(header.querySelectorAll('span')).map(el => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { text: (el.textContent||'').trim().slice(0,40), rect: { x: r.x, y: r.y, w: r.width, h: r.height }, cs: { fontSize: cs.fontSize, letterSpacing: cs.letterSpacing, color: cs.color, fontWeight: cs.fontWeight, textTransform: cs.textTransform, display: cs.display } };
    });
    const svgs = Array.from(header.querySelectorAll('svg')).map(el => {
      const r = el.getBoundingClientRect();
      return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, stroke: el.getAttribute('stroke'), sw: el.getAttribute('strokeWidth') };
    });
    return {
      headerRect: { x: hr.x, y: hr.y, w: hr.width, h: hr.height },
      headerCS: { position: cs.position, height: cs.height, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom },
      spans, svgs,
      bodyScrollHeight: document.body.scrollHeight,
      docScrollHeight: document.documentElement.scrollHeight,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
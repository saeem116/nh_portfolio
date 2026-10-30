const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  for (const width of [320, 360, 390]) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 844 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const data = await page.evaluate((w) => {
      const header = document.querySelector('header');
      const hRect = header.getBoundingClientRect();

      // Find all spans in header
      const allSpans = Array.from(header.querySelectorAll('span')).map(el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          text: (el.textContent||'').trim().slice(0, 40),
          display: cs.display,
          visibility: cs.visibility,
          opacity: cs.opacity,
          width: Math.round(r.width),
          height: Math.round(r.height),
          x: Math.round(r.x),
          y: Math.round(r.y),
          whiteSpace: cs.whiteSpace,
          fontSize: cs.fontSize,
          letterSpacing: cs.letterSpacing,
        };
      });

      // Find the link
      const link = header.querySelector('a');
      const lRect = link ? link.getBoundingClientRect() : null;
      const lcs = link ? getComputedStyle(link) : null;

      // Find the right group div
      const rightGroup = header.querySelector('div.flex.items-center.gap-4');
      const rgRect = rightGroup ? rightGroup.getBoundingClientRect() : null;
      const rgcs = rightGroup ? getComputedStyle(rightGroup) : null;

      // Check if any element causes horizontal scroll
      const allElements = Array.from(header.querySelectorAll('*')).map(el => {
        const r = el.getBoundingClientRect();
        return { tag: el.tagName, right: Math.round(r.right), width: Math.round(r.width) };
      });

      return {
        width: w,
        headerH: hRect.height,
        headerW: hRect.width,
        allSpans,
        link: lRect ? { x: Math.round(lRect.x), y: Math.round(lRect.y), w: Math.round(lRect.w), h: Math.round(lRect.h), display: lcs.display, whiteSpace: lcs.whiteSpace } : null,
        rightGroup: rgRect ? { x: Math.round(rgRect.x), y: Math.round(rgRect.y), w: Math.round(rgRect.w), h: Math.round(rgRect.h), display: rgcs.display, flexWrap: rgcs.flexWrap } : null,
        maxElementRight: Math.max(...allElements.map(e => e.right)),
        scrollWidth: document.body.scrollWidth,
        innerWidth: window.innerWidth,
      };
    }, width);

    console.log(`\nWidth ${width}px:`);
    console.log(JSON.stringify(data, null, 2));

    await page.screenshot({ path: `pw-scratch/mobile-detail-${width}.png`, clip: { x: 0, y: 0, width, height: 120 } });
    await page.close();
  }

  await browser.close();
})();
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  // Test tap target at 320 and 390
  for (const width of [320, 390]) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 844 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    const data = await page.evaluate((w) => {
      const link = document.querySelector('header a');
      const lRect = link ? link.getBoundingClientRect() : null;
      const lcs = link ? getComputedStyle(link) : null;
      return {
        width: w,
        linkBox: lRect ? { x: Math.round(lRect.x), y: Math.round(lRect.y), w: Math.round(lRect.width), h: Math.round(lRect.height) } : null,
        linkCS: lcs ? { paddingTop: lcs.paddingTop, paddingBottom: lcs.paddingBottom, marginTop: lcs.marginTop, marginBottom: lcs.marginBottom } : null,
        linkHeight: lRect ? Math.round(lRect.height) : null,
        // Check if there's only one link
        allLinks: Array.from(document.querySelectorAll('header a')).map(a => ({
          href: a.getAttribute('href'),
          text: a.textContent.trim().slice(0, 40)
        })),
      };
    }, width);

    console.log(`\nWidth ${width}px tap target:`);
    console.log(JSON.stringify(data, null, 2));

    await page.close();
  }

  await browser.close();
})();
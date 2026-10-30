const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  // Check header layout at various widths
  for (const width of [320, 360, 390, 430, 768, 1024]) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 844 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const data = await page.evaluate((w) => {
      const header = document.querySelector('header');
      const hRect = header.getBoundingClientRect();
      const tag = header.querySelector('span[data-anim="up"]');
      const rightGroup = header.querySelector('div.flex.items-center.gap-4');
      const tRect = tag ? tag.getBoundingClientRect() : null;
      const rRect = rightGroup ? rightGroup.getBoundingClientRect() : null;
      const link = rightGroup?.querySelector('a');
      const lRect = link ? link.getBoundingClientRect() : null;
      const linkText = link?.textContent?.trim();
      const hasScroll = document.body.scrollWidth > window.innerWidth;
      const rightDisplay = rightGroup ? getComputedStyle(rightGroup).display : 'none';

      // Check overlap
      let overlap = false;
      if (tRect && lRect) {
        overlap = !(lRect.right <= tRect.left || lRect.left >= tRect.right ||
                    lRect.bottom <= tRect.top || lRect.top >= tRect.bottom);
      }

      return {
        width: w,
        headerH: hRect.height,
        headerW: hRect.width,
        rightGroupDisplay: rightDisplay,
        tag: tRect ? { x: Math.round(tRect.x), y: Math.round(tRect.y), w: Math.round(tRect.w), h: Math.round(tRect.h) } : null,
        link: lRect ? { x: Math.round(lRect.x), y: Math.round(lRect.y), w: Math.round(lRect.w), h: Math.round(lRect.h), text: linkText } : null,
        overlap: overlap,
        hasHorizontalScroll: hasScroll,
        scrollWidth: document.body.scrollWidth,
        innerWidth: window.innerWidth,
        linkFontSize: link ? getComputedStyle(link).fontSize : null,
        linkLetterSpacing: link ? getComputedStyle(link).letterSpacing : null,
      };
    }, width);

    console.log(`\nWidth ${width}px:`);
    console.log(JSON.stringify(data, null, 2));

    await page.screenshot({ path: `pw-scratch/mobile-header-${width}.png`, clip: { x: 0, y: 0, width, height: 120 } });
    await page.close();
  }

  // Check desktop
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const desktop = await page.evaluate(() => {
    const header = document.querySelector('header');
    const hRect = header.getBoundingClientRect();
    const rightGroup = header.querySelector('div.flex.items-center.gap-4');
    const rRect = rightGroup ? rightGroup.getBoundingClientRect() : null;
    const link = rightGroup?.querySelector('a');
    const lRect = link ? link.getBoundingClientRect() : null;
    return {
      width: 1897,
      headerH: hRect.height,
      rightGroup: { display: getComputedStyle(rightGroup).display, rect: rRect },
      link: lRect ? { x: Math.round(lRect.x), y: Math.round(lRect.y), w: Math.round(lRect.w), h: Math.round(lRect.h) } : null,
    };
  });

  console.log('\nDesktop 1897x898:');
  console.log(JSON.stringify(desktop, null, 2));

  await browser.close();
})();
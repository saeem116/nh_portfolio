const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();

  const results = [];

  for (const width of [320, 360, 390, 430, 768, 1024]) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 844 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    const data = await page.evaluate((w) => {
      const header = document.querySelector('header');
      const hRect = header.getBoundingClientRect();

      // Find the tag (VIDEO EDITOR) - it's the span with data-anim="up"
      const tag = header.querySelector('span[data-anim="up"]');
      const tagRect = tag ? tag.getBoundingClientRect() : null;
      const tagParent = tag ? tag.parentElement : null;
      const tagParentRect = tagParent ? tagParent.getBoundingClientRect() : null;

      // Find the link
      const link = header.querySelector('a');
      const lRect = link ? link.getBoundingClientRect() : null;
      const lcs = link ? getComputedStyle(link) : null;

      // Find the right group
      const rightGroup = header.querySelector('div.flex.items-center.gap-4');
      const rgRect = rightGroup ? rightGroup.getBoundingClientRect() : null;

      // Get visible text in the link
      const visibleSpans = Array.from(link?.querySelectorAll('span') || []).map(s => ({
        text: (s.textContent||'').trim(),
        display: getComputedStyle(s).display,
        width: Math.round(s.getBoundingClientRect().width),
      }));

      const hasScroll = document.body.scrollWidth > window.innerWidth;

      // Check overlap between tag and link
      let overlap = false;
      const tagBox = tagParentRect || tagRect;
      if (tagBox && lRect) {
        overlap = !(lRect.right <= tagBox.left || lRect.left >= tagBox.right ||
                    lRect.bottom <= tagBox.top || lRect.top >= tagBox.bottom);
      }

      return {
        width: w,
        headerH: Math.round(hRect.height),
        tagBox: tagBox ? { x: Math.round(tagBox.x), y: Math.round(tagBox.y), w: Math.round(tagBox.width), h: Math.round(tagBox.height) } : null,
        linkBox: lRect ? { x: Math.round(lRect.x), y: Math.round(lRect.y), w: Math.round(lRect.width), h: Math.round(lRect.height) } : null,
        linkCS: lcs ? { fontSize: lcs.fontSize, letterSpacing: lcs.letterSpacing, display: lcs.display, opacity: lcs.opacity } : null,
        visibleSpans,
        overlap: overlap,
        hasHorizontalScroll: hasScroll,
        scrollWidth: document.body.scrollWidth,
        innerWidth: window.innerWidth,
        rightGroupBox: rgRect ? { x: Math.round(rgRect.x), y: Math.round(rgRect.y), w: Math.round(rgRect.width), h: Math.round(rgRect.height) } : null,
      };
    }, width);

    results.push(data);

    const status = (data.overlap || data.hasHorizontalScroll) ? 'FAIL' : 'OK';
    const linkText = data.visibleSpans.filter(s => s.display !== 'none').map(s => s.text).join(' / ');
    console.log(`| ${width} | link: ${JSON.stringify(data.linkBox)} | tag: ${JSON.stringify(data.tagBox)} | ${data.overlap ? 'OVERLAP' : 'no'} | ${linkText} | ${status} |`);

    await page.screenshot({ path: `pw-scratch/mobile-header-${width}.png`, clip: { x: 0, y: 0, width, height: 120 } });
    await page.close();
  }

  // Desktop check
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const desktop = await page.evaluate(() => {
    const header = document.querySelector('header');
    const hRect = header.getBoundingClientRect();
    const rightGroup = header.querySelector('div.flex.items-center.gap-4');
    const rRect = rightGroup ? rightGroup.getBoundingClientRect() : null;
    const link = rightGroup?.querySelector('a');
    const lRect = link ? link.getBoundingClientRect() : null;
    const lcs = link ? getComputedStyle(link) : null;
    return {
      width: 1897,
      headerH: Math.round(hRect.height),
      rightGroup: rRect ? { x: Math.round(rRect.x), y: Math.round(rRect.y), w: Math.round(rRect.width), h: Math.round(rRect.height) } : null,
      link: lRect ? { x: Math.round(lRect.x), y: Math.round(lRect.y), w: Math.round(lRect.width), h: Math.round(lRect.height), fontSize: lcs.fontSize, letterSpacing: lcs.letterSpacing } : null,
    };
  });

  console.log(`\nDesktop 1897x898: headerH=${desktop.headerH}, rightGroup=${JSON.stringify(desktop.rightGroup)}, link=${JSON.stringify(desktop.link)}`);

  await browser.close();
})();
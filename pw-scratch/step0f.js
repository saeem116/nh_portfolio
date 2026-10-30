const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const data = await page.evaluate(() => {
    const header = document.querySelector('header');
    const inner = header.querySelector('div');
    const hero = document.querySelector('main > div:nth-child(2)') || Array.from(document.querySelectorAll('main > *')).find((el,i)=>i===1);
    const sections = Array.from(document.querySelectorAll('main > *')).map(el => {
      const r = el.getBoundingClientRect();
      return { cls: el.className.slice(0,40), tag: el.tagName, y: Math.round(r.y), h: Math.round(r.height) };
    });
    const revealed = document.documentElement.dataset.revealed;
    const cs = getComputedStyle(inner);
    return {
      revealed,
      headerH: header.getBoundingClientRect().height,
      innerH: inner.getBoundingClientRect().height,
      innerCS: { pt: cs.paddingTop, pb: cs.paddingBottom, height: cs.height },
      sections,
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
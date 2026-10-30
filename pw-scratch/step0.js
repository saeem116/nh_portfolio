const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const header = await page.locator('header').first().boundingBox();
  const contact = await page.locator('#contact').boundingBox();
  const link = await page.locator('header a, header span, header button').first().boundingBox();

  // find the "Available for Freelance" element
  const freelance = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('header *'));
    const el = els.find(e => e.textContent && e.textContent.trim().includes('Available for Freelance'));
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { tag: el.tagName, text: el.textContent.trim().slice(0,40), rect: { x: r.x, y: r.y, w: r.width, h: r.height } };
  });

  const svg = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('header svg'));
    if (!els.length) return null;
    const r = els[0].getBoundingClientRect();
    return { rect: { x: r.x, y: r.y, w: r.width, h: r.height } };
  });

  const headerComputed = await page.evaluate(() => {
    const h = document.querySelector('header');
    const s = getComputedStyle(h);
    return { position: s.position, top: s.top, height: h.offsetHeight, innerHeight: window.innerHeight };
  });

  console.log(JSON.stringify({ header, contact, link, freelance, svg, headerComputed }, null, 2));

  await browser.close();
})();
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Check the link exists and is an <a>
  const linkInfo = await page.evaluate(() => {
    const a = document.querySelector('header a[href="#contact"]');
    if (!a) return null;
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    return {
      tagName: a.tagName,
      href: a.getAttribute('href'),
      text: a.textContent.trim(),
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      cs: { color: cs.color, fontSize: cs.fontSize, letterSpacing: cs.letterSpacing, fontWeight: cs.fontWeight, textTransform: cs.textTransform, cursor: cs.cursor, textDecoration: cs.textDecoration },
      parentTag: a.parentElement.tagName,
    };
  });

  // Check contact section
  const contactInfo = await page.evaluate(() => {
    const c = document.getElementById('contact');
    const cs = getComputedStyle(c);
    const r = c.getBoundingClientRect();
    return {
      id: c.id,
      tabIndex: c.tabIndex,
      outline: cs.outline,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    };
  });

  console.log('LINK:', JSON.stringify(linkInfo, null, 2));
  console.log('CONTACT:', JSON.stringify(contactInfo, null, 2));

  // Screenshot header area
  await page.screenshot({ path: 'pw-scratch/header-after.png', clip: { x: 0, y: 0, width: 1897, height: 120 } });
  await browser.close();
})();
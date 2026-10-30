const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000/#contact', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);

  const result = await page.evaluate(() => {
    const c = document.getElementById('contact');
    const r = c.getBoundingClientRect();
    const cs = getComputedStyle;
    return {
      scrollY: window.scrollY,
      hash: location.hash,
      contactRect: { y: r.y, h: r.height },
      label: { y: c.querySelector('p').getBoundingClientRect().y, opacity: cs(c.querySelector('p')).opacity },
      heading: { y: c.querySelector('h2').getBoundingClientRect().y, opacity: cs(c.querySelector('h2')).opacity },
      para: { y: c.querySelectorAll('p')[1].getBoundingClientRect().y, opacity: cs(c.querySelectorAll('p')[1]).opacity },
      qr: { y: c.querySelector('svg').getBoundingClientRect().y, opacity: cs(c.querySelector('svg')).opacity },
      email: { y: c.querySelectorAll('a')[0].getBoundingClientRect().y, opacity: cs(c.querySelectorAll('a')[0]).opacity },
      website: { y: c.querySelectorAll('a')[1].getBoundingClientRect().y, opacity: cs(c.querySelectorAll('a')[1]).opacity },
      location: { y: c.querySelectorAll('div')[2].getBoundingClientRect().y, opacity: cs(c.querySelectorAll('div')[2]).opacity },
    };
  });
  console.log('Direct #contact load:', JSON.stringify(result, null, 2));

  await browser.close();
})();
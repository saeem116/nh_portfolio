const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const historyBefore = await page.evaluate(() => window.history.length);
  const scrollYBefore = await page.evaluate(() => window.scrollY);

  // Click the link
  await page.click('header a[href="#contact"]');
  await page.waitForTimeout(200);

  // Sample scrollY every 50ms for 1.5s
  const samples = [];
  for (let i = 0; i < 30; i++) {
    const y = await page.evaluate(() => window.scrollY);
    samples.push(y);
    await page.waitForTimeout(50);
  }

  const finalY = samples[samples.length - 1];
  const distinct = [...new Set(samples)];

  const result = await page.evaluate(() => {
    const c = document.getElementById('contact');
    const r = c.getBoundingClientRect();
    const active = document.activeElement;
    const label = c.querySelector('p');
    const heading = c.querySelector('h2');
    const para = c.querySelectorAll('p')[1];
    const qr = c.querySelector('svg');
    const email = c.querySelectorAll('a')[0];
    const website = c.querySelectorAll('a')[1];
    const location = c.querySelectorAll('div')[2];
    const cs = getComputedStyle;
    return {
      locationHash: location.hash,
      historyLength: window.history.length,
      activeElementTag: active.tagName,
      activeElementId: active.id,
      scrollY: window.scrollY,
      contactRect: { y: r.y, h: r.height },
      label: { y: label.getBoundingClientRect().y, opacity: cs(label).opacity },
      heading: { y: heading.getBoundingClientRect().y, opacity: cs(heading).opacity },
      para: { y: para.getBoundingClientRect().y, opacity: cs(para).opacity },
      qr: { y: qr.getBoundingClientRect().y, opacity: cs(qr).opacity },
      email: { y: email.getBoundingClientRect().y, opacity: cs(email).opacity },
      website: { y: website.getBoundingClientRect().y, opacity: cs(website).opacity },
      location: { y: location.getBoundingClientRect().y, opacity: cs(location).opacity },
    };
  });

  console.log(JSON.stringify({
    historyBefore, scrollYBefore,
    samples: samples.slice(0, 15),
    distinctCount: distinct.length,
    finalY,
    result,
  }, null, 2));

  await browser.close();
})();
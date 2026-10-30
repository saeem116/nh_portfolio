const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ hasTouch: true });
  const page = await context.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // Test scroll behavior
  const historyBefore = await page.evaluate(() => window.history.length);
  const scrollYBefore = await page.evaluate(() => window.scrollY);

  // Tap the link
  await page.tap('header a[href="#contact"]');
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

    return {
      locationHash: location.hash,
      historyLength: window.history.length,
      activeElementTag: active.tagName,
      activeElementId: active.id,
      scrollY: window.scrollY,
      contactRect: { y: r.y, h: r.height },
      label: { y: label.getBoundingClientRect().y },
      heading: { y: heading.getBoundingClientRect().y },
      para: { y: para.getBoundingClientRect().y },
      qr: { y: qr.getBoundingClientRect().y },
      email: { y: email.getBoundingClientRect().y },
      website: { y: website.getBoundingClientRect().y },
      location: { y: location.getBoundingClientRect().y },
      labelOpacity: getComputedStyle(label).opacity,
      headingOpacity: getComputedStyle(heading).opacity,
      paraOpacity: getComputedStyle(para).opacity,
      qrOpacity: getComputedStyle(qr).opacity,
      emailOpacity: getComputedStyle(email).opacity,
      websiteOpacity: getComputedStyle(website).opacity,
      locationOpacity: getComputedStyle(location).opacity,
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
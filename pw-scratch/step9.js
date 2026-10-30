const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Test that existing features still work
  const checks = await page.evaluate(() => {
    const checks = [];
    // Check hero exists
    const hero = document.querySelector('main > section:nth-child(2)');
    checks.push({ name: 'hero', exists: !!hero });
    // Check projects section
    const projects = document.querySelectorAll('.section.border-b').length;
    checks.push({ name: 'projects_section', count: projects });
    // Check about
    const about = document.querySelector('.section.border-t:not(.bg-warm-ivory)');
    checks.push({ name: 'about_section', exists: !!about });
    // Check contact
    const contact = document.getElementById('contact');
    checks.push({ name: 'contact', exists: !!contact });
    // Check footer
    const footer = document.querySelector('footer');
    checks.push({ name: 'footer', exists: !!footer });
    // Check no horizontal scrollbar
    checks.push({ name: 'no_horizontal_scroll', hasScroll: document.body.scrollWidth > document.documentElement.clientWidth });
    return checks;
  });
  console.log(JSON.stringify(checks, null, 2));

  await browser.close();
})();
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Test keyboard: Tab to link and press Enter
  await page.keyboard.press('Tab');
  await page.waitForTimeout(100);
  const focus1 = await page.evaluate(() => document.activeElement.tagName + (document.activeElement.id ? '#'+document.activeElement.id : ''));
  console.log('After first Tab:', focus1);

  await page.keyboard.press('Tab');
  await page.waitForTimeout(100);
  const focus2 = await page.evaluate(() => document.activeElement.tagName + (document.activeElement.id ? '#'+document.activeElement.id : ''));
  console.log('After second Tab:', focus2);

  // Press Enter on the link
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1500);
  const afterEnter = await page.evaluate(() => ({ y: window.scrollY, active: document.activeElement.id, hash: location.hash }));
  console.log('After Enter:', JSON.stringify(afterEnter));

  await browser.close();
})();
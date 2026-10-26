import { test, expect } from "@playwright/test";

test("About heading and terracotta span colors", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2000);

  const h2 = await page.locator("#about h2").first();
  const h2Color = await h2.evaluate(el => window.getComputedStyle(el).color);
  const spanColor = await h2.locator("span").evaluate(el => window.getComputedStyle(el).color);

  console.log(`h2 color: ${h2Color}`);
  console.log(`span color: ${spanColor}`);

  // Main heading should be dark ink (#111)
  expect(h2Color).toBe("rgb(17, 17, 17)");
  // Terracotta span should be terracotta color (#C4694B)
  expect(spanColor).toBe("rgb(196, 105, 75)");
});
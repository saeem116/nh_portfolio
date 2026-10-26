import { test, expect } from "@playwright/test";

test("About heading color check", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2000);

  const aboutHeading = await page.locator("#about h2").first();
  const color = await aboutHeading.evaluate(el => window.getComputedStyle(el).color);
  const classList = await aboutHeading.evaluate(el => el.className);
  console.log(`About heading color: ${color}`);
  console.log(`About heading classes: ${classList}`);

  // Should be dark (#111 = rgb(17,17,17)), not white
  expect(color).not.toBe("rgb(255, 255, 255)");
  expect(color).toBe("rgb(17, 17, 17)");
});
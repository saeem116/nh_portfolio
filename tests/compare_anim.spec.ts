import { test, expect } from "@playwright/test";

test.describe("Animation verification", () => {
  test("hero animations show content at 1600ms vs 0ms", async ({ page }) => {
    await page.goto("/");
    await page.screenshot({ path: "tests/screenshots/anim-0ms.png" });

    await page.waitForTimeout(1600);
    await page.screenshot({ path: "tests/screenshots/anim-1600ms.png" });

    // Read and compare images
    const fs = require('fs');
    const img0 = fs.readFileSync("tests/screenshots/anim-0ms.png");
    const img1 = fs.readFileSync("tests/screenshots/anim-1600ms.png");

    // Images should be different (animation occurred)
    expect(img0.toString('hex')).not.toEqual(img1.toString('hex'));
  });

  test("portrait is visible at end", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    const portrait = page.locator('img[data-anim="up"][data-group="load"]');
    await expect(portrait).toBeVisible();
  });

  test("hero section has correct load animation attributes", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    const stage = page.locator('[data-group="load"]');
    const attrs = await stage.count();
    expect(attrs).toBeGreaterThan(0);
  });

  test("scroll reveal elements have correct attributes", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    // Check that About section exists and has reveal attributes
    const about = page.locator("#about");
    await expect(about).toBeVisible();

    // Check scroll reveal elements
    const scrollElements = page.locator('[data-reveal]');
    expect(await scrollElements.count()).toBeGreaterThan(0);
  });

  test("no console errors during animation", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", msg => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForTimeout(2500);

    expect(errors).toHaveLength(0);
  });
});
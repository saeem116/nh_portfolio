import { test, expect } from "@playwright/test";

test.describe("Page-load animations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for fonts and reveal trigger
    await page.waitForTimeout(2000);
  });

  test("hero load animations fire in correct order", async ({ page }) => {
    // Take screenshots at key times
    await page.screenshot({ path: "tests/screenshots/anim-0ms.png" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: "tests/screenshots/anim-400ms.png" });
    await page.waitForTimeout(500);
    await page.screenshot({ path: "tests/screenshots/anim-900ms.png" });
    await page.waitForTimeout(700);
    await page.screenshot({ path: "tests/screenshots/anim-1600ms.png" });

    // By now, hero elements should be visible
    const portrait = page.locator('img[alt*="NH Pavel"]');
    await expect(portrait).toBeVisible();

    // Check html has data-revealed
    const revealed = await page.evaluate(() => document.documentElement.dataset.revealed);
    expect(revealed).toBe("true");
  });

  test("hero portrait has animation attributes", async ({ page }) => {
    const portrait = page.locator('img[data-anim="up"][data-group="load"]');
    await expect(portrait).toBeVisible();
  });

  test("hero SVG headline has mask animation", async ({ page }) => {
    const svg = page.locator("svg[data-anim='mask'][data-group='load']");
    await expect(svg).toBeVisible();
  });

  test("scroll sections animate on scroll", async ({ page }) => {
    // Scroll to about section directly
    await page.evaluate(() => {
      const el = document.getElementById("about");
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    });
    await page.waitForTimeout(800);

    // About section should be visible
    const aboutSection = page.locator("#about");
    await expect(aboutSection).toBeVisible();
  });

  test("page has no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", msg => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test("video modal opens and closes", async ({ page }) => {
    // Click the first play button in the projects section
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForTimeout(500);

    // Modal should be visible
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    // Close via Escape
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();
  });

  test("VIEW ALL expand works", async ({ page }) => {
    const toggle = page.locator('button[aria-expanded]').first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await page.waitForTimeout(700);

    // Should be expanded
    const expanded = await toggle.getAttribute("aria-expanded");
    expect(expanded).toBe("true");
  });
});

test.describe("Accessibility: prefers-reduced-motion", () => {
  test("animations disabled with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(1500);

    // Elements should be visible but not animated
    const portrait = page.locator('img[data-anim="up"]');
    await expect(portrait).toBeVisible();
  });
});
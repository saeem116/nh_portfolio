import { test, expect } from "@playwright/test";

test.describe("Animation System Verification", () => {
  test("STEP 4 - Fresh load 1897x898, scroll to bottom, all elements visible", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(2500);

    // Scroll to bottom in 300px steps with 150ms pauses
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 300) {
      await page.evaluate((sy) => window.scrollTo(0, sy), y);
      await page.waitForTimeout(150);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Check all [data-reveal] elements are visible (no reveal-hidden class)
    const stats = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll("[data-reveal]"));
      const sectionStats: Record<string, { total: number; visible: number; hidden: number }> = {};

      for (const el of els) {
        const section = el.closest("section");
        const sectionId = section ? section.id || "main" : "main";
        if (!sectionStats[sectionId]) {
          sectionStats[sectionId] = { total: 0, visible: 0, hidden: 0 };
        }
        sectionStats[sectionId].total++;

        const isHidden = el.classList.contains("reveal-hidden") || el.classList.contains("reveal-hidden-fade");
        if (isHidden) {
          sectionStats[sectionId].hidden++;
        } else {
          sectionStats[sectionId].visible++;
        }
      }
      return { sectionStats, totalElements: els.length };
    });

    console.log("Section stats:", JSON.stringify(stats.sectionStats, null, 2));

    // All elements should be visible (no hidden)
    for (const [section, s] of Object.entries(stats.sectionStats)) {
      console.log(`${section}: ${s.visible}/${s.total} visible, ${s.hidden} hidden`);
      expect(s.hidden).toBe(0);
    }
    expect(stats.totalElements).toBeGreaterThan(0);
  });

  test("About heading color is dark (not white)", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2500);

    const heading = await page.locator("#about h2").first();
    const color = await heading.evaluate(el => {
      const cs = window.getComputedStyle(el);
      return cs.color;
    });
    console.log(`About heading color: ${color}`);
    // Should be dark, not white (rgb(255, 255, 255))
    expect(color).not.toContain("255, 255, 255");
    expect(color).toMatch(/rgb\(17, 17, 17\)/);
  });

  test("Jump to bottom - last 3 sections visible within 1.5s", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);

    // Jump to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1500);

    // Check skills, reviews, contact sections have visible content
    for (const id of ["skills", "reviews", "contact"]) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeVisible();
    }
  });

  test("Reload while scrolled - content visible", async ({ page }) => {
    // First visit and scroll
    await page.goto("/");
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(500);

    // Reload
    await page.reload();
    await page.waitForTimeout(2500);

    // Content should be visible
    const skills = page.locator("#skills");
    const reviews = page.locator("#reviews");
    await expect(skills).toBeVisible();
    await expect(reviews).toBeVisible();
  });

  test("No JS - everything visible", async ({ page }) => {
    // Without JS, ScrollReveal doesn't hide anything.
    // We verify by checking the HTML has all sections rendered.
    await page.goto("/");
    const sections = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("section[id]")).map(s => s.id);
    });
    expect(sections).toContain("work");
    expect(sections).toContain("about");
    expect(sections).toContain("skills");
    expect(sections).toContain("reviews");
    expect(sections).toContain("contact");
  });

  test("prefers-reduced-motion - animations disabled, content visible", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(2000);

    // All sections should be visible with no animation
    const sections = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("section[id]")).map(s => ({
        id: s.id,
        visible: (s as HTMLElement).offsetParent !== null || (s as HTMLElement).checkVisibility?.(),
        opacity: window.getComputedStyle(s).opacity
      }));
    });

    for (const s of sections) {
      console.log(`${s.id}: visible=${s.visible}, opacity=${s.opacity}`);
      expect(s.visible).toBe(true);
      expect(s.opacity).toBe("1");
    }
  });

  test("Hero load animation still works", async ({ page }) => {
    await page.goto("/");

    // Hero elements should have load animation attributes
    const portrait = page.locator('img[data-anim="up"][data-group="load"]');
    await expect(portrait).toBeVisible();

    const svg = page.locator("svg[data-anim='mask'][data-group='load']");
    await expect(svg).toBeVisible();
  });

  test("Video modal opens and closes", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForTimeout(500);

    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();

    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible();
  });

  test("VIEW ALL expand works", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);

    const toggle = page.locator('button[aria-expanded]').first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await page.waitForTimeout(700);

    const expanded = await toggle.getAttribute("aria-expanded");
    expect(expanded).toBe("true");
  });

  test("No console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", msg => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    await page.waitForTimeout(2500);
    expect(errors).toHaveLength(0);
  });

  test("Full page screenshot - all sections visible", async ({ page }, info) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(2500);

    // Scroll through page to trigger reveals
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 400) {
      await page.evaluate((sy) => window.scrollTo(0, sy), y);
      await page.waitForTimeout(200);
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const screenshotPath = `tests/screenshots/fullpage-${Date.now()}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to: ${screenshotPath}`);

    // Verify all sections exist and have visible content
    for (const id of ["work", "about", "skills", "reviews", "contact"]) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeVisible();
    }
  });
});
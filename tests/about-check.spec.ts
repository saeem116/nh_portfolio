import { test, expect } from "@playwright/test";

test.describe("About section color verification", () => {
  test("1897x898 screenshot after scroll", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(2000);
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    const path = "tests/screenshots/about-1897.png";
    await page.screenshot({ path, fullPage: false });
    console.log("Screenshot:", path);
  });

  test("390x844 screenshot after scroll", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForTimeout(2000);
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    const path = "tests/screenshots/about-390.png";
    await page.screenshot({ path, fullPage: false });
    console.log("Screenshot:", path);
  });

  test("computed colors and WCAG contrast", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(2000);
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    const results = await page.evaluate(() => {
      function parseColor(c: string): [number, number, number, number] {
        // Handle rgba(r, g, b, a) and rgb(r, g, b)
        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!m) return [0, 0, 0, 1];
        return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseFloat(m[4] || "1")];
      }

      function luminance(r: number, g: number, b: number): number {
        const [rs, gs, bs] = [r/255, g/255, b/255].map(c =>
          c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        );
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }

      function contrastRatio(color1: string, color2: string): number {
        const [r1, g1, b1, a1] = parseColor(color1);
        const [r2, g2, b2, a2] = parseColor(color2);
        // Composite on white if semi-transparent
        const r = Math.round(r1 * a1 + r2 * a2 * (1 - a1));
        const g = Math.round(g1 * a1 + g2 * a2 * (1 - a1));
        const b = Math.round(b1 * a1 + b2 * a2 * (1 - a1));
        const l1 = luminance(r, g, b);
        const l2 = luminance(r2, g2, b2);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }

      const bg = "#111111";
      const checks: {el: string; color: string; contrast: number; pass: string}[] = [];

      const add = (label: string, el: Element | null, type: 'heading' | 'body' | 'small') => {
        if (!el) return;
        const cs = window.getComputedStyle(el);
        const c = cs.color;
        const ratio = contrastRatio(c, bg);
        const min = type === 'heading' ? 3 : 4.5;
        checks.push({ el: label, color: c, contrast: +ratio.toFixed(2), pass: ratio >= min ? "PASS" : "FAIL" });
      };

      add("ABOUT label", document.querySelector("#about p.text-terracotta"), "small");
      add("CRAFTING DIGITAL heading", document.querySelector("#about h2 span:first-of-type"), "heading");
      add("EXPERIENCES span", document.querySelector("#about h2 span.text-terracotta"), "heading");
      add("Paragraph", document.querySelector("#about p[style*='D6D0C6']"), "body");
      add("CAPABILITIES label", document.querySelectorAll("#about [style*='rgba']")[0], "small");
      add("TOOLS label", document.querySelectorAll("#about [style*='rgba']")[1], "small");
      add("BASED IN label", document.querySelector("#about [class*='border-t'] p:first-of-type"), "small");
      add("Remote Worldwide", document.querySelector("#about [class*='border-t'] p:last-of-type"), "body");
      add("Capability tag sample", document.querySelector("#about .about-tag"), "body");
      const tags = document.querySelectorAll("#about .about-tag");
      add("Tool tag sample", tags[tags.length - 1], "body");

      return checks;
    });

    for (const r of results) {
      console.log(`${r.el}: color=${r.color} contrast=${r.contrast} ${r.pass}`);
    }

    for (const r of results) {
      expect(r.pass).toBe("PASS");
    }
  });

  test("full-bleed background at 1897px", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(2000);
    const about = page.locator("#about");
    await about.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const rect = await about.evaluate(el => {
      const r = el.getBoundingClientRect();
      return { width: r.width, left: r.left };
    });
    console.log(`About section: left=${rect.left}, width=${rect.width}, viewport=${page.viewportSize()?.width}`);
    const bgColor = await about.evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log(`About bg color: ${bgColor}`);
    expect(bgColor).toContain("17, 17, 17");
  });

  test("tag rows look identical", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(2000);
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const tags = await page.locator("#about .about-tag").all();
    for (let i = 0; i < tags.length; i++) {
      const style = await tags[i].evaluate(el => {
        const cs = window.getComputedStyle(el);
        return { bg: cs.backgroundColor, border: cs.borderTopColor, color: cs.color };
      });
      console.log(`Tag ${i}: bg=${style.bg} border=${style.border} color=${style.color}`);
      // All tags should have consistent styling
      // bg should be transparent (rgba(0,0,0,0)) per spec
      expect(style.bg).toContain("rgba(0, 0, 0, 0)");
      expect(style.border).toContain("rgba(245, 240, 232, 0.3)");
    }
  });

  test("sections above and below unchanged", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(2000);

    const workBg = await page.locator("#work").evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log(`Work bg: ${workBg}`);
    expect(workBg).toContain("245, 240, 232");

    const skillsBg = await page.locator("#skills").evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log(`Skills bg: ${skillsBg}`);
    expect(skillsBg).toContain("245, 240, 232");
  });
});
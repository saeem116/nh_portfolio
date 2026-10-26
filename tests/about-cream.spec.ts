import { test, expect } from "@playwright/test";

test.describe("About section cream theme verification", () => {
  test("screenshots at 1897x898 and 390x844", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(2000);
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "tests/screenshots/about-1897.png", fullPage: false });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForTimeout(2000);
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "tests/screenshots/about-390.png", fullPage: false });
  });

  test("background color continuity", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(2000);

    const colors = await page.evaluate(() => {
      function hex(c: string) {
        const m = c.match(/rgba?\((\d+)\s*[,/\s]\s*(\d+)\s*[,/\s]\s*(\d+)/);
        if (!m) return c;
        const [r, g, b] = m.slice(1, 4).map(Number);
        return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
      }

      const work = document.querySelector("#work");
      const about = document.querySelector("#about");
      const skills = document.querySelector("#skills");

      const sample = (el: Element | null): string => {
        if (!el) return "";
        // Get the actual rendered background color by walking up the DOM
        let current: Element | null = el;
        while (current) {
          const bg = window.getComputedStyle(current).backgroundColor;
          if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") {
            return bg;
          }
          current = current.parentElement;
        }
        return window.getComputedStyle(document.body).backgroundColor;
      };

      return {
        above: hex(sample(work)),
        inside: hex(sample(about)),
        below: hex(sample(skills)),
        aboveRaw: sample(work),
        insideRaw: sample(about),
        belowRaw: sample(skills),
      };
    });

    console.log(`Above About: ${colors.aboveRaw} (${colors.above})`);
    console.log(`Inside About: ${colors.insideRaw} (${colors.inside})`);
    console.log(`Below About: ${colors.belowRaw} (${colors.below})`);

    expect(colors.above.toLowerCase()).toBe("#f5f0e8");
    expect(colors.inside.toLowerCase()).toBe("#f5f0e8");
    expect(colors.below.toLowerCase()).toBe("#f5f0e8");
  });

  test("text colors and WCAG contrast", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(2000);
    await page.locator("#about").scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    const results = await page.evaluate(() => {
      function parseColor(c: string): [number, number, number, number] {
        // Handle both "rgb(r, g, b)" and "rgb(r g b / a)" formats
        const m = c.match(/rgba?\((\d+)\s*[,/\s]\s*(\d+)\s*[,/\s]\s*(\d+)(?:\s*[,/\s]\s*([\d.]+))?\)/);
        if (!m) return [0, 0, 0, 1];
        return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3]), parseFloat(m[4] || "1")];
      }

      function srgbToLinear(c: number): number {
        const cs = c / 255;
        return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
      }

      function luminance(r: number, g: number, b: number): number {
        return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
      }

      function contrastRatio(fg: string, bg: string): number {
        const [r1, g1, b1, a1] = parseColor(fg);
        const [r2, g2, b2, a2] = parseColor(bg);
        // Composite fg over bg
        const r = Math.round(r1 * a1 + r2 * a2 * (1 - a1));
        const g = Math.round(g1 * a1 + g2 * a2 * (1 - a1));
        const b = Math.round(b1 * a1 + b2 * a2 * (1 - a1));
        const l1 = luminance(r, g, b);
        const l2 = luminance(r2, g2, b2);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }

      const bg = "rgb(245, 240, 232)"; // #F5F0E8
      const checks: {el: string; color: string; bg: string; contrast: number; min: number; pass: string}[] = [];

      const add = (label: string, el: Element | null, type: 'heading' | 'body' | 'small') => {
        if (!el) return;
        const cs = window.getComputedStyle(el);
        const c = cs.color;
        const ratio = contrastRatio(c, bg);
        const min = type === 'heading' ? 3 : 4.5;
        checks.push({ el: label, color: c, bg, contrast: +ratio.toFixed(2), min, pass: ratio >= min ? "PASS" : "FAIL" });
      };

      add("ABOUT label", document.querySelector("#about p.text-terracotta"), "heading");
      add("CRAFTING DIGITAL heading", document.querySelector("#about h2"), "heading");
      add("EXPERIENCES span", document.querySelector("#about h2 span.text-terracotta"), "heading");
      add("Paragraph", document.querySelector("#about p[style*='444444']"), "body");
      add("CAPABILITIES label", document.querySelectorAll("#about [style*='333333']")[0], "small");
      add("TOOLS label", document.querySelectorAll("#about [style*='333333']")[1], "small");
      add("BASED IN label", document.querySelector("#about [style*='D9D2C5'] p:first-of-type"), "small");
      add("Remote Worldwide", document.querySelector("#about [style*='D9D2C5'] p:last-of-type"), "body");
      add("Capability tag sample", document.querySelector("#about .about-tag"), "body");
      const tags = document.querySelectorAll("#about .about-tag");
      add("Tool tag sample", tags[tags.length - 1], "body");

      return checks;
    });

    for (const r of results) {
      console.log(`${r.el}: color=${r.color} bg=${r.bg} contrast=${r.contrast}:1 (min ${r.min}:1) ${r.pass}`);
    }

    for (const r of results) {
      expect(r.pass).toBe("PASS");
    }
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
      expect(style.bg).toContain("rgba(17, 17, 17, 0.03)");
      expect(style.border).toContain("208, 201, 188"); // #D0C9BC
      expect(style.color).toContain("51, 51, 51"); // #333333
    }
  });

  test("other sections unchanged", async ({ page }) => {
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
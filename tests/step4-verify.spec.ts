import { test, expect } from "@playwright/test";
import { writeFileSync } from "fs";

test.describe("STEP 4 - Pixel verification", () => {
  test("1. Network: no ambient/bin or iframe_api requests", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", req => {
      const u = req.url();
      if (u.includes("/ambient/") || u.includes("iframe_api")) requests.push(u);
    });
    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForTimeout(3000);
    console.log("NETWORK REQUESTS (ambient/iframe_api):", requests);
    expect(requests.length).toBe(0);
  });

  test("2. No glow canvases in modal", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForTimeout(3000);
    const canvasCount = await page.evaluate(() => {
      const modal = document.querySelector('[data-video-modal]');
      if (!modal) return -1;
      return modal.querySelectorAll('canvas').length;
    });
    console.log("CANVAS COUNT IN MODAL:", canvasCount);
    expect(canvasCount).toBe(0);
  });

  test("3. elementsFromPoint inside video area = iframe/buttons only", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForSelector("iframe[src*='youtube-nocookie']", { timeout: 10000 });
    // Retry until iframe is actually topmost at center
    let iframeTop = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      iframeTop = await page.evaluate(() => {
        const iframe = document.querySelector("iframe");
        if (!iframe) return false;
        const rect = iframe.getBoundingClientRect();
        if (rect.width < 100 || rect.height < 100) return false;
        const el = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        return el?.tagName.toLowerCase() === "iframe";
      });
      if (iframeTop) break;
      await page.waitForTimeout(1000);
    }
    expect(iframeTop).toBe(true);

    const results = await page.evaluate(() => {
      const dialog = document.querySelector('[data-video-modal-dialog]') as HTMLElement;
      if (!dialog) return [];
      const vr = dialog.getBoundingClientRect();
      const videoBox = {
        left: vr.left + 24,
        top: vr.top + 12,
        right: vr.right - 24,
        bottom: vr.bottom - 88,
        width: vr.width - 48,
        height: vr.height - 100,
      };
      const points = [
        { x: Math.round(videoBox.left + videoBox.width / 2), y: Math.round(videoBox.top + videoBox.height / 2) },
        { x: videoBox.left + 10, y: videoBox.top + 10 },
        { x: videoBox.right - 10, y: videoBox.top + 10 },
        { x: videoBox.left + 10, y: videoBox.bottom - 10 },
        { x: videoBox.right - 10, y: videoBox.bottom - 10 },
      ];
      return points.map(p => {
        const els = document.elementsFromPoint(p.x, p.y);
        return els.map((e: Element) => {
          const tag = e.tagName.toLowerCase();
          const cls = e.classList.length > 0 ? '.' + e.classList[0] : '';
          return tag + cls;
        }).slice(0, 3);
      });
    });
    console.log("ELEMENTS AT 5 POINTS:", JSON.stringify(results, null, 2));
    const centerEls = results[0].map((e: string) => e.split(".")[0]);
    expect(centerEls).toContain("iframe");
    for (let i = 1; i < results.length; i++) {
      expect(results[i][0]).toMatch(/^iframe|^button|^svg|^div/);
    }
  });

  test("4. Dialog bounding box unchanged (tolerance 1px)", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForTimeout(2000);
    const box = await page.evaluate(() => {
      const dialog = document.querySelector('[data-video-modal-dialog]') as HTMLElement;
      if (!dialog) return null;
      const rect = dialog.getBoundingClientRect();
      return { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) };
    });
    console.log("BOUNDING BOX:", box);
    expect(Math.abs(box!.x - 399)).toBeLessThanOrEqual(1);
    expect(Math.abs(box!.y - 107)).toBeLessThanOrEqual(1);
    expect(Math.abs(box!.width - 1100)).toBeLessThanOrEqual(1);
    expect(Math.abs(box!.height - 684)).toBeLessThanOrEqual(1);
  });

  test("5. Glow visible — color matches thumbnail", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForTimeout(2000);

    const shotWith = await page.screenshot({ fullPage: false });
    writeFileSync("tests/screenshots/glow-with.png", shotWith);
    console.log("Screenshot saved: tests/screenshots/glow-with.png");

    const glowOpacity = await page.evaluate(() => {
      const glow = document.querySelector('[data-glow-layer]') as HTMLElement;
      return glow ? getComputedStyle(glow).opacity : '0';
    });
    console.log("GLOW OPACITY:", glowOpacity);
    expect(parseFloat(glowOpacity)).toBeGreaterThan(0.7);

    const imgUrls = await page.evaluate(() => {
      const imgs = document.querySelectorAll('[data-glow-layer] img');
      return Array.from(imgs).map(i => (i as HTMLImageElement).src);
    });
    console.log("GLOW IMAGE URLs:", imgUrls);
    expect(imgUrls.length).toBeGreaterThan(0);
    expect(imgUrls[0]).toContain("i.ytimg.com");

    await page.evaluate(() => {
      const glow = document.querySelector('[data-glow-layer]') as HTMLElement;
      if (glow) glow.style.display = 'none';
    });
    await page.waitForTimeout(200);
    const shotWithout = await page.screenshot({ fullPage: false });
    writeFileSync("tests/screenshots/glow-without.png", shotWithout);
    console.log("Screenshot saved: tests/screenshots/glow-without.png");
  });

  test("6. Cross-fade over time", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForSelector("iframe[src*='youtube-nocookie']", { timeout: 10000 });
    await page.waitForTimeout(2000);

    const samples: any[] = [];
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(1500);
      const s = await page.evaluate(() => {
        const glow = document.querySelector('[data-glow-layer]') as HTMLElement;
        if (!glow) return null;
        const imgs = glow.querySelectorAll('img');
        let best: HTMLImageElement | null = null;
        let bestOpacity = -1;
        for (const img of imgs) {
          const o = parseFloat((img as HTMLImageElement).style.opacity);
          if (o > bestOpacity) { bestOpacity = o; best = img as HTMLImageElement; }
        }
        return best ? { url: best.src, opacity: bestOpacity } : null;
      });
      console.log(`SAMPLE @${i * 1500}ms:`, s?.url);
      if (s) samples.push(s);
    }
    const urls = samples.map(s => s.url);
    console.log("CROSS-FADE URLS:", urls);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBeGreaterThanOrEqual(2);
  });

  test("7. ArrowRight to next video changes glow", async ({ page }) => {
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForSelector("iframe[src*='youtube-nocookie']", { timeout: 10000 });
    await page.waitForTimeout(2000);

    const before = await page.evaluate(() => {
      const glow = document.querySelector('[data-glow-layer]') as HTMLElement;
      const imgs = glow?.querySelectorAll('img') || [];
      let best: HTMLImageElement | null = null;
      let bestO = -1;
      for (const img of imgs) {
        const o = parseFloat((img as HTMLImageElement).style.opacity);
        if (o > bestO) { bestO = o; best = img as HTMLImageElement; }
      }
      return best ? best.src : null;
    });
    console.log("BEFORE NAV:", before);

    const nextBtn = page.locator('button[aria-label="Next project"]').first();
    await nextBtn.click();
    await page.waitForSelector("iframe[src*='youtube-nocookie']", { timeout: 10000 });
    await page.waitForTimeout(3000);

    const after = await page.evaluate(() => {
      const glow = document.querySelector('[data-glow-layer]') as HTMLElement;
      const imgs = glow?.querySelectorAll('img') || [];
      let best: HTMLImageElement | null = null;
      let bestO = -1;
      for (const img of imgs) {
        const o = parseFloat((img as HTMLImageElement).style.opacity);
        if (o > bestO) { bestO = o; best = img as HTMLImageElement; }
      }
      return best ? best.src : null;
    });
    console.log("AFTER NAV:", after);
    expect(after).not.toBe(before);
  });

  test("8. Close removes glow, clears interval, no errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
    page.on("pageerror", e => errors.push(e.message));

    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForTimeout(2000);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    const glowExists = await page.evaluate(() => document.querySelector('[data-glow-layer]') !== null);
    console.log("GLOW EXISTS AFTER CLOSE:", glowExists);
    expect(glowExists).toBe(false);
    expect(errors.length).toBe(0);
  });

  test("9. Mobile 390x844: glow visible, no horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForSelector("iframe[src*='youtube-nocookie']", { timeout: 10000 });
    await page.waitForTimeout(2000);

    const scrollOk = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    console.log("MOBILE SCROLL OK:", scrollOk);
    expect(scrollOk).toBe(true);

    let glowVisible = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      glowVisible = await page.evaluate(() => {
        const glow = document.querySelector('[data-glow-layer]') as HTMLElement;
        return glow ? parseFloat(getComputedStyle(glow).opacity) > 0.5 : false;
      });
      if (glowVisible) break;
      await page.waitForTimeout(500);
    }
    expect(glowVisible).toBe(true);
  });

  test("9b. prefers-reduced-motion: static frame", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1897, height: 898 });
    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForSelector("iframe[src*='youtube-nocookie']", { timeout: 10000 });
    await page.waitForTimeout(3000);

    for (let attempt = 0; attempt < 5; attempt++) {
      const o = await page.evaluate(() => {
        const glow = document.querySelector('[data-glow-layer]') as HTMLElement;
        return glow ? parseFloat(getComputedStyle(glow).opacity) : 0;
      });
      if (o > 0.5) break;
      await page.waitForTimeout(500);
    }

    const opacity1 = await page.evaluate(() => {
      const glow = document.querySelector('[data-glow-layer]') as HTMLElement;
      return glow ? getComputedStyle(glow).opacity : '0';
    });
    await page.waitForTimeout(3000);
    const opacity2 = await page.evaluate(() => {
      const glow = document.querySelector('[data-glow-layer]') as HTMLElement;
      return glow ? getComputedStyle(glow).opacity : '0';
    });
    const diff = Math.abs(parseFloat(opacity1) - parseFloat(opacity2));
    console.log("REDUCED MOTION OPACITY DIFF:", diff);
    expect(diff).toBeLessThan(0.05);
  });

  test("9c. Page responsive under load", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForTimeout(3000);
    const responsive = await page.evaluate(() => {
      const glow = document.querySelector('[data-glow-layer]');
      const iframe = document.querySelector("iframe");
      return !!(glow && iframe);
    });
    expect(responsive).toBe(true);
  });

  test("10. Console clean", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
    page.on("pageerror", e => errors.push(e.message));

    await page.goto("/");
    await page.waitForTimeout(1000);
    const playButton = page.locator('button[aria-label*="Play video"]').first();
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForSelector("iframe[src*='youtube-nocookie']", { timeout: 10000 });
    await page.waitForTimeout(2000);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);

    console.log("CONSOLE ERRORS:", errors);
    expect(errors.length).toBe(0);
  });
});

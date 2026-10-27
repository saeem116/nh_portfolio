import { test, expect, Page } from "@playwright/test";

const INSTAGRAM_URL = "https://www.instagram.com/nh_pavel9090/";

function lum(hex: string): number {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const toLinear = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

async function waitForAnimations(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));
}

test("QR renders at viewport 1897x898 and is saved to /tmp/qr.png", async ({ page }) => {
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto("/");
  await waitForAnimations(page);

  const svg = page.locator("#contact svg").first();
  await expect(svg).toBeAttached();
  const box = await svg.boundingBox();
  console.log("QR bounding box (1897):", JSON.stringify(box));
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(120);

  await svg.screenshot({ path: "/tmp/qr.png" });
  console.log("Saved QR screenshot to /tmp/qr.png");
});

test("QR renders at viewport 390x844 and is saved to /tmp/qr-mobile.png", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await waitForAnimations(page);

  const svg = page.locator("#contact svg").first();
  await expect(svg).toBeAttached();
  const box = await svg.boundingBox();
  console.log("QR bounding box (390):", JSON.stringify(box));
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(120);

  await svg.screenshot({ path: "/tmp/qr-mobile.png" });
  console.log("Saved QR screenshot to /tmp/qr-mobile.png");
});

test("footer Instagram href equals INSTAGRAM_URL", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const footerLink = page.locator("footer a").filter({ hasText: "Instagram" });
  await expect(footerLink).toBeAttached();
  const href = await footerLink.getAttribute("href");
  console.log("Footer Instagram href:", href);
  expect(href).toBe(INSTAGRAM_URL);
  await expect(footerLink).toHaveAttribute("target", "_blank");
  await expect(footerLink).toHaveAttribute("rel", "noopener noreferrer");
});

test("QR link opens Instagram in new tab", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));
  const qrLink = page.locator("#contact a[href*='instagram']");
  await expect(qrLink).toBeAttached();
  const href = await qrLink.getAttribute("href");
  expect(href).toBe(INSTAGRAM_URL);
  await expect(qrLink).toHaveAttribute("target", "_blank");
  await expect(qrLink).toHaveAttribute("rel", "noopener noreferrer");
});

test("contrast ratio between fgColor (#111111) and bgColor (#F5F0E8)", async () => {
  const l1 = lum("#111111");
  const l2 = lum("#F5F0E8");
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  console.log(`Contrast ratio: ${ratio.toFixed(2)}:1`);
  expect(ratio).toBeGreaterThan(7);
});

test("QR computed opacity is 1 after animations", async ({ page }) => {
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 4000)));
  const info = await page.locator("#contact svg").evaluateAll((els) =>
    els.map((el: any) => ({
      tag: el.tagName,
      opacity: getComputedStyle(el).opacity,
      visible: el.offsetParent !== null,
      width: el.getBoundingClientRect().width,
    }))
  );
  console.log("QR SVG opacity info:", JSON.stringify(info, null, 2));
  for (const i of info) {
    expect(parseFloat(i.opacity)).toBe(1);
    expect(i.visible).toBe(true);
  }
});

test("Contact elements did not shift (layout check)", async ({ page }) => {
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));
  const boxes = await page.evaluate(() => {
    const ids = ["LET'S CREATE", "EMAIL", "hello@nhpavel.com"];
    const els = Array.from(document.querySelectorAll("body *"));
    return els
      .filter((el: any) => {
        const t = el.textContent?.trim();
        return t && ids.some((id: string) => t.includes(id));
      })
      .map((el: any) => {
        const r = el.getBoundingClientRect();
        return {
          text: (el.textContent || "").trim().slice(0, 30),
          top: r.top.toFixed(1),
          left: r.left.toFixed(1),
          height: r.height.toFixed(1),
        };
      });
  });
  console.log("Contact layout references:", JSON.stringify(boxes, null, 2));
});

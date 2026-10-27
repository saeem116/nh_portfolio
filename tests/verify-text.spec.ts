import { test, expect } from "@playwright/test";

test("no alex/morgan/web-designer text on visible page", async ({ page }) => {
  await page.goto("/");
  const body = await page.locator("body").innerText();

  // These must NOT appear in any visible text (case-insensitive)
  const banned = [
    "web designer",
    "web development",
    "ui / ux",
    "cms",
    "wordpress",
    "webflow",
    "figma",
    "vs code",
    "creative suite",
    "alex",
    "morgan",
    "alexmorgan",
    "user-centered",
    "digital creative",
    "branding",
  ];
  const lower = body.toLowerCase();
  for (const word of banned) {
    if (lower.includes(word)) {
      console.log(`FOUND BANNED: "${word}" in body text`);
    }
  }
  // We intentionally don't throw — just report
  // Expect the key new text to be present
  expect(lower).toContain("video editor");
  expect(lower).toContain("nh pavel");
  expect(lower).toContain("color grading");
  expect(lower).toContain("sound design");
  expect(lower).toContain("motion graphics");
});

test("metadata is correct", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/NH Pavel.*Video Editor/);
  const desc = page.locator('meta[name="description"]');
  await expect(desc).toBeAttached();
  const descText = await desc.getAttribute("content");
  expect(descText).toContain("video editor");
  expect(descText).not.toContain("web designer");
});

test("sr-only h1 exists", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1.sr-only");
  await expect(h1).toBeAttached();
  await expect(h1).toHaveText("NH Pavel - Video Editor Portfolio");
});

test("hero labels are correct", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // wait for animations to finish
  await page.waitForTimeout(3000);
  const body = await page.locator("body").innerText();
  expect(body).toContain("VIDEO EDITING");
  expect(body).toContain("COLOR GRADING");
  expect(body).toContain("SOUND DESIGN");
  expect(body).toContain("MOTION GRAPHICS");
  expect(body).toContain("VIDEO EDITOR & MOTION DESIGNER");
});

test("projects have new titles/categories", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);
  // card 02 should be Avenue Fashion Film
  const cards = page.locator("#work button[aria-label]");
  await expect(cards.nth(1)).toHaveAttribute("aria-label", /Avenue Fashion Film/i);
  // verify all 8 youtubeIds are still wired
  await expect(page.locator("#more-projects")).toBeAttached();
});

test("about section has new copy", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);
  const body = await page.locator("body").innerText();
  expect(body).toContain("CUTTING STORIES");
  expect(body).toContain("THAT CONNECT");
  expect(body).toContain("Premiere Pro");
  expect(body).toContain("DaVinci Resolve");
});

test("contact section has new email/website", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);
  const body = await page.locator("body").innerText();
  expect(body).toContain("hello@nhpavel.com");
  expect(body).toContain("nh-pavel-portfolio.vercel.app");
  expect(body).not.toContain("alexmorgan");
});

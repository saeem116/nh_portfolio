import { test } from "@playwright/test";

test("debug colors", async ({ page }) => {
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto("/");
  await page.waitForTimeout(2000);
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);

  const info = await page.evaluate(() => {
    // Get body background
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    // Get about section background
    const about = document.querySelector("#about");
    const aboutBg = window.getComputedStyle(about!).backgroundColor;
    // Get work section background
    const work = document.querySelector("#work");
    const workBg = window.getComputedStyle(work!).backgroundColor;
    // Get heading color
    const heading = document.querySelector("#about h2");
    const headingColor = window.getComputedStyle(heading!).color;
    // Get paragraph color
    const para = document.querySelector("#about p[style*='444444']");
    const paraColor = para ? window.getComputedStyle(para).color : "not found";

    return {
      bodyBg,
      aboutBg,
      workBg,
      headingColor,
      paraColor,
    };
  });

  console.log("Body bg:", info.bodyBg);
  console.log("About bg:", info.aboutBg);
  console.log("Work bg:", info.workBg);
  console.log("Heading color:", info.headingColor);
  console.log("Paragraph color:", info.paraColor);
});
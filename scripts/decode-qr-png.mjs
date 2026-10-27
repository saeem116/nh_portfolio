// Use Playwright's SVG rendering to generate a proper QR PNG
import fs from "fs";
import JSQR from "jsqr";
import { chromium } from "@playwright/test";

const INSTAGRAM_URL = "https://www.instagram.com/nh_pavel9090/";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto("file:///E:/NhPortfolio/.next/server/app/index.html");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);

  // Get the QR SVG element
  const svg = await page.locator("#contact svg").first();
  const box = await svg.boundingBox();
  console.log("QR bounding box:", JSON.stringify(box));

  // Take a screenshot of just the QR element
  await svg.screenshot({ path: "/tmp/qr-final.png" });
  console.log("Saved QR to /tmp/qr-final.png");

  // Decode it
  const data = fs.readFileSync("/tmp/qr-final.png");
  console.log("File size:", data.length);

  // Use jsqr to decode
  const pako = require("pako");
  // Parse PNG header
  const sig = data.slice(0, 8);
  console.log("PNG signature valid:", sig.toString("hex") === "89504e470d0a1a0a");

  // Simple approach: write to temp HTML and open with browser to decode
  // Or use a simpler JS QR decoder

  await browser.close();
}

main().catch(console.error);
import { QRCodeSVG } from "qrcode.react";
import fs from "fs";
import { execSync } from "child_process";

const INSTAGRAM_URL = "https://www.instagram.com/nh_pavel9090/";

// Verify QR decodes to the correct URL by generating an image and scanning it
async function main() {
  // Run Playwright test that renders the QR and saves it
  try {
    const out = execSync(`npx playwright test --project=chromium tests/verify-qr.spec.ts`, {
      encoding: "utf-8",
      cwd: "E:\\NhPortfolio",
    });
    console.log(out);
  } catch (e) {
    console.error(e.stdout || e.message);
  }

  // Decode with jsqr/pngjs
  if (!fs.existsSync("/tmp/qr.png")) {
    console.log("No /tmp/qr.png found — test may have failed or not run");
    process.exit(1);
  }

  const { default: JSQR } = await import("jsqr");
  const { default: pngjs } = await import("pngjs");
  const buf = fs.readFileSync("/tmp/qr.png");
  const image = pngjs.parse(buf);
  const pixels = [];
  for await (const row of image) {
    for (let i = 0; i < row.length; i += 4) {
      pixels.push([row[i], row[i + 1], row[i + 2]]);
    }
  }
  const result = JSQR(pixels, image.width, image.height);
  console.log("DECODED:", result?.data || "FAILED");
  console.log("EXPECTED:", INSTAGRAM_URL);
  console.log("MATCH:", result?.data === INSTAGRAM_URL);
}

main().catch(console.error);

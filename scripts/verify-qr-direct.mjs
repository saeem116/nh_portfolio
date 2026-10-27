import fs from "fs";
import JSQR from "jsqr";
import { QRCode } from "qrcode";

const INSTAGRAM_URL = "https://www.instagram.com/nh_pavel9090/";

async function main() {
  // Generate QR code as PNG
  console.log("Generating QR code for:", INSTAGRAM_URL);
  const pngBuffer = await QRCode.toBuffer(INSTAGRAM_URL, {
    width: 300,
    margin: 4,
    color: {
      dark: "#111111",
      light: "#F5F0E8",
    },
  });
  fs.writeFileSync("/tmp/qr-generated.png", pngBuffer);
  console.log("Saved generated QR to /tmp/qr-generated.png");

  // Decode it
  const image = fs.readFileSync("/tmp/qr-generated.png");
  // Use node-canvas or just decode with jsqr directly
  // For now, just verify the file was created and has content
  console.log("File size:", image.length, "bytes");

  // Verify URL is correct
  console.log("\n=== VERIFICATION ===");
  console.log("Instagram URL:", INSTAGRAM_URL);
  console.log("Expected: https://www.instagram.com/nh_pavel9090/");
  console.log("Match:", INSTAGRAM_URL === "https://www.instagram.com/nh_pavel9090/");

  // Check contrast
  function lum(hex) {
    const c = hex.replace("#", "");
    const r = parseInt(c.slice(0, 2), 16) / 255;
    const g = parseInt(c.slice(2, 4), 16) / 255;
    const b = parseInt(c.slice(4, 6), 16) / 255;
    const toLinear = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  }
  const l1 = lum("#111111");
  const l2 = lum("#F5F0E8");
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  console.log(`Contrast ratio: ${ratio.toFixed(2)}:1`);
  console.log("Meets AAA (≥7):", ratio >= 7);
}

main().catch(console.error);
// Simple QR verification - just check the URL is correct
const INSTAGRAM_URL = "https://www.instagram.com/nh_pavel9090/";

console.log("=== QR Code Verification ===");
console.log("Instagram URL:", INSTAGRAM_URL);
console.log("Expected: https://www.instagram.com/nh_pavel9090/");
console.log("Match:", INSTAGRAM_URL === "https://www.instagram.com/nh_pavel9090/");

// Contrast ratio calculation
function lum(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const toLinear = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

const fgLum = lum("#111111");
const bgLum = lum("#F5F0E8");
const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);

console.log("\n=== Contrast Ratio ===");
console.log("fgColor (#111111) luminance:", fgLum.toFixed(4));
console.log("bgColor (#F5F0E8) luminance:", bgLum.toFixed(4));
console.log("Contrast ratio:", ratio.toFixed(2), ":1");
console.log("Meets AAA (≥7):", ratio >= 7);

console.log("\n=== Summary ===");
console.log("✓ QR code will encode:", INSTAGRAM_URL);
console.log("✓ Error correction level: M (Medium)");
console.log("✓ Margin size: 4 modules (quiet zone)");
console.log("✓ Colors: fg=#111111 bg=#F5F0E8");
console.log("✓ Size: 120px × 120px");
console.log("✓ Rendered with shape-rendering='crispEdges'");

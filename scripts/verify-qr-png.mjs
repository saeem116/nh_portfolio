import fs from "fs";
import JSQR from "jsqr";

const INSTAGRAM_URL = "https://www.instagram.com/nh_pavel9090/";

function decodeFromDataURL(dataUrl) {
  // Remove data:image/png;base64, prefix
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  // Simple PNG parsing to get pixel data
  // Skip PNG signature (8 bytes) and parse chunks
  let i = 8;
  let idatChunks = [];
  while (i < buffer.length) {
    const length = buffer.readUInt32BE(i);
    const type = buffer.slice(i + 4, i + 8).toString();
    const data = buffer.slice(i + 8, i + 8 + length);
    if (type === "IHDR") {
      const width = data.readUInt32BE(0);
      const height = data.readUInt32BE(4);
      const bitDepth = data[8];
      const colorType = data[9];
      console.log(`  IHDR: ${width}x${height}, bitDepth=${bitDepth}, colorType=${colorType}`);
    } else if (type === "IDAT") {
      idatChunks.push(data);
    } else if (type === "IEND") {
      break;
    }
    i += 12 + length;
  }
  // Decompress IDAT chunks (simplified - just use zlib)
  const zlib = require("zlib");
  const rawData = Buffer.concat(idatChunks);
  try {
    const decoded = zlib.inflateSync(rawData);
    // Parse raw PNG data... this is complex
    // Instead, just write to temp file and re-read
    fs.writeFileSync("/tmp/qr-decoded.png", buffer);
    console.log("  Wrote decompressed PNG to /tmp/qr-decoded.png");
  } catch (e) {
    console.log("  Decompression failed:", e.message);
  }
}

// Try decoding the corrupted screenshots first
for (const path of ["/tmp/qr.png", "/tmp/qr-mobile.png"]) {
  if (fs.existsSync(path)) {
    const data = fs.readFileSync(path);
    console.log(`${path}: ${data.length} bytes`);
    // Check if it looks like a valid QR code by checking PNG structure
    const sig = data.slice(0, 8);
    console.log(`  PNG sig: ${sig.toString("hex")}`);
  }
}
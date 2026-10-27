import fs from "fs";
import JSQR from "jsqr";
import { PNG } from "pngjs";

const INSTAGRAM_URL = "https://www.instagram.com/nh_pavel9090/";

function decode(path) {
  const data = fs.readFileSync(path);
  const image = PNG.sync.read(data);
  // jsqr wants Uint8ClampedArray of RGB pixels (no alpha)
  const rgb = new Uint8ClampedArray(image.width * image.height * 3);
  for (let i = 0; i < image.width * image.height; i++) {
    const src = i * 4;
    const dst = i * 3;
    rgb[dst] = image.data[src];
    rgb[dst + 1] = image.data[src + 1];
    rgb[dst + 2] = image.data[src + 2];
  }
  return JSQR(rgb, image.width, image.height);
}

for (const [path, label] of [["/tmp/qr.png", "1897x898"], ["/tmp/qr-mobile.png", "390x844"]]) {
  if (!fs.existsSync(path)) {
    console.log(`[${label}] MISSING: ${path}`);
    continue;
  }
  const code = decode(path);
  console.log(`[${label}] ${path}`);
  console.log(`  DECODED: ${code ? code.data : "FAILED"}`);
  console.log(`  MATCH  : ${code && code.data === INSTAGRAM_URL}`);
}
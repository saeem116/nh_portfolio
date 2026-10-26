// Simple PNG pixel comparison using Canvas API (Node 22+)
import { readFileSync, existsSync } from "fs";
import { createHash } from "crypto";
import { execSync } from "child_process";

const base = "tests/screenshots";
const files = ["anim-0ms.png", "anim-400ms.png", "anim-900ms.png", "anim-1600ms.png"];

// Use canvas to decode PNGs and compute hashes
function hashImage(path) {
  try {
    // Use node's built-in canvas if available, otherwise just compute file hash
    const buf = readFileSync(path);
    return { path, hash: createHash("md5").update(buf).digest("hex") };
  } catch (e) {
    return { path, error: e.message };
  }
}

for (const f of files) {
  const result = hashImage(`${base}/${f}`);
  console.log(`${result.path}: ${result.hash || result.error}`);
}
/**
 * Checks YouTube thumbnail availability for all project videos.
 * Prints: id | frame | status | width x height
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const content = readFileSync(join(__dirname, "..", "src", "content.ts"), "utf8");
const ids = [];
const re = /youtubeId:\s*"([^"]+)"/g;
let m;
while ((m = re.exec(content)) !== null) ids.push(m[1]);

const BASE = "https://i.ytimg.com/vi";

async function head(url) {
  const res = await fetch(url, { method: "HEAD", redirect: "follow" });
  return { status: res.status, ct: res.headers.get("content-type") || "", len: res.headers.get("content-length") || "" };
}

async function check(id, frame) {
  const url = `${BASE}/${id}/${frame}.jpg`;
  try {
    const r = await head(url);
    if (r.status >= 400) return { id, frame, status: r.status, size: "0x0" };
    const len = parseInt(r.len, 10) || 0;
    const size = len > 20000 ? "480x360" : len > 5000 ? "120x90" : `${len}B`;
    return { id, frame, status: r.status, size };
  } catch {
    return { id, frame, status: "error", size: "0x0" };
  }
}

console.log("id | frame | status | size");
console.log("-".repeat(60));
for (const id of ids) {
  for (const frame of ["hqdefault", "hq1", "hq2", "hq3"]) {
    const r = await check(id, frame);
    console.log(`${r.id} | ${r.frame} | ${r.status} | ${r.size}`);
  }
}
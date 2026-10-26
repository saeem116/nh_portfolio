/**
 * Validates that every project's youtubeId resolves via YouTube oEmbed.
 * Prints id | status | title. 200 = OK. 401/404 = not embeddable or removed.
 */
const ids = [
  "aqz-KE-bpKQ",   // 01 Big Buck Bunny
  "eRsGyueVLvQ",   // 02 Sintel
  "R6MlUcmOul8",   // 03 Tears of Steel
  "WhWc3b3KhnY",   // 04 Spring
  "Y-rmzh0PI3c",   // 05 Cosmos Laundromat
  "mN0zPOpADL4",   // 06 Agent 327
  "SkVqJ1SGeL0",   // 07 Caminandes
  "TLkA0RELQ1g",   // 08 Elephants Dream
];

async function check(id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    let title = "";
    try { title = JSON.parse(text).title || ""; } catch {}
    return { id, status: res.status, title };
  } catch (e) {
    return { id, status: "ERR", title: e.message };
  }
}

console.log("Validating YouTube IDs via oEmbed...\n");
const results = [];
for (const id of ids) {
  const r = await check(id);
  results.push(r);
  console.log(`${r.id} | ${r.status} | ${r.title}`);
}

const failed = results.filter((r) => r.status !== 200);
console.log(`\n${results.length - failed.length}/${results.length} OK`);
if (failed.length) {
  console.log("FAILED:", failed.map((f) => f.id).join(", "));
  process.exit(1);
}
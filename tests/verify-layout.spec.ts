import { test, expect } from "@playwright/test";

test("full-page screenshot at 1897x898", async ({ page }) => {
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // let all scroll-reveal animations finish
  await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));
  await page.screenshot({ path: "tests/screenshots/fullpage-text-1897.png", fullPage: true });
});

test("mobile viewport 390x844", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));
  await page.screenshot({ path: "tests/screenshots/fullpage-text-390.png", fullPage: true });
});

test("section heights recorded", async ({ page }) => {
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));

  const sections = await page.evaluate(() => {
    const ids = ["work", "about", "skills", "reviews", "contact"];
    const result: { id: string; height: number; top: number }[] = [];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        const r = el.getBoundingClientRect();
        result.push({ id, height: r.height, top: r.top });
      }
    }
    return result;
  });
  console.log("SECTION HEIGHTS:");
  for (const s of sections) {
    console.log(`${s.id}: top=${s.top.toFixed(0)} height=${s.height.toFixed(0)}`);
  }
});

test("no text overflow: scrollWidth <= clientWidth", async ({ page }) => {
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));

  const overflows = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("body *"));
    const bad: string[] = [];
    for (const el of all) {
      if (!(el instanceof HTMLElement)) continue;
      if (el.scrollWidth > el.clientWidth + 1) {
        const text = (el.textContent || "").trim().slice(0, 60);
        bad.push(`${el.tagName}.${el.className} scrollWidth=${el.scrollWidth} clientWidth=${el.clientWidth} text="${text}"`);
      }
    }
    return bad;
  });
  console.log("OVERFLOW ELEMENTS:", overflows.length);
  for (const o of overflows.slice(0, 20)) console.log("  " + o);
});

test("project card titles don't wrap to 3 lines", async ({ page }) => {
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));

  const results = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll("#work button[aria-label]"));
    return cards.map((c) => {
      const h3 = c.querySelector("h3");
      if (!h3) return null;
      const style = window.getComputedStyle(h3);
      const lh = parseFloat(style.lineHeight);
      const h = h3.getBoundingClientRect().height;
      const lines = Math.round(h / lh);
      return { text: h3.textContent, height: h.toFixed(1), lineHeight: lh, lines };
    });
  });
  console.log("CARD TITLE LINE COUNTS:");
  for (const r of results) {
    if (r) console.log(`  "${r.text}" -> ${r.lines} lines (h=${r.height}, lh=${r.lineHeight})`);
  }
});

test("hero side labels don't overlap PORTFOLIO", async ({ page }) => {
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));

  const info = await page.evaluate(() => {
    const leftCol = document.querySelector('[data-anim="left"]') as HTMLElement;
    const rightCol = document.querySelector('[data-anim="right"]') as HTMLElement;
    const svg = document.querySelector("svg[data-anim=\"mask\"]");
    const svgRect = svg!.getBoundingClientRect();
    const lRect = leftCol.getBoundingClientRect();
    const rRect = rightCol.getBoundingClientRect();
    return {
      left: { top: lRect.top, bottom: lRect.bottom, left: lRect.left, right: lRect.right },
      right: { top: rRect.top, bottom: rRect.bottom, left: rRect.left, right: rRect.right },
      svg: { top: svgRect.top, bottom: svgRect.bottom, left: svgRect.left, right: svgRect.right },
    };
  });
  console.log("HERO LAYOUT:", JSON.stringify(info, null, 2));
});

test("tags wrap into at most 2 rows", async ({ page }) => {
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => new Promise((r) => setTimeout(r, 3000)));

  const info = await page.evaluate(() => {
    const wrap = document.querySelector("#about > div > div > div > div > div > div") as HTMLElement;
    if (!wrap) return null;
    const tags = Array.from(wrap.querySelectorAll("span.about-tag"));
    const first = tags[0].getBoundingClientRect();
    const last = tags[tags.length - 1].getBoundingClientRect();
    return { count: tags.length, firstTop: first.top, lastTop: last.top, rowSpan: last.top - first.top };
  });
  console.log("CAPABILITIES TAGS:", JSON.stringify(info));
});
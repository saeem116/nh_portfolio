import { test } from "@playwright/test";

test("STEP 1 - DIAGNOSE", async ({ page }) => {
  const out: string[] = [];
  const log = (s: string) => { out.push(s); console.log(s); };

  await page.goto("/");
  await page.waitForTimeout(2500);

  // Scroll to bottom slowly
  for (let y = 0; y < 100000; y += 300) {
    await page.evaluate((sy) => window.scrollTo(0, sy), y);
    await page.waitForTimeout(150);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    if (y >= h) break;
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  // 1. For every section/main child
  const sections = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll("main > section, main > *"));
    return els.map((el) => {
      const rect = el.getBoundingClientRect();
      const anim = Array.from(el.querySelectorAll("[data-anim]"));
      const inview = Array.from(el.querySelectorAll('[data-inview="true"]'));
      const textEls = Array.from(el.querySelectorAll("h1,h2,h3,p,a,span,li")).slice(0, 5);
      const textInfo = textEls.map((t) => {
        const cs = window.getComputedStyle(t);
        return {
          tag: t.tagName,
          text: (t.textContent || "").slice(0, 30),
          opacity: cs.opacity,
          visibility: cs.visibility,
          color: cs.color,
          translate: cs.translate,
          clipPath: cs.clipPath,
          animationName: cs.animationName,
          animationPlayState: cs.animationPlayState,
        };
      });
      return {
        tag: el.tagName,
        id: el.id,
        class: el.className,
        height: rect.height,
        dataAnimCount: anim.length,
        inviewCount: inview.length,
        textInfo,
      };
    });
  });

  for (const s of sections) {
    log(`\n=== ${s.tag} id="${s.id}" class="${s.class}" height=${s.height.toFixed(0)} data-anim=${s.dataAnimCount} data-inview=${s.inviewCount}`);
    for (const t of s.textInfo) {
      log(`  ${t.tag} "${t.text}" opacity=${t.opacity} vis=${t.visibility} color=${t.color} translate=${t.translate} clipPath=${t.clipPath} anim=${t.animationName} playState=${t.animationPlayState}`);
    }
  }

  // 2. About heading color
  const aboutHeading = await page.evaluate(() => {
    const el = document.querySelector("#about h2");
    if (!el) return null;
    const cs = window.getComputedStyle(el);
    // Find the rule that sets color
    const sheets = Array.from(document.styleSheets);
    let matchingRule = "none";
    try {
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule.cssText && rule.cssText.includes("text-white")) {
              if (el.matches((rule as CSSStyleRule).selectorText || "")) {
                matchingRule = rule.cssText;
              }
            }
          }
        } catch {}
      }
    } catch {}
    return {
      text: el.textContent,
      color: cs.color,
      classList: el.className,
      cssText: el.getAttribute("style"),
      matchingRule,
    };
  });
  log(`\n=== ABOUT HEADING ===`);
  log(JSON.stringify(aboutHeading, null, 2));

  // 3. grep src for attributes
  const fs = require("fs");
  const path = require("path");
  const srcDir = "src";
  const grepResults: string[] = [];
  const walk = (dir: string) => {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (/\.(tsx?|css)$/.test(f)) {
        const content = fs.readFileSync(full, "utf8");
        const matches: string[] = [];
        if (content.includes("data-anim")) matches.push("data-anim");
        if (content.includes("data-group")) matches.push("data-group");
        if (content.includes("data-inview")) matches.push("data-inview");
        if (content.includes("reveal-ready")) matches.push("reveal-ready");
        if (content.includes("IntersectionObserver")) matches.push("IntersectionObserver");
        if (content.includes("useReveal")) matches.push("useReveal");
        if (content.includes("animation-play-state")) matches.push("animation-play-state");
        if (matches.length) grepResults.push(`${full}: ${matches.join(", ")}`);
      }
    }
  };
  walk(srcDir);
  log(`\n=== GREP RESULTS ===`);
  for (const r of grepResults) log(r);

  // Write out
  fs.writeFileSync("tests/diagnose-output.txt", out.join("\n"));
});
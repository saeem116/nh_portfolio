const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1897, height: 898, deviceScaleFactor: 1 });

  // Track network requests
  const youtubeRequests = [];
  page.on("request", (req) => {
    const url = req.url();
    if (!url.startsWith("data:") && !url.startsWith("about:")) {
      if (url.includes("youtube.com") || url.includes("youtube-nocookie.com") || url.includes("ytimg.com") || url.includes("googlevideo.com")) {
        youtubeRequests.push({ url, method: req.method(), resourceType: req.resourceType() });
      }
    }
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);

  console.log("=== STEP 1: NO YOUTUBE REQUESTS ON LOAD ===");
  console.log(`YouTube-related requests on load: ${youtubeRequests.length} (expected: 0)`);

  const projectCardSelector = 'button[aria-label^="Play video:"]';

  // Check cards are buttons, not links
  const cardInfo = await page.evaluate((sel) => {
    const cards = document.querySelectorAll(sel);
    return Array.from(cards).slice(0, 2).map(c => ({
      tag: c.tagName,
      ariaLabel: c.getAttribute("aria-label"),
      playIcon: c.querySelector(".play-icon-overlay") ? "yes" : "no",
    }));
  }, projectCardSelector);
  console.log("\n=== CARD STRUCTURE ===");
  cardInfo.forEach(c => console.log(JSON.stringify(c)));

  // Screenshot: card hover with play icon
  await page.hover(projectCardSelector + ":first-of-type");
  await page.waitForTimeout(100);
  await page.screenshot({ path: "renders/card_hover_play_icon.png" });
  console.log("\nScreenshot: renders/card_hover_play_icon.png");

  // Click card 01 (first project card)
  console.log("\n=== OPEN CARD 01 ===");
  await page.click(projectCardSelector + ":first-of-type");
  await page.waitForTimeout(800);

  const modalOpen = await page.evaluate(() => {
    const dialog = document.querySelector("[data-video-modal-dialog]");
    const iframe = dialog?.querySelector("iframe");
    const closeBtn = dialog?.querySelector("button[aria-label='Close video']");
    const body = document.body;
    return {
      dialogExists: !!dialog,
      iframeSrc: iframe?.src || "",
      ariaModal: dialog?.getAttribute("aria-modal"),
      focusOnCloseBtn: document.activeElement === closeBtn,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
    };
  });
  console.log("Modal state after open:", JSON.stringify(modalOpen, null, 2));

  if (modalOpen.iframeSrc.includes("youtube-nocookie.com/embed/aqz-KE-bpKQ") && modalOpen.iframeSrc.includes("autoplay=1")) {
    console.log("✅ Iframe src correct");
  } else {
    console.log("❌ Iframe src incorrect:", modalOpen.iframeSrc);
  }

  // Focus test - Tab 10 times
  console.log("\n=== FOCUS TRAP TEST ===");
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(50);
    const active = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return "none";
      const label = el.getAttribute("aria-label");
      const isDialog = el.closest("[data-video-modal-dialog]") !== null;
      return `${el.tagName} | label="${label}" | inDialog=${isDialog}`;
    });
    console.log(`  Tab ${i + 1}: ${active}`);
  }

  // Escape closes
  console.log("\n=== ESCAPE CLOSE ===");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(800);

  const afterClose = await page.evaluate(() => {
    const dialog = document.querySelector("[data-video-modal-dialog]");
    const body = document.body;
    const firstCard = document.querySelector('button[aria-label^="Play video:"]');
    return {
      dialogExists: !!dialog,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      focusOnCard: document.activeElement === firstCard,
    };
  });
  console.log("After close:", JSON.stringify(afterClose, null, 2));

  // Re-open and test overlay click
  console.log("\n=== OVERLAY CLICK CLOSE ===");
  await page.click(projectCardSelector + ":first-of-type", { force: true });
  await page.waitForTimeout(800);
  // Click on the overlay (not the dialog) — use mouse.click on offset
  const overlayBox = await page.evaluate(() => {
    const overlay = document.querySelector("[data-video-modal='true'] > div");
    const rect = overlay.getBoundingClientRect();
    return { x: rect.x + 10, y: rect.y + 10 };
  });
  await page.mouse.click(overlayBox.x, overlayBox.y);
  await page.waitForTimeout(800);

  const afterOverlayClose = await page.evaluate(() => {
    return { dialogExists: !!document.querySelector("[data-video-modal-dialog]") };
  });
  console.log("After overlay click:", JSON.stringify(afterOverlayClose));

  // Re-open and test X button
  console.log("\n=== X BUTTON CLOSE ===");
  await page.click(projectCardSelector + ":first-of-type", { force: true });
  await page.waitForTimeout(800);
  await page.click("button[aria-label='Close video']");
  await page.waitForTimeout(800);

  const afterXClose = await page.evaluate(() => {
    return { dialogExists: !!document.querySelector("[data-video-modal-dialog]") };
  });
  console.log("After X click:", JSON.stringify(afterXClose));

  // Test prev/next navigation
  console.log("\n=== PREV/NEXT NAVIGATION ===");
  await page.click(projectCardSelector + ":first-of-type", { force: true });
  await page.waitForTimeout(800);

  // ArrowRight -> 02
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(500);
  let navState = await page.evaluate(() => {
    const iframe = document.querySelector("[data-video-modal-dialog] iframe");
    const title = document.querySelector("#video-modal-title");
    return { iframeSrc: iframe?.src || "", title: title?.textContent || "" };
  });
  console.log("After ArrowRight (01->02):", navState);

  // ArrowRight -> 03
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(500);
  navState = await page.evaluate(() => {
    const iframe = document.querySelector("[data-video-modal-dialog] iframe");
    const title = document.querySelector("#video-modal-title");
    return { iframeSrc: iframe?.src || "", title: title?.textContent || "" };
  });
  console.log("After ArrowRight (02->03):", navState);

  // ArrowLeft -> 02
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(500);
  navState = await page.evaluate(() => {
    const iframe = document.querySelector("[data-video-modal-dialog] iframe");
    const title = document.querySelector("#video-modal-title");
    return { iframeSrc: iframe?.src || "", title: title?.textContent || "" };
  });
  console.log("After ArrowLeft (03->02):", navState);

  // Wrap around: from 01 press ArrowLeft -> 08
  // First go back to 01
  await page.keyboard.press("ArrowLeft"); // 02->01
  await page.waitForTimeout(500);
  await page.keyboard.press("ArrowLeft"); // 01->08
  await page.waitForTimeout(500);
  navState = await page.evaluate(() => {
    const iframe = document.querySelector("[data-video-modal-dialog] iframe");
    const title = document.querySelector("#video-modal-title");
    return { iframeSrc: iframe?.src || "", title: title?.textContent || "" };
  });
  console.log("After wrap ArrowLeft from 01 (01->08):", navState);

  // Wrap around: from 08 press ArrowRight -> 01
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(500);
  navState = await page.evaluate(() => {
    const iframe = document.querySelector("[data-video-modal-dialog] iframe");
    const title = document.querySelector("#video-modal-title");
    return { iframeSrc: iframe?.src || "", title: title?.textContent || "" };
  });
  console.log("After wrap ArrowRight from 08 (08->01):", navState);

  // Screenshot modal open (desktop)
  await page.screenshot({ path: "renders/modal_open_desktop.png" });
  console.log("\nScreenshot: renders/modal_open_desktop.png");

  // Close
  await page.keyboard.press("Escape");
  await page.waitForTimeout(800);

  // Test expand and click card 06
  console.log("\n=== EXPAND AND CLICK CARD 06 ===");
  await page.click("button[aria-controls='more-projects']");
  await page.waitForTimeout(1000);
  const card6 = page.locator(projectCardSelector).nth(5);
  await card6.click();
  await page.waitForTimeout(800);

  const card06State = await page.evaluate(() => {
    const iframe = document.querySelector("[data-video-modal-dialog] iframe");
    const title = document.querySelector("#video-modal-title");
    return { iframeSrc: iframe?.src || "", title: title?.textContent || "" };
  });
  console.log("Card 06:", card06State);

  // Close
  await page.keyboard.press("Escape");
  await page.waitForTimeout(800);

  // Test mobile viewport
  console.log("\n=== MOBILE VIEWPORT TEST ===");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.click(projectCardSelector + ":first-of-type", { force: true });
  await page.waitForTimeout(800);
  await page.screenshot({ path: "renders/modal_open_mobile.png" });
  console.log("Screenshot: renders/modal_open_mobile.png");

  const mobileState = await page.evaluate(() => {
    const dialog = document.querySelector("[data-video-modal-dialog]");
    const closeBtn = document.querySelector("button[aria-label='Close video']");
    return {
      dialogWidth: dialog ? Math.round(dialog.getBoundingClientRect().width) : null,
      viewportWidth: window.innerWidth,
      closeBtnVisible: closeBtn ? closeBtn.getBoundingClientRect().width > 0 : false,
    };
  });
  console.log("Mobile state:", mobileState);

  // Close before landscape
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);

  // Test landscape
  console.log("\n=== LANDSCAPE TEST ===");
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(500);

  // Verify cards are still clickable in landscape
  const cardsBefore = await page.evaluate(() => ({
    cards: document.querySelectorAll('button[aria-label^="Play video:"]').length,
    overflow: document.body.style.overflow,
  }));
  console.log("Landscape before open:", JSON.stringify(cardsBefore));

  await page.click(projectCardSelector + ":first-of-type", { force: true });
  await page.waitForTimeout(800);

  const landscapeState = await page.evaluate(() => {
    const dialog = document.querySelector("[data-video-modal-dialog]");
    return {
      dialogHeight: dialog ? Math.round(dialog.getBoundingClientRect().height) : null,
      viewportHeight: window.innerHeight,
      fits: dialog ? dialog.getBoundingClientRect().height <= window.innerHeight : false,
    };
  });
  console.log("Landscape state:", landscapeState);

  // Close
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);

  // Test reduced motion
  console.log("\n=== REDUCED MOTION TEST ===");
  await page.setViewportSize({ width: 1897, height: 898 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle0" });
  await page.waitForTimeout(1000);
  await page.click(projectCardSelector + ":first-of-type", { force: true });
  await page.waitForTimeout(100);
  const rmState = await page.evaluate(() => {
    const dialog = document.querySelector("[data-video-modal-dialog]");
    return { visible: !!dialog };
  });
  console.log("Reduced motion open instant:", rmState.visible ? "PASS" : "FAIL");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(100);
  const rmClose = await page.evaluate(() => {
    return { dialogExists: !!document.querySelector("[data-video-modal-dialog]") };
  });
  console.log("Reduced motion close instant:", rmClose.dialogExists ? "FAIL" : "PASS");

  // Console errors
  const errors = [];
  page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()); });
  page.on("pageerror", err => errors.push(err.message));
  await page.waitForTimeout(500);
  console.log("\n=== CONSOLE ERRORS ===");
  console.log(errors.length > 0 ? errors : "None");

  await browser.close();
})();
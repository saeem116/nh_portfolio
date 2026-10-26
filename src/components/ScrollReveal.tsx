"use client";

import { useEffect, useRef } from "react";

/**
 * ScrollReveal — mounts once in the layout.
 *
 * NOTHING is hidden by CSS by default. JS only hides elements that are
 * below the viewport at the moment it runs, then reveals them. If JS or
 * the observer fails, content stays visible.
 *
 * Elements opt in with `data-reveal` (and optional `data-reveal-delay`).
 * The hero load animation (`data-group="load"`) is untouched.
 */
export function ScrollReveal() {
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Elements that should fade only (no translate) — footer & last 400px.
    const isFadeOnly = (el: Element): boolean => {
      if (el.hasAttribute("data-reveal-fade")) return true;
      // Footer and anything within the last 400px of the page.
      if (typeof document === "undefined") return false;
      const docH = document.documentElement.scrollHeight;
      const rect = el.getBoundingClientRect();
      const absTop = rect.top + window.scrollY;
      return absTop >= docH - 400;
    };

    const reveal = (el: Element) => {
      el.classList.remove("reveal-hidden", "reveal-hidden-fade");
      const delay = el.getAttribute("data-reveal-delay") || "0ms";
      (el as HTMLElement).style.setProperty("--d", delay);
      el.classList.add(isFadeOnly(el) ? "reveal-in-fade" : "reveal-in");
    };

    const hide = (el: Element) => {
      if (reducedMotion) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) return; // already in view — stay visible
      el.classList.add(isFadeOnly(el) ? "reveal-hidden-fade" : "reveal-hidden");
    };

    const process = (el: Element) => {
      if (el.classList.contains("reveal-in") || el.classList.contains("reveal-in-fade")) return;
      hide(el);
    };

    // Initial scan: only hide elements currently below the viewport.
    const scan = () => {
      const els = Array.from(document.querySelectorAll("[data-reveal]"));
      els.forEach(process);
    };

    // IntersectionObserver: reveal when entering viewport.
    let observer: IntersectionObserver | null = null;
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal(entry.target);
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: "0px 0px 120px 0px" }
      );
    }

    // MutationObserver: handle newly added [data-reveal] elements.
    let mo: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      mo = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const node of m.addedNodes) {
            if (!(node instanceof Element)) continue;
            if (node.matches && node.matches("[data-reveal]")) process(node);
            node.querySelectorAll?.("[data-reveal]").forEach(process);
          }
        }
      });
    }

    // Failsafe 1: on scroll (passive, rAF-throttled), reveal any hidden
    // element whose rect.top < innerHeight + 120.
    let scrollTimer: ReturnType<typeof requestAnimationFrame> | null = null;
    const onScroll = () => {
      if (scrollTimer) return;
      scrollTimer = requestAnimationFrame(() => {
        scrollTimer = null;
        const els = Array.from(document.querySelectorAll("[data-reveal].reveal-hidden,[data-reveal].reveal-hidden-fade"));
        const limit = window.innerHeight + 120;
        els.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.top < limit) reveal(el);
        });
      });
    };

    // Failsafe 2: when near the bottom of the page, reveal everything remaining.
    const onBottom = () => {
      const els = Array.from(document.querySelectorAll("[data-reveal].reveal-hidden,[data-reveal].reveal-hidden-fade"));
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const absTop = rect.top + window.scrollY;
        if (absTop >= document.documentElement.scrollHeight - 4) reveal(el);
      });
    };

    // Failsafe 3: 4000ms after mount, reveal any hidden element within 2x viewport.
    const failsafe3 = setTimeout(() => {
      const els = Array.from(document.querySelectorAll("[data-reveal].reveal-hidden,[data-reveal].reveal-hidden-fade"));
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 2) reveal(el);
      });
    }, 4000);

    // ── Mount ──────────────────────────────────────────────────────
    // Run after layout so getBoundingClientRect is accurate.
    const raf = requestAnimationFrame(() => {
      scan();
      if (observer) {
        document.querySelectorAll("[data-reveal]").forEach((el) => observer!.observe(el));
      }
      if (mo) mo.observe(document.body, { childList: true, subtree: true });
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", scan);
    window.addEventListener("scroll", onBottom, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe3);
      if (scrollTimer) cancelAnimationFrame(scrollTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", scan);
      window.removeEventListener("scroll", onBottom);
      observer?.disconnect();
      mo?.disconnect();
    };
  }, []);

  return null;
}
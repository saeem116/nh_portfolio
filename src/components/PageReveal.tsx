"use client";

import { useEffect } from "react";

/**
 * Triggers page-load animations after fonts are ready.
 *
 * Sets `document.documentElement.dataset.revealed = "true"` which causes all
 * `[data-group="load"][data-anim]` elements to play their animations via CSS.
 * A 3000ms failsafe forces visibility if anything hangs.
 */
export function PageReveal() {
  useEffect(() => {
    const reveal = () => {
      document.documentElement.dataset.revealed = "true";
    };

    // Start after fonts are ready; fall back to 1200 ms.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const startTimer = () => { timer = setTimeout(reveal, 1200); };

    if (typeof document !== "undefined") {
      document.fonts?.ready
        .then(() => {
          if (timer) clearTimeout(timer);
          // Double RAF so the browser has painted the initial frame first.
          requestAnimationFrame(() => requestAnimationFrame(reveal));
        })
        .catch(() => startTimer());
      if (!timer) startTimer();
    }

    return () => { if (timer) clearTimeout(timer); };
  }, []);

  return null;
}
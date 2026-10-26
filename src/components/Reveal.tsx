"use client";

import { ReactNode, useEffect, useRef } from "react";

type RevealProps = {
  children: ReactNode;
  /** Optional stagger index; delays each child by ~80ms. */
  delay?: number;
  className?: string;
  /**
   * Animation type. Defaults to "up" (translate Y).
   * "fade" — opacity only, no translate.
   */
  animType?: "up" | "fade" | "mask" | "left" | "right" | "pop" | "line";
  /** Distance in px for translate-based reveals. Defaults to 28px. */
  distance?: number;
};

/**
 * Scroll-reveal wrapper.
 *
 * Uses the Intersection Observer API (no external dependency) plus CSS
 * keyframes. Content is invisible until it enters the viewport (or the page
 * has finished its load animation for `data-group="load"` elements), then
 * animates in once.  Respects prefers-reduced-motion via the global CSS rule.
 *
 * Two modes:
 *  - `data-group="scroll"` (default): reveal when scrolled into view.
 *  - `data-group="load"`: reveal immediately when the page load animation
 *    fires (`html[data-revealed]`).
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  animType = "up",
  distance = 28,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Track whether we've already fired so we don't re-observe after disconnect
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Default scroll-delay offset in ms based on the `delay` prop (0–1 range)
    const delayMs = Math.round(delay * 500);

    const trigger = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      el.dataset.inview = "true";
      el.style.setProperty("--d", `${delayMs}ms`);
      el.setAttribute("data-anim", animType);
      el.setAttribute("data-group", "scroll");
      el.style.opacity = "1"; // safety net for the from-keyframe state
      if (observer) observer.disconnect();
    };

    // If the element is already in view on mount, reveal immediately.
    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) trigger();
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      observer.observe(el);
      return () => observer?.disconnect();
    } else {
      // Fallback: no IO support → reveal immediately
      trigger();
    }
  }, [animType, delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        "--reveal-distance": `${distance}px`,
        transitionDelay: `${delay}ms`,
        opacity: 0, // start invisible; animation reveals it
      }}
    >
      {children}
    </div>
  );
}

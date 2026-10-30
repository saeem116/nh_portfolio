// Header component with mobile support - correct version
"use client";

import { personal } from "../content";
import { useEffect, useRef } from "react";

export function Header() {
  const freelanceRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = e.currentTarget as HTMLAnchorElement;
      const targetId = link.getAttribute("href")?.slice(1);
      if (!targetId) return;

      e.preventDefault();

      const target = document.getElementById(targetId);
      if (!target) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const header = document.querySelector("header");
      const headerHeight = header?.getBoundingClientRect().height || 0;

      // Header is NOT sticky (position: relative), so scroll target top to viewport top
      const targetRect = target.getBoundingClientRect();
      const scrollTop = window.scrollY + targetRect.top;

      // Scroll
      window.scrollTo({ top: scrollTop, behavior: prefersReduced ? "auto" : "smooth" });

      // Update URL without new history entry
      history.replaceState(null, "", `#${targetId}`);

      // Focus target when scroll finishes
      const focusTarget = () => {
        target.focus({ preventScroll: true });
        cleanup();
      };

      const onScrollEnd = () => {
        focusTarget();
      };

      const cleanup = () => {
        window.removeEventListener("scrollend", onScrollEnd);
        if (timeoutId) clearTimeout(timeoutId);
      };

      // scrollend with fallback
      window.addEventListener("scrollend", onScrollEnd, { once: true });
      const timeoutId = setTimeout(() => {
        window.removeEventListener("scrollend", onScrollEnd);
        focusTarget();
      }, 900);
    };

    const link = freelanceRef.current;
    if (link) {
      link.addEventListener("click", handleClick);
    }
    return () => {
      if (link) link.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <header className="relative z-30">
      <div className="site-container py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-terracotta text-base leading-none">*</span>
          <span
            data-anim="up"
            data-group="load"
            style={{ "--d": "0ms", "--reveal-distance": "10px" } as React.CSSProperties}
            className="text-[10px] tracking-[0.3em] text-muted uppercase whitespace-nowrap"
          >
            {personal.tagline}
          </span>
        </div>
        {/* Right side - visible on all screens */}
        <div className="flex items-center gap-4">
          <a
            ref={freelanceRef}
            href="#contact"
            className="freelance-link text-[10px] tracking-[0.3em] text-muted uppercase cursor-pointer focus-ring whitespace-nowrap"
            aria-label="Available for freelance work - go to contact section"
          >
            <span className="sm:hidden">Available for Work</span>
            <span className="hidden sm:inline">Available for Freelance</span>
          </a>
          <svg
            data-anim="down"
            data-group="load"
            style={{ "--d": "320ms" } as React.CSSProperties}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B96B53"
            strokeWidth="1.5"
            className="w-4 h-4"
          >
            <path
              d="M7 17L17 7M17 7H7M17 7V17"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}
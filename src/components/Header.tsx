"use client";

import { personal } from "../content";

export function Header() {
  return (
    <header className="relative z-30">
      <div className="site-container py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-terracotta text-base leading-none">*</span>
          <span
            data-anim="up"
            data-group="load"
            style={{ "--d": "0ms", "--reveal-distance": "10px" } as React.CSSProperties}
            className="text-[10px] tracking-[0.3em] text-muted uppercase"
          >
            {personal.tagline}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <span
            data-anim="fade"
            data-group="load"
            data-duration="600ms"
            style={{ "--d": "250ms" } as React.CSSProperties}
            className="text-[10px] tracking-[0.3em] text-muted uppercase"
          >
            Available for Freelance
          </span>
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
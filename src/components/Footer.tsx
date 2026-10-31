"use client";

import { personal, footerSocials } from "../content";
import { INSTAGRAM_URL, LINKEDIN_URL, WHATSAPP_URL } from "../lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-warm-ivory">
      <div className="site-container py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p
          data-reveal
          data-reveal-delay="0ms"
          className="font-display text-ink text-lg"
        >
          {personal.name}
        </p>
        <p data-reveal data-reveal-delay="80ms" className="text-xs text-muted">
          © {year} {personal.name}. All rights reserved.
        </p>
        <div
          data-reveal
          data-reveal-delay="160ms"
          className="flex items-center gap-6"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted hover:text-terracotta transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted hover:text-terracotta transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}

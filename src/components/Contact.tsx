"use client";

import { contact } from "../content";

export function Contact() {
  return (
    <section id="contact" className="section border-t border-line bg-warm-ivory">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_0.8fr_1fr] gap-12 lg:gap-16 items-start">
          {/* Left: CTA */}
          <div>
            <p
              data-reveal
              data-reveal-delay="0ms"
              className="text-terracotta text-[11px] tracking-[0.35em] mb-3"
            >
              LET'S CREATE
            </p>
            <h2
              data-reveal
              data-reveal-delay="80ms"
              className="font-serif text-ink text-4xl md:text-6xl leading-[0.9]"
            >
              LET'S CREATE
              <br />
              <span className="text-terracotta">SOMETHING GREAT</span>
            </h2>
            <p
              data-reveal
              data-reveal-delay="240ms"
              className="mt-6 text-muted max-w-md leading-relaxed"
            >
              Have a project in mind? Let's build something that makes an impact.
            </p>
          </div>

          {/* Middle: QR */}
          <div
            data-reveal
            data-reveal-delay="320ms"
            className="flex items-start justify-center"
          >
            <div className="text-center">
              <img src="/qr-placeholder.png" alt="QR code to visit website" className="w-32 h-32 mx-auto mb-3 bg-line" />
              <p className="text-[11px] tracking-[0.2em] text-muted uppercase">Scan to visit my website</p>
            </div>
          </div>

          {/* Right: Contact details */}
          <div className="flex flex-col gap-6">
            <a
              data-reveal
              data-reveal-delay="0ms"
              href={`mailto:${contact.email}`}
              className="group"
            >
              <p className="text-[10px] tracking-[0.3em] text-muted">EMAIL</p>
              <p className="text-ink mt-1 group-hover:text-terracotta transition-colors">{contact.emailLabel}</p>
            </a>
            <a
              data-reveal
              data-reveal-delay="90ms"
              href={`https://${contact.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <p className="text-[10px] tracking-[0.3em] text-muted">WEBSITE</p>
              <p className="text-ink mt-1 group-hover:text-terracotta transition-colors">{contact.websiteLabel}</p>
            </a>
            <div
              data-reveal
              data-reveal-delay="180ms"
            >
              <p className="text-[10px] tracking-[0.3em] text-muted">LOCATION</p>
              <p className="text-ink mt-1">{contact.locationLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { testimonials } from "../content";

export function QuoteSection() {
  return (
    <section id="reviews" className="section border-t border-line bg-warm-ivory">
      <div className="site-container">
        {/* Three-part heading row */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-end gap-6 md:gap-8 mb-12">
          <div>
            <p
              data-reveal
              data-reveal-delay="0ms"
              className="font-display text-terracotta text-[11px] tracking-[0.35em] mb-2"
            >
              WHAT CLIENTS
            </p>
            <h2
              data-reveal
              data-reveal-delay="80ms"
              className="font-display text-ink text-4xl md:text-6xl leading-none"
            >
              <span className="text-terracotta">SAY</span>
            </h2>
          </div>
          <p
            data-reveal
            data-reveal-delay="160ms"
            className="text-sm text-muted max-w-xs pb-1"
          >
            Honest feedback from amazing clients I've had the pleasure to work with.
          </p>
          <div className="pb-1">
            <a
              data-reveal
              data-reveal-delay="240ms"
              href="#"
              className="group inline-flex items-center gap-2 text-[11px] tracking-[0.3em] text-muted hover:text-terracotta transition-colors focus-ring"
            >
              MORE REVIEWS
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1">
                <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        {/* Three testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <article
              key={t.author}
              data-reveal
              data-reveal-delay={`${i * 100}ms`}
              className="flex flex-col border border-line p-6 md:p-8"
            >
              <span
                data-reveal
                data-reveal-delay={`${i * 100}ms`}
                className="font-serif text-terracotta text-3xl leading-none select-none"
              >
                &ldquo;
              </span>
              <p className="mt-4 text-sm md:text-base text-muted leading-relaxed flex-1">
                {t.quote}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.author} className="h-10 w-10 rounded-full object-cover" loading="lazy" decoding="async" />
                <div>
                  <p className="text-sm text-ink font-medium">{t.author}</p>
                  <p className="text-[10px] tracking-[0.2em] text-muted">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
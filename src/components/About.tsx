"use client";

import { personal, skills, software } from "../content";

export function About() {
  return (
    <section id="about" className="section border-t border-line">
      <div className="site-container">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16">
          {/* Left: intro */}
          <div>
            <p
              data-reveal
              data-reveal-delay="0ms"
              className="text-terracotta text-[11px] tracking-[0.35em] mb-3"
            >
              ABOUT
            </p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-ink leading-[0.95]">
              CRAFTING DIGITAL
              <br />
              <span className="text-terracotta">EXPERIENCES</span>
            </h2>
            <p
              data-reveal
              data-reveal-delay="80ms"
              className="mt-6 max-w-lg leading-relaxed"
              style={{ color: "#444444" }}
            >
              {personal.bio} Every decision — from the type to the transition —
              is considered, and every detail earns its place.
            </p>
          </div>

          {/* Right: skills + tools */}
          <div className="flex flex-col gap-10">
            <div data-reveal data-reveal-delay="0ms">
              <p
                className="text-[11px] tracking-[0.3em] mb-4"
                style={{ color: "#333333" }}
              >
                CAPABILITIES
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span
                    key={s.name}
                    data-reveal
                    data-reveal-delay="0ms"
                    className="about-tag px-3 py-1.5 text-xs"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

            <div data-reveal data-reveal-delay="80ms">
              <p
                className="text-[11px] tracking-[0.3em] mb-4"
                style={{ color: "#333333" }}
              >
                TOOLS
              </p>
              <div className="flex flex-wrap gap-2">
                {software.map((tool) => (
                  <span
                    key={tool}
                    data-reveal
                    data-reveal-delay="0ms"
                    className="about-tag px-3 py-1.5 text-xs"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div
              data-reveal
              data-reveal-delay="160ms"
              className="pt-6 border-t"
              style={{ borderColor: "#D9D2C5" }}
            >
              <p
                className="text-[11px] tracking-[0.3em] mb-1"
                style={{ color: "#333333" }}
              >
                BASED IN
              </p>
              <p
                className="text-sm"
                style={{ color: "#444444" }}
              >
                {personal.location}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
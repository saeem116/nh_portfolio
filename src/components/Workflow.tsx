"use client";

import { skills, services, quote } from "../content";

export function Workflow() {
  return (
    <section id="skills" className="section border-t border-line bg-warm-ivory">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.4fr_1.2fr] gap-12 lg:gap-16">
          {/* Column A: Skills & Expertise */}
          <div>
            <h3
              data-reveal
              data-reveal-delay="0ms"
              className="font-serif text-ink text-3xl md:text-4xl leading-none mb-8"
            >
              SKILLS &<br />
              <span className="text-terracotta">EXPERTISE</span>
            </h3>
            <div className="flex flex-col">
              {skills.map((s, i) => (
                <SkillBar key={s.name} skill={s} index={i} />
              ))}
            </div>
          </div>

          {/* Column B: Statement / pull quote */}
          <div className="flex flex-col">
            <span
              data-reveal
              data-reveal-delay="120ms"
              className="font-serif text-terracotta text-6xl md:text-8xl leading-none select-none opacity-80"
            >
              &ldquo;
            </span>
            <p
              data-reveal
              data-reveal-delay="200ms"
              className="font-serif text-ink text-xl md:text-2xl lg:text-3xl leading-snug mt-2"
            >
              {quote.text}
            </p>
          </div>

          {/* Column C: Design & development principles */}
          <div>
            <p
              data-reveal
              data-reveal-delay="0ms"
              className="text-[11px] tracking-[0.3em] text-muted mb-6"
            >
              PRINCIPLES
            </p>
            <div className="flex flex-col">
              {services.map((s, i) => (
                <ServiceRow key={s.number} service={s} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillBar({
  skill,
  index,
}: {
  skill: { name: string; level: number };
  index: number;
}) {
  return (
    <div
      data-reveal
      data-reveal-delay={`${index * 70}ms`}
      className="py-4 border-b border-line"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] tracking-[0.2em] text-muted">
          {skill.name}
        </span>
        <span className="text-[10px] tracking-[0.2em] text-muted-soft">
          {skill.level}%
        </span>
      </div>
      <div className="skill-bar-track w-full">
        <div
          className="skill-bar-fill w-full"
          style={{ transform: `scaleX(${skill.level / 100})` }}
          role="progressbar"
          aria-valuenow={skill.level}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

function ServiceRow({
  service,
  index,
}: {
  service: { number: string; title: string; description: string };
  index: number;
}) {
  return (
    <div
      data-reveal
      data-reveal-delay={`${index * 80}ms`}
      className="flex items-start gap-4 py-3 border-b border-line"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-terracotta text-terracotta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div>
        <p className="text-[11px] tracking-[0.2em] text-ink font-medium">
          {service.title}
        </p>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "../content";
import { ProjectCard } from "./ProjectCard";
import { VideoModal } from "./VideoModal";

const INITIAL_COUNT = 4;
const visible = projects.slice(0, INITIAL_COUNT);
const extra = projects.slice(INITIAL_COUNT);

export function SelectedProjects() {
  const [expanded, setExpanded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Scroll behavior on expand
  useEffect(() => {
    if (!expanded) return;
    if (typeof window === "undefined") return;

    const raf = requestAnimationFrame(() => {
      const section = containerRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportBottom = window.innerHeight;
      const sectionBottom = rect.bottom;

      if (sectionBottom > viewportBottom) {
        const behavior = reducedMotion ? "auto" : "smooth";
        section.scrollIntoView({ behavior, block: "nearest" });
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [expanded, reducedMotion]);

  // Scroll behavior on collapse
  useEffect(() => {
    if (expanded) return;
    if (typeof window === "undefined") return;

    const raf = requestAnimationFrame(() => {
      const section = containerRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      if (rect.top < 0) {
        const behavior = reducedMotion ? "auto" : "smooth";
        section.scrollIntoView({ behavior, block: "start" });
      }
    });

    return () => cancelAnimationFrame(raf);
  }, [expanded, reducedMotion]);

  const toggle = () => {
    setExpanded((prev: boolean) => !prev);
  };

  const openVideo = (index: number) => {
    setActiveIndex(index);
  };

  const closeVideo = () => {
    // Return focus to the card that opened the modal
    const idx = activeIndex;
    setActiveIndex(null);
    if (idx !== null && cardRefs.current[idx]) {
      cardRefs.current[idx]?.focus();
    }
  };

  const navigateVideo = (index: number) => {
    setActiveIndex(index);
  };

  const rowGap = 24; // px — matches gap-6 (1.5rem = 24px)

  return (
    <section
      id="work"
      ref={containerRef}
      className="section border-b border-line bg-warm-ivory"
    >
      <div className="site-container">
        {/* Three-part heading row */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-end gap-6 md:gap-8 mb-12">
          {/* Left: SELECTED / PROJECTS */}
          <div>
            <p
              data-reveal
              data-reveal-delay="0ms"
              className="font-display text-terracotta text-[11px] tracking-[0.35em] mb-2"
            >
              SELECTED
            </p>
            <h2
              data-reveal
              data-reveal-delay="80ms"
              className="font-display text-ink text-4xl md:text-5xl leading-none"
            >
              PROJECTS
            </h2>
          </div>

          {/* Center: description */}
          <p
            data-reveal
            data-reveal-delay="160ms"
            className="text-sm text-muted max-w-xs pb-1"
          >
            A curated selection of recent edits showcasing storytelling, pacing, color, and sound.
          </p>

          {/* Right: VIEW ALL / SHOW LESS toggle */}
          <div className="pb-1">
            <button
              ref={buttonRef}
              type="button"
              onClick={toggle}
              aria-expanded={expanded}
              aria-controls="more-projects"
              data-reveal
              data-reveal-delay="240ms"
              className="group inline-flex items-center gap-2 text-[11px] tracking-[0.3em] text-muted hover:text-terracotta transition-colors focus-ring"
              style={{ minWidth: "210px", justifyContent: "flex-end" }}
            >
              <span>{expanded ? "SHOW LESS" : "VIEW ALL PROJECTS"}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="w-4 h-4 transition-transform duration-500"
                style={{
                  transform: expanded ? "rotate(-45deg)" : "rotate(0deg)",
                }}
              >
                <path
                  d="M7 17L17 7M17 7H7M17 7V17"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Four-column project gallery — initial 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visible.map((p, i) => (
            <ProjectCard
              key={p.number}
              project={p}
              index={i}
              onPlay={() => openVideo(i)}
              ref={(el) => { cardRefs.current[i] = el; }}
            />
          ))}
        </div>

        {/* Extra projects — animated dropdown */}
        {extra.length > 0 && (
          <div
            id="more-projects"
            ref={moreRef}
            role="region"
            aria-label="More projects"
            aria-hidden={!expanded}
            style={{
              display: "grid",
              gridTemplateRows: expanded ? "1fr" : "0fr",
              transition: reducedMotion
                ? "grid-template-rows 1ms"
                : "grid-template-rows 700ms cubic-bezier(0.22, 1, 0.36, 1)",
              visibility: expanded ? "visible" : "hidden",
            }}
          >
            <div style={{ overflow: "hidden", minHeight: 0 }}>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                style={{ paddingTop: `${rowGap}px` }}
              >
                {extra.map((p, i) => (
                  <ProjectCard
                    key={p.number}
                    project={p}
                    index={i}
                    style={{
                      opacity: expanded ? 1 : 0,
                      transform: expanded
                        ? "translateY(0)"
                        : "translateY(24px)",
                      transition: reducedMotion
                        ? "opacity 1ms, transform 1ms"
                        : expanded
                        ? `opacity 500ms ease ${150 + i * 70}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${150 + i * 70}ms`
                        : "opacity 250ms ease, transform 250ms ease",
                    }}
                    tabIndex={expanded ? 0 : -1}
                    onPlay={() => openVideo(INITIAL_COUNT + i)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <VideoModal
        projects={projects}
        activeIndex={activeIndex}
        onClose={closeVideo}
        onNavigate={navigateVideo}
      />
    </section>
  );
}
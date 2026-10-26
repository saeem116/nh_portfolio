"use client";

import { forwardRef } from "react";
import type { Project } from "../content";

type ProjectCardProps = {
  project: Project;
  index: number;
  style?: React.CSSProperties;
  tabIndex?: number;
  onPlay?: () => void;
};

export const ProjectCard = forwardRef<HTMLButtonElement, ProjectCardProps>(
  function ProjectCard({ project, index, style, tabIndex, onPlay }, ref) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPlay?.();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        data-reveal
        data-reveal-delay={`${index * 80}ms`}
        onClick={onPlay}
        onKeyDown={handleKeyDown}
        aria-label={`Play video: ${project.title}`}
        className="group relative block text-left border border-line bg-transparent overflow-hidden transition-colors duration-300 hover:border-terracotta/60 focus-ring w-full cursor-pointer"
        style={{ ...style }}
        tabIndex={tabIndex}
      >
        {/* Image — wide preview, no scale on hover */}
        <div className="relative aspect-4/3 overflow-hidden bg-panel">
          <img
            src={project.image}
            alt={`${project.title} — ${project.category}`}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {/* Play icon overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 2 }}
          >
            <div
              className="play-icon-overlay flex items-center justify-center rounded-full"
              style={{
                width: 52,
                height: 52,
                background: "rgba(201, 117, 90, 0.92)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                style={{ marginLeft: 2 }}
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Number + title + category */}
        <div className="p-4">
          <span className="font-display text-terracotta text-2xl leading-none">
            {project.number}
          </span>
          <h3 className="font-display text-ink text-lg md:text-xl leading-none mt-1">
            {project.title}
          </h3>
          <p className="text-[10px] tracking-[0.2em] text-muted mt-1 uppercase">
            {project.category}
          </p>
        </div>
      </button>
    );
  }
);
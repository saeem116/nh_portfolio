"use client";

import { ReactNode, useEffect } from "react";
import type { Project } from "../content";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  const hasVideo = Boolean(project.videoUrl);

  return (
    <div
      className="fixed inset-0 z-[60] modal-backdrop flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-4xl bg-ink border border-line">
        <button
          type="button"
          aria-label="Close project"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center border border-line bg-ink text-text-soft hover:text-terracotta hover:border-terracotta transition-colors focus-ring"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          </div>

          <div className="p-6 md:p-8 flex flex-col">
            <p className="text-terracotta text-[11px] tracking-[0.35em] mb-2">
              {project.number} · {project.category.toUpperCase()}
            </p>
            <h3 className="font-display text-3xl md:text-4xl text-white leading-none mb-4">
              {project.title}
            </h3>
            <p className="text-sm text-text-soft leading-relaxed mb-6">
              {project.description}
            </p>

            {hasVideo ? (
              <div className="mt-auto">
                <p className="text-[10px] tracking-[0.3em] text-muted mb-2">
                  VIDEO
                </p>
                <video
                  src={project.videoUrl}
                  controls
                  playsInline
                  poster={project.image}
                  className="w-full max-h-[40vh] object-contain bg-black border border-line"
                />
              </div>
            ) : (
              <div className="mt-auto border-t border-line pt-4">
                <p className="text-[10px] tracking-[0.3em] text-muted">
                  NO VIDEO URL CONFIGURED
                </p>
                <p className="text-xs text-muted-soft mt-1">
                  Set <code className="text-terracotta/80">videoUrl</code> on this project in{" "}
                  <code className="text-terracotta/80">src/content.ts</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
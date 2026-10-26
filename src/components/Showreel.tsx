"use client";

import { useState } from "react";
import { showreel } from "../content";
import { VideoModal } from "./VideoModal";

export function Showreel() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hasVideo = Boolean(showreel.videoUrl);

  // For the showreel, we create a single "dummy" project so the modal works
  // with the unified VideoModal component.
  const showreelProject = {
    number: "00",
    title: showreel.title,
    category: "",
    description: showreel.description,
    image: showreel.poster,
    videoUrl: showreel.videoUrl,
    youtubeId: showreel.videoUrl.includes("youtube")
      ? showreel.videoUrl.split("v=")[1]?.split("&")[0] ?? ""
      : "",
    url: undefined,
  };

  const handleClose = () => {
    setActiveIndex(null);
  };

  const handleNavigate = (_index: number) => {
    // No-op for single-video showreel
  };

  return (
    <section id="showreel" className="section">
      <div className="site-container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-terracotta text-[11px] tracking-[0.35em] mb-2">
              {showreel.duration}
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-white leading-none">
              {showreel.title}
            </h2>
          </div>
          <p className="hidden md:block text-sm text-muted max-w-xs text-right">
            {showreel.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => hasVideo && setActiveIndex(0)}
          disabled={!hasVideo}
          aria-disabled={!hasVideo}
          className={`group relative block w-full overflow-hidden border border-line bg-panel focus-ring ${
            hasVideo ? "cursor-pointer hover:border-terracotta/60" : "cursor-default"
          }`}
        >
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <img
              src={showreel.poster}
              alt="Showreel poster"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/30" />

            {hasVideo ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex h-16 w-16 md:h-20 md:w-20">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-terracotta/30 animate-ping" />
                  <span className="relative inline-flex items-center justify-center h-full w-full rounded-full bg-terracotta text-white">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-7 h-7 md:w-8 md:h-8 ml-1"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[11px] tracking-[0.35em] text-muted mb-2">
                    NO VIDEO URL CONFIGURED
                  </p>
                  <p className="text-sm text-muted-soft">
                    Set <code className="text-terracotta/80">showreel.videoUrl</code> in{" "}
                    <code className="text-terracotta/80">src/content.ts</code> to enable playback.
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-xs tracking-[0.3em] text-muted mb-1">
                {showreel.duration} · {showreel.title}
              </p>
              <p className="text-sm text-text-soft max-w-md">
                {showreel.description}
              </p>
            </div>
          </div>
        </button>

        {hasVideo && (
          <VideoModal
            projects={[showreelProject]}
            activeIndex={activeIndex}
            onClose={handleClose}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </section>
  );
}

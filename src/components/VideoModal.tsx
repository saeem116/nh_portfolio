"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "../content";
import { GlowLayer } from "./GlowLayer";

type VideoModalProps = {
  projects: Project[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function VideoModal({ projects, activeIndex, onClose, onNavigate }: VideoModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dialogId = "video-modal-title";

  // Stable refs so keyboard handlers never capture stale closures
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  const handleClose = useCallback(() => {
    setVisible(false);
    const duration = reducedMotion ? 1 : 400;
    setTimeout(() => onCloseRef.current(), duration);
  }, [reducedMotion]);

  const navigatePrev = useCallback(() => {
    if (activeIndex === null) return;
    const next = activeIndex <= 0 ? projects.length - 1 : activeIndex - 1;
    onNavigateRef.current(next);
  }, [activeIndex, projects.length]);

  const navigateNext = useCallback(() => {
    if (activeIndex === null) return;
    const next = activeIndex >= projects.length - 1 ? 0 : activeIndex + 1;
    onNavigateRef.current(next);
  }, [activeIndex, projects.length]);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Open animation
  useEffect(() => {
    if (activeIndex !== null) {
      setLoading(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
    }
  }, [activeIndex]);

  // Scroll lock & aria-hidden on rest of page
  useEffect(() => {
    if (activeIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Hide rest of page from screen readers
    const mainContent = document.querySelectorAll("body > :not([data-video-modal])");
    mainContent.forEach((el) => el.setAttribute("aria-hidden", "true"));

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = "";
      mainContent.forEach((el) => el.removeAttribute("aria-hidden"));
    };
  }, [activeIndex]);

  // Focus trap & keyboard handling — uses stable refs to avoid stale closures
  useEffect(() => {
    if (activeIndex === null) return;

    // Focus close button on open
    setTimeout(() => closeRef.current?.focus(), reducedMotion ? 0 : 350);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigatePrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateNext();
        return;
      }
      // Focus trap
      if (e.key === "Tab") {
        const modal = document.querySelector("[data-video-modal-dialog]") as HTMLElement;
        if (!modal) return;
        const focusable = Array.from(
          modal.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null && !el.closest("iframe"));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // If focus lands inside the iframe, the keydown event fires on the iframe's
    // own document, so the parent `document` listener never sees it. Listen
    // on the iframe's contentWindow too. YouTube embeds are cross-origin, so
    // every access must be guarded — a thrown error here would tear down the
    // whole React tree.
    let iframeKey: ((e: KeyboardEvent) => void) | null = null;
    try {
      const iframe = iframeRef.current;
      const iframeWin = iframe?.contentWindow;
      if (iframeWin) {
        iframeKey = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            e.preventDefault();
            handleClose();
          }
        };
        iframeWin.addEventListener("keydown", iframeKey);
      }
    } catch {
      // cross-origin iframe — ignore
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (iframeKey) {
        try {
          const iframe = iframeRef.current;
          iframe?.contentWindow?.removeEventListener("keydown", iframeKey);
        } catch {
          // cross-origin iframe — ignore
        }
      }
    };
  }, [activeIndex, reducedMotion, handleClose, navigatePrev, navigateNext]);

  if (!mounted || activeIndex === null) return null;

  const project = projects[activeIndex];
  const duration = reducedMotion ? "1ms" : "400ms";
  const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <div data-video-modal="true">
      {/* Overlay — clicking the backdrop closes the modal. The dialog is a
          child of the overlay, so clicks inside the dialog never reach it. */}
      <div
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            handleClose();
          }
        }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(17,17,17,0.82)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: `opacity ${duration} ${easing}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Glow layer — behind dialog, inside the overlay, z-index 0 */}
        {visible && (
          <GlowLayer
            project={project}
            visible={visible}
            reducedMotion={reducedMotion}
          />
        )}

        {/* Dialog */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogId}
          data-video-modal-dialog
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "relative",
            width: "min(1100px, calc(100vw - 48px))",
            maxWidth: "100%",
            maxHeight: "calc(100svh - 24px)",
            background: "#F5F0E8",
            border: "1px solid #D9D2C5",
            borderRadius: 0,
            boxShadow: "0 30px 80px rgba(0,0,0,.45)",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? "auto" : "none",
            transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(12px)",
            transition: `opacity ${duration} ${easing}, transform ${duration} ${easing}`,
          }}
        >
          {/* Close button — inside dialog so it's never clipped and never
              intercepted by the overlay backdrop. */}
          <button
            ref={closeRef}
            onClick={handleClose}
            aria-label="Close video"
            className="focus-ring"
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(17,17,17,0.55)",
              border: "none",
              color: "#F5F0E8",
              cursor: "pointer",
              zIndex: 10,
              borderRadius: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Prev/Next buttons (desktop — inside dialog edges) */}
          <button
            onClick={navigatePrev}
            aria-label="Previous project"
            className="focus-ring hidden sm:flex"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(17,17,17,0.55)",
              border: "none",
              color: "#F5F0E8",
              cursor: "pointer",
              zIndex: 10,
              borderRadius: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={navigateNext}
            aria-label="Next project"
            className="focus-ring hidden sm:flex"
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(17,17,17,0.55)",
              border: "none",
              color: "#F5F0E8",
              cursor: "pointer",
              zIndex: 10,
              borderRadius: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Video area */}
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              background: "#111",
              overflow: "hidden",
            }}
          >
            {/* Loading spinner */}
            {loading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#111",
                  zIndex: 2,
                  transition: `opacity 300ms ease`,
                  opacity: loading ? 1 : 0,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    border: "2px solid transparent",
                    borderTopColor: "#C9755A",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              </div>
            )}
            <iframe
              key={project.youtubeId}
              ref={iframeRef}
              tabIndex={-1}
              src={`https://www.youtube-nocookie.com/embed/${project.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={`${project.title} video`}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setLoading(false)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          </div>

          {/* Info row */}
          <div
            style={{
              padding: "20px 24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "12px 24px",
            }}
          >
            <span
              className="font-display text-terracotta text-2xl leading-none"
              style={{ flexShrink: 0 }}
            >
              {project.number}
            </span>
            <h3
              id={dialogId}
              className="font-display text-ink text-lg md:text-xl leading-none"
              style={{ margin: 0 }}
            >
              {project.title}
            </h3>
            <p
              className="text-[10px] tracking-[0.2em] text-muted uppercase"
              style={{ margin: 0 }}
            >
              {project.category}
            </p>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
              {/* Mobile prev/next */}
              <div className="flex sm:hidden" style={{ gap: 8 }}>
                <button
                  onClick={navigatePrev}
                  aria-label="Previous project"
                  className="focus-ring"
                  style={{
                    width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "transparent", border: "1px solid #D9D2C5", cursor: "pointer", color: "#333",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                  onClick={navigateNext}
                  aria-label="Next project"
                  className="focus-ring"
                  style={{
                    width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "transparent", border: "1px solid #D9D2C5", cursor: "pointer", color: "#333",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${project.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[11px] tracking-[0.3em] text-muted hover:text-terracotta transition-colors focus-ring"
              >
                WATCH ON YOUTUBE
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

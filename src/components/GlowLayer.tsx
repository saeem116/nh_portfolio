/**
 * GlowLayer — ambient color glow behind the video modal dialog.
 *
 * Uses YouTube thumbnail frames (hqdefault + available hq1-hq3) blurred
 * and saturated to create a soft halo around the dialog. Frames cross-fade
 * every 5 s. Handles letterboxed content by detecting dark rows via canvas.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "../content";

// SPREAD in px per breakpoint
const BREAKPOINTS = {
  desktop: 90,
  tablet: 56,
  mobile: 36,
};

function getSpread(): number {
  const w = typeof window !== "undefined" ? window.innerWidth : 1024;
  if (w >= 1024) return BREAKPOINTS.desktop;
  if (w >= 640) return BREAKPOINTS.tablet;
  return BREAKPOINTS.mobile;
}

function getBlur(): number {
  const w = typeof window !== "undefined" ? window.innerWidth : 1024;
  return w < 640 ? 32 : 48;
}

function getWholeOpacity(): number {
  const w = typeof window !== "undefined" ? window.innerWidth : 1024;
  return w < 640 ? 0.7 : 0.78;
}

export type GlowFrame = {
  url: string;
  naturalWidth: number;
  naturalHeight: number;
};

export type GlowState = {
  frames: GlowFrame[];
  crop: { top: number; bottom: number; scale: number } | null;
};

const THUMB_BASE = "https://i.ytimg.com/vi";

/** Returns the list of available thumbnail URLs for a YouTube ID. */
export function getGlowFrames(youtubeId: string): Promise<GlowFrame[]> {
  const urls = [`${THUMB_BASE}/${youtubeId}/hqdefault.jpg`];
  // hq1/hq2/hq3 are 120×90 thumbnails; include them if they exist
  for (const extra of ["hq1", "hq2", "hq3"]) {
    urls.push(`${THUMB_BASE}/${youtubeId}/${extra}.jpg`);
  }
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<GlowFrame | null>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve({ url, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight });
          img.onerror = () => resolve(null);
          img.src = url;
        })
    )
  ).then((results) => results.filter((f): f is GlowFrame => f !== null));
}

/**
 * Detect letterbox bars in a thumbnail and return crop percentages.
 * Returns null if CORS blocks access or an error occurs.
 */
async function detectCrop(frame: GlowFrame): Promise<{ top: number; bottom: number; scale: number } | null> {
  try {
    const resp = await fetch(frame.url, { cache: "force-cache" });
    if (!resp.ok) return null;
    const blob = await resp.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 18;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, 32, 18);
    const data = ctx.getImageData(0, 0, 32, 18).data;
    const rowBrightness: number[] = [];
    for (let y = 0; y < 18; y++) {
      let sum = 0;
      for (let x = 0; x < 32; x++) {
        const i = (y * 32 + x) * 4;
        sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      rowBrightness.push(sum / 32);
    }
    // First/last row with brightness > 12/255 (~5% of max)
    let firstContent = 0;
    let lastContent = 17;
    for (let y = 0; y < 18; y++) {
      if (rowBrightness[y] > 12) { firstContent = y; break; }
    }
    for (let y = 17; y >= 0; y--) {
      if (rowBrightness[y] > 12) { lastContent = y; break; }
    }
    const contentH = lastContent - firstContent + 1;
    if (contentH < 4) return null; // no meaningful content detected
    const topPct = (firstContent / 18) * 100;
    const bottomPct = ((17 - lastContent) / 18) * 100;
    const scale = Math.min(1 / (contentH / 18), 2.2);
    return { top: topPct, bottom: bottomPct, scale };
  } catch {
    return null;
  }
}

type GlowLayerProps = {
  project: Project;
  visible: boolean;
  reducedMotion: boolean;
};

export function GlowLayer({ project, visible, reducedMotion }: GlowLayerProps) {
  const [state, setState] = useState<GlowState>({ frames: [], crop: null });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [glowOpacity, setGlowOpacity] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingRef = useRef(0);
  const framesLenRef = useRef(state.frames.length);
  framesLenRef.current = state.frames.length;

  // Fetch frames when project changes
  useEffect(() => {
    loadingRef.current += 1;
    const loadId = loadingRef.current;
    getGlowFrames(project.youtubeId).then((frames) => {
      if (loadId !== loadingRef.current) return;
      setState({ frames, crop: null });
      setCurrentIdx(0);
      // Detect crop on first frame
      if (frames.length > 0 && !reducedMotion) {
        detectCrop(frames[0]).then((crop) => {
          if (loadId !== loadingRef.current) return;
          setState((s) => ({ ...s, crop: crop ?? { top: 0, bottom: 0, scale: 1.25 } }));
        });
      } else if (frames.length > 0) {
        // reduced motion: use default scale
        setState((s) => ({ ...s, crop: { top: 0, bottom: 0, scale: 1.25 } }));
      }
    });
    return () => {
      loadingRef.current = loadId;
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [project.youtubeId, reducedMotion]);

  // Cross-fade interval
  useEffect(() => {
    if (reducedMotion || state.frames.length < 2) return;
    const ms = 5000;
    intervalRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % framesLenRef.current);
    }, ms);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [state.frames.length, reducedMotion]);

  // Fade in/out with modal visibility
  useEffect(() => {
    if (visible) {
      // For reduced motion, set opacity instantly with no delay
      if (reducedMotion) {
        setGlowOpacity(getWholeOpacity());
        return;
      }
      const t = setTimeout(() => setGlowOpacity(getWholeOpacity()), 50);
      return () => clearTimeout(t);
    } else {
      setGlowOpacity(0);
    }
  }, [visible, reducedMotion]);

  const blur = getBlur();
  const spread = getSpread();
  const opacity = glowOpacity;
  const { frames, crop } = state;

  if (frames.length === 0) return null;

  return (
    <div
      data-glow-layer
      style={{
        position: "absolute",
        // Expand by SPREAD on every side
        left: -spread,
        right: -spread,
        top: -spread,
        bottom: -spread,
        zIndex: 0,
        pointerEvents: "none",
        opacity,
        transition: reducedMotion ? "none" : "opacity 600ms ease",
        contain: "paint",
      }}
      aria-hidden="true"
      role="presentation"
    >
      {frames.map((frame, i) => {
        const isActive = i === currentIdx;
        // Image-specific styles
        const imgStyle: React.CSSProperties = {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: `blur(${blur}px) saturate(1.8) brightness(1.15)`,
          opacity: isActive ? 1 : 0,
          transition: reducedMotion
            ? "none"
            : `opacity 2200ms ease-in-out`,
          ...(crop
            ? {
                transform: `scale(${crop.scale})`,
                transformOrigin: "center center",
                objectPosition: `center ${crop.top}%`,
              }
            : {}),
        };
        return (
          <img
            key={frame.url}
            src={frame.url}
            alt=""
            loading="eager"
            decoding="async"
            crossOrigin="anonymous"
            style={imgStyle}
            onError={() => {
              // Drop this frame silently
            }}
          />
        );
      })}
      {/* Radial mask to fade glow at edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          maskImage: "radial-gradient(ellipse at center, #000 55%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 55%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { personal } from "../content";

/**
 * Hero section — fixed 1168×846 artboard stage.
 *
 * Scale is driven solely from the frame's clientWidth inside the
 * site-container so the hero spans the same content width as every
 * other section.  Aspect-ratio keeps the height proportional.
 *
 * Layering (back → front):
 *   bg → headline → circle → portrait → badge → label columns → intro → hairline
 */

const W = 1168;
const H = 846;
const ASPECT_RATIO = `${W} / ${H}`;
const SVG_VIEWBOX = "0 0 " + W + " " + H;

export function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [s, setS] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = frameRef.current!;
    const update = () => setS(el.clientWidth / W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Mark the hero root as "ready" once the stage scale has been measured.
  // The CSS rule for load animations only starts after BOTH
  // html[data-revealed] AND [data-ready="true"] are present.
  useLayoutEffect(() => {
    if (s != null && stageRef.current) {
      stageRef.current.dataset.ready = "true";
      setReady(true);
    }
  }, [s]);

  // ── shared styles ──────────────────────────────────────────────────
  const labelText: React.CSSProperties = {
    width: 12,
    fontSize: 11,
    lineHeight: "12px",
    letterSpacing: "0.25em",
    fontWeight: 500,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    color: "#333",
    writingMode: "vertical-rl",
  };

  const rule = (h: number, mt: number): React.CSSProperties => ({
    width: 1,
    height: h,
    marginTop: mt,
    background: "#333",
    opacity: 0.6,
  });

  return (
    <section style={{ background: "#F5F0E8" }}>
      <div className="site-container">
        {/* Frame sized to content width; height from aspect-ratio */}
        <div
          ref={frameRef}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: ASPECT_RATIO,
            overflow: "hidden",
          }}
        >
          {/* Stage: fixed 1168×846 artboard scaled as one unit */}
          <div
            ref={stageRef}
            data-group="load"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: W,
              height: H,
              transform: s != null ? "scale(" + s + ")" : "scale(1)",
              transformOrigin: "top left",
              visibility: s != null ? "visible" : "hidden",
            }}
          >
            {/* Cream background */}
            <div
              style={{ position: "absolute", inset: 0, background: "#F5F0E8" }}
            />

            {/* ── Layer 2: "PORTFOLIO" headline ────────────────────────── */}
            <svg
              data-anim="mask"
              data-group="load"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: W,
                height: H,
                "--d": "350ms",
                "--reveal-distance": "28px",
                opacity: 0,
              }}
              viewBox={SVG_VIEWBOX}
              preserveAspectRatio="xMidYMid meet"
            >
              <g transform="translate(103, 324.447674) scale(0.903355, 0.760180)">
                <text
                  x="0"
                  y="0"
                  fontFamily='"League Gothic", sans-serif'
                  fontWeight="400"
                  fontSize="455"
                  letterSpacing="-17"
                  fill="#111111"
                >
                  PORTFOLIO
                </text>
              </g>
            </svg>

            {/* ── Layer 3: Terracotta circle ──────────────────────────── */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: W,
                height: 835,
                overflow: "hidden",
              }}
            >
              <div
                data-anim="pop"
                data-group="load"
                data-duration="1000ms"
                style={{
                  position: "absolute",
                  left: 478,
                  top: 400,
                  width: 490,
                  height: 490,
                  borderRadius: "50%",
                  backgroundColor: "#C9755A",
                  transformOrigin: "center",
                  "--d": "250ms",
                  opacity: 0,
                }}
              />
            </div>

            {/* ── Layer 4: Portrait ───────────────────────────────────── */}
            <img
              src={personal.portrait}
              alt="Portrait of NH Pavel"
              data-anim="up"
              data-group="load"
              style={{
                position: "absolute",
                left: 430,
                top: 134,
                width: 659,
                height: 701,
                "--d": "600ms",
                "--reveal-distance": "60px",
                opacity: 0,
                willChange: "opacity, translate",
              }}
              loading="eager"
            />

            {/* ── Layer 5: Badge ──────────────────────────────────────── */}
            <div
              data-anim="pop"
              data-group="load"
              data-duration="700ms"
              style={{
                position: "absolute",
                left: 945,
                top: 480,
                width: 150,
                height: 150,
                "--d": "1100ms",
                opacity: 0,
              }}
            >
              <svg
                viewBox="0 0 150 150"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <defs>
                  <path
                    id="badgeCircle"
                    d="M75,15 A60,60 0 1,1 74.99,15"
                    fill="none"
                  />
                </defs>
                <circle
                  cx="75"
                  cy="75"
                  r="70"
                  fill="#F5F0E8"
                  stroke="#BDB8AD"
                  strokeWidth="1"
                />
                <text
                  fill="#333333"
                  fontSize="9"
                  fontFamily="sans-serif"
                  fontWeight="500"
                  letterSpacing="0.15em"
                >
                  <textPath href="#badgeCircle" startOffset="0">
                    • AVAILABLE WORLDWIDE • AVAILABLE WORLDWIDE • AVAILABLE
                    WORLDWIDE •
                  </textPath>
                </text>
                <text
                  x="75"
                  y="65"
                  textAnchor="middle"
                  fill="#C4694B"
                  fontSize="14"
                  fontWeight="600"
                  letterSpacing="0.05em"
                >
                  OPEN
                </text>
                <text
                  x="75"
                  y="78"
                  textAnchor="middle"
                  fill="#C4694B"
                  fontSize="14"
                  fontWeight="600"
                  letterSpacing="0.05em"
                >
                  FOR NEW
                </text>
                <text
                  x="75"
                  y="91"
                  textAnchor="middle"
                  fill="#C4694B"
                  fontSize="14"
                  fontWeight="600"
                  letterSpacing="0.05em"
                >
                  PROJECTS
                </text>
              </svg>
            </div>

            {/* ── Layer 6a: LEFT label column ─────────────────────────── */}
            <div
              data-anim="left"
              data-group="load"
              style={{
                position: "absolute",
                left: 54,
                top: 40,
                width: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                "--d": "900ms",
                opacity: 0,
              }}
            >
              <div style={rule(40, 0)} />
              <div
                style={{
                  ...labelText,
                  marginTop: 17,
                  height: 103,
                  transform: "rotate(180deg)",
                }}
              >
                UI / UX DESIGN
              </div>
              <div style={rule(40, 22)} />
              <div
                style={{
                  ...labelText,
                  marginTop: 13,
                  height: 130,
                  transform: "rotate(180deg)",
                }}
              >
                WEB DEVELOPMENT
              </div>
            </div>

            {/* ── Layer 6b: RIGHT label column ────────────────────────── */}
            <div
              data-anim="right"
              data-group="load"
              style={{
                position: "absolute",
                left: 1116,
                top: 415,
                width: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                "--d": "1000ms",
                opacity: 0,
              }}
            >
              <div style={{ ...labelText, height: 75 }}>BRANDING</div>
              <div style={rule(47, 25)} />
              <div style={{ ...labelText, marginTop: 23, height: 155 }}>
                DIGITAL EXPERIENCES
              </div>
            </div>

            {/* ── Layer 6c: Intro text block ──────────────────────────── */}
            <div style={{ position: "absolute", left: 103, top: 447 }}>
              <p
                data-anim="up"
                data-group="load"
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  color: "#111",
                  textTransform: "uppercase",
                  margin: 0,
                  fontFamily: "var(--font-inter), sans-serif",
                  "--d": "700ms",
                  opacity: 0,
                }}
              >
                {personal.greeting}
              </p>
              <p
                data-anim="up"
                data-group="load"
                style={{
                  fontSize: 80,
                  fontWeight: 400,
                  lineHeight: "0.96",
                  color: "#111",
                  fontFamily: "var(--font-bodoni), serif",
                  textTransform: "uppercase",
                  margin: 0,
                  "--d": "780ms",
                  opacity: 0,
                }}
              >
                {personal.name.split(" ")[0]}
              </p>
              <p
                data-anim="up"
                data-group="load"
                style={{
                  fontSize: 80,
                  fontWeight: 400,
                  lineHeight: "0.96",
                  color: "#111",
                  fontFamily: "var(--font-bodoni), serif",
                  textTransform: "uppercase",
                  margin: 0,
                  "--d": "860ms",
                  opacity: 0,
                }}
              >
                {personal.name.split(" ").slice(1).join(" ")}
              </p>
              <p
                data-anim="up"
                data-group="load"
                style={{
                  marginTop: 16,
                  marginBottom: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "#C4694B",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-inter), sans-serif",
                  "--d": "960ms",
                  opacity: 0,
                }}
              >
                {personal.role}
              </p>
              <p
                data-anim="up"
                data-group="load"
                style={{
                  marginBottom: 16,
                  fontSize: 13.5,
                  lineHeight: "1.45",
                  color: "#222",
                  fontFamily: "var(--font-inter), sans-serif",
                  maxWidth: 280,
                  "--d": "1040ms",
                  opacity: 0,
                }}
              >
                I craft clean, modern, and user-focused websites that help
                brands stand out and connect with the right audience.
              </p>
              {/* Signature — Mrs Saint Delafield applied directly */}
              <p
                data-anim="fade"
                data-group="load"
                data-duration="1200ms"
                style={{
                  color: "#111",
                  fontSize: 28,
                  fontFamily: '"Mrs Saint Delafield", cursive',
                  fontStyle: "italic",
                  marginTop: 8,
                  "--d": "1200ms",
                  opacity: 0,
                }}
              >
                NH Pavel
              </p>
            </div>

            {/* ── Layer 7: Bottom hairline ────────────────────────────── */}
            <div
              data-anim="line"
              data-group="load"
              style={{
                position: "absolute",
                top: 835,
                left: 55,
                right: W - 1130,
                height: 1,
                background: "#BDB8AD",
                "--d": "1300ms",
                opacity: 0,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
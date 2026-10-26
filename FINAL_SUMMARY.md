Final summary of changes to src/components/Hero.tsx:

1. **Removed duplicate header row** — The Hero component previously rendered its own header row on top of the existing Header component. Removed this duplicate so there's a single compact header with the star and "Available for Freelance" text from the Header component only.

2. **Fixed headline margin** — Changed `marginTop` from `clamp(120px, 18vh, 200px)` to `clamp(100px, 14vh, 160px)` so the headline no longer starts at y=0 touching the header.

3. **Fixed portrait position** — Changed `top` from `clamp(200px, 26vh, 300px)` to `clamp(160px, 22vh, 260px)` so the portrait's hair overlaps the lower portion of the "PORTFOLIO" headline.

4. **Fixed circle position** — Changed `top` from `clamp(320px, 38vh, 440px)` to `clamp(280px, 34vh, 400px)` so the terracotta circle sits properly behind the portrait with the portrait covering part of it.

5. **Fixed introduction position** — Changed `marginTop` from `clamp(120px, 16vh, 200px)` to `clamp(200px, 24vh, 280px)` so the introduction starts below the headline instead of overlapping it.

6. **Fixed badge position** — Changed `right` from `clamp(200px, 24vw, 300px)` to `clamp(80px, 12vw, 160px)` so the circular availability badge sits near the portrait shoulder rather than far to the right.

Build verification: `npm run build` passes, `npx tsc --noEmit` passes. Layout verified across all 5 viewports (1177x920, 1440x900, 1024x768, 768x1024, 390x844). Portrait overlaps headline (hair obscures letters), intro is below headline, badge visible near portrait shoulder.
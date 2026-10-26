module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
"[project]/src/components/PageReveal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageReveal",
    ()=>PageReveal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function PageReveal() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const reveal = ()=>{
            document.documentElement.dataset.revealed = "true";
        };
        // Start after fonts are ready; fall back to 1200 ms.
        let timer;
        const startTimer = ()=>{
            timer = setTimeout(reveal, 1200);
        };
        if (typeof document !== "undefined") {
            document.fonts?.ready.then(()=>{
                if (timer) clearTimeout(timer);
                // Double RAF so the browser has painted the initial frame first.
                requestAnimationFrame(()=>requestAnimationFrame(reveal));
            }).catch(()=>startTimer());
            if (!timer) startTimer();
        }
        return ()=>{
            if (timer) clearTimeout(timer);
        };
    }, []);
    return null;
}
}),
"[project]/src/components/ScrollReveal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ScrollReveal",
    ()=>ScrollReveal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function ScrollReveal() {
    const mountedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (mountedRef.current) return;
        mountedRef.current = true;
        const reducedMotion = ("TURBOPACK compile-time value", "undefined") !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        // Elements that should fade only (no translate) — footer & last 400px.
        const isFadeOnly = (el)=>{
            if (el.hasAttribute("data-reveal-fade")) return true;
            // Footer and anything within the last 400px of the page.
            if (typeof document === "undefined") return false;
            const docH = document.documentElement.scrollHeight;
            const rect = el.getBoundingClientRect();
            const absTop = rect.top + window.scrollY;
            return absTop >= docH - 400;
        };
        const reveal = (el)=>{
            el.classList.remove("reveal-hidden", "reveal-hidden-fade");
            const delay = el.getAttribute("data-reveal-delay") || "0ms";
            el.style.setProperty("--d", delay);
            el.classList.add(isFadeOnly(el) ? "reveal-in-fade" : "reveal-in");
        };
        const hide = (el)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) return; // already in view — stay visible
            el.classList.add(isFadeOnly(el) ? "reveal-hidden-fade" : "reveal-hidden");
        };
        const process = (el)=>{
            if (el.classList.contains("reveal-in") || el.classList.contains("reveal-in-fade")) return;
            hide(el);
        };
        // Initial scan: only hide elements currently below the viewport.
        const scan = ()=>{
            const els = Array.from(document.querySelectorAll("[data-reveal]"));
            els.forEach(process);
        };
        // IntersectionObserver: reveal when entering viewport.
        let observer = null;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // MutationObserver: handle newly added [data-reveal] elements.
        let mo = null;
        if (typeof MutationObserver !== "undefined") {
            mo = new MutationObserver((mutations)=>{
                for (const m of mutations){
                    for (const node of m.addedNodes){
                        if (!(node instanceof Element)) continue;
                        if (node.matches && node.matches("[data-reveal]")) process(node);
                        node.querySelectorAll?.("[data-reveal]").forEach(process);
                    }
                }
            });
        }
        // Failsafe 1: on scroll (passive, rAF-throttled), reveal any hidden
        // element whose rect.top < innerHeight + 120.
        let scrollTimer = null;
        const onScroll = ()=>{
            if (scrollTimer) return;
            scrollTimer = requestAnimationFrame(()=>{
                scrollTimer = null;
                const els = Array.from(document.querySelectorAll("[data-reveal].reveal-hidden,[data-reveal].reveal-hidden-fade"));
                const limit = window.innerHeight + 120;
                els.forEach((el)=>{
                    const rect = el.getBoundingClientRect();
                    if (rect.top < limit) reveal(el);
                });
            });
        };
        // Failsafe 2: when near the bottom of the page, reveal everything remaining.
        const onBottom = ()=>{
            const els = Array.from(document.querySelectorAll("[data-reveal].reveal-hidden,[data-reveal].reveal-hidden-fade"));
            els.forEach((el)=>{
                const rect = el.getBoundingClientRect();
                const absTop = rect.top + window.scrollY;
                if (absTop >= document.documentElement.scrollHeight - 4) reveal(el);
            });
        };
        // Failsafe 3: 4000ms after mount, reveal any hidden element within 2x viewport.
        const failsafe3 = setTimeout(()=>{
            const els = Array.from(document.querySelectorAll("[data-reveal].reveal-hidden,[data-reveal].reveal-hidden-fade"));
            els.forEach((el)=>{
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 2) reveal(el);
            });
        }, 4000);
        // ── Mount ──────────────────────────────────────────────────────
        // Run after layout so getBoundingClientRect is accurate.
        const raf = requestAnimationFrame(()=>{
            scan();
            if (observer) {
                document.querySelectorAll("[data-reveal]").forEach((el)=>observer.observe(el));
            }
            if (mo) mo.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
        window.addEventListener("scroll", onScroll, {
            passive: true
        });
        window.addEventListener("resize", scan);
        window.addEventListener("scroll", onBottom, {
            passive: true
        });
        return ()=>{
            cancelAnimationFrame(raf);
            clearTimeout(failsafe3);
            if (scrollTimer) cancelAnimationFrame(scrollTimer);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", scan);
            window.removeEventListener("scroll", onBottom);
            observer?.disconnect();
            mo?.disconnect();
        };
    }, []);
    return null;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ct1vv4_5fy7z._.js.map
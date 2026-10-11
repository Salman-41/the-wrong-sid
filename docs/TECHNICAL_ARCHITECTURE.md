# Technical architecture (provisional)

## Prototype implementation (2026-10-11)

The textile-engine stage now implements Next 16 / React 19, a deterministic TypeScript interlacement model and custom Canvas 2D renderer. The interactive study lives at `/`; the six exhibition routes remain planned. Dense yarn rendering justifies Canvas here. OffscreenCanvas runs in a worker when available, with a Canvas main-thread fallback. Rendering occurs on state/resize only, culls invisible floats and batches fiber strokes. Each surface is capped at DPR 2 and four million backing pixels. Front/reverse mirror and invert the same artwork; ten focused tests include actual raster crossing ownership. Native Canvas adapter inspection and the production build passed; browser runtime and device profiling remain to be checked. No GSAP motion is needed for this stage.

## Stack decision
- **Next.js 16 App Router + React 19.2 + TypeScript.** Current official release information indicates compatibility, with Next 16 requiring Node.js 20.9+ and TypeScript 5.1+. Use current stable patch releases at project start, lock dependencies, and follow the v16 async API migration notes. No compatibility blocker found.
- **GSAP 3.x** for a small set of authored, interaction-led transitions. Use scoped contexts/`useGSAP`, clean up on unmount, and `matchMedia` for responsive and reduced-motion behavior. Keep content and state transitions functional without animation. Check current GSAP license for chosen use and plugins before adoption.
- **SVG and semantic HTML as default rendering.** The pack is vector editorial art; HTML carries text/controls and SVG serves precise diagrams/patterns. Use Canvas 2D only if profiling shows a genuine need for dense dynamic marks or a larger configurable textile surface. No Three.js/WebGL requirement is evident.
- **Server-first routes, small client islands.** Keep collection copy and stable page structure server rendered; isolate Loom, Reverse, Pattern Room, Edition and Entrance controls/animations as client components. Store artwork as structured pattern data where practical, render vector output deterministically, and allow export without a server dependency.

## Experience boundaries
Routes: `/` Entrance, `/loom`, `/reverse`, `/pattern-room`, `/collection`, `/edition`. A consistent editorial navigation shell carries active location and mobile menu. Each route owns a distinct layout and page-specific controls; do not create one reusable hero/card template across routes.

Core state: weave structure, warp/weft palette, row sequence, undo/redo; face selection and inspection location; pattern transform parameters; edition composition and output settings. Define serializable schemas before building so preview, accessible labels, repeat generation, and export share one source of truth. Persist only if a user-facing need is approved; keep first version local and private.

## Performance and responsive plan
- Establish baseline and per-route budgets during implementation. Initial working targets: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at 75th percentile; transfer budgets proposed for review: initial JS ≤150 KB gzip, initial image payload ≤500 KB, total first-view transfer ≤1 MB on mobile. Measure on real mobile/network profiles, then revise with evidence.
- Use responsive AVIF/WebP image variants, explicit aspect ratios, lazy-load below fold, preload only the true LCP image, and avoid shipping duplicate base64 artwork. Subset/self-host selected WOFF2 fonts with appropriate fallbacks; avoid loading unused scripts.
- Prefer transform/opacity transitions over layout-affecting animation, pause offscreen work, avoid continuous rendering when idle, cap device-pixel-ratio backing stores for Canvas, and redraw on state/resize rather than on every frame.
- Use mobile-first layouts matched to the 390×844 artboards and test intermediate widths, portrait/landscape, zoom and touch. Core Web Vitals thresholds are official “good” thresholds; proposed asset budgets are project guardrails, not standards.

## Accessibility and fallbacks
- Target WCAG 2.2 AA: semantic landmarks/headings, keyboard operation and visible focus, text alternatives, 4.5:1 normal text / 3:1 large text contrast, minimum 24×24 CSS px targets subject to exceptions; aim for 44×44 touch controls.
- Every drag-capable action has a single-pointer alternative. Use native buttons/radios/sliders with labels and announce meaningful row counts/status updates. Keep focus stable after actions.
- Respect `prefers-reduced-motion`; disable/reduce nonessential transitions and never make meaning depend on animation. Provide pause for any sustained automatic movement.
- Canvas is not semantic to assistive technology. If used, pair it with an accessible DOM control/description model; keep selection, output state, and explanatory content outside the bitmap. SVG diagrams require title/description or an adjacent equivalent explanation.

## Verification gates (for later build)
Implement only after the six compositions and behavior contracts are agreed. Then verify route/content correctness, responsive behavior, keyboard/touch interactions, reduced motion, contrast, export output, image source/licensing, and Core Web Vitals in both lab and field where available. No website code exists yet.

## Research links
- [Next.js 16 release](https://nextjs.org/blog/next-16), [upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16), [production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [React 19.2](https://react.dev/blog/2025/10/01/react-19-2)
- [GSAP installation](https://gsap.com/docs/v3/Installation/), [GSAP React context](https://gsap.com/docs/v3/GSAP/gsap.context/), [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/)
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API), [canvas accessibility/fallback](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage)
- [WCAG 2.2](https://www.w3.org/TR/wcag/), [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)
- [Core Web Vitals thresholds](https://web.dev/articles/vitals)

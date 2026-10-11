# Build status

**State: textile-engine proof of concept implemented and ready for local use; full exhibition not yet built.** Updated 2026-10-11 (Asia/Karachi). This stage is committed locally; no push, deployment or service purchase.

## Delivered
- Read all six planning documents, design notes/tokens, and the 12 SVG references; reviewed paired contact sheets. Retained the paper/plum editorial direction for a focused material examination interface.
- Next.js 16.4.0, React/React DOM 19.3.0 and TypeScript 5.9.3 are resolved in `package-lock.json`. The Next 16 / React 19 architecture remains intact. No animation library or WebGL is needed for this event-driven study.
- Shared TypeScript artwork model: warp/weft colors and thickness, repeat matrices, plain weave, defined 2/2 twill, valid five-end satin/sateen (step two), seed and versioned JSON import/export with input validation.
- Front/reverse views use the same physical yarns: reverse mirrors the horizontal coordinates and inverts crossing order. No independent back-face artwork or image is substituted.
- Custom Canvas 2D material renderer: continuous yarns and raised float runs, rounded contours, directional shading, overlap/contact shadows, fine seeded fibers and sparse loose fibers. First render was refined to remove angular shoulders and excessively regular fiber marks.
- Responsive local interface: structure selection, warp/weft swatches and custom colors, solid/banded rhythm, thickness, 1–5× magnification, face toggle/comparison, JSON save/restore and 2000 × 2000 PNG export.
- OffscreenCanvas worker path with request coalescing, stale-bitmap disposal and main-thread fallback; visible-run culling, batched fiber strokes, event-only redraws, DPR 2/four-million-pixel cap per surface.
- GFS Didot font downloaded from Google Fonts with its SIL OFL license. Original museum/concept assets are not used for this engine.

## Verification evidence
- `npm test`: **10 passed, 0 failed**. Eight model tests plus rendered crossing ownership over all four structures/both faces and a high-resolution cap test. The renderer check uses an odd, non-repeat-aligned width to catch missed mirroring.
- `npm run typecheck`: passed.
- `npm run build`: production build passed; `/` is statically prerendered and the worker bundle compiles.
- Local development route returned HTTP **200**. Artwork controls render in the server response.
- Same-renderer native Canvas PNGs reviewed for plain, twill and satin/sateen; overview and macro images are reproducible with `node --import tsx scripts/render-studies.ts`.
- Example native adapter timings at 800×800, 3.8× zoom after stroke batching: ~108–315 ms for a single surface, 161–324 drawn runs. These are machine-specific native Canvas measurements, not browser, mobile or Core Web Vitals results. Worker rendering protects the main browser thread on supported devices; fallback redraws can block while rendering.
- Connected browser tool reported no available browser. Browser hydration, worker runtime, download/import interaction, touch/keyboard checks and real-device performance have **not** been verified in this session.

## Run and review

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:3000`. See the root README for controls, model conventions and production/test commands. Approximate lighting/crimp/fiber must not be presented as physically exact fabric mechanics.

## Exact next steps after this stage
1. Open the prototype in a browser on desktop and mobile. Check all four structures, independent yarn-color changes, thickness/magnification, both faces/comparison and a JSON save → reopen → PNG download. Confirm worker rendering and test the fallback once.
2. Measure input/render latency on a low-end laptop and a mobile device; adjust detail/resolution if needed. Verify focus, labels, contrast, narrow layouts and reduced-motion behavior. There is no automatic material animation.
3. Review the engine’s material quality and behavior as the foundation for Loom, Reverse, Pattern Room and Edition; then authorize the full exhibition implementation.
4. Before Collection implementation, obtain the actual Met Open Access image for object 66.122.20 and record its exact metadata/rights. Resolve provenance of the Entrance/Reverse concept image separately.
5. Build the remaining complete experiences against their paired SVG compositions, reusing the shared artwork model without repeating page layouts.
6. A later push task must first inspect the current branch/remotes and repository contents. Git is initialized on `main` with `origin/main` tracking; the previous planning note about missing `.git` is obsolete. Verify the remote URL before a later push. Do not push or deploy as part of this stage.

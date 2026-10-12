# Build status

**State: complete interactive Loom implemented; Entrance remains complete.** Updated 2026-10-12 (Asia/Karachi). This stage is committed locally. No push or deployment.

## Delivered this stage

- Inspected the approved Loom desktop/mobile SVGs and previews, art direction, rules, current engine and previous status. Rebuilt the composition with HTML/CSS, original shuttle SVG, tensioned warp vectors and live Canvas material. No artboard screenshot is used as the interface.
- Desktop: tall GFS Didot title, dominant wooden instrument, left warp palette and integrated right working rail. Mobile: independently composed title/frame, six large yarn targets, prominent sticky Add Row, compact progress/history and a touch-friendly warp disclosure.
- Real construction: start with 48 warp ends and 28 woven rows, capacity 60. Choose next weft color and plain, defined 2/2 twill, valid five-end satin or complementary sateen; Add Row commits that yarn and rule. Existing rows retain their crossing rules, using the absolute pick phase. Warp accent changes recolor the actual ends.
- Undo/redo covers yarn, structure, row insertion, reset and restored artwork; history is bounded to 80 changes. Reset clears woven picks and preserves the warp and next yarn. Capacity/progress derive from actual data.
- Version 2 JSON stores individual yarns/thicknesses, every pick’s structure, next yarn/rule, seed and capacity. Save/Open cloth round-trip the construction; validated version 1 artwork migrates. No account, service or automatic remote storage. Save a file before refreshing or closing.
- One root provider shares the artwork and history across client navigation. Reverse renders and compares this same cloth, mirroring ends and inverting crossings. Pattern Room and Edition now read the shared construction at their preparation boundaries; their full experiences remain future work.
- GSAP loads on the first animated row insertion: shuttle pass, weft reveal and brief beater settling. Shuttle height follows construction progress. No idle animation or unrelated cloth motion. Reduced motion inserts immediately. Workspace Enter/Space, native controls and Ctrl/Cmd+Z / Shift+Z provide keyboard alternatives.
- Magnification opens an accessible native dialog with the actual material and a 1–5× slider. Escape closes it. Canvas has equivalent descriptions and DOM controls/progress/status.
- Reusable Canvas hook coalesces worker requests, disposes stale image bitmaps and falls back to main-thread Canvas. Rendering is event-driven, capped at DPR 2 / four million pixels. Draft yarn/rule changes do not redraw finished cloth; bottom-up rows and transparent/stretch placement integrate it with the frame. No WebGL.
- Static renderer-derived Loom cloth and updated front/reverse posters support initial/no-JavaScript viewing. Inactive controls remain disabled before hydration. Wood/shading/crimp/movement are labeled visual approximations, not fabric mechanics.

## Essential verification

- `npm test`: **17 focused checks passed**. Includes plain/twill/satin mathematics, reverse transforms, actual raster crossing ownership, per-pick preservation, capacity, history/reset, version 1 migration and version 2 serialization.
- `npm run typecheck`: passed, strict TypeScript.
- Chromium **1440×900 desktop**: row 28→29 with selected Lilac/2/2 twill; saved JSON confirms old plain rows unchanged. Undo/redo/reset, Enter insertion, Ctrl+Z/Shift+Z, magnification, Escape and exact save/restore round trip passed. Both Reverse canvases and Pattern Room/Edition read the same 29-row construction after client navigation.
- Chromium **390×844 touch / reduced motion**: weft/warp selection, sateen insertion and save-data assertions passed; shuttle stays static, Add Row is 54px high, no horizontal overflow. No browser page errors in these checks.
- JavaScript disabled: renderer-produced static Loom cloth loads and making controls remain inactive. Desktop/mobile/macro screenshots were visually inspected against the approved references; mobile frame begins at y≈243 as designed. Screenshots are ignored local review artifacts.
- No production build, Lighthouse, deployment or extensive QA ran. Earlier prototype/Entrance checks remain historical; no claim of a current production build or independent Awwwards score.

## Exact next steps

1. Implement Reverse’s approved composition around the shared per-pick model; retain matching front/back geometry and replace the provisional concept hero only when the finished material system is ready.
2. Implement Pattern Room’s actual repeat/scale/palette operations. Define whether repeating mixed structures preserves absolute pick phase or repeats a finite cloth tile; check repeat seams explicitly.
3. Implement Edition’s separate print composition and output contract using the same artwork. Define format, dimensions and selected face before export.
4. Implement Collection with the real Met 66.122.20 public-domain image and retained institutional metadata. Develop Entrance’s full physical lift interaction in its own stage.
5. In a later authorized stage, run a production build and broader accessibility/device/performance checks, including intermediate widths, contrast, browser/Canvas fallbacks, low-end device profiling and field budgets. Inspect branch/remotes before any requested push/deployment.

Run `npm ci` then `npm run dev`; open `http://127.0.0.1:3000/loom`. The pre-existing staged `next-env.d.ts` change is preserved outside this stage’s commit. Prior local stage commits: engine `d58c408`, Entrance `c065156`.

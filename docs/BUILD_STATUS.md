# Build status

**State: sitewide creative refinement complete and checked locally.** Updated 2026-10-13 (Asia/Karachi). All six experiences remain functional. No push, deployment or service purchase occurred.

## Creative review delivered

- Reviewed all twelve approved SVGs, project rules and references; inspected the actual six-route application at desktop **1600×1000**, laptop **1366×768**, tablet **834×1112** and mobile **390×844** before and after improvements. [Creative review and rendered evidence](CREATIVE_REVIEW.md) record findings, decisions and limits.
- Refined the shared procedural material with diffuse yarn lighting, deterministic variation, narrower overlap shadows and clearer fibers. Reverse uses an undistorted macro crop with correctly transformed selection/fringe coordinates. Both faces still derive from the same crossings; added mathematical and pixel-ownership coverage for tall/wide crops.
- Composed a Didot wordmark and made Pattern Room directly accessible in desktop navigation. Reworked portrait-tablet Entrance, compact laptop Loom/Edition, tablet Reverse construction panel and Pattern Room touch controls. Museum opening labels now have an open editorial composition and preserve the exact object title.
- Pattern Room samples original yarn surfaces directly, avoiding a blurry intermediate bitmap, and scales composed artwork proportionally. Its graphic repeats may be cropped by the viewport; actual construction is unchanged. The bounded material/tile caches remain. Graphic Edition has stronger stacked type in both preview and export. All procedural posters were regenerated.
- Strict TypeScript and focused weave, reveal, Pattern renderer and Edition checks passed. Browser checks confirmed: one new twill row, normal-motion lift/turn/lens, Pattern Ribbon/compare, unchanged shared yarn/pick data through Edition, and a real **2400×3200 PNG** download. Tablet/mobile reweaving, menu/Escape, reduced-motion reverse and museum native-image examination passed. No horizontal overflow or page errors in the reviewed initial routes.
- Preserved licensed local fonts, museum sources/proportions, user artwork schema/history, save/reload/export features, accessible native controls and existing Canvas budgets. No added dependencies, unrelated motion or framework rewrite. This is a focused creative review, not production certification or an Awwwards score.

## Edition delivered

- Read both approved Edition artboards, the shared project model and yarn renderer. The page is a paper-and-print workspace: oversized Didot introduction, framed artwork, composition choices and a restrained settings rail. Mobile has its own preset strip, 44px background controls and persistent export action. HTML owns the controls; no artboard screenshot is used as the interface.
- **Full bleed:** actual cloth fills the sheet, with a quiet signature. **Material study:** a macro window, refined annotations and a simplified diagram of the same physical crossings. **Graphic edition:** curved cloth cuttings, expressive type and finite repeat slips derived from the Pattern Room arrangement. Each preset has a distinct scene.
- Choose portrait (2400×3200), square (2800×2800) or landscape (3200×2400), ivory/plum/vermilion paper, front/reverse, bounded scale/crop and optional title/credit. Reverse mirrors and complements the same yarn crossings. Composition edits never change construction.
- Backward-compatible version 2 artwork files include validated `edition` settings. Save/Open carries the textile, Pattern Room placement and print together. Older files receive defaults; client navigation retains the root project. Return to editing opens Pattern Room. No automatic storage.
- PNG is rendered anew at the stated dimensions from actual data and the editorial scene. SVG is a truthful hybrid: outlined type, cut boundaries, rules and crossing diagrams are vectors; procedural yarn surfaces are embedded PNGs. Both exclude website controls, external resources and museum photographs.
- Preview/export share the scene and local licensed fonts. Preview is capped at 960px width/DPR 1.5, coalesces changes and caches at most four material surfaces/three million pixels. Type/paper changes reuse yarns. Export runs in the application's Node route with the existing native Canvas dependency, bounded input and fixed sizes; no purchased service. The live renderer's four-million-pixel default remains unchanged.
- A renderer-derived WebP covers first paint/no-JavaScript viewing and is described as the initial studio cloth. Native radios, selects, labeled ranges, crop presets and status messages support keyboard/touch. No motion is required.

## Collection interface checkpoint

- The Collection implementation is already committed in `65b0e55`. Eleven verified textiles appear as an editorial publication with individually composed plates, source credits and technique/material/place browsing.
- Object-specific routes preserve authentic proportions, documented facts, attribution caveats, source links and related-work explanations. High-resolution works have an accessible examination viewer; the small Met starter stays at native resolution. Museum data remains separate from visitor artwork.
- This stage confirmed the publication opening image and Met bedding detail route load and decode in Chromium. Earlier focused metadata/image checks ran during implementation; this is not a comprehensive Collection audit.

## Edition verification

- `npm run typecheck`: passed under strict TypeScript.
- `node --import tsx --test tests/edition.test.ts tests/weave.test.ts`: passed. Focused checks cover settings/legacy serialization, bounded crop, mirrored/complemented reverse windows, distinct scenes, all three actual portrait PNGs, yarn recoloring, cache reuse/invalidation and self-contained SVG. Existing weave mathematics still pass.
- Actual high-resolution PNGs for all three layouts were visually inspected, alongside the browser-rendered SVG. These are finished artwork surfaces, not screenshots of the page.
- Chromium 1440×900: layout/format/face/crop/title/credit changes, 3200×2400 PNG/SVG downloads, Save/Open after refresh and return-to-editing navigation worked. SVG rendered material, vector diagram and outlined type. No horizontal overflow or page errors.
- Chromium 390×844 touch/reduced-motion: presets, square format, plum paper, title/crop refinements and a real 2800×2800 PNG download worked. Initial print and expanded controls were visually inspected; no horizontal overflow or page errors.
- No production build, Lighthouse, deployment or extensive QA. A Node runtime with native Canvas and bundled fonts is required for export; production packaging remains a later check. Yarn geometry is a visual approximation, not exact fabric mechanics.

## Collection research delivered

- Curated eleven real textiles from The Met (3), Cleveland Museum of Art (4), Cooper Hewitt (2), and the National Museum of American History (2). Titles, date strings, documented culture/geography/makers, original medium text, normalized materials and techniques, accession numbers, source records, image rights, and attribution guidance are prepared in `src/lib/collection-data.ts`.
- Downloaded and organized twelve museum-supplied image files at `public/images/collection/`, including a real Smithsonian quilt detail. These are optimized WebP derivatives of verified Met Public Domain, CMA CC0, and Smithsonian media marked CC0 sources. Original source links and dimensions are retained with the typed records. Local images were inspected together for composition and legibility.
- `docs/COLLECTION_RESEARCH.md` records each source, object facts, rights, image link, local asset, and cautious editorial looking note. `docs/ASSET_REGISTER.md` includes file dimensions, byte sizes and SHA-256 checksums.
- The Met starter object image is only 581 × 680 px and remains at native dimensions. The Silk Quilt's current maker attribution is explicitly flagged as under institutional review. The Pullen quilt's catalog describes writing on its reverse, but the bundled local image is not labeled or presented as that reverse.
- Research initially prepared metadata/images only; the separate Collection checkpoint above records the later interface implementation.

## Pattern Room delivered

- Inspected both approved Pattern Room SVGs and previews, project rules, art direction and textile engine. The route now uses live HTML/CSS controls and an original Canvas artwork. Desktop keeps the full-bleed cobalt/vermilion/ochre study, oversized Didot title and one paper tray. Mobile has its own tall cutting, 58px header, on-screen Save action and touch controls that open over the lower image.
- The version 2 artwork file now stores a validated graphic arrangement: Cutwork, Ribbon or Bias; a 1–4 by 1–4 finite repeat; and 0.75–1.75 scale. Older version 2 files load with default placement. No new service or automatic storage is involved.
- **Construction edits:** Reweave applies a supported plain, 2/2 twill, five-end satin or sateen rule to every existing pick and to the next-pick matrix. Recolor changes matching real warp or weft yarns, including a matching draft weft. **Graphic edits:** composition, repeat and scale only arrange finite cloth cuttings; the crossings and yarn records stay unchanged. UI copy, history and tests distinguish the two.
- Canvas textures come from stable 8-end × 4-pick windows of the visitor's actual cloth, rendered through the shared rounded-yarn renderer. Recoloring follows the same physical windows. Original desktop/mobile Cutwork, Ribbon and Bias masks arrange those textured pieces. They are art-directed cuts with lighting and edge depth, not a claim of seamless physical weaving at graphic repeat seams.
- Worker/main-thread rendering coalesces changes and drops stale frames. A bounded cache keeps two material versions for comparison and a few composition tiles; repeat/scale reuse existing yarn textures. DPR is capped at 1.75 and final surfaces at three million pixels. No continuous animation or WebGL.
- Previous/current uses the exact snapshot before the last edit, with an adjustable visual split. Undo/redo use the root project history. Save downloads the same artwork JSON that Loom can restore. The cloth and arrangement stay intact through client navigation to Reverse and Loom. Initial renderer-derived desktop/mobile WebP posters cover first paint and no-JavaScript viewing; edited artwork is never represented by that initial poster.
- Native buttons, grouped yarn controls, labeled sliders, visible selected states and status messages provide keyboard and touch access. The main mobile action is 54px high; the open edit panel keeps the title and upper cloth visible. Reduced motion has no material effect to disable.

## Pattern Room verification

- `npm run typecheck`: passed under strict TypeScript.
- `node --import tsx --test tests/pattern-room.test.ts tests/pattern-renderer.test.ts`: passed. Six focused checks cover all-pick crossing reconstruction and reverse relation, real recoloring, graphic-only edits/undo/serialization, old-file validation, renderer cache invalidation, anchored recolor and warp-only rendering.
- Local Chromium 1440×900: Cutwork/Ribbon changes, 2×2 repeat, global 2/2 twill, weft recolor, previous/current split and Save worked. Downloaded JSON had 28 twill picks; the exact JSON remained the same after navigating through Reverse to Loom and saving there. No horizontal overflow or page errors.
- Local Chromium 390×844 touch/reduced-motion: mobile canvas, structure and yarn panels, sateen reweave, warp recolor, 3×3 repeat, keyboard scale and Save worked. Downloaded JSON matched those choices; no horizontal overflow or page errors. The initial view and both edit panels were visually inspected against the supplied artboards.
- No production build, Lighthouse, deployment or comprehensive QA ran in this stage. Earlier Reverse code and material checks were committed separately; this stage does not claim a full release audit for that route.

## Remaining work and exact next steps

1. Complete Entrance's full lift interaction and replace its provisional concept textile when the final material presentation is approved.
2. In a later authorized release stage, run a production build, verify native Canvas/font packaging and export errors in the intended host, then perform broader accessibility, intermediate-width, low-end device and performance checks.
3. Recheck museum records, attribution caveats and image permissions before release. Recover or replace the provisional Entrance image's provenance.

This stage stops with the sitewide creative improvements complete, focused checks passed and a local commit. No deployment or push is authorized in this stage.

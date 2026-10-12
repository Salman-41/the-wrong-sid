# Build status

**State: Pattern Room complete locally.** Updated 2026-10-12 (Asia/Karachi). Entrance, Loom, Reverse and Pattern Room have working routes; Collection and Edition remain in preparation. No push, deployment or service purchase occurred.

## Pattern Room delivered

- Inspected both approved Pattern Room SVGs and previews, project rules, art direction and textile engine. The route now uses live HTML/CSS controls and an original Canvas artwork. Desktop keeps the full-bleed cobalt/vermilion/ochre study, oversized Didot title and one paper tray. Mobile has its own tall cutting, 58px header, on-screen Save action and touch controls that open over the lower image.
- The version 2 artwork file now stores a validated graphic arrangement: Cutwork, Ribbon or Bias; a 1–4 by 1–4 finite repeat; and 0.75–1.75 scale. Older version 2 files load with default placement. No new service or automatic storage is involved.
- **Construction edits:** Reweave applies a supported plain, 2/2 twill, five-end satin or sateen rule to every existing pick and to the next-pick matrix. Recolor changes matching real warp or weft yarns, including a matching draft weft. **Graphic edits:** composition, repeat and scale only arrange finite cloth cuttings; the crossings and yarn records stay unchanged. UI copy, history and tests distinguish the two.
- Canvas textures come from stable 8-end × 4-pick windows of the visitor's actual cloth, rendered through the shared rounded-yarn renderer. Recoloring follows the same physical windows. Original desktop/mobile Cutwork, Ribbon and Bias masks arrange those textured pieces. They are art-directed cuts with lighting and edge depth, not a claim of seamless physical weaving at graphic repeat seams.
- Worker/main-thread rendering coalesces changes and drops stale frames. A bounded cache keeps two material versions for comparison and a few composition tiles; repeat/scale reuse existing yarn textures. DPR is capped at 1.75 and final surfaces at three million pixels. No continuous animation or WebGL.
- Previous/current uses the exact snapshot before the last edit, with an adjustable visual split. Undo/redo use the root project history. Save downloads the same artwork JSON that Loom can restore. The cloth and arrangement stay intact through client navigation to Reverse and Loom. Initial renderer-derived desktop/mobile WebP posters cover first paint and no-JavaScript viewing; edited artwork is never represented by that initial poster.
- Native buttons, grouped yarn controls, labeled sliders, visible selected states and status messages provide keyboard and touch access. The main mobile action is 54px high; the open edit panel keeps the title and upper cloth visible. Reduced motion has no material effect to disable.

## Focused verification

- `npm run typecheck`: passed under strict TypeScript.
- `node --import tsx --test tests/pattern-room.test.ts tests/pattern-renderer.test.ts`: passed. Six focused checks cover all-pick crossing reconstruction and reverse relation, real recoloring, graphic-only edits/undo/serialization, old-file validation, renderer cache invalidation, anchored recolor and warp-only rendering.
- Local Chromium 1440×900: Cutwork/Ribbon changes, 2×2 repeat, global 2/2 twill, weft recolor, previous/current split and Save worked. Downloaded JSON had 28 twill picks; the exact JSON remained the same after navigating through Reverse to Loom and saving there. No horizontal overflow or page errors.
- Local Chromium 390×844 touch/reduced-motion: mobile canvas, structure and yarn panels, sateen reweave, warp recolor, 3×3 repeat, keyboard scale and Save worked. Downloaded JSON matched those choices; no horizontal overflow or page errors. The initial view and both edit panels were visually inspected against the supplied artboards.
- No production build, Lighthouse, deployment or comprehensive QA ran in this stage. Earlier Reverse code and material checks were committed separately; this stage does not claim a full release audit for that route.

## Remaining work and exact next steps

1. Build Collection around the actual public-domain Met object image and retained source metadata; keep the studio weave distinct from museum photography.
2. Build Edition's separate print composition and real export contract (face, paper/format, output dimensions and selected arrangement) from the same visitor artwork.
3. Complete Entrance's full lift interaction and replace its provisional concept textile when the final material presentation is approved.
4. In a later authorized release stage, run a production build and broader accessibility, intermediate-width, low-end device and performance checks. Review image provenance/rights and factual copy before public release.

Run `npm ci`, then `npm run dev`; open `/pattern-room`. The project state persists during client navigation. Save a JSON file before refreshing or closing; Loom's Open cloth action restores it. This stage stops after the local commit.

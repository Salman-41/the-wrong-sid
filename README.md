# THE WRONG SIDE — interactive textile exhibition

Production application foundation and the approved Entrance, with a shared Canvas 2D textile study. The completed Entrance lives at `/`; `/loom` and `/reverse` carry the validated material prototype. Pattern Room, Collection and Edition have preparation boundaries for their later implementation.

## Run

Requires Node.js 20.9+ and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. **Lift the Edge** opens the reverse-view material study. In `/loom` or `/reverse`, choose plain, 2/2 twill, five-end satin or sateen; change warp/weft colors, bands and thickness; magnify and compare both faces. **Keep this cloth** downloads a versioned JSON artwork. **Open saved artwork** restores individual threads and the structure. **Download image** exports a 2000 × 2000 PNG of the selected face at the selected magnification.

```sh
npm test
npm run typecheck
npm run build
npm start
```

`node --import tsx scripts/render-studies.ts` produces inspection PNGs in ignored `artifacts/` using a native Canvas 2D adapter and the exact same renderer as the prototype. The adapter is a development dependency and is not shipped to the browser.

## Model and rendering

- `src/lib/weave.ts`: each artwork stores finite warp/weft arrays of `{ color, thickness }`, a repeat matrix, structure, seed, name and schema version. Thickness is a fraction of thread pitch, not a physical yarn count. Rows are picks, columns are ends; `true` means warp above weft on the front.
- Plain: `(end + pick) mod 2 = 0`. Defined 2/2 twill: `(end − pick) mod 4 < 2`, advancing one end per pick.
- Five-end satin: one warp-under binding at `end = 2 × pick mod 5`, with four-pick warp floats. Sateen is its complement. The step is coprime to five and is neither one nor four; bindings visit every row and column once. See [INFLIBNET, Basic Weaves](https://ebooks.inflibnet.ac.in/hsp08/chapter/basic-weaves/) for construction principles.
- Reverse means turning around the vertical axis: view end `x` corresponds to original end `warp.length − 1 − x`, with crossing order inverted. Colors, thicknesses and the artwork seed stay attached to the original yarns. The renderer mirrors the physical geometry and complements crossings; no second artwork is generated.
- `src/lib/renderer.ts`: continuous recessed yarn beds, contiguous raised floats, smooth shoulders, transverse cylinder shading, contact/cast shadows, seeded axial fiber detail and sparse loose fibers. The renderer culls invisible yarn runs and batches fiber strokes.
- `src/lib/cloth.worker.ts`: Canvas 2D runs in a worker when OffscreenCanvas is available, coalesces pending requests, and transfers image bitmaps to the visible canvas. A main-thread Canvas fallback remains. Work runs only on state/size changes; backing resolution is capped at DPR 2 and four million pixels per surface. Both comparison surfaces show the same physical center.

Light, yarn width, crimp and fiber irregularity are visual approximations. This is a correct interlacement model, not a mechanical simulation of tension, drape, density, compression, or friction. Museum/concept imagery is not used in the engine.

## Checks and limits

This stage passed strict TypeScript and brief desktop/mobile Chromium smoke checks, including menu/keyboard dismissal, lift navigation, shared artwork state, reduced motion and a no-JavaScript static fallback. No production build, unit-test rerun, Lighthouse or comprehensive QA was performed for this stage. The prior prototype passed ten focused mathematical/raster tests; those tests remain available through `npm test`.

The approved hero is a provisional 425×845 concept raster extracted from the Entrance SVG and optimized to a 120 KB WebP. The full physical lift interaction and final material replacement remain future work. Each completed experience must use its own approved composition.

Design colors are generated with `node scripts/sync-design-tokens.mjs`. Tailwind 4 is integrated through PostCSS; authored CSS controls the Entrance composition. Shared artwork/settings survive client navigation via `TextileProjectProvider`. GSAP is dynamically loaded for the optional lift-link directional hint and skipped under reduced motion. Header navigation uses native `details` so it also works without JavaScript.

GFS Didot, Arimo and Cousine are self-hosted as compact Latin WOFF2 fonts with their SIL OFL notices in `public/fonts/`. [BUILD_STATUS.md](docs/BUILD_STATUS.md) records the current stage and remaining work.

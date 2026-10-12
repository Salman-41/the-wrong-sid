# THE WRONG SIDE — interactive textile exhibition

Entrance (`/`), Loom (`/loom`), Reverse (`/reverse`) and Pattern Room (`/pattern-room`) are working routes built with Next.js 16, React 19, strict TypeScript, Tailwind CSS 4, authored CSS, GSAP and Canvas/SVG. Collection and Edition remain in preparation.

## Run

Requires Node.js 20.9+ and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000/loom. Choose a weft yarn and structure, then **Add a woven row**. Each row keeps its yarn and crossing rule. Warp accents, undo/redo, reset, progress and magnification all use the real project. Mobile provides touch controls and a prominent row action. Focus the workspace and press Enter/Space to weave; Ctrl/Cmd+Z undoes, Shift+Z redoes. Reduced motion inserts immediately.

Reverse lifts and turns the same construction to reveal its mathematically related back. Pattern Room reweaves existing rows, recolors actual yarn groups, and places finite cuts of that cloth in Cutwork, Ribbon or Bias compositions with graphic repeat/scale. Compare shows the previous artwork snapshot. **Save this pattern** downloads the construction and arrangement as validated version 2 JSON; Loom's **Open cloth** restores it. Version 1 and older version 2 files migrate. Artwork survives client navigation; save a file before refreshing or closing.

```sh
npm test
npm run typecheck
```

The Pattern Room stage passed focused mathematical, renderer and desktop/mobile interaction checks plus strict TypeScript. No production build, Lighthouse, deployment or comprehensive QA ran in this stage. See the status document for the exact checks.

## Model and rendering

- `src/lib/weave.ts`: versioned individual warp/weft yarns, color/thickness, per-pick crossing rules, next yarn/structure, capacity, deterministic seed and graphic arrangement. `true` means warp above weft on the front. Thickness is a visual fraction of spacing, not a physical yarn count.
- Plain: `(end + pick) mod 2 = 0`; 2/2 twill: `(end − pick) mod 4 < 2`. Five-end satin: one warp-under binding at `end = 2 × pick mod 5`, four-pick warp floats. Sateen is its complement. [Basic Weaves](https://ebooks.inflibnet.ac.in/hsp08/chapter/basic-weaves/) provides the structure principles.
- `src/lib/construction.ts`: initial 48-end/28-row study, append-only picks up to 60 rows, reset and bounded immutable history. Each inserted pick retains its chosen structure and absolute pick phase.
- Reverse turns the same geometry around the vertical axis: mirror the ends and invert every crossing. Yarn colors, thicknesses and seeds remain attached to the original threads. First inserted rows sit nearest the bottom beam.
- `src/lib/renderer.ts`: recessed yarn beds, contiguous raised floats, rounded shoulders, directional highlights, overlap/contact shadows and axial fiber detail. `cloth.worker.ts` coalesces Canvas work; `use-cloth-canvas.ts` shares lifecycle/fallback handling. Draw only for actual material/size/view changes; cap backing resolution at DPR 2 / four million pixels. No WebGL or idle animation loop.
- `src/components/loom.tsx`: semantic making controls and file/history actions. GSAP is loaded only for purposeful row insertion. Original wood/frame/shuttle artwork is authored in CSS/SVG, with the bobbin reflecting the actual next weft.
- `src/lib/pattern-settings.ts` changes actual yarns and all existing crossing rules separately from finite graphic arrangement. `pattern-renderer.ts` builds cutwork surfaces from the same cloth renderer, caches yarn textures and tiles, and paints mobile/desktop compositions without an idle loop. Graphic seams do not assert a continuous weave.

Light, crimp, tension, yarn shape and motion are art-directed approximations. This models interlacement; it does not simulate fabric mechanics. All live cloth is original procedural artwork, with no museum/concept image inside the engine.

## Assets and remaining work

GFS Didot, Arimo and Cousine are self-hosted Latin WOFF2 fonts with SIL OFL notices. `node scripts/sync-design-tokens.mjs` synchronizes approved colors. `node --import tsx scripts/prepare-textile-fallbacks.ts` and `node --import tsx scripts/prepare-pattern-fallbacks.ts` generate initial/static cloth posters with the same model and renderer. The native Canvas adapter is a development dependency.

The Entrance concept WebP remains provisional; physical lifting and the final material replacement are future work. See [BUILD_STATUS.md](docs/BUILD_STATUS.md) for completed work, verification and exact next steps, and [ASSET_REGISTER.md](docs/ASSET_REGISTER.md) for rights/source records.

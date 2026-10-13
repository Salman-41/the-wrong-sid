# THE WRONG SIDE — Home expansion design v1

The existing entrance stays the primary first-screen experience. The design adds exactly two substantive editorial moments beneath it, and a restrained navigation/footer.

**Editable artboards**: `making-desktop.svg`, `making-mobile.svg`, `collection-desktop.svg`, `collection-mobile.svg`, plus two editable footers. `homepage-complete-*.svg` shows the full-page visual sequence. The **existing Entrance appears there as a raster preview only**; it is already implemented in the app and should not be rebuilt from this mockup. All new section geometry, typography, threads, controls, lines and graphics are editable native SVG.

The collection textile visual is **an original editorial stand-in**, not a historical artifact. The production site MUST use a rights-verified museum object image and its exact caption from `src/lib/collection-data.ts` and `docs/ASSET_REGISTER.md`. Never use this design's illustrative study with museum object attribution.

The making interlude features original SVG yarn geometry; a shipping version should use an optimized fallback from the site's existing cloth renderer or a reusable original artistic scene. Do not mount a second always-running Loom renderer merely for the homepage.

**Mobile is independently composed**, not a scaled image of desktop. Dedicated SVGs are 390px wide; desktop is 1440px wide. The completed page is 1440×2798 desktop, 390×2599 mobile. Composition heights are design targets, not rigid page-height requirements.

`lift-interaction-storyboard.svg` is an explanatory interaction study, not a live interface. It illustrates conceptually: untouched cloth → lifted edge → structure view. Do not pass off the provisional hero photograph as structurally identical to the generated physical textile. Ideally stage a renderer-derived cloth surface or a clearly authored illustrative transition to the procedural model. Touch, keyboard, and reduced-motion controls must remain usable.

**Prohibited**: Decorative chapter numbering, fake technical labels, card grids, extra feature blurbs, scrolljacking, invented museum captions, mandatory dragging, AI image generation, duplicate nav, giant unoptimized image payloads, changing all six workrooms.

Recommended build order: ship responsive semantic section layout → use existing assets and verified museum image → connect CTAs → author on-page lift behavior → run focused smoke checks. Full QA comes afterward.

Import individual SVGs into Figma/Inkscape; GFS Didot, Arimo and Cousine are referenced by family name but no font binaries are included. Ensure appropriate fonts are locally installed when editing.

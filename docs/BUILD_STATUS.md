# Build status

**State: production application foundation and Entrance implemented.** Updated 2026-10-12 (Asia/Karachi). This stage is committed locally. No push or deployment.

## Delivered this stage
- Read the approved SVG pack, tokens/notes, project rules, art direction, validated textile prototype and previous build status. Entrance is rebuilt with semantic HTML, authored CSS and React; the SVG artboard is not used as a webpage image.
- Next.js 16.4 App Router, React 19.3, strict TypeScript, Tailwind CSS 4.3/PostCSS and GSAP 3.15. GSAP loads only for the small directional hint after interaction; no entrance autoplay or scene animation.
- Routes: `/` completed Entrance; `/loom` existing material study; `/reverse` the same study opening on its reverse face. `/pattern-room`, `/collection`, `/edition` are explicit preparation boundaries, not completed exhibition screens. A custom not-found page is included.
- Shared application header, accessible primary navigation and native disclosure menu. The menu works without JavaScript; enhanced Escape/outside-click/focus behavior and active-route indication work when hydrated. Links avoid prefetching the unvisited Canvas experiences into the Entrance.
- One `TextileProjectProvider` preserves artwork, zoom and color-rhythm settings across client navigation. Weave model/renderer mathematics remain unchanged.
- Approved colors generate `src/styles/tokens.css` from `Design/DESIGN-TOKENS.json`. The helper is `node scripts/sync-design-tokens.mjs`. Prototype styles are scoped to prevent exhibition style collisions.
- GFS Didot, Arimo and Cousine Latin WOFF2 files are hosted locally via `next/font/local`, with matching SIL OFL notices. Display/UI fonts preload; the caption font does not. Files total 49,900 bytes.
- Entrance faithfully follows the paper/textile split, tall individually composed title lines, curved fabric boundary, drawn thread cue, annotations, front/reverse rail and lift controls. Mobile has its own full-bleed image crop, light typography, positions and bottom action.
- Extracted the approved embedded concept raster into `public/images/entrance-textile.webp` (425×845, 119,926 bytes). Next Image provides explicit responsive sizes, preload and configured quality. It remains provisional concept imagery; its source resolution limits final hero fidelity.
- “Lift the Edge” and “Lift here” are real links to `/reverse`, where the visitor can inspect the shared woven model. Physical fabric lifting remains a later stage.
- Page titles/descriptions, social metadata and an original vector app icon. No invented production domain/canonical URL.
- Reduced-motion hint suppression, static hero/navigation, and rendered front/reverse model posters for the material study when Canvas/JavaScript is unavailable. Static mode explains its limits and hides inactive controls.

## Verification — limited as requested
- `npm run typecheck`: passed (strict TypeScript).
- Brief Chromium smoke at **1440×900 desktop** and **390×844 mobile**: Entrance HTTP 200, correct title/font/image, no horizontal overflow, native menu open/Escape close, meaningful lift navigation and reverse Canvas rendering. No browser page errors.
- Shared-state smoke: changed warp to Lilac, navigated Reverse → Loom → Reverse; the artwork color stayed `#baa7cf`.
- Mobile reduced motion leaves the lift arrow static. With JavaScript disabled, the menu and lift link work and `/reverse` shows its static model poster with inactive controls hidden.
- Desktop/mobile screenshots inspected against the SVG previews; title and copy placement refined. Screenshots are local ignored artifacts, not production assets.
- Only TypeScript and these brief smoke checks ran for this stage. No production build, mathematical-test rerun, Lighthouse, comprehensive QA or deployment. The previous engine stage's 10 mathematical/raster tests and build are historical verification, not claims about a new build.

## Next steps after this stage
1. Review the Entrance at its two approved sizes and intermediate widths; replace the provisional hero only when the finished material system is ready.
2. Develop the physical Lift the Edge interaction with equivalent keyboard/touch controls and a reduced-motion path.
3. Implement the complete Loom and Reverse compositions using the shared project; the current routes carry the material study, not the final page layouts.
4. Implement Pattern Room and Edition against their separate SVG compositions. Obtain the real Met 66.122.20 public-domain image before Collection implementation and retain institutional source facts.
5. Perform broader accessibility/device/performance and production-build verification in a later authorized stage, then inspect branch/remotes before any requested push or deployment.

Run `npm ci` then `npm run dev`; open `http://127.0.0.1:3000`. The pre-existing generated `next-env.d.ts` change is preserved outside this stage's commit.

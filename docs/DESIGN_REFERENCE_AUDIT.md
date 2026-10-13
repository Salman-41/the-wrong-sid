# Design reference audit

## Source pack inspected
Reviewed all 12 editable SVGs, their 12 PNG previews, desktop/mobile contact sheets, `Design/README.md`, and `Design/DESIGN-TOKENS.json`. Artboards are 1440×900 desktop and 390×844 mobile. The SVGs declare themselves static, editable studies rather than functional interfaces. Text/path/vector artwork is editable; the SVGs also use thousands of paths for modeled woven surfaces.

### Page-by-page inventory
| Experience | Desktop composition | Mobile composition | Artwork / placeholders | Required interaction |
|---|---|---|---|---|
| Entrance | Paper editorial panel against oversized textile photo; title, short copy, lift affordance | Full-screen textile cover, overlay type and bottom lift prompt | One embedded raster concept image in each SVG (base64); generated concept, not a historical artifact | Enter/reveal edge; front/reverse cue; nav |
| Loom | Left editorial title/legend, central editable vector loom, right thread and structure controls | Title then vector loom, swatches and add/undo/reset tray | Loom is vector geometry with yarn crossings/shuttle; instructional art, not yarn physics | Choose structure/color; add row; count; undo/reset |
| Reverse | Dark editorial side rail, large fabric image, crossing diagram and face toggle | Textile hero, front/reverse pill, then crossing explanation | One embedded base64 raster concept image in each SVG plus editable schematic; photograph is not verified reverse | Front/reverse toggle; inspect crossing/point; keyboard equivalent |
| Pattern Room | Full-bleed large abstract vector surface with one control strip | Full-bleed pattern with title; controls in lower panel | Entirely vector original surface; not a scan of historical textile | Change repeat, structure, weft colors and scale; apply to fabric |
| Collection | Editorial intro, illustrated textile study, factual Met object record | Object image/study leads, then record and link | No embedded raster: artwork is thousands of vector paths and explicitly labeled original interpretation, not museum photography | Browse object/technique/material/place; open Met record |
| Edition | Print mockup, composition choices, narrow paper/format/finish rail | Large print preview, treatment choices, broad export action | Vector print composition; should become preview of configured artwork | Select composition/paper/format/finish; export/download |

## Type, color, image treatment
Tokens specify GFS Didot display, Arimo UI, Cousine technical and a warm paper/ink palette with vermilion, cobalt, saffron, cotton, moss, lilac. SVG text is editable text, but font availability/substitution is noted in README; no font files/licenses are included. The concept raster images embedded in SVG make each affected SVG about 300 KB (desktop Entrance 300 KB, desktop Reverse 304 KB; mobile similar). Reuse one optimized, documented source asset in implementation rather than duplicating embedded base64. Keep accessible type in HTML, not artwork images.

## Technical challenges inferred from designs
- SVG artboards encode flat comps and very large repeated path counts (Loom desktop ~1,493 paths; Collection desktop ~1,672); rebuilding them as a responsive semantic UI should avoid shipping entire artboards as page backgrounds.
- Define Loom as a deterministic visual weave model: a row/cell state, structure rule, palette, and undo history. Avoid unsubstantiated claims of physical simulation.
- Reverse must pair toggle state, explanatory text and diagram state; current image is one concept image reused for both faces.
- Pattern Room needs repeatable data/transform logic; test repeat seams and density under scaling.
- Edition export requires a declared print/download contract (paper ratio, pixel dimensions, file format, attribution if using source images).
- Distinct content order and control layouts matter on narrow screens; design mobile as its own composition.

## External creative references (study principles only)
- [Twinbru](https://www.awwwards.com/owow/) — Awwwards/OWOW record identifies Twinbru as Site of the Day and Developer Award (14 Sep 2023); Awwwards inspiration includes “Magnify into detail.” Study material-scale inspection and product-realistic texture behavior, not layout or assets.
- [45R Denim Karuta](https://www.awwwards.com/websites/%23FAEDCD/) — Awwwards nominee listing records Site of the Day and Developer Award (30 Mar 2025). Study its use of cultural/material storytelling and interaction pacing; do not borrow its compositions or visual motifs.
- [CMO Paris](https://www.awwwards.com/sites/cmo-paris) — Awwwards Honorable Mention (9 Apr 2024); record emphasizes workshop/thread-building storytelling, animation, scrolling and product/about views. Study the relationship between making and narrative, not its design.

Awards references establish relevant craft examples, not a score forecast. The 6.5+ target can only be assessed after implementation and independent usability/performance review.

## Implemented site review — 2026-10-13

Revisited all twelve SVGs, the token file and both contact sheets alongside actual six-route browser renders at four viewport sizes. Major changes address yarn lighting, distorted material fitting, laptop action placement, tablet composition and wordmark/navigation. The original compositions remain the visual basis; none of the SVG pages is shipped as a screenshot. [CREATIVE_REVIEW.md](CREATIVE_REVIEW.md) contains the findings, reference comparison limits and rendered evidence.

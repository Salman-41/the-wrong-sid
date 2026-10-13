# THE WRONG SIDE — project rules

## Direction

- Build a premium interactive textile exhibition and creative studio: experimental textile graphics × contemporary fashion editorial.
- Aim for a coherent, original experience at Awwwards 6.5+ quality; a score is never guaranteed.
- Treat the approved Design pack as the visual source of truth. Build six complete experiences: Entrance, Loom, Reverse, Pattern Room, Collection, Edition.
- No generic AI layouts, SaaS dashboard conventions, numbered filler sections, repeated image/text templates, copied award sites, invented textile histories, fake instrument readouts, or decorative effects without a communicative purpose.

## Truth and rights

- Distinguish real collection objects, original illustrative studies, generated concept imagery, and user-created patterns in the interface and asset metadata.
- Never imply the hero concept image depicts a real historical textile or is a verified reverse face.
- Historical Collection records use verified institution-supplied photographs, starting with The Met 66.122.20. Never label a constructed weave illustration as museum photography.
- Describe weaving accurately; mark diagrams as simplified studies where they omit yarn geometry, tension, density, or loom mechanics.
- Record each source, rights basis, attribution requirement, download date, and local filename in the asset register.

## Interaction and quality

- Interactions must communicate textile looking or making, work with keyboard and touch, and have a non-drag path where applicable.
- Honor reduced motion; no autoplay motion that blocks content. Preserve content and controls when animation is absent.
- Keep editorial text as semantic HTML. Canvas is optional and may only render decorative or computational cloth artwork with an equivalent accessible DOM description and controls.
- Respect the distinct compositions and mobile artboards. Do not scale desktop layouts down as the mobile strategy.
- Before launch, verify image rights, factual copy, keyboard operation, contrast, focus, reduced-motion behavior, mobile usability, and field performance.

## Scope now

- Current authorized stage: implement Edition's three editorial layouts, accurate preview, high-resolution PNG and genuinely supported SVG, project save/reload and return to editing. Use the same visitor artwork as Loom, Reverse and Pattern Room.
- Export the artwork composition alone. Declare embedded raster yarn surfaces honestly when offering hybrid SVG; do not claim fully vector or physically exact fabric output.
- Keep historical objects and museum photographs separate from visitor-created `Artwork` / `TextileProject` state. Preserve exact institutional titles, date strings, source medium wording, accession numbers, rights status, and documented attribution. Use null when the museum does not supply a value.
- Verify reuse rights at the selected image/media level. Record the object source, image download URL, retrieval date, local filename, image dimensions, and attribution guidance. Preserve institutional context and identify any uncertain or reviewed attribution.
- Never fabricate a historical reverse, motif meaning, maker, geography, technique, or date. A local image is the documented source view unless the record explicitly identifies otherwise.
- Run only focused export/artwork checks, TypeScript and brief desktop/mobile interactions. Update `docs/BUILD_STATUS.md`, commit locally and stop. Do not deploy, buy services, push or begin another experience.

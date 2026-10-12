# THE WRONG SIDE — project rules

## Direction

- Build a premium interactive textile exhibition and creative studio: experimental textile graphics × contemporary fashion editorial.
- Aim for a coherent, original experience at Awwwards 6.5+ quality; a score is never guaranteed.
- Treat the approved Design pack as the visual source of truth. Build six complete experiences: Entrance, Loom, Reverse, Pattern Room, Collection, Edition.
- No generic AI layouts, SaaS dashboard conventions, numbered filler sections, repeated image/text templates, copied award sites, invented textile histories, fake instrument readouts, or decorative effects without a communicative purpose.

## Truth and rights

- Distinguish real collection objects, original illustrative studies, generated concept imagery, and user-created patterns in the interface and asset metadata.
- Never imply the hero concept image depicts a real historical textile or is a verified reverse face.
- The Collection record is The Met 66.122.20. Use its own Open Access public-domain image before release; never label the current constructed weave illustration as museum photography.
- Describe weaving accurately; mark diagrams as simplified studies where they omit yarn geometry, tension, density, or loom mechanics.
- Record each source, rights basis, attribution requirement, download date, and local filename in the asset register.

## Interaction and quality

- Interactions must communicate textile looking or making, work with keyboard and touch, and have a non-drag path where applicable.
- Honor reduced motion; no autoplay motion that blocks content. Preserve content and controls when animation is absent.
- Keep editorial text as semantic HTML. Canvas is optional and may only render decorative or computational cloth artwork with an equivalent accessible DOM description and controls.
- Respect the distinct compositions and mobile artboards. Do not scale desktop layouts down as the mobile strategy.
- Before launch, verify image rights, factual copy, keyboard operation, contrast, focus, reduced-motion behavior, mobile usability, and field performance.

## Scope now

- Current authorized stage: implement Pattern Room against its approved desktop and mobile compositions, using the Loom and Reverse artwork as one shared source.
- Reweaving must change each actual woven pick’s crossing rule. Recoloring must change real warp or weft yarns. Composition, repeat and scale are graphic arrangements of finite woven material and must leave the crossing data unchanged.
- Previous/current comparison uses an actual history snapshot; undo restores the prior artwork. Save and restore preserve both construction and arrangement in the visitor file.
- The full-bleed graphic must be cut from renderer-derived yarn surfaces. Keep the mobile composition and control placement independently authored, with native keyboard and touch controls, reduced motion and a static explanation.
- Verification is limited to focused state/rendering/interaction checks and strict TypeScript. Do not run Lighthouse, comprehensive QA, a production build or deployment. Do not buy services or push during this stage.
- Keep decisions and open dependencies current in `docs/BUILD_STATUS.md`.

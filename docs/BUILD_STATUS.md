# Build status

**State: research and planning complete; website not started.** Updated 2026-10-11 (Asia/Karachi). No deploy, service purchase, or push performed.

## Completed
- Inspected all 12 SVG artboards, PNG previews, desktop/mobile contact sheets, design notes and token file.
- Audited the six distinct experiences and their responsive compositions, vector/raster content, interactions and risks in `DESIGN_REFERENCE_AUDIT.md`.
- Verified Awwwards reference records for Twinbru, 45R Denim Karuta and CMO Paris; documented learning boundaries.
- Checked current official framework guidance: Next.js 16 / React 19.2 compatibility; no blocker for proposed Next/React/GSAP/SVG architecture. Canvas is optional and limited by accessibility needs.
- Verified plain weave terminology and The Met object facts/public-domain availability; recorded provenance steps and rights gaps.
- Wrote project rules, art direction, design audit, technical architecture, asset register and this status document.

## Exact next steps
1. **Review and accept these plans**; resolve whether the current generated Entrance/Reverse concept image has a retrievable source file and usable rights record.
2. **Acquire the Collection image** from The Met record/API for object 66.122.20. Save its source URL, retrieval date, dimensions, object metadata and rights evidence in the asset register; replace the illustrated study in final design comps only if that source image is confirmed.
3. **Finalize type and tokens:** download the selected Google Fonts files, preserve their license notices, inspect GFS Didot fallback/legibility on mobile, and record final typography choices in `DESIGN-TOKENS.json`.
4. **Turn six experiences into behavior specs**: define weave lift plans (plain, a named twill repeat, satin/sateen), undo/reset behavior, accessible face toggle, repeat transformations, object navigation, and export dimensions/formats. Confirm diagrams and copy match those states.
5. **Create the Next.js 16 + React 19.2 + TypeScript project** with Node.js 20.9+, route shell for the six named experiences, semantic content, responsive layout scaffolding and small isolated client components. Keep Canvas out until measurement justifies it; use SVG/HTML first and GSAP only for authored transitions.
6. **Implement each composition against its paired desktop/mobile artboards**, with unique hierarchy/layout per route and the approved visual rules. Build genuine interactions and export output rather than nonfunctional controls.
7. **Verify** keyboard and touch use, WCAG 2.2 AA contrast/focus, reduced motion, mobile layouts, truthful collection attribution, image rights, repeat seams/export correctness and real-device performance. Track LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at 75th percentile as field targets; review proposed transfer budgets in `TECHNICAL_ARCHITECTURE.md`.
8. **Prepare the repository push:** this workspace currently has no `.git` directory (`git status` returned “not a git repository”). Confirm the intended repository root, initialize Git there if appropriate, inspect `git status` and remotes, set `origin` to `https://github.com/Salman-41/the-wrong-side.git`, review staged files and commit, then push the agreed branch. Do not publish credentials; use the existing authenticated GitHub mechanism.

## Open items
- Confirm provenance/rights/source file for the generated concept textile image.
- Download the actual Met Open Access image and capture its exact source metadata.
- Final display/UI font files and their license notices are not yet in the project.
- Finalize detailed control behavior and export contract before implementation.
- Repository is not currently initialized as Git in this workspace, so no push can occur from this checkout yet.

## Research references
- [Awwwards: Twinbru context](https://www.awwwards.com/owow/), [45R Denim Karuta listing](https://www.awwwards.com/websites/%23FAEDCD/), [CMO Paris](https://www.awwwards.com/sites/cmo-paris)
- [Next.js 16](https://nextjs.org/blog/next-16), [The Met object 66.122.20](https://www.metmuseum.org/art/collection/search/45411), [GWU Textile Museum glossary](https://museum.gwu.edu/textile-terms), [WCAG 2.2](https://www.w3.org/TR/wcag/)

# Historical textile collection research

Researched 2026-10-12 from the institutions' own object records, collection APIs, and image-delivery services. This is a separate historical-object catalogue; it does not contain or derive from visitor artwork. Exact titles, date strings, accession numbers, source medium strings, and documented attributions are retained in [`src/lib/collection-data.ts`](../src/lib/collection-data.ts). Normalized material and technique facets are for finding and comparison; the original museum medium remains available alongside them.

## Selection and image policy

The eleven objects were selected for variety in visible construction, surface, scale, and record context: plain weave with ikat; tapestry weave; double cloth; embroidery; darning and cross stitch; and pieced, lined, stuffed, and quilted work. The Met's `Piece of Cloth for Bedding` is the first record, as requested. Each object has a source record, accession number, rights status, image download URL, local optimized file, source dimensions, and attribution note.

The Met API reports `isPublicDomain: true` for all three selections and the records display Public Domain. The museum says its Open Access public-domain images and data may be used commercially or noncommercially without permission or fee. Cleveland's official API returns `share_license_status: CC0` for all four works; its policy says attribution is not required and suggests citation for scholarly or publication use. The Smithsonian records identify both metadata and the selected image media as CC0; its FAQ says attribution is not required but recommends a basic credit and link. These status checks apply to the selected object images, not to other content that may appear on institutional webpages.

All twelve files in `public/images/collection/` are locally stored WebP derivatives of the direct museum downloads. They retain the source composition, are capped at 2,800 pixels on the long edge, and have their pixel dimensions, byte size, and SHA-256 recorded in the asset register and typed image metadata. The high-resolution source URL and source pixel dimensions are retained so the institution's file can be retrieved again. No generated textile image is used as museum imagery. A detail view is included for the Smithsonian Silk Quilt; it documents that object's surface only and is not a reverse-face image.

## The Metropolitan Museum of Art

### Piece of Cloth for Bedding

- **Date and origin:** 19th century; Culture: Japan. No maker is named in the record.
- **Materials and technique:** Cotton; plain-weave cotton with weft kasuri (ikat) patterning.
- **Dimensions and accession:** 36 1/2 x 13 1/4 in. (92.7 x 33.7 cm); 66.122.20.
- **Image rights and credit:** Public Domain; the Met permits unrestricted commercial and noncommercial use without permission or fee. Attribution is not required. Suggested credit: “The Metropolitan Museum of Art, 66.122.20; image Public Domain.”
- **Object record:** [The Met, object 66.122.20](https://www.metmuseum.org/art/collection/search/45411).
- **Download used:** [Met Open Access JPEG](https://images.metmuseum.org/CRDImages/as/original/185524.jpg), 581 x 680 px → [`met-66-122-20-bedding.webp`](../public/images/collection/met-66-122-20-bedding.webp). This source file is relatively small; the local copy is not enlarged.
- **Looking note:** Read the pattern as a sequence of small marks across a plain-weave cotton ground; the record identifies the patterning as weft kasuri (ikat).

### Textile Fragment

- **Date and origin:** 10th century; Geography: Attributed to Yemen. No maker is named.
- **Materials and technique:** Cotton; plain weave, resist-dyed (ikat), and embroidery.
- **Dimensions and accession:** L. 15 1/2 in. (39.4 cm); W. 9 1/2 in. (24.1 cm); 29.179.34.
- **Image rights and credit:** Public Domain; no permission or fee required for reuse. Attribution is not required. Suggested credit: “The Metropolitan Museum of Art, 29.179.34; image Public Domain.”
- **Object record:** [The Met, object 29.179.34](https://www.metmuseum.org/art/collection/search/448319).
- **Download used:** [Met Open Access JPEG](https://images.metmuseum.org/CRDImages/is/original/DP368803.jpg), 2,555 x 3,860 px → [`met-29-179-34-yemen-fragment.webp`](../public/images/collection/met-29-179-34-yemen-fragment.webp).
- **Looking note:** The surviving geometric marks and uneven edge make the fragmentary state part of the close reading. The place is an attribution in the Met record, not a certain origin.

### Woman's Ceremonial Skirt (Tapis)

- **Date and origin:** 18th century or earlier; Geography: Indonesia, Sumatra, Lampung province; Maker: Lampung artist.
- **Materials and technique:** Cotton and silk. The Met's explanatory text describes tapis as having woven bands of warp ikat alternating with silk-floss or gold-thread embroidery; this example is shown opened at its seam. The museum notes that the embroidered motif called *cumi-cumi* is not fully understood.
- **Dimensions and accession:** L. 52 x W. 52 in. (132.1 x 132.1 cm); 1988.104.1.
- **Image rights and credit:** Public Domain; no permission or fee required for reuse. Attribution is not required. Suggested credit: “The Metropolitan Museum of Art, 1988.104.1; image Public Domain.”
- **Object record:** [The Met, object 1988.104.1](https://www.metmuseum.org/art/collection/search/315915).
- **Download used:** [Met Open Access JPEG](https://images.metmuseum.org/CRDImages/ao/original/DP-23873-001.jpg), 3,923 x 4,000 px → [`met-1988-104-1-tapis.webp`](../public/images/collection/met-1988-104-1-tapis.webp).
- **Looking note:** The horizontal woven and embroidered bands are shown flat for study; the Met explains that a tapis is assembled as a long tubular skirt and read on the body in the round.

## Cleveland Museum of Art

### Tapestry Panel

- **Date and origin:** 1000–1460s; CMA culture field: Peru, Central Coast, Chancay-Chimú style, 11th-15th century. No maker is named.
- **Materials and technique:** Camelid fiber and cotton; tapestry weave.
- **Dimensions and accession:** Overall 115 x 54.3 cm (45 1/4 x 21 3/8 in.); mounted 124.5 x 64.8 cm (49 x 25 1/2 in.); 1992.103.
- **Image rights and credit:** CC0; CMA says attribution is not required. Suggested credit: “Cleveland Museum of Art, 1992.103, CC0.”
- **Object record:** [Cleveland Museum of Art, 1992.103](https://www.clevelandart.org/art/1992.103).
- **Download used:** [CMA print JPEG](https://openaccess-cdn.clevelandart.org/1992.103/1992.103_print.jpg), 1,774 x 3,400 px → [`cma-1992-103-tapestry-panel.webp`](../public/images/collection/cma-1992-103-tapestry-panel.webp).
- **Looking note:** The CMA describes the stepped-V motif as a geometricized head that seems to represent two birds; differently colored versions alternate up and down into an interlocking pattern with no proper top or bottom.

### Tapestry

- **Date and origin:** 1368–1644; CMA culture field: China, Ming Period (1368-1644). No maker is named.
- **Materials and technique:** Silk and gold thread; tapestry weave.
- **Dimensions and accession:** Overall 198.1 x 66 cm (78 x 26 in.); 1916.1334.
- **Image rights and credit:** CC0; attribution is not required. Suggested credit: “Cleveland Museum of Art, 1916.1334, CC0.”
- **Object record:** [Cleveland Museum of Art, 1916.1334](https://www.clevelandart.org/art/1916.1334).
- **Download used:** [CMA print JPEG](https://openaccess-cdn.clevelandart.org/1916.1334/1916.1334_print.jpg), 1,165 x 3,400 px → [`cma-1916-1334-tapestry.webp`](../public/images/collection/cma-1916-1334-tapestry.webp).
- **Looking note:** The museum describes a bird among flowering branches, peonies, and cloud forms. The silk-and-gold tapestry holds these motifs in a tall composition.

### Embroidered Textile

- **Date and origin:** 1700s–1800s; CMA culture field: Turkey. No maker is named.
- **Materials and technique:** Wool, silk and metal threads, with a cotton backing; the CMA medium field records silk and metal-thread embroidery.
- **Dimensions and accession:** Average 124.5 x 93 cm (49 x 36 5/8 in.); 1916.1246.
- **Image rights and credit:** CC0; attribution is not required. Suggested credit: “Cleveland Museum of Art, 1916.1246, CC0.”
- **Object record:** [Cleveland Museum of Art, 1916.1246](https://www.clevelandart.org/art/1916.1246).
- **Download used:** [CMA print JPEG](https://openaccess-cdn.clevelandart.org/1916.1246/1916.1246_print.jpg), 3,400 x 2,539 px → [`cma-1916-1246-embroidered-textile.webp`](../public/images/collection/cma-1916-1246-embroidered-textile.webp).
- **Looking note:** Floral sprays repeat in upright columns. The CMA notes that the sequins appear to have been added seemingly at random.

### Coverlet

- **Date and origin:** 19th century; CMA culture field: America. No maker is named.
- **Materials and technique:** Wool and cotton; double cloth.
- **Dimensions and accession:** Average 223.5 x 181.6 cm (88 x 71 1/2 in.); 1922.45.
- **Image rights and credit:** CC0; attribution is not required. Suggested credit: “Cleveland Museum of Art, 1922.45, CC0.”
- **Object record:** [Cleveland Museum of Art, 1922.45](https://www.clevelandart.org/art/1922.45).
- **Download used:** [CMA print JPEG](https://openaccess-cdn.clevelandart.org/1922.45/1922.45_print.jpg), 3,400 x 2,761 px → [`cma-1922-45-coverlet.webp`](../public/images/collection/cma-1922-45-coverlet.webp).
- **Looking note:** The CMA photograph shows dark-blue and pale squares repeating edge to edge inside a striped, block-patterned border; the object record identifies the construction as double cloth.

## Smithsonian collections

### Darning sampler

- **Date and origin:** 1711; Made in: Netherlands. No maker is named in the record.
- **Materials and technique:** Silk and linen embroidery on a linen foundation; running (pattern-darning) and cross stitches on plain weave. The description also records hemstitching and picot edgings.
- **Dimensions and accession:** H x W 80 x 64.1 cm (31 1/2 x 25 1/4 in.); 1937-75-1.
- **Institution and credit line:** Cooper Hewitt, Smithsonian Design Museum; Gift of Mrs. Montgomery Hare.
- **Image rights and credit:** The selected image media and metadata are CC0. Smithsonian says attribution is not required; a basic institution, object, and source credit is helpful. Suggested credit: “Cooper Hewitt, Smithsonian Design Museum, 1937-75-1, CC0.”
- **Object record:** [Cooper Hewitt, object 56597](https://collection.cooperhewitt.org/view/objects/asitem/id/56597).
- **Download used:** [Smithsonian high-resolution JPEG](https://ids.si.edu/ids/download?id=CHSDM-CAB7E961C30E2-000001.jpg), 6,905 x 8,463 px → [`cooper-hewitt-1937-75-1-darning-sampler.webp`](../public/images/collection/cooper-hewitt-1937-75-1-darning-sampler.webp).
- **Looking note:** Fifteen darning crosses and two corner mends gather around a center inscription reading GD 1711.

### Textile

- **Date and origin:** 12th–13th century; Made in: Egypt. No maker is named.
- **Materials and technique:** Linen and silk; cross-stitch embroidery on plain weave.
- **Dimensions and accession:** H x W 11 x 11.5 cm (4 5/16 x 4 1/2 in.); 1951-111-34.
- **Institution and credit line:** Cooper Hewitt, Smithsonian Design Museum; Gift of Frances Morris.
- **Image rights and credit:** Selected media and metadata are CC0. Attribution is not required; a basic credit and source link are helpful. Suggested credit: “Cooper Hewitt, Smithsonian Design Museum, 1951-111-34, CC0.”
- **Object record:** [Cooper Hewitt, object 103491](https://collection.cooperhewitt.org/view/objects/asitem/id/103491).
- **Download used:** [Smithsonian high-resolution JPEG](https://ids.si.edu/ids/download?id=CHSDM-FED70F4EB4222-000001.jpg), 2,827 x 2,914 px → [`cooper-hewitt-1951-111-34-textile.webp`](../public/images/collection/cooper-hewitt-1951-111-34-textile.webp).
- **Looking note:** The record describes a band of angular S-shapes on linen, worked in red and blue cross stitch; the textile measures about eleven centimeters across.

### 1863 Susannah Pullen's Civil War Quilt

- **Date and origin:** 1863; made in Augusta, Maine, United States. The museum names Pullen, Mrs. Gilbert as quilter and says fourteen young women from her Sunday school class contributed inscriptions; their names are not recorded here.
- **Materials and technique:** Cotton fabric, cotton thread, and cotton filling; pieced, lined, and quilted.
- **Dimensions and accession:** 84 x 50 in. (213 x 126 cm); accession 138338; catalog T07726.
- **Institution and credit line:** National Museum of American History, Smithsonian Institution; Gift of Charlotte Pullen Scruton.
- **Image rights and credit:** The selected online media and metadata are CC0. Attribution is not required; a basic credit and link are helpful. Suggested credit: “National Museum of American History, 138338, CC0.”
- **Object record:** [National Museum of American History, record nmah_556322](https://americanhistory.si.edu/collections/object/nmah_556322).
- **Download used:** [Smithsonian high-resolution JPEG](https://ids.si.edu/ids/download?id=NMAH-95-7154.jpg), 1,986 x 3,150 px → [`nmah-138338-pullen-quilt.webp`](../public/images/collection/nmah-138338-pullen-quilt.webp).
- **Looking note:** Fifteen star-patterned blocks carry over 150 inscriptions. The Smithsonian says Pullen also wrote on the quilt's back; the local image is the primary recorded view and is not presented as that reverse.

### Silk Quilt

- **Date and origin:** ca. 1850; the record gives no geography. The museum currently lists Ellen Morton Littlejohn and Margaret Morton Bibb as quilters and notes that an inter-institutional research group is seeking community input to re-attribute the object.
- **Materials and technique:** Silk and cotton fabric; cotton and silk thread; cotton filling; pieced, stuffed, and quilted.
- **Dimensions and accession:** 85 x 82 in. (216 x 209 cm); 1982.0392.
- **Institution and credit line:** National Museum of American History, Smithsonian Institution; Gift of Mrs. Bonita Abernathy.
- **Image rights and credit:** The selected full-object and detail media and metadata are CC0. Attribution is not required; a basic credit and link are helpful. Suggested credit: “National Museum of American History, 1982.0392, CC0.”
- **Object record:** [National Museum of American History, record nmah_556181](https://americanhistory.si.edu/collections/object/nmah_556181).
- **Downloads used:** [Full-object high-resolution JPEG](https://ids.si.edu/ids/download?id=NMAH-JN2026-00545-000001.jpg), 11,778 x 11,507 px → [`nmah-1982-0392-silk-quilt.webp`](../public/images/collection/nmah-1982-0392-silk-quilt.webp); [detail high-resolution JPEG](https://ids.si.edu/ids/download?id=NMAH-JN2026-00548-000001.jpg), 13,914 x 10,009 px → [`nmah-1982-0392-silk-quilt-detail.webp`](../public/images/collection/nmah-1982-0392-silk-quilt-detail.webp).
- **Looking note:** The Smithsonian describes thirty-six pieced silk star blocks among green silk areas, with stuffed and quilted floral or foliage sprays. Preserve the institution's current attribution review when this record is shown.

## Frontend handoff

- Consume `HISTORICAL_TEXTILES` as a museum-only data source. `recordType: "museum-textile"`, source institution, accession, image, and rights must travel with each card or object view.
- Keep these records distinct from the visitor's `Artwork` and `TextileProject` data; do not serialize a historical record as user work or merge visitor colors/patterns into its metadata.
- Treat each image as the documented view in the source record. Do not invent a reverse, missing detail, date, maker, or cultural meaning. For the Pullen quilt, the catalog mentions writing on the back but the bundled image has not been verified as a back view.
- Display credits and the institution's record link near the image. Attribution is not a legal condition for this selected PD/CC0 set, but it preserves provenance and context.
- The 66.122.20 Met source is only 581 x 680 px. It should be displayed at a modest size; do not use interpolation to imply extra textile detail. Other image files support the larger editorial treatments and close study.
- No Collection interface or page layout was implemented in this research stage.

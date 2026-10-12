import {
  HISTORICAL_TEXTILES,
  type HistoricalTextileId,
  type HistoricalTextileRecord,
} from "./collection-data";

/**
 * Present-day reading of the verified museum catalogue. These comparisons
 * describe visible or recorded construction, never a shared historical origin.
 * Institutional titles, dates, attributions and credits remain in collection-data.
 */
export interface CollectionEditorial {
  kicker: string;
  standfirst: string;
  context: string;
  closeLooking: string;
  /** Identifies the photograph's documented view and any relevant limitation. */
  documentedView: string;
  presentation: "modest" | "portrait" | "panorama" | "square";
  ground: "paper" | "plum" | "ochre" | "cobalt";
  relatedWorks: readonly {
    id: HistoricalTextileId;
    reason: string;
  }[];
}

export const COLLECTION_EDITORIAL = {
  "met-66-122-20": {
    kicker: "Marks in the indigo",
    standfirst:
      "Small pale marks cross a dark cotton field. A modest cloth opens a study of how pattern and construction meet.",
    context:
      "The Met dates this Japanese bedding cloth to the 19th century and identifies its construction as plain-weave cotton with weft kasuri (ikat) patterning. No maker is named in the record.",
    closeLooking:
      "Follow the broken marks across the ground, then let the irregular edge interrupt their rhythm. The record's precise technique is a useful companion to what the image can show.",
    documentedView:
      "Museum photograph of the cloth. The available source is 581 × 680 pixels, so this work is presented at a modest scale without an enlarged study view.",
    presentation: "modest",
    ground: "paper",
    relatedWorks: [
      {
        id: "met-29-179-34",
        reason:
          "Another cotton ground with ikat patterning; the Met also records embroidery in this fragment.",
      },
      {
        id: "cma-1922-45",
        reason:
          "Compare two 19th-century textiles made for bedding: weft kasuri on plain weave and a geometric double-cloth coverlet.",
      },
    ],
  },
  "met-29-179-34": {
    kicker: "What survives",
    standfirst:
      "An uneven fragment preserves a patterned cotton ground and the traces of several ways of working it.",
    context:
      "The Met dates this fragment to the 10th century and attributes its geography to Yemen. Its medium brings together plain weave, resist-dyeing (ikat), and embroidery; the geographic attribution remains qualified.",
    closeLooking:
      "Read the geometric marks beside the worn edges. The surviving outline belongs to the evidence, alongside the documented weaving, dyeing, and embroidery.",
    documentedView:
      "Museum photograph of the surviving fragment. No missing area or opposite face has been reconstructed.",
    presentation: "portrait",
    ground: "plum",
    relatedWorks: [
      {
        id: "met-66-122-20",
        reason:
          "Both records identify cotton, plain weave, and ikat; compare the marks and the surviving cloth edges.",
      },
      {
        id: "chndm-1951-111-34",
        reason:
          "Two fragmentary textiles invite close reading of an embroidered ground and its worn boundary.",
      },
    ],
  },
  "met-1988-104-1": {
    kicker: "Bands around the body",
    standfirst:
      "Woven and embroidered bands alternate across a skirt opened for study. The flat view holds the rhythm of a garment worn in the round.",
    context:
      "The Met attributes this tapis to a Lampung artist in Sumatra, Indonesia, and dates it to the 18th century or earlier. Its explanation describes tapis as tubular skirts; this example has been opened at its seam. The museum cautions that the meaning of the embroidered cumi-cumi motif is not fully understood.",
    closeLooking:
      "Move from one horizontal band to the next, comparing the woven pattern with the embroidered panels. Keep the museum's recorded cotton and silk medium alongside its explanation of the garment.",
    documentedView:
      "Museum photograph of the skirt opened at its seam. The image is a documented display view of the garment.",
    presentation: "square",
    ground: "ochre",
    relatedWorks: [
      {
        id: "met-29-179-34",
        reason:
          "Both records bring ikat and embroidery together, making the relationship between patterned ground and added stitching visible.",
      },
      {
        id: "cma-1916-1246",
        reason:
          "Compare the placement of embroidered panels with floral embroidery repeated across a larger cloth.",
      },
    ],
  },
  "cma-1992-103": {
    kicker: "A repeat without a top",
    standfirst:
      "Stepped forms turn up and down through a narrow field. The same motif changes direction and color as it repeats.",
    context:
      "Cleveland dates this panel to 1000–1460s and records Peru's Central Coast, Chancay-Chimú style. It is tapestry-woven in camelid fiber and cotton. The museum describes a geometricized head that seems to represent two birds, arranged in a pattern with no proper top or bottom.",
    closeLooking:
      "Track a stepped-V form into the next color and orientation. The interlocking repeat lets the eye move in either direction along the panel.",
    documentedView:
      "Museum photograph of the tapestry panel. Object and mounted dimensions are recorded separately in the museum metadata.",
    presentation: "portrait",
    ground: "paper",
    relatedWorks: [
      {
        id: "cma-1916-1334",
        reason:
          "Both are tall tapestry-woven compositions; camelid fiber and cotton meet silk and gold thread in this comparison.",
      },
      {
        id: "cma-1922-45",
        reason:
          "Compare an interlocking stepped repeat with the square motifs and dense patterned border of double cloth.",
      },
    ],
  },
  "cma-1916-1334": {
    kicker: "A tall field of silk",
    standfirst:
      "A bird and flowering branches occupy a long silk-and-gold composition, held between ornamental bands.",
    context:
      "Cleveland records this tapestry as Chinese, Ming Period, 1368–1644. The medium is tapestry weave in silk and gold thread. Its image description identifies a bird, flowering branches, peonies, and cloud forms.",
    closeLooking:
      "Read the entire vertical composition before moving into its smaller forms. Compare the open ground around the bird with the dense ornament above and below it.",
    documentedView:
      "Museum photograph of the complete recorded tapestry view, retaining its narrow vertical proportion.",
    presentation: "portrait",
    ground: "plum",
    relatedWorks: [
      {
        id: "cma-1992-103",
        reason:
          "The same recorded technique, tapestry weave, makes a different tall composition in camelid fiber and cotton.",
      },
      {
        id: "cma-1916-1246",
        reason:
          "Compare flowering forms made through tapestry weave with floral sprays made through silk and metal-thread embroidery.",
      },
    ],
  },
  "cma-1916-1246": {
    kicker: "A field of floral sprays",
    standfirst:
      "Embroidery gathers into repeated upright columns, with small reflective details between the flowers.",
    context:
      "Cleveland records this textile as Turkish, 1700s–1800s. Its wool ground carries silk and metal-thread embroidery with a cotton backing. The museum notes that sequins appear to have been added seemingly at random.",
    closeLooking:
      "Follow a column of floral sprays, then look between the repeated motifs. The scattered reflective details introduce a different rhythm from the embroidery.",
    documentedView:
      "Museum photograph of the embroidered textile. The cotton backing is a recorded material, not a separately documented reverse image here.",
    presentation: "panorama",
    ground: "paper",
    relatedWorks: [
      {
        id: "cma-1916-1334",
        reason:
          "Floral motifs and metallic thread connect the surfaces; the recorded techniques distinguish embroidery from tapestry weave.",
      },
      {
        id: "met-1988-104-1",
        reason:
          "Compare an embroidered field with embroidery placed in alternating bands on a Lampung tapis.",
      },
    ],
  },
  "cma-1922-45": {
    kicker: "Squares held in cloth",
    standfirst:
      "Blue and pale motifs repeat across a broad coverlet, framed by stripes and smaller blocks.",
    context:
      "Cleveland dates this American coverlet to the 19th century. Its recorded medium is wool and cotton, double cloth. The image shows repeating squares contained within a dense patterned border.",
    closeLooking:
      "Move from the repeating central squares to the change of rhythm at the border. Double cloth is the museum's construction identification; the bundled photograph documents this single view.",
    documentedView:
      "Museum photograph of the coverlet. This documented image is not used to infer or generate an unseen opposite face.",
    presentation: "panorama",
    ground: "cobalt",
    relatedWorks: [
      {
        id: "met-66-122-20",
        reason:
          "Two 19th-century bedding textiles place pale pattern against a dark ground through different recorded weaving techniques.",
      },
      {
        id: "nmah-138338",
        reason:
          "Compare the repeating coverlet field with a quilt assembled from star-patterned blocks and cloth panels.",
      },
    ],
  },
  "chndm-1937-75-1": {
    kicker: "Repair made visible",
    standfirst:
      "Darning crosses and corner mends gather across linen, turning the record of stitching into the cloth's composition.",
    context:
      "Cooper Hewitt records this sampler as made in the Netherlands in 1711. Silk and linen embroidery covers a plain-weave linen foundation, using running stitch, pattern darning, and cross stitch. Its description also records hemstitching and picot edging.",
    closeLooking:
      "Locate the center inscription GD 1711, then compare the fifteen darning crosses and two corner mends around it. Their placement makes each stitched area part of a larger reading.",
    documentedView:
      "Museum photograph of the sampler. The date and center inscription are preserved as documented in the institutional record.",
    presentation: "square",
    ground: "paper",
    relatedWorks: [
      {
        id: "chndm-1951-111-34",
        reason:
          "Both records identify linen, silk, plain weave, and cross stitch; compare a complete sampler with a small fragment.",
      },
      {
        id: "nmah-138338",
        reason:
          "An inscription is part of each cloth's reading: a sampler's dated center and a quilt's many contributed messages.",
      },
    ],
  },
  "chndm-1951-111-34": {
    kicker: "Eleven centimeters of evidence",
    standfirst:
      "Red and blue stitches cross a small linen fragment. Its worn edges keep the scale of the surviving object close.",
    context:
      "Cooper Hewitt dates this textile to the 12th–13th century and records it as made in Egypt. Linen and silk form cross-stitch embroidery on plain weave. The object measures 11 × 11.5 centimeters.",
    closeLooking:
      "Follow the angular S-shapes across the fragment, then compare their stitched lines with the exposed linen ground and frayed edges.",
    documentedView:
      "Museum photograph of the surviving textile fragment. Its small physical dimensions remain visible in the object facts even when the photograph is enlarged for study.",
    presentation: "portrait",
    ground: "paper",
    relatedWorks: [
      {
        id: "chndm-1937-75-1",
        reason:
          "Cross stitch on plain-weave linen connects these records, with silk also documented in both.",
      },
      {
        id: "met-29-179-34",
        reason:
          "Compare two surviving fragments whose records include embroidery and whose worn edges remain part of the image.",
      },
    ],
  },
  "nmah-138338": {
    kicker: "A cloth carrying messages",
    standfirst:
      "Star-patterned blocks carry more than 150 inscriptions. Piecing, quilting, and writing gather many contributions into one cloth.",
    context:
      "The Smithsonian records this cotton quilt as made in Augusta, Maine, in 1863, naming Pullen, Mrs. Gilbert as quilter. Fourteen young women from her Sunday school class contributed inscriptions. The record also describes a longer message written by Pullen on the back.",
    closeLooking:
      "Read the arrangement of fifteen star-patterned blocks before examining their smaller panels. The museum's account of the inscriptions accompanies the photograph without implying that all writing can be read in this view.",
    documentedView:
      "The primary museum photograph is shown. The catalog describes writing on the back, but this bundled image has not been verified as a reverse view.",
    presentation: "portrait",
    ground: "paper",
    relatedWorks: [
      {
        id: "nmah-1982-0392",
        reason:
          "Both quilts use pieced star blocks and quilting; compare cotton construction with silk, cotton, and stuffed relief.",
      },
      {
        id: "chndm-1937-75-1",
        reason:
          "Text becomes part of both objects' surfaces: many contributed quilt inscriptions and a sampler's dated center.",
      },
    ],
  },
  "nmah-1982-0392": {
    kicker: "Stars and raised foliage",
    standfirst:
      "Thirty-six pieced silk stars meet green areas of stuffed and quilted floral relief. A documented detail brings that surface close.",
    context:
      "The Smithsonian dates the quilt to ca. 1850 and currently names Ellen Morton Littlejohn and Margaret Morton Bibb as quilters. The institution states that an inter-institutional research group is seeking community input to re-attribute the object. No geography is supplied in the verified record.",
    closeLooking:
      "Compare a multicolored pieced star with the floral or foliage stitching in the green areas. The museum's separate detail photograph documents this surface at a closer scale.",
    documentedView:
      "A full-object museum photograph and a separate museum detail photograph are available. The detail is not an opposite-face image. The current maker attribution remains under institutional review.",
    presentation: "square",
    ground: "plum",
    relatedWorks: [
      {
        id: "nmah-138338",
        reason:
          "Compare two quilts assembled from star-patterned blocks, with different materials and documented contexts.",
      },
      {
        id: "cma-1916-1246",
        reason:
          "Floral surface work connects these images: stuffed and quilted foliage beside silk and metal-thread embroidery.",
      },
    ],
  },
} as const satisfies Readonly<Record<HistoricalTextileId, CollectionEditorial>>;

export interface CollectionBrowseGroup {
  id: string;
  label: string;
  kind: "technique" | "material" | "place";
  description: string;
  objectIds: readonly HistoricalTextileId[];
}

/**
 * Authored membership follows the normalized facts in collection-data. A group
 * is a way to compare recorded evidence, not a claim of influence or lineage.
 */
const BROWSE_GROUPS = [
  {
    id: "ikat",
    label: "Ikat",
    kind: "technique",
    description: "Objects whose records identify kasuri or ikat patterning.",
    objectIds: ["met-66-122-20", "met-29-179-34", "met-1988-104-1"],
  },
  {
    id: "tapestry",
    label: "Tapestry weave",
    kind: "technique",
    description: "Two tapestry-woven compositions in different recorded fibers.",
    objectIds: ["cma-1992-103", "cma-1916-1334"],
  },
  {
    id: "double-cloth",
    label: "Double cloth",
    kind: "technique",
    description: "The coverlet's museum record identifies double cloth.",
    objectIds: ["cma-1922-45"],
  },
  {
    id: "embroidery",
    label: "Embroidery & darning",
    kind: "technique",
    description: "Recorded embroidery, cross stitch, and pattern darning.",
    objectIds: [
      "met-29-179-34",
      "met-1988-104-1",
      "cma-1916-1246",
      "chndm-1937-75-1",
      "chndm-1951-111-34",
    ],
  },
  {
    id: "quilting",
    label: "Piecing & quilting",
    kind: "technique",
    description: "Two quilts with documented piecing and quilting techniques.",
    objectIds: ["nmah-138338", "nmah-1982-0392"],
  },
  {
    id: "cotton",
    label: "Cotton",
    kind: "material",
    description: "Cotton recorded as cloth, yarn, backing, thread, or filling.",
    objectIds: [
      "met-66-122-20",
      "met-29-179-34",
      "met-1988-104-1",
      "cma-1992-103",
      "cma-1916-1246",
      "cma-1922-45",
      "nmah-138338",
      "nmah-1982-0392",
    ],
  },
  {
    id: "silk",
    label: "Silk",
    kind: "material",
    description: "Silk recorded in weaving, embroidery, fabric, or thread.",
    objectIds: [
      "met-1988-104-1",
      "cma-1916-1334",
      "cma-1916-1246",
      "chndm-1937-75-1",
      "chndm-1951-111-34",
      "nmah-1982-0392",
    ],
  },
  {
    id: "linen",
    label: "Linen",
    kind: "material",
    description: "Two embroidered objects with recorded linen foundations.",
    objectIds: ["chndm-1937-75-1", "chndm-1951-111-34"],
  },
  {
    id: "wool",
    label: "Wool",
    kind: "material",
    description: "Wool recorded in an embroidered cloth and a double-cloth coverlet.",
    objectIds: ["cma-1916-1246", "cma-1922-45"],
  },
  {
    id: "camelid-fiber",
    label: "Camelid fiber",
    kind: "material",
    description: "The tapestry panel's documented fiber, alongside cotton.",
    objectIds: ["cma-1992-103"],
  },
  {
    id: "metal-thread",
    label: "Metal thread",
    kind: "material",
    description: "Gold thread in tapestry weave and metal-thread embroidery.",
    objectIds: ["cma-1916-1334", "cma-1916-1246"],
  },
  {
    id: "japan",
    label: "Japan",
    kind: "place",
    description: "The culture documented by The Met for the bedding cloth.",
    objectIds: ["met-66-122-20"],
  },
  {
    id: "yemen-attributed",
    label: "Yemen · attributed",
    kind: "place",
    description: "The Met's qualified geographic attribution is preserved.",
    objectIds: ["met-29-179-34"],
  },
  {
    id: "lampung",
    label: "Lampung, Sumatra",
    kind: "place",
    description: "The tapis's documented geography in Indonesia.",
    objectIds: ["met-1988-104-1"],
  },
  {
    id: "peru-central-coast",
    label: "Peru, Central Coast",
    kind: "place",
    description: "Cleveland's culture field for the Chancay-Chimú-style panel.",
    objectIds: ["cma-1992-103"],
  },
  {
    id: "china",
    label: "China",
    kind: "place",
    description: "Cleveland's documented culture for the Ming-period tapestry.",
    objectIds: ["cma-1916-1334"],
  },
  {
    id: "turkey",
    label: "Turkey",
    kind: "place",
    description: "The culture field recorded for the embroidered textile.",
    objectIds: ["cma-1916-1246"],
  },
  {
    id: "america",
    label: "America",
    kind: "place",
    description: "Cleveland's exact culture label for the coverlet.",
    objectIds: ["cma-1922-45"],
  },
  {
    id: "netherlands",
    label: "Netherlands",
    kind: "place",
    description: "The recorded place of making for the darning sampler.",
    objectIds: ["chndm-1937-75-1"],
  },
  {
    id: "egypt",
    label: "Egypt",
    kind: "place",
    description: "The recorded place of making for the cross-stitched fragment.",
    objectIds: ["chndm-1951-111-34"],
  },
  {
    id: "augusta-maine",
    label: "Augusta, Maine",
    kind: "place",
    description: "The Smithsonian's documented place of making in the United States.",
    objectIds: ["nmah-138338"],
  },
] as const satisfies readonly CollectionBrowseGroup[];

export const COLLECTION_BROWSE_GROUPS = {
  techniques: BROWSE_GROUPS.filter((group) => group.kind === "technique"),
  materials: BROWSE_GROUPS.filter((group) => group.kind === "material"),
  places: BROWSE_GROUPS.filter((group) => group.kind === "place"),
} as const;

export type CollectionBrowseGroupId = (typeof BROWSE_GROUPS)[number]["id"];

export function getCollectionEditorial(id: HistoricalTextileId): CollectionEditorial {
  return COLLECTION_EDITORIAL[id];
}

export function getCollectionBrowseGroup(
  id: string,
): CollectionBrowseGroup | undefined {
  return BROWSE_GROUPS.find((group) => group.id === id);
}

export function getCollectionGroupObjects(
  id: CollectionBrowseGroupId,
): readonly HistoricalTextileRecord[] {
  const group = getCollectionBrowseGroup(id);
  return HISTORICAL_TEXTILES.filter((object) => group?.objectIds.includes(object.id));
}

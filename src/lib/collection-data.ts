/**
 * Institutionally catalogued historical textiles for Collection.
 * This model is intentionally separate from Artwork in ./weave and from
 * visitor-saved textile projects. Image files are optimized derivatives of
 * the institution-hosted files recorded on each image entry.
 */

export type MuseumRightsStatus = "Public Domain" | "CC0";

export interface CuratedCollectionImage {
  role: "primary" | "detail";
  src: `/images/collection/${string}.webp`;
  alt: string;
  sourceDownloadUrl: string;
  sourceDimensionsPx: readonly [width: number, height: number];
  localDimensionsPx: readonly [width: number, height: number];
  localBytes: number;
  localSha256: string;
}

export interface HistoricalTextileRecord {
  /** Stable project key. This is not an artwork or a visitor project ID. */
  id: string;
  recordType: "museum-textile";
  title: string;
  date: string;
  /** Exact source field label and value; null means the record does not state it. */
  documentedOrigin: {
    field: "Culture" | "Geography" | "Made in";
    value: string;
  } | null;
  /** Exact source attribution when supplied; null means none is recorded. */
  maker: string | null;
  makerAttributionNote?: string;
  /** Verbatim museum medium string, followed by normalized search facets. */
  medium: string;
  materials: readonly string[];
  techniques: readonly string[];
  dimensions: string | null;
  accessionNumber: string;
  creditLine: string | null;
  institution: string;
  objectUrl: string;
  recordSourceUrl: string;
  rights: {
    status: MuseumRightsStatus;
    checkedAt: "2026-10-12";
    attributionRequired: false;
    attributionRequirement: string;
    suggestedCredit: string;
  };
  /** Present-day looking prompt grounded in the object record or its image. */
  lookingNote: string;
  images: readonly CuratedCollectionImage[];
}

export const COLLECTION_RETRIEVED_AT = "2026-10-12" as const;

export const HISTORICAL_TEXTILES = [
  {
    id: "met-66-122-20",
    recordType: "museum-textile",
    title: "Piece of Cloth for Bedding",
    date: "19th century",
    documentedOrigin: { field: "Culture", value: "Japan" },
    maker: null,
    medium: "Plain-weave cotton with weft kasuri (ikat ) patterning",
    materials: ["cotton"],
    techniques: ["plain weave", "weft kasuri (ikat) patterning"],
    dimensions: "36 1/2 x 13 1/4 in. (92.7 x 33.7 cm)",
    accessionNumber: "66.122.20",
    creditLine: "Seymour Fund, 1966",
    institution: "The Metropolitan Museum of Art",
    objectUrl: "https://www.metmuseum.org/art/collection/search/45411",
    recordSourceUrl:
      "https://collectionapi.metmuseum.org/public/collection/v1/objects/45411",
    rights: {
      status: "Public Domain",
      checkedAt: COLLECTION_RETRIEVED_AT,
      attributionRequired: false,
      attributionRequirement:
        "The Met marks the image Public Domain and permits unrestricted use without permission or fee. Attribution is not required; the museum and object credit below is recommended.",
      suggestedCredit:
        "The Metropolitan Museum of Art, 66.122.20; image Public Domain",
    },
    lookingNote:
      "Look across the small, broken marks in the indigo field: the record identifies the ground as plain-weave cotton and the patterning as weft kasuri (ikat).",
    images: [
      {
        role: "primary",
        src: "/images/collection/met-66-122-20-bedding.webp",
        alt: "A narrow dark textile with pale kasuri marks and an irregular edge.",
        sourceDownloadUrl:
          "https://images.metmuseum.org/CRDImages/as/original/185524.jpg",
        sourceDimensionsPx: [581, 680],
        localDimensionsPx: [581, 680],
        localBytes: 98636,
        localSha256:
          "e180608cd5412edca5d58269bdffa1f12a056bf70bf89e49140d824919b2d34f",
      },
    ],
  },
  {
    id: "met-29-179-34",
    recordType: "museum-textile",
    title: "Textile Fragment",
    date: "10th century",
    documentedOrigin: { field: "Geography", value: "Attributed to Yemen" },
    maker: null,
    medium: "Cotton; plain weave, resist-dyed (ikat), embroidered",
    materials: ["cotton"],
    techniques: ["plain weave", "resist-dyed (ikat)", "embroidery"],
    dimensions: "L. 15 1/2 in. (39.4 cm); W. 9 1/2 in. (24.1 cm)",
    accessionNumber: "29.179.34",
    creditLine: "Gift of George D. Pratt, 1929",
    institution: "The Metropolitan Museum of Art",
    objectUrl: "https://www.metmuseum.org/art/collection/search/448319",
    recordSourceUrl:
      "https://collectionapi.metmuseum.org/public/collection/v1/objects/448319",
    rights: {
      status: "Public Domain",
      checkedAt: COLLECTION_RETRIEVED_AT,
      attributionRequired: false,
      attributionRequirement:
        "The Met marks the image Public Domain and permits unrestricted use without permission or fee. Attribution is not required; the museum and object credit below is recommended.",
      suggestedCredit:
        "The Metropolitan Museum of Art, 29.179.34; image Public Domain",
    },
    lookingNote:
      "This is a fragment, catalogued with plain weave, ikat resist-dyeing, and embroidery. Its broken geometric marks reward close looking at the surviving edge and ground.",
    images: [
      {
        role: "primary",
        src: "/images/collection/met-29-179-34-yemen-fragment.webp",
        alt: "A worn cotton textile fragment with repeated pale geometric marks and an uneven lower edge.",
        sourceDownloadUrl:
          "https://images.metmuseum.org/CRDImages/is/original/DP368803.jpg",
        sourceDimensionsPx: [2555, 3860],
        localDimensionsPx: [1853, 2800],
        localBytes: 2307936,
        localSha256:
          "6e45a555d594faf785b669c506585128f574946bb7556c5fe905ce58fd86498c",
      },
    ],
  },
  {
    id: "met-1988-104-1",
    recordType: "museum-textile",
    title: "Woman's Ceremonial Skirt (Tapis)",
    date: "18th century or earlier",
    documentedOrigin: {
      field: "Geography",
      value: "Indonesia, Sumatra, Lampung province",
    },
    maker: "Lampung artist",
    medium: "Cotton, silk",
    materials: ["cotton", "silk"],
    techniques: [
      "warp ikat woven bands",
      "embroidered panels",
    ],
    dimensions: "L. 52 x W. 52 in. (132.1 x 132.1 cm)",
    accessionNumber: "1988.104.1",
    creditLine: "Gift of Ernest Erickson Foundation, 1988",
    institution: "The Metropolitan Museum of Art",
    objectUrl: "https://www.metmuseum.org/art/collection/search/315915",
    recordSourceUrl:
      "https://collectionapi.metmuseum.org/public/collection/v1/objects/315915",
    rights: {
      status: "Public Domain",
      checkedAt: COLLECTION_RETRIEVED_AT,
      attributionRequired: false,
      attributionRequirement:
        "The Met marks the image Public Domain and permits unrestricted use without permission or fee. Attribution is not required; the museum and object credit below is recommended.",
      suggestedCredit:
        "The Metropolitan Museum of Art, 1988.104.1; image Public Domain",
    },
    lookingNote:
      "The Met notes that tapis are worn as tubular skirts, although this example is opened at the seam for display. Woven warp-ikat bands alternate with embroidered panels; the museum cautions that the meaning of the embroidered cumi-cumi motif is not fully understood.",
    images: [
      {
        role: "primary",
        src: "/images/collection/met-1988-104-1-tapis.webp",
        alt: "An opened Lampung tapis with horizontal dark patterned bands alternating with pale embroidered bands.",
        sourceDownloadUrl:
          "https://images.metmuseum.org/CRDImages/ao/original/DP-23873-001.jpg",
        sourceDimensionsPx: [3923, 4000],
        localDimensionsPx: [2746, 2800],
        localBytes: 2197564,
        localSha256:
          "faf08f5d0360da08570ae301e43e3e7a63de2a11c24de1164178f0d10bccdab4",
      },
    ],
  },
  {
    id: "cma-1992-103",
    recordType: "museum-textile",
    title: "Tapestry Panel",
    date: "1000–1460s",
    documentedOrigin: {
      field: "Culture",
      value: "Peru, Central Coast, Chancay-Chimú style, 11th-15th century",
    },
    maker: null,
    medium: "camelid fiber and cotton, tapestry weave",
    materials: ["camelid fiber", "cotton"],
    techniques: ["tapestry weave"],
    dimensions:
      "Overall: 115 x 54.3 cm (45 1/4 x 21 3/8 in.); mounted: 124.5 x 64.8 cm (49 x 25 1/2 in.)",
    accessionNumber: "1992.103",
    creditLine: "Seventy-fifth anniversary gift of Mr. and Mrs. Cedric Marks",
    institution: "Cleveland Museum of Art",
    objectUrl: "https://www.clevelandart.org/art/1992.103",
    recordSourceUrl:
      "https://openaccess-api.clevelandart.org/api/artworks/?accession_number=1992.103",
    rights: {
      status: "CC0",
      checkedAt: COLLECTION_RETRIEVED_AT,
      attributionRequired: false,
      attributionRequirement:
        "The Cleveland Museum of Art marks this image CC0. Attribution is not required; the institution recommends citing the object for scholarly or publication use.",
      suggestedCredit: "Cleveland Museum of Art, 1992.103, CC0",
    },
    lookingNote:
      "A stepped-V motif alternates in orientation and color. The CMA describes it as a geometricized head that may represent two birds, woven into an interlocking pattern with no proper top or bottom.",
    images: [
      {
        role: "primary",
        src: "/images/collection/cma-1992-103-tapestry-panel.webp",
        alt: "A long tapestry panel in ochre, brown, and cream with repeated stepped geometric figures and fringe.",
        sourceDownloadUrl:
          "https://openaccess-cdn.clevelandart.org/1992.103/1992.103_print.jpg",
        sourceDimensionsPx: [1774, 3400],
        localDimensionsPx: [1461, 2800],
        localBytes: 858446,
        localSha256:
          "babcff48d87cf62e82a99e99dc1a25fe6c5a6e05167a3fc443d084e70b11cb74",
      },
    ],
  },
  {
    id: "cma-1916-1334",
    recordType: "museum-textile",
    title: "Tapestry",
    date: "1368–1644",
    documentedOrigin: {
      field: "Culture",
      value: "China, Ming Period (1368-1644)",
    },
    maker: null,
    medium: "tapestry weave, silk and gold thread",
    materials: ["silk", "gold thread"],
    techniques: ["tapestry weave"],
    dimensions: "Overall: 198.1 x 66 cm (78 x 26 in.)",
    accessionNumber: "1916.1334",
    creditLine: "Gift of Mr. and Mrs. J. H. Wade",
    institution: "Cleveland Museum of Art",
    objectUrl: "https://www.clevelandart.org/art/1916.1334",
    recordSourceUrl:
      "https://openaccess-api.clevelandart.org/api/artworks/?accession_number=1916.1334",
    rights: {
      status: "CC0",
      checkedAt: COLLECTION_RETRIEVED_AT,
      attributionRequired: false,
      attributionRequirement:
        "The Cleveland Museum of Art marks this image CC0. Attribution is not required; the institution recommends citing the object for scholarly or publication use.",
      suggestedCredit: "Cleveland Museum of Art, 1916.1334, CC0",
    },
    lookingNote:
      "The CMA image description places a bird among flowering branches, peonies, and cloud forms. Silk and gold thread build a tall field of color and ornament.",
    images: [
      {
        role: "primary",
        src: "/images/collection/cma-1916-1334-tapestry.webp",
        alt: "A narrow vertical silk tapestry with a bird, flowering branches, and bands of ornamental cloud forms.",
        sourceDownloadUrl:
          "https://openaccess-cdn.clevelandart.org/1916.1334/1916.1334_print.jpg",
        sourceDimensionsPx: [1165, 3400],
        localDimensionsPx: [959, 2800],
        localBytes: 779230,
        localSha256:
          "5ad815fcb548a8c7e907b61a04467d53ca68384bafdb438cd257613742e92e59",
      },
    ],
  },
  {
    id: "cma-1916-1246",
    recordType: "museum-textile",
    title: "Embroidered Textile",
    date: "1700s–1800s",
    documentedOrigin: { field: "Culture", value: "Turkey" },
    maker: null,
    medium: "Wool: silk and metal threads embroidery; cotton backing",
    materials: ["wool", "silk", "metal threads", "cotton backing"],
    techniques: ["silk and metal-thread embroidery"],
    dimensions: "Average: 124.5 x 93 cm (49 x 36 5/8 in.)",
    accessionNumber: "1916.1246",
    creditLine: "Gift of Mr. and Mrs. J. H. Wade",
    institution: "Cleveland Museum of Art",
    objectUrl: "https://www.clevelandart.org/art/1916.1246",
    recordSourceUrl:
      "https://openaccess-api.clevelandart.org/api/artworks/?accession_number=1916.1246",
    rights: {
      status: "CC0",
      checkedAt: COLLECTION_RETRIEVED_AT,
      attributionRequired: false,
      attributionRequirement:
        "The Cleveland Museum of Art marks this image CC0. Attribution is not required; the institution recommends citing the object for scholarly or publication use.",
      suggestedCredit: "Cleveland Museum of Art, 1916.1246, CC0",
    },
    lookingNote:
      "Repeated floral sprays form upright columns across the wool ground. The CMA notes that sequins appear to have been added seemingly at random, catching light between the embroidery.",
    images: [
      {
        role: "primary",
        src: "/images/collection/cma-1916-1246-embroidered-textile.webp",
        alt: "A broad wool textile densely embroidered with repeated floral sprays and small reflective details.",
        sourceDownloadUrl:
          "https://openaccess-cdn.clevelandart.org/1916.1246/1916.1246_print.jpg",
        sourceDimensionsPx: [3400, 2539],
        localDimensionsPx: [2800, 2091],
        localBytes: 2191102,
        localSha256:
          "dbb8c1df6d5dfd8eade7370bba0fc3262d7544af1f9fa8f7df86ead2f2fc1e87",
      },
    ],
  },
  {
    id: "cma-1922-45",
    recordType: "museum-textile",
    title: "Coverlet",
    date: "19th century",
    documentedOrigin: { field: "Culture", value: "America" },
    maker: null,
    medium: "wool and cotton; double cloth",
    materials: ["wool", "cotton"],
    techniques: ["double cloth"],
    dimensions: "Average: 223.5 x 181.6 cm (88 x 71 1/2 in.)",
    accessionNumber: "1922.45",
    creditLine: "Gift of Mrs. C. H. Koch",
    institution: "Cleveland Museum of Art",
    objectUrl: "https://www.clevelandart.org/art/1922.45",
    recordSourceUrl:
      "https://openaccess-api.clevelandart.org/api/artworks/?accession_number=1922.45",
    rights: {
      status: "CC0",
      checkedAt: COLLECTION_RETRIEVED_AT,
      attributionRequired: false,
      attributionRequirement:
        "The Cleveland Museum of Art marks this image CC0. Attribution is not required; the institution recommends citing the object for scholarly or publication use.",
      suggestedCredit: "Cleveland Museum of Art, 1922.45, CC0",
    },
    lookingNote:
      "The CMA records this coverlet as double cloth. Blue and pale square motifs repeat across the surface inside a dense border of stripes and small blocks.",
    images: [
      {
        role: "primary",
        src: "/images/collection/cma-1922-45-coverlet.webp",
        alt: "A dark-blue and pale geometric coverlet with repeated squares and a narrow patterned border.",
        sourceDownloadUrl:
          "https://openaccess-cdn.clevelandart.org/1922.45/1922.45_print.jpg",
        sourceDimensionsPx: [3400, 2761],
        localDimensionsPx: [2800, 2274],
        localBytes: 1529646,
        localSha256:
          "4b8f8f6749878dfe0057e55cf51c2c443910157a27b1de9adb3778b7b517532a",
      },
    ],
  },
  {
    id: "chndm-1937-75-1",
    recordType: "museum-textile",
    title: "Darning sampler",
    date: "1711",
    documentedOrigin: { field: "Made in", value: "Netherlands" },
    maker: null,
    medium:
      "Medium: silk and linen embroidery on linen foundation. Technique: embroidered in running (pattern darning) and cross stitches on plain weave. Label: linen embroidered with silk in pattern darning and cross stitches",
    materials: ["silk", "linen"],
    techniques: [
      "running stitch (pattern darning)",
      "cross stitch",
      "plain-weave linen foundation",
      "hemstitching",
      "picot edging",
    ],
    dimensions: "H x W: 80 x 64.1 cm (31 1/2 x 25 1/4 in.)",
    accessionNumber: "1937-75-1",
    creditLine: "Gift of Mrs. Montgomery Hare",
    institution: "Cooper Hewitt, Smithsonian Design Museum",
    objectUrl: "https://www.si.edu/object/darning-sampler%3Achndm_1937-75-1",
    recordSourceUrl: "https://www.si.edu/object/darning-sampler%3Achndm_1937-75-1",
    rights: {
      status: "CC0",
      checkedAt: COLLECTION_RETRIEVED_AT,
      attributionRequired: false,
      attributionRequirement:
        "The selected image and metadata are marked CC0 by the Smithsonian. Attribution is not required; a basic institution, object, and source credit is helpful.",
      suggestedCredit: "Cooper Hewitt, Smithsonian Design Museum, 1937-75-1, CC0",
    },
    lookingNote:
      "Fifteen darning crosses and two corner mends gather around the center inscription GD 1711. The sampler makes repair and stitch structure visible at the scale of an entire cloth.",
    images: [
      {
        role: "primary",
        src: "/images/collection/cooper-hewitt-1937-75-1-darning-sampler.webp",
        alt: "A pale rectangular linen sampler with small colored darned squares, corner mends, and a central inscription.",
        sourceDownloadUrl:
          "https://ids.si.edu/ids/download?id=CHSDM-CAB7E961C30E2-000001.jpg",
        sourceDimensionsPx: [6905, 8463],
        localDimensionsPx: [2285, 2800],
        localBytes: 1818386,
        localSha256:
          "1c1cb40741e6afcc8f06957cf859248a57f8bf88186faff26346cd4bdbb23841",
      },
    ],
  },
  {
    id: "chndm-1951-111-34",
    recordType: "museum-textile",
    title: "Textile",
    date: "12th–13th century",
    documentedOrigin: { field: "Made in", value: "Egypt" },
    maker: null,
    medium: "linen, silk; cross stitch embroidery on plain weave",
    materials: ["linen", "silk"],
    techniques: ["cross-stitch embroidery", "plain weave"],
    dimensions: "H x W: 11 x 11.5 cm (4 5/16 x 4 1/2 in.)",
    accessionNumber: "1951-111-34",
    creditLine: "Gift of Frances Morris",
    institution: "Cooper Hewitt, Smithsonian Design Museum",
    objectUrl: "https://www.si.edu/object/textile%3Achndm_1951-111-34",
    recordSourceUrl: "https://www.si.edu/object/textile%3Achndm_1951-111-34",
    rights: {
      status: "CC0",
      checkedAt: COLLECTION_RETRIEVED_AT,
      attributionRequired: false,
      attributionRequirement:
        "The selected image and metadata are marked CC0 by the Smithsonian. Attribution is not required; a basic institution, object, and source credit is helpful.",
      suggestedCredit: "Cooper Hewitt, Smithsonian Design Museum, 1951-111-34, CC0",
    },
    lookingNote:
      "An embroidered band of angular S-shapes crosses a fragmentary linen ground. Its small dimensions make the plain weave, cross-stitch lines, and worn edges the central evidence.",
    images: [
      {
        role: "primary",
        src: "/images/collection/cooper-hewitt-1951-111-34-textile.webp",
        alt: "A fragment of linen with red and blue cross-stitched bands and frayed edges.",
        sourceDownloadUrl:
          "https://ids.si.edu/ids/download?id=CHSDM-FED70F4EB4222-000001.jpg",
        sourceDimensionsPx: [2827, 2914],
        localDimensionsPx: [2716, 2800],
        localBytes: 1378308,
        localSha256:
          "68401f4ee221eb1d7a58570a84b9821885353803dfdb0a2729bb9ab98da82a35",
      },
    ],
  },
  {
    id: "nmah-138338",
    recordType: "museum-textile",
    title: "1863 Susannah Pullen's Civil War Quilt",
    date: "1863",
    documentedOrigin: {
      field: "Made in",
      value: "Augusta, Maine, United States",
    },
    maker: "Pullen, Mrs. Gilbert",
    makerAttributionNote:
      "The museum names the maker as Pullen, Mrs. Gilbert and notes that members of her Sunday school class also contributed blocks and inscriptions; those collaborators are not individually named in this record.",
    medium:
      "fabric, cotton (overall material); thread, cotton (overall material); filling, cotton (overall material); pieced; lined, quilted (overall production method/technique)",
    materials: ["cotton fabric", "cotton thread", "cotton filling"],
    techniques: ["pieced", "lined", "quilted"],
    dimensions: "overall: 84 in x 50 in; 213 cm x 126 cm",
    accessionNumber: "138338",
    creditLine: "Gift of Charlotte Pullen Scruton",
    institution: "National Museum of American History, Smithsonian Institution",
    objectUrl:
      "https://americanhistory.si.edu/collections/object/nmah_556322",
    recordSourceUrl:
      "https://americanhistory.si.edu/collections/object/nmah_556322",
    rights: {
      status: "CC0",
      checkedAt: COLLECTION_RETRIEVED_AT,
      attributionRequired: false,
      attributionRequirement:
        "The selected image and metadata are marked CC0 by the Smithsonian. Attribution is not required; a basic institution, object, and source credit is helpful.",
      suggestedCredit: "National Museum of American History, 138338, CC0",
    },
    lookingNote:
      "The museum reports more than 150 inscriptions written by fourteen young women in the Sunday school class; Pullen also wrote a longer message on the reverse. Piecing, quilting, and text connect the cloth to correspondence.",
    images: [
      {
        role: "primary",
        src: "/images/collection/nmah-138338-pullen-quilt.webp",
        alt: "A vertical view of a pieced quilt built from star blocks and patterned cloth panels.",
        sourceDownloadUrl:
          "https://ids.si.edu/ids/download?id=NMAH-95-7154.jpg",
        sourceDimensionsPx: [1986, 3150],
        localDimensionsPx: [1765, 2800],
        localBytes: 1951692,
        localSha256:
          "631f98b9dc0d32ed2f07028f16175b317855102874be119c150f8296fb9f434e",
      },
    ],
  },
  {
    id: "nmah-1982-0392",
    recordType: "museum-textile",
    title: "Silk Quilt",
    date: "ca. 1850",
    documentedOrigin: null,
    maker: "Littlejohn, Ellen Morton; Bibb, Margaret Morton",
    makerAttributionNote:
      "The museum record lists Ellen Morton Littlejohn and Margaret Morton Bibb as quilters and states that an inter-institutional research group is seeking community input to re-attribute the quilt. Treat the names as the current record attribution, which is under review.",
    medium:
      "silk; cotton (fabric material), cotton; silk (thread material), cotton (filling material)",
    materials: ["silk and cotton fabric", "cotton and silk thread", "cotton filling"],
    techniques: ["pieced", "stuffed", "quilted"],
    dimensions: "overall: 85 in x 82 in; 216 cm x 209 cm",
    accessionNumber: "1982.0392",
    creditLine: "Gift of Mrs. Bonita Abernathy",
    institution: "National Museum of American History, Smithsonian Institution",
    objectUrl:
      "https://americanhistory.si.edu/collections/object/nmah_556181",
    recordSourceUrl:
      "https://americanhistory.si.edu/collections/object/nmah_556181",
    rights: {
      status: "CC0",
      checkedAt: COLLECTION_RETRIEVED_AT,
      attributionRequired: false,
      attributionRequirement:
        "The selected images and metadata are marked CC0 by the Smithsonian. Attribution is not required; a basic institution, object, and source credit is helpful.",
      suggestedCredit: "National Museum of American History, 1982.0392, CC0",
    },
    lookingNote:
      "The museum describes thirty-six pieced silk star blocks among plain green silk areas. Distinct stuffed and quilted floral or foliage sprays give the larger surface a close, varied relief; the current maker attribution is under research.",
    images: [
      {
        role: "primary",
        src: "/images/collection/nmah-1982-0392-silk-quilt.webp",
        alt: "A large silk quilt arranged as a field of multicolored star blocks and green floral quilted squares.",
        sourceDownloadUrl:
          "https://ids.si.edu/ids/download?id=NMAH-JN2026-00545-000001.jpg",
        sourceDimensionsPx: [11778, 11507],
        localDimensionsPx: [2800, 2736],
        localBytes: 2217916,
        localSha256:
          "e2da20c266cdd28661d5c124f32b8daf760d0f24fd226decc5d8cbc5e3b4b708",
      },
      {
        role: "detail",
        src: "/images/collection/nmah-1982-0392-silk-quilt-detail.webp",
        alt: "A close view of a star block and densely quilted floral and foliage patterns in silk.",
        sourceDownloadUrl:
          "https://ids.si.edu/ids/download?id=NMAH-JN2026-00548-000001.jpg",
        sourceDimensionsPx: [13914, 10009],
        localDimensionsPx: [2800, 2014],
        localBytes: 1842912,
        localSha256:
          "a303542e76fbfb23a3f7712978df73ce02dd4cc8c7c98112f6276a06ec539100",
      },
    ],
  },
] as const satisfies readonly HistoricalTextileRecord[];

export type HistoricalTextileId = (typeof HISTORICAL_TEXTILES)[number]["id"];

/**
 * Lookup only the historical catalogue. Visitor work continues to use
 * Artwork from ./weave and is never inserted into this collection registry.
 */
export function getHistoricalTextile(
  id: HistoricalTextileId,
): (typeof HISTORICAL_TEXTILES)[number] | undefined {
  return HISTORICAL_TEXTILES.find((item) => item.id === id);
}

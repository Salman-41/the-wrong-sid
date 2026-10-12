import { test } from "node:test";
import assert from "node:assert/strict";
import { open } from "node:fs/promises";
import { resolve } from "node:path";
import {
  readCollectionSelection,
  type CollectionBrowseFacet,
} from "../src/lib/collection-browse";
import { HISTORICAL_TEXTILES } from "../src/lib/collection-data";
import {
  COLLECTION_BROWSE_GROUPS,
  COLLECTION_EDITORIAL,
  type CollectionBrowseGroup,
} from "../src/lib/collection-editorial";

const catalogueIds = HISTORICAL_TEXTILES.map((object) => object.id);
const facets: Record<CollectionBrowseFacet, readonly CollectionBrowseGroup[]> =
  COLLECTION_BROWSE_GROUPS;

test("unrecognized or repeated browse choices preserve the full museum catalogue", () => {
  for (const by of [undefined, "objects", "unknown", "Materials", ["materials"], ["places", "techniques"]]) {
    const result = readCollectionSelection({ by, group: "cotton" });
    assert.equal(result.by, "objects");
    assert.equal(result.group, undefined);
    assert.deepEqual(result.records.map((object) => object.id), catalogueIds);
  }

  for (const group of [undefined, "unknown", "tapestry", ["cotton"], ["cotton", "silk"]]) {
    const result = readCollectionSelection({ by: "materials", group });
    assert.equal(result.by, "materials");
    assert.equal(result.group, undefined);
    assert.deepEqual(result.records.map((object) => object.id), catalogueIds);
  }
});

test("valid facets return exactly their documented group and museum objects", () => {
  assert.deepEqual(
    readCollectionSelection({ by: "techniques", group: "ikat" }).records.map((object) => object.id),
    ["met-66-122-20", "met-29-179-34", "met-1988-104-1"],
  );
  assert.deepEqual(
    readCollectionSelection({ by: "places", group: "yemen-attributed" }).records.map((object) => object.id),
    ["met-29-179-34"],
  );

  for (const by of Object.keys(facets) as CollectionBrowseFacet[]) {
    for (const group of facets[by]) {
      const selection = readCollectionSelection({ by, group: group.id });
      assert.equal(selection.by, by);
      assert.equal(selection.group?.id, group.id);
      assert.deepEqual(
        new Set(selection.records.map((object) => object.id)),
        new Set(group.objectIds),
        `${by}/${group.id} must return its authored membership`,
      );
      assert.equal(selection.records.length, group.objectIds.length);
      assert(selection.records.every((object) => object.recordType === "museum-textile"));
    }
  }
});

test("all eleven museum records have distinct, justified related works", () => {
  assert.equal(catalogueIds.length, 11);
  assert.equal(new Set(catalogueIds).size, 11);
  assert.deepEqual(Object.keys(COLLECTION_EDITORIAL).sort(), [...catalogueIds].sort());
  const knownIds = new Set<string>(catalogueIds);

  for (const object of HISTORICAL_TEXTILES) {
    const editorial = COLLECTION_EDITORIAL[object.id];
    assert(editorial.context.trim(), `${object.id} needs source-grounded context`);
    assert(editorial.closeLooking.trim(), `${object.id} needs its reading prompt`);
    assert.equal(editorial.relatedWorks.length, 2);
    assert.equal(new Set(editorial.relatedWorks.map((related) => related.id)).size, 2);
    for (const related of editorial.relatedWorks) {
      assert(knownIds.has(related.id), `${object.id} refers to an unknown museum object`);
      assert.notEqual(related.id, object.id);
      assert(related.reason.trim(), `${object.id}/${related.id} needs a comparison reason`);
    }
  }
});

/** Read container dimensions without decoding these large museum images. */
async function readWebpDimensions(path: string): Promise<readonly [number, number]> {
  const file = await open(path, "r");
  const header = Buffer.alloc(30);
  try {
    const { bytesRead } = await file.read(header, 0, header.length, 0);
    assert.equal(bytesRead, header.length, `${path} must have a complete WebP header`);
  } finally {
    await file.close();
  }
  assert.equal(header.toString("ascii", 0, 4), "RIFF");
  assert.equal(header.toString("ascii", 8, 12), "WEBP");
  const chunk = header.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return [header.readUIntLE(24, 3) + 1, header.readUIntLE(27, 3) + 1];
  }
  if (chunk === "VP8L") {
    assert.equal(header[20], 0x2f);
    const bits = header.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
  }
  assert.equal(chunk, "VP8 ", `${path} must use a recognized image chunk`);
  assert.deepEqual([...header.subarray(23, 26)], [0x9d, 0x01, 0x2a]);
  return [header.readUInt16LE(26) & 0x3fff, header.readUInt16LE(28) & 0x3fff];
}

test("all twelve museum images exist at their declared natural dimensions", async () => {
  const paths = new Set<string>();
  for (const object of HISTORICAL_TEXTILES) {
    assert.equal(object.images.filter((image) => image.role === "primary").length, 1);
    for (const image of object.images) {
      assert(image.src.startsWith("/images/collection/"));
      assert(!paths.has(image.src), `${image.src} must identify one documented image`);
      paths.add(image.src);
      const actual = await readWebpDimensions(resolve("public", image.src.slice(1)));
      assert.deepEqual(actual, image.localDimensionsPx, image.src);
      assert(actual[0] <= image.sourceDimensionsPx[0] && actual[1] <= image.sourceDimensionsPx[1]);
    }
  }
  assert.equal(paths.size, 12);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createRepeat,
  satinRepeat,
  matrixAt,
  makeArtwork,
  crossingAt,
  reverseMatrix,
  parseArtwork,
  serializeArtwork,
  type Structure,
} from "../src/lib/weave";
import { createCanvas, Path2D } from "@napi-rs/canvas";
import { renderCloth } from "../src/lib/renderer";
Object.assign(globalThis, { Path2D });

test("plain alternates both directions, including periodic boundaries and negative coordinates", () => {
  const matrix = createRepeat("plain");
  assert.deepEqual(matrix, [
    [true, false],
    [false, true],
  ]);
  for (let y = -3; y < 13; y++)
    for (let x = -3; x < 13; x++) {
      assert.notEqual(matrixAt(matrix, x, y), matrixAt(matrix, x + 1, y));
      assert.notEqual(matrixAt(matrix, x, y), matrixAt(matrix, x, y + 1));
    }
});
test("2/2 twill has two contiguous over and under, advancing one end per pick", () => {
  const matrix = createRepeat("twill-2-2");
  assert.deepEqual(matrix, [
    [true, true, false, false],
    [false, true, true, false],
    [false, false, true, true],
    [true, false, false, true],
  ]);
  for (let row = 0; row < 4; row++) {
    assert.equal(matrix[row].filter(Boolean).length, 2);
    for (let col = 0; col < 4; col++)
      assert.equal(
        matrixAt(matrix, col + 1, row + 1),
        matrixAt(matrix, col, row),
      );
  }
});
test("5-end satin has exactly one binding per row/column, dispersed by step 2; sateen complements it", () => {
  const satin = createRepeat("satin-5"),
    sateen = createRepeat("sateen-5");
  const bindings = [0, 2, 4, 1, 3];
  for (let row = 0; row < 5; row++) {
    assert.equal(satin[row].filter((v) => !v).length, 1);
    assert.equal(satin[row][bindings[row]], false);
    assert.equal(satin.map((line) => line[row]).filter((v) => !v).length, 1);
    for (let col = 0; col < 5; col++)
      assert.notEqual(satin[row][col], sateen[row][col]);
  }
  // Along each warp, four consecutive raised picks between one binding (including wrap).
  for (let col = 0; col < 5; col++) {
    const binding = satin.findIndex((row) => !row[col]);
    for (let offset = 1; offset < 5; offset++)
      assert.equal(matrixAt(satin, col, binding + offset), true);
  }
});
test("invalid regular satin repeat/step pairs are rejected", () => {
  for (const [size, step] of [
    [4, 2],
    [5, 1],
    [5, 4],
    [6, 2],
    [8, 4],
    [5, 2.5],
    [5, -2],
  ])
    assert.throws(() => satinRepeat(size, step));
  assert.equal(satinRepeat(7, 3).length, 7);
});
test("reverse mirrors geometry AND exchanges above/below; physical turn is involutive", () => {
  const asymmetric = [
    [true, true, false],
    [false, true, false],
  ];
  assert.deepEqual(reverseMatrix(asymmetric), [
    [true, false, false],
    [true, false, true],
  ]);
  assert.deepEqual(reverseMatrix(reverseMatrix(asymmetric)), asymmetric);
  for (const structure of Object.keys({
    plain: 1,
    "twill-2-2": 1,
    "satin-5": 1,
    "sateen-5": 1,
  }) as Structure[]) {
    const art = makeArtwork(structure);
    art.warp = art.warp.slice(0, 17); // non-repeat-aligned width
    const snapshot = serializeArtwork(art);
    for (let y = 0; y < 19; y++)
      for (let x = 0; x < 17; x++)
        assert.equal(
          crossingAt(art, x, y, "reverse"),
          !crossingAt(art, 16 - x, y, "front"),
        );
    assert.equal(
      serializeArtwork(art),
      snapshot,
      "view transforms must not change visitor artwork",
    );
  }
});
test("repeats remain periodic over many tiles", () => {
  for (const structure of [
    "plain",
    "twill-2-2",
    "satin-5",
    "sateen-5",
  ] as const) {
    const matrix = createRepeat(structure);
    for (let y = -5; y < 20; y++)
      for (let x = -5; x < 20; x++)
        assert.equal(
          matrixAt(matrix, x, y),
          matrixAt(matrix, x + matrix[0].length * 3, y + matrix.length * 2),
        );
  }
});
test("serialization preserves individual yarns, matrices and seeded detail exactly", () => {
  const art = makeArtwork("satin-5");
  art.name = "Visitor’s indigo cloth";
  art.warp[4] = { color: "#abcdef", thickness: 0.61 };
  art.weft[9] = { color: "#123456", thickness: 0.93 };
  assert.deepEqual(parseArtwork(serializeArtwork(art)), art);
  assert.equal(
    serializeArtwork(parseArtwork(serializeArtwork(art))),
    serializeArtwork(art),
  );
});
test("untrusted files reject forged structures, malformed threads and oversized input", () => {
  const art = makeArtwork();
  for (const patch of [
    { version: 2 },
    { seed: Infinity },
    { structure: "__proto__" },
    { interlacement: [[true]] },
    { warp: [] },
    { warp: [{ color: "red", thickness: 0.8 }, art.warp[0]] },
    { weft: [{ color: "#123456", thickness: 4 }, art.weft[0]] },
  ])
    assert.throws(() => parseArtwork(JSON.stringify({ ...art, ...patch })));
  assert.throws(() => parseArtwork(" ".repeat(100_001)));
  assert.throws(() => parseArtwork("{"));
});

test("rendered crossing centers expose the mathematically correct yarn on both faces", () => {
  for (const structure of [
    "plain",
    "twill-2-2",
    "satin-5",
    "sateen-5",
  ] as const) {
    const art = makeArtwork(structure);
    // Odd, non-repeat-aligned width catches implementations that only complement the matrix.
    art.warp = Array.from({ length: 11 }, () => ({
      color: "#dd2222",
      thickness: 0.8,
    }));
    art.weft = Array.from({ length: 11 }, () => ({
      color: "#2222dd",
      thickness: 0.8,
    }));
    for (const face of ["front", "reverse"] as const) {
      const canvas = createCanvas(220, 220);
      renderCloth(canvas as unknown as HTMLCanvasElement, art, {
        width: 220,
        height: 220,
        zoom: 1,
        face,
      });
      for (let row = 0; row < 11; row++)
        for (let col = 0; col < 11; col++) {
          const pixel = canvas
            .getContext("2d")
            .getImageData(col * 20 + 10, row * 20 + 10, 1, 1).data;
          assert.equal(
            pixel[0] > pixel[2],
            crossingAt(art, col, row, face),
            `${structure} ${face} (${col},${row})`,
          );
        }
    }
  }
});
test("high-resolution backing stores honor DPR and the memory ceiling", () => {
  const art = makeArtwork();
  art.warp = art.warp.slice(0, 4);
  art.weft = art.weft.slice(0, 4);
  const canvas = createCanvas(1, 1);
  renderCloth(canvas as unknown as HTMLCanvasElement, art, {
    width: 120,
    height: 100,
    dpr: 3,
    zoom: 1,
    face: "front",
  });
  assert.equal(canvas.width, 240);
  assert.equal(canvas.height, 200);
  renderCloth(canvas as unknown as HTMLCanvasElement, art, {
    width: 2000,
    height: 2000,
    dpr: 2,
    zoom: 1,
    face: "front",
  });
  assert.equal(canvas.width, 2000);
  assert.equal(canvas.height, 2000);
});

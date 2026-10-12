import { test } from "node:test";
import assert from "node:assert/strict";
import { createCanvas, Path2D } from "@napi-rs/canvas";
import { makeLoomArtwork } from "../src/lib/construction";
import {
  PatternRenderCache,
  patternMaterialKey,
  renderPatternRoom,
  type PatternCanvas,
} from "../src/lib/pattern-renderer";

Object.assign(globalThis, { Path2D });
const factory = (width: number, height: number) => createCanvas(width, height) as unknown as PatternCanvas;
const pixels = (canvas: PatternCanvas) => (canvas as unknown as { toBuffer: (mime: "image/png") => Buffer }).toBuffer("image/png");

test("graphic repeat and scale reuse yarn renders; a changed crossing rule rebuilds them", () => {
  const art = makeLoomArtwork();
  const cache = new PatternRenderCache(factory);
  const canvas = factory(390, 590);
  const paint = (repeat: number, scale: number, composition: "cutwork" | "bias") =>
    renderPatternRoom(canvas, art, { width: 390, height: 590, dpr: 1, repeat, scale, composition }, cache);
  const first = paint(1, 1, "cutwork");
  assert.equal(first.materialRenders, 4);
  assert.equal(first.tileRenders, 1);
  const source = pixels(canvas);
  const repeated = paint(3, 1.25, "cutwork");
  assert.equal(repeated.materialRenders, 4);
  assert.equal(repeated.tileRenders, 1);
  assert.notDeepEqual(pixels(canvas), source);
  const arranged = paint(2, 1, "bias");
  assert.equal(arranged.materialRenders, 4);
  assert.equal(arranged.tileRenders, 2);
  const reweaved = {
    ...art,
    pickStructures: art.pickStructures.map(() => "twill-2-2" as const),
  };
  assert.notEqual(patternMaterialKey(reweaved), patternMaterialKey(art));
  const structural = renderPatternRoom(canvas, reweaved, { width: 390, height: 590, dpr: 1, repeat: 2, scale: 1, composition: "bias" }, cache);
  assert.equal(structural.materialRenders, 8);
  assert.notDeepEqual(pixels(canvas), source);
});

test("a cutwork field follows its physical yarn window through recoloring", () => {
  const art = makeLoomArtwork();
  const cache = new PatternRenderCache(factory);
  const canvas = factory(390, 590);
  const options = { width: 390, height: 590, dpr: 1, repeat: 1, scale: 1, composition: "cutwork" as const };
  const original = renderPatternRoom(canvas, art, options, cache);
  assert.equal(original.colors?.vermilion, "#C54E32");
  const recolored = {
    ...art,
    warp: art.warp.map((thread, i) => i >= 32 && i < 40 ? { ...thread, color: "#586557" } : thread),
    weft: art.weft.map((thread, i) => i >= 8 && i < 12 ? { ...thread, color: "#586557" } : thread),
  };
  const changed = renderPatternRoom(canvas, recolored, options, cache);
  assert.equal(changed.colors?.vermilion, "#586557");
  assert.equal(changed.materialRenders, 8);
  assert.equal(patternMaterialKey({ ...art, structure: "twill-2-2" }), patternMaterialKey(art), "the pending rule does not alter woven picks");
  const empty = renderPatternRoom(canvas, { ...art, weft: [], pickStructures: [] }, options, cache);
  assert.equal(empty.colors, null);
});

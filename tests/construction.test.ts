import { test } from "node:test";
import assert from "node:assert/strict";
import {
  makeLoomArtwork,
  insertPick,
  setNextStructure,
  resetCloth,
  editArtwork,
  undoArtwork,
  redoArtwork,
  type ConstructionHistory,
} from "../src/lib/construction";
import {
  parseArtwork,
  serializeArtwork,
  warpOverAt,
  crossingAt,
} from "../src/lib/weave";
import { createCanvas, Path2D } from "@napi-rs/canvas";
import { renderCloth } from "../src/lib/renderer";
Object.assign(globalThis, { Path2D });

test("a new pick commits the draft yarn and next rule without altering previous picks", () => {
  const original = makeLoomArtwork(),
    snapshot = serializeArtwork(original);
  const next = setNextStructure(
    { ...original, draftWeft: { color: "#BAA7CF", thickness: 0.61 } },
    "twill-2-2",
  );
  const woven = insertPick(next);
  assert.equal(woven.weft.length, 29);
  assert.deepEqual(woven.weft[28], { color: "#BAA7CF", thickness: 0.61 });
  assert.equal(woven.pickStructures[28], "twill-2-2");
  assert.deepEqual(woven.weft.slice(0, 28), original.weft);
  assert.deepEqual(woven.pickStructures.slice(0, 28), original.pickStructures);
  assert.equal(serializeArtwork(original), snapshot);
  // Pick 27 is plain; pick 28 is the first stored twill pick (global phase 0).
  assert.equal(warpOverAt(woven, 0, 27), false);
  assert.equal(warpOverAt(woven, 0, 28), true);
  assert.equal(warpOverAt(woven, 1, 28), true);
  assert.equal(warpOverAt(woven, 2, 28), false);
});
test("changing next yarn/rule leaves existing crossings intact; satin can be inserted after plain", () => {
  const art = makeLoomArtwork(),
    next = setNextStructure(art, "satin-5");
  for (let row = 0; row < 28; row++)
    for (let col = 0; col < 48; col++)
      assert.equal(warpOverAt(next, col, row), warpOverAt(art, col, row));
  const woven = insertPick(next); // binding 2*28 mod5 = 1
  assert.equal(warpOverAt(woven, 1, 28), false);
  assert.equal(warpOverAt(woven, 0, 28), true);
  for (let col = 0; col < 48; col++)
    assert.equal(
      crossingAt(woven, col, 28, "reverse"),
      !warpOverAt(woven, 47 - col, 28),
    );
});
test("undo and redo restore yarns, rules and row counts; edits after undo discard the old future", () => {
  const base = makeLoomArtwork();
  let state: ConstructionHistory = { artwork: base, past: [], future: [] };
  state = editArtwork(state, insertPick(base));
  const saved = serializeArtwork(state.artwork);
  state = undoArtwork(state);
  assert.equal(state.artwork.weft.length, 28);
  state = redoArtwork(state);
  assert.equal(serializeArtwork(state.artwork), saved);
  state = undoArtwork(state);
  state = editArtwork(state, {
    ...state.artwork,
    draftWeft: { color: "#123456", thickness: 0.8 },
  });
  assert.equal(state.future.length, 0);
  assert.equal(redoArtwork(state), state);
});
test("reset clears construction but preserves warp, draft and capacity; undo restores the cloth", () => {
  const art = makeLoomArtwork(),
    blank = resetCloth(art);
  assert.equal(blank.weft.length, 0);
  assert.equal(blank.pickStructures.length, 0);
  assert.deepEqual(blank.warp, art.warp);
  assert.deepEqual(blank.draftWeft, art.draftWeft);
  assert.equal(blank.rowLimit, art.rowLimit);
  assert.deepEqual(parseArtwork(serializeArtwork(blank)), blank);
  const changed = editArtwork({ artwork: art, past: [], future: [] }, blank);
  assert.deepEqual(undoArtwork(changed).artwork, art);
  assert.equal(insertPick(blank).weft.length, 1);
});
test("capacity is enforced and history is bounded", () => {
  const art = makeLoomArtwork();
  art.rowLimit = 28;
  assert.equal(insertPick(art), art);
  let history: ConstructionHistory = { artwork: art, past: [], future: [] };
  for (let i = 0; i < 100; i++)
    history = editArtwork(history, { ...history.artwork, name: String(i) });
  assert.equal(history.past.length, 80);
});
test("version 2 restores per-pick structure/draft exactly and migrates version 1 files", () => {
  const art = insertPick(setNextStructure(makeLoomArtwork(), "sateen-5"));
  assert.deepEqual(parseArtwork(serializeArtwork(art)), art);
  const legacy = JSON.parse(JSON.stringify(makeLoomArtwork()));
  legacy.version = 1;
  delete legacy.pickStructures;
  delete legacy.draftWeft;
  delete legacy.rowLimit;
  const migrated = parseArtwork(JSON.stringify(legacy));
  assert.equal(migrated.version, 2);
  assert.equal(migrated.pickStructures.length, 28);
  assert(migrated.pickStructures.every((rule) => rule === "plain"));
  assert.deepEqual(migrated.weft, legacy.weft);
  for (const patch of [
    { pickStructures: [] },
    { draftWeft: { color: "bad", thickness: 0.8 } },
    { rowLimit: 2 },
    { pickStructures: Array(29).fill("bad") },
  ])
    assert.throws(() => parseArtwork(JSON.stringify({ ...art, ...patch })));
});
test("mixed-rule render exposes the correct yarn on both faces with first picks at the bottom", () => {
  const art = makeLoomArtwork();
  art.warp = Array.from({ length: 5 }, () => ({
    color: "#dd2222",
    thickness: 0.8,
  }));
  art.weft = Array.from({ length: 5 }, () => ({
    color: "#2222dd",
    thickness: 0.8,
  }));
  art.pickStructures = ["plain", "plain", "twill-2-2", "satin-5", "sateen-5"];
  for (const face of ["front", "reverse"] as const) {
    const canvas = createCanvas(100, 100);
    renderCloth(canvas as unknown as HTMLCanvasElement, art, {
      width: 100,
      height: 100,
      face,
      zoom: 1,
      bottomUp: true,
      fit: "stretch",
    });
    for (let row = 0; row < 5; row++)
      for (let col = 0; col < 5; col++) {
        const pixel = canvas
          .getContext("2d")
          .getImageData(col * 20 + 10, (4 - row) * 20 + 10, 1, 1).data;
        assert.equal(pixel[0] > pixel[2], crossingAt(art, col, row, face));
      }
  }
  const blank = resetCloth(art),
    canvas = createCanvas(100, 100);
  const stats = renderCloth(canvas as unknown as HTMLCanvasElement, blank, {
    width: 100,
    height: 100,
    face: "front",
    zoom: 1,
    transparent: true,
  });
  assert.equal(stats.draws, 0);
  assert.equal(canvas.getContext("2d").getImageData(50, 50, 1, 1).data[3], 0);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  arrangeArtwork,
  getArrangement,
  recolorThreadGroup,
  reweaveArtwork,
} from "../src/lib/pattern-settings";
import {
  createRepeat,
  crossingAt,
  parseArtwork,
  serializeArtwork,
  warpOverAt,
  type Structure,
} from "../src/lib/weave";
import { editArtwork, makeLoomArtwork, undoArtwork } from "../src/lib/construction";

test("global reweave reconstructs every pick with its absolute phase on both faces", () => {
  const base = makeLoomArtwork();
  const mixed = {
    ...base,
    pickStructures: base.pickStructures.map((_, row): Structure =>
      row % 2 ? "satin-5" : "plain",
    ),
  };
  const before = serializeArtwork(mixed);
  const next = reweaveArtwork(mixed, "twill-2-2");
  assert.equal(next.structure, "twill-2-2");
  assert.deepEqual(next.interlacement, createRepeat("twill-2-2"));
  assert(next.pickStructures.every((rule) => rule === "twill-2-2"));
  assert.equal(next.pickStructures.length, mixed.weft.length);
  assert.deepEqual(next.warp, mixed.warp);
  assert.deepEqual(next.weft, mixed.weft);
  assert.deepEqual(next.arrangement, mixed.arrangement);
  for (let pick = 0; pick < next.weft.length; pick++)
    for (let end = 0; end < next.warp.length; end++) {
      assert.equal(
        warpOverAt(next, end, pick),
        createRepeat("twill-2-2")[pick % 4][end % 4],
      );
      assert.equal(
        crossingAt(next, end, pick, "reverse"),
        !crossingAt(next, next.warp.length - 1 - end, pick, "front"),
      );
    }
  assert.equal(serializeArtwork(mixed), before, "the original stays unchanged");
  assert.equal(reweaveArtwork(next, "twill-2-2"), next);
});

test("a yarn group edit changes actual threads and matching draft but keeps crossings", () => {
  const art = makeLoomArtwork();
  const beforeCrossings = Array.from({ length: art.weft.length }, (_, pick) =>
    Array.from({ length: art.warp.length }, (_, end) =>
      warpOverAt(art, end, pick),
    ),
  );
  const warpFrom = art.warp[8].color;
  const updatedWarp = recolorThreadGroup(art, "warp", warpFrom, "#3456AB");
  assert(updatedWarp.warp.some((thread) => thread.color === "#3456AB"));
  for (let end = 0; end < art.warp.length; end++) {
    assert.equal(
      updatedWarp.warp[end].color,
      art.warp[end].color === warpFrom ? "#3456AB" : art.warp[end].color,
    );
    assert.equal(updatedWarp.warp[end].thickness, art.warp[end].thickness);
  }
  const weftFrom = art.draftWeft.color;
  const updatedWeft = recolorThreadGroup(art, "weft", weftFrom, "#A54320");
  assert.equal(updatedWeft.draftWeft.color, "#A54320");
  assert(updatedWeft.weft.some((thread) => thread.color === "#A54320"));
  assert.deepEqual(
    Array.from({ length: art.weft.length }, (_, pick) =>
      Array.from({ length: art.warp.length }, (_, end) =>
        warpOverAt(updatedWeft, end, pick),
      ),
    ),
    beforeCrossings,
  );
  assert.equal(recolorThreadGroup(art, "warp", "#010203", "#3456AB"), art);
  assert.equal(recolorThreadGroup(art, "warp", warpFrom, warpFrom), art);
});

test("graphic arrangement serializes independently of material and undo restores it", () => {
  const original = makeLoomArtwork();
  const changed = arrangeArtwork(original, {
    composition: "bias",
    repeat: 3,
    scale: 1.35,
  });
  assert.deepEqual(getArrangement(changed), {
    composition: "bias",
    repeat: 3,
    scale: 1.35,
  });
  assert.equal(changed.warp, original.warp);
  assert.equal(changed.weft, original.weft);
  assert.equal(changed.pickStructures, original.pickStructures);
  assert.equal(changed.interlacement, original.interlacement);
  assert.deepEqual(parseArtwork(serializeArtwork(changed)), changed);
  const history = editArtwork({ artwork: original, past: [], future: [] }, changed);
  assert.deepEqual(undoArtwork(history).artwork, original);
  assert.equal(arrangeArtwork(changed, { scale: 1.35 }), changed);
});

test("older version 2 art gets default placement; invalid arrangement is rejected", () => {
  const legacy = JSON.parse(serializeArtwork(makeLoomArtwork()));
  delete legacy.arrangement;
  assert.deepEqual(getArrangement(parseArtwork(JSON.stringify(legacy))), {
    composition: "cutwork",
    repeat: 1,
    scale: 1,
  });
  for (const arrangement of [
    null,
    {},
    { composition: "other", repeat: 1, scale: 1 },
    { composition: "cutwork", repeat: 0, scale: 1 },
    { composition: "cutwork", repeat: 5, scale: 1 },
    { composition: "cutwork", repeat: 2, scale: 2 },
    { composition: "cutwork", repeat: 2, scale: null },
  ])
    assert.throws(() =>
      parseArtwork(JSON.stringify({ ...legacy, arrangement })),
    );
});

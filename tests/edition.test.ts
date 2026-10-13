import test from "node:test";
import assert from "node:assert/strict";
import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
import { makeLoomArtwork } from "../src/lib/construction";
import { parseArtwork, serializeArtwork } from "../src/lib/weave";
import { DEFAULT_EDITION, EDITION_FORMATS, parseEditionSettings, type EditionLayout } from "../src/lib/edition-settings";
import { createEditionScene, editionCrossings, materialViewport, renderEdition, EditionRenderCache } from "../src/lib/edition-renderer";
import { generateEditionExport } from "../src/lib/edition-server";

test("edition settings round-trip with the shared textile and older files gain defaults", () => {
  const art = makeLoomArtwork();
  art.edition = { ...art.edition, layout: "material-study", face: "reverse", scale: 1.6, cropX: .2, cropY: .8, title: "Yarn & memory", credit: "Visitor" };
  assert.deepEqual(parseArtwork(serializeArtwork(art)), art);
  const legacy = JSON.parse(JSON.stringify(art)); delete legacy.edition;
  assert.deepEqual(parseArtwork(JSON.stringify(legacy)).edition, DEFAULT_EDITION);
  assert.throws(() => parseEditionSettings({ ...DEFAULT_EDITION, scale: Infinity }));
  assert.throws(() => parseEditionSettings({ ...DEFAULT_EDITION, title: "a".repeat(49) }));
  assert.throws(() => parseEditionSettings({ ...DEFAULT_EDITION, cropX: -1 }));
});
test("crop stays inside the material; reverse uses the same mirrored, complemented crossings", () => {
  const art = makeLoomArtwork(), viewport = materialViewport(art, { w: 712, h: 450 }, 2.7, 0, 1);
  assert.ok(viewport.focus.end >= 0 && viewport.focus.end < art.warp.length);
  assert.ok(viewport.focus.pick >= 0 && viewport.focus.pick < art.weft.length);
  const front = editionCrossings(art, viewport.focus, "front"), back = editionCrossings(art, viewport.focus, "reverse");
  front.forEach((row, r) => row.forEach((crossing, c) => {
    const reverse = back[r][row.length - 1 - c];
    assert.equal(crossing.end, reverse.end); assert.equal(crossing.pick, reverse.pick);
    assert.equal(crossing.warpAbove, !reverse.warpAbove);
    assert.deepEqual(crossing.warp, reverse.warp); assert.deepEqual(crossing.weft, reverse.weft);
  }));
});
test("the three layouts have genuinely different scenes and exact PNG output dimensions", () => {
  const art = makeLoomArtwork();
  const layouts: EditionLayout[] = ["full-bleed", "material-study", "graphic-edition"];
  const output = EDITION_FORMATS.portrait;
  for (const layout of layouts) {
    art.edition = { ...DEFAULT_EDITION, layout };
    const scene = createEditionScene(art);
    assert.equal(scene.nodes.filter((node) => node.kind === "diagram").length, layout === "material-study" ? 1 : 0);
    assert.equal(scene.nodes.filter((node) => node.kind === "cloth").length, layout === "graphic-edition" ? 2 : 1);
    const result = generateEditionExport(art, "png");
    assert.equal(result.bytes.readUInt32BE(16), output.width); assert.equal(result.bytes.readUInt32BE(20), output.height);
    writeFileSync("/tmp/tws-edition-" + layout + ".png", result.bytes);
  }
});
test("recoloring the actual yarns changes rendered material; graphic settings leave crossings intact", () => {
  const art = makeLoomArtwork(); art.edition.layout = "full-bleed";
  const original = createCanvas(400, 534), changed = createCanvas(400, 534);
  const factory = (w: number, h: number) => createCanvas(w, h) as unknown as HTMLCanvasElement;
  const cache = new EditionRenderCache();
  renderEdition(original as unknown as HTMLCanvasElement, art, 400, factory, cache);
  renderEdition(original as unknown as HTMLCanvasElement, { ...art, edition: { ...art.edition, title: "A new title", background: "plum" } }, 400, factory, cache);
  assert.equal(cache.materialRenders, 1, "type and paper reuse the same yarn surface");
  const blue = { ...art, warp: art.warp.map((thread) => ({ ...thread, color: "#143D67" })), weft: art.weft.map((thread) => ({ ...thread, color: "#143D67" })) };
  renderEdition(changed as unknown as HTMLCanvasElement, blue, 400, factory, cache);
  assert.equal(cache.materialRenders, 2, "actual yarn recoloring invalidates the surface");
  assert.notDeepEqual(original.getContext("2d").getImageData(100, 100, 20, 20).data, changed.getContext("2d").getImageData(100, 100, 20, 20).data);
  assert.deepEqual(art.pickStructures, blue.pickStructures); assert.deepEqual(art.interlacement, blue.interlacement);
});
test("SVG is self-contained with outlined type, embedded yarns and real diagram vectors", () => {
  const art = makeLoomArtwork(); art.edition = { ...DEFAULT_EDITION, layout: "material-study", title: "Yarn & memory", face: "reverse" };
  const result = generateEditionExport(art, "svg"), svg = result.bytes.toString();
  assert.match(svg, /width="2400"/); assert.match(svg, /height="3200"/);
  assert.match(svg, /data:image\/png;base64,/); assert.match(svg, /<path/); assert.doesNotMatch(svg, /<text[ >]/);
  assert.doesNotMatch(svg, /https?:\/\/(?!www\.w3\.org)/);
  writeFileSync("/tmp/tws-edition-material-study.svg", result.bytes);
  assert.throws(() => generateEditionExport({ ...art, weft: [], pickStructures: [] }, "png"));
});

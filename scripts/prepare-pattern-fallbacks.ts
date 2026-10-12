import { createCanvas, Path2D } from "@napi-rs/canvas";
import { mkdirSync, writeFileSync } from "node:fs";
import { makeLoomArtwork } from "../src/lib/construction";
import { PatternRenderCache, renderPatternRoom, type PatternCanvas } from "../src/lib/pattern-renderer";

Object.assign(globalThis, { Path2D });
const artwork = makeLoomArtwork();
const factory = (width: number, height: number) => createCanvas(width, height) as unknown as PatternCanvas;
const cache = new PatternRenderCache(factory);
mkdirSync("public/images", { recursive: true });
for (const [format, width, height] of [["desktop", 1440, 814], ["mobile", 390, 586]] as const) {
  const canvas = createCanvas(width, height);
  renderPatternRoom(canvas as unknown as PatternCanvas, artwork, {
    width, height, dpr: 1.5, composition: "cutwork", repeat: 1, scale: 1,
  }, cache);
  writeFileSync(`public/images/pattern-room-${format}.webp`, canvas.toBuffer("image/webp", 88));
}

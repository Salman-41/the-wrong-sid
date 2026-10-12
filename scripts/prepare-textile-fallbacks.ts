import { createCanvas, Path2D } from "@napi-rs/canvas";
import { mkdirSync, writeFileSync } from "node:fs";
import { makeArtwork } from "../src/lib/weave";
import { renderCloth } from "../src/lib/renderer";
Object.assign(globalThis, { Path2D });
mkdirSync("public/images", { recursive: true });
for (const face of ["front", "reverse"] as const) {
  const canvas = createCanvas(600, 600);
  renderCloth(canvas as unknown as HTMLCanvasElement, makeArtwork(), {
    width: 600,
    height: 600,
    dpr: 1,
    face,
    zoom: 2.5,
  });
  writeFileSync(
    `public/images/textile-study-${face}.webp`,
    canvas.toBuffer("image/webp", 82),
  );
}

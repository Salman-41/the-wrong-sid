/** Standalone visual/performance inspection, using the same renderer as the browser. */
import { createCanvas, Path2D } from "@napi-rs/canvas";
import { mkdirSync, writeFileSync } from "node:fs";
import { renderCloth } from "../src/lib/renderer";
import { makeArtwork, type Face } from "../src/lib/weave";

Object.assign(globalThis, { Path2D });
mkdirSync("artifacts", { recursive: true });
for (const structure of [
  "plain",
  "twill-2-2",
  "satin-5",
  "sateen-5",
] as const) {
  for (const face of ["front", "reverse"] as Face[]) {
    const canvas = createCanvas(800, 800);
    const start = performance.now();
    const stats = renderCloth(
      canvas as unknown as HTMLCanvasElement,
      makeArtwork(structure),
      { width: 800, height: 800, dpr: 1, zoom: 3.8, face },
    );
    const elapsed = performance.now() - start;
    writeFileSync(
      `artifacts/${structure}-${face}.png`,
      canvas.toBuffer("image/png"),
    );
    console.log(
      `${structure} ${face}: ${elapsed.toFixed(1)} ms, ${stats.draws} yarn runs`,
    );
  }
}
const overview = createCanvas(800, 800);
renderCloth(overview as unknown as HTMLCanvasElement, makeArtwork(), {
  width: 800,
  height: 800,
  zoom: 1,
  face: "front",
});
writeFileSync("artifacts/overview.png", overview.toBuffer("image/png"));

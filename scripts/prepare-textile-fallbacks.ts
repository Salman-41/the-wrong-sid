import { createCanvas, Path2D } from "@napi-rs/canvas";
import { mkdirSync, writeFileSync } from "node:fs";
import { makeLoomArtwork } from "../src/lib/construction";
import { renderCloth } from "../src/lib/renderer";
Object.assign(globalThis, { Path2D });
mkdirSync("public/images", { recursive: true });
for (const face of ["front", "reverse"] as const) {
  const canvas = createCanvas(600, 600);
  renderCloth(canvas as unknown as HTMLCanvasElement, makeLoomArtwork(), {
    width: 600,
    height: 600,
    dpr: 1,
    face,
    zoom: 2.5,
    bottomUp: true,
  });
  writeFileSync(
    `public/images/textile-study-${face}.webp`,
    canvas.toBuffer("image/webp", 82),
  );
}
const loom = createCanvas(960, 560);
renderCloth(loom as unknown as HTMLCanvasElement, makeLoomArtwork(), {
  width: 960,
  height: 560,
  dpr: 1,
  face: "front",
  zoom: 1,
  fit: "stretch",
  bottomUp: true,
  transparent: true,
});
writeFileSync(
  "public/images/loom-cloth-front.webp",
  loom.toBuffer("image/webp", 86),
);
for (const face of ["front", "reverse"] as const) {
  const surface = createCanvas(760, 920);
  renderCloth(surface as unknown as HTMLCanvasElement, makeLoomArtwork(), {
    width: 760, height: 920, dpr: 1, face, zoom: 1,
    fit: "stretch", bottomUp: true, transparent: true,
  });
  writeFileSync(`public/images/reverse-surface-${face === "front" ? "front" : "back"}.webp`, surface.toBuffer("image/webp", 86));
}

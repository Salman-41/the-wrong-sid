import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
import "../src/lib/edition-server";
import { renderEdition } from "../src/lib/edition-renderer";
import { makeLoomArtwork } from "../src/lib/construction";
const canvas = createCanvas(720, 960);
const factory = (w: number, h: number) => createCanvas(w, h) as unknown as HTMLCanvasElement;
renderEdition(canvas as unknown as HTMLCanvasElement, makeLoomArtwork(), 720, factory);
writeFileSync("public/images/edition-initial.webp", canvas.toBuffer("image/webp", 85));

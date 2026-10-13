import { createCanvas, GlobalFonts, Path2D, convertSVGTextToPath, type Canvas } from "@napi-rs/canvas";
import { join } from "node:path";
import { renderEdition, renderEditionSvg, type EditionCanvasFactory } from "./edition-renderer";
import { EDITION_FORMATS } from "./edition-settings";
import type { Artwork } from "./weave";

// Fonts are the existing locally licensed exhibition fonts; no remote resource is fetched.
for (const [file, alias] of [["GFSDidot-Regular.ttf", "EditionDisplay"], ["arimo-latin.woff2", "EditionUI"], ["cousine-latin.woff2", "EditionCaption"]]) {
  if (!GlobalFonts.registerFromPath(join(process.cwd(), "public/fonts", file), alias)) throw new Error("Edition font could not load.");
}
Object.assign(globalThis, { Path2D });
const factory: EditionCanvasFactory = (width, height) => createCanvas(width, height) as unknown as HTMLCanvasElement;

/** No controls, screenshots, or museum images enter this export pipeline. */
export function generateEditionExport(art: Artwork, format: "png" | "svg") {
  if (!art.weft.length) throw new Error("Weave at least one row before making an edition.");
  const output = EDITION_FORMATS[art.edition.format];
  if (format === "svg") {
    const svg = renderEditionSvg(art, factory, (canvas) => (canvas as unknown as Canvas).toDataURL("image/png"));
    // Outline only the generated text nodes. Passing embedded images through a
    // second SVG serializer can discard SVG2 image attributes or clip semantics.
    const outlined = svg.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g, (text) => {
      const converted = convertSVGTextToPath('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="2000">' + text + '</svg>').toString();
      return converted.slice(converted.indexOf(">", converted.indexOf("<svg")) + 1, converted.lastIndexOf("</svg>"));
    });
    return { bytes: Buffer.from(outlined), width: output.width, height: output.height };
  }
  const canvas = createCanvas(output.width, output.height);
  renderEdition(canvas as unknown as HTMLCanvasElement, art, output.width, factory);
  if (canvas.width !== output.width || canvas.height !== output.height) throw new Error("The edition dimensions could not be preserved.");
  const bytes = canvas.toBuffer("image/png");
  canvas.width = 1; canvas.height = 1;
  return { bytes, width: output.width, height: output.height };
}

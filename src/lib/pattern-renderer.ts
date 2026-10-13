import { renderCloth, type ClothCanvas } from "./renderer";
import { warpOverAt, type Artwork } from "./weave";

export type PatternComposition = "cutwork" | "ribbon" | "bias";
export interface PatternRenderOptions {
  width: number;
  height: number;
  dpr?: number;
  composition: PatternComposition;
  /** A finite graphic repeat of cut cloth, not a new interlacement repeat. */
  repeat: number;
  scale: number;
}
export type PatternCanvas = HTMLCanvasElement | OffscreenCanvas;
export type PatternCanvasFactory = (width: number, height: number) => PatternCanvas;
type Context = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type Role = "cobalt" | "vermilion" | "ochre" | "cotton";
type Trace = (ctx: Context) => void;

const roles: Role[] = ["cobalt", "vermilion", "ochre", "cotton"];
/** Fractions of all valid source-window starts, fixed on the original cloth. */
const anchors: Record<Role, { end: number; pick: number }> = {
  cobalt: { end: 0.2, pick: 2 / 3 },
  vermilion: { end: 0.8, pick: 1 / 3 },
  ochre: { end: 0.4, pick: 0 },
  cotton: { end: 0.6, pick: 0.5 },
};
const base = {
  desktop: { width: 1000, height: 620 },
  mobile: { width: 390, height: 590 },
};

function createCanvas(width: number, height: number): PatternCanvas {
  if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(width, height);
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }
  throw new Error("A Canvas factory is required outside the browser.");
}
function contextFor(canvas: PatternCanvas): Context {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw new Error("Canvas 2D is unavailable.");
  return context as Context;
}
/** A role always samples one physical region of this visitor's cloth. */
function sourceWindow(art: Artwork, role: Role) {
  // Long weft cuts retain eight continuous crossings; the narrow four-pick
  // height stays inside the default color bands instead of making stripes.
  const ends = Math.min(8, art.warp.length);
  const picks = Math.min(4, art.weft.length);
  return {
    end: Math.round(anchors[role].end * (art.warp.length - ends)),
    pick: Math.round(anchors[role].pick * (art.weft.length - picks)),
    ends,
    picks,
  };
}
function visibleColor(art: Artwork, window: ReturnType<typeof sourceWindow>) {
  const counts = new Map<string, number>();
  for (let pick = window.pick; pick < window.pick + window.picks; pick++) {
    for (let end = window.end; end < window.end + window.ends; end++) {
      const color = warpOverAt(art, end, pick)
        ? art.warp[end].color
        : art.weft[pick].color;
      counts.set(color, (counts.get(color) ?? 0) + 1);
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1])[0][0];
}

/** Only yarns, crossings and the seed affect the material. Arrangement edits reuse it. */
export function patternMaterialKey(art: Artwork) {
  return JSON.stringify([art.seed, art.warp, art.weft, art.pickStructures]);
}

interface MaterialEntry {
  swatches: Record<Role, PatternCanvas>;
  colors: Record<Role, string>;
  tiles: Map<string, PatternCanvas>;
}

/** Per-instance bounded cache. Keeps two real cloth versions for Previous/Current. */
export class PatternRenderCache {
  private materials = new Map<string, MaterialEntry>();
  materialRenders = 0;
  tileRenders = 0;

  constructor(private readonly factory: PatternCanvasFactory = createCanvas) {}

  get(art: Artwork): MaterialEntry {
    const key = patternMaterialKey(art);
    const existing = this.materials.get(key);
    if (existing) {
      this.materials.delete(key);
      this.materials.set(key, existing);
      return existing;
    }
    const colors = {} as Record<Role, string>;
    const swatches = {} as Record<Role, PatternCanvas>;
    for (const role of roles) {
      const window = sourceWindow(art, role);
      colors[role] = visibleColor(art, window);
      const width = window.ends * 40, height = window.picks * 40;
      const canvas = this.factory(width, height);
      renderCloth(canvas as ClothCanvas, art, {
        width,
        height,
        dpr: 1,
        face: "front",
        zoom: 40 / Math.min(width / art.warp.length, height / art.weft.length),
        focus: {
          end: window.end + (window.ends - 1) / 2,
          pick: window.pick + (window.picks - 1) / 2,
        },
      });
      swatches[role] = canvas;
      this.materialRenders++;
    }
    const entry = { swatches, colors, tiles: new Map<string, PatternCanvas>() };
    this.materials.set(key, entry);
    if (this.materials.size > 2) this.materials.delete(this.materials.keys().next().value!);
    return entry;
  }

  tile(art: Artwork, composition: PatternComposition, format: "mobile" | "desktop") {
    const material = this.get(art);
    const key = `${composition}:${format}`;
    const existing = material.tiles.get(key);
    if (existing) {
      material.tiles.delete(key);
      material.tiles.set(key, existing);
      return { canvas: existing, colors: material.colors };
    }
    const size = base[format], resolution = format === "mobile" ? 2 : 1.5;
    const canvas = this.factory(Math.round(size.width * resolution), Math.round(size.height * resolution));
    const ctx = contextFor(canvas);
    ctx.scale(resolution, resolution);
    paintComposition(ctx, material.swatches, format, composition);
    material.tiles.set(key, canvas);
    if (material.tiles.size > 4) material.tiles.delete(material.tiles.keys().next().value!);
    this.tileRenders++;
    return { canvas, colors: material.colors };
  }
}

function sourcePattern(ctx: Context, source: PatternCanvas, format: "mobile" | "desktop") {
  // Sample the original fibre surface directly. A tiny intermediate bitmap
  // discarded the filaments before the full-page material could be enlarged.
  const ratio = format === "mobile" ? 0.23125 : 0.26875;
  const pattern = ctx.createPattern(source, "repeat");
  if (!pattern) throw new Error("Canvas texture pattern is unavailable.");
  pattern.setTransform({ a: ratio, b: 0, c: 0, d: ratio, e: 0, f: 0 });
  return pattern;
}
function piece(ctx: Context, trace: Trace, pattern: CanvasPattern, depth = 1, light = 0) {
  ctx.save();
  ctx.beginPath();
  trace(ctx);
  ctx.closePath();
  ctx.shadowColor = `rgba(15, 9, 17, ${Math.min(0.54, depth * 0.31)})`;
  ctx.shadowBlur = 8 * depth;
  ctx.shadowOffsetX = 2.5 * depth;
  ctx.shadowOffsetY = 6 * depth;
  ctx.fillStyle = pattern;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.clip();
  // Raking light makes the stack legible, while the fiber texture remains real.
  const bounds = ctx.canvas;
  const glaze = ctx.createLinearGradient(0, 0, bounds.width / 1.5, bounds.height / 1.5);
  glaze.addColorStop(0, `rgba(255,247,225,${0.075 + light})`);
  glaze.addColorStop(0.56, "rgba(255,247,225,0)");
  glaze.addColorStop(1, `rgba(11,6,15,${0.13 + depth * 0.02})`);
  ctx.fillStyle = glaze;
  ctx.fillRect(0, 0, bounds.width, bounds.height);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  trace(ctx);
  ctx.closePath();
  ctx.strokeStyle = "rgba(245,229,197,.36)";
  ctx.lineWidth = 0.85;
  ctx.stroke();
  ctx.restore();
}

function paintComposition(
  ctx: Context,
  swatches: Record<Role, PatternCanvas>,
  format: "mobile" | "desktop",
  composition: PatternComposition,
) {
  const width = base[format].width, height = base[format].height;
  const brushes = {} as Record<Role, CanvasPattern>;
  for (const role of roles) brushes[role] = sourcePattern(ctx, swatches[role], format);
  ctx.fillStyle = brushes.cobalt;
  ctx.fillRect(0, 0, width, height);
  // A leftward falloff is the shadow of overlapping cloth, not an independent color field.
  const ground = ctx.createLinearGradient(0, 0, width * 0.62, height * 0.35);
  ground.addColorStop(0, "rgba(26,9,16,.78)");
  ground.addColorStop(0.43, "rgba(25,12,21,.42)");
  ground.addColorStop(1, "rgba(20,17,31,0)");
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, width, height);
  if (composition === "cutwork") {
    if (format === "desktop") desktopCutwork(ctx, brushes);
    else mobileCutwork(ctx, brushes);
  } else if (composition === "ribbon") {
    if (format === "desktop") desktopRibbon(ctx, brushes);
    else mobileRibbon(ctx, brushes);
  } else if (format === "desktop") desktopBias(ctx, brushes);
  else mobileBias(ctx, brushes);
}

function desktopCutwork(ctx: Context, b: Record<Role, CanvasPattern>) {
  piece(ctx, (c) => { c.moveTo(0, 395); c.bezierCurveTo(150, 345, 285, 275, 421, 379); c.bezierCurveTo(535, 468, 566, 569, 742, 620); c.lineTo(0, 620); }, b.ochre, 0.35);
  piece(ctx, (c) => { c.moveTo(384, 135); c.bezierCurveTo(604, 50, 750, 123, 1000, 368); c.lineTo(1000, 514); c.bezierCurveTo(800, 340, 687, 226, 576, 239); c.bezierCurveTo(526, 256, 583, 439, 701, 620); c.lineTo(482, 620); c.bezierCurveTo(366, 432, 332, 244, 384, 135); }, b.vermilion, 0.7);
  piece(ctx, (c) => { c.moveTo(215, 68); c.bezierCurveTo(383, 27, 496, 91, 540, 254); c.bezierCurveTo(593, 436, 476, 489, 350, 503); c.bezierCurveTo(266, 442, 206, 365, 192, 254); c.bezierCurveTo(179, 151, 186, 96, 215, 68); }, b.cotton, 1.4, 0.07);
  piece(ctx, (c) => { c.moveTo(716, 235); c.quadraticCurveTo(806, 200, 905, 257); c.lineTo(1000, 438); c.lineTo(895, 556); c.lineTo(716, 235); }, b.cobalt, 1.7);
  piece(ctx, (c) => { c.moveTo(920, 209); c.lineTo(1000, 183); c.lineTo(1000, 327); c.quadraticCurveTo(962, 265, 920, 209); }, b.cotton, 1.9);
}
function mobileCutwork(ctx: Context, b: Record<Role, CanvasPattern>) {
  piece(ctx, (c) => { c.moveTo(0, 385); c.quadraticCurveTo(83, 318, 125, 394); c.bezierCurveTo(174, 476, 209, 554, 287, 590); c.lineTo(0, 590); }, b.ochre, 0.4);
  piece(ctx, (c) => { c.moveTo(146, 93); c.bezierCurveTo(243, 85, 342, 151, 390, 292); c.lineTo(390, 590); c.lineTo(284, 590); c.bezierCurveTo(230, 489, 242, 356, 192, 228); c.quadraticCurveTo(172, 175, 146, 93); }, b.vermilion, 0.7);
  piece(ctx, (c) => { c.moveTo(91, 55); c.bezierCurveTo(156, 24, 190, 74, 208, 157); c.bezierCurveTo(243, 312, 226, 386, 145, 453); c.bezierCurveTo(101, 374, 77, 292, 76, 189); c.quadraticCurveTo(72, 89, 91, 55); }, b.cotton, 1.4, 0.05);
  piece(ctx, (c) => { c.moveTo(278, 249); c.quadraticCurveTo(310, 204, 351, 222); c.lineTo(390, 387); c.lineTo(343, 541); c.lineTo(278, 249); }, b.cobalt, 1.8);
  piece(ctx, (c) => { c.moveTo(337, 210); c.lineTo(390, 166); c.lineTo(390, 311); c.quadraticCurveTo(367, 243, 337, 210); }, b.cotton, 2);
}
function desktopRibbon(ctx: Context, b: Record<Role, CanvasPattern>) {
  piece(ctx, (c) => { c.moveTo(0, 0); c.lineTo(490, 0); c.bezierCurveTo(210, 166, 345, 327, 0, 454); }, b.cotton, 0.8);
  piece(ctx, (c) => { c.moveTo(0, 381); c.bezierCurveTo(238, 284, 421, 113, 682, 157); c.bezierCurveTo(813, 180, 901, 304, 1000, 486); c.lineTo(1000, 620); c.bezierCurveTo(835, 362, 698, 330, 550, 350); c.bezierCurveTo(365, 377, 271, 561, 93, 620); c.lineTo(0, 620); }, b.vermilion, 1.1);
  piece(ctx, (c) => { c.moveTo(0, 515); c.bezierCurveTo(148, 465, 288, 364, 389, 365); c.bezierCurveTo(289, 468, 183, 585, 82, 620); c.lineTo(0, 620); }, b.ochre, 1.45);
  piece(ctx, (c) => { c.moveTo(603, 0); c.lineTo(1000, 0); c.lineTo(1000, 199); c.bezierCurveTo(850, 78, 734, 45, 603, 0); }, b.ochre, 1.4);
}
function mobileRibbon(ctx: Context, b: Record<Role, CanvasPattern>) {
  piece(ctx, (c) => { c.moveTo(0, 0); c.lineTo(213, 0); c.bezierCurveTo(52, 154, 164, 266, 0, 352); }, b.cotton, 0.8);
  piece(ctx, (c) => { c.moveTo(0, 325); c.bezierCurveTo(121, 242, 181, 83, 300, 58); c.quadraticCurveTo(359, 56, 390, 93); c.lineTo(390, 261); c.bezierCurveTo(310, 178, 248, 247, 207, 349); c.bezierCurveTo(166, 456, 95, 550, 0, 590); }, b.vermilion, 1.1);
  piece(ctx, (c) => { c.moveTo(284, 229); c.bezierCurveTo(339, 221, 373, 284, 390, 334); c.lineTo(390, 590); c.lineTo(327, 590); c.bezierCurveTo(329, 423, 312, 321, 284, 229); }, b.ochre, 1.6);
}
function desktopBias(ctx: Context, b: Record<Role, CanvasPattern>) {
  piece(ctx, (c) => { c.moveTo(172, 0); c.lineTo(515, 0); c.lineTo(0, 563); c.lineTo(0, 249); }, b.cotton, 0.8);
  piece(ctx, (c) => { c.moveTo(572, 0); c.lineTo(800, 0); c.lineTo(235, 620); c.lineTo(9, 620); }, b.vermilion, 1);
  piece(ctx, (c) => { c.moveTo(852, 0); c.lineTo(1000, 0); c.lineTo(1000, 237); c.lineTo(655, 620); c.lineTo(440, 620); }, b.ochre, 1.4);
  piece(ctx, (c) => { c.moveTo(1000, 343); c.lineTo(1000, 620); c.lineTo(752, 620); }, b.cotton, 1.7);
}
function mobileBias(ctx: Context, b: Record<Role, CanvasPattern>) {
  piece(ctx, (c) => { c.moveTo(67, 0); c.lineTo(241, 0); c.lineTo(0, 374); c.lineTo(0, 148); }, b.cotton, 0.9);
  piece(ctx, (c) => { c.moveTo(268, 0); c.lineTo(390, 0); c.lineTo(390, 124); c.lineTo(56, 590); c.lineTo(0, 590); c.lineTo(0, 455); }, b.vermilion, 1.1);
  piece(ctx, (c) => { c.moveTo(390, 221); c.lineTo(390, 454); c.lineTo(270, 590); c.lineTo(110, 590); }, b.ochre, 1.5);
  piece(ctx, (c) => { c.moveTo(390, 499); c.lineTo(390, 590); c.lineTo(323, 590); }, b.cotton, 1.8);
}

function paintUnwoven(ctx: Context, art: Artwork, width: number, height: number) {
  ctx.fillStyle = "#211725";
  ctx.fillRect(0, 0, width, height);
  const count = Math.min(art.warp.length, 80);
  for (let i = 0; i < count; i++) {
    const thread = art.warp[Math.floor((i / count) * art.warp.length)];
    const x = ((i + 0.5) / count) * width;
    const stroke = ctx.createLinearGradient(x - 4, 0, x + 4, 0);
    stroke.addColorStop(0, "rgba(0,0,0,.45)");
    stroke.addColorStop(0.44, thread.color);
    stroke.addColorStop(0.6, thread.color);
    stroke.addColorStop(1, "rgba(0,0,0,.6)");
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(1.4, (width / count) * thread.thickness * 0.67);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

/** One final blit per finite cutting; structure/color edits alone rebuild yarn sources. */
export function renderPatternRoom(
  canvas: PatternCanvas,
  art: Artwork,
  options: PatternRenderOptions,
  cache = new PatternRenderCache(),
) {
  const width = Math.max(1, options.width), height = Math.max(1, options.height);
  const dpr = Math.min(options.dpr ?? 1, 1.75, Math.sqrt(3_000_000 / (width * height)));
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  const ctx = contextFor(canvas);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (!art.weft.length) {
    paintUnwoven(ctx, art, width, height);
    return { pixelWidth: canvas.width, pixelHeight: canvas.height, materialRenders: cache.materialRenders, tileRenders: cache.tileRenders, colors: null };
  }
  const format = width / height < 1.1 ? "mobile" : "desktop";
  const { canvas: tile, colors } = cache.tile(art, options.composition, format);
  const repeat = Math.max(1, Math.min(4, Math.round(options.repeat)));
  const scale = Math.max(0.75, Math.min(1.75, options.scale));
  // Crop the composed sheet to the viewport; never stretch its yarn geometry.
  const fit = Math.max(width / tile.width, height / tile.height) * scale / repeat;
  const tileWidth = tile.width * fit;
  const tileHeight = tile.height * fit;
  const startX = (width - tileWidth * repeat) / 2;
  const startY = (height - tileHeight * repeat) / 2;
  ctx.fillStyle = "#211725";
  ctx.fillRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const x0 = Math.floor(-startX / tileWidth), x1 = Math.ceil((width - startX) / tileWidth);
  const y0 = Math.floor(-startY / tileHeight), y1 = Math.ceil((height - startY) / tileHeight);
  for (let row = y0; row < y1; row++) {
    for (let column = x0; column < x1; column++) {
      const x = startX + column * tileWidth, y = startY + row * tileHeight;
      ctx.drawImage(tile, x, y, tileWidth + 0.3, tileHeight + 0.3);
      if (repeat > 1) {
        ctx.strokeStyle = "rgba(20,10,22,.30)";
        ctx.lineWidth = 0.7;
        ctx.strokeRect(x + 0.35, y + 0.35, tileWidth - 0.7, tileHeight - 0.7);
      }
    }
  }
  return { pixelWidth: canvas.width, pixelHeight: canvas.height, materialRenders: cache.materialRenders, tileRenders: cache.tileRenders, colors };
}

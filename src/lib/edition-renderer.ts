import { renderCloth, type ClothCanvas } from "./renderer";
import { clothDescription, warpOverAt, type Artwork } from "./weave";
import { EDITION_BACKGROUNDS, EDITION_FORMATS, parseEditionSettings, type EditionSettings } from "./edition-settings";

type Context = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
export type EditionCanvasFactory = (width: number, height: number) => ClothCanvas;
type Font = "EditionDisplay" | "EditionUI" | "EditionCaption";
type Box = { x: number; y: number; w: number; h: number };
type Node =
  | (Box & { kind: "rect"; color: string })
  | { kind: "line"; x: number; y: number; x2: number; y2: number; color: string }
  | { kind: "text"; x: number; y: number; w: number; text: string; font: Font; size: number; color: string; lines?: number }
  | (Box & { kind: "cloth"; zoom: number; cropX: number; cropY: number; clip?: string })
  | (Box & { kind: "diagram"; focus: { end: number; pick: number } });
export interface EditionScene { width: number; height: number; settings: EditionSettings; nodes: Node[] }

export function materialViewport(art: Artwork, box: Pick<Box, "w" | "h">, zoom: number, cropX: number, cropY: number) {
  const pitch = Math.max(box.w / art.warp.length, box.h / Math.max(1, art.weft.length)) * zoom;
  const ends = box.w / pitch, picks = box.h / pitch;
  const focus = { end: (art.warp.length - ends) * cropX + ends / 2 - .5, pick: (art.weft.length - picks) * cropY + picks / 2 - .5 };
  const base = Math.min(box.w / art.warp.length, box.h / Math.max(1, art.weft.length));
  return { focus, zoom: pitch / base };
}

/** Same physical window on either face: reverse displays ends in reverse order and complements each crossing. */
export function editionCrossings(art: Artwork, focus: { end: number; pick: number }, face: EditionSettings["face"]) {
  const columns = Math.min(6, art.warp.length), rows = Math.min(6, art.weft.length);
  const end0 = Math.max(0, Math.min(art.warp.length - columns, Math.round(focus.end) - Math.floor(columns / 2)));
  const pick0 = Math.max(0, Math.min(art.weft.length - rows, Math.round(focus.pick) - Math.floor(rows / 2)));
  return Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => {
    const end = end0 + (face === "front" ? column : columns - 1 - column);
    const pick = pick0 + rows - 1 - row;
    const front = warpOverAt(art, end, pick);
    return { end, pick, warpAbove: face === "front" ? front : !front, warp: art.warp[end], weft: art.weft[pick] };
  }));
}

/** Layout is expressed once in print coordinates, used by Canvas and self-contained SVG. */
export function createEditionScene(art: Artwork): EditionScene {
  const s = parseEditionSettings(art.edition), format = EDITION_FORMATS[s.format];
  const w = 800, h = w * format.height / format.width;
  const bg = EDITION_BACKGROUNDS[s.background];
  const nodes: Node[] = [{ kind: "rect", x: 0, y: 0, w, h, color: bg.color }];
  const text = (value: string, x: number, y: number, width: number, size: number, font: Font = "EditionDisplay", lines = 2, color = bg.ink) => nodes.push({ kind: "text", text: value, x, y, w: width, size, font, lines, color });
  const cloth = (box: Box, zoom: number, cropX = s.cropX, cropY = s.cropY, clip?: string) => nodes.push({ kind: "cloth", ...box, zoom, cropX, cropY, clip });
  const credit = s.credit.trim() ? "BY " + s.credit.trim() : "A TEXTILE BY YOU";
  const landscape = s.format === "landscape";
  if (s.layout === "full-bleed") {
    cloth({ x: 0, y: 0, w, h }, s.scale);
    nodes.push({ kind: "rect", x: 25, y: h - 78, w: w - 50, h: 54, color: bg.color });
    if (s.title.trim()) text(s.title.trim(), 43, h - 42, w * .63, 26, "EditionDisplay", 1);
    text(credit, s.title.trim() ? w * .72 : 43, h - 43, s.title.trim() ? w * .23 : w - 86, 12, "EditionCaption", 1);
  } else if (s.layout === "material-study") {
    text(s.title.trim() || "Material study.", 44, 91, w - 88, landscape ? 57 : 66, "EditionDisplay", 1);
    text("A CLOSER READING / " + s.face.toUpperCase(), 46, landscape ? 123 : 138, w - 92, 11, "EditionCaption", 1);
    const macro = landscape ? { x: 44, y: 158, w: 454, h: 315 } : { x: 44, y: h * .19, w: w - 88, h: h * .43 };
    cloth(macro, 2.7 * s.scale);
    const focus = materialViewport(art, macro, 2.7 * s.scale, s.cropX, s.cropY).focus;
    const size = landscape ? 178 : Math.min(208, h * .17);
    const diagram = { x: landscape ? 561 : 44, y: landscape ? 260 : h * .7, w: size, h: size };
    nodes.push({ kind: "diagram", ...diagram, focus });
    const tx = landscape ? 545 : 304, ty = landscape ? 190 : h * .71;
    text(clothDescription(art), tx, ty, landscape ? 218 : 450, 27);
    text("Warp & weft", tx, ty + 36, 350, 19);
    if (!landscape) {
      text(art.warp.length + " warp ends. " + art.weft.length + " woven picks.", tx, ty + 68, 444, 13, "EditionUI");
      text("A window into the actual interlacement, shown from the " + s.face + ".", tx, ty + 104, 410, 13, "EditionUI", 3);
    }
    text("SIMPLIFIED CROSSING DIAGRAM", diagram.x, diagram.y + diagram.h + 23, landscape ? 205 : 248, 9, "EditionCaption", 1);
    nodes.push({ kind: "line", x: 44, y: h - 63, x2: w - 44, y2: h - 63, color: bg.ink });
    text(credit, 44, h - 35, w - 88, 11, "EditionCaption", 1);
  } else {
    const composition = art.arrangement.composition;
    const firstClip = composition === "bias" ? "M0 0H790L1000 680L250 1000H0Z" : composition === "ribbon" ? "M0 0H1000V260C300 340 960 700 320 1000H0C700 510 150 400 0 0Z" : "M80 50C520 -30 900 90 1000 420L820 1000C450 1020 40 760 0 410Z";
    const secondClip = composition === "bias" ? "M0 0H470L1000 1000H520Z" : "M0 60C430 -120 630 50 1000 210L1000 1000C450 590 830 300 0 60Z";
    const region = landscape ? { x: 22, y: 32, w: 470, h: h - 70 } : { x: 25, y: 30, w: w - 115, h: h * .63 };
    cloth(region, 1.12 * s.scale * art.arrangement.scale, s.cropX, s.cropY, firstClip);
    cloth(landscape ? { x: 200, y: 42, w: 335, h: h - 54 } : { x: w * .44, y: h * .12, w: w * .52, h: h * .53 }, 1.7 * s.scale, Math.min(1, s.cropX + .24), Math.max(0, s.cropY - .25), secondClip);
    // The Pattern Room repeat becomes a finite sequence of cut cloth slips.
    for (let i = 1; i < art.arrangement.repeat; i++) cloth({ x: 24 + i * 70, y: landscape ? h - 90 : h * .59, w: 110, h: 65 }, 2.1 * s.scale, i / 4, s.cropY);
    const x = landscape ? 520 : 44, y = landscape ? 255 : h * .77;
    text(s.title.trim() || "THE WRONG SIDE.", x, y, landscape ? 244 : w - 88, landscape ? 68 : 99, "EditionDisplay", 2);
    text(credit, x, landscape ? h - 56 : h - 46, landscape ? 245 : w - 88, 11, "EditionCaption", 1);
  }
  return { width: w, height: h, settings: s, nodes };
}

export function browserCanvas(width: number, height: number): ClothCanvas {
  if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(width, height);
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height; return canvas;
}
function ctxFor(canvas: ClothCanvas): Context {
  const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas 2D is unavailable."); return ctx;
}
function makeMaterial(art: Artwork, node: Extract<Node, { kind: "cloth" }>, scale: number, factory: EditionCanvasFactory) {
  const width = Math.max(1, Math.round(node.w * scale)), height = Math.max(1, Math.round(node.h * scale));
  const canvas = factory(width, height), viewport = materialViewport(art, node, node.zoom, node.cropX, node.cropY);
  renderCloth(canvas, art, { width, height, dpr: 1, zoom: viewport.zoom, face: art.edition.face, bottomUp: true, focus: viewport.focus, pixelBudget: 12_000_000 });
  return canvas;
}

/** Bounded live-preview cache. Type and paper edits reuse the unchanged yarn surfaces. */
export class EditionRenderCache {
  private source?: { warp: Artwork["warp"]; weft: Artwork["weft"]; picks: Artwork["pickStructures"]; seed: number };
  private entries = new Map<string, ClothCanvas>();
  materialRenders = 0;
  material(art: Artwork, node: Extract<Node, { kind: "cloth" }>, scale: number, factory: EditionCanvasFactory) {
    if (!this.source || this.source.warp !== art.warp || this.source.weft !== art.weft || this.source.picks !== art.pickStructures || this.source.seed !== art.seed) {
      this.entries.clear(); this.source = { warp: art.warp, weft: art.weft, picks: art.pickStructures, seed: art.seed };
    }
    const key = JSON.stringify([node.w, node.h, node.zoom, node.cropX, node.cropY, scale, art.edition.face]);
    const cached = this.entries.get(key); if (cached) return cached;
    const canvas = makeMaterial(art, node, scale, factory); this.materialRenders++;
    this.entries.set(key, canvas);
    let pixels = [...this.entries.values()].reduce((sum, item) => sum + item.width * item.height, 0);
    while (this.entries.size > 4 || pixels > 3_000_000) {
      const oldest = this.entries.keys().next().value;
      if (!oldest) break;
      const old = this.entries.get(oldest)!; pixels -= old.width * old.height; this.entries.delete(oldest);
    }
    return canvas;
  }
}

function wrappedText(ctx: Context, node: Extract<Node, { kind: "text" }>) {
  let size = node.size, lines: string[] = [];
  for (; size >= 9; size -= 1) {
    ctx.font = size + "px " + node.font; lines = [];
    for (const word of node.text.split(/\s+/)) {
      const previous = lines.at(-1);
      if (previous && ctx.measureText(previous + " " + word).width <= node.w) lines[lines.length - 1] += " " + word;
      else lines.push(word);
    }
    if (lines.length <= (node.lines ?? 2) && lines.every((line) => ctx.measureText(line).width <= node.w)) break;
  }
  return { size, lines };
}

function diagramPrimitives(art: Artwork, node: Extract<Node, { kind: "diagram" }>, face: EditionSettings["face"]) {
  const grid = editionCrossings(art, node.focus, face);
  const cells = grid.flat();
  const columns = grid[0]?.length ?? 0, rows = grid.length;
  const pitch = Math.min(node.w / Math.max(1, columns), node.h / Math.max(1, rows));
  const x0 = node.x + (node.w - columns * pitch) / 2, y0 = node.y + (node.h - rows * pitch) / 2;
  const lines: { x: number; y: number; x2: number; y2: number; color: string; width: number; opacity: number }[] = [];
  grid[0]?.forEach((cell, col) => lines.push({ x: x0 + (col + .5) * pitch, y: y0, x2: x0 + (col + .5) * pitch, y2: y0 + rows * pitch, color: cell.warp.color, width: pitch * cell.warp.thickness * .55, opacity: .55 }));
  grid.forEach((row, r) => lines.push({ x: x0, y: y0 + (r + .5) * pitch, x2: x0 + columns * pitch, y2: y0 + (r + .5) * pitch, color: row[0].weft.color, width: pitch * row[0].weft.thickness * .55, opacity: .55 }));
  cells.forEach((cell, i) => {
    const row = Math.floor(i / grid[0].length), col = i % grid[0].length;
    const x = x0 + (col + .5) * pitch, y = y0 + (row + .5) * pitch;
    lines.push({ x: x - (cell.warpAbove ? 0 : pitch * .43), y: y - (cell.warpAbove ? pitch * .43 : 0), x2: x + (cell.warpAbove ? 0 : pitch * .43), y2: y + (cell.warpAbove ? pitch * .43 : 0), color: cell.warpAbove ? cell.warp.color : cell.weft.color, width: pitch * (cell.warpAbove ? cell.warp.thickness : cell.weft.thickness) * .58, opacity: 1 });
  });
  return lines;
}

export function renderEdition(canvas: ClothCanvas, art: Artwork, width: number, factory: EditionCanvasFactory = browserCanvas, cache?: EditionRenderCache) {
  const scene = createEditionScene(art), scale = width / scene.width;
  canvas.width = Math.round(width); canvas.height = Math.round(scene.height * scale);
  const ctx = ctxFor(canvas); ctx.setTransform(scale, 0, 0, scale, 0, 0);
  for (const n of scene.nodes) {
    if (n.kind === "rect") { ctx.fillStyle = n.color; ctx.fillRect(n.x, n.y, n.w, n.h); }
    else if (n.kind === "line") { ctx.strokeStyle = n.color; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(n.x2, n.y2); ctx.stroke(); }
    else if (n.kind === "text") { const t = wrappedText(ctx, n); ctx.fillStyle = n.color; ctx.font = t.size + "px " + n.font; t.lines.forEach((line, i) => ctx.fillText(line, n.x, n.y + i * t.size * 1.04)); }
    else if (n.kind === "cloth") {
      const material = cache ? cache.material(art, n, scale, factory) : makeMaterial(art, n, scale, factory); ctx.save(); ctx.translate(n.x, n.y);
      if (n.clip) { ctx.scale(n.w / 1000, n.h / 1000); ctx.clip(new Path2D(n.clip)); ctx.drawImage(material, 0, 0, 1000, 1000); }
      else ctx.drawImage(material, 0, 0, n.w, n.h);
      ctx.restore();
      if (!cache) { material.width = 1; material.height = 1; }
    } else {
      for (const line of diagramPrimitives(art, n, scene.settings.face)) { ctx.beginPath(); ctx.moveTo(line.x, line.y); ctx.lineTo(line.x2, line.y2); ctx.strokeStyle = line.color; ctx.lineWidth = line.width; ctx.globalAlpha = line.opacity; ctx.lineCap = "round"; ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
  }
  return scene;
}

const escapeXml = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
/** Hybrid SVG: true vector typography/diagram/clip paths, embedded procedural yarn surfaces. */
export function renderEditionSvg(art: Artwork, factory: EditionCanvasFactory, imageDataUrl: (canvas: ClothCanvas) => string) {
  const scene = createEditionScene(art), output = EDITION_FORMATS[scene.settings.format];
  const ctx = ctxFor(factory(2, 2)), scale = output.width / scene.width;
  const pieces: string[] = [];
  scene.nodes.forEach((n, index) => {
    if (n.kind === "rect") pieces.push('<rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" fill="' + n.color + '"/>');
    else if (n.kind === "line") pieces.push('<path d="M' + n.x + ' ' + n.y + 'L' + n.x2 + ' ' + n.y2 + '" stroke="' + n.color + '" stroke-width=".7"/>');
    else if (n.kind === "text") { const t = wrappedText(ctx, n); t.lines.forEach((line, i) => pieces.push('<text x="' + n.x + '" y="' + (n.y + i * t.size * 1.04) + '" font-family="' + n.font + '" font-size="' + t.size + '" fill="' + n.color + '">' + escapeXml(line) + '</text>')); }
    else if (n.kind === "cloth") {
      const material = makeMaterial(art, n, scale, factory);
      if (n.clip) pieces.push('<defs><clipPath id="cut' + index + '"><path d="' + n.clip + '" transform="translate(' + n.x + ' ' + n.y + ') scale(' + n.w / 1000 + ' ' + n.h / 1000 + ')"/></clipPath></defs>');
      pieces.push('<image x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" preserveAspectRatio="none" href="' + imageDataUrl(material) + '"' + (n.clip ? ' clip-path="url(#cut' + index + ')"' : '') + '/>');
      material.width = 1; material.height = 1;
    } else for (const line of diagramPrimitives(art, n, scene.settings.face)) pieces.push('<path d="M' + line.x + ' ' + line.y + 'L' + line.x2 + ' ' + line.y2 + '" stroke="' + line.color + '" stroke-width="' + line.width + '" opacity="' + line.opacity + '" stroke-linecap="round"/>');
  });
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + output.width + '" height="' + output.height + '" viewBox="0 0 ' + scene.width + ' ' + scene.height + '"><title>' + escapeXml(scene.settings.title || "A textile edition by you") + '</title><desc>Original visitor textile. Yarn textures are embedded raster images; type, cuts and the simplified crossing diagram are vector. ' + escapeXml(clothDescription(art)) + ', ' + scene.settings.face + ' face.</desc>' + pieces.join("") + '</svg>';
}

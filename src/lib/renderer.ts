import { warpOverAt, type Artwork, type Face, type Thread } from "./weave";

export interface RenderOptions {
  width: number;
  height: number;
  dpr?: number;
  zoom: number;
  face: Face;
  fit?: "contain" | "stretch";
  bottomUp?: boolean;
  transparent?: boolean;
}
export type ClothCanvas = HTMLCanvasElement | OffscreenCanvas;
const noise = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
function tint(hex: string, factor: number) {
  const channels = [1, 3, 5].map((offset) =>
    parseInt(hex.slice(offset, offset + 2), 16),
  );
  return `rgb(${channels.map((v) => Math.round(factor >= 0 ? v + (255 - v) * factor : v * (1 + factor))).join(",")})`;
}

/** Bounded, event-driven Canvas 2D renderer. No animation loop or GPU dependencies. */
export function renderCloth(
  canvas: ClothCanvas,
  art: Artwork,
  options: RenderOptions,
) {
  const { width, height, zoom, face } = options;
  // Cap backing resolution by both DPR and area (about 16 MB RGBA maximum).
  const dpr = Math.min(
    options.dpr ?? 1,
    2,
    Math.sqrt(4_000_000 / (width * height)),
  );
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) throw new Error("Canvas 2D is unavailable.");
  const ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D =
    context;
  ctx.scale(dpr, dpr);
  if (!options.transparent) {
    ctx.fillStyle = "#282219";
    ctx.fillRect(0, 0, width, height);
  }
  if (!art.weft.length)
    return { draws: 0, pixelWidth: canvas.width, pixelHeight: canvas.height };
  const pitch =
    Math.min(width / art.warp.length, height / art.weft.length) * zoom;
  const offsetX = (width - pitch * art.warp.length) / 2;
  const offsetY = (height - pitch * art.weft.length) / 2;
  // Mirror the SAME physical geometry. Only the exposed yarn ordering changes.
  if (face === "reverse") {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }
  if (options.bottomUp) {
    ctx.translate(0, height);
    ctx.scale(1, -1);
  }
  if (options.fit === "stretch") {
    ctx.scale(
      width / (pitch * art.warp.length),
      height / (pitch * art.weft.length),
    );
    ctx.translate(-offsetX, -offsetY);
  }
  ctx.translate(offsetX, offsetY);
  const bounds = {
    x0: -offsetX,
    x1: width - offsetX,
    y0: -offsetY,
    y1: height - offsetY,
  };
  const quality = pitch < 14 ? 4 : pitch < 25 ? 9 : 18;
  let draws = 0;

  function yarn(
    axis: "warp" | "weft",
    index: number,
    start: number,
    end: number,
    thread: Thread,
    raised: boolean,
  ) {
    const vertical = axis === "warp";
    const center = (index + 0.5) * pitch;
    const lo = (start + 0.5) * pitch,
      hi = (end + 0.5) * pitch;
    const breadth = pitch * thread.thickness;
    const across0 = vertical ? bounds.x0 : bounds.y0,
      across1 = vertical ? bounds.x1 : bounds.y1;
    const along0 = vertical ? bounds.y0 : bounds.x0,
      along1 = vertical ? bounds.y1 : bounds.x1;
    if (
      center + breadth < across0 ||
      center - breadth > across1 ||
      hi < along0 ||
      lo > along1
    )
      return;
    draws++;
    const key = art.seed + index * 31 + (vertical ? 1009 : 2003);
    const a = Math.max(lo, along0 - pitch),
      b = Math.min(hi, along1 + pitch);
    const steps = Math.max(4, Math.ceil((b - a) / (pitch / 5)));
    const points: { t: number; c: number; r: number }[] = [];
    for (let s = 0; s <= steps; s++) {
      const t = a + ((b - a) * s) / steps;
      const crimp = Math.sin((t / pitch) * Math.PI * 2 + key) * breadth * 0.026;
      const irregularity =
        Math.sin((t / pitch) * 2.7 + key) * 0.025 +
        Math.sin((t / pitch) * 9.1 + key) * 0.013;
      const edge = Math.min(
        1,
        Math.max(0, Math.min(t - lo, hi - t) / (pitch * 0.42)),
      );
      const tip = raised ? 0.78 + 0.22 * Math.sin((edge * Math.PI) / 2) : 1;
      points.push({
        t,
        c: center + crimp,
        r: breadth * (0.5 + irregularity) * tip,
      });
    }
    const xy = (t: number, c: number) => (vertical ? [c, t] : [t, c]);
    const outline = new Path2D();
    const edgePath = (
      edgePoints: typeof points,
      sign: number,
      move: boolean,
    ) => {
      const first = edgePoints[0];
      const [x, y] = xy(first.t, first.c + sign * first.r);
      if (move) outline.moveTo(x, y);
      else outline.lineTo(x, y);
      for (let i = 1; i < edgePoints.length - 1; i++) {
        const p = edgePoints[i],
          next = edgePoints[i + 1];
        const [cx, cy] = xy(p.t, p.c + sign * p.r);
        const [mx, my] = xy(
          (p.t + next.t) / 2,
          (p.c + sign * p.r + next.c + sign * next.r) / 2,
        );
        outline.quadraticCurveTo(cx, cy, mx, my);
      }
      const last = edgePoints[edgePoints.length - 1];
      const [lx, ly] = xy(last.t, last.c + sign * last.r);
      outline.lineTo(lx, ly);
    };
    edgePath(points, -1, true);
    const last = points[points.length - 1];
    // Rounded end caps at float boundaries; necks remain occluded at under-crossings.
    let [x, y] = xy(last.t + breadth * 0.2, last.c),
      [ex, ey] = xy(last.t, last.c + last.r);
    outline.quadraticCurveTo(x, y, ex, ey);
    edgePath([...points].reverse(), 1, false);
    [x, y] = xy(points[0].t - breadth * 0.2, points[0].c);
    [ex, ey] = xy(points[0].t, points[0].c - points[0].r);
    outline.quadraticCurveTo(x, y, ex, ey);
    outline.closePath();
    if (raised) {
      // A narrow cast shadow defines the actual overlap; avoids costly per-yarn blur filters.
      ctx.save();
      ctx.translate(breadth * 0.09, breadth * 0.12);
      ctx.fillStyle = "rgba(12,8,4,.42)";
      ctx.fill(outline);
      ctx.restore();
    }
    const gradient = vertical
      ? ctx.createLinearGradient(
          center - breadth / 2,
          0,
          center + breadth / 2,
          0,
        )
      : ctx.createLinearGradient(
          0,
          center - breadth / 2,
          0,
          center + breadth / 2,
        );
    gradient.addColorStop(0, tint(thread.color, -0.32));
    gradient.addColorStop(0.23, tint(thread.color, raised ? 0.08 : -0.18));
    gradient.addColorStop(0.43, tint(thread.color, raised ? 0.16 : -0.04));
    gradient.addColorStop(0.66, tint(thread.color, raised ? 0.015 : -0.25));
    gradient.addColorStop(1, tint(thread.color, -0.37));
    ctx.fillStyle = gradient;
    ctx.fill(outline);
    ctx.save();
    ctx.clip(outline);
    // Twisted fine filaments run ALONG yarns, not a screen-space noise overlay.
    const lightFibers = new Path2D(),
      darkFibers = new Path2D();
    for (let f = 0; f < quality; f++) {
      const phase = noise(key + f * 17) * Math.PI * 2;
      const fibers = f % 3 === 0 ? lightFibers : darkFibers;
      points.forEach((p, i) => {
        const drift =
          Math.sin(p.t / (pitch * 0.55) + phase) * breadth * 0.034 +
          Math.sin((p.t / pitch) * 8 + phase) * breadth * 0.012;
        const c = p.c + ((f + 0.5) / quality - 0.5) * breadth * 0.86 + drift;
        const [x, y] = xy(p.t, c);
        if (!i) fibers.moveTo(x, y);
        else fibers.lineTo(x, y);
      });
    }
    ctx.lineWidth = Math.max(0.28, breadth * 0.012);
    ctx.strokeStyle = "rgba(255,244,220,.28)";
    ctx.stroke(lightFibers);
    ctx.strokeStyle = "rgba(14,10,7,.21)";
    ctx.stroke(darkFibers);
    if (pitch > 18) {
      // Small irregular fiber dashes soften the cylinder without obscuring the crossing.
      ctx.beginPath();
      for (let j = Math.floor(a / 5); j < b / 5; j++) {
        const rnd = noise(key * 13 + j * 7);
        const t = (j + rnd) * 5,
          c = center + (rnd - 0.5) * breadth * 0.92;
        const [x, y] = xy(t, c),
          [x2, y2] = xy(t + pitch * (0.08 + rnd * 0.21), c + breadth * 0.014);
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
      }
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = "rgba(255,240,211,.13)";
      ctx.stroke();
    }
    if (raised) {
      // Contact darkening where each float bends into the fabric.
      const g = vertical
        ? ctx.createLinearGradient(0, lo, 0, hi)
        : ctx.createLinearGradient(lo, 0, hi, 0);
      const shoulder = Math.min(0.24, (pitch * 0.34) / (hi - lo));
      g.addColorStop(0, "rgba(12,8,3,.38)");
      g.addColorStop(shoulder, "rgba(12,8,3,0)");
      g.addColorStop(1 - shoulder, "rgba(12,8,3,0)");
      g.addColorStop(1, "rgba(12,8,3,.38)");
      ctx.fillStyle = g;
      ctx.fill(outline);
    }
    ctx.restore();
    if (pitch > 23 && raised) {
      // A few loose surface fibers escape the yarn silhouette, rather than hard bitmap edges.
      for (let j = Math.ceil(a / pitch); j < b / pitch; j++) {
        const rnd = noise(key * 29 + j * 11),
          side = rnd > 0.5 ? 1 : -1;
        const t = (j + rnd * 0.45) * pitch,
          c = center + side * breadth * 0.46;
        const [x, y] = xy(t, c),
          [cx, cy] = xy(t + pitch * 0.13, c + side * breadth * 0.12);
        const [ex, ey] = xy(t + pitch * 0.32, c - side * breadth * 0.02);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(cx, cy, ex, ey);
        ctx.lineWidth = 0.36;
        ctx.strokeStyle = tint(thread.color, 0.28);
        ctx.globalAlpha = 0.38;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
  // Recessed continuous thread beds followed by topological floats in both systems.
  art.warp.forEach((thread, end) =>
    yarn("warp", end, -0.5, art.weft.length - 0.5, thread, false),
  );
  art.weft.forEach((thread, pick) =>
    yarn("weft", pick, -0.5, art.warp.length - 0.5, thread, false),
  );
  const topWarp = (end: number, pick: number) =>
    face === "front" ? warpOverAt(art, end, pick) : !warpOverAt(art, end, pick);
  for (const axis of ["warp", "weft"] as const) {
    const threads = axis === "warp" ? art.warp : art.weft;
    const count = axis === "warp" ? art.weft.length : art.warp.length;
    threads.forEach((thread, index) => {
      let start = -1;
      for (let at = 0; at <= count; at++) {
        const over =
          at < count &&
          (axis === "warp" ? topWarp(index, at) : !topWarp(at, index));
        if (over && start === -1) start = at;
        if (!over && start !== -1) {
          yarn(axis, index, start - 0.47, at - 1 + 0.47, thread, true);
          start = -1;
        }
      }
    });
  }
  return { draws, pixelWidth: canvas.width, pixelHeight: canvas.height };
}

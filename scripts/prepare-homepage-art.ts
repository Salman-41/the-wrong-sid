import { createCanvas, Path2D } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
import { makeLoomArtwork } from "../src/lib/construction";
import { reweaveArtwork } from "../src/lib/pattern-settings";
import { renderCloth } from "../src/lib/renderer";

// Original studio illustration, derived from the same renderer as Loom. Not visitor state.
Object.assign(globalThis, { Path2D });
const artwork = reweaveArtwork(makeLoomArtwork(), "twill-2-2");
for (const [name, width, height] of [["desktop", 960, 860], ["mobile", 620, 700]] as const) {
  const canvas = createCanvas(width, height), ctx = canvas.getContext("2d");
  const left = 48, top = 35, right = width - 48, bottom = height - 38;
  const clothWidth = right - left, clothHeight = clothWidth * artwork.weft.length / artwork.warp.length;
  const clothTop = bottom - clothHeight - 28;
  const glow = ctx.createRadialGradient(width * .4, height * .5, 0, width * .5, height * .5, height * .72);
  glow.addColorStop(0, "#463239"); glow.addColorStop(1, "#201523");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
  // Unwoven ends keep their exact positions and colors above the rendered cloth.
  const pitch = clothWidth / artwork.warp.length;
  for (const [i, thread] of artwork.warp.entries()) {
    const x = left + (i + .5) * pitch;
    const light = ctx.createLinearGradient(x - 2, 0, x + 2, 0);
    light.addColorStop(0, thread.color); light.addColorStop(.5, thread.color); light.addColorStop(1, "#100b13");
    ctx.strokeStyle = light; ctx.lineWidth = 3.1;
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, bottom); ctx.stroke();
    ctx.strokeStyle = "#f9f5ed44"; ctx.lineWidth = .55;
    ctx.beginPath(); ctx.moveTo(x - .7, top); ctx.lineTo(x - .7, bottom); ctx.stroke();
  }
  const cloth = createCanvas(clothWidth, Math.round(clothHeight));
  renderCloth(cloth as unknown as HTMLCanvasElement, artwork, { width: clothWidth, height: clothHeight, dpr: 1, face: "front", zoom: 1, fit: "stretch", bottomUp: true, transparent: true });
  ctx.shadowColor = "#09040ecc"; ctx.shadowBlur = 15; ctx.shadowOffsetY = 7;
  ctx.drawImage(cloth, left, clothTop); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  const shade = ctx.createLinearGradient(0, top, 0, clothTop);
  shade.addColorStop(0, "#201523b0"); shade.addColorStop(.8, "#20152300");
  ctx.fillStyle = shade; ctx.fillRect(left, top, clothWidth, clothTop - top);
  function beam(x: number, y: number, w: number, h: number, vertical = false) {
    const wood = ctx.createLinearGradient(x, y, vertical ? x + w : x, vertical ? y : y + h);
    wood.addColorStop(0, "#694b3b"); wood.addColorStop(.2, "#ba9064"); wood.addColorStop(.45, "#926843"); wood.addColorStop(1, "#443036");
    ctx.fillStyle = wood; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#f3ddaa33"; ctx.fillRect(x + 2, y + 2, vertical ? 1 : w - 4, vertical ? h - 4 : 1);
  }
  beam(left - 17, top, 13, bottom - top, true);
  beam(right + 4, top, 13, bottom - top, true);
  beam(left - 23, top - 13, clothWidth + 46, 17);
  beam(left - 23, bottom, clothWidth + 46, 17);
  // A loose yarn continues from the topmost weft; it is artwork, not a control.
  ctx.strokeStyle = artwork.weft.at(-1)!.color; ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(right - 1, clothTop + pitch / 2);
  ctx.bezierCurveTo(right + 12, clothTop - 12, right + 29, clothTop + 43, width, clothTop + 29); ctx.stroke();
  writeFileSync(`public/images/home-loom-${name}.webp`, canvas.toBuffer("image/webp", 82));
}

import { PatternRenderCache, renderPatternRoom, type PatternRenderOptions } from "./pattern-renderer";
import type { Artwork } from "./weave";

interface Request {
  artwork: Artwork;
  options: PatternRenderOptions;
  revision: number;
}
const worker = self as unknown as {
  onmessage: ((event: MessageEvent<Request>) => void) | null;
  postMessage: (message: unknown, transfer: Transferable[]) => void;
};
const canvas = new OffscreenCanvas(1, 1);
const cache = new PatternRenderCache();
let latest: Request | null = null;
let scheduled = false;
worker.onmessage = (event) => {
  latest = event.data;
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => {
    scheduled = false;
    if (!latest) return;
    const { artwork, options, revision } = latest;
    latest = null;
    try {
      const stats = renderPatternRoom(canvas, artwork, options, cache);
      const bitmap = canvas.transferToImageBitmap();
      worker.postMessage({ bitmap, revision, stats, rows: artwork.weft.length, composition: options.composition }, [bitmap]);
    } catch {
      worker.postMessage({ error: true, revision }, []);
    }
  }, 0);
};

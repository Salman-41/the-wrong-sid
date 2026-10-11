import { renderCloth, type RenderOptions } from "./renderer";
import type { Artwork } from "./weave";

interface Request {
  artwork: Artwork;
  options: RenderOptions;
  revision: number;
}
const worker = self as unknown as {
  onmessage: ((event: MessageEvent<Request>) => void) | null;
  postMessage: (message: unknown, transfer: Transferable[]) => void;
};
const canvas = new OffscreenCanvas(1, 1);
let latest: Request | null = null;
let scheduled = false;
worker.onmessage = (event) => {
  latest = event.data;
  if (scheduled) return;
  scheduled = true;
  // Coalesce pending slider/color updates. Retain only the latest requested frame.
  setTimeout(() => {
    scheduled = false;
    if (!latest) return;
    const { artwork, options, revision } = latest;
    try {
      renderCloth(canvas, artwork, options);
      const bitmap = canvas.transferToImageBitmap();
      worker.postMessage({ bitmap, revision }, [bitmap]);
    } catch {
      worker.postMessage({ error: true, revision }, []);
    }
  }, 0);
};

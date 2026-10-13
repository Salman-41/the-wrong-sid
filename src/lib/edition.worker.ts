import { renderEdition, EditionRenderCache } from "./edition-renderer";
import { loadEditionFonts } from "./edition-fonts";
import type { Artwork } from "./weave";

interface Request { artwork: Artwork; width: number; revision: number }
const worker = self as unknown as {
  fonts: FontFaceSet;
  onmessage: ((event: MessageEvent<Request>) => void) | null;
  postMessage: (message: unknown, transfer: Transferable[]) => void;
};
const canvas = new OffscreenCanvas(1, 1);
const cache = new EditionRenderCache();
let latest: Request | null = null;
let scheduled = false;
worker.onmessage = (event) => {
  latest = event.data;
  if (scheduled) return;
  scheduled = true;
  setTimeout(async () => {
    try {
      await loadEditionFonts(worker.fonts);
      const request = latest;
      if (!request) return;
      latest = null;
      renderEdition(canvas, request.artwork, request.width, undefined, cache);
      const bitmap = canvas.transferToImageBitmap();
      worker.postMessage({ bitmap, revision: request.revision }, [bitmap]);
    } catch {
      worker.postMessage({ error: true, revision: latest?.revision }, []);
    } finally {
      scheduled = false;
    }
  }, 0);
};

"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import { renderEdition, EditionRenderCache } from "@/lib/edition-renderer";
import { loadEditionFonts } from "@/lib/edition-fonts";
import type { Artwork } from "@/lib/weave";

/** Paint off the main thread where supported; acknowledge only the current project. */
export function useEditionCanvas(canvas: RefObject<HTMLCanvasElement | null>, artwork: Artwork, width: number) {
  const worker = useRef<Worker | null>(null);
  const revision = useRef(0);
  const pending = useRef<{ artwork: Artwork; revision: number } | null>(null);
  const fallback = useRef<(() => void) | null>(null);
  const cache = useRef<EditionRenderCache | null>(null);
  const [paintedArtwork, setPaintedArtwork] = useState<Artwork | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof OffscreenCanvas === "undefined") return;
    let instance: Worker;
    try { instance = new Worker(new URL("../lib/edition.worker.ts", import.meta.url), { type: "module" }); }
    catch { return; }
    worker.current = instance;
    const fail = () => {
      instance.terminate(); worker.current = null; fallback.current?.();
    };
    instance.onmessage = (event: MessageEvent<{ bitmap?: ImageBitmap; revision: number; error?: boolean }>) => {
      if (event.data.error) { fail(); return; }
      const bitmap = event.data.bitmap;
      if (!bitmap) return;
      const element = canvas.current, request = pending.current;
      if (element && request?.revision === event.data.revision && event.data.revision === revision.current) {
        element.width = bitmap.width; element.height = bitmap.height;
        const context = element.getContext("2d");
        if (context) {
          context.drawImage(bitmap, 0, 0); element.dataset.renderer = "worker";
          setPaintedArtwork(request.artwork); setError(false);
        } else setError(true);
      }
      bitmap.close();
    };
    instance.onerror = fail;
    return () => { instance.onmessage = null; instance.onerror = null; instance.terminate(); worker.current = null; };
  }, [canvas]);

  useEffect(() => {
    let cancelled = false;
    const request = { artwork, revision: ++revision.current };
    pending.current = request;
    const drawFallback = () => {
      loadEditionFonts().then(() => {
        if (cancelled || !canvas.current || request.revision !== revision.current) return;
        try {
          cache.current ??= new EditionRenderCache();
          renderEdition(canvas.current, artwork, width, undefined, cache.current);
          canvas.current.dataset.renderer = "main";
          setPaintedArtwork(artwork); setError(false);
        } catch { setError(true); }
      }).catch(() => { if (!cancelled) setError(true); });
    };
    fallback.current = drawFallback;
    const timer = setTimeout(() => {
      if (worker.current) worker.current.postMessage({ ...request, width });
      else drawFallback();
    }, 75);
    return () => { cancelled = true; clearTimeout(timer); fallback.current = null; };
  }, [artwork, width, canvas]);
  return { ready: paintedArtwork !== null, paintedArtwork, error };
}

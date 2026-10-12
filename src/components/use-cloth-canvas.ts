"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import { renderCloth, type RenderOptions } from "@/lib/renderer";
import type { Artwork } from "@/lib/weave";

interface Options extends Omit<RenderOptions, "width" | "height" | "dpr"> {
  onPaint?: (rows: number) => void;
}
/** One renderer lifecycle: coalesced worker draws, stale-frame disposal and a CPU fallback. */
export function useClothCanvas(
  canvas: RefObject<HTMLCanvasElement | null>,
  artwork: Artwork,
  options: Options,
) {
  const worker = useRef<Worker | null>(null),
    revision = useRef(0);
  const pendingRows = useRef(artwork.weft.length),
    fallback = useRef<(() => void) | null>(null);
  const onPaint = useRef(options.onPaint);
  const [ready, setReady] = useState(false),
    [error, setError] = useState(false);
  useEffect(() => {
    onPaint.current = options.onPaint;
  }, [options.onPaint]);
  useEffect(() => {
    if (typeof OffscreenCanvas === "undefined") return;
    let instance: Worker;
    try {
      instance = new Worker(
        new URL("../lib/cloth.worker.ts", import.meta.url),
        { type: "module" },
      );
    } catch {
      return;
    }
    worker.current = instance;
    instance.onmessage = (
      event: MessageEvent<{
        bitmap?: ImageBitmap;
        revision: number;
        error?: boolean;
      }>,
    ) => {
      if (event.data.error) {
        instance.terminate();
        worker.current = null;
        fallback.current?.();
        return;
      }
      const bitmap = event.data.bitmap;
      if (!bitmap) return;
      const element = canvas.current;
      if (element && event.data.revision === revision.current) {
        element.width = bitmap.width;
        element.height = bitmap.height;
        const context = element.getContext("2d", { alpha: true });
        if (context) {
          context.drawImage(bitmap, 0, 0);
          element.dataset.renderedRows = String(pendingRows.current);
          setReady(true);
          setError(false);
          onPaint.current?.(pendingRows.current);
        } else setError(true);
      }
      bitmap.close();
    };
    instance.onerror = () => {
      instance.terminate();
      worker.current = null;
      fallback.current?.();
    };
    return () => {
      instance.terminate();
      worker.current = null;
    };
  }, [canvas]);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let frame = 0;
    const draw = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) return;
        const renderOptions = {
          width: rect.width,
          height: rect.height,
          dpr: window.devicePixelRatio,
          face: options.face,
          zoom: options.zoom,
          fit: options.fit,
          bottomUp: options.bottomUp,
          transparent: options.transparent,
          focus: options.focus,
        };
        pendingRows.current = artwork.weft.length;
        if (worker.current) {
          worker.current.postMessage({
            artwork,
            options: renderOptions,
            revision: ++revision.current,
          });
          return;
        }
        try {
          renderCloth(element, artwork, renderOptions);
          element.dataset.renderedRows = String(artwork.weft.length);
          setReady(true);
          setError(false);
          onPaint.current?.(artwork.weft.length);
        } catch {
          setError(true);
        }
      });
    };
    fallback.current = draw;
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    draw();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // Draft yarn/rule edits do not redraw completed cloth. Only actual material or view changes do.
  }, [
    canvas,
    artwork.warp,
    artwork.weft,
    artwork.pickStructures,
    artwork.seed,
    options.face,
    options.zoom,
    options.fit,
    options.bottomUp,
    options.transparent,
    options.focus?.end,
    options.focus?.pick,
  ]);
  return { ready, error };
}

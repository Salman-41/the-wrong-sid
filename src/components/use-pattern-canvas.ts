"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { PatternRenderCache, renderPatternRoom, type PatternRenderOptions } from "@/lib/pattern-renderer";
import type { Artwork } from "@/lib/weave";

type Options = Omit<PatternRenderOptions, "width" | "height" | "dpr">;

/** Cached yarn sources, event-driven drawing and a main-thread Canvas fallback. */
export function usePatternCanvas(
  canvas: RefObject<HTMLCanvasElement | null>,
  artwork: Artwork,
  options: Options,
) {
  const worker = useRef<Worker | null>(null);
  const cache = useRef<PatternRenderCache | null>(null);
  const revision = useRef(0);
  const fallback = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof OffscreenCanvas === "undefined") return;
    let instance: Worker;
    try {
      instance = new Worker(new URL("../lib/pattern.worker.ts", import.meta.url), { type: "module" });
    } catch {
      return;
    }
    worker.current = instance;
    instance.onmessage = (event: MessageEvent<{ bitmap?: ImageBitmap; revision: number; error?: boolean; rows?: number; composition?: string }>) => {
      if (event.data.error) {
        if (event.data.revision !== revision.current) return;
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
          element.dataset.renderedRows = String(event.data.rows);
          element.dataset.composition = event.data.composition ?? "";
          setReady(true);
          setError(false);
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
        const renderOptions: PatternRenderOptions = {
          width: rect.width,
          height: rect.height,
          dpr: window.devicePixelRatio,
          composition: options.composition,
          repeat: options.repeat,
          scale: options.scale,
        };
        const current = ++revision.current;
        if (worker.current) {
          worker.current.postMessage({ artwork, options: renderOptions, revision: current });
          return;
        }
        try {
          cache.current ??= new PatternRenderCache();
          renderPatternRoom(element, artwork, renderOptions, cache.current);
          element.dataset.renderedRows = String(artwork.weft.length);
          element.dataset.composition = options.composition;
          setReady(true);
          setError(false);
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
    // Editing graphic placement does not rerender the original yarn source.
  }, [canvas, artwork.warp, artwork.weft, artwork.pickStructures, artwork.seed, options.composition, options.repeat, options.scale]);

  return { ready, error };
}

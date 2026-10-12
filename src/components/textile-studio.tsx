"use client";

import { useEffect, useRef, useState } from "react";
import {
  createRepeat,
  PALETTE,
  STRUCTURES,
  parseArtwork,
  serializeArtwork,
  type Artwork,
  type Face,
  type Structure,
} from "@/lib/weave";
import { renderCloth } from "@/lib/renderer";
import Image from "next/image";
import { useTextileProject } from "@/components/textile-project";

function saveFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Cloth({
  artwork,
  face,
  zoom,
}: {
  artwork: Artwork;
  face: Face;
  zoom: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const worker = useRef<Worker | null>(null);
  const revision = useRef(0);
  const fallback = useRef<(() => void) | null>(null);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
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
        const context = element.getContext("2d", { alpha: false });
        if (context) {
          context.drawImage(bitmap, 0, 0);
          setError(false);
          setReady(true);
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
  }, []);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    let pending = 0;
    const draw = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const options = {
          width: rect.width,
          height: rect.height,
          dpr: window.devicePixelRatio,
          zoom,
          face,
        };
        if (worker.current) {
          worker.current.postMessage({
            artwork,
            options,
            revision: ++revision.current,
          });
          return;
        }
        try {
          renderCloth(element, artwork, options);
          setError(false);
          setReady(true);
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
      cancelAnimationFrame(pending);
      observer.disconnect();
    };
  }, [artwork, face, zoom]);
  return (
    <figure className="cloth-view">
      <Image
        src={`/images/textile-study-${face}.webp`}
        fill
        sizes="(max-width: 650px) 100vw, 55vw"
        alt=""
        className="cloth-poster"
      />
      <canvas
        ref={canvas}
        className={ready ? "cloth-canvas is-ready" : "cloth-canvas"}
        role="img"
        aria-label={`${face === "front" ? "Front" : "Reverse"} of your ${STRUCTURES[artwork.structure].label.toLowerCase()}. ${face === "front" ? STRUCTURES[artwork.structure].description : "The cloth is mirrored left to right, and the opposite yarn is visible at each crossing. A warp-faced satin has a weft-faced reverse, and vice versa."} Vertical warp: ${artwork.warp[0].color}; horizontal weft: ${artwork.weft[0].color}.`}
      >
        A woven textile. Choose the structure and yarns with the controls below.
        Front and reverse use the same interlacement.
      </canvas>
      <figcaption>
        <span>{face === "front" ? "The front" : "The reverse"}</span>
        <span>{zoom.toFixed(1)}× examination</span>
      </figcaption>
      {error && (
        <p className="canvas-error" role="alert">
          Canvas 2D is unavailable. Your artwork can still be edited and saved
          as a file.
        </p>
      )}
    </figure>
  );
}

export default function TextileStudio({
  initialFace = "front",
}: {
  initialFace?: Face;
}) {
  const { artwork, setArtwork, zoom, setZoom, rhythm, setRhythm } =
    useTextileProject();
  const [face, setFace] = useState<Face>(initialFace);
  const [compare, setCompare] = useState(false);
  const [notice, setNotice] = useState("");
  const [exporting, setExporting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const warpColor = artwork.warp[0].color,
    weftColor = artwork.weft[0].color;
  function recolor(axis: "warp" | "weft", color: string) {
    setArtwork((current) => ({
      ...current,
      [axis]: current[axis].map((thread, i) => ({
        ...thread,
        color: rhythm && Math.floor(i / 10) % 2 ? PALETTE[0].color : color,
      })),
    }));
  }
  function changeRhythm(next: boolean) {
    setRhythm(next);
    setArtwork((current) => ({
      ...current,
      warp: current.warp.map((t, i) => ({
        ...t,
        color: next && Math.floor(i / 10) % 2 ? PALETTE[0].color : warpColor,
      })),
      weft: current.weft.map((t, i) => ({
        ...t,
        color: next && Math.floor(i / 10) % 2 ? PALETTE[0].color : weftColor,
      })),
    }));
  }
  async function exportImage() {
    setExporting(true);
    setNotice("");
    // Give the UI a frame to paint the busy state before the synchronous export draw.
    await new Promise((resolve) => setTimeout(resolve, 32));
    try {
      const canvas = document.createElement("canvas");
      renderCloth(canvas, artwork, {
        width: 2000,
        height: 2000,
        zoom,
        face,
        dpr: 1,
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("Image could not be created.");
      saveFile(blob, `the-wrong-side-${face}.png`);
      setNotice("Your 2000 × 2000 image is ready.");
    } catch {
      setNotice(
        "The image could not be exported. Try saving the artwork file instead.",
      );
    } finally {
      setExporting(false);
    }
  }
  async function loadFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 100_000) throw new Error("Artwork file is too large.");
      setArtwork(parseArtwork(await file.text()));
      setNotice("Your artwork has been restored.");
      // Imported files may have individual colors. Do not imply a preset rhythm is active.
      setRhythm(false);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "This artwork could not be opened.",
      );
    }
    if (fileInput.current) fileInput.current.value = "";
  }
  function colorControl(axis: "warp" | "weft", color: string) {
    return (
      <fieldset className="yarn-control">
        <legend>
          {axis === "warp" ? "Warp / lengthwise" : "Weft / across"}
        </legend>
        <div className="swatches">
          {PALETTE.map((swatch) => (
            <button
              key={swatch.name}
              type="button"
              aria-label={`${axis}: ${swatch.name}`}
              aria-pressed={color.toLowerCase() === swatch.color.toLowerCase()}
              className="swatch"
              style={{ "--swatch": swatch.color } as React.CSSProperties}
              onClick={() => recolor(axis, swatch.color)}
            />
          ))}
        </div>
        <label className="custom-color">
          <span>Your own color</span>
          <input
            aria-label={`Custom ${axis} color`}
            type="color"
            value={color}
            onChange={(event) => recolor(axis, event.target.value)}
          />
        </label>
      </fieldset>
    );
  }
  return (
    <div className="textile-study">
      <noscript>
        <style>{`.textile-study .controls,.textile-study .material-toolbar,.textile-study .magnifier{display:none}`}</style>
        <p className="static-study-note">
          A static cloth study. Enable JavaScript to change the yarns and save
          your artwork.
        </p>
      </noscript>
      <main id="main-content" tabIndex={-1} className="studio">
        <div className="editorial">
          <p className="small-label">Thread / surface / structure</p>
          <h1>
            A cloth
            <br />
            of your
            <br />
            <em>own.</em>
          </h1>
          <p className="dek">
            Same threads.
            <br />
            Another face.
          </p>
          <p className="intro">
            Choose a yarn. Follow the crossing. Turn it over and see what
            changes.
          </p>
          <div className="crossing-note">
            <span className="small-label">The crossing</span>
            <h2>{STRUCTURES[artwork.structure].label}</h2>
            <p>{STRUCTURES[artwork.structure].description}</p>
            <p className="orientation">
              Warp runs vertically.
              <br />
              Weft runs horizontally.
            </p>
          </div>
        </div>
        <div className="material">
          <div className="material-toolbar">
            <div className="face-controls" aria-label="View face">
              {(["front", "reverse"] as const).map((side) => (
                <button
                  key={side}
                  aria-pressed={face === side && !compare}
                  onClick={() => {
                    setFace(side);
                    setCompare(false);
                  }}
                >
                  {side === "front" ? "Front" : "Reverse"}
                </button>
              ))}
            </div>
            <button
              className="compare-button"
              aria-pressed={compare}
              onClick={() => setCompare((value) => !value)}
            >
              {compare ? "Single face" : "Compare faces"}{" "}
              <span aria-hidden="true">↔</span>
            </button>
          </div>
          <div className={`material-surface ${compare ? "comparison" : ""}`}>
            <Cloth
              artwork={artwork}
              zoom={zoom}
              face={compare ? "front" : face}
            />
            {compare && <Cloth artwork={artwork} zoom={zoom} face="reverse" />}
          </div>
          <div className="magnifier">
            <label htmlFor="zoom">Look closer</label>
            <input
              id="zoom"
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
            />
            <output htmlFor="zoom">{zoom.toFixed(1)}×</output>
          </div>
          <p className="material-caption">
            One cloth, two faces. The reverse mirrors the cloth and exchanges
            the yarn above each crossing.
          </p>
        </div>
        <aside className="controls" id="controls" aria-label="Textile controls">
          <label className="small-label" htmlFor="structure">
            Weave structure
          </label>
          <select
            id="structure"
            value={artwork.structure}
            onChange={(event) => {
              const structure = event.target.value as Structure;
              setArtwork((current) => ({
                ...current,
                structure,
                interlacement: createRepeat(structure),
              }));
            }}
          >
            {Object.entries(STRUCTURES).map(([value, data]) => (
              <option key={value} value={value}>
                {data.label}
              </option>
            ))}
          </select>
          {colorControl("warp", warpColor)}
          {colorControl("weft", weftColor)}
          <fieldset className="rhythm">
            <legend>Color rhythm</legend>
            <button aria-pressed={!rhythm} onClick={() => changeRhythm(false)}>
              Solid
            </button>
            <button aria-pressed={rhythm} onClick={() => changeRhythm(true)}>
              Bands
            </button>
          </fieldset>
          <label className="thickness-label" htmlFor="thickness">
            Yarn thickness{" "}
            <span>{Math.round(artwork.warp[0].thickness * 100)}%</span>
          </label>
          <input
            id="thickness"
            type="range"
            min="0.4"
            max="0.94"
            step="0.01"
            value={artwork.warp[0].thickness}
            onChange={(event) => {
              const thickness = Number(event.target.value);
              setArtwork((current) => ({
                ...current,
                warp: current.warp.map((t) => ({ ...t, thickness })),
                weft: current.weft.map((t) => ({ ...t, thickness })),
              }));
            }}
          />
          <p className="control-hint">Yarn width relative to thread spacing.</p>
          <div className="save-controls">
            <button
              className="primary-button"
              onClick={() => {
                saveFile(
                  new Blob([serializeArtwork(artwork)], {
                    type: "application/json",
                  }),
                  "the-wrong-side.weave.json",
                );
                setNotice(
                  "Your artwork file is ready. Open it here to restore every yarn.",
                );
              }}
            >
              Keep this cloth <span aria-hidden="true">↗</span>
            </button>
            <button
              className="text-button"
              disabled={exporting}
              onClick={exportImage}
            >
              {exporting ? "Preparing image…" : "Download image"}
            </button>
            <button
              className="text-button"
              onClick={() => fileInput.current?.click()}
            >
              Open saved artwork
            </button>
            <input
              className="sr-only"
              ref={fileInput}
              type="file"
              accept=".json,application/json"
              aria-label="Open artwork file"
              onChange={(event) => loadFile(event.target.files?.[0])}
            />
            <p className="notice" role="status">
              {notice}
            </p>
          </div>
        </aside>
      </main>
      <footer>
        <span>THE WRONG SIDE — material studies</span>
        <p>
          A visual weave model. Yarn light, crimp and fiber are artistic
          approximations; fabric mechanics are not simulated.
        </p>
      </footer>
    </div>
  );
}

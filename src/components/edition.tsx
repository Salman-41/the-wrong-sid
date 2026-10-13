"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useTextileProject } from "./textile-project";
import { useEditionCanvas } from "./use-edition-canvas";
import { parseArtwork, serializeArtwork, clothDescription } from "@/lib/weave";
import { EDITION_BACKGROUNDS, EDITION_FORMATS, EDITION_LAYOUTS, parseEditionSettings, type EditionSettings } from "@/lib/edition-settings";
import "./edition.css";

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob), link = document.createElement("a");
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function Edition() {
  const { artwork, setArtwork } = useTextileProject();
  const s = artwork.edition, format = EDITION_FORMATS[s.format];
  const canvas = useRef<HTMLCanvasElement>(null), surface = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(720);
  const { ready, paintedArtwork, error: renderError } = useEditionCanvas(canvas, artwork, width);
  const [busy, setBusy] = useState(false), [exportFormat, setExportFormat] = useState<"png" | "svg">("png");
  const [message, setMessage] = useState(""), [error, setError] = useState("");
  useEffect(() => {
    if (!surface.current) return;
    const element = surface.current;
    const measure = () => setWidth(Math.max(240, Math.min(960, Math.round(element.clientWidth * Math.min(window.devicePixelRatio || 1, 1.5)))));
    const observer = new ResizeObserver(measure); observer.observe(element); measure(); return () => observer.disconnect();
  }, []);
  function edit(patch: Partial<EditionSettings>) {
    setError(""); setMessage("");
    setArtwork((current) => ({ ...current, edition: parseEditionSettings({ ...current.edition, ...patch }) }));
  }
  function save() {
    download(new Blob([serializeArtwork(artwork)], { type: "application/json" }), "the-wrong-side-project.json");
    setMessage("Project saved, including your cloth and print composition."); setError("");
  }
  async function open(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    try {
      if (file.size > 100_000) throw new Error("Choose a textile project smaller than 100 KB.");
      setArtwork(parseArtwork(await file.text())); setMessage("Your textile and edition have been restored."); setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "This project could not be opened."); }
  }
  async function exportArtwork() {
    setBusy(true); setError(""); setMessage("Preparing your " + format.width + " × " + format.height + " " + exportFormat.toUpperCase() + "…");
    const snapshot = JSON.parse(serializeArtwork(artwork));
    try {
      const response = await fetch("/api/edition/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ format: exportFormat, artwork: snapshot }) });
      if (!response.ok) { const result = await response.json(); throw new Error(result.error || "The edition could not be exported."); }
      if (Number(response.headers.get("X-Edition-Width")) !== format.width || Number(response.headers.get("X-Edition-Height")) !== format.height) throw new Error("The export dimensions did not match the preview.");
      const blob = await response.blob();
      download(blob, "the-wrong-side-" + s.layout + "." + exportFormat);
      setMessage("Your " + format.width + " × " + format.height + " edition is ready.");
    } catch (e) { setError(e instanceof Error ? e.message : "The edition could not be exported. Please try again."); setMessage(""); }
    finally { setBusy(false); }
  }
  return (
    <main id="main-content" tabIndex={-1} className="edition-page" data-format={s.format}>
      <header className="edition-introduction">
        <h1>EDITION.</h1><p className="edition-subtitle">From thread to print.</p>
        <p className="edition-introduction-copy">One cloth. Several ways to remember it. Make a considered composition.</p>
        <Link href="/pattern-room" prefetch={false} className="edition-return">← Return to editing</Link>
      </header>
      <figure className="edition-preview">
        <div className="edition-print"><div ref={surface} className="edition-print-surface" style={{ aspectRatio: format.width + " / " + format.height }}>
          {!ready && s.layout === "graphic-edition" && s.format === "portrait" ? <Image src="/images/edition-initial.webp" alt="Initial studio cloth, composed as a graphic edition." width={720} height={960} preload sizes="(max-width: 720px) 294px, (max-width: 1100px) 50vw, 38vw" className="edition-static-preview" /> : null}
          <canvas ref={canvas} className={ready ? "edition-canvas is-ready" : "edition-canvas"} role="img" aria-label={EDITION_LAYOUTS[s.layout].label + ", " + s.face + " face of your " + clothDescription(artwork) + ", with " + artwork.weft.length + " woven rows. Title: " + (s.title || "preset title") + "."} />
          {!artwork.weft.length ? <div className="edition-empty"><p>A print begins with a cloth.</p><Link href="/loom" prefetch={false}>Weave your first row →</Link></div> : null}
        </div></div>
        <figcaption><span>{EDITION_LAYOUTS[s.layout].label} · {s.face}</span><span>{format.width.toLocaleString("en-US")} × {format.height.toLocaleString("en-US")} px</span></figcaption>
        <noscript><p>This is the initial studio cloth. Enable JavaScript to compose and export your own edition.</p></noscript>
      </figure>
      <fieldset className="edition-layouts" disabled={busy}>
        <legend className="eyebrow">Select a composition</legend>
        <div className="edition-layout-choices">{(Object.entries(EDITION_LAYOUTS) as [EditionSettings["layout"], { label: string; description: string }][]).map(([value, item]) => (
          <label key={value}><input type="radio" name="edition-layout" value={value} checked={s.layout === value} onChange={() => edit({ layout: value })} /><span>{item.label}</span></label>
        ))}</div><p className="edition-layout-description">{EDITION_LAYOUTS[s.layout].description}</p>
      </fieldset>
      <fieldset className="edition-settings" disabled={busy}>
        <legend className="sr-only">Print choices</legend>
        <label className="edition-select-label"><span className="eyebrow">Format</span><select aria-label="Edition format" value={s.format} onChange={(e) => edit({ format: e.target.value as EditionSettings["format"] })}>{Object.entries(EDITION_FORMATS).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</select></label>
        <div className="edition-backgrounds"><p className="eyebrow">Background</p><div role="group" aria-label="Edition background">{Object.entries(EDITION_BACKGROUNDS).map(([value, item]) => <button type="button" key={value} style={{ backgroundColor: item.color }} aria-label={item.label} aria-pressed={s.background === value} onClick={() => edit({ background: value as EditionSettings["background"] })}><span className="sr-only">{item.label}</span></button>)}</div><p className="edition-background-name">{EDITION_BACKGROUNDS[s.background].label}</p></div>
        <label className="edition-select-label"><span className="eyebrow">Cloth face</span><select aria-label="Cloth face" value={s.face} onChange={(e) => edit({ face: e.target.value as EditionSettings["face"] })}><option value="front">Front</option><option value="reverse">Reverse</option></select></label>
        <details className="edition-refinements"><summary>Refine the print <span aria-hidden="true">+</span></summary>
          <label className="edition-input-label">Optional title<input type="text" value={s.title} maxLength={48} placeholder={s.layout === "graphic-edition" ? "THE WRONG SIDE." : s.layout === "material-study" ? "Material study." : "Untitled"} onChange={(e) => edit({ title: e.target.value })} /></label>
          <label className="edition-input-label">Personal credit<input type="text" value={s.credit} maxLength={40} placeholder="Your name" onChange={(e) => edit({ credit: e.target.value })} /></label>
          <label className="edition-range-label">Cloth size <output>{Math.round(s.scale * 100)}%</output><input type="range" min="1" max="2.2" step=".1" value={s.scale} onChange={(e) => edit({ scale: Number(e.target.value) })} /></label>
          <div className="edition-crop-presets" role="group" aria-label="Crop presets"><button type="button" onClick={() => edit({ cropX: .5, cropY: .5, scale: 1 })}>Balanced</button><button type="button" onClick={() => edit({ cropX: .5, cropY: .5, scale: 1.6 })}>Close</button><button type="button" onClick={() => edit({ cropX: .25, cropY: .7, scale: 1.3 })}>Off-center</button></div>
          <label className="edition-range-label">Across the warp<input type="range" min="0" max="1" step=".05" value={s.cropX} onChange={(e) => edit({ cropX: Number(e.target.value) })} /></label>
          <label className="edition-range-label">Along the weft<input type="range" min="0" max="1" step=".05" value={s.cropY} onChange={(e) => edit({ cropY: Number(e.target.value) })} /></label>
        </details>
      </fieldset>
      <div className="edition-files"><button type="button" onClick={save} disabled={busy}>Save project <span aria-hidden="true">↓</span></button><button type="button" onClick={() => input.current?.click()} disabled={busy}>Open project <span aria-hidden="true">↑</span></button><input className="sr-only" ref={input} type="file" accept=".json,application/json" onChange={open} tabIndex={-1} aria-label="Open textile project file" /></div>
      <div className="edition-export">
        <label className="edition-export-format"><span className="sr-only">Export file format</span><select value={exportFormat} disabled={busy} aria-label="Export file format" onChange={(e) => setExportFormat(e.target.value as "png" | "svg")}><option value="png">High-resolution PNG</option><option value="svg">SVG with embedded yarns</option></select></label>
        <button className="edition-export-button" type="button" disabled={busy || !ready || paintedArtwork !== artwork || !artwork.weft.length} onClick={exportArtwork}>{busy ? "Preparing edition…" : "Export your edition"}<span aria-hidden="true">→</span></button>
        {exportFormat === "svg" ? <p className="edition-export-note">Vector type and diagrams. Yarn textures are embedded images.</p> : null}
        <p className="edition-status" role="status" aria-live="polite">{message}</p>{error || renderError ? <p className="edition-error" role="alert">{error || "The print preview could not load. Your project can still be saved."}</p> : null}
      </div>
    </main>
  );
}

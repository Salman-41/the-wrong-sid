"use client";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import {
  PALETTE,
  STRUCTURES,
  parseArtwork,
  serializeArtwork,
  clothDescription,
  type Structure,
} from "@/lib/weave";
import { insertPick, setNextStructure, resetCloth } from "@/lib/construction";
import { useTextileProject } from "./textile-project";
import { LoomInstrument } from "./loom-instrument";
import { ClothView } from "./cloth-view";
import { useClientReady } from "./use-client-ready";

type Timeline = ReturnType<typeof import("gsap").gsap.timeline>;
function downloadArtwork(data: string) {
  const url = URL.createObjectURL(
    new Blob([data], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "the-wrong-side.weave.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const shortNames: Record<Structure, string> = {
  plain: "Plain",
  "twill-2-2": "Twill",
  "satin-5": "Satin",
  "sateen-5": "Sateen",
};
const loomPalette = [
  PALETTE[0],
  PALETTE[3],
  PALETTE[2],
  PALETTE[1],
  PALETTE[4],
  PALETTE[5],
];

export function Loom() {
  const { artwork, setArtwork, canUndo, canRedo, undo, redo, zoom, setZoom } =
    useTextileProject();
  const hydrated = useClientReady();
  const [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  const [inspectOpen, setInspectOpen] = useState(false);
  const shuttle = useRef<HTMLDivElement>(null),
    insertion = useRef<HTMLDivElement>(null),
    beater = useRef<HTMLDivElement>(null),
    reveal = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null),
    dialog = useRef<HTMLDialogElement>(null);
  const busyRef = useRef(false),
    timeline = useRef<Timeline | null>(null),
    pending = useRef<{ rows: number; direction: number } | null>(null),
    direction = useRef(1);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finish = useCallback(() => {
    timeline.current?.kill();
    timeline.current = null;
    pending.current = null;
    busyRef.current = false;
    setBusy(false);
    if (timeout.current) clearTimeout(timeout.current);
    if (insertion.current) insertion.current.style.opacity = "0";
    if (reveal.current) reveal.current.style.opacity = "0";
    if (beater.current) beater.current.style.opacity = "0";
  }, []);
  useEffect(() => {
    return () => {
      timeline.current?.kill();
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (
        busyRef.current ||
        (event.target instanceof HTMLElement &&
          (event.target.isContentEditable ||
            event.target.matches("input,textarea,select")))
      )
        return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [undo, redo]);
  const onPaint = useCallback(
    async (rows: number) => {
      const request = pending.current;
      if (!request || request.rows !== rows) return;
      pending.current = null;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }
      try {
        const { gsap } = await import("gsap");
        if (!busyRef.current || !shuttle.current) return;
        const frame = shuttle.current.parentElement;
        const distance = Math.max(0, (frame?.clientWidth ?? 0) * 0.69);
        const from = request.direction < 0 ? 0 : -distance,
          to = request.direction < 0 ? -distance : 0;
        gsap.set(shuttle.current, {
          x: from,
          rotation: request.direction < 0 ? -6 : 6,
        });
        gsap.set(insertion.current, {
          opacity: 1,
          scaleX: 0,
          transformOrigin:
            request.direction < 0 ? "right center" : "left center",
        });
        gsap.set(reveal.current, {
          opacity: 1,
          scaleX: 1,
          transformOrigin:
            request.direction < 0 ? "left center" : "right center",
        });
        gsap.set(beater.current, { opacity: 0.75, y: -6 });
        timeline.current = gsap
          .timeline({ onComplete: finish })
          .to(
            shuttle.current,
            { x: to, rotation: 0, duration: 0.55, ease: "power2.inOut" },
            0,
          )
          .to(
            insertion.current,
            { scaleX: 1, duration: 0.48, ease: "power2.inOut" },
            0.03,
          )
          .to(
            reveal.current,
            { scaleX: 0, duration: 0.48, ease: "power2.inOut" },
            0.03,
          )
          .to(
            beater.current,
            { y: 0, duration: 0.12, ease: "power2.out" },
            0.55,
          )
          .to(insertion.current, { opacity: 0, duration: 0.12 }, 0.55)
          .to(beater.current, { opacity: 0, duration: 0.12 }, 0.67);
      } catch {
        finish();
      }
    },
    [finish],
  );
  function addRow() {
    if (busyRef.current || artwork.weft.length >= artwork.rowLimit) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    busyRef.current = !reduced;
    setBusy(!reduced);
    direction.current *= -1;
    if (!reduced) {
      pending.current = {
        rows: artwork.weft.length + 1,
        direction: direction.current,
      };
      timeout.current = setTimeout(finish, 1800);
    }
    setArtwork(insertPick);
    setNotice(
      `Row ${artwork.weft.length + 1} woven in ${STRUCTURES[artwork.structure].label.toLowerCase()}.`,
    );
  }
  async function restore(selected?: File) {
    if (!selected) return;
    try {
      if (selected.size > 100_000)
        throw new Error("Artwork file is too large.");
      const restored = parseArtwork(await selected.text());
      finish();
      setArtwork(restored);
      setNotice(
        `Restored your cloth: ${restored.weft.length} rows. Undo can return to the previous cloth.`,
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "This artwork could not be restored.",
      );
    }
    if (file.current) file.current.value = "";
  }
  function openInspection() {
    dialog.current?.showModal();
    setInspectOpen(true);
  }
  function changeWarp(color: string, name: string) {
    setArtwork((current) => ({
      ...current,
      warp: current.warp.map((thread, i) => ({
        ...thread,
        color: Math.floor(i / 8) % 2 ? color : PALETTE[0].color,
      })),
    }));
    setNotice(`Warp accent changed to ${name.toLowerCase()}.`);
  }
  const selectedColor = PALETTE.find(
    (swatch) =>
      swatch.color.toLowerCase() === artwork.draftWeft.color.toLowerCase(),
  );
  const warpColor =
    artwork.warp.find((thread) => thread.color !== PALETTE[0].color)?.color ??
    PALETTE[0].color;
  const rows = artwork.weft.length,
    full = rows >= artwork.rowLimit;
  return (
    <main id="main-content" tabIndex={-1} className="loom-page">
      <div className="loom-worktable">
        <div className="loom-editorial">
          <h1 aria-label="THE LOOM">
            <span>THE</span>
            <span>LOOM</span>
          </h1>
          <p className="loom-dek loom-dek--desktop">A fabric takes shape</p>
          <p className="loom-dek loom-dek--mobile">Weave your own cloth.</p>
          <p className="loom-introduction">
            Choose a thread.
            <br />
            Choose how it crosses.
            <br />
            Watch the surface grow.
          </p>
          <fieldset className="loom-warp-colors" disabled={!hydrated || busy}>
            <legend>Warp threads</legend>
            {PALETTE.map((swatch) => (
              <button
                key={swatch.name}
                onClick={() => changeWarp(swatch.color, swatch.name)}
                aria-label={`Warp accent: ${swatch.name}`}
                aria-pressed={warpColor === swatch.color}
              >
                <span
                  style={{ "--yarn-color": swatch.color } as CSSProperties}
                />
                {swatch.name}
              </button>
            ))}
          </fieldset>
        </div>
        <LoomInstrument
          artwork={artwork}
          shuttle={shuttle}
          insertion={insertion}
          beater={beater}
          reveal={reveal}
          onPaint={onPaint}
          onWeave={addRow}
          busy={busy || !hydrated}
        />
        <div className="loom-controls">
          <fieldset className="loom-structure" disabled={!hydrated || busy}>
            <legend>Next row structure</legend>
            <div>
              {Object.entries(STRUCTURES).map(([value, data]) => (
                <button
                  key={value}
                  aria-label={data.label}
                  aria-pressed={artwork.structure === value}
                  onClick={() => {
                    setArtwork((current) =>
                      setNextStructure(current, value as Structure),
                    );
                    setNotice(`${data.label} selected for the next row.`);
                  }}
                >
                  {shortNames[value as Structure]}
                </button>
              ))}
            </div>
            <p>{STRUCTURES[artwork.structure].description}</p>
          </fieldset>
          <fieldset className="loom-weft-colors" disabled={!hydrated || busy}>
            <legend>
              New weft <span>{selectedColor?.name ?? "Custom yarn"}</span>
            </legend>
            <div>
              {loomPalette.map((swatch) => (
                <button
                  key={swatch.name}
                  className="loom-yarn-swatch"
                  aria-label={`Next weft: ${swatch.name}`}
                  aria-pressed={
                    swatch.color.toLowerCase() ===
                    artwork.draftWeft.color.toLowerCase()
                  }
                  style={{ "--yarn-color": swatch.color } as CSSProperties}
                  onClick={() => {
                    setArtwork((current) => ({
                      ...current,
                      draftWeft: { ...current.draftWeft, color: swatch.color },
                    }));
                    setNotice(
                      `The shuttle is threaded with ${swatch.name.toLowerCase()}.`,
                    );
                  }}
                />
              ))}
            </div>
          </fieldset>
          <div className="loom-progress">
            <p className="eyebrow">Cloth in progress</p>
            <p className="loom-row-count">
              <output aria-live="polite" aria-label="Rows woven">
                {rows}
              </output>
              <span>rows woven</span>
            </p>
            <progress
              value={rows}
              max={artwork.rowLimit}
              aria-label={`${rows} of ${artwork.rowLimit} rows woven`}
            />
            <span className="loom-capacity">
              {artwork.rowLimit - rows} rows remaining
            </span>
          </div>
          <div className="loom-row-actions">
            <button
              className="loom-add-row"
              disabled={!hydrated || busy || full}
              onClick={addRow}
            >
              {full ? "Cloth complete" : busy ? "Weaving…" : "Add a woven row"}
              <span aria-hidden="true">→</span>
            </button>
            <div className="loom-history">
              <button
                disabled={!hydrated || busy || !canUndo}
                onClick={() => {
                  undo();
                  setNotice("Last change undone.");
                }}
              >
                Undo
              </button>
              <button
                disabled={!hydrated || busy || !canRedo}
                onClick={() => {
                  redo();
                  setNotice("Change restored.");
                }}
              >
                Redo
              </button>
              <button
                disabled={!hydrated || busy || !rows}
                onClick={() => {
                  setArtwork(resetCloth);
                  setNotice("The warp is ready. Undo restores your cloth.");
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <button
            className="loom-examine"
            disabled={!hydrated}
            onClick={openInspection}
          >
            <span aria-hidden="true">⌕</span> Examine the material
          </button>
          <details className="loom-mobile-warp">
            <summary>
              Warp thread accents <span aria-hidden="true">+</span>
            </summary>
            <fieldset disabled={!hydrated || busy}>
              <legend className="sr-only">Choose a warp accent</legend>
              <div>
                {loomPalette.map((swatch) => (
                  <button
                    key={swatch.name}
                    className="loom-yarn-swatch"
                    aria-label={`Warp accent: ${swatch.name}`}
                    aria-pressed={warpColor === swatch.color}
                    style={{ "--yarn-color": swatch.color } as CSSProperties}
                    onClick={() => changeWarp(swatch.color, swatch.name)}
                  />
                ))}
              </div>
            </fieldset>
          </details>
          <div className="loom-file-actions">
            <button
              disabled={!hydrated || busy}
              onClick={() => {
                downloadArtwork(serializeArtwork(artwork));
                setNotice(
                  "Your cloth and next yarn are saved in the artwork file.",
                );
              }}
            >
              Save cloth <span aria-hidden="true">↗</span>
            </button>
            <button
              disabled={!hydrated || busy}
              onClick={() => file.current?.click()}
            >
              Open cloth <span aria-hidden="true">↗</span>
            </button>
            <input
              ref={file}
              type="file"
              accept=".json,application/json"
              className="sr-only"
              aria-label="Restore artwork file"
              onChange={(event) => void restore(event.target.files?.[0])}
            />
          </div>
          <p className="loom-notice" role="status">
            {notice}
          </p>
        </div>
      </div>
      <div className="loom-footnote">
        <p>
          A visual weave model; light, crimp and movement are art-directed
          approximations.
        </p>
        <Link href="/reverse" prefetch={false}>
          Look at the other face <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <noscript>
        <p className="loom-static-note">
          This is a static instrument study. Enable JavaScript to weave and save
          a cloth.
        </p>
      </noscript>
      <dialog
        ref={dialog}
        className="loom-inspection"
        onClose={() => setInspectOpen(false)}
        aria-labelledby="inspection-title"
      >
        <header>
          <div>
            <p className="eyebrow">Material examination</p>
            <h2 id="inspection-title">{clothDescription(artwork)}</h2>
          </div>
          <button
            aria-label="Close material examination"
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
        </header>
        {inspectOpen && (
          <ClothView artwork={artwork} face="front" zoom={zoom} />
        )}
        <label className="loom-magnify" htmlFor="loom-zoom">
          Look closer
          <input
            id="loom-zoom"
            type="range"
            min="1"
            max="5"
            step=".1"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
          <output htmlFor="loom-zoom">{zoom.toFixed(1)}×</output>
        </label>
        <p>Same yarns. Same crossings. A closer view.</p>
      </dialog>
    </main>
  );
}

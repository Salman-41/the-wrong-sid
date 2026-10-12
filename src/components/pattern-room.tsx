"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useTextileProject } from "./textile-project";
import { usePatternCanvas } from "./use-pattern-canvas";
import {
  arrangeArtwork,
  getArrangement,
  PATTERN_COMPOSITIONS,
  recolorThreadGroup,
  reweaveArtwork,
  type PatternArrangement,
  type PatternComposition,
  type PatternRepeat,
} from "@/lib/pattern-settings";
import {
  PALETTE,
  STRUCTURES,
  clothDescription,
  serializeArtwork,
  type Artwork,
  type Structure,
} from "@/lib/weave";
import { makeLoomArtwork } from "@/lib/construction";

type ControlTab = "arrange" | "weave" | "yarn";
type YarnAxis = "warp" | "weft";
const initialArtworkKey = JSON.stringify(makeLoomArtwork());
const weaveNames: Record<Structure, string> = {
  plain: "Plain",
  "twill-2-2": "2/2 twill",
  "satin-5": "Satin",
  "sateen-5": "Sateen",
};
const compositionNotes: Record<PatternComposition, string> = {
  cutwork: "Soft fragments crossed by a broad ribbon.",
  ribbon: "The same woven cloth carried in sweeping bands.",
  bias: "Angled cuts set in a new rhythm.",
};

function yarnName(color: string): string {
  return (
    PALETTE.find((swatch) => swatch.color.toLowerCase() === color.toLowerCase())
      ?.name ?? color.toUpperCase()
  );
}

function PatternArtworkCanvas({
  artwork,
  arrangement,
  initialPoster = false,
  label,
  className = "",
}: {
  artwork: Artwork;
  arrangement: PatternArrangement;
  initialPoster?: boolean;
  label: string;
  className?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { ready, error } = usePatternCanvas(canvas, artwork, arrangement);
  return (
    <div className={`pattern-art-layer ${className}`}>
      {initialPoster && (
        <picture className="pattern-art-poster" aria-hidden="true">
          <source
            media="(max-width: 767px)"
            srcSet="/images/pattern-room-mobile.webp"
          />
          <img src="/images/pattern-room-desktop.webp" alt="" />
        </picture>
      )}
      <canvas
        ref={canvas}
        className={ready ? "is-ready" : ""}
        role="img"
        aria-label={label}
      />
      {error && (
        <p className="pattern-render-error" role="alert">
          The woven view is unavailable. Your yarn and weave choices are still
          held in the artwork controls.
        </p>
      )}
    </div>
  );
}

function downloadPattern(artwork: Artwork) {
  const url = URL.createObjectURL(
    new Blob([serializeArtwork(artwork)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "the-wrong-side.pattern.weave.json";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function PatternRoom() {
  const {
    artwork,
    previousArtwork,
    setArtwork,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useTextileProject();
  const arrangement = getArrangement(artwork);
  const [activeTab, setActiveTab] = useState<ControlTab>("arrange");
  const [controlsExpanded, setControlsExpanded] = useState(false);
  const [axis, setAxis] = useState<YarnAxis>("weft");
  const [sourceColor, setSourceColor] = useState(PALETTE[2].color);
  const [scale, setScale] = useState(arrangement.scale);
  const scaleRef = useRef(arrangement.scale);
  const [compare, setCompare] = useState(false);
  const [comparison, setComparison] = useState(50);
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    scaleRef.current = arrangement.scale;
    setScale(arrangement.scale);
  }, [arrangement.scale]);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        !(event.ctrlKey || event.metaKey) ||
        event.key.toLowerCase() !== "z" ||
        (event.target instanceof HTMLElement &&
          (event.target.isContentEditable ||
            event.target.matches("input,textarea,select")))
      )
        return;
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  const previewArrangement = { ...arrangement, scale };
  const previous = compare && previousArtwork ? previousArtwork : null;
  const isInitialArtwork = useMemo(
    () => JSON.stringify(artwork) === initialArtworkKey,
    [artwork],
  );
  const isInitial = isInitialArtwork && scale === 1;
  const threads = artwork[axis];
  const yarnColors = [
    ...new Set([
      ...threads.map((thread) => thread.color),
      ...(axis === "weft" ? [artwork.draftWeft.color] : []),
    ]),
  ];
  const selectedSource =
    yarnColors.find(
      (color) => color.toLowerCase() === sourceColor.toLowerCase(),
    ) ??
    yarnColors.find((color) => color.toLowerCase() !== PALETTE[0].color.toLowerCase()) ??
    yarnColors[0] ??
    PALETTE[0].color;
  const wovenRules = new Set(artwork.pickStructures);
  const currentStructure: Structure | "mixed" =
    wovenRules.size <= 1
      ? (artwork.pickStructures[0] ?? artwork.structure)
      : "mixed";

  function changeComposition(next: PatternComposition) {
    commitScale();
    setArtwork((current) => arrangeArtwork(current, { composition: next }));
    setNotice(`${PATTERN_COMPOSITIONS[next]} arrangement selected. The woven crossings stay the same.`);
  }
  function changeRepeat(next: PatternRepeat) {
    commitScale();
    setArtwork((current) => arrangeArtwork(current, { repeat: next }));
    setNotice(`${next} by ${next} graphic repeat. The woven crossings stay the same.`);
  }
  function changeScale(next: number) {
    scaleRef.current = next;
    setScale(next);
  }
  function commitScale() {
    const next = scaleRef.current;
    if (next === arrangement.scale) return;
    setArtwork((current) => arrangeArtwork(current, { scale: next }));
    setNotice(`Graphic scale set to ${next.toFixed(2)} times. Yarn crossings stay the same.`);
  }
  function changeStructure(next: Structure) {
    commitScale();
    setArtwork((current) => reweaveArtwork(current, next));
    setNotice(`${STRUCTURES[next].label} now crosses every woven row. Undo restores the previous weave.`);
  }
  function changeColor(next: string) {
    commitScale();
    setArtwork((current) => recolorThreadGroup(current, axis, selectedSource, next));
    setSourceColor(next);
    setNotice(`${yarnName(selectedSource)} ${axis} yarns changed to ${yarnName(next)}. The rendered cloth uses these real yarn colors.`);
  }
  function undoChange() {
    if (scaleRef.current !== arrangement.scale) {
      scaleRef.current = arrangement.scale;
      setScale(arrangement.scale);
      setNotice("Scale preview discarded.");
      return;
    }
    undo();
    setNotice("Previous artwork restored.");
  }
  function redoChange() {
    if (scaleRef.current !== arrangement.scale) {
      scaleRef.current = arrangement.scale;
      setScale(arrangement.scale);
    }
    redo();
    setNotice("Artwork change restored.");
  }
  function save() {
    commitScale();
    const toSave = arrangeArtwork(artwork, { scale: scaleRef.current });
    downloadPattern(toSave);
    setNotice("Pattern, yarns and crossing rules saved together as an artwork file.");
  }

  return (
    <main id="main-content" tabIndex={-1} className="pattern-room">
      <section className="pattern-stage" aria-labelledby="pattern-title">
        <PatternArtworkCanvas
          artwork={artwork}
          arrangement={previewArrangement}
          initialPoster={isInitial}
          label={`Graphic ${PATTERN_COMPOSITIONS[arrangement.composition].toLowerCase()} arrangement of your ${clothDescription(artwork).toLowerCase()} with ${arrangement.repeat} by ${arrangement.repeat} repetitions. The colored regions are sampled from real woven yarn crossings.`}
          className="pattern-current"
        />
        {previous && (
          <div
            className="pattern-previous-clip"
            style={{ "--comparison": `${comparison}%` } as CSSProperties}
            aria-hidden="true"
          >
            <PatternArtworkCanvas
              artwork={previous}
              arrangement={getArrangement(previous)}
              label="Previous artwork before the last edit"
              className="pattern-previous"
            />
          </div>
        )}
        <div className="pattern-editorial">
          <h1 id="pattern-title"><span>PATTERN</span><span>ROOM</span></h1>
          <p className="pattern-dek pattern-dek-desktop">Same threads.<br />New arrangements.</p>
          <p className="pattern-dek pattern-dek-mobile">Different order.<br />Different surface.</p>
          <p className="pattern-cue">Cut / rearrange / repeat</p>
          <svg className="pattern-thread-line" viewBox="0 0 580 150" aria-hidden="true" preserveAspectRatio="none"><path d="M 0 30 C 115 -4 265 66 390 93 S 510 137 580 92" /></svg>
        </div>
        <div className="pattern-stage-mark" aria-hidden="true">Woven from your cloth</div>
        {!artwork.weft.length && (
          <div className="pattern-empty">
            <p>No rows are woven yet.</p>
            <Link href="/loom" prefetch={false}>Begin at the Loom ↗</Link>
          </div>
        )}
        {previous && (
          <div className="pattern-compare-view" style={{ "--comparison": `${comparison}%` } as CSSProperties}>
            <span>Previous</span><span>Current</span>
            <label htmlFor="pattern-comparison" className="sr-only">Reveal the previous and current artwork</label>
            <input id="pattern-comparison" type="range" min="10" max="90" value={comparison} onChange={(event) => setComparison(Number(event.target.value))} />
            <i aria-hidden="true" />
          </div>
        )}
      </section>

      <section className="pattern-controls" aria-label="Transform your fabric" data-active-tab={activeTab} data-expanded={controlsExpanded}>
        <div className="pattern-controls-heading">
          <p className="eyebrow">Transform this fabric</p>
          <p>Actual yarns and crossings. New graphic arrangements.</p>
        </div>
        <div className="pattern-mobile-tabs" role="group" aria-label="Pattern controls">
          {([
            ["arrange", "Repeat"],
            ["weave", "Structure"],
            ["yarn", "Colour"],
          ] as const).map(([tab, label]) => (
            <button key={tab} type="button" aria-pressed={activeTab === tab} aria-expanded={activeTab === tab && controlsExpanded} aria-controls={`pattern-panel-${tab}`} onClick={() => {
              if (activeTab === tab) setControlsExpanded((value) => !value);
              else { setActiveTab(tab); setControlsExpanded(true); }
            }}>{label}</button>
          ))}
        </div>

        <div className="pattern-control-sections">
          <fieldset id="pattern-panel-arrange" className="pattern-control-section pattern-arrange" data-tab="arrange" data-active={activeTab === "arrange"} disabled={!hydrated || !artwork.weft.length}>
            <legend>Graphic arrangement <span>crossings unchanged</span></legend>
            <div className="pattern-compositions" role="group" aria-label="Composition">
              {(Object.keys(PATTERN_COMPOSITIONS) as PatternComposition[]).map((value) => (
                <button key={value} type="button" aria-pressed={arrangement.composition === value} title={compositionNotes[value]} onClick={() => changeComposition(value)}>{PATTERN_COMPOSITIONS[value]}</button>
              ))}
            </div>
            <div className="pattern-arrange-lower">
              <div className="pattern-repeat" role="group" aria-label="Repeat the arranged cloth">
                <span>Repeat</span>
                {([1, 2, 3, 4] as const).map((value) => <button key={value} aria-label={`${value} by ${value} repeat`} aria-pressed={arrangement.repeat === value} onClick={() => changeRepeat(value)}>{value}×</button>)}
              </div>
              <label className="pattern-scale" htmlFor="pattern-scale">Scale <input id="pattern-scale" type="range" min="0.75" max="1.75" step="0.05" value={scale} onChange={(event) => changeScale(Number(event.target.value))} onPointerUp={commitScale} onKeyUp={commitScale} onBlur={commitScale} /><output htmlFor="pattern-scale">{scale.toFixed(2)}×</output></label>
            </div>
          </fieldset>

          <fieldset id="pattern-panel-weave" className="pattern-control-section pattern-weave" data-tab="weave" data-active={activeTab === "weave"} disabled={!hydrated || !artwork.weft.length}>
            <legend>Reweave every row <span>real crossings</span></legend>
            <div className="pattern-structure-options" role="group" aria-label="Apply weave structure to all woven rows">
              {(Object.keys(STRUCTURES) as Structure[]).map((value) => <button key={value} type="button" aria-pressed={currentStructure === value} title={STRUCTURES[value].description} onClick={() => changeStructure(value)}>{weaveNames[value]}</button>)}
            </div>
            <p className="pattern-control-note">{currentStructure === "mixed" ? "Mixed rows from the Loom. Choose a rule to reweave them all." : STRUCTURES[currentStructure].description}</p>
          </fieldset>

          <fieldset id="pattern-panel-yarn" className="pattern-control-section pattern-yarn" data-tab="yarn" data-active={activeTab === "yarn"} disabled={!hydrated}>
            <legend>Real yarn colours <span>thread data</span></legend>
            <div className="pattern-yarn-axis" role="group" aria-label="Choose yarn direction">
              {(["warp", "weft"] as const).map((value) => <button key={value} type="button" aria-pressed={axis === value} onClick={() => setAxis(value)}>{value === "warp" ? "Warp" : "Weft"}</button>)}
            </div>
            <div className="pattern-yarn-line">
              <div className="pattern-yarn-source" role="group" aria-label={`${axis} yarn color to replace`}>
                {yarnColors.map((color) => <button key={color} type="button" className="pattern-spool" style={{ "--spool-color": color } as CSSProperties} aria-label={`Select ${yarnName(color)} ${axis} yarns to recolor`} aria-pressed={selectedSource.toLowerCase() === color.toLowerCase()} onClick={() => setSourceColor(color)}><span /></button>)}
              </div>
              <span className="pattern-yarn-arrow" aria-hidden="true">→</span>
              <div className="pattern-yarn-destinations" role="group" aria-label={`Replace with a new ${axis} color`}>
                {PALETTE.map((swatch) => <button key={swatch.name} type="button" className="pattern-spool" style={{ "--spool-color": swatch.color } as CSSProperties} aria-label={`Replace selected ${axis} yarns with ${swatch.name}`} disabled={selectedSource.toLowerCase() === swatch.color.toLowerCase()} onClick={() => changeColor(swatch.color)}><span /></button>)}
              </div>
            </div>
            <p className="pattern-control-note">Change the {yarnName(selectedSource).toLowerCase()} {axis} yarns throughout this cloth.</p>
          </fieldset>
        </div>

        <div className="pattern-actions">
          <div className="pattern-history" role="group" aria-label="Artwork history">
            <button type="button" disabled={!hydrated || !canUndo} onClick={undoChange}>Undo</button>
            <button type="button" disabled={!hydrated || !canRedo} onClick={redoChange}>Redo</button>
            <button type="button" disabled={!hydrated || !previousArtwork} aria-pressed={compare && !!previousArtwork} onClick={() => { commitScale(); setCompare((value) => !value); }}>{compare && previousArtwork ? "Close comparison" : "Compare"}</button>
          </div>
          <button className="pattern-save" type="button" disabled={!hydrated || !artwork.weft.length} onClick={save}>Save this pattern <span aria-hidden="true">↗</span></button>
        </div>
      </section>
      <div className="pattern-caption">
        <p><strong>Cloth:</strong> {clothDescription(artwork)}. Structure and yarn controls change the actual woven construction.</p>
        <p><strong>Arrangement:</strong> composition, repetition and scale position finite images of that cloth; they do not alter its crossings.</p>
        <Link href="/reverse" prefetch={false}>Inspect its other face ↗</Link>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{notice}</p>
      <noscript><p className="pattern-noscript">The artwork shown here is a static image of the initial woven cloth. Enable JavaScript to edit yarns, crossings and their graphic arrangement. The Loom can also save a cloth file.</p></noscript>
    </main>
  );
}

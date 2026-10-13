"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { renderCloth } from "@/lib/renderer";
import { paintReveal } from "@/lib/reveal-renderer";
import { LIFT_POSITION } from "@/lib/reveal";
import { useTextileProject } from "./textile-project";

/** A finite reveal, using Reverse's validated mirrored UVs and physical construction. */
export function EntranceClothStudy() {
  const { artwork } = useTextileProject();
  const canvas = useRef<HTMLCanvasElement>(null);
  const move = useRef<(target: number, animate?: boolean) => void>(() => {});
  const [position, setPosition] = useState(LIFT_POSITION);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const element = canvas.current;
    if (!element || !artwork.weft.length) return;
    const front = document.createElement("canvas"), reverse = document.createElement("canvas");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, resizeFrame = 0, progress = 0, target = LIFT_POSITION, painted = false;
    let width = 0, height = 0, economy = false;
    function paint(value: number) {
      progress = value;
      const start = performance.now();
      paintReveal(element!, front, reverse, value, width, height, economy);
      economy ||= performance.now() - start > 25;
      element!.dataset.progress = value.toFixed(3);
      element!.dataset.rows = String(artwork.weft.length);
    }
    function fail() {
      cancelAnimationFrame(frame);
      setReady(false);
      setError(true);
    }
    function turn(next: number, animate = true) {
      target = next;
      setPosition(next);
      cancelAnimationFrame(frame);
      if (!painted) return;
      const start = progress, began = performance.now();
      const tick = (now: number) => {
        const t = !animate || motion.matches || document.hidden ? 1 : Math.min(1, (now - began) / 440);
        try { paint(start + (next - start) * (t * t * (3 - 2 * t))); }
        catch { fail(); return; }
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      tick(began);
    }
    move.current = turn;
    const draw = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        if (bounds.width < 1 || bounds.height < 1) return;
        cancelAnimationFrame(frame);
        width = bounds.width; height = bounds.height;
        try {
          for (const [surface, face] of [[front, "front"], [reverse, "reverse"]] as const) {
            renderCloth(surface, artwork, { width, height, dpr: Math.min(devicePixelRatio, 1.5), pixelBudget: 1_000_000, face, zoom: 1, fit: "cover", transparent: true, bottomUp: true });
          }
          const first = !painted;
          painted = true;
          paint(first ? 0 : target);
          setError(false);
          setReady(true);
          turn(target, first);
        } catch { fail(); }
      });
    };
    const settle = () => { if (painted) turn(target, false); };
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    motion.addEventListener("change", settle);
    document.addEventListener("visibilitychange", settle);
    draw();
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", settle);
      document.removeEventListener("visibilitychange", settle);
      cancelAnimationFrame(frame); cancelAnimationFrame(resizeFrame);
      move.current = () => {};
      front.width = reverse.width = 0;
    };
  }, [artwork]);

  if (!artwork.weft.length) return <div className="entrance-study-empty">
    <p className="eyebrow">The warp is waiting</p><p>A cloth begins<br />with a crossing.</p>
    <Link href="/loom" prefetch={false}>Weave a row at the Loom ↗</Link>
  </div>;

  const state = position < .08 ? "Front laid flat" : position > .86 ? "Reverse laid flat" : "Edge lifted — both faces visible";
  return <div className="entrance-cloth-study">
    <div className="entrance-study-surface">
      <canvas ref={canvas} role="img" aria-label={`Your studio cloth: ${artwork.weft.length} woven rows. ${state}.`} />
      {!ready && !error && <p role="status">Following the threads…</p>}
      {error && <p role="alert">The material view is unavailable. Your woven cloth is unchanged; use Explore the Reverse to continue.</p>}
    </div>
    <p className="entrance-study-state" role="status">{ready ? state : "Your studio cloth"}</p>
    <div className="entrance-study-controls" role="group" aria-label="Turn the studio cloth">
      {([{ label: "Front", value: 0 }, { label: "Lift edge", value: LIFT_POSITION }, { label: "Reverse", value: 1 }]).map(({ label, value }) =>
        <button key={label} type="button" disabled={!ready} aria-pressed={position === value} onClick={() => move.current(value)}>{label}</button>)}
    </div>
    <label className="entrance-study-range">Lift and turn
      <input type="range" min="0" max="1" step="0.01" value={position} disabled={!ready} aria-valuetext={state} onChange={event => move.current(Number(event.target.value), false)} />
    </label>
    <p className="entrance-study-note">The reverse exchanges over and under at every crossing.<br />A model of your cloth; depth and drape are approximations.</p>
  </div>;
}

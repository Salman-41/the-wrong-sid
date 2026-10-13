"use client";
import Image from "next/image";
import { useRef, useId, type RefObject, type CSSProperties } from "react";
import type { Artwork } from "@/lib/weave";
import { useClothCanvas } from "./use-cloth-canvas";
import { LoomShuttle } from "./loom-shuttle";

export interface InstrumentRefs {
  shuttle: RefObject<HTMLDivElement | null>;
  insertion: RefObject<HTMLDivElement | null>;
  beater: RefObject<HTMLDivElement | null>;
  reveal: RefObject<HTMLDivElement | null>;
}
export function LoomInstrument({
  artwork,
  shuttle,
  insertion,
  beater,
  reveal,
  onPaint,
  onWeave,
  busy,
}: {
  artwork: Artwork;
  onPaint: (rows: number) => void;
  onWeave: () => void;
  busy: boolean;
} & InstrumentRefs) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { ready, error } = useClothCanvas(canvas, artwork, {
    face: "front",
    zoom: 1,
    fit: "stretch",
    bottomUp: true,
    transparent: true,
    onPaint,
  });
  const id = useId().replaceAll(":", "");
  const progress = artwork.weft.length / artwork.rowLimit;
  const warpWidth = 480 / artwork.warp.length;
  return (
    <div
      className="loom-instrument"
      style={
        {
          "--cloth-progress": progress,
          "--row-pitch": `${100 / artwork.rowLimit}%`,
          "--active-yarn": artwork.draftWeft.color,
        } as CSSProperties
      }
    >
      <div
        className="loom-frame"
        role="group"
        tabIndex={0}
        aria-label={`Weaving workspace. ${artwork.weft.length} of ${artwork.rowLimit} rows woven. Press Enter or Space to weave a row.`}
        onKeyDown={(event) => {
          if (
            event.target === event.currentTarget &&
            (event.key === "Enter" || event.key === " ")
          ) {
            event.preventDefault();
            if (!busy) onWeave();
          }
        }}
      >
        <div className="loom-upright loom-upright--left" />
        <div className="loom-upright loom-upright--right" />
        <div className="loom-opening">
          <svg
            viewBox="0 0 480 600"
            preserveAspectRatio="none"
            className="loom-warp"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`${id}-warp-light`}>
                <stop stopColor="#FFF" stopOpacity=".5" />
                <stop offset="1" stopColor="#211725" stopOpacity=".3" />
              </linearGradient>
            </defs>
            {artwork.warp.map((thread, i) => (
              <g key={i}>
                <path
                  d={`M${(i + 0.5) * warpWidth} 0V600`}
                  stroke={thread.color}
                  strokeWidth="1.35"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={`M${(i + 0.5) * warpWidth - 0.25} 0V600`}
                  stroke={`url(#${id}-warp-light)`}
                  strokeWidth=".45"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            ))}
          </svg>
          <div className="loom-cloth" style={{ height: `${progress * 100}%` }}>
            {!ready && (
              <Image
                src="/images/loom-cloth-front.webp"
                width={960}
                height={560}
                loading="eager"
                sizes="(max-width: 767px) 84vw, 48vw"
                className="loom-static-material"
                alt=""
              />
            )}
            <canvas
              ref={canvas}
              className={ready ? "loom-material is-ready" : "loom-material"}
              role="img"
              aria-label={`Front of your cloth, ${artwork.weft.length} inserted rows. The first row is nearest the bottom beam.`}
            />
            <div
              ref={reveal}
              className="loom-row-reveal"
              style={{ height: `${100 / Math.max(1, artwork.weft.length)}%` }}
            />
          </div>
          <div
            ref={insertion}
            className="loom-weft-insertion"
            style={{ bottom: `${progress * 100}%` }}
          />
          <div
            ref={beater}
            className="loom-beater"
            style={{ bottom: `${progress * 100}%` }}
          />
        </div>
        <div className="loom-beam loom-beam--top" />
        <div className="loom-beam loom-beam--bottom" />
        <div ref={shuttle} className="loom-shuttle">
          <LoomShuttle color={artwork.draftWeft.color} />
        </div>
      </div>
      {error && (
        <p className="loom-render-error" role="alert">
          Live material rendering is unavailable. Your rows can still be woven
          and saved.
        </p>
      )}
      <p className="loom-instrument-caption">Each row changes the cloth</p>
    </div>
  );
}

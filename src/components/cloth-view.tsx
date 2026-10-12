"use client";
import Image from "next/image";
import { useRef } from "react";
import { clothDescription, type Artwork, type Face } from "@/lib/weave";
import { useClothCanvas } from "./use-cloth-canvas";

export function ClothView({
  artwork,
  face,
  zoom,
}: {
  artwork: Artwork;
  face: Face;
  zoom: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { ready, error } = useClothCanvas(canvas, artwork, {
    face,
    zoom,
    bottomUp: true,
  });
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
        aria-label={`${face} of your ${clothDescription(artwork).toLowerCase()}, ${artwork.weft.length} rows woven. Warp runs vertically; weft runs horizontally. Reverse mirrors the ends and inverts every crossing.`}
      >
        A woven model. The two faces share the same yarns and each pick’s
        crossing rule.
      </canvas>
      <figcaption>
        <span>{face === "front" ? "The front" : "The reverse"}</span>
        <span>{zoom.toFixed(1)}× examination</span>
      </figcaption>
      {error && (
        <p role="alert" className="canvas-error">
          The live cloth cannot be rendered here. The static image is an
          example; your artwork can still be saved.
        </p>
      )}
    </figure>
  );
}

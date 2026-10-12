"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
type MotionTween = ReturnType<typeof import("gsap").gsap.to>;

/** A real link first; GSAP adds a small directional cue only when interacted with. */
export function LiftLink({
  variant = "paper",
}: {
  variant?: "paper" | "material";
}) {
  const arrow = useRef<HTMLSpanElement>(null);
  const animation = useRef<MotionTween | null>(null);
  const requestedX = useRef(0);
  useEffect(
    () => () => {
      animation.current?.kill();
    },
    [],
  );
  async function cue(x: number) {
    requestedX.current = x;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const { gsap } = await import("gsap");
      if (!arrow.current?.isConnected) return;
      animation.current?.kill();
      animation.current = gsap.to(arrow.current, {
        x: requestedX.current,
        duration: 0.18,
        ease: "power2.out",
        overwrite: true,
      });
    } catch {
      // The navigation link remains usable if the optional motion chunk is unavailable.
    }
  }
  return (
    <Link
      href="/reverse"
      prefetch={false}
      className={`lift-link lift-link--${variant}`}
      onPointerEnter={() => void cue(3)}
      onPointerLeave={() => void cue(0)}
      onFocus={() => void cue(3)}
      onBlur={() => void cue(0)}
    >
      <span className="lift-link__circle" aria-hidden="true">
        <span ref={arrow} className="lift-link__arrow">
          {variant === "material" ? "+" : "→"}
        </span>
      </span>
      <span className="lift-link__label">
        {variant === "material" ? "Lift here" : "Lift the edge"}
      </span>
      <span className="sr-only">
        {" "}
        — reveal the other face of your woven cloth
      </span>
    </Link>
  );
}

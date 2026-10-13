"use client";

import type { MouseEvent } from "react";

/** Native navigation survives without hydration; ordinary activation opens the study. */
export function LiftLink({ variant = "paper", onActivate }: {
  variant?: "paper" | "material";
  onActivate: (trigger: HTMLAnchorElement) => void;
}) {
  function activate(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onActivate(event.currentTarget);
  }
  return <a href="/reverse" className={`lift-link lift-link--${variant}`}
    onClick={activate}
    onKeyDown={event => {
      if (event.key === " " && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        event.preventDefault();
        onActivate(event.currentTarget);
      }
    }}>
    <span className="lift-link__circle" aria-hidden="true">
      <span className="lift-link__arrow">{variant === "material" ? "+" : "→"}</span>
    </span>
    <span className="lift-link__label">{variant === "material" ? "Lift here" : "Lift the edge"}</span>
    <span className="sr-only"> — open the woven cloth study</span>
  </a>;
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { LiftLink } from "./lift-link";

export function EntranceReveal({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [Study, setStudy] = useState<ComponentType | null>(null);
  const [loadError, setLoadError] = useState(false);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!open) return;
    heading.current?.focus({ preventScroll: true });
    let cancelled = false;
    // Nothing from the renderer is loaded or mounted until deliberate activation.
    import("./entrance-cloth-study").then(module => {
      if (!cancelled) setStudy(() => module.EntranceClothStudy);
    }).catch(() => { if (!cancelled) setLoadError(true); });
    return () => { cancelled = true; };
  }, [open]);

  function reset() {
    setOpen(false);
    // Remove inert before returning focus to the exact link that opened the study.
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }
  function activate(element: HTMLAnchorElement) {
    trigger.current = element;
    setLoadError(false);
    setOpen(true);
  }

  return <section className={`entrance${open ? " entrance--revealed" : ""}`} aria-label="Exhibition entrance">
    <div className="entrance-cover" inert={open} aria-hidden={open || undefined}>
      {children}
      <LiftLink onActivate={activate} />
      <LiftLink variant="material" onActivate={activate} />
    </div>
    {open && <section className="entrance-reveal" aria-labelledby="entrance-study-title"
      onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); reset(); } }}>
      <div className="entrance-reveal-intro">
        <p className="eyebrow">From image to material</p>
        <h2 id="entrance-study-title" ref={heading} tabIndex={-1}>Beneath<br />the surface.</h2>
        <p className="entrance-reveal-deck">One cloth.<br />Another way of looking.</p>
        <p className="entrance-reveal-context">The cover is a concept image. Here, your studio cloth reveals its own construction: the same yarns, seen from both sides.</p>
        <button type="button" className="entrance-reset" onClick={reset}><span aria-hidden="true">↶</span> Reset to cover</button>
      </div>
      <div className="entrance-reveal-material">
        {Study ? <Study /> : <div className="entrance-study-loading" role="status">
          {loadError ? "The cloth study could not load. You can still explore the Reverse." : "Opening your woven cloth…"}
        </div>}
        <Link href="/reverse" prefetch={false} className="home-action entrance-explore">Explore the Reverse <span aria-hidden="true">↗</span></Link>
      </div>
    </section>}
  </section>;
}

"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { HistoricalTextileRecord } from "@/lib/collection-data";
import "./collection-image-viewer.css";

type Magnification = "fit" | "closer" | "native";

interface CollectionImageViewerProps {
  record: HistoricalTextileRecord;
  className?: string;
  presentation?: "feature" | "object" | "compact";
  preload?: boolean;
  sizes?: string;
}

/** Museum photography only. Close study never manufactures missing detail. */
export function CollectionImageViewer({
  record,
  className = "",
  presentation = "object",
  preload = false,
  sizes = "(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 54vw, 52vw",
}: CollectionImageViewerProps) {
  const primary = record.images.find((image) => image.role === "primary") ?? record.images[0];
  const canMagnify = Math.max(...primary.localDimensionsPx) >= 1200;
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [magnification, setMagnification] = useState<Magnification>("fit");
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0, pixelRatio: 1 });
  const [failed, setFailed] = useState(false);
  const [studyFailed, setStudyFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const id = useId();
  const photograph = record.images[imageIndex] ?? primary;
  const [nativeWidth, nativeHeight] = photograph.localDimensionsPx;
  // At native detail, one image pixel occupies at most one device pixel.
  const nativeScale = 1 / viewportSize.pixelRatio;
  const fitScale = Math.min(
    nativeScale,
    Math.max(1, viewportSize.width - 48) / nativeWidth,
    Math.max(1, viewportSize.height - 48) / nativeHeight,
  );
  const scale = magnification === "native"
    ? nativeScale
    : magnification === "closer"
      ? Math.min(nativeScale, fitScale * 2)
      : fitScale;
  const imageWidth = Math.round(nativeWidth * scale);
  const imageHeight = Math.round(nativeHeight * scale);
  const canPan = imageWidth > viewportSize.width || imageHeight > viewportSize.height;

  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const surface = viewport.current;
    if (!element || !surface) return;
    const trigger = opener.current;
    const body = document.body;
    const scrollY = window.scrollY;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    element.showModal();
    closeButton.current?.focus();
    const measure = () => setViewportSize({
      width: surface.clientWidth,
      height: surface.clientHeight,
      pixelRatio: Math.max(1, window.devicePixelRatio || 1),
    });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(surface);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      element.close();
      Object.assign(body.style, previous);
      window.scrollTo({ top: scrollY, behavior: "instant" });
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    if (!open || !viewport.current) return;
    const surface = viewport.current;
    surface.scrollTo({
      left: Math.max(0, (imageWidth - surface.clientWidth) / 2),
      top: Math.max(0, (imageHeight - surface.clientHeight) / 2),
      behavior: "instant",
    });
  }, [open, imageWidth, imageHeight, imageIndex]);

  function move(horizontal: number, vertical: number) {
    const surface = viewport.current;
    if (!surface) return;
    surface.scrollBy({
      left: horizontal * surface.clientWidth * 0.55,
      top: vertical * surface.clientHeight * 0.55,
      behavior: "instant",
    });
  }

  function followKey(event: KeyboardEvent<HTMLDivElement>) {
    const directions: Record<string, readonly [number, number]> = {
      ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
    };
    const direction = directions[event.key];
    if (direction) {
      event.preventDefault();
      move(...direction);
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      setMagnification("closer");
    } else if (event.key === "-" || event.key === "0") {
      event.preventDefault();
      setMagnification("fit");
    }
  }

  return (
    <div className={`collection-image-viewer collection-image-viewer--${presentation} ${className}`}>
      <div className="collection-image-viewer__photograph" style={{ maxWidth: primary.localDimensionsPx[0] }}>
        <Image
          className="collection-image-viewer__image"
          src={primary.src}
          width={primary.localDimensionsPx[0]}
          height={primary.localDimensionsPx[1]}
          alt={primary.alt}
          sizes={sizes}
          preload={preload}
          quality={85}
          unoptimized={!canMagnify}
          onError={() => setFailed(true)}
        />
        {failed && (
          <p className="collection-image-viewer__failure" role="status">
            The museum photograph could not load. <a href={record.objectUrl}>View the museum record.</a>
          </p>
        )}
      </div>
      {canMagnify && !failed && (
        <button
          type="button"
          ref={opener}
          className="collection-image-viewer__open"
          aria-haspopup="dialog"
          onClick={() => {
            setImageIndex(record.images.indexOf(primary));
            setMagnification("fit");
            setStudyFailed(false);
            setOpen(true);
          }}
        >
          <span aria-hidden="true">⌕</span> Look closer
          <span className="sr-only"> at {record.title}</span>
        </button>
      )}
      {open && (
        <dialog
          ref={dialog}
          className="collection-study"
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-instructions`}
          onCancel={() => setOpen(false)}
          onClose={() => setOpen(false)}
        >
          <header className="collection-study__heading">
            <div>
              <p className="collection-study__eyebrow">Close study / museum photography</p>
              <h2 id={`${id}-title`}>{record.title}</h2>
            </div>
            <button type="button" ref={closeButton} className="collection-study__close" aria-label="Close photograph study" onClick={() => setOpen(false)}>×</button>
          </header>
          <div className="collection-study__toolbar">
            <div className="collection-study__zoom" role="group" aria-label="Photograph magnification">
              {(["fit", "closer", "native"] as const).map((value) => (
                <button type="button" key={value} aria-pressed={magnification === value} onClick={() => setMagnification(value)}>
                  {value === "fit" ? "Whole view" : value === "closer" ? "Closer" : "Native detail"}
                </button>
              ))}
            </div>
            {record.images.length > 1 && (
              <div className="collection-study__views" role="group" aria-label="Documented museum views">
                {record.images.map((image, index) => (
                  <button type="button" key={image.src} aria-pressed={imageIndex === index} onClick={() => {
                    setImageIndex(index);
                    setMagnification("fit");
                    setStudyFailed(false);
                  }}>{image.role === "primary" ? "Full object" : "Museum detail"}</button>
                ))}
              </div>
            )}
          </div>
          <div
            ref={viewport}
            className="collection-study__viewport"
            tabIndex={0}
            role="region"
            aria-label={`Scrollable ${photograph.role === "detail" ? "museum detail photograph" : "object photograph"} of ${record.title}`}
            onKeyDown={followKey}
          >
            <div className="collection-study__plane" style={{ width: Math.max(viewportSize.width, imageWidth), height: Math.max(viewportSize.height, imageHeight) }}>
              <Image
                key={photograph.src}
                src={photograph.src}
                alt={photograph.alt}
                width={nativeWidth}
                height={nativeHeight}
                unoptimized
                loading="eager"
                style={{ width: imageWidth, height: imageHeight }}
                onError={() => setStudyFailed(true)}
              />
              {studyFailed && <p className="collection-study__failure" role="status">This photograph could not load. <a href={record.objectUrl}>View it at the museum.</a></p>}
            </div>
          </div>
          <footer className="collection-study__footer">
            <div className="collection-study__credit">
              <p>{record.institution} · {record.accessionNumber} · {record.rights.status}</p>
              <a href={record.objectUrl}>Museum record <span aria-hidden="true">↗</span></a>
            </div>
            <div className="collection-study__pan" role="group" aria-label="Move across the photograph">
              {([
                ["←", "Move photograph view left", -1, 0],
                ["↑", "Move photograph view up", 0, -1],
                ["↓", "Move photograph view down", 0, 1],
                ["→", "Move photograph view right", 1, 0],
              ] as const).map(([symbol, label, horizontal, vertical]) => (
                <button type="button" key={label} aria-label={label} disabled={!canPan} onClick={() => move(horizontal, vertical)}>{symbol}</button>
              ))}
            </div>
          </footer>
          <p className="collection-study__instructions" id={`${id}-instructions`}>Use the arrow controls or focus the photograph and use arrow keys to move. Esc closes this view.</p>
          <p className="sr-only" role="status">{magnification === "fit" ? "Whole photograph" : magnification === "closer" ? "Closer view" : "Native image detail"}. {photograph.role === "detail" ? "Documented museum detail photograph." : "Documented full-object photograph."}</p>
        </dialog>
      )}
    </div>
  );
}

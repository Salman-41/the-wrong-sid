"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { experiences, primaryNavigation } from "@/lib/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const menu = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  function closeMenu(restoreFocus = false) {
    if (!menu.current?.open) return;
    menu.current.open = false;
    if (restoreFocus) summary.current?.focus();
  }
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menu.current?.open) {
        event.preventDefault();
        closeMenu(true);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !menu.current?.contains(event.target))
        closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);
  return (
    <header
      className={`site-header ${pathname === "/" ? "site-header--entrance" : pathname === "/loom" ? "site-header--loom" : ""}`}
    >
      <Link href="/" className="site-wordmark" prefetch={false}>
        THE WRONG SIDE
      </Link>
      <nav className="primary-navigation" aria-label="Primary navigation">
        {primaryNavigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            aria-current={pathname === item.href ? "page" : undefined}
            onClick={() => closeMenu()}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <details
        ref={menu}
        className="experience-menu"
        onBlur={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            !event.currentTarget.contains(event.relatedTarget)
          )
            closeMenu();
        }}
      >
        <summary
          ref={summary}
          aria-label="Explore the exhibition"
          aria-controls="experience-navigation"
        >
          <span aria-hidden="true" className="menu-mark">
            <i />
            <i />
            <i />
          </span>
        </summary>
        <nav
          id="experience-navigation"
          aria-label="All experiences"
          className="experience-navigation"
        >
          <p className="eyebrow">THE WRONG SIDE</p>
          {experiences.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={() => closeMenu()}
            >
              <span>{item.name}</span>
              {item.status !== "available" && (
                <small>
                  {item.status === "study"
                    ? "Material study"
                    : "In preparation"}
                </small>
              )}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}

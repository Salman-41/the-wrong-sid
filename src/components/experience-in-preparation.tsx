import Link from "next/link";
import type { ReactNode } from "react";

/** Explicit route boundaries for future experiences, not pretend completed screens. */
export function ExperienceInPreparation({
  name,
  children,
}: {
  name: string;
  children?: ReactNode;
}) {
  return (
    <main id="main-content" tabIndex={-1} className="experience-preparation">
      <p className="eyebrow">In preparation</p>
      <h1>{name}</h1>
      <p>
        This room is being prepared.
        <br />
        The material study is open to explore.
      </p>
      {children}
      <Link href="/loom" className="preparation-link" prefetch={false}>
        Make a cloth <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}

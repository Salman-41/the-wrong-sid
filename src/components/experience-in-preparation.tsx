import Link from "next/link";

/** Explicit route boundaries for future experiences, not pretend completed screens. */
export function ExperienceInPreparation({ name }: { name: string }) {
  return (
    <main id="main-content" tabIndex={-1} className="experience-preparation">
      <p className="eyebrow">In preparation</p>
      <h1>{name}</h1>
      <p>
        This room is being prepared.
        <br />
        The material study is open to explore.
      </p>
      <Link href="/loom" className="preparation-link" prefetch={false}>
        Make a cloth <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}

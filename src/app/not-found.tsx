import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="experience-preparation">
      <p className="eyebrow">A loose thread</p>
      <h1>
        This page
        <br />
        isn’t here.
      </h1>
      <Link href="/" className="preparation-link">
        Return to the Entrance <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}

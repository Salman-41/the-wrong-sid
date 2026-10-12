import Link from "next/link";
export default function CollectionNotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="collection-missing collection-shell">
      <p className="eyebrow">The collection</p>
      <h1>This object is not in the collection.</h1>
      <p>Return to the eleven documented textiles in the exhibition.</p>
      <Link href="/collection" prefetch={false} className="collection-text-link">Browse the collection <span aria-hidden="true">↗</span></Link>
    </main>
  );
}

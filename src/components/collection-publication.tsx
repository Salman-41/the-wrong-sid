import Image from "next/image";
import Link from "next/link";
import { HISTORICAL_TEXTILES, type HistoricalTextileRecord, type HistoricalTextileId } from "@/lib/collection-data";
import { COLLECTION_BROWSE_GROUPS, getCollectionEditorial } from "@/lib/collection-editorial";
import { collectionBrowseHref, type CollectionSelection, type CollectionBrowseBy } from "@/lib/collection-browse";

export function MuseumCredit({ record }: { record: HistoricalTextileRecord }) {
  return <p className="collection-image-credit">Museum photograph · <a href={record.objectUrl}>{record.institution}</a><span>{record.accessionNumber} · {record.rights.status}</span></p>;
}
const modes: readonly { by: CollectionBrowseBy; label: string }[] = [
  { by: "objects", label: "Objects" }, { by: "techniques", label: "Techniques" },
  { by: "materials", label: "Materials" }, { by: "places", label: "Places" },
];
function BrowseModes({ selection, className = "" }: { selection: CollectionSelection; className?: string }) {
  return <nav aria-label="Read the collection by" className={"collection-modes " + className}>{modes.map(({ by, label }) => (
    <Link key={by} href={collectionBrowseHref(by)} prefetch={false} aria-current={selection.by === by ? "page" : undefined}>{label}</Link>
  ))}</nav>;
}
const publicationOrder = ["met-1988-104-1", "met-29-179-34", "cma-1916-1334", "cma-1992-103", "cma-1922-45", "cma-1916-1246", "chndm-1951-111-34", "chndm-1937-75-1", "nmah-138338", "nmah-1982-0392", "met-66-122-20"] as const;

export function CollectionPlate({ record, relatedReason }: { record: HistoricalTextileRecord; relatedReason?: string }) {
  const image = record.images[0];
  const editorial = getCollectionEditorial(record.id as HistoricalTextileId);
  const href = "/collection/" + record.id;
  const wide = ["cma-1922-45", "met-1988-104-1", "nmah-1982-0392"].includes(record.id);
  return <article className={"collection-plate plate--" + record.id}>
    <Link href={href} prefetch={false} className="collection-plate-image" aria-label={"Look at " + record.title}>
      <Image src={image.src} alt={image.alt} width={image.localDimensionsPx[0]} height={image.localDimensionsPx[1]} quality={75}
        sizes={relatedReason ? "(max-width: 720px) calc(100vw - 84px), 40vw" : wide ? "(max-width: 720px) calc(100vw - 44px), (max-width: 1100px) 65vw, 64vw" : "(max-width: 720px) calc(100vw - 44px), (max-width: 1100px) 40vw, 36vw"}
        unoptimized={image.localDimensionsPx[1] < 1200} />
    </Link>
    <div className="collection-plate-caption">
      <p className="eyebrow">{editorial.kicker} <span aria-hidden="true">/</span> {record.date}</p>
      <h3><Link href={href} prefetch={false}>{record.title}<span className="collection-arrow" aria-hidden="true">↗</span></Link></h3>
      {wide && !relatedReason ? <p className="collection-plate-deck">{editorial.standfirst}</p> : null}
      {relatedReason ? <p className="collection-related-reason">{relatedReason}</p> : <p className="collection-plate-making">{record.materials.join(", ")}</p>}
      <MuseumCredit record={record} />
    </div>
  </article>;
}

export function CollectionPublication({ selection }: { selection: CollectionSelection }) {
  const opening = HISTORICAL_TEXTILES[0];
  const image = opening.images[0];
  const filtered = Boolean(selection.group);
  const records = publicationOrder.flatMap((id) => {
    const record = selection.records.find((item) => item.id === id);
    return record && (filtered || id !== opening.id) ? [record] : [];
  });
  return <main id="main-content" tabIndex={-1} className="collection-publication collection-shell">
    <section className="collection-opening" aria-labelledby="collection-title">
      <div className="collection-introduction">
        <h1 id="collection-title"><span>The</span>{" "}Collection.</h1>
        <p className="collection-introduction-line">The fabric has a history.</p>
        <p className="collection-introduction-copy">Places, materials, makers.<br />Eleven textiles, held in four museum collections. A publication for looking closely.</p>
        <div className="collection-explore"><p className="eyebrow">Explore</p><BrowseModes selection={selection} /></div>
      </div>
      <figure className="collection-opening-figure">
        <Link href="/collection/met-66-122-20" prefetch={false} aria-label="Read Piece of Cloth for Bedding">
          <Image src={image.src} alt={image.alt} width={581} height={680} unoptimized preload className="collection-opening-image" />
        </Link>
        <figcaption><MuseumCredit record={opening} /></figcaption>
      </figure>
      <div className="collection-opening-label">
        <p className="eyebrow">The Met / Japan</p><h2>{opening.title}</h2>
        <p className="collection-object-date">19th century</p>
        <dl className="collection-opening-facts">
          <div><dt className="eyebrow">Material &amp; making</dt><dd>Plain-weave cotton with weft kasuri (ikat) patterning.</dd></div>
          <div><dt className="eyebrow">Accession</dt><dd className="collection-accession">66.122.20</dd></div>
        </dl>
        <Link href="/collection/met-66-122-20" prefetch={false} className="collection-text-link">Read the object <span aria-hidden="true">↗</span></Link>
        <a href={opening.objectUrl} className="collection-source-link">View The Met record <span aria-hidden="true">↗</span></a>
      </div>
    </section>
    <section id="collection-works" aria-labelledby="collection-works-title" className="collection-works">
      <div className="collection-browse-head">
        <div><p className="eyebrow">A closer reading</p><h2 id="collection-works-title">{selection.group?.label ?? "Threads of history."}</h2></div>
        <p>{selection.group?.description ?? "From dyed cotton to silk, from an entire coverlet to a surviving fragment. Follow a surface into the museum record."}</p>
      </div>
      <div className="collection-browse-controls"><BrowseModes selection={selection} className="collection-modes--horizontal" /><p className="eyebrow">{filtered ? selection.records.length + " works" : "11 objects · 4 collections"}</p></div>
      {selection.by !== "objects" ? <nav className="collection-facets" aria-label={"Browse " + selection.by}>
        <Link href={collectionBrowseHref(selection.by)} prefetch={false} aria-current={!selection.group ? "page" : undefined}>All objects</Link>
        {COLLECTION_BROWSE_GROUPS[selection.by].map((group) => <Link href={collectionBrowseHref(selection.by, group.id)} prefetch={false} key={group.id} aria-current={selection.group?.id === group.id ? "page" : undefined}>{group.label} <span>{group.objectIds.length}</span></Link>)}
      </nav> : null}
      <div className={"collection-plates" + (filtered ? " collection-plates--filtered" : "")}>{records.map((record) => <CollectionPlate key={record.id} record={record} />)}</div>
    </section>
    <footer className="collection-colophon"><h2>Keep looking.</h2><p>These photographs and object records come from The Metropolitan Museum of Art, Cleveland Museum of Art, Cooper Hewitt, and the National Museum of American History. Each object carries its own source and credit.</p><Link href="/loom" prefetch={false} className="collection-text-link">Make a cloth of your own <span aria-hidden="true">↗</span></Link></footer>
  </main>;
}

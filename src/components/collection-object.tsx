import Link from "next/link";
import { HISTORICAL_TEXTILES, getHistoricalTextile, type HistoricalTextileId, type HistoricalTextileRecord } from "@/lib/collection-data";
import { COLLECTION_BROWSE_GROUPS, getCollectionEditorial } from "@/lib/collection-editorial";
import { collectionBrowseHref } from "@/lib/collection-browse";
import { CollectionImageViewer } from "./collection-image-viewer";
import { CollectionPlate, MuseumCredit } from "./collection-publication";

export function CollectionObject({ record }: { record: HistoricalTextileRecord }) {
  const editorial = getCollectionEditorial(record.id as HistoricalTextileId);
  const position = HISTORICAL_TEXTILES.findIndex((item) => item.id === record.id);
  const previous = HISTORICAL_TEXTILES[(position + HISTORICAL_TEXTILES.length - 1) % HISTORICAL_TEXTILES.length];
  const next = HISTORICAL_TEXTILES[(position + 1) % HISTORICAL_TEXTILES.length];
  const materialGroups = COLLECTION_BROWSE_GROUPS.materials.filter((group) => group.objectIds.some((id) => id === record.id));
  const techniqueGroups = COLLECTION_BROWSE_GROUPS.techniques.filter((group) => group.objectIds.some((id) => id === record.id));
  return (
    <main id="main-content" tabIndex={-1} className={"collection-object collection-shell collection-object--" + editorial.presentation}>
      <nav aria-label="Collection navigation" className="collection-object-navigation">
        <Link href="/collection#collection-works" prefetch={false}><span aria-hidden="true">←</span> The collection</Link>
        <span className="eyebrow">{record.institution}</span>
        <Link href={"/collection/" + next.id} prefetch={false}>Next object <span aria-hidden="true">→</span><span className="sr-only">: {next.title}</span></Link>
      </nav>
      <header className="collection-object-heading">
        <p className="eyebrow">{editorial.kicker}</p>
        <h1>{record.title}</h1>
        <p className="collection-object-heading-line">{record.date}<span aria-hidden="true"> · </span>{record.documentedOrigin?.value ?? "Place not recorded"}</p>
      </header>
      <div className="collection-object-hero">
        <figure className={"collection-object-artwork collection-object-artwork--" + editorial.ground}>
          <CollectionImageViewer record={record} preload sizes={editorial.presentation === "panorama" ? "(max-width: 720px) calc(100vw - 64px), 80vw" : "(max-width: 720px) calc(100vw - 64px), (max-width: 1100px) 50vw, 45vw"} />
          <figcaption><MuseumCredit record={record} /></figcaption>
        </figure>
        <div className="collection-object-reading">
          <p className="collection-object-standfirst">{editorial.standfirst}</p>
          <div className="collection-object-context">
            <p>{editorial.context}</p>
            <a href={record.objectUrl} className="collection-source-link">Source: museum object record <span aria-hidden="true">↗</span></a>
            <div className="collection-studio-reading"><p className="eyebrow">Studio reading</p><p>{editorial.closeLooking}</p></div>
          </div>
        </div>
      </div>
      <section className="collection-record" aria-labelledby="record-title">
        <div className="collection-record-intro">
          <p className="eyebrow">Documented object</p><h2 id="record-title">In the museum record.</h2>
          <p>{editorial.documentedView}</p>
          <a href={record.objectUrl} className="collection-text-link">Read the full museum record <span aria-hidden="true">↗</span></a>
        </div>
        <div className="collection-record-details">
          <dl>
            <div><dt>Date</dt><dd>{record.date}</dd></div>
            <div><dt>{record.documentedOrigin?.field ?? "Geography"}</dt><dd>{record.documentedOrigin?.value ?? "Not stated in the museum record."}</dd></div>
            <div><dt>Maker</dt><dd>{record.maker ?? "Not named in the museum record."}{record.makerAttributionNote ? <p className="collection-attribution-note">{record.makerAttributionNote}</p> : null}</dd></div>
            <div><dt>Materials</dt><dd>{record.materials.join(", ")}</dd></div>
            <div><dt>Techniques</dt><dd>{record.techniques.join("; ")}</dd></div>
            <div><dt>Museum medium</dt><dd>{record.medium}</dd></div>
            <div><dt>Measurements</dt><dd>{record.dimensions ?? "Not stated in the museum record."}</dd></div>
            <div><dt>Accession</dt><dd>{record.accessionNumber}</dd></div>
            <div><dt>Institution</dt><dd>{record.institution}</dd></div>
            {record.creditLine ? <div><dt>Credit line</dt><dd>{record.creditLine}</dd></div> : null}
          </dl>
          <div className="collection-source-note">
            <p className="eyebrow">Image &amp; source</p>
            <p>{record.rights.suggestedCredit}</p>
            <p>{record.rights.attributionRequirement}</p>
            <a href={record.images[0].sourceDownloadUrl}>Download the museum source image <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>
      <aside className="collection-follow" aria-label="Follow this material or technique">
        <p className="eyebrow">Follow the threads</p>
        <div>{materialGroups.map((group) => <Link key={group.id} href={collectionBrowseHref("materials", group.id)} prefetch={false}>{group.label}<span aria-hidden="true">↗</span></Link>)}</div>
        <div>{techniqueGroups.map((group) => <Link key={group.id} href={collectionBrowseHref("techniques", group.id)} prefetch={false}>{group.label}<span aria-hidden="true">↗</span></Link>)}</div>
      </aside>
      <section className="collection-related" aria-labelledby="related-title">
        <div className="collection-related-heading"><p className="eyebrow">Read together</p><h2 id="related-title">A conversation<br />between cloths.</h2><p>Connections in material, construction, or visible pattern.</p></div>
        <div className="collection-related-plates">{editorial.relatedWorks.map((relation) => {
          const related = getHistoricalTextile(relation.id);
          return related ? <CollectionPlate key={relation.id} record={related} relatedReason={relation.reason} /> : null;
        })}</div>
      </section>
      <nav className="collection-turn-page" aria-label="Previous and next object">
        <Link href={"/collection/" + previous.id} prefetch={false}><span className="eyebrow">← Previous object</span><span>{previous.title}</span></Link>
        <Link href={"/collection/" + next.id} prefetch={false}><span className="eyebrow">Next object →</span><span>{next.title}</span></Link>
      </nav>
    </main>
  );
}

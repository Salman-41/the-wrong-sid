import Image from "next/image";
import Link from "next/link";
import { HISTORICAL_TEXTILES } from "@/lib/collection-data";
import { primaryNavigation } from "@/lib/navigation";

const featured = HISTORICAL_TEXTILES.find(record => record.id === "chndm-1951-111-34")!;

function Action({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} prefetch={false} className="home-action">
    <span className="home-action-circle" aria-hidden="true">→</span><span>{children}</span>
  </Link>;
}

export function HomepageFeatures() {
  const objectImage = featured.images[0];
  return <>
    <section className="home-making" aria-labelledby="home-making-title">
      <div className="home-section-rule"><p className="eyebrow">Make / The Loom</p><p className="eyebrow">A working instrument</p></div>
      <div className="home-making-layout">
        <h2 id="home-making-title" className="home-making-title"><span><span>The</span> <span>work</span></span><span><span>of a</span> <span>thread.</span></span></h2>
        <p className="home-making-mobile-deck">Build your own cloth, one crossing at a time.</p>
        <figure className="home-making-art">
          <picture>
            <source media="(max-width: 1100px)" srcSet="/images/home-loom-mobile.webp" width="620" height="700" />
            {/* These small, pre-sized renderer posters need no runtime image transformation. */}
            <img src="/images/home-loom-desktop.webp" width="960" height="860" loading="lazy" decoding="async" alt="A studio twill study on a loom: long cotton, indigo, vermilion and ochre warp threads meet interlaced rows of cloth." />
          </picture>
          <figcaption className="eyebrow">A studio study in 2/2 twill</figcaption>
        </figure>
        <div className="home-making-copy">
          <p className="home-making-lede">Choose a thread.<br />See what it becomes.</p>
          <p>Cloth grows one woven row at a time.<br />Each crossing matters.</p>
          <Action href="/loom">Work the Loom</Action>
          <p className="home-making-continuity">Your cloth continues through the exhibition.</p>
        </div>
      </div>
    </section>

    <section className="home-collection" aria-labelledby="home-collection-title">
      <div className="home-section-rule"><p className="eyebrow">Collect / The Collection</p><p className="eyebrow">Real objects. Documented stories.</p></div>
      <div className="home-collection-layout">
        <div className="home-collection-heading">
          <h2 id="home-collection-title"><span>The</span> stories</h2>
          <p>are in the making.</p>
        </div>
        <figure className="home-collection-object">
          <Link href={`/collection/${featured.id}`} prefetch={false} aria-label={`Look closer at ${featured.title}, ${featured.date}`} className="home-collection-image">
            <Image src={objectImage.src} width={objectImage.localDimensionsPx[0]} height={objectImage.localDimensionsPx[1]} alt={objectImage.alt}
              sizes="(max-width: 700px) 86vw, (max-width: 1100px) 45vw, 40vw" quality={75} loading="lazy" />
            <span className="home-object-look" aria-hidden="true">Look closer ↗</span>
          </Link>
          <figcaption>
            <p className="home-object-name"><Link href={`/collection/${featured.id}`} prefetch={false}>{featured.title}</Link> <span> / {featured.date}</span></p>
            <p>{featured.documentedOrigin?.value} · {featured.medium}</p>
            <p className="home-object-credit">Museum photograph · <a href={featured.objectUrl}>{featured.institution}</a><br />{featured.accessionNumber} · {featured.rights.status}</p>
          </figcaption>
        </figure>
        <div className="home-collection-copy">
          <p className="home-collection-lede">A small fragment.<br /> A longer story.</p>
          <p>Red and blue stitches cross a linen ground. Just 11 × 11.5 cm, this surviving cloth holds both pattern and the traces of wear.</p>
          <Action href="/collection">Explore the Collection</Action>
        </div>
      </div>
    </section>
  </>;
}

export function HomepageFooter() {
  return <footer className="home-footer">
    <p className="eyebrow">The Wrong Side</p>
    <p className="home-footer-statement"><span>More than</span> a surface.</p>
    <nav aria-label="Continue through the exhibition">
      {primaryNavigation.map(item => <Link href={item.href} prefetch={false} key={item.href}>{item.label}</Link>)}
    </nav>
  </footer>;
}

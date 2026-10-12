import Image from "next/image";
import { LiftLink } from "@/components/lift-link";

export function Entrance() {
  return (
    <main id="main-content" tabIndex={-1} className="entrance">
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        className="entrance-definitions"
      >
        <defs>
          <clipPath
            id="entrance-material-edge"
            clipPathUnits="objectBoundingBox"
          >
            <path d="M.422222 0H1V1H.447222C.49375 .86 .520139 .674444 .485417 .525556C.451389 .352222 .416667 .216667 .422222 0Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="entrance-material">
        <div className="entrance-image-frame">
          <Image
            src="/images/entrance-textile.webp"
            fill
            sizes="(max-width: 767px) 154vw, 65vw"
            preload
            quality={85}
            className="entrance-textile"
            alt="A provisional studio concept: indigo, ochre and vermilion yarns with cream threads exposed along a frayed textile edge."
          />
        </div>
      </div>
      <h1 className="entrance-title" aria-label="THE WRONG SIDE.">
        <span className="entrance-title__the">THE</span>
        <span className="entrance-title__wrong">WRONG</span>
        <span className="entrance-title__side">SIDE.</span>
      </h1>
      <div className="entrance-introduction">
        <p className="entrance-tagline">Turn it over.</p>
        <p className="entrance-copy">
          Every textile has a visible story
          <br />
          and a hidden one.
        </p>
      </div>
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        className="entrance-thread"
        aria-hidden="true"
      >
        <path
          d="M95 818C160 751 266 790 332 716C438 613 535 619 610 581"
          fill="none"
          stroke="currentColor"
          strokeWidth=".9"
        />
      </svg>
      <LiftLink />
      <LiftLink variant="material" />
      <div className="entrance-faces" aria-hidden="true">
        <span className="entrance-faces__front">Front</span>
        <span className="entrance-faces__line" />
        <span className="entrance-faces__dot" />
        <span className="entrance-faces__reverse">Reverse</span>
      </div>
      <p className="entrance-annotation">
        A textile experience
        <br />
        about making and
        <br />
        looking closer.
      </p>
      <span className="sr-only">
        The hero image is a provisional concept study. Lift the Edge opens a
        woven model to inspect; the physical fabric-lifting interaction is in
        preparation.
      </span>
    </main>
  );
}

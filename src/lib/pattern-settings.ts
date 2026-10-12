import {
  createRepeat,
  STRUCTURES,
  type Artwork,
  type Structure,
} from "./weave";
import {
  getArrangement,
  parsePatternArrangement,
  type PatternArrangement,
} from "./pattern-arrangement";

export { getArrangement } from "./pattern-arrangement";
export type {
  PatternArrangement,
  PatternComposition,
  PatternRepeat,
} from "./pattern-arrangement";
export { DEFAULT_ARRANGEMENT, PATTERN_COMPOSITIONS } from "./pattern-arrangement";

/** Reconstruct every woven pick, as well as the next-pick rule, with one supported structure. */
export function reweaveArtwork(art: Artwork, structure: Structure): Artwork {
  if (!Object.hasOwn(STRUCTURES, structure))
    throw new Error("Unsupported weave structure.");
  if (
    art.structure === structure &&
    art.pickStructures.every((rule) => rule === structure)
  )
    return art;
  return {
    ...art,
    structure,
    interlacement: createRepeat(structure),
    pickStructures: art.weft.map(() => structure),
  };
}

/** Recolor a real group of warp ends or weft picks while retaining yarn thickness. */
export function recolorThreadGroup(
  art: Artwork,
  axis: "warp" | "weft",
  fromColor: string,
  toColor: string,
): Artwork {
  if (!/^#[0-9a-f]{6}$/i.test(fromColor) || !/^#[0-9a-f]{6}$/i.test(toColor))
    throw new Error("Yarn colors must be six-digit hex values.");
  if (fromColor.toLowerCase() === toColor.toLowerCase()) return art;
  const source = fromColor.toLowerCase();
  const threads = art[axis];
  const hasThreads = threads.some((thread) => thread.color.toLowerCase() === source);
  const draftMatches =
    axis === "weft" && art.draftWeft.color.toLowerCase() === source;
  if (!hasThreads && !draftMatches) return art;
  return {
    ...art,
    [axis]: threads.map((thread) =>
      thread.color.toLowerCase() === source
        ? { ...thread, color: toColor }
        : thread,
    ),
    draftWeft: draftMatches ? { ...art.draftWeft, color: toColor } : art.draftWeft,
  };
}

/** Arrangement repeats and scales a finite cloth image; no crossing or yarn data is changed. */
export function arrangeArtwork(
  art: Artwork,
  patch: Partial<PatternArrangement>,
): Artwork {
  const old = getArrangement(art);
  const next = parsePatternArrangement({ ...old, ...patch });
  if (
    next.composition === old.composition &&
    next.repeat === old.repeat &&
    next.scale === old.scale
  )
    return art;
  return { ...art, arrangement: next };
}

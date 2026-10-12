import {
  createRepeat,
  makeArtwork,
  PALETTE,
  type Artwork,
  type Structure,
} from "./weave";

export function makeLoomArtwork(): Artwork {
  const art = makeArtwork();
  return {
    ...art,
    warp: Array.from({ length: 48 }, (_, i) => ({
      color: PALETTE[[0, 1, 3, 0, 2, 1][Math.floor(i / 8)]].color,
      thickness: 0.8,
    })),
    weft: Array.from({ length: 28 }, (_, i) => ({
      color: PALETTE[[3, 0, 2, 0, 1, 0, 2][Math.floor(i / 4)]].color,
      thickness: 0.83,
    })),
    pickStructures: Array.from({ length: 28 }, () => "plain"),
  };
}
export function insertPick(art: Artwork): Artwork {
  if (art.weft.length >= art.rowLimit) return art;
  return {
    ...art,
    weft: [...art.weft, { ...art.draftWeft }],
    pickStructures: [...art.pickStructures, art.structure],
  };
}
export function setNextStructure(art: Artwork, structure: Structure): Artwork {
  if (art.structure === structure) return art;
  return { ...art, structure, interlacement: createRepeat(structure) };
}
export function resetCloth(art: Artwork): Artwork {
  return art.weft.length ? { ...art, weft: [], pickStructures: [] } : art;
}
export interface ConstructionHistory {
  artwork: Artwork;
  past: Artwork[];
  future: Artwork[];
}
export function editArtwork(
  state: ConstructionHistory,
  next: Artwork,
): ConstructionHistory {
  if (
    next === state.artwork ||
    JSON.stringify(next) === JSON.stringify(state.artwork)
  )
    return state;
  return {
    artwork: next,
    past: [...state.past, state.artwork].slice(-80),
    future: [],
  };
}
export function undoArtwork(state: ConstructionHistory): ConstructionHistory {
  const previous = state.past.at(-1);
  return previous
    ? {
        artwork: previous,
        past: state.past.slice(0, -1),
        future: [state.artwork, ...state.future],
      }
    : state;
}
export function redoArtwork(state: ConstructionHistory): ConstructionHistory {
  const next = state.future[0];
  return next
    ? {
        artwork: next,
        past: [...state.past, state.artwork].slice(-80),
        future: state.future.slice(1),
      }
    : state;
}

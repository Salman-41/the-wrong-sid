/** Rows are weft picks; columns are warp ends. true = warp above weft on front. */
export type Matrix = boolean[][];
export type Face = "front" | "reverse";
export type Structure = "plain" | "twill-2-2" | "satin-5" | "sateen-5";
export interface Thread {
  color: string;
  thickness: number;
}
export interface Artwork {
  version: 2;
  name: string;
  seed: number;
  warp: Thread[];
  weft: Thread[];
  structure: Structure;
  interlacement: Matrix;
  /** Each inserted pick keeps its rule; structure/interlacement describe the next pick. */
  pickStructures: Structure[];
  draftWeft: Thread;
  rowLimit: number;
}
export const STRUCTURES: Record<
  Structure,
  { label: string; description: string }
> = {
  plain: {
    label: "Plain weave",
    description:
      "Over one, under one. Each new pick reverses the previous crossing.",
  },
  "twill-2-2": {
    label: "2/2 twill",
    description:
      "Two over, two under. Each pick advances one end, forming a balanced diagonal.",
  },
  "satin-5": {
    label: "5-end satin",
    description:
      "Four-pick warp floats; one binding per end and pick. A step of two disperses the bindings.",
  },
  "sateen-5": {
    label: "5-end sateen",
    description:
      "Four-end weft floats; the complementary structure of the five-end satin.",
  },
};
export const PALETTE = [
  { name: "Cotton", color: "#E4D4B8" },
  { name: "Indigo", color: "#143D67" },
  { name: "Vermilion", color: "#C54E32" },
  { name: "Saffron", color: "#E3AC38" },
  { name: "Moss", color: "#586557" },
  { name: "Lilac", color: "#BAA7CF" },
];
export const mod = (n: number, d: number) => ((n % d) + d) % d;
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** A regular satin must visit each end once and avoid adjacent diagonal bindings. */
export function satinRepeat(
  size: number,
  step: number,
  warpFaced = true,
): Matrix {
  if (
    !Number.isInteger(size) ||
    !Number.isInteger(step) ||
    size < 5 ||
    size > 32 ||
    step <= 1 ||
    step >= size - 1 ||
    gcd(size, step) !== 1
  ) {
    throw new Error(
      "Satin needs a repeat ≥5 and a coprime step other than 1 or n−1.",
    );
  }
  return Array.from({ length: size }, (_, pick) =>
    Array.from({ length: size }, (_, end) =>
      warpFaced
        ? end !== mod(pick * step, size)
        : end === mod(pick * step, size),
    ),
  );
}
export function createRepeat(structure: Structure): Matrix {
  if (structure === "satin-5") return satinRepeat(5, 2);
  if (structure === "sateen-5") return satinRepeat(5, 2, false);
  const size = structure === "plain" ? 2 : 4;
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) =>
      structure === "plain" ? mod(col + row, 2) === 0 : mod(col - row, 4) < 2,
    ),
  );
}
export function matrixAt(matrix: Matrix, end: number, pick: number): boolean {
  return matrix[mod(pick, matrix.length)][mod(end, matrix[0].length)];
}
const repeatTable: Record<Structure, Matrix> = {
  plain: createRepeat("plain"),
  "twill-2-2": createRepeat("twill-2-2"),
  "satin-5": createRepeat("satin-5"),
  "sateen-5": createRepeat("sateen-5"),
};
export function warpOverAt(art: Artwork, end: number, pick: number): boolean {
  const rule =
    art.pickStructures[mod(pick, Math.max(1, art.pickStructures.length))] ??
    art.structure;
  return matrixAt(repeatTable[rule], end, pick);
}
export function clothDescription(art: Artwork): string {
  if (!art.weft.length) return "Unwoven warp";
  const unique = [...new Set(art.pickStructures)];
  return unique.length === 1 ? STRUCTURES[unique[0]].label : "Mixed weave";
}
/** Reverse is a physical turn about the vertical axis: mirror X AND invert over/under. */
export function crossingAt(
  art: Artwork,
  end: number,
  pick: number,
  face: Face,
): boolean {
  const sourceEnd = face === "reverse" ? art.warp.length - 1 - end : end;
  const front = warpOverAt(art, sourceEnd, pick);
  return face === "front" ? front : !front;
}
export function reverseMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => row.toReversed().map((value) => !value));
}
export function makeArtwork(structure: Structure = "plain"): Artwork {
  return {
    version: 2,
    name: "A cloth of your own",
    seed: 418,
    structure,
    interlacement: createRepeat(structure),
    pickStructures: Array.from({ length: 60 }, () => structure),
    draftWeft: { color: PALETTE[2].color, thickness: 0.83 },
    rowLimit: 60,
    warp: Array.from({ length: 60 }, (_, i) => ({
      color: PALETTE[[1, 0][Math.floor(i / 10) % 2]].color,
      thickness: 0.79,
    })),
    weft: Array.from({ length: 60 }, (_, i) => ({
      color: PALETTE[[2, 0, 3, 1, 0, 2][Math.floor(i / 10)]].color,
      thickness: 0.83,
    })),
  };
}

/** Validate untrusted visitor files; return only schema fields, never arbitrary properties. */
export function parseArtwork(json: string): Artwork {
  if (json.length > 100_000) throw new Error("Artwork file is too large.");
  const value = JSON.parse(json);
  if (
    !value ||
    (value.version !== 1 && value.version !== 2) ||
    typeof value.name !== "string" ||
    value.name.length > 120 ||
    !Number.isInteger(value.seed) ||
    value.seed < 0 ||
    value.seed > 0xffffffff ||
    !Object.hasOwn(STRUCTURES, value.structure)
  )
    throw new Error("Unrecognized artwork format.");
  function threads(list: unknown, minimum = 2): Thread[] {
    if (!Array.isArray(list) || list.length < minimum || list.length > 240)
      throw new Error("Invalid number of yarns.");
    return list.map((t) => {
      if (
        !t ||
        typeof t.color !== "string" ||
        !/^#[0-9a-f]{6}$/i.test(t.color) ||
        typeof t.thickness !== "number" ||
        !Number.isFinite(t.thickness) ||
        t.thickness < 0.35 ||
        t.thickness > 0.94
      )
        throw new Error("Invalid yarn color or thickness.");
      return { color: t.color, thickness: t.thickness };
    });
  }
  const expected = createRepeat(value.structure);
  if (JSON.stringify(value.interlacement) !== JSON.stringify(expected))
    throw new Error(
      "Crossing matrix does not match its named weave structure.",
    );
  const warp = threads(value.warp),
    weft = threads(value.weft, value.version === 2 ? 0 : 2);
  const pickStructures: Structure[] =
    value.version === 1
      ? weft.map(() => value.structure)
      : value.pickStructures;
  if (
    !Array.isArray(pickStructures) ||
    pickStructures.length !== weft.length ||
    pickStructures.some((rule) => !Object.hasOwn(STRUCTURES, rule))
  )
    throw new Error("Every woven row needs a supported weave rule.");
  const draftWeft =
    value.version === 1
      ? (weft.at(-1) ?? { color: PALETTE[2].color, thickness: 0.83 })
      : threads([value.draftWeft], 1)[0];
  const rowLimit =
    value.version === 1 ? Math.max(60, weft.length) : value.rowLimit;
  if (
    !Number.isInteger(rowLimit) ||
    rowLimit < 1 ||
    rowLimit > 240 ||
    weft.length > rowLimit
  )
    throw new Error("Invalid loom capacity.");
  return {
    version: 2,
    name: value.name,
    seed: value.seed,
    structure: value.structure,
    warp,
    weft,
    interlacement: expected,
    pickStructures: [...pickStructures],
    draftWeft: { ...draftWeft },
    rowLimit,
  };
}
export function serializeArtwork(art: Artwork): string {
  return JSON.stringify(parseArtwork(JSON.stringify(art)), null, 2);
}

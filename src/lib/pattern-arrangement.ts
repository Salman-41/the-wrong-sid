/** Graphic placement of a finite woven surface. These values do not describe interlacement. */
export type PatternComposition = "cutwork" | "ribbon" | "bias";
export type PatternRepeat = 1 | 2 | 3 | 4;

export interface PatternArrangement {
  composition: PatternComposition;
  repeat: PatternRepeat;
  scale: number;
}

export const PATTERN_COMPOSITIONS: Record<PatternComposition, string> = {
  cutwork: "Cutwork",
  ribbon: "Ribbon",
  bias: "Bias",
};

export const DEFAULT_ARRANGEMENT: PatternArrangement = {
  composition: "cutwork",
  repeat: 1,
  scale: 1,
};

/** Accept an older artwork without arrangement, but reject malformed visitor settings. */
export function parsePatternArrangement(value: unknown): PatternArrangement {
  if (value === undefined) return { ...DEFAULT_ARRANGEMENT };
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid pattern arrangement.");
  const item = value as Record<string, unknown>;
  if (
    typeof item.composition !== "string" ||
    !Object.hasOwn(PATTERN_COMPOSITIONS, item.composition) ||
    ![1, 2, 3, 4].includes(item.repeat as number) ||
    typeof item.scale !== "number" ||
    !Number.isFinite(item.scale) ||
    item.scale < 0.75 ||
    item.scale > 1.75
  )
    throw new Error("Invalid pattern arrangement.");
  return {
    composition: item.composition as PatternComposition,
    repeat: item.repeat as PatternRepeat,
    scale: item.scale,
  };
}

export function getArrangement(art: {
  arrangement?: PatternArrangement;
}): PatternArrangement {
  return art.arrangement ?? DEFAULT_ARRANGEMENT;
}

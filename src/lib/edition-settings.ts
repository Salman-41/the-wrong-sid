export type EditionLayout = "full-bleed" | "material-study" | "graphic-edition";
export type EditionFormat = "portrait" | "square" | "landscape";
export type EditionBackground = "ivory" | "plum" | "vermilion";
export interface EditionSettings {
  layout: EditionLayout;
  format: EditionFormat;
  background: EditionBackground;
  face: "front" | "reverse";
  scale: number;
  cropX: number;
  cropY: number;
  title: string;
  credit: string;
}
export const EDITION_LAYOUTS: Record<EditionLayout, { label: string; description: string }> = {
  "full-bleed": { label: "Full bleed", description: "The woven surface fills the sheet. A quiet signature completes it." },
  "material-study": { label: "Material study", description: "A close reading of yarn, with a diagram of the same crossings." },
  "graphic-edition": { label: "Graphic edition", description: "Cut cloth and expressive type, composed as a fashion editorial." },
};
export const EDITION_FORMATS = {
  portrait: { label: "Portrait", width: 2400, height: 3200 },
  square: { label: "Square", width: 2800, height: 2800 },
  landscape: { label: "Landscape", width: 3200, height: 2400 },
} as const;
export const EDITION_BACKGROUNDS = {
  ivory: { label: "Warm ivory", color: "#F2EDE5", ink: "#211725" },
  plum: { label: "Deep plum", color: "#211725", ink: "#F2EDE5" },
  vermilion: { label: "Vermilion", color: "#C54E32", ink: "#211725" },
} as const;
export const DEFAULT_EDITION: EditionSettings = {
  layout: "graphic-edition", format: "portrait", background: "ivory", face: "front",
  scale: 1, cropX: .5, cropY: .5, title: "", credit: "",
};
export function parseEditionSettings(value: unknown): EditionSettings {
  if (value === undefined) return { ...DEFAULT_EDITION };
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid edition settings.");
  const v = value as Record<string, unknown>;
  if (typeof v.layout !== "string" || !Object.hasOwn(EDITION_LAYOUTS, v.layout)
    || typeof v.format !== "string" || !Object.hasOwn(EDITION_FORMATS, v.format)
    || typeof v.background !== "string" || !Object.hasOwn(EDITION_BACKGROUNDS, v.background)
    || (v.face !== "front" && v.face !== "reverse")
    || typeof v.scale !== "number" || !Number.isFinite(v.scale) || v.scale < 1 || v.scale > 2.2
    || typeof v.cropX !== "number" || !Number.isFinite(v.cropX) || v.cropX < 0 || v.cropX > 1
    || typeof v.cropY !== "number" || !Number.isFinite(v.cropY) || v.cropY < 0 || v.cropY > 1
    || typeof v.title !== "string" || v.title.length > 48 || /[\u0000-\u001f]/.test(v.title)
    || typeof v.credit !== "string" || v.credit.length > 40 || /[\u0000-\u001f]/.test(v.credit)) throw new Error("Unrecognized edition choices.");
  return { layout: v.layout as EditionLayout, format: v.format as EditionFormat,
    background: v.background as EditionBackground, face: v.face, scale: v.scale,
    cropX: v.cropX, cropY: v.cropY, title: v.title, credit: v.credit };
}

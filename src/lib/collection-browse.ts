import { HISTORICAL_TEXTILES, type HistoricalTextileRecord } from "./collection-data";
import { COLLECTION_BROWSE_GROUPS } from "./collection-editorial";
export type CollectionBrowseBy = "objects" | "techniques" | "materials" | "places";
export type CollectionBrowseFacet = Exclude<CollectionBrowseBy, "objects">;
export interface CollectionSelection {
  by: CollectionBrowseBy;
  group?: (typeof COLLECTION_BROWSE_GROUPS)[CollectionBrowseFacet][number];
  records: readonly HistoricalTextileRecord[];
}
/** Whitelist URL choices; unknown values return the full catalogue. */
export function readCollectionSelection(query: Record<string, string | string[] | undefined>): CollectionSelection {
  const by: CollectionBrowseBy = query.by === "techniques" || query.by === "materials" || query.by === "places" ? query.by : "objects";
  const group = by === "objects" ? undefined : COLLECTION_BROWSE_GROUPS[by].find((item) => item.id === query.group);
  return { by, group, records: group ? HISTORICAL_TEXTILES.filter((record) => group.objectIds.some((id) => id === record.id)) : HISTORICAL_TEXTILES };
}
export function collectionBrowseHref(by: CollectionBrowseBy, group?: string) {
  const query = new URLSearchParams();
  if (by !== "objects") query.set("by", by);
  if (group) query.set("group", group);
  return "/collection" + (query.size ? "?" + query.toString() : "") + "#collection-works";
}

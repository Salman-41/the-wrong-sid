import type { Metadata } from "next";
import { CollectionPublication } from "@/components/collection-publication";
import { readCollectionSelection } from "@/lib/collection-browse";
export const metadata: Metadata = {
  title: "Collection — The fabric has a history",
  description: "Eleven historical textiles, from ikat and tapestry to embroidery and quilting. A close reading of authentic museum objects and their documented histories.",
};
export default async function CollectionPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CollectionPublication selection={readCollectionSelection(await searchParams)} />;
}

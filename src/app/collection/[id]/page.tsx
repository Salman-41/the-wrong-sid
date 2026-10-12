import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionObject } from "@/components/collection-object";
import { HISTORICAL_TEXTILES } from "@/lib/collection-data";

export const dynamicParams = false;
export function generateStaticParams() {
  return HISTORICAL_TEXTILES.map((record) => ({ id: record.id }));
}
async function readObject(params: Promise<{ id: string }>) {
  const { id } = await params;
  const record = HISTORICAL_TEXTILES.find((item) => item.id === id);
  if (!record) notFound();
  return record;
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const record = await readObject(params);
  return {
    title: record.title,
    description: record.title + ", " + record.date + ". " + record.medium + ". " + record.institution + ", " + record.accessionNumber + ".",
  };
}
export default async function ObjectPage({ params }: { params: Promise<{ id: string }> }) {
  return <CollectionObject record={await readObject(params)} />;
}

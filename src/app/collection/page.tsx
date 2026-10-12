import type { Metadata } from "next";
import { ExperienceInPreparation } from "@/components/experience-in-preparation";
export const metadata: Metadata = {
  title: "Collection",
  robots: { index: false, follow: true },
};
export default function CollectionPage() {
  return <ExperienceInPreparation name="Collection" />;
}

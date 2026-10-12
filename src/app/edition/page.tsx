import type { Metadata } from "next";
import { ExperienceInPreparation } from "@/components/experience-in-preparation";
export const metadata: Metadata = {
  title: "Edition",
  robots: { index: false, follow: true },
};
export default function EditionPage() {
  return <ExperienceInPreparation name="Edition" />;
}

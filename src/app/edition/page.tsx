import type { Metadata } from "next";
import { Edition } from "@/components/edition";
export const metadata: Metadata = {
  title: "Edition",
  description: "Compose your own woven textile as a full-bleed print, a material study, or a graphic edition. Export the finished artwork in high resolution.",
};
export default function EditionPage() {
  return <Edition />;
}

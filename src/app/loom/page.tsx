import type { Metadata } from "next";
import TextileStudio from "@/components/textile-studio";
export const metadata: Metadata = {
  title: "Loom",
  description:
    "A cloth of your own. Choose warp and weft yarns, change the structure, and examine the crossings.",
};
export default function LoomPage() {
  return <TextileStudio />;
}

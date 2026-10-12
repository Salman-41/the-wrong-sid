import type { Metadata } from "next";
import { Loom } from "@/components/loom";
export const metadata: Metadata = {
  title: "Loom",
  description:
    "A cloth of your own. Choose warp and weft yarns, change the structure, and examine the crossings.",
};
export default function LoomPage() {
  return <Loom />;
}

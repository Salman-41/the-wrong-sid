import type { Metadata } from "next";
import TextileStudio from "@/components/textile-studio";
export const metadata: Metadata = {
  title: "Reverse",
  description:
    "Inspect the other face of your cloth. Both sides follow the same threads and interlacement.",
};
export default function ReversePage() {
  return <TextileStudio initialFace="reverse" />;
}

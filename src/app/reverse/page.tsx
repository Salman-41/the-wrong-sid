import type { Metadata } from "next";
import { ReverseExperience } from "@/components/reverse-experience";
export const metadata: Metadata = {
  title: "Reverse",
  description:
    "Inspect the other face of your cloth. Both sides follow the same threads and interlacement.",
};
export default function ReversePage() {
  return <ReverseExperience />;
}

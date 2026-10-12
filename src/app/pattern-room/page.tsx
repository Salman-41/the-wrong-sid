import type { Metadata } from "next";
import { ExperienceInPreparation } from "@/components/experience-in-preparation";
export const metadata: Metadata = {
  title: "Pattern Room",
  robots: { index: false, follow: true },
};
export default function PatternRoomPage() {
  return <ExperienceInPreparation name="Pattern Room" />;
}

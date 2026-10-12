import type { Metadata } from "next";
import { ExperienceInPreparation } from "@/components/experience-in-preparation";
import { ProjectContinuity } from "@/components/project-continuity";
export const metadata: Metadata = {
  title: "Pattern Room",
  robots: { index: false, follow: true },
};
export default function PatternRoomPage() {
  return (
    <ExperienceInPreparation name="Pattern Room">
      <ProjectContinuity destination="pattern" />
    </ExperienceInPreparation>
  );
}

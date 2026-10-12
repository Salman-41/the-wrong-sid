"use client";
import { useTextileProject } from "./textile-project";
import { clothDescription } from "@/lib/weave";
/** Read the shared construction at each future room boundary, never clone a second project. */
export function ProjectContinuity({
  destination,
}: {
  destination: "pattern" | "edition";
}) {
  const { artwork } = useTextileProject();
  return (
    <p className="project-continuity" data-project-rows={artwork.weft.length}>
      Your cloth: <strong>{artwork.weft.length} woven rows</strong>,{" "}
      {clothDescription(artwork).toLowerCase()}.<br />
      {destination === "pattern"
        ? "These yarns and crossings will carry into the Pattern Room."
        : "This same cloth will become the basis of your edition."}
    </p>
  );
}

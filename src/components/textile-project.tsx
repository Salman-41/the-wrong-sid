"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import { makeArtwork, type Artwork } from "@/lib/weave";

interface TextileProject {
  artwork: Artwork;
  setArtwork: Dispatch<SetStateAction<Artwork>>;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
  rhythm: boolean;
  setRhythm: Dispatch<SetStateAction<boolean>>;
}
const ProjectContext = createContext<TextileProject | null>(null);

/** One visitor artwork survives App Router navigation. Persistence stays visitor-controlled. */
export function TextileProjectProvider({ children }: { children: ReactNode }) {
  const [artwork, setArtwork] = useState(makeArtwork);
  const [zoom, setZoom] = useState(2.5);
  const [rhythm, setRhythm] = useState(true);
  const project = useMemo(
    () => ({ artwork, setArtwork, zoom, setZoom, rhythm, setRhythm }),
    [artwork, zoom, rhythm],
  );
  return <ProjectContext value={project}>{children}</ProjectContext>;
}
export function useTextileProject(): TextileProject {
  const project = useContext(ProjectContext);
  if (!project)
    throw new Error("Textile project controls require TextileProjectProvider.");
  return project;
}

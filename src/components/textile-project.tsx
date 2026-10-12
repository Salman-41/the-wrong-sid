"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import type { Artwork } from "@/lib/weave";
import {
  editArtwork,
  undoArtwork,
  redoArtwork,
  makeLoomArtwork,
  type ConstructionHistory,
} from "@/lib/construction";

interface TextileProject {
  artwork: Artwork;
  /** The exact snapshot immediately before the latest edit, when available. */
  previousArtwork: Artwork | null;
  setArtwork: Dispatch<SetStateAction<Artwork>>;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
  rhythm: boolean;
  setRhythm: Dispatch<SetStateAction<boolean>>;
}
type Action =
  | { type: "edit"; update: SetStateAction<Artwork> }
  | { type: "undo" }
  | { type: "redo" };
function reducer(
  state: ConstructionHistory,
  action: Action,
): ConstructionHistory {
  if (action.type === "undo") return undoArtwork(state);
  if (action.type === "redo") return redoArtwork(state);
  return editArtwork(
    state,
    typeof action.update === "function"
      ? action.update(state.artwork)
      : action.update,
  );
}
const ProjectContext = createContext<TextileProject | null>(null);
/** A single bounded, undoable construction shared by all exhibition routes. */
export function TextileProjectProvider({ children }: { children: ReactNode }) {
  const [history, dispatch] = useReducer(reducer, undefined, () => ({
    artwork: makeLoomArtwork(),
    past: [],
    future: [],
  }));
  const [zoom, setZoom] = useState(2.5),
    [rhythm, setRhythm] = useState(true);
  const setArtwork = useCallback<Dispatch<SetStateAction<Artwork>>>(
    (update) => dispatch({ type: "edit", update }),
    [],
  );
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const project = useMemo(
    () => ({
      artwork: history.artwork,
      previousArtwork: history.past.at(-1) ?? null,
      setArtwork,
      undo,
      redo,
      canUndo: history.past.length > 0,
      canRedo: history.future.length > 0,
      zoom,
      setZoom,
      rhythm,
      setRhythm,
    }),
    [history, setArtwork, undo, redo, zoom, rhythm],
  );
  return <ProjectContext value={project}>{children}</ProjectContext>;
}
export function useTextileProject(): TextileProject {
  const project = useContext(ProjectContext);
  if (!project)
    throw new Error("Textile project controls require TextileProjectProvider.");
  return project;
}

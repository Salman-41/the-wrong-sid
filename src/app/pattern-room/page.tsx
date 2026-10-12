import type { Metadata } from "next";
import { PatternRoom } from "@/components/pattern-room";
export const metadata: Metadata = {
  title: "Pattern Room",
  description: "Cut, repeat and rearrange the woven cloth you made. Change real yarns and crossings, then explore graphic compositions.",
};
export default function PatternRoomPage() {
  return <PatternRoom />;
}

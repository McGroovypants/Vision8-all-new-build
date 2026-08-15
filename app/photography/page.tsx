import type { Metadata } from "next";
import { PhotographyView } from "./photography-view";

/*
  Ported from the approved mockup v3.2 in "Photo page/v8-photo-mockup", with
  one structural change made at the client's instruction on 15 Aug 2026: the
  Coastguard contact sheet ("Ready for anything") moves from last to directly
  below the hero, so breadth is the first thing the page says. The two arty
  breathers keep their pacing role between the remaining collections.

  The page itself, its source-truth images and copy, and the editor all live
  in photography-view.tsx: the public page here renders the defaults and never
  reads the editor's localStorage. Curation happens on /photography/editor and
  reaches this page only when a chosen layout is built back into the defaults.
*/

export const metadata: Metadata = {
  title: "Photography | Vision8",
  description: "Vision8 photography for people, organisations and events.",
};

export default function PhotographyPage() {
  return <PhotographyView />;
}

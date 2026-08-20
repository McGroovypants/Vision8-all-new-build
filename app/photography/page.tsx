import type { Metadata } from "next";
import { PhotographyView } from "./photography-view";
import { readPublishedLayout } from "./published";

/*
  Ported from the approved mockup v3.2 in "Photo page/v8-photo-mockup", with
  one structural change made at the client's instruction on 15 Aug 2026: the
  Coastguard contact sheet ("Ready for anything") moves from last to directly
  below the hero, so breadth is the first thing the page says. The two arty
  breathers keep their pacing role between the remaining collections.

  Since v1.11.39 the page renders the layout published from the editor's
  Publish to live button (Worker KV, read server-side each request) when one
  exists, and the source defaults in data.ts otherwise. The editor's unsaved
  browser draft still never reaches this page.
*/

export const metadata: Metadata = {
  title: "Photography | Vision8",
  description: "Vision8 photography for people, organisations and events.",
  alternates: { canonical: "/photography" },
};

export default async function PhotographyPage() {
  const published = await readPublishedLayout();
  return <PhotographyView published={published} />;
}

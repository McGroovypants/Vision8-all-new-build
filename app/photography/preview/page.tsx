import type { Metadata } from "next";
import { PhotographyView } from "../photography-view";
import { readPublishedLayout } from "../published";

export const metadata: Metadata = {
  title: "Vision8 photography preview",
  robots: { index: false, follow: false },
};

/*
  Loaded only inside the editor's phone-preview iframe. It renders the saved
  editor state (falling back to the published layout, then the defaults) and
  follows further edits live via `storage` events, so the 390px frame shows
  what the edited page would look like on a phone, with the page's real media
  queries in force.
*/
export default async function PhotographyPreviewPage() {
  const published = await readPublishedLayout();
  return <PhotographyView previewSaved published={published} />;
}

import type { Metadata } from "next";
import { PhotographyView } from "../photography-view";

export const metadata: Metadata = {
  title: "Vision8 photography preview",
  robots: { index: false, follow: false },
};

/*
  Loaded only inside the editor's phone-preview iframe. It renders the saved
  editor state (not the source defaults) and follows further edits live via
  `storage` events, so the 390px frame shows what the edited page would look
  like on a phone, with the page's real media queries in force.
*/
export default function PhotographyPreviewPage() {
  return <PhotographyView previewSaved />;
}

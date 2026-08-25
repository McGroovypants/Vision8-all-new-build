import type { Metadata } from "next";
import RealEstateMediaPage from "../page";
import { PaddingEditor } from "../padding-editor";
import { readPublishedRePad } from "../published";

export const metadata: Metadata = {
  title: "Vision8 real estate editor",
  /*
    Not a public page, same reasoning as the photography editor: it renders
    the same markup as /real-estate-media, so leaving it indexable would put
    a duplicate in search results competing with the real page.
  */
  robots: { index: false, follow: false },
};

/*
  [NOTE] This is not access control, exactly as with the other editors.
  Anyone who knows the path can open it, but a draft lives only in that one
  browser's localStorage; changing the public page needs the publish key.

  The page component is the public route's own default export, so the editor
  can never drift from what /real-estate-media actually renders; the panel
  overlays it and writes inline padding onto the sections.
*/
export default async function RealEstateEditorPage() {
  const published = await readPublishedRePad();
  return (
    <>
      <RealEstateMediaPage />
      <PaddingEditor published={published} />
    </>
  );
}

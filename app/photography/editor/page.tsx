import type { Metadata } from "next";
import { PhotographyView } from "../photography-view";

export const metadata: Metadata = {
  title: "Vision8 photography editor",
  /*
    Not a public page, same reasoning as /editor: it renders the same markup
    as /photography, so leaving it indexable would put a duplicate in search
    results competing with the real page.
  */
  robots: { index: false, follow: false },
};

/*
  [NOTE] This is not access control, exactly as with the homepage editor.
  Anyone who knows the path can open it, but everything it saves lives in that
  one browser's localStorage under a build-keyed name; nothing reaches the
  public site or another machine.
*/
export default function PhotographyEditorPage() {
  return <PhotographyView editable />;
}

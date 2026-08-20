import type { Metadata } from "next";
import { HomepageV1103 } from "../homepage-view-v1.10.3";

export const metadata: Metadata = {
  title: "Vision8 homepage editor",
  /*
    Not a public page. It renders the same markup as the homepage, so leaving it
    indexable would put a second copy of the front page in search results and
    let it compete with the real one.
  */
  robots: { index: false, follow: false },
};

/*
  The editor, on its own URL. It was a button on the front page until the client
  moved it here.

  The intro is skipped: 3.2 seconds of logo animation before you can change
  anything is friction with no purpose on a tool page.

  [NOTE] This is not access control. Anyone who knows the path can open it, and
  the tuning it saves lives in that one browser's localStorage under a
  build-keyed name, so nothing it does reaches the public site or another
  machine. If it ever needs to be genuinely private, that is a Worker-level
  concern, not a component one.
*/
export default function EditorPage() {
  return <HomepageV1103 skipIntro editable />;
}

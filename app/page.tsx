import type { Metadata } from "next";
import { cookies } from "next/headers";
import { HomepageV1103 } from "./homepage-view-v1.10.3";

export const metadata: Metadata = {
  // No version in the title: it goes stale and misleads. The on-page build
  // stamp is the authority.
  /*
    [NOTE] Wording is provisional and wants Andy's eye. What it replaced was a
    development placeholder, "Vision8 homepage" and "A single-screen fanned
    homepage direction for Vision8", which described the build process to
    customers. This is the most-read text on the site: it is the search result,
    the browser tab and the link preview. Two things it has to carry that the
    old text did not are what Vision8 sells and where Vision8 is.
    Title stays under 60 characters and description under 155 so neither is
    truncated in results.
  */
  title: "Vision8 | Creative media studio in Wellington, NZ",
  description:
    "Video, photography, audio, animation, real estate media, websites and AI solutions. Seven connected divisions, based in Wellington, Aotearoa New Zealand.",
  alternates: { canonical: "/" },
};

// The skip is resolved on the server and passed down. Reading the query in the
// client component instead produced a hydration mismatch: the server rendered
// the intro, React kept its markup, and the skip silently did nothing. The
// session cookie set by the homepage rides the same server path: the intro
// plays on the first visit of a browser session and is skipped after that.
export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const jar = await cookies();
  const seen = jar.get("v8-intro-seen")?.value === "1";
  return <HomepageV1103 skipIntro={seen || "skipintro" in params} />;
}

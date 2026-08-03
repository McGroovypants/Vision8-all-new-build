import type { Metadata } from "next";
import { HomepageV1103 } from "./homepage-v1.10.3";

export const metadata: Metadata = {
  // No version in the title: it goes stale and misleads. The on-page build
  // stamp is the authority.
  title: "Vision8 homepage",
  description:
    "A single-screen fanned homepage direction for Vision8.",
};

// The skip is resolved on the server and passed down. Reading the query in the
// client component instead produced a hydration mismatch: the server rendered
// the intro, React kept its markup, and the skip silently did nothing.
export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  return <HomepageV1103 skipIntro={"skipintro" in params} />;
}

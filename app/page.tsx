import type { Metadata } from "next";
import { HomepageV1103 } from "./homepage-v1.10.3";

export const metadata: Metadata = {
  // No version in the title: it goes stale and misleads. The on-page build
  // stamp is the authority.
  title: "Vision8 homepage",
  description:
    "A single-screen fanned homepage direction for Vision8.",
};

export default function Home() {
  return <HomepageV1103 />;
}

import type { Metadata } from "next";
import { WebsitesView } from "./websites-view";

/*
  Ported from the approved mock v3.4 in "Web page build/vision8-web-mock-v3.4.html"
  on 19 Aug 2026. Quiet hero, a slow filmstrip of six pieces of work with a
  fixed blurb under it, the Travelman editor on its own, then a black closing.
  Everything that moves lives in websites-view.tsx.
*/

export const metadata: Metadata = {
  title: "Websites | Vision8",
  description: "Websites and digital experiences built around what you're actually trying to achieve.",
};

export default function WebsitesPage() {
  return <WebsitesView />;
}

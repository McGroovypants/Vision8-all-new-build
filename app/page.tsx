import type { Metadata } from "next";
import { HomepageV1103 } from "./homepage-v1.10.3";

export const metadata: Metadata = {
  title: "Vision8 homepage v1.10.5",
  description:
    "A single-screen fanned homepage direction for Vision8.",
};

export default function Home() {
  return <HomepageV1103 />;
}

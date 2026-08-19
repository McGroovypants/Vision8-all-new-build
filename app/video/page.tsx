import type { Metadata } from "next";
import { PageHeader } from "../portfolio-shell";
import { VideoServices } from "./video-services";

export const metadata: Metadata = {
  title: "Video | Vision8",
  description: "Vision8 video services, from filming through to animation and finishing.",
};

// Resolved on the server and passed down, the same way the homepage handles
// skipintro: reading the query in the client component instead mismatches
// hydration and the parameter is silently dropped.
export default async function VideoPage({
  searchParams,
}: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const service = typeof params.service === "string" ? params.service : undefined;

  return (
    <main className="video-page">
      <PageHeader />
      <section className="video-section">
        <div className="video-intro">
          <h1>Everything video</h1>
          <span>From aerial filming to animation, we offer a comprehensive range of video services to bring your vision to life.</span>
        </div>
        <VideoServices openSlug={service} />
      </section>
      <p className="portfolio-build">Build v1.11.59</p>
    </main>
  );
}

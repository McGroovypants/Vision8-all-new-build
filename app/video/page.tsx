import type { Metadata } from "next";
import { PageHeader } from "../portfolio-shell";
import { VideoServices } from "./video-services";

export const metadata: Metadata = {
  title: "Video | Vision8",
  description: "Vision8 video services, from filming through to animation and finishing.",
};

export default function VideoPage() {
  return (
    <main className="video-page">
      <PageHeader />
      <section className="video-section">
        <div className="video-intro">
          <h1>Everything video</h1>
          <span>From aerial filming to animation, we offer a comprehensive range of video services to bring your vision to life.</span>
        </div>
        <VideoServices />
      </section>
      <p className="portfolio-build">Build v1.11.5</p>
    </main>
  );
}

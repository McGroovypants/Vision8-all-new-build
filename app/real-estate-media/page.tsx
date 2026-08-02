import type { Metadata } from "next";
import { HoldingNotice, PortfolioShell } from "../portfolio-shell";
import { ReelPlayer } from "../reel-player";

const HERO = "https://res.cloudinary.com/deyb4o5qz/image/upload/f_auto,q_auto,w_1800/v1785656289/Real_estate_shot_rrts1z.jpg";

export const metadata: Metadata = {
  title: "Vision8 Real Estate Media",
  description: "Property photography and video by Vision8 Real Estate Media.",
};

export default function RealEstateMediaPage() {
  return (
    <PortfolioShell eyebrow="Vision8 Real Estate Media" title="Property stories, ready to move." intro="Photography and video for property marketing." heroImage={HERO}>
      <div className="portfolio-intro-grid">
        <h2>Instant reel playback, with music available when the viewer chooses.</h2>
        <HoldingNotice>The player is ready for muted autoplay, a Play with sound button and low initial volume. The final real-estate reel URL is still required.</HoldingNotice>
      </div>
      <ReelPlayer poster={HERO} />
      <div className="photo-window-grid" aria-label="Real estate photography placeholders">
        {Array.from({ length: 8 }, (_, index) => <div className="photo-window" key={index}>Property image {index + 1}</div>)}
      </div>
    </PortfolioShell>
  );
}

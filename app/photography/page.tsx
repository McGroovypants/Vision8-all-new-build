import type { Metadata } from "next";
import { HoldingNotice, PortfolioShell } from "../portfolio-shell";

const HERO = "https://res.cloudinary.com/deyb4o5qz/image/upload/f_auto,q_auto,w_1800/v1778472411/Screen_Shot_2019-02-15_at_3.41.50_PM_qxffmz.jpg";

export const metadata: Metadata = {
  title: "Photography | Vision8",
  description: "Vision8 photography for people, organisations and events.",
};

export default function PhotographyPage() {
  return (
    <PortfolioShell eyebrow="Photography" title="Still work with purpose." intro="People, places, campaigns and events." heroImage={HERO}>
      <div className="portfolio-intro-grid">
        <h2>A clear home for the complete photography portfolio.</h2>
        <HoldingNotice>The supplied gallery link will populate these collections with the full selected image set.</HoldingNotice>
      </div>
      <div className="portfolio-card-grid">
        {['Primary ITO', 'Coastguard', 'OSPRI', 'Events'].map((title) => (
          <article className="portfolio-card" key={title}><span>Photography collection</span><h3>{title}</h3></article>
        ))}
      </div>
    </PortfolioShell>
  );
}

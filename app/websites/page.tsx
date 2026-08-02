import type { Metadata } from "next";
import { HoldingNotice, PortfolioShell } from "../portfolio-shell";

const HERO = "https://res.cloudinary.com/deyb4o5qz/image/upload/f_auto,q_auto,w_1800/v1785662591/Octacle_website_shot_bjyjec.png";

export const metadata: Metadata = {
  title: "Websites | Vision8",
  description: "Useful digital experiences designed and built by Vision8.",
};

export default function WebsitesPage() {
  return (
    <PortfolioShell eyebrow="Websites" title="Useful digital experiences." intro="Structure, design and practical website builds." heroImage={HERO}>
      <div className="portfolio-intro-grid">
        <h2>Case studies built around the problem, the work and the outcome.</h2>
        <HoldingNotice>The portfolio structure is ready. Approved projects and result details can be added next.</HoldingNotice>
      </div>
      <div className="portfolio-card-grid">
        {['Project challenge', 'Design direction', 'Working build', 'Measured outcome'].map((title) => (
          <article className="portfolio-card" key={title}><span>Case-study structure</span><h3>{title}</h3></article>
        ))}
      </div>
    </PortfolioShell>
  );
}

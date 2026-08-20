import type { Metadata } from "next";
import { HoldingNotice, PortfolioShell } from "../portfolio-shell";

const HERO = "https://res.cloudinary.com/deyb4o5qz/image/upload/f_auto,q_auto,w_1800/v1785666643/AI_Solutions_waczmv.png";

export const metadata: Metadata = {
  title: "AI Solutions | Vision8",
  description: "Focused AI tools, custom apps and practical automation.",
  alternates: { canonical: "/ai-solutions" },
};

export default function AiSolutionsPage() {
  return (
    <PortfolioShell eyebrow="AI Solutions" title="Useful tools, built for the job." intro="Focused AI tools, custom apps and practical automation." heroImage={HERO}>
      <div className="portfolio-intro-grid">
        <h2>Show the useful result, not the technology for its own sake.</h2>
        <HoldingNotice>The portfolio structure is ready for approved tools, demonstrations and outcomes.</HoldingNotice>
      </div>
      <div className="portfolio-card-grid">
        {['The need', 'The tool', 'How it works', 'The result'].map((title) => (
          <article className="portfolio-card" key={title}><span>Case-study structure</span><h3>{title}</h3></article>
        ))}
      </div>
    </PortfolioShell>
  );
}

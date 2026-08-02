import type { Metadata } from "next";
import { HoldingNotice, PortfolioShell } from "../portfolio-shell";

export const metadata: Metadata = {
  title: "Audio Division | Vision8",
  description: "Music composition, audio engineering, mixing and mastering.",
};

export default function AudioPage() {
  return (
    <PortfolioShell eyebrow="Audio Division" title="From first note to final master." intro="Professional musicians, sound design, audio mixing and mastering.">
      <div className="portfolio-intro-grid">
        <h2>Music and sound finished to a professional standard.</h2>
        <HoldingNotice>Audio examples and credits can be added here without changing the homepage structure.</HoldingNotice>
      </div>
      <div className="portfolio-card-grid">
        {['Music composition', 'Professional musicians', 'Sound design', 'Mixing & mastering'].map((title) => (
          <article className="portfolio-card" key={title}><span>Audio capability</span><h3>{title}</h3></article>
        ))}
      </div>
    </PortfolioShell>
  );
}

import Image from "next/image";
import type { ReactNode } from "react";

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const LOGO = `${CLOUD}/image/upload/v1785634240/new_vision8_logo_design_clean_2_whfcvy.png`;
const VIDEO_SITE = "https://mcgroovypants.github.io/V8-website-2026/";

export function PortfolioShell({
  eyebrow,
  title,
  intro,
  heroImage,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  heroImage?: string;
  children: ReactNode;
}) {
  return (
    <main className="portfolio-shell">
      <header className="portfolio-header">
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href={`${VIDEO_SITE}#team`}>About us</a>
          <a href={VIDEO_SITE}>Our mahi</a>
        </nav>
        <a href="mailto:hello@vision8.co.nz">Contact</a>
      </header>

      <section className="portfolio-hero">
        {heroImage && <div className="portfolio-hero-image" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden="true" />}
        <div className="portfolio-hero-wash" aria-hidden="true" />
        <div className="portfolio-hero-copy">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <span>{intro}</span>
        </div>
        <a className="portfolio-home-mark" href="/" aria-label="Vision8 homepage">
          <Image src={LOGO} alt="Vision8" width={1976} height={704} priority unoptimized />
        </a>
      </section>

      <div className="portfolio-content">{children}</div>
      <p className="portfolio-build">Build v1.10.18</p>
    </main>
  );
}

export function HoldingNotice({ children }: { children: ReactNode }) {
  return <p className="holding-notice">{children}</p>;
}

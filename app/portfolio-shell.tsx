import Image from "next/image";
import type { ReactNode } from "react";

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const LOGO = `${CLOUD}/image/upload/v1785634240/new_vision8_logo_design_clean_2_whfcvy.png`;
const BUILD = "v1.10.23";

// Returning to the homepage from an internal page should not replay the 3.2s
// logo intro; it is an opening, not a transition. The homepage reads this and
// starts in its settled state.
const HOME = "/?skipintro=1";

export function PageHeader() {
  return (
    <header className="portfolio-header">
      <a className="portfolio-brand" href={HOME} aria-label="Vision8 home">
        <Image src={LOGO} alt="Vision8" width={1976} height={704} priority unoptimized />
      </a>
      <nav aria-label="Primary navigation">
        <a href={HOME}>Home</a>
        <a href="/about">About us</a>
        <a href="/video">Our mahi</a>
      </nav>
      <a className="portfolio-contact" href="mailto:hello@vision8.co.nz">Contact</a>
    </header>
  );
}

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
      <PageHeader />

      <section className="portfolio-hero">
        {heroImage && <div className="portfolio-hero-image" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden="true" />}
        <div className="portfolio-hero-wash" aria-hidden="true" />
        <div className="portfolio-hero-copy">
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <span>{intro}</span>
        </div>
      </section>

      <div className="portfolio-content">{children}</div>
      <p className="portfolio-build">Build {BUILD}</p>
    </main>
  );
}

export function HoldingNotice({ children }: { children: ReactNode }) {
  return <p className="holding-notice">{children}</p>;
}

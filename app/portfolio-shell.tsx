import Image from "next/image";
import type { ReactNode } from "react";
import { CONTACT } from "./site";

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const LOGO = `${CLOUD}/image/upload/v1785634240/new_vision8_logo_design_clean_2_whfcvy.png`;
// Exported for the photography editor: its localStorage key is derived from
// the build, the same guard the homepage editor uses (trap 4 in AGENTS.md).
export const BUILD = "v1.11.73";

// Returning to the homepage from an internal page should not replay the 3.2s
// logo intro; it is an opening, not a transition. The homepage reads this and
// starts in its settled state.
const HOME = "/?skipintro=1";

// `division` renders a spaced-caps wordmark beside the logo, styled to read as
// one lockup, for pages that carry their own sub-brand.
export function PageHeader({ division }: { division?: string }) {
  return (
    <header className="portfolio-header">
      <a className="portfolio-brand" href={HOME} aria-label="Vision8 home">
        <Image src={LOGO} alt="Vision8" width={1976} height={704} priority unoptimized />
      </a>
      {division && <span className="portfolio-division">{division}</span>}
      <nav aria-label="Primary navigation">
        <a href={HOME}>Home</a>
        <a href="/about">About us</a>
        {/*
          [NOTE] `.portfolio-header nav a:nth-child(3)` hides this link below
          520px, and that selector is positional, so adding or reordering items
          here silently changes which one disappears on a phone. FAQ was added
          as a fourth item in v1.11.69 and taken out again in v1.11.71: it
          pushed the header to five items and, because "Our mahi" is the third
          child, left phones showing FAQ while the portfolio link vanished.
          FAQ lives in the footer, which every page carries.
        */}
        <a href="/video">Our mahi</a>
      </nav>
      <a className="portfolio-contact" href="/contact">Contact</a>
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
      <SiteFooter />
    </main>
  );
}

export function HoldingNotice({ children }: { children: ReactNode }) {
  return <p className="holding-notice">{children}</p>;
}

/*
  v1.11.68. Every page carried the build stamp and nothing else at the foot, so
  the site never said where it is. Five of eight pages contained no mention of
  Wellington, New Zealand or Aotearoa anywhere, which for a studio whose market
  is domestic was the largest missed signal on the site, both for local search
  and for a model trying to answer a location-qualified question.

  Deliberately no phone number: it belongs on /contact, not on every page. The
  email is here because it is the studio's public address anyway.

  Not used on the homepage. That is a single locked screen with `overflow:
  hidden` on the document (trap 8), and a footer below the fan would either be
  unreachable or break the fan geometry the test suite measures.
*/
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="site-footer-place">{CONTACT.placeLong}</p>
      <p className="site-footer-links">
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <span aria-hidden="true">·</span>
        <a href="/faq">FAQ</a>
        <span aria-hidden="true">·</span>
        <a href="/contact">Contact</a>
      </p>
      <p className="site-footer-build">Build {BUILD}</p>
    </footer>
  );
}

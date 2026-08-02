"use client";

import Image from "next/image";
import { useState } from "react";

type DivisionId = "home" | "filming" | "photography" | "motion" | "websites" | "ai" | "real-estate";

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const LOGO = `${CLOUD}/image/upload/v1784608757/Vision8_logo_2026_mzb4xq.png`;
const VIDEO_SITE = "https://mcgroovypants.github.io/V8-website-2026/";
const LENSWORKS = "https://lensworks.co.nz/";

const divisions: Array<{
  id: Exclude<DivisionId, "home">;
  label: string;
  kicker: string;
  headline: string;
  body: string;
  image?: string;
  href?: string;
}> = [
  {
    id: "filming",
    label: "Filming",
    kicker: "Filming",
    headline: "Ideas through to delivery.",
    body: "Concept, production, filming, editing and delivery.",
    image: `${CLOUD}/video/upload/f_jpg,w_1800,q_auto,so_14/Vision8_2025_Reel_HEADER_2_j12y5e`,
  },
  {
    id: "photography",
    label: "Photography",
    kicker: "Photography",
    headline: "Still work with purpose.",
    body: "People, places, campaigns and events.",
    image: `${CLOUD}/image/upload/f_auto,q_auto,w_1800/IMGC9782_boak3q`,
  },
  {
    id: "motion",
    label: "Motion & Animation",
    kicker: "Motion and animation",
    headline: "Make complex things clear.",
    body: "Motion graphics, animation and explainers.",
    image: `${CLOUD}/video/upload/f_jpg,w_1800,q_auto,so_5/Vision8_Animation_Motion_Gfx_h0emew`,
  },
  {
    id: "websites",
    label: "Websites",
    kicker: "Websites",
    headline: "Useful digital experiences.",
    body: "Structure, design and practical website builds.",
  },
  {
    id: "ai",
    label: "AI Solutions",
    kicker: "AI solutions",
    headline: "Useful tools, built for the job.",
    body: "Useful AI tools, custom apps and focused automation.",
  },
  {
    id: "real-estate",
    label: "Real Estate Media",
    kicker: "Real estate media",
    headline: "Property media through Lensworks.",
    body: "Photography and video for property marketing.",
    href: LENSWORKS,
  },
];

const home = {
  id: "home" as const,
  kicker: "Creative thinking / Hands-on making",
  headline: "Think it through. Make it work.",
  body: "Six connected divisions, shaped around what the project actually needs.",
  image: `${CLOUD}/video/upload/f_jpg,w_1800,q_auto,so_20/Vision8_sky_and_water_Reel_1_uzx4vi`,
};

function LogoIntro({ sequence, skipped, onSkip }: {
  sequence: number;
  skipped: boolean;
  onSkip: () => void;
}) {
  return (
    <div key={sequence} className={`logo-intro${skipped ? " intro-skipped" : ""}`}>
      <div className="intro-stage">
        <Image src={LOGO} alt="Vision8" width={2048} height={768} priority unoptimized />
      </div>
      <button type="button" onClick={onSkip}>Skip intro</button>
    </div>
  );
}

function Header({ onHome, onReplay }: { onHome: () => void; onReplay: () => void }) {
  return (
    <header className="site-header">
      <nav className="header-left" aria-label="Homepage navigation">
        <button type="button" onClick={onHome}>Home</button>
        <a href={VIDEO_SITE}>Selected work</a>
      </nav>

      <button className="header-logo" type="button" onClick={onReplay} aria-label="Replay Vision8 logo introduction">
        <Image src={LOGO} alt="Vision8" width={2048} height={768} priority unoptimized />
      </button>

      <nav className="header-right" aria-label="Contact navigation">
        <span>Homepage review v1.8</span>
        <a href="mailto:hello@vision8.co.nz">Talk to us</a>
      </nav>
    </header>
  );
}

export function HomepageV18() {
  const [activeId, setActiveId] = useState<DivisionId>("home");
  const [sequence, setSequence] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const active = activeId === "home" ? home : divisions.find((division) => division.id === activeId) ?? home;

  function selectHome() {
    setActiveId("home");
  }

  function replayIntro() {
    setSkipped(false);
    setSequence((current) => current + 1);
  }

  return (
    <main className="v18-shell">
      <LogoIntro sequence={sequence} skipped={skipped} onSkip={() => setSkipped(true)} />
      <Header onHome={selectHome} onReplay={replayIntro} />

      <section className={`home-stage active-${active.id}`}>
        <div
          key={active.id}
          className={`stage-image${active.image ? " has-image" : ""}`}
          style={active.image ? { backgroundImage: `url(${active.image})` } : undefined}
          aria-hidden="true"
        />
        <div className="stage-wash" aria-hidden="true" />

        <div className="fan" aria-label="Vision8 divisions">
          <div className="fan-lines" aria-hidden="true">
            {divisions.map((division) => (
              <span key={division.id} className={`fan-line line-${division.id}${activeId === division.id ? " active" : ""}`} />
            ))}
          </div>

          <div className="fan-nodes">
            {divisions.map((division) => {
              const className = `fan-node node-${division.id}${activeId === division.id ? " active" : ""}`;
              const shared = {
                onMouseEnter: () => setActiveId(division.id),
                onFocus: () => setActiveId(division.id),
              };

              if (division.href) {
                return (
                  <a key={division.id} className={className} href={division.href} {...shared}>
                    {division.label}
                  </a>
                );
              }

              return (
                <button
                  key={division.id}
                  type="button"
                  className={className}
                  aria-pressed={activeId === division.id}
                  onClick={() => setActiveId(division.id)}
                  {...shared}
                >
                  {division.label}
                </button>
              );
            })}
          </div>

          <button className="fan-core" type="button" onClick={selectHome} aria-label="Return to the Vision8 homepage">
            <Image src={LOGO} alt="Vision8" width={2048} height={768} priority unoptimized />
          </button>
        </div>

        <div className="stage-copy" key={`copy-${active.id}`} aria-live="polite">
          <p>{active.kicker}</p>
          <h1>{active.headline}</h1>
          <div className="copy-row">
            <span>{active.body}</span>
            {active.id === "real-estate" ? (
              <a href={LENSWORKS}>Visit Lensworks <b aria-hidden="true">→</b></a>
            ) : (
              <a href="mailto:hello@vision8.co.nz">Talk through a project <b aria-hidden="true">→</b></a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

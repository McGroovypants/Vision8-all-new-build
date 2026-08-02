"use client";

import Image from "next/image";
import { useState } from "react";

type DivisionId = "home" | "filming" | "photography" | "motion" | "websites" | "ai" | "real-estate";

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const LOGO = `${CLOUD}/image/upload/v1785634240/new_vision8_logo_design_clean_2_whfcvy.png`;
const VIDEO_SITE = "https://mcgroovypants.github.io/V8-website-2026/";
const PEOPLE = `${VIDEO_SITE}#team`;
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
    id: "motion",
    label: "Motion & Animation",
    kicker: "Motion and animation",
    headline: "Make complex things clear.",
    body: "Motion graphics, animation and explainers.",
    image: `${CLOUD}/video/upload/f_jpg,w_1800,q_auto,so_5/Vision8_Animation_Motion_Gfx_h0emew`,
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
    id: "filming",
    label: "Video",
    kicker: "Video",
    headline: "Ideas through to delivery.",
    body: "Concept, production, filming, editing and delivery.",
    image: `${CLOUD}/video/upload/f_jpg,w_1800,q_auto,so_14/Vision8_2025_Reel_HEADER_2_j12y5e`,
  },
  {
    id: "real-estate",
    label: "Real Estate Media",
    kicker: "Real estate media",
    headline: "Property media through Lensworks.",
    body: "Photography and video for property marketing.",
    href: LENSWORKS,
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
];

const home = {
  id: "home" as const,
  kicker: "Creative thinking / Hands-on making",
  headline: "Think it through. Make it work.",
  body: "Six connected divisions, shaped around what the project actually needs.",
  image: `${CLOUD}/video/upload/f_jpg,w_1800,q_auto,so_20/Vision8_sky_and_water_Reel_1_uzx4vi`,
};

function LogoIntro({ skipped, onSkip }: { skipped: boolean; onSkip: () => void }) {
  return (
    <div className={`logo-intro${skipped ? " intro-skipped" : ""}`}>
      <div className="intro-stage">
        <Image src={LOGO} alt="Vision8" width={1976} height={704} priority unoptimized />
      </div>
      <button type="button" onClick={onSkip}>Skip intro</button>
    </div>
  );
}

function Header({ onHome }: { onHome: () => void }) {
  return (
    <header className="site-header">
      <nav className="header-left" aria-label="Homepage navigation">
        <button type="button" onClick={onHome}>Home</button>
        <a href={PEOPLE}>About us</a>
        <a href={VIDEO_SITE}>Our mahi</a>
      </nav>

      <nav className="header-right" aria-label="Contact navigation">
        <a href="mailto:hello@vision8.co.nz">Contact</a>
      </nav>
    </header>
  );
}

export function HomepageV182() {
  const [activeId, setActiveId] = useState<DivisionId>("home");
  const [skipped, setSkipped] = useState(false);
  const active = activeId === "home" ? home : divisions.find((division) => division.id === activeId) ?? home;

  function selectHome() {
    setActiveId("home");
  }

  return (
    <main className="v182-shell">
      <LogoIntro skipped={skipped} onSkip={() => setSkipped(true)} />
      <Header onHome={selectHome} />

      <section className={`home-stage active-${active.id}`}>
        <div
          key={active.id}
          className={`stage-image${active.image ? " has-image" : ""}`}
          style={active.image ? { backgroundImage: `url(${active.image})` } : undefined}
          aria-hidden="true"
        />
        <div className="stage-wash" aria-hidden="true" />

        <div className="fan" aria-label="Vision8 divisions">
          {divisions.map((division) => {
            const activeClass = activeId === division.id ? " active" : "";
            const nodeClass = `fan-node${activeClass}`;
            const shared = {
              onMouseEnter: () => setActiveId(division.id),
              onFocus: () => setActiveId(division.id),
            };

            return (
              <div key={division.id} className={`fan-branch branch-${division.id}${activeClass}`}>
                <span className="fan-line" aria-hidden="true" />
                {division.href ? (
                  <a className={nodeClass} href={division.href} {...shared}>
                    <span>{division.label}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    className={nodeClass}
                    aria-pressed={activeId === division.id}
                    onClick={() => setActiveId(division.id)}
                    {...shared}
                  >
                    <span>{division.label}</span>
                  </button>
                )}
              </div>
            );
          })}

          <button className="fan-core" type="button" onClick={selectHome} aria-label="Return to the Vision8 homepage">
            <Image src={LOGO} alt="Vision8" width={1976} height={704} priority unoptimized />
          </button>
        </div>

        <div className="stage-copy" key={`copy-${active.id}`} aria-live="polite">
          <p>{active.kicker}</p>
          <h1>{active.headline}</h1>
          <div className="copy-row">
            <span>{active.body}</span>
            {active.id === "real-estate" && (
              <a href={LENSWORKS}>Visit Lensworks <b aria-hidden="true">→</b></a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

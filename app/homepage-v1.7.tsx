"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type DivisionId = "home" | "filming" | "photography" | "motion" | "websites" | "apps";
type MediaMode = "home" | "filming" | "photography" | "motion" | "digital";

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const LOGO = `${CLOUD}/image/upload/v1784608757/Vision8_logo_2026_mzb4xq.png`;
const EIGHT = `${CLOUD}/image/upload/c_crop,g_east,w_520,h_760/f_auto,q_auto/v1784608757/Vision8_logo_2026_mzb4xq.png`;
const VIDEO_SITE = "https://mcgroovypants.github.io/V8-website-2026/";

const assets = {
  flagshipVideo: `${CLOUD}/video/upload/so_10,eo_18,w_1600,q_auto,vc_auto/Vision8_2025_Reel_HEADER_2_j12y5e.mp4`,
  flagshipPoster: `${CLOUD}/video/upload/f_jpg,w_1600,q_auto,so_14/Vision8_2025_Reel_HEADER_2_j12y5e`,
  foodVideo: `${CLOUD}/video/upload/w_1400,q_auto,vc_auto/Vision8_Food_Reel_1_pn4hog.mp4`,
  foodPoster: `${CLOUD}/video/upload/f_jpg,w_1200,q_auto,so_10/Vision8_Food_Reel_1_pn4hog`,
  waterPoster: `${CLOUD}/video/upload/f_jpg,w_1000,q_auto,so_20/Vision8_sky_and_water_Reel_1_uzx4vi`,
  motionVideo: `${CLOUD}/video/upload/w_1400,q_auto,vc_auto/Vision8_Animation_Motion_Gfx_h0emew.mp4`,
  motionPoster: `${CLOUD}/video/upload/f_jpg,w_1200,q_auto,so_5/Vision8_Animation_Motion_Gfx_h0emew`,
  photoOne: `${CLOUD}/image/upload/f_auto,q_auto,w_1200/IMGC9782_boak3q`,
  photoTwo: `${CLOUD}/image/upload/f_auto,q_auto,w_1200/IMGC9363_umqh6w`,
};

const divisions: Array<{
  id: DivisionId;
  label: string;
  kicker: string;
  headline: string;
  body: string;
  detail: string;
  media: MediaMode;
}> = [
  {
    id: "home",
    label: "Home",
    kicker: "Creative thinking / Hands-on making",
    headline: "Think it through. Make it work.",
    body: "Filming, photography, motion, websites and practical apps, shaped around what the project actually needs.",
    detail: "Ideas to delivery, with the thinking kept close to the making.",
    media: "home",
  },
  {
    id: "filming",
    label: "Filming",
    kicker: "Filming and video production",
    headline: "Clear ideas, properly made.",
    body: "Concept, scripting, planning, direction, filming, editing and delivery, handled as one connected job.",
    detail: "Small crews when that is smarter. Full production when the work demands it.",
    media: "filming",
  },
  {
    id: "photography",
    label: "Photography",
    kicker: "Photography",
    headline: "Still work with real purpose.",
    body: "People, places, campaigns and events photographed with the same care given to the moving image.",
    detail: "Strong on its own, or planned alongside filming for a consistent visual story.",
    media: "photography",
  },
  {
    id: "motion",
    label: "Motion",
    kicker: "Animation and motion content",
    headline: "Make complex things clear.",
    body: "Animation, explainers and motion design that help an audience understand the idea quickly.",
    detail: "From the first script and storyboard through to the finished sequence.",
    media: "motion",
  },
  {
    id: "websites",
    label: "Websites",
    kicker: "Website design and building",
    headline: "Useful digital experiences.",
    body: "Clear structure, thoughtful design and practical builds shaped around the audience and the job.",
    detail: "Digital thinking without the layers of a conventional software agency.",
    media: "digital",
  },
  {
    id: "apps",
    label: "Practical apps",
    kicker: "Focused digital tools",
    headline: "Built around the job.",
    body: "Practical custom apps that make a process clearer, faster or easier for the people using it.",
    detail: "Start with the need, then build only what helps.",
    media: "digital",
  },
];

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

function LogoIntro({ sequence, skipped, onSkip }: {
  sequence: number;
  skipped: boolean;
  onSkip: () => void;
}) {
  return (
    <div
      key={sequence}
      className={`logo-intro${skipped ? " intro-skipped" : ""}`}
      aria-label="Vision8 animated introduction"
    >
      <div className="intro-stage">
        <Image src={LOGO} alt="Vision8" width={2048} height={768} priority unoptimized />
      </div>
      <button type="button" onClick={onSkip}>Skip intro</button>
    </div>
  );
}

function WorkVideo({ src, poster, className = "", priority = false }: {
  src: string;
  poster: string;
  className?: string;
  priority?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (priority) {
      void video.play().catch(() => undefined);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div className={`media-frame media-wide ${className}`} style={{ backgroundImage: `url(${poster})` }}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload={priority ? "metadata" : "none"}
        poster={poster}
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}

function Poster({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`media-frame media-square ${className}`}>
      <Image src={src} alt={alt} fill sizes="(max-width: 820px) 34vw, 24vw" unoptimized />
    </div>
  );
}

function MediaStage({ mode, label }: { mode: MediaMode; label: string }) {
  if (mode === "photography") {
    return (
      <div className="media-stage photo-stage" aria-label="Selected Vision8 photography">
        <Poster src={assets.photoOne} alt="Selected Vision8 photography" className="photo-one" />
        <Poster src={assets.photoTwo} alt="Selected Vision8 photography" className="photo-two" />
        <p className="stage-caption"><span>Selected photography</span> People / place / detail</p>
      </div>
    );
  }

  if (mode === "digital") {
    return (
      <div className="media-stage digital-stage" aria-label={`${label} division`}>
        <div className="digital-eight" aria-hidden="true">
          <Image src={EIGHT} alt="" fill sizes="45vw" unoptimized />
        </div>
        <div className="digital-lines">
          <span>Understand the need</span>
          <span>Shape the experience</span>
          <span>Build what helps</span>
        </div>
        <p className="stage-caption"><span>{label}</span> Strategy / design / build</p>
      </div>
    );
  }

  const primary = mode === "filming"
    ? { video: assets.foodVideo, poster: assets.foodPoster }
    : mode === "motion"
      ? { video: assets.motionVideo, poster: assets.motionPoster }
      : { video: assets.flagshipVideo, poster: assets.flagshipPoster };

  return (
    <div className={`media-stage asymmetric-stage stage-${mode}`} aria-label={`Selected ${label.toLowerCase()} work`}>
      <WorkVideo src={primary.video} poster={primary.poster} className="stage-primary" priority />
      <Poster
        src={mode === "motion" ? assets.foodPoster : assets.waterPoster}
        alt="Selected Vision8 work"
        className="stage-support-one"
      />
      <Poster
        src={mode === "filming" ? assets.flagshipPoster : assets.motionPoster}
        alt="Selected Vision8 work"
        className="stage-support-two"
      />
      <p className="stage-caption"><span>Selected work</span> Ideas / craft / delivery</p>
    </div>
  );
}

function SiteHeader({ onReplay }: { onReplay: () => void }) {
  return (
    <header className="site-header">
      <div className="header-side header-left">
        <a href={VIDEO_SITE}>Selected work</a>
      </div>
      <button className="header-logo" type="button" onClick={onReplay} aria-label="Replay Vision8 logo introduction">
        <Image src={LOGO} alt="Vision8" width={2048} height={768} priority unoptimized />
      </button>
      <div className="header-side header-right">
        <span>Homepage review v1.7</span>
        <a href="mailto:hello@vision8.co.nz">Talk to us</a>
      </div>
    </header>
  );
}

export function HomepageV17() {
  const [activeId, setActiveId] = useState<DivisionId>("home");
  const [sequence, setSequence] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const active = divisions.find((division) => division.id === activeId) ?? divisions[0];

  function replayIntro() {
    setSkipped(false);
    setSequence((current) => current + 1);
  }

  return (
    <main className="v17-shell">
      <LogoIntro sequence={sequence} skipped={skipped} onSkip={() => setSkipped(true)} />
      <SiteHeader onReplay={replayIntro} />

      <section className="division-viewport" aria-live="polite">
        <article className="division-panel" key={active.id}>
          <div className="division-copy">
            <p className="division-kicker">{active.kicker}</p>
            <h1>{active.headline}</h1>
            <p className="division-body">{active.body}</p>
            <p className="division-detail">{active.detail}</p>
            <div className="division-actions">
              <a className="primary-action" href="mailto:hello@vision8.co.nz">Talk through a project <Arrow /></a>
              <a className="secondary-action" href={VIDEO_SITE}>View selected work</a>
            </div>
          </div>

          <MediaStage mode={active.media} label={active.label} />
        </article>
      </section>

      <nav className="division-menu" aria-label="Vision8 divisions">
        <span className="menu-title">Divisions</span>
        <div className="menu-items" aria-label="Choose a Vision8 division">
          {divisions.map((division) => (
            <button
              key={division.id}
              type="button"
              aria-pressed={activeId === division.id}
              className={activeId === division.id ? "active" : ""}
              onClick={() => setActiveId(division.id)}
            >
              {division.label}
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}

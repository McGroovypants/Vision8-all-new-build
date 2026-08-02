"use client";

import { useState } from "react";

type ConceptId = "one" | "two";

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const LOGO = `${CLOUD}/image/upload/v1784608757/Vision8_logo_2026_mzb4xq.png`;
const VIDEO_SITE = "https://mcgroovypants.github.io/V8-website-2026/";

const media = {
  heroVideo: `${CLOUD}/video/upload/so_10,eo_18,w_1600,q_auto,vc_auto/Vision8_2025_Reel_HEADER_2_j12y5e.mp4`,
  heroPoster: `${CLOUD}/video/upload/w_1600,q_auto,so_14/Vision8_2025_Reel_HEADER_2_j12y5e.jpg`,
  foodVideo: `${CLOUD}/video/upload/w_1100,q_auto,vc_auto/Vision8_Food_Reel_1_pn4hog.mp4`,
  foodPoster: `${CLOUD}/video/upload/w_1100,q_auto,so_10/Vision8_Food_Reel_1_pn4hog.jpg`,
  waterVideo: `${CLOUD}/video/upload/w_1100,q_auto,vc_auto/Vision8_sky_and_water_Reel_1_uzx4vi.mp4`,
  waterPoster: `${CLOUD}/video/upload/w_1100,q_auto,so_20/Vision8_sky_and_water_Reel_1_uzx4vi.jpg`,
  cultureVideo: `${CLOUD}/video/upload/w_1100,q_auto,vc_auto/Vision8_Te_Ao_Maori_Reel_1_ck0nsf.mp4`,
  culturePoster: `${CLOUD}/video/upload/w_1100,q_auto,so_25/Vision8_Te_Ao_Maori_Reel_1_ck0nsf.jpg`,
  motionVideo: `${CLOUD}/video/upload/w_1100,q_auto,vc_auto/Vision8_Animation_Motion_Gfx_h0emew.mp4`,
  motionPoster: `${CLOUD}/video/upload/w_1100,q_auto,so_5/Vision8_Animation_Motion_Gfx_h0emew.jpg`,
  testimonialVideo: `${CLOUD}/video/upload/w_1400,q_auto,vc_auto/Vision8_Testimonials_Reels_V1_udukwv.mp4`,
  testimonialPoster: `${CLOUD}/video/upload/w_1400,q_auto,so_8/Vision8_Testimonials_Reels_V1_udukwv.jpg`,
};

const concepts: Array<{ id: ConceptId; number: string; title: string }> = [
  { id: "one", number: "01", title: "Ideas to delivery" },
  { id: "two", number: "02", title: "Think. Plan. Make." },
];

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

function IntroSequence({
  concept,
  sequenceKey,
  skipped,
  onSkip,
}: {
  concept: ConceptId;
  sequenceKey: number;
  skipped: boolean;
  onSkip: () => void;
}) {
  return (
    <div
      key={`${concept}-${sequenceKey}`}
      className={`logo-intro logo-intro-${concept}${skipped ? " intro-skipped" : ""}`}
      aria-label="Vision8 animated introduction"
    >
      <div className="intro-stage">
        <img src={LOGO} alt="Vision8" />
        <span>{concept === "one" ? "Ideas to delivery" : "Think. Plan. Make."}</span>
      </div>
      <button type="button" onClick={onSkip}>Skip intro</button>
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="v14-header">
      <nav className="header-left" aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#process">Process</a>
      </nav>
      <a className="header-logo" href="#top" aria-label="Vision8 home">
        <img src={LOGO} alt="Vision8" />
      </a>
      <nav className="header-right" aria-label="Project navigation">
        <a href={VIDEO_SITE}>Video</a>
        <a className="header-cta" href="#contact">Start a project</a>
      </nav>
    </header>
  );
}

function VideoFrame({
  video,
  poster,
  ratio = "wide",
  className = "",
}: {
  video: string;
  poster: string;
  ratio?: "wide" | "square";
  className?: string;
}) {
  return (
    <div
      className={`video-frame video-${ratio} ${className}`}
      style={{ backgroundImage: `url(${poster})` }}
    >
      <video autoPlay muted loop playsInline preload="metadata" poster={poster} aria-hidden="true">
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
}

function ConceptOne() {
  return (
    <article className="v14-concept concept-one" id="top">
      <SiteHeader />

      <section className="one-hero">
        <p className="screen-label">Boutique creative agency / Wellington</p>
        <h1 className="single-line">Clever ideas. Properly delivered.</h1>
        <p className="hero-deck single-line">Vision8 takes projects from first thought to final delivery.</p>
        <VideoFrame
          video={media.heroVideo}
          poster={media.heroPoster}
          className="one-hero-video"
        />
        <div className="hero-caption">
          <span>Campaigns</span>
          <span>Film</span>
          <span>Photography</span>
          <span>Digital</span>
        </div>
      </section>

      <section className="one-position" id="work">
        <p className="screen-label">What Vision8 stands for</p>
        <h2 className="single-line">A clever idea is only the beginning.</h2>
        <p className="position-copy single-line">We listen, write, plan, shoot, design, edit and deliver.</p>

        <div className="square-work-grid">
          <figure>
            <VideoFrame video={media.foodVideo} poster={media.foodPoster} ratio="square" />
            <figcaption><span>Campaign thinking</span><b>Connect with the right audience.</b></figcaption>
          </figure>
          <figure>
            <VideoFrame video={media.waterVideo} poster={media.waterPoster} ratio="square" />
            <figcaption><span>Experienced production</span><b>Make difficult work look effortless.</b></figcaption>
          </figure>
          <figure>
            <VideoFrame video={media.cultureVideo} poster={media.culturePoster} ratio="square" />
            <figcaption><span>Thoughtful delivery</span><b>Get the context and the details right.</b></figcaption>
          </figure>
        </div>
      </section>

      <section className="one-process" id="process">
        <div className="process-heading">
          <p className="screen-label">Ideas to delivery</p>
          <h2 className="single-line">A good process protects the idea.</h2>
        </div>
        <ol className="four-step">
          <li><span>01</span><strong>Understand</strong><p>The audience, the message and what needs to happen.</p></li>
          <li><span>02</span><strong>Shape</strong><p>The concept, script, people and visual approach.</p></li>
          <li><span>03</span><strong>Make</strong><p>The production, details and decisions that bring it together.</p></li>
          <li><span>04</span><strong>Deliver</strong><p>The edit, finish, versions and final files.</p></li>
        </ol>
      </section>

      <section className="v14-contact" id="contact">
        <p className="screen-label">Vision8 / Boutique agency</p>
        <h2 className="single-line">Bring us the problem.</h2>
        <a href="mailto:hello@vision8.co.nz">Talk through a project <Arrow /></a>
      </section>
    </article>
  );
}

function ConceptTwo() {
  return (
    <article className="v14-concept concept-two" id="top">
      <SiteHeader />

      <section className="two-hero">
        <div className="two-hero-copy">
          <p className="screen-label">Boutique agency / ideas to delivery</p>
          <h1>
            <span className="single-line">Think it through.</span>
            <span className="single-line teal-line">Make it work.</span>
          </h1>
          <p className="two-deck single-line">Clever ideas. Clear process. Experienced production.</p>
        </div>

        <div className="square-showcase" id="work">
          <figure>
            <VideoFrame video={media.foodVideo} poster={media.foodPoster} ratio="square" />
            <figcaption>Campaigns</figcaption>
          </figure>
          <figure>
            <VideoFrame video={media.cultureVideo} poster={media.culturePoster} ratio="square" />
            <figcaption>Stories</figcaption>
          </figure>
          <figure>
            <VideoFrame video={media.waterVideo} poster={media.waterPoster} ratio="square" />
            <figcaption>Production</figcaption>
          </figure>
          <figure>
            <VideoFrame video={media.motionVideo} poster={media.motionPoster} ratio="square" />
            <figcaption>Motion</figcaption>
          </figure>
        </div>
      </section>

      <section className="two-position">
        <p className="screen-label">A small senior team</p>
        <h2 className="single-line">The people with the idea stay with the job.</h2>
        <p className="single-line">No hand-off between the thinking and the making.</p>
      </section>

      <section className="two-process" id="process">
        <p className="screen-label">The process</p>
        <h2 className="single-line">Good work does not happen by accident.</h2>
        <div className="process-track">
          <article><span>01</span><h3>Listen</h3><p>Purpose, audience, stakeholders and outcome.</p></article>
          <article><span>02</span><h3>Shape</h3><p>Creative idea, script, casting and storyboard.</p></article>
          <article><span>03</span><h3>Plan</h3><p>Timeline, locations, permits, safety and logistics.</p></article>
          <article><span>04</span><h3>Make</h3><p>Direction, filming, photography, design and edit.</p></article>
          <article><span>05</span><h3>Deliver</h3><p>Review, finish, versions and final files.</p></article>
        </div>

        <VideoFrame
          video={media.testimonialVideo}
          poster={media.testimonialPoster}
          className="process-proof-video"
        />
      </section>

      <section className="v14-contact" id="contact">
        <p className="screen-label">Start with what needs to work</p>
        <h2 className="single-line">Then work out the best way to make it.</h2>
        <a href="mailto:hello@vision8.co.nz">Start a conversation <Arrow /></a>
      </section>
    </article>
  );
}

export function ConceptShowcaseV14() {
  const [active, setActive] = useState<ConceptId>("one");
  const [sequenceKey, setSequenceKey] = useState(0);
  const [skipped, setSkipped] = useState(false);

  function chooseConcept(concept: ConceptId) {
    setActive(concept);
    setSkipped(false);
    setSequenceKey((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function replayIntro() {
    setSkipped(false);
    setSequenceKey((current) => current + 1);
  }

  return (
    <main className="v14-shell">
      <IntroSequence
        concept={active}
        sequenceKey={sequenceKey}
        skipped={skipped}
        onSkip={() => setSkipped(true)}
      />

      <nav className="v14-review-bar" aria-label="Revised concept selector">
        <div className="review-name"><b>Vision8</b><span>Revised homepage concepts v1.4</span></div>
        <div className="review-options">
          {concepts.map((concept) => (
            <button
              key={concept.id}
              type="button"
              className={active === concept.id ? "active" : ""}
              onClick={() => chooseConcept(concept.id)}
              aria-pressed={active === concept.id}
            >
              <span>{concept.number}</span>{concept.title}
            </button>
          ))}
        </div>
        <button className="replay-button" type="button" onClick={replayIntro}>Replay logo</button>
      </nav>

      {active === "one" ? <ConceptOne /> : <ConceptTwo />}
    </main>
  );
}

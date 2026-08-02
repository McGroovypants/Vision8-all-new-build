"use client";

import { useState } from "react";

type RouteId = "a" | "b" | "c";

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const LOGO = `${CLOUD}/image/upload/v1784608757/Vision8_logo_2026_mzb4xq.png`;
const CURRENT_VIDEO_SITE = "https://mcgroovypants.github.io/V8-website-2026/";

const media = {
  flagshipVideo: `${CLOUD}/video/upload/so_10,eo_18,w_1440,q_auto,vc_auto/Vision8_2025_Reel_HEADER_2_j12y5e.mp4`,
  flagshipPoster: `${CLOUD}/video/upload/w_1600,q_auto,so_14/Vision8_2025_Reel_HEADER_2_j12y5e.jpg`,
  foodVideo: `${CLOUD}/video/upload/w_1280,q_auto,vc_auto/Vision8_Food_Reel_1_pn4hog.mp4`,
  foodPoster: `${CLOUD}/video/upload/w_1400,q_auto,so_10/Vision8_Food_Reel_1_pn4hog.jpg`,
  waterVideo: `${CLOUD}/video/upload/w_1280,q_auto,vc_auto/Vision8_sky_and_water_Reel_1_uzx4vi.mp4`,
  waterPoster: `${CLOUD}/video/upload/w_1400,q_auto,so_20/Vision8_sky_and_water_Reel_1_uzx4vi.jpg`,
  culturalVideo: `${CLOUD}/video/upload/w_1280,q_auto,vc_auto/Vision8_Te_Ao_Maori_Reel_1_ck0nsf.mp4`,
  culturalPoster: `${CLOUD}/video/upload/w_1400,q_auto,so_25/Vision8_Te_Ao_Maori_Reel_1_ck0nsf.jpg`,
  explainerPoster: `${CLOUD}/video/upload/w_1200,q_auto,so_20/Vision_8_Explainer_videos_reel_nkyotq.jpg`,
  photoOne: `${CLOUD}/image/upload/w_1400,c_fill,g_auto,q_auto,f_auto/IMGC9782_boak3q.jpg`,
  photoTwo: `${CLOUD}/image/upload/w_1400,c_fill,g_auto,q_auto,f_auto/IMGC3958_mjejjt.jpg`,
};

const routes: Array<{ id: RouteId; short: string; title: string }> = [
  { id: "a", short: "A", title: "Living 8" },
  { id: "b", short: "B", title: "Editorial cinema" },
  { id: "c", short: "C", title: "Solution canvas" },
];

function BrandHeader({ light = false }: { light?: boolean }) {
  return (
    <header className={`site-header${light ? " site-header-light" : ""}`}>
      <a className="brand" href="#top" aria-label="Vision8 home">
        <img src={LOGO} alt="Vision8" />
      </a>
      <nav aria-label="Primary navigation">
        <a href="#selected-work">Work</a>
        <a href="#approach">Approach</a>
        <a href={CURRENT_VIDEO_SITE}>Video</a>
        <a className="nav-contact" href="#contact">
          Talk through a project
        </a>
      </nav>
    </header>
  );
}

function Arrow() {
  return <span aria-hidden="true">↘</span>;
}

function MotionMedia({
  video,
  poster,
  className = "",
}: {
  video: string;
  poster: string;
  className?: string;
}) {
  return (
    <div
      className={`motion-media ${className}`}
      style={{ backgroundImage: `url(${poster})` }}
    >
      <video autoPlay muted loop playsInline preload="metadata" poster={poster} aria-hidden="true">
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
}

function ReviewNotes({
  title,
  rationale,
  motion,
  mediaUsed,
  risk,
}: {
  title: string;
  rationale: string;
  motion: string;
  mediaUsed: string;
  risk: string;
}) {
  return (
    <aside className="review-notes" aria-label={`${title} review notes`}>
      <div className="review-label">Concept review notes</div>
      <div className="review-grid">
        <div>
          <span>Rationale</span>
          <p>{rationale}</p>
        </div>
        <div>
          <span>Interaction and fallback</span>
          <p>{motion}</p>
        </div>
        <div>
          <span>Real media</span>
          <p>{mediaUsed}</p>
        </div>
        <div>
          <span>Primary risk</span>
          <p>{risk}</p>
        </div>
      </div>
      <p className="review-footnote">
        Performance: poster-first media, short Cloudinary derivatives, lazy loading below the first
        viewport. Accessibility: semantic structure, visible focus, full static hierarchy and reduced-motion
        fallback.
      </p>
    </aside>
  );
}

function RouteA() {
  return (
    <article className="concept concept-a" id="top">
      <section className="a-hero">
        <BrandHeader />
        <div className="a-hero-grid">
          <div className="a-copy">
            <p className="eyebrow">Senior thinking. Hands-on production.</p>
            <h1>
              Make it understood.
              <br />
              Make it felt.
              <br />
              <em>Make it matter.</em>
            </h1>
            <p className="a-intro">
              Vision8 finds the right way for an important idea to land, then makes it exceptionally well
              through film, photography and useful digital experiences.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#selected-work">
                See selected work <Arrow />
              </a>
              <a className="text-action" href="#contact">
                Talk through a project
              </a>
            </div>
          </div>
          <div className="living-eight" aria-label="Vision8 mark revealing selected production footage">
            <div className="eight-aura" />
            <MotionMedia video={media.foodVideo} poster={media.foodPoster} className="eight-film" />
            <div className="eight-edge" />
            <span className="eight-caption">Ideas and craft, meeting in the middle.</span>
          </div>
        </div>
        <div className="capability-line" aria-label="Vision8 capabilities">
          <span>Film</span><span>Photography</span><span>Websites</span><span>Practical digital tools</span>
        </div>
      </section>

      <section className="a-proof" id="selected-work">
        <div className="section-index">01 / Selected work</div>
        <div className="a-proof-grid">
          <MotionMedia video={media.waterVideo} poster={media.waterPoster} className="proof-film" />
          <div className="proof-copy">
            <p className="eyebrow dark">Capability in difficult places</p>
            <h2>Good judgement travels.</h2>
            <p>
              From open water to the boardroom, the work begins with what an audience needs to understand,
              feel or do. The production follows the problem, not the other way around.
            </p>
            <a href={CURRENT_VIDEO_SITE}>Explore video capability <Arrow /></a>
          </div>
        </div>
      </section>

      <section className="approach-strip" id="approach">
        <p>Direct senior involvement.</p>
        <p>Experienced, agile crews.</p>
        <p>One idea carried across formats.</p>
      </section>

      <ReviewNotes
        title="Living 8"
        rationale="The mark becomes an ownable convergence point while the proposition remains clear without interaction. The page then gives real work the full editorial stage."
        motion="Footage moves quietly inside the cropped 8. Reduced motion retains a still image in the same composition. The user never has to operate the mark."
        mediaUsed="Food-production footage inside the 8, followed by the air-and-sea reel as the first substantial proof state."
        risk="The 8 could become a logo trick. Failure test: remove motion. The headline, capability line and first proof still communicate the offer."
      />
    </article>
  );
}

function RouteB() {
  return (
    <article className="concept concept-b" id="top">
      <section className="b-hero">
        <MotionMedia video={media.flagshipVideo} poster={media.flagshipPoster} className="b-background" />
        <div className="media-shade" />
        <BrandHeader />
        <div className="b-copy">
          <p className="eyebrow">Vision8, Wellington / working anywhere</p>
          <h1>Important ideas need more than content.</h1>
          <div className="b-lower">
            <p>
              Senior communication thinking, film, photography and useful digital experiences, made
              hands-on.
            </p>
            <a className="round-action" href="#selected-work" aria-label="See selected work">
              <Arrow />
            </a>
          </div>
        </div>
        <div className="b-caption">Selected Vision8 production / 2025</div>
      </section>

      <section className="b-editorial" id="selected-work">
        <div className="b-heading-row">
          <span>Selected work</span>
          <h2>The way it lands is the work.</h2>
        </div>
        <div className="b-story b-story-one">
          <img src={media.photoOne} alt="Selected Vision8 photography" />
          <div>
            <span>01 / Human observation</span>
            <h3>Find the moment people believe.</h3>
            <p>Close to the people, precise about the message, economical in the making.</p>
          </div>
        </div>
        <div className="b-story b-story-two" id="approach">
          <div>
            <span>02 / Cultural care</span>
            <h3>Context changes how a story should be told.</h3>
            <p>Thoughtful partnership and strong production, shown through the work rather than claimed.</p>
          </div>
          <MotionMedia video={media.culturalVideo} poster={media.culturalPoster} className="b-cultural" />
        </div>
      </section>

      <section className="b-contact" id="contact">
        <p>Have something important that needs to land?</p>
        <a href="mailto:hello@vision8.co.nz">Talk through a project <Arrow /></a>
      </section>

      <ReviewNotes
        title="Editorial cinema"
        rationale="The work earns trust first. Large-scale imagery, spare typography and deliberate sequencing create the premium benchmark for every route."
        motion="A poster holds immediately, then the reel begins as a muted loop. Reduced motion and failed video both preserve the poster and complete copy hierarchy."
        mediaUsed="The 2025 flagship reel, selected photography and the culturally grounded work reel. Legacy title-card moments are excluded from intended final edits."
        risk="The route could belong to another strong production company. The strategic headline, direct voice and restrained 8-derived circle keep Vision8 present."
      />
    </article>
  );
}

function RouteC() {
  return (
    <article className="concept concept-c" id="top">
      <section className="c-hero">
        <BrandHeader light />
        <div className="c-copy">
          <p className="eyebrow dark">Start before the deliverable</p>
          <h1>Tell us what needs to work.</h1>
          <p>
            Vision8 connects the idea, the audience and the right form, then makes the result with an
            experienced hands-on team.
          </p>
          <a className="primary-action dark-action" href="#selected-work">
            Follow an idea <Arrow />
          </a>
        </div>
        <div className="solution-field" aria-label="Selected Vision8 work connected around a client need">
          <div className="connection connection-one" />
          <div className="connection connection-two" />
          <div className="need-node">
            <span>The need</span>
            <strong>Make complex information feel clear and useful.</strong>
          </div>
          <figure className="plane plane-one">
            <img src={media.explainerPoster} alt="Selected Vision8 explainer animation" />
            <figcaption>Clarify the idea</figcaption>
          </figure>
          <figure className="plane plane-two">
            <img src={media.photoTwo} alt="Selected Vision8 photography" />
            <figcaption>Find the human moment</figcaption>
          </figure>
          <figure className="plane plane-three">
            <img src={media.waterPoster} alt="Selected Vision8 marine production" />
            <figcaption>Make it possible</figcaption>
          </figure>
        </div>
      </section>

      <section className="c-proof" id="selected-work">
        <div className="c-proof-intro">
          <span>One senior team</span>
          <h2>The answer can cross formats without losing the idea.</h2>
        </div>
        <div className="outcome-list" id="approach">
          <article>
            <span>01</span>
            <h3>See the real problem</h3>
            <p>Start with the audience and the change that matters, before choosing a camera, page or tool.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Choose the useful form</h3>
            <p>Film, photography, animation, websites and practical tools are options, not predetermined boxes.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Stay close to the making</h3>
            <p>The experienced people shaping the idea remain directly involved through production.</p>
          </article>
        </div>
      </section>

      <section className="c-contact" id="contact">
        <h2>Start with the problem.</h2>
        <a href="mailto:hello@vision8.co.nz">Talk through a project <Arrow /></a>
      </section>

      <ReviewNotes
        title="Intelligent solution canvas"
        rationale="The opening makes visible how a client need can connect to different forms without becoming a services menu or formal process diagram."
        motion="Planes may settle gently around the central need, but the default state is complete. Mobile becomes a deliberate vertical story with no connecting-line dependency."
        mediaUsed="Explainer work, selected photography and air-and-sea production presented as evidence around one communication need."
        risk="The interface could claim intelligence while diminishing the work. The large proof planes and complete no-label visual state are the containment test."
      />
    </article>
  );
}

export function ConceptShowcase() {
  const [active, setActive] = useState<RouteId>("a");

  function chooseRoute(route: RouteId) {
    setActive(route);
    window.history.replaceState(null, "", `#route-${route}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className={`concept-shell route-${active}`}>
      <nav className="concept-switcher" aria-label="Concept routes">
        <div className="switcher-title">
          <strong>Vision8</strong>
          <span>Homepage concept review</span>
        </div>
        <div className="switcher-options">
          {routes.map((route) => (
            <button
              key={route.id}
              type="button"
              className={active === route.id ? "active" : ""}
              onClick={() => chooseRoute(route.id)}
              aria-pressed={active === route.id}
            >
              <b>{route.short}</b>
              <span>{route.title}</span>
            </button>
          ))}
        </div>
        <span className="switcher-version">Local concept build v1.3</span>
      </nav>
      <div className="concept-stage">
        {active === "a" && <RouteA />}
        {active === "b" && <RouteB />}
        {active === "c" && <RouteC />}
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { PageHeader } from "../portfolio-shell";
import { ReelHero } from "./reel-hero";
import { HoverPlay } from "./hover-play";

const HERO = "https://res.cloudinary.com/deyb4o5qz/image/upload/f_auto,q_auto,w_1800/v1785656289/Real_estate_shot_rrts1z.jpg";
const CONTACT = "mailto:info@vision8.co.nz";
const RATE_CARD = "mailto:info@vision8.co.nz?subject=Real%20estate%20rate%20card";

/*
  The cleared cut, "Vision8 Real Estate Promo V2 reduced", with the clips that
  needed clearance taken out. Public and embeddable, confirmed against Vimeo's
  oEmbed endpoint rather than assumed.

  [CRITICAL] Promo V4 is a different cut and is still private. Its URL does not
  belong in this file, in the markup or in the build.

  `h` is the unlisted-video hash and the embed will not load without it.
  `controls=0` because the hero crops the player; the sound control lives in
  `ReelHero` instead. `dnt=1` stops Vimeo setting tracking cookies on visitors.
*/
const PROPERTY_REEL =
  "https://player.vimeo.com/video/1217581060?h=015949962e&autoplay=1&muted=1&loop=1&controls=0&title=0&byline=0&portrait=0&dnt=1";

// The walkthrough example. Contained rather than cropped, so Vimeo's own
// controls are left on and there is nothing to build here.
/*
  [NOTE] A placeholder at the client's direction until a proper direction-on-
  location piece exists: it is the Vision8 "Testimonials" cut, 24 seconds,
  public on the Vision8 account. Same rollover treatment as the Matterport
  example below.
*/
const PEOPLE_VIDEO =
  "https://player.vimeo.com/video/1110767463?muted=1&loop=1&title=0&byline=0&portrait=0&dnt=1";

// Muted so HoverPlay's programmatic play is allowed; Vimeo's controls stay on,
// so sound is one click away.
const MATTERPORT_VIDEO =
  "https://player.vimeo.com/video/1217587526?h=aecf03551a&muted=1&loop=1&title=0&byline=0&portrait=0&dnt=1";

/*
  A live tour, when there is one. A public link rather than an inline embed: an
  iframe brings a third party script we cannot theme against `--black`, and the
  URL dies the moment the listing is delisted, leaving a grey box on a live page.
  Empty means the button is not rendered at all, since an anchor with no
  destination is worse than no anchor.
*/
const MATTERPORT_TOUR = "";

// Four services, one line, in the client's order.
const services = ["Video", "Photography", "3D walkthroughs", "2D Plans"];

/*
  Supplied by the client. Trimmed only to remove the trading name, at the
  client's instruction, and to replace dashes with sentence breaks for house
  style. Nothing else in the wording was changed.
*/
const testimonials = [
  {
    name: "Kirsty McCarthy",
    agency: "Ray White",
    quote:
      "I highly recommend Helen and Andy for anyone in real estate marketing. Helen’s photography is always beautifully composed and captures each property at its best, while Andy’s video work brings every space to life with style and clarity. They’re both professional, reliable, and a pleasure to work with.",
  },
  {
    name: "Stephanie Guy",
    agency: "Harcourts Team Group",
    quote:
      "I’d love to give a big thank you to Andy and Helen for their outstanding photography and video work. They consistently deliver high-quality visuals that make my real estate listings stand out. Their professionalism, creativity, and attention to detail make them a pleasure to work with. I highly recommend them to anyone looking to showcase properties at their best. They’ve been an essential part of my marketing success.",
  },
  {
    name: "Lexi Boddy",
    agency: "S.LK Design",
    quote:
      "When someone approached me asking who I’d recommend to cover a nationwide, high-profile launch, someone who could get the shots and deliver a polished presentation, I immediately thought of Andy. He’s reliable, creative, and delivers every time.",
  },
];

export const metadata: Metadata = {
  title: "Vision8 Real Estate Media",
  description:
    "Property photography, video, 3D walkthroughs and floor plans, with experienced direction for the people in front of camera.",
};

export default function RealEstateMediaPage() {
  return (
    <main className="real-estate-page">
      <PageHeader division="Real Estate Media" />

      <ReelHero
        src={PROPERTY_REEL}
        poster={HERO}
        strip={
          <ul className="re-services">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        }
      >
        {/* The route test's "Vision8 Real Estate Media" is carried by the page
            title now that the hero eyebrow is gone; the header lockup has the
            visible words. */}
        <h1>
          Property stories,
          <br />
          ready to move.
        </h1>
        <span className="re-hero-lede">
          Experienced direction that helps properties, and the people selling them, come alive.
        </span>
      </ReelHero>

      {/*
        The keyword statement. This section shipped unheaded, on the argument
        that the reel above was the statement; the client read that as small
        floating text and asked for keyword heading style. The four nouns were
        already in the paragraph below, so they are promoted to display scale
        and the paragraph keeps only the part a heading cannot carry.
      */}
      <section className="re-section re-statement">
        <div className="re-inner">
          <h2 className="re-keywords">
            Movement<span>.</span> Timing<span>.</span> Detail<span>.</span> Atmosphere<span>.</span>
          </h2>
          <div className="re-pair">
            <div>
              <p className="re-lede">A good property video isn&rsquo;t simply a sequence of beautiful rooms.</p>
              <p>
                It&rsquo;s knowing when the agent should lead the story and when the home should take over.
              </p>
            </div>
            <div>
              <p>
                We shoot to keep things moving and edit with the same thought in mind: make people want to see what
                comes next.
              </p>
              <p>
                <strong>One strong piece of work says more than a wall of thumbnails.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="re-section">
        <div className="re-inner">
          <HoverPlay className="re-split re-flip">
            <figure>
              <div className="re-video">
                <iframe
                  src={PEOPLE_VIDEO}
                  title="People in front of camera"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                  allowFullScreen
                />
                {/* Removed by HoverPlay on activation. */}
                <span className="re-video-cover" aria-hidden="true" />
              </div>
              <figcaption>Direction on location</figcaption>
            </figure>
            <div>
              {/* Chapter numbers run 01 to 06 across the sections. The closing
                  stays unnumbered because it is the ask, not a chapter. */}
              <p className="re-eyebrow"><span className="re-index">01</span>People</p>
              <h2>Being comfortable on camera matters.</h2>
              <p className="re-lede">
                Being good at selling property doesn&rsquo;t automatically make being on camera easy.
              </p>
              <p>
                We&rsquo;ve spent years working with people in front of cameras, from television and live events to
                presenters, performers and people who would simply rather not be filmed.
              </p>
              <p>
                A good property shoot should feel relaxed. We help agents find their rhythm, keep things moving and
                bring out the person their clients already know.
              </p>
              <p className="re-pull">
                No big production.
                <br />
                No unnecessary fuss.
              </p>
              <p>
                <strong>Just good direction when it&rsquo;s needed.</strong>
              </p>
            </div>
          </HoverPlay>
        </div>
      </section>

      <section className="re-section">
        <div className="re-inner">
          <HoverPlay className="re-split">
            <figure>
              <div className="re-video">
                <iframe
                  src={MATTERPORT_VIDEO}
                  title="Matterport walkthrough examples"
                  allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                  referrerPolicy="strict-origin-when-cross-origin"
                  loading="lazy"
                  allowFullScreen
                />
                {/* Removed by HoverPlay on activation; see the comment there. */}
                <span className="re-video-cover" aria-hidden="true" />
              </div>
              <figcaption>Matterport walkthrough examples</figcaption>
            </figure>
            <div>
              <p className="re-eyebrow"><span className="re-index">02</span>Matterport</p>
              <h2>Walk through before walking in.</h2>
              <p>
                Matterport 3D walkthroughs let buyers explore a home in their own time and understand how the spaces
                actually connect.
              </p>
              <p>
                We take care over camera position, coverage and the flow through the property so the finished
                walkthrough feels natural to navigate rather than simply documenting every room.
              </p>
              {MATTERPORT_TOUR && (
                <div className="re-actions">
                  <a className="audio-btn" href={MATTERPORT_TOUR} target="_blank" rel="noopener">
                    Explore a 3D walkthrough
                  </a>
                </div>
              )}
            </div>
          </HoverPlay>
        </div>
      </section>

      <section className="re-section">
        <div className="re-inner">
          <div className="re-section-head">
            <p className="re-eyebrow"><span className="re-index">03</span>Photography and floor plans</p>
            <h2>The essentials still matter.</h2>
          </div>
          <div>
            <h3>Photography</h3>
            <p>Clean, considered property photography with an eye for the details that make a home feel right.</p>
            <p>Photography can be produced directly by Vision8 or by trusted photographers we work with.</p>
          </div>
          {/* Six, as the brief asked. Every image here was opened at full size
              before shipping; that check has now rejected three supplied files
              across the site, including a watermarked one from this batch. */}
          <div className="re-photo-grid" aria-label="Property photography">
            <img src="/real-estate/crawford-exterior.jpg" alt="Modern hillside home with glass corner living room and deck" loading="lazy" />
            <img src="/real-estate/crawford-living.jpg" alt="Open living and dining room with timber ceiling and harbour view" loading="lazy" />
            <img src="/real-estate/drone-aerial.jpg" alt="Aerial view of a modernist home on a bush-clad hillside" loading="lazy" />
            <img src="/real-estate/homewood-living.jpg" alt="Bright living room with skylights and garden doors" loading="lazy" />
            <img src="/real-estate/villa-entrance.jpg" alt="Villa entrance with clipped hedges and stone driveway" loading="lazy" />
            <img src="/real-estate/karaka-dusk.jpg" alt="Covered deck at dusk with lit timber walls and rural outlook" loading="lazy" />
          </div>
          <div className="re-plans-block">
            <h3>2D floor plans</h3>
            <p>
              Clear, useful floor plans that help buyers understand the layout quickly and complete the property
              media package.
            </p>
            <figure className="re-plan">
              <img src="/real-estate/floor-plan-example.jpg" alt="Three-floor plan example with room dimensions" loading="lazy" />
              <figcaption>Floor plan example</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/*
        The rhythm break. Several two-column sections in a row read as one long
        column, so this one goes full width and centred with no picture pair.
        Toned rather than photographic: it does not wait on an asset.
      */}
      <section className="re-band">
        <div className="re-band-copy">
          <p className="re-eyebrow"><span className="re-index">04</span>Experience</p>
          <h2>Experience is useful when you know what to do with it.</h2>
          <p>Vision8 comes from a much wider world than property marketing.</p>
          <p>
            Years behind cameras and in control rooms across television, commercials, concerts and major live events
            have taught us how to make decisions quickly, work comfortably with people and recognise the moment worth
            capturing.
          </p>
          <p>That experience now comes to a property shoot without bringing a television crew with it.</p>
          {/* The former pull line, cut to its keywords on the client's ask for
              keyword heading style. The qualifiers it dropped were already the
              h2's point: knowing what to do with it. */}
          <p className="re-keywords re-keywords-sub">
            Thoughtful<span>.</span> Fast<span>.</span> Easy to work with<span>.</span>
          </p>
        </div>
      </section>

      <section className="re-section">
        <div className="re-inner">
          <div className="re-split re-flip">
            <figure>
              <div className="re-frame">
                <span>Agent profile</span>
              </div>
              <figcaption>Building a profile over time</figcaption>
            </figure>
            <div>
              <p className="re-eyebrow"><span className="re-index">05</span>Agent profile</p>
              <h2>Every listing says something about you too.</h2>
              <p>Property media doesn&rsquo;t only market the home.</p>
              <p>
                Over time, every video, photograph and appearance in front of camera becomes part of an agent&rsquo;s
                own profile.
              </p>
              <p>We think about that as well.</p>
              <p>
                The aim isn&rsquo;t to make you look like somebody else. It&rsquo;s to help the confident, natural
                version of you come through consistently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Last before the ask, which is where proof does the most work. */}
      <section className="re-section">
        <div className="re-inner">
          <div className="re-section-head">
            <p className="re-eyebrow"><span className="re-index">06</span>Testimonials</p>
            <h2>What agents say.</h2>
          </div>
          <div className="re-quotes">
            {testimonials.map((entry) => (
              <figure className="re-quote" key={entry.name}>
                <blockquote>
                  <p>{entry.quote}</p>
                </blockquote>
                <figcaption>
                  {entry.name}
                  <span>{entry.agency}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery folded in above the contact block: it is a service benefit of
          two sentences, not a section, and it reads better as the last practical
          point before the ask. */}
      <section className="re-closing">
        <div className="re-closing-copy">
          <p className="re-eyebrow">Delivery</p>
          <h3>Your media, when your team needs it.</h3>
          <p>
            Vision8 clients have their own media workspace where photography, video, walkthroughs, floor plans and
            other supplied material can be found again without searching old emails and download links.
          </p>
          <p>It works alongside the systems your agency already uses.</p>

          <hr className="re-rule" />

          <h2>Let&rsquo;s make the next one good.</h2>
          <p>
            Whether it&rsquo;s one listing, an ongoing relationship or something a little different, we&rsquo;re happy
            to talk it through.
          </p>
          <div className="re-actions">
            <a className="audio-btn audio-btn-solid" href={CONTACT}>
              Discuss a property
            </a>
            <a className="audio-btn" href={RATE_CARD}>
              Request our rate card
            </a>
          </div>
          <p className="re-pending">Pricing is available privately rather than published on the website.</p>
        </div>
      </section>

      <p className="portfolio-build">Build v1.11.17</p>
    </main>
  );
}

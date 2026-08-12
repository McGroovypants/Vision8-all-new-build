import type { Metadata } from "next";
import { PageHeader } from "../portfolio-shell";

const HERO = "https://res.cloudinary.com/deyb4o5qz/image/upload/f_auto,q_auto,w_1800/v1785656289/Real_estate_shot_rrts1z.jpg";
const CONTACT = "mailto:info@vision8.co.nz";
const RATE_CARD = "mailto:info@vision8.co.nz?subject=Real%20estate%20rate%20card";

/*
  The cleared cut, "Vision8 Real Estate Promo V2 reduced", with the clips that
  needed clearance taken out. Public and embeddable, confirmed against Vimeo's
  oEmbed endpoint rather than assumed.

  [CRITICAL] Promo V4 is a different cut and is still private. Its URL does not
  belong in this file, in the markup or in the build.

  `h` is the unlisted-video hash and the embed will not load without it. The rest
  is muted autoplay, which is what the brief asks for, with Vimeo's own controls
  left on so the viewer has a clear way to turn sound on. `dnt=1` stops Vimeo
  setting tracking cookies on our visitors.
*/
const PROPERTY_REEL =
  "https://player.vimeo.com/video/1217581060?h=015949962e&autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&dnt=1";

/*
  A public link rather than an inline embed. An iframe brings a third party
  script we cannot theme against `--black`, and the URL dies the moment the
  listing is delisted or the subscription lapses, leaving a grey box on a live
  page. A poster and a button degrade to a poster and no button.
*/
const MATTERPORT = "";

// Four services, as one line in the hero rather than a stacked list, which is
// how `.audio-services` carries the same job on the Audio page.
const services = ["Photography", "Video", "3D walkthroughs", "Floor plans"];

export const metadata: Metadata = {
  title: "Vision8 Real Estate Media",
  description:
    "Property photography, video, 3D walkthroughs and floor plans, with experienced direction for the people in front of camera.",
};

export default function RealEstateMediaPage() {
  return (
    <main className="real-estate-page">
      <PageHeader />

      <section className="portfolio-hero real-estate-hero">
        <div className="portfolio-hero-image" style={{ backgroundImage: `url(${HERO})` }} aria-hidden="true" />
        <div className="portfolio-hero-wash" aria-hidden="true" />
        <div className="portfolio-hero-copy">
          {/* Bare `p`, so it keeps `.portfolio-hero-copy p`: teal, uppercase, small.
              The words are the literal string the route test matches, so it must
              not be shortened and dressed up with text-transform. */}
          <p>Vision8 Real Estate Media</p>
          <h1>Property stories, ready to move.</h1>
          <span>Experienced direction that helps properties, and the people selling them, come alive.</span>
          <ul className="re-services">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
          {/* A div, not a p. `.portfolio-hero-copy p` is a class plus an element
              and would take the margin and the eyebrow treatment with it. */}
          <div className="re-hero-actions">
            <a className="audio-btn audio-btn-solid" href="#work">
              View our work
            </a>
          </div>
        </div>
      </section>

      <section className="re-section" id="work">
        <div className="re-inner">
          <div className="re-section-head">
            <p className="re-eyebrow">Property video</p>
            <h2>Give the property room to speak.</h2>
            <p className="re-lede">Let the reel do most of the talking.</p>
          </div>
        </div>

        {/* Wider than the reading column on purpose. The brief asks for almost
            full width and minimal framing, so the video breaks the 1280 grid. */}
        <div className="re-inner-wide">
          <div className="re-video">
            {/* Lazy, because this sits below the fold. That also means autoplay
                starts as the section comes into view rather than on page load. */}
            <iframe
              src={PROPERTY_REEL}
              title="Vision8 real estate reel"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>

        <div className="re-inner">
          <div className="re-pair">
            <div>
              <p>A good property video isn&rsquo;t simply a sequence of beautiful rooms.</p>
              <p>
                It&rsquo;s movement, timing, detail, atmosphere and knowing when the agent should lead the story and
                when the home should take over.
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
          <div className="re-split re-flip">
            <figure>
              <div className="re-frame">
                <span>Agent on camera</span>
              </div>
              <figcaption>Direction on location</figcaption>
            </figure>
            <div>
              <p className="re-eyebrow">People</p>
              <h2>Good on camera matters.</h2>
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
              <p className="re-pull">No big production. No unnecessary fuss.</p>
              <p>
                <strong>Just good direction when it&rsquo;s needed.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="re-section">
        <div className="re-inner">
          <div className="re-split">
            <figure>
              <div className="re-frame">
                <span>3D walkthrough preview</span>
              </div>
              <figcaption>Matterport</figcaption>
            </figure>
            <div>
              <p className="re-eyebrow">Matterport</p>
              <h2>Walk through before walking in.</h2>
              <p>
                Matterport 3D walkthroughs let buyers explore a home in their own time and understand how the spaces
                actually connect.
              </p>
              <p>
                We take care over camera position, coverage and the flow through the property so the finished
                walkthrough feels natural to navigate rather than simply documenting every room.
              </p>
              {/* No button until there is a link. An anchor with no destination
                  is worse than no anchor. */}
              {MATTERPORT ? (
                <div className="re-actions">
                  <a className="audio-btn" href={MATTERPORT} target="_blank" rel="noopener">
                    Explore a 3D walkthrough
                  </a>
                </div>
              ) : (
                <p className="re-pending">An example walkthrough is being selected for this page.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="re-section">
        <div className="re-inner">
          <div className="re-section-head">
            <p className="re-eyebrow">Photography and floor plans</p>
            <h2>The essentials still matter.</h2>
          </div>
          <div className="re-pair">
            <div>
              <h3>Photography</h3>
              <p>Clean, considered property photography with an eye for the details that make a home feel right.</p>
              <p>
                Photography can be produced directly by Vision8 or by trusted photographers we work with.
              </p>
            </div>
            <div>
              <h3>2D floor plans</h3>
              <p>
                Clear, useful floor plans that help buyers understand the layout quickly and complete the property
                media package.
              </p>
            </div>
          </div>
          {/* Six frames, not eight. The brief asks for four to six excellent
              images, and the grid should not imply more than will be filled. */}
          <div className="re-photo-grid" aria-label="Property photography, images to follow">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="re-frame" key={index}>
                <span>Property image {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        The rhythm break. Six two-column sections in a row read as one long
        column, so this one goes full width and centred with no picture pair.
        Toned rather than photographic: it does not wait on an asset, and a
        background image can be added later without touching the markup.
      */}
      <section className="re-band">
        <div className="re-band-copy">
          <p className="re-eyebrow">Experience</p>
          <h2>Experience is useful when you know what to do with it.</h2>
          <p>Vision8 comes from a much wider world than property marketing.</p>
          <p>
            Years behind cameras and in control rooms across television, commercials, concerts and major live events
            have taught us how to make decisions quickly, work comfortably with people and recognise the moment worth
            capturing.
          </p>
          <p>That experience now comes to a property shoot without bringing a television crew with it.</p>
          <p className="re-pull">Thoughtful when it matters. Fast when it needs to be. Easy to work with throughout.</p>
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
              <p className="re-eyebrow">Agent profile</p>
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

      <p className="portfolio-build">Build v1.11.9</p>
    </main>
  );
}

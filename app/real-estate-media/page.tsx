import type { Metadata } from "next";
import { PageHeader } from "../portfolio-shell";
import { ReelHero } from "./reel-hero";
import { ViewportPlay } from "./viewport-play";

const CONTACT = "mailto:info@vision8.co.nz";
const RATE_CARD = "mailto:info@vision8.co.nz?subject=Real%20estate%20rate%20card";

/*
  The three reels, now served from the Vision8 portal rather than embedded from
  Vimeo. Verified from outside before wiring in, as this project requires:
  each fetches bare with no cookie, serves `video/mp4`, answers a range request
  with `206` so seeking works, and carries `moov` at byte 32, which is faststart
  and means playback starts before the file finishes arriving.

  `web.mp4`, not `download.mp4`. The download file is the delivery master: the
  hero was 1920x1080 at 50fps and 7.1Mbps, 51.7MB for a minute, which every
  visitor pulled because the hero autoplays. The web rendition is the same
  footage at 1080p30 and roughly 3.2Mbps, and the hero drops to 26.7MB. Vimeo
  used to pick a rendition per connection; serving straight from the bucket
  means the encode has to be chosen deliberately instead.

  [CRITICAL] These URLs live or die with the portal collection. They carry
  `max-age=300`, so unpublishing "vision8-website" takes the site's video down
  within five minutes. The collection has to stay published. A republish can
  also retire slugs that were not re-copied, which has taken the page down once:
  re-check all three after any change, not just the file that moved.

  [CRITICAL] The hero cut is "Promo V2 reduced", the cleared one. Promo V4 is a
  different cut and remains private until footage clearance is confirmed; its
  URL does not belong in this file, the markup or the build.
*/
const MEDIA = "https://media.vision8.co.nz/library/public/collections-media/vision8-website";
const PROPERTY_REEL = `${MEDIA}/vision8-real-estate-promo-v2-reduced/web.mp4`;
// The re-cut, `-2`. Replacing an asset retires the URL the old one had: the
// original `testimonial-2026c` went to 403 the moment this was published, and
// so did the Matterport example. Any swap here needs the whole collection
// re-checked, not just the file that changed.
const PEOPLE_VIDEO = `${MEDIA}/testimonial-2026c-2/web.mp4`;
const MATTERPORT_VIDEO = `${MEDIA}/matterport-video-examples/web.mp4`;

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
  Harry Eggers' testimonial, supplied by the client and used as excerpts placed
  beside the claims each one backs, rather than gathered into a testimonial
  block. The client's reasoning: the page should make a restrained claim and
  have a real client quietly confirm it, not build a trophy wall.

  He is credited once, at the foot of the page. His name is deliberately not
  repeated beside each quote.

  The three earlier testimonials were removed at the client's instruction: two
  described work involving a second party and so do not belong on a Vision8
  page, and the third belongs elsewhere on the wider site.
*/
const VOICE = {
  property:
    "Andy has a great understanding of real estate and knows how to capture a property in a way that makes it look its absolute best while still feeling authentic.",
  camera:
    "He knows how to make you feel comfortable and confident on camera, which makes the whole process feel very natural.",
  breadth:
    "Whether it\u2019s shooting, editing, photography, 3D walkthroughs or helping bring an idea to life, he understands what is needed and delivers.",
  working:
    "What really sets Andy apart is how easy he is to deal with. He\u2019s professional, reliable, creative and always willing to go the extra mile to get the right result.",
};

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
        The reel, then a client saying what it does. The keyword heading and the
        three paragraphs that sat here went at the client's instruction: the
        page had already shown the work, and describing it afterwards was the
        weakest thing on the page. What is left is the strongest.
      */}
      <section className="re-section re-statement">
        <div className="re-inner">
          <blockquote className="re-voice re-voice-lead">
            <p>{VOICE.property}</p>
          </blockquote>
        </div>
      </section>

      <section className="re-section">
        <div className="re-inner">
          <ViewportPlay className="re-split re-flip">
            <figure>
              <div className="re-video">
                {/* `preload="none"`: nothing is fetched until the section is
                    actually reached. */}
                <video src={PEOPLE_VIDEO} muted loop playsInline preload="none" controls />
              </div>
              <figcaption>Direction on location</figcaption>
            </figure>
            <div>
              {/* Chapter numbers run 01 to 04 across the sections. The closing
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
          </ViewportPlay>
          <blockquote className="re-voice re-voice-lead">
            <p>{VOICE.camera}</p>
          </blockquote>
        </div>
      </section>

      <section className="re-section">
        <div className="re-inner">
          <ViewportPlay className="re-split">
            <figure>
              <div className="re-video">
                <video src={MATTERPORT_VIDEO} muted loop playsInline preload="none" controls />
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
          </ViewportPlay>
          <blockquote className="re-voice">
            <p>{VOICE.breadth}</p>
          </blockquote>
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
          <div className="re-plans-block re-split">
            <figure className="re-plan">
              <img src="/real-estate/floor-plan-example.jpg" alt="Three-floor plan example with room dimensions" loading="lazy" />
              <figcaption>Floor plan example</figcaption>
            </figure>
            <div>
              <h3>Photos show how a home feels. A floor plan shows how it works.</h3>
              <p>
                Clear 2D plans help buyers understand the layout, room sizes and flow at a glance, and give them
                something useful to return to after a viewing.
              </p>
            </div>
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
          {/* The picture sits beside this copy rather than behind it: it is a
              portrait frame, and a portrait behind centred text is a wash, not
              a photograph. The band keeps its tinted full-bleed ground, which
              is what makes it read as the break in the page's rhythm. */}
          <div className="re-band-split">
            <figure>
              <img
                src="/real-estate/andy-stabiliser.jpg"
                alt="Andy McGrath filming inside a home with a gimbal-mounted camera"
                loading="lazy"
              />
              <figcaption>On location</figcaption>
            </figure>
            <div>
              <p className="re-eyebrow"><span className="re-index">04</span>Experience</p>
              <h2>Experience is useful when you know what to do with it.</h2>
              <p>Vision8 comes from a much wider world than property marketing.</p>
              <p>
                Years behind cameras and in control rooms across television, commercials, concerts and major live
                events have taught us how to make decisions quickly, work comfortably with people and recognise the
                moment worth capturing.
              </p>
              <p>That experience now comes to a property shoot without bringing a television crew with it.</p>
              <p className="re-keywords re-keywords-sub">
                Thoughtful<span>.</span> Fast<span>.</span> Easy to work with<span>.</span>
              </p>
            </div>
          </div>
          <blockquote className="re-voice">
            <p>{VOICE.working}</p>
          </blockquote>
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
          {/* Credited once, here, rather than beside each excerpt. */}
          <p className="re-credit">
            With thanks to Harry Eggers, Lowe &amp; Co Realty, for allowing us to share these comments from his
            experience working with Vision8.
          </p>
        </div>
      </section>

      <p className="portfolio-build">Build v1.11.25</p>
    </main>
  );
}

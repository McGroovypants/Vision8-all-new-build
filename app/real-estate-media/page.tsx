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
/*
  [NOTE] `download.mp4` is a stopgap, not the choice. The 14 Aug 2026 portal
  republish dropped the `web.mp4` renditions and the whole page went to 403;
  the collection manifest now lists only the delivery masters, so that is what
  ships. The hero master is 51MB against the web rendition's 26.7MB. When the
  web renditions are re-published to the portal, switch all three back to
  `web.mp4` and verify all three, not just the one that moved.
*/
// v1.11.49: the hero is Promo V6, published to the public assets prefix on
// 19 Aug 2026 (`/library/public/assets/...`, not the collection). Verified from
// outside before wiring in: bare fetch 200, `video/mp4`, 54.7MB, `Accept-Ranges:
// bytes`. Promo V2 reduced stays in the collection but is no longer used here.
const PROPERTY_REEL = "https://media.vision8.co.nz/library/public/assets/vision8-real-estate-promo-v6/vision8-real-estate-promo-v6_1080p.mp4";
// v1.11.54: the people reel is "Testimonial 2026 Web 2" from the public assets
// prefix, not the vision8-website collection, so it no longer depends on that
// collection staying published. Verified from outside before wiring in: range
// request 206, `video/mp4`, 14.5MB. The collection cut it replaces,
// `testimonial-2026c-2/download.mp4`, is no longer referenced here.
const PEOPLE_VIDEO =
  "https://media.vision8.co.nz/library/public/assets/testimonial-2026-web-2/testimonial-2026-web-2_1080p.mp4";
// v1.11.56: "Matterport Examples 2" from the public assets prefix, verified
// from outside before wiring in: range request 206, `video/mp4`, 16.8MB. With
// this the page loads nothing from the `vision8-website` collection at all, so
// the collection-publish caveat above no longer applies to any of the three.
const MATTERPORT_VIDEO =
  "https://media.vision8.co.nz/library/public/assets/matterport-examples-2/matterport-examples-2_1080p.mp4";
/*
  Helen's portrait sits in the v8-photos collection rather than vision8-website,
  so it does not hang off MEDIA above. Same 300 second max-age and the same
  dependency: unpublishing that collection takes this picture down within five
  minutes.
*/
const HELEN_PORTRAIT =
  "https://media.vision8.co.nz/library/public/collections-media/v8-photos/helen-w-camera-2025-website-1339x1600-1786942580-35a562ef/optimised.jpg";

/*
  A live tour, when there is one. A public link rather than an inline embed: an
  iframe brings a third party script we cannot theme against `--black`, and the
  URL dies the moment the listing is delisted, leaving a grey box on a live page.
  Empty means the button is not rendered at all, since an anchor with no
  destination is worse than no anchor.
*/
const MATTERPORT_TOUR = "";

// Five services, one line, in the client's order.
const services = ["Video", "Photography", "3D walkthroughs", "2D Plans", "Virtual staging"];

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
/*
  v1.11.53: Harry is named beside each of his four excerpts, the way Simon is
  under his, on the client's mark. The foot-of-page thanks stays.
*/
const VOICE_BY = "Harry Eggers, Lowe & Co.";

const VOICE = {
  property:
    "Vision8 have a great understanding of real estate and know how to capture a property in a way that makes it look its absolute best while still feeling authentic.",
  camera:
    "Andy knows how to make you feel comfortable and confident on camera, which makes the whole process feel very natural.",
  /* v1.11.54: `breadth` ("Whether it's shooting, editing, photography, 3D
     walkthroughs...") removed from the page on the client's mark. Three of
     Harry's excerpts remain. */
  working:
    "What really sets Vision8 apart is how easy Vision8 are to deal with. Professional, reliable, creative and always willing to go the extra mile to get the right result.",
};

/*
  v1.11.50: a second voice, Simon Marshall of Coastguard Tautiaki Moana, used
  once under the drone section because it is the one client comment we hold
  that speaks to drone operation. Unlike Harry's excerpts above it is credited
  where it sits: the foot-of-page credit covers one voice returning four times,
  and a second name in that paragraph would muddle which words were whose.
  Excerpted from the full comment supplied by the client; wording verbatim.
*/
const DRONE_VOICE =
  "We had Andy help us with several challenging projects including operating drones in a marine environment and filming on boats in rough weather. Andy has great customer service and has fitted in with our team of staff and volunteers seamlessly.";
const DRONE_VOICE_BY = "Simon Marshall, Bar Safety Project Lead, Coastguard Tautiaki Moana";

/*
  v1.11.50: four stills from the client's television and directing years,
  shown as one slim strip rather than as an "about" block. v1.11.51: moved
  under the Experience heading in the photography section on the client's
  mark, the heli shot and the World Cup swapped so the order is now as
  below, and each still carries a small credit over its foot, the client's
  words. v1.11.55: a fifth still, the MyFoodBag induction shoot, placed third
  so the three directing credits run together and the aerial and the live
  event close. Every file was opened at full size before shipping. Local copies of
  the portal assets, resized to 1200 wide at most, so the strip does not hang
  off a collection publish the way the reels do.
*/
const HISTORY = [
  { src: "/real-estate/history-directing-film.jpg", label: "TVC Director - Beef & Lamb", alt: "Andy McGrath directing on a studio set with a film crew" },
  { src: "/real-estate/history-directing.jpg", label: "Director/Camera - TV Series Whanau Living", alt: "Andy McGrath on location with camera and sound crew" },
  { src: "/real-estate/history-myfoodbag.jpg", label: "Director/Camera - Myfoodbag Induction video", alt: "Andy McGrath filming three presenters in a commercial kitchen" },
  { src: "/real-estate/history-heli-queenstown.jpg", label: "Series Director - Jack of all Trades", alt: "Andy McGrath and crew beside a helicopter before an aerial shoot in Queenstown" },
  { src: "/real-estate/history-world-cup.jpg", label: "Big Screen Director - World Cup Final 2011", alt: "Andy McGrath accredited in a full stadium at a World Cup final" },
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
            <footer className="re-voice-by">{VOICE_BY}</footer>
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
              {/* v1.11.51: the chapter numbers (01 to 04) are gone from the
                  section labels on the client's mark; the labels went up 2px
                  with them. `.re-index` has no markup left. */}
              <p className="re-eyebrow">People</p>
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
            <footer className="re-voice-by">{VOICE_BY}</footer>
          </blockquote>
        </div>
      </section>

      <section className="re-section">
        <div className="re-inner">
          <div className="re-section-head">
            <p className="re-eyebrow">Photography</p>
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
          {/*
            v1.11.44 put the Experience copy here, above the pair; v1.11.53
            moved it, with the strip, to its own section above People on the
            client's mark. The pair and its note stay with the photography.

            Helen's portrait comes from the v8-photos collection, not
            vision8-website like everything else on this page, and the public
            form of the URL is the only one the site can read: the address
            copied out of the portal, /library/vision8/website/photography-page/
            <slug>/optimised.jpg, answers 403 to anyone not logged in. The
            manifest at /library/public/collections/v8-photos.json is what to
            read if this slug ever moves. Verified from outside before wiring
            in: 200, image/jpeg, 1339x1600.

            One frame each side of the copy. Both take the same 4/5 crop at the
            same fixed column width, so the two are identical in size whatever
            their sources measure: Helen's is 1339x1600, the stabiliser frame
            1466x2500.
          */}
          <div className="re-collab">
            <figure>
              <img src={HELEN_PORTRAIT} alt="Helen Gwyther adjusting a flash-mounted camera on a tripod" loading="lazy" />
              <figcaption>Helen Gwyther - <span>Photographer</span></figcaption>
            </figure>
            <p>
              I often team up with Helen on real estate projects. Helen is a consummate professional. She has over 10
              years’ experience in real estate photography and a sharp eye for detail.
              <br />
              With Helen behind the camera, clients receive a high quality set of still images every time.
            </p>
            <figure>
              <img src="/real-estate/andy-stabiliser.jpg" alt="Andy McGrath filming inside a home with a gimbal-mounted camera" loading="lazy" />
              <figcaption>Andy McGrath - <span>Video Producer</span></figcaption>
            </figure>
          </div>

          <blockquote className="re-voice">
            <p>{VOICE.working}</p>
            <footer className="re-voice-by">{VOICE_BY}</footer>
          </blockquote>

        </div>
      </section>


      {/*
        v1.11.53: the Experience block, heading, credited strip and three
        paragraphs, is its own section rather than the tail of the photography
        section, which is where it sat from v1.11.44 to v1.11.52. v1.11.55: it
        sits directly above Drone on the client's mark, after the photography.
        No label, like the floor plans: the heading is the label.
      */}
      <section className="re-section">
        <div className="re-inner">
          <div className="re-experience">
            {/* v1.11.51: the strip sits under this heading, credit over each
                still. v1.11.52 tied its width to the heading's line; v1.11.56
                unties it, on the client's mark, so five stills run the page's
                full measure. The credit's span is what the width and no-wrap
                rules bite on; the figcaption itself is the wash on the frame. */}
            <h2>Experience is useful when you know what to do with it.</h2>
            <div className="re-history-strip" aria-label="Television and directing background">
              {HISTORY.map((still) => (
                <figure key={still.src}>
                  <img src={still.src} alt={still.alt} loading="lazy" />
                  <figcaption><span>{still.label}</span></figcaption>
                </figure>
              ))}
            </div>
            <p>Vision8 comes from a much wider world than property marketing.</p>
            <p>
              Years behind cameras and in control rooms across television, commercials, concerts and major live events
              have taught us how to make decisions quickly, work comfortably with people and recognise the moment worth
              capturing.
            </p>
            <p>That experience now comes to a property shoot without bringing a television crew with it.</p>
          </div>
        </div>
      </section>

      {/*
        v1.11.50: Drone, on the client's mark. v1.11.54: it follows the
        photography section, which moved above it. Three parts: the claim beside a picture of the operation, a client
        confirming it, and a slim strip of where the eye came from. The
        certificate itself is deliberately not shown: the photo was cropped out
        of a composite that carried it, and the licence point is made in one
        line of text instead. The client's words: proof without shouting.

        Picture right of the copy (v1.11.51, client's mark), in the narrow
        column: the frame is portrait, and at the 7fr width the other figures
        take it would run 850px tall.
      */}
      <section className="re-section">
        <div className="re-inner">
          <div className="re-split re-drone">
            <figure>
              <img src="/real-estate/andy-drone.jpg" alt="Andy McGrath flying a drone from a timber deck" loading="lazy" />
              <figcaption>Drone operation on location</figcaption>
            </figure>
            <div>
              <p className="re-eyebrow">Drone</p>
              <h2>Perspective matters.</h2>
              <p>
                Drone work adds more than a dramatic overhead. It shows a property&rsquo;s setting, access, scale and
                its relationship to the surroundings, giving buyers useful context quickly.
              </p>
              <p>
                Vision8 approaches aerial filming with the same care as every other part of the job: safe operation,
                clear judgement and visuals that serve the property rather than distract from it.
              </p>
              <p>
                <strong>Certified drone operation, used where it genuinely adds value.</strong>
              </p>
            </div>
          </div>
          <blockquote className="re-voice">
            <p>{DRONE_VOICE}</p>
            <footer className="re-voice-by">{DRONE_VOICE_BY}</footer>
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
              <figcaption>360° tour examples</figcaption>
            </figure>
            <div>
              <p className="re-eyebrow">360° virtual tours</p>
              <h2>Walk through before walking in.</h2>
              <p>
                360° tours let buyers explore a home in their own time and understand how the spaces actually
                connect.
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
        </div>
      </section>

      {/*
        v1.11.46: floor plans out of the photography section and up here, right
        after the 360 tours, on the client's mark. Its own section rather than a
        block inside the tours: a floor plan is not a 360 tour, and it carries
        its own h3 and no eyebrow.
      */}
      <section className="re-section">
        <div className="re-inner">
          <div className="re-split">
            <figure className="re-plan">
              <img src="/real-estate/floor-plan-example.jpg" alt="Three-floor plan example with room dimensions" loading="lazy" />
              <figcaption>Floor plan example</figcaption>
            </figure>
            <div>
              <h3>Photos show how a home feels.<br />A floor plan shows how it works.</h3>
              <p>
                Clear 2D plans help buyers understand the layout, room sizes and flow at a glance, and give them
                something useful to return to after a viewing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*
        v1.11.53: Delivery is a section like the others, on the client's mark,
        with a frame of the client workspace (a Lowe & Co view of the Vision8
        portal, local copy at 1400 wide) beside the copy. It was two sentences
        folded into the closing from v1.11.4x; the second sentence ("It works
        alongside the systems your agency already uses.") is gone.
      */}
      <section className="re-section">
        <div className="re-inner">
          <div className="re-split">
            <figure className="re-portal">
              <img src="/real-estate/loweandco-portal.jpg" alt="A Lowe & Co Realty media workspace in the Vision8 portal showing videos, photos and a floor plan" loading="lazy" />
              <figcaption>Client media workspace</figcaption>
            </figure>
            <div>
              <p className="re-eyebrow">Delivery</p>
              <h2>Your media, when your team needs it.</h2>
              <p>
                Vision8 clients have their own media workspace where photography, video, walkthroughs, floor plans and
                other supplied material can be found again without searching old emails and download links.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="re-closing">
        <div className="re-closing-copy">
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

      <p className="portfolio-build">Build v1.11.58</p>
    </main>
  );
}

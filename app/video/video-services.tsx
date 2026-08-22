"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { attachTapControls } from "../tap-controls";

type Service = {
  title: string;
  // Stable, hand-written rather than derived from the title: a macron or an
  // ampersand makes a derived slug either ugly or unstable, and these appear in
  // URLs the homepage links to.
  slug: string;
  // Shown on the card, two lines. v1.11.75: rewritten alongside `description`
  // rather than carried over from the GitHub Pages build, so a card and the
  // panel its button opens no longer read in two different voices. Held to one
  // sentence: the caption band's height is a term in the grid's fold budget.
  card: string;
  /*
    v1.11.75: the modal copy, rewritten by the client and now two parts rather
    than one sentence. `lead` is the opening line the panel sets in bold and
    `body` is the paragraph that runs on from it; they are one paragraph on the
    page, split here only so the emphasis lives in the data instead of being
    marked up inside a string. Both are required: every one of the nine opens
    on a lead line, so a missing one is a copy gap rather than a variant to
    render around.
  */
  description: { lead: string; body: string };
  video?: string;
  poster: string;
};

// Grid columns, and therefore the size of a hover group. Nine frames moving at
// once read as busy, so only the top row plays on load. Rows below hold their
// poster until the pointer enters the row, then all three start together.
const COLUMNS = 3;

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const VIDEO = `${CLOUD}/video/upload/w_960,q_auto`;
const POSTER = `${CLOUD}/video/upload/w_960,q_auto,so_0`;

const services: Service[] = [
  {
    title: "Air & Underwater Filming",
    slug: "air-underwater-filming",
    card: "Aerial and underwater filming, carefully planned, for the shot that adds something to the story.",
    description: {
      lead: "Some stories need a different point of view.",
      body: "Vision8 brings experience in aerial and underwater filming, with careful planning around safety, access and the realities of working in difficult environments. From drone tracking and wide aerial landscapes to underwater photography, the aim is always the same: get the shot that adds something to the story.",
    },
    video: `${VIDEO}/Vision8_sky_and_water_Reel_1_uzx4vi.mp4`,
    poster: `${POSTER}/Vision8_sky_and_water_Reel_1_uzx4vi.jpg`,
  },
  {
    title: "Marketing & Engagement",
    slug: "marketing-engagement",
    card: "Clear, engaging films for campaigns and brands, shaped around what you need people to do.",
    description: {
      lead: "Good marketing video starts with understanding what you need people to notice, feel or do.",
      body: "Vision8 works with you to shape ideas into clear, engaging films for campaigns, brands and organisations. The approach is collaborative and practical, combining strong storytelling with experienced production so the finished work feels considered, useful and right for the audience it needs to reach.",
    },
    video: `${VIDEO}/Vision8_Corp_Comms_Reels_1_czh0mh.mp4`,
    poster: `${POSTER}/Vision8_Corp_Comms_Reels_1_czh0mh.jpg`,
  },
  {
    title: "Te Ao Māori & Pasifika",
    slug: "te-ao-maori-pasifika",
    card: "Māori and Pasifika stories told in partnership, with care for the people, context and purpose.",
    description: {
      lead: "Telling Māori and Pasifika stories begins with listening.",
      body: "Vision8 collaborates with tangata whenua, organisations, ministries and broadcasters, taking care to understand the people, context and purpose before filming begins.",
    },
    video: `${VIDEO}/Vision8_Te_Ao_Maori_Reel_1_ck0nsf.mp4`,
    poster: `${POSTER}/Vision8_Te_Ao_Maori_Reel_1_ck0nsf.jpg`,
  },
  {
    title: "Corporate Comms",
    slug: "corporate-comms",
    card: "Training, induction and culture-change video that people understand and remember.",
    description: {
      lead: "Internal video does not need to feel like internal video.",
      body: "Vision8 works with HR, communications and leadership teams to make training, induction, health and safety, professional development and culture-change content clear and engaging. The focus is on helping people understand and remember what matters, using strong visuals and storytelling.",
    },
    video: `${VIDEO}/Vision8_Corp_Comms_Reels_1_czh0mh.mp4`,
    poster: `${POSTER}/Vision8_Corp_Comms_Reels_1_czh0mh.jpg`,
  },
  {
    title: "Food Filming & Styling",
    slug: "food-filming-styling",
    card: "Styling, lighting, texture and movement, working together to make food look its best on screen.",
    description: {
      lead: "When it comes to food, small details make a big difference.",
      body: "Styling, lighting, texture and movement all need to work together to make it look great on screen. Vision8 brings long experience directing and filming food, from television commercials to cooking programmes and branded content, with an eye for the moments that make people want to keep watching.",
    },
    video: `${VIDEO}/Vision8_Food_Reel_1_pn4hog.mp4`,
    poster: `${POSTER}/Vision8_Food_Reel_1_pn4hog.jpg`,
  },
  {
    title: "Motion & Animation",
    slug: "motion-animation",
    card: "Animation, titles and graphic design that explain ideas and strengthen a brand.",
    description: {
      lead: "Motion graphics and animation can add clarity, energy and polish when live action alone cannot tell the whole story.",
      body: "Vision8 uses animation, titles and graphic design to explain ideas, strengthen branding and bring information to life.",
    },
    video: `${VIDEO}/Vision8_Animation_Motion_Gfx_h0emew.mp4`,
    poster: `${POSTER}/Vision8_Animation_Motion_Gfx_h0emew.jpg`,
  },
  {
    title: "Explainer Videos",
    slug: "explainer-videos",
    card: "Complex ideas made easier to see, using live action, motion graphics and animation.",
    description: {
      lead: "Some ideas are easier to understand when you can see them working.",
      body: "Vision8 creates explainer films using a mix of live action, editing, motion graphics, animation and, where useful, AI-generated imagery. From machinery and processes to abstract concepts, the goal is to make complex information feel simple without oversimplifying it, and to give viewers a clear visual path through the subject.",
    },
    video: `${VIDEO}/Vision_8_Explainer_videos_reel_nkyotq.mp4`,
    poster: `${POSTER}/Vision_8_Explainer_videos_reel_nkyotq.jpg`,
  },
  {
    title: "Testimonial Videos",
    slug: "testimonial-videos",
    card: "Clients, staff and stakeholders, relaxed on camera and speaking for your organisation.",
    description: {
      lead: "The strongest message often comes from the people who already know your organisation well.",
      body: "Vision8 has extensive experience interviewing clients, staff and stakeholders, helping people relax and speak naturally on camera. We look for the real moments, then shape the strongest material into a clear story that feels credible, human and worth listening to.",
    },
    video: `${VIDEO}/Vision8_Testimonials_Reels_V1_udukwv.mp4`,
    poster: `${POSTER}/Vision8_Testimonials_Reels_V1_udukwv.jpg`,
  },
  {
    title: "Rural Videos",
    slug: "rural-videos",
    card: "More than twenty years filming on farms across New Zealand, and the trust that comes with it.",
    description: {
      lead: "Good rural stories come from earning people\u2019s trust.",
      body: "Vision8 has been filming on farms across New Zealand for more than 20 years. Ten years covering finalists for the FMG Young Farmer of the Year alone meant interviewing hundreds of farmers from Southland to the Far North. From farm families and apprentices to animal health, biosecurity and products used on farm, we know how to help people feel comfortable, speak naturally and show what they do best.",
    },
    // v1.11.72: off Cloudinary and onto the S3 bucket, on the client's mark.
    // Absolute rather than built from CLOUD because this is the first card on
    // the new origin; the other eight are still Cloudinary.
    //
    // v1.11.75: the reel, supplied by the client. Until now this was the one
    // card of nine with no `video`, so it rendered as a still and the detail
    // panel opened on a photograph. [NOTE] It is the 1080p master at 27.5MB,
    // where the other eight are Cloudinary `w_960,q_auto` and an order of
    // magnitude smaller. Nothing fetches it until a play call, so it costs
    // nothing until the row is reached, but on a phone reaching that row now
    // pulls 27.5MB. A smaller rendition on the same path is the fix.
    video: "https://media.vision8.co.nz/library/public/assets/rural-video-cut-2/rural-video-cut-2_1080p.mp4",
    poster: "https://media.vision8.co.nz/library/public/assets/imgc8130-1600x1067-1786739327-2756a95e/optimised.jpg",
  },
];

function ServiceVisual({ service, detail = false }: { service: Service; detail?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  // v1.11.64: the detail player's control bar is hidden until the picture is
  // touched. Only the detail video ever had controls; the cards are silent
  // loops with nothing to operate.
  useEffect(() => {
    const video = ref.current;
    if (!detail || !video) return;
    return attachTapControls(video);
  }, [detail]);

  if (!service.video) return <img src={service.poster} alt="" />;
  return <video ref={ref} autoPlay loop muted={!detail} playsInline preload="metadata" poster={service.poster} src={service.video} />;
}

/*
  `openSlug` opens one card's detail on arrival, so the homepage's Motion and
  Animation button lands on the same panel its own "Find out more" opens rather
  than dropping the visitor at the top of the grid to find it again.
*/
/*
  v1.11.64: whether this device has a pointer that can hover at all.

  The grid's whole playback rule was hover: row zero played and the other rows
  waited for a pointer to enter them. On a phone there is no pointer, so six of
  the nine frames were stills that nothing could ever start, which is the
  client's report. Read through useSyncExternalStore rather than an effect,
  because setting state from inside an effect is the cascading-render error
  this project's lint already carries once. The server snapshot is `true`, so
  the server renders the desktop arrangement and a phone corrects it on
  hydration.
*/
function useHoverCapable() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(hover: hover)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(hover: hover)").matches,
    () => true,
  );
}

export function VideoServices({ openSlug }: { openSlug?: string } = {}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Service | null>(null);
  const [immersive, setImmersive] = useState(false);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const cardVideos = useRef<(HTMLVideoElement | null)[]>([]);
  const cardEls = useRef<(HTMLElement | null)[]>([]);
  const hoverCapable = useHoverCapable();

  // Exactly one row moves at a time. Row zero is the resting state, so a
  // pointer in row two or three takes playback away from the top row rather
  // than adding to it. Pausing holds the current frame, which is the static
  // state we want.
  useEffect(() => {
    if (!hoverCapable) return;
    const playingRow = activeRow ?? 0;
    cardVideos.current.forEach((video, index) => {
      if (!video) return;
      if (Math.floor(index / COLUMNS) === playingRow) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeRow, hoverCapable]);

  /*
    Touch: the viewport does what the pointer does on a desktop. A card plays
    while it is on screen and pauses on the way off, so every one of the nine
    reels moves as it is reached and none of them is fetched before then, which
    is also the staged loading the client asked for. Nothing is downloaded
    until a play call, so this is what keeps eight idle reels off a phone's
    data.

    The page is its own scroll container, not the document, so the observer has
    to be told that or it watches a viewport nothing ever scrolls in.
  */
  useEffect(() => {
    if (hoverCapable) return;
    const scroller = cardEls.current.find(Boolean)?.closest(".video-page");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target.querySelector("video");
          if (!video) continue;
          if (entry.isIntersecting) void video.play().catch(() => {});
          else video.pause();
        }
      },
      { root: scroller ?? null, threshold: 0.35 },
    );
    cardEls.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [hoverCapable]);

  // Once only. `open` plays the detail video, and re-running it on any later
  // render would restart whatever the visitor was already watching.
  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current || !openSlug) return;
    const match = services.find((service) => service.slug === openSlug);
    if (!match) return;
    deepLinked.current = true;
    /*
      v1.11.64: arriving from the homepage's Motion & Animation button opens
      the reel across the whole screen rather than in the 1200px panel, on the
      client's mark. Browser-level fullscreen cannot be taken here: it needs a
      user gesture and the click that asked for it happened on the page before
      this one, so a request on arrival is refused. A dialog the size of the
      viewport is the reliable version of the same thing.
    */
    open(match, true);
  });

  function open(service: Service, whole = false) {
    setSelected(service);
    setImmersive(whole);
    requestAnimationFrame(() => {
      dialog.current?.showModal();
      // The click is a user gesture, so sound is normally allowed. If the
      // browser refuses anyway, fall back to muted rather than a still frame.
      const video = dialog.current?.querySelector("video");
      video?.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    });
  }

  return (
    <>
      <div className="video-service-grid">
        {services.map((service, index) => {
          const row = Math.floor(index / COLUMNS);
          return (
          <article
            className="video-service-card"
            key={service.title}
            ref={(element) => { cardEls.current[index] = element; }}
            onMouseEnter={() => setActiveRow(row)}
            onMouseLeave={() => setActiveRow((current) => (current === row ? null : current))}
            onFocusCapture={() => setActiveRow(row)}
          >
            {service.video ? (
              <video
                ref={(element) => { cardVideos.current[index] = element; }}
                autoPlay={row === 0}
                loop
                muted
                playsInline
                preload="metadata"
                poster={service.poster}
                src={service.video}
              />
            ) : (
              <ServiceVisual service={service} />
            )}
            <div className="video-service-caption">
              <h2>{service.title}</h2>
              <p>{service.card}</p>
              <button type="button" onClick={() => open(service)}>
                Find out more <b aria-hidden="true">→</b>
              </button>
            </div>
          </article>
          );
        })}
      </div>

      <dialog
        className={`video-detail${immersive ? " video-detail-whole" : ""}`}
        ref={dialog}
        onClose={() => {
          setSelected(null);
          setImmersive(false);
        }}
      >
        {selected && <>
          <button className="video-detail-close" type="button" onClick={() => dialog.current?.close()} aria-label="Close details">×</button>
          <ServiceVisual service={selected} detail />
          <div className="video-detail-copy">
            <h2>{selected.title}</h2>
            <p>
              <strong>{selected.description.lead} </strong>
              {selected.description.body}
            </p>
          </div>
        </>}
      </dialog>
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { attachTapControls } from "../tap-controls";

type Service = {
  title: string;
  // Stable, hand-written rather than derived from the title: a macron or an
  // ampersand makes a derived slug either ugly or unstable, and these appear in
  // URLs the homepage links to.
  slug: string;
  // Shown on the card, two lines. Carried over verbatim from the GitHub Pages
  // build, where it sat under every title and was lost when the cards moved
  // behind the modal. `description` is the longer modal copy and is separate.
  card: string;
  description: string;
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
    card: "Aerial and underwater filming add both unique and cinematic views that elevate any story.",
    description: "Certified drone, helicopter, underwater and boat filming, planned carefully for memorable images in demanding locations.",
    video: `${VIDEO}/Vision8_sky_and_water_Reel_1_uzx4vi.mp4`,
    poster: `${POSTER}/Vision8_sky_and_water_Reel_1_uzx4vi.jpg`,
  },
  {
    title: "Marketing & Engagement",
    slug: "marketing-engagement",
    card: "Strategic, imaginative campaigns for marketing teams, from concept through to delivery.",
    description: "Strategic, imaginative campaigns from concept to delivery, created to give marketing teams material that connects.",
    video: `${VIDEO}/Vision8_Corp_Comms_Reels_1_czh0mh.mp4`,
    poster: `${POSTER}/Vision8_Corp_Comms_Reels_1_czh0mh.jpg`,
  },
  {
    title: "Te Ao Māori & Pasifika",
    slug: "te-ao-maori-pasifika",
    card: "Honouring Indigenous culture means understanding the importance of doing things the right way.",
    description: "Stories developed in partnership, with care for their origins, audiences and the right way to tell them.",
    video: `${VIDEO}/Vision8_Te_Ao_Maori_Reel_1_ck0nsf.mp4`,
    poster: `${POSTER}/Vision8_Te_Ao_Maori_Reel_1_ck0nsf.jpg`,
  },
  {
    title: "Corporate Comms",
    slug: "corporate-comms",
    card: "Staff learn faster with engaging video. Bring out the best in your organisation with great corporate communications.",
    description: "Clear, engaging video for induction, learning, culture change and internal communication.",
    video: `${VIDEO}/Vision8_Corp_Comms_Reels_1_czh0mh.mp4`,
    poster: `${POSTER}/Vision8_Corp_Comms_Reels_1_czh0mh.jpg`,
  },
  {
    title: "Food Filming & Styling",
    slug: "food-filming-styling",
    card: "Capturing the taste, colour, and scrumptiousness of food on camera is an art form.",
    description: "Food content shaped by experience in timing, lighting, styling and making every detail look its best.",
    video: `${VIDEO}/Vision8_Food_Reel_1_pn4hog.mp4`,
    poster: `${POSTER}/Vision8_Food_Reel_1_pn4hog.jpg`,
  },
  {
    title: "Motion & Animation",
    slug: "motion-animation",
    card: "Motion graphics and animation add professionalism and a winning edge to branding, logos, and titles.",
    description: "Polished motion graphics, 2D and 3D animation that clarify ideas and give brands a distinctive edge.",
    video: `${VIDEO}/Vision8_Animation_Motion_Gfx_h0emew.mp4`,
    poster: `${POSTER}/Vision8_Animation_Motion_Gfx_h0emew.jpg`,
  },
  {
    title: "Explainer Videos",
    slug: "explainer-videos",
    card: "Create precise, detailed working models or clarify complex topics with explainer videos that make stories easier to understand.",
    description: "Visual explanations that make complex subjects, machinery and working models easier to understand.",
    video: `${VIDEO}/Vision_8_Explainer_videos_reel_nkyotq.mp4`,
    poster: `${POSTER}/Vision_8_Explainer_videos_reel_nkyotq.jpg`,
  },
  {
    title: "Testimonial Videos",
    slug: "testimonial-videos",
    card: "Your clients, customers, staff, stakeholders, and of course, you, are the best ambassadors of your brand and message.",
    description: "Comfortable, authentic interviews that let the people who matter carry the story.",
    video: `${VIDEO}/Vision8_Testimonials_Reels_V1_udukwv.mp4`,
    poster: `${POSTER}/Vision8_Testimonials_Reels_V1_udukwv.jpg`,
  },
  {
    title: "Rural Videos",
    slug: "rural-videos",
    card: "Honest stories from rural Aotearoa, told with a feel for the people, the land and the work behind them.",
    description: "Honest stories from rural Aotearoa, filmed with practical know-how and a feel for the people, land and work behind them.",
    poster: `${CLOUD}/image/upload/w_960,q_auto,f_auto/Screen_Shot_2019-02-15_at_9.19.24_PM_gdnovh.jpg`,
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
export function VideoServices({ openSlug }: { openSlug?: string } = {}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Service | null>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const cardVideos = useRef<(HTMLVideoElement | null)[]>([]);

  // Exactly one row moves at a time. Row zero is the resting state, so a
  // pointer in row two or three takes playback away from the top row rather
  // than adding to it. Pausing holds the current frame, which is the static
  // state we want.
  useEffect(() => {
    const playingRow = activeRow ?? 0;
    cardVideos.current.forEach((video, index) => {
      if (!video) return;
      if (Math.floor(index / COLUMNS) === playingRow) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeRow]);

  // Once only. `open` plays the detail video, and re-running it on any later
  // render would restart whatever the visitor was already watching.
  const deepLinked = useRef(false);
  useEffect(() => {
    if (deepLinked.current || !openSlug) return;
    const match = services.find((service) => service.slug === openSlug);
    if (!match) return;
    deepLinked.current = true;
    open(match);
  });

  function open(service: Service) {
    setSelected(service);
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

      <dialog className="video-detail" ref={dialog} onClose={() => setSelected(null)}>
        {selected && <>
          <button className="video-detail-close" type="button" onClick={() => dialog.current?.close()} aria-label="Close details">×</button>
          <ServiceVisual service={selected} detail />
          <div className="video-detail-copy">
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
          </div>
        </>}
      </dialog>
    </>
  );
}

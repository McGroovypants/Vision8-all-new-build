"use client";

import { useRef, useState } from "react";

type Service = {
  title: string;
  description: string;
  video?: string;
  poster: string;
};

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const VIDEO = `${CLOUD}/video/upload/w_960,q_auto`;
const POSTER = `${CLOUD}/video/upload/w_960,q_auto,so_0`;

const services: Service[] = [
  {
    title: "Air & Sea Filming",
    description: "Certified drone, helicopter, underwater and boat filming, planned carefully for memorable images in demanding locations.",
    video: `${VIDEO}/Vision8_sky_and_water_Reel_1_uzx4vi.mp4`,
    poster: `${POSTER}/Vision8_sky_and_water_Reel_1_uzx4vi.jpg`,
  },
  {
    title: "Marketing & Engagement",
    description: "Strategic, imaginative campaigns from concept to delivery, created to give marketing teams material that connects.",
    video: `${VIDEO}/Vision8_Corp_Comms_Reels_1_czh0mh.mp4`,
    poster: `${POSTER}/Vision8_Corp_Comms_Reels_1_czh0mh.jpg`,
  },
  {
    title: "Te Ao Māori & Pasifika",
    description: "Stories developed in partnership, with care for their origins, audiences and the right way to tell them.",
    video: `${VIDEO}/Vision8_Te_Ao_Maori_Reel_1_ck0nsf.mp4`,
    poster: `${POSTER}/Vision8_Te_Ao_Maori_Reel_1_ck0nsf.jpg`,
  },
  {
    title: "Corporate Comms",
    description: "Clear, engaging video for induction, learning, culture change and internal communication.",
    video: `${VIDEO}/Vision8_Corp_Comms_Reels_1_czh0mh.mp4`,
    poster: `${POSTER}/Vision8_Corp_Comms_Reels_1_czh0mh.jpg`,
  },
  {
    title: "Food Filming & Styling",
    description: "Food content shaped by experience in timing, lighting, styling and making every detail look its best.",
    video: `${VIDEO}/Vision8_Food_Reel_1_pn4hog.mp4`,
    poster: `${POSTER}/Vision8_Food_Reel_1_pn4hog.jpg`,
  },
  {
    title: "Motion & Animation",
    description: "Polished motion graphics, 2D and 3D animation that clarify ideas and give brands a distinctive edge.",
    video: `${VIDEO}/Vision8_Animation_Motion_Gfx_h0emew.mp4`,
    poster: `${POSTER}/Vision8_Animation_Motion_Gfx_h0emew.jpg`,
  },
  {
    title: "Explainer Videos",
    description: "Visual explanations that make complex subjects, machinery and working models easier to understand.",
    video: `${VIDEO}/Vision_8_Explainer_videos_reel_nkyotq.mp4`,
    poster: `${POSTER}/Vision_8_Explainer_videos_reel_nkyotq.jpg`,
  },
  {
    title: "Testimonial Videos",
    description: "Comfortable, authentic interviews that let the people who matter carry the story.",
    video: `${VIDEO}/Vision8_Testimonials_Reels_V1_udukwv.mp4`,
    poster: `${POSTER}/Vision8_Testimonials_Reels_V1_udukwv.jpg`,
  },
  {
    title: "Rural Videos",
    description: "Honest stories from rural Aotearoa, filmed with practical know-how and a feel for the people, land and work behind them.",
    poster: `${CLOUD}/image/upload/w_960,q_auto,f_auto/Screen_Shot_2019-02-15_at_9.19.24_PM_gdnovh.jpg`,
  },
];

function ServiceVisual({ service, detail = false }: { service: Service; detail?: boolean }) {
  if (!service.video) return <img src={service.poster} alt="" />;
  return <video autoPlay={!detail} controls={detail} loop muted={!detail} playsInline preload="metadata" poster={service.poster} src={service.video} />;
}

export function VideoServices() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Service | null>(null);

  function open(service: Service) {
    setSelected(service);
    requestAnimationFrame(() => dialog.current?.showModal());
  }

  return (
    <>
      <div className="video-service-grid">
        {services.map((service) => (
          <article className="video-service-card" key={service.title}>
            <ServiceVisual service={service} />
            <div className="video-service-caption">
              <h2>{service.title}</h2>
              <button type="button" onClick={() => open(service)}>Find out more</button>
            </div>
          </article>
        ))}
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

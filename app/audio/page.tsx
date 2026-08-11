import type { Metadata } from "next";
import { PortfolioShell } from "../portfolio-shell";

export const metadata: Metadata = {
  title: "Audio & Music Production | Vision8",
  description: "Custom soundtracks, sound design, mixing and sonic branding, built from real instruments.",
};

// Copy supplied 11 August 2026. Stills supplied the same day, converted from
// the source screenshots and served from this site rather than Cloudinary; no
// upload credentials exist on this machine.
const services = [
  {
    title: "Custom Soundtracks",
    copy: "Original music composed specifically for your project's emotional arc – cinematic, electronic, orchestral, ambient, or hybrid. Always handcrafted, never generic.",
    image: "/audio/composition.jpg",
    alt: "Composer playing a keyboard in a studio hung with guitars",
  },
  {
    title: "Sound Design",
    copy: "Textures, atmospheres, impacts, and bespoke sonic worlds built from real-world recordings, synthesis, and experimental techniques.",
    image: "/audio/sound-design.jpg",
    alt: "Hands programming a drum machine under coloured light",
  },
  {
    title: "Mixing & Audio Post",
    copy: "Clean, spacious, dynamic mixes that translate across film, broadcast, web, and immersive formats.",
    image: "/audio/mixing.jpg",
    alt: "Close view of mixer faders lit in blue",
  },
  {
    title: "Sonic Branding",
    copy: "Signature audio identities for brands, products, and experiences – from micro-logos to full sound palettes.",
    image: "/audio/sonic-branding.jpg",
    alt: "Overhead view of a groovebox and drum kit washed in blue light",
  },
];

const workflow = [
  "Real instruments",
  "Modular synthesis",
  "Field recordings",
  "Experimental sound design",
  "High-end mixing and mastering",
  "Story-driven composition",
];

const clients = [
  "Film & TV",
  "Games",
  "Advertising",
  "Installations",
  "Digital experiences",
  "Theatre",
  "Brands needing a unique sonic identity",
];

const reasons = [
  "Real instruments, real emotion. No AI music.",
  "Decades of composition and production experience",
  "Hybrid analog/digital workflow",
  "Custom sound for every project",
  "Fast turnaround, high quality",
];

export default function AudioPage() {
  return (
    <PortfolioShell
      eyebrow="Audio & Music Production"
      title="Crafted Sound. Human Emotion. Real Instruments."
      intro="Vision8 is a sonic studio built on decades of musical exploration by Jeramiah Ross (Module) and Andy McGrath – two musician producer composers whose long-term creative partnership has shaped film, games, installations, and immersive experiences across Aotearoa and beyond."
      heroImage="/audio/hero-guitar.jpg"
      className="audio-shell"
    >
      <div className="portfolio-intro-grid">
        <h2>We create custom soundtracks, sound design, mixing, and sonic branding that feel alive.</h2>
        <p>Every project is built from real instruments and a watchful eye on the musical intention.</p>
      </div>

      <div className="audio-grid">
        {services.map((service) => (
          <article className="audio-card" key={service.title}>
            <img src={service.image} alt={service.alt} loading="lazy" />
            <div>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </div>
          </article>
        ))}
      </div>

      <figure className="audio-wide">
        <img src="/audio/musicians.jpg" alt="Split frame of a drummer and a bass player recording together" loading="lazy" />
        <figcaption>
          <strong>Real Instrument Recording</strong>
          Piano, guitar, strings, analog synths, drums, bass, vocals, percussion, modular rigs, and custom-built instruments recorded with care and character.
        </figcaption>
      </figure>

      <section className="audio-approach">
        <div>
          <h2>Human-driven sound</h2>
          <p>
            Vision8 is built on the belief that music should feel human. Jeramiah&rsquo;s background as Module brings a
            blend of cinematic composition, electronic production, and live performance. Andy brings decades of
            production experience, engineering precision, and musical intuition.
          </p>
          <p>Together we&rsquo;ve developed a workflow that merges:</p>
          <ul>
            {workflow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>This creates audio that feels alive, emotional, and tailored to each project.</p>
        </div>
        <img src="/audio/fretboard.jpg" alt="Close view of a hand playing a guitar neck under warm light" loading="lazy" />
      </section>

      <div className="audio-fact-grid">
        <section>
          <h3>Who we work with</h3>
          <ul>
            {clients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            Whether it&rsquo;s a full soundtrack, a single sound logo, or an entire audio ecosystem, Vision8 delivers
            sound that elevates the story.
          </p>
        </section>
        <section>
          <h3>Why Vision8 works</h3>
          <ul>
            {reasons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </PortfolioShell>
  );
}

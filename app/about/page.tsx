import type { Metadata } from "next";
import { PageHeader } from "../portfolio-shell";

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";

const people = [
  {
    name: "Andy McGrath",
    role: "Director / Producer / Chef",
    image: `${CLOUD}/image/upload/w_900,q_auto,f_auto/Andy_tazlv6.jpg`,
    bio: "Andy is renowned for making videos easy, fun and memorable. An experienced TV industry director, cameraman and series editor, he brings together more than 25 years of professional video and television craft.",
  },
  {
    name: "Gary Leano",
    role: "Graphic FX Director / Hot Sauce",
    image: `${CLOUD}/image/upload/w_900,q_auto,f_auto/v1785752269/Gary_for_website_svohzo.jpg`,
    bio: "Gary provides specialist motion graphics, animation and compositing for advertising, branding and promos, alongside a wide range of Vision8 client projects.",
  },
  {
    name: "Kat Greagar",
    role: "Photography / Underwater Camera / Stylish Sauce",
    image: `${CLOUD}/image/upload/w_900,q_auto,f_auto/Kat_ljp1ow.jpg`,
    bio: "Kat brings more than 20 years of experience in commercial and creative photography, design, sales management and branding. Her lifelong connection with the moana informs a distinctive underwater-camera practice.",
  },
  {
    name: "Jeramiah Ross",
    role: "Audio Design / Composition / Saucy Sounds",
    image: `${CLOUD}/image/upload/w_900,q_auto,f_auto/Jeramiah_abo1wn.jpg`,
    bio: "Jeramiah provides sound design and music composition for award-winning creative companies, including Weta Workshop, Dreamworks, RESN, PIKPOK, Activision and Magic Leap.",
  },
];

export const metadata: Metadata = {
  title: "About | Vision8",
  description: "Meet the Vision8 people behind the work.",
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <PageHeader />
      <section className="about-section">
        <div className="about-intro">
          <p>Our people</p>
          <h1>Meet the team</h1>
          <span>A seasoned crew with decades of experience in video, design, sound and storytelling.</span>
        </div>
        <div className="people-grid">
          {people.map((person) => (
            <article className="person-card" key={person.name}>
              <img src={person.image} alt={person.name} />
              <div>
                <h2>{person.name}</h2>
                <span>{person.role}</span>
                <p>{person.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <p className="portfolio-build">Build v1.11.53</p>
    </main>
  );
}

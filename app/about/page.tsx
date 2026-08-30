import type { Metadata } from "next";
import { PageHeader, SiteFooter } from "../portfolio-shell";

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";

const PAUL_PORTRAIT =
  "https://media.vision8.co.nz/library/public/assets/paulie-pic-1788132348-47a9f9ed/optimised.jpg";

/*
  v1.11.87: Paul Holland added, and `bio` becomes an array of paragraphs.
  Every other bio is a single paragraph and stayed one; Paul's supplied copy
  is three, and one code path that renders a list beats a second one that
  special-cases him.

  Paul's portrait comes from the Vision8 portal rather than Cloudinary like
  the other four, so it carries the same dependency as Helen's on the Real
  Estate page: unpublishing that asset takes the picture down. Verified from
  outside before wiring in: 200, image/jpeg, 1090x1066, no cookie needed.
  It is square where the frame is 3/4, so object-fit crops the sides; Paul is
  centred in the frame, which is what makes that crop safe.
*/
const people = [
  {
    name: "Andy McGrath",
    role: "Director / Producer / Chef",
    image: `${CLOUD}/image/upload/w_900,q_auto,f_auto/Andy_tazlv6.jpg`,
    bio: [
      "Andy is renowned for making videos easy, fun and memorable. An experienced TV industry director, cameraman and series editor, he brings together more than 25 years of professional video and television craft.",
    ],
  },
  {
    name: "Gary Leano",
    role: "Graphic FX Director / Hot Sauce",
    image: `${CLOUD}/image/upload/w_900,q_auto,f_auto/v1785752269/Gary_for_website_svohzo.jpg`,
    bio: [
      "Gary provides specialist motion graphics, animation and compositing for advertising, branding and promos, alongside a wide range of Vision8 client projects.",
    ],
  },
  {
    name: "Kat Greagar",
    role: "Photography / Underwater Camera / Stylish Sauce",
    image: `${CLOUD}/image/upload/w_900,q_auto,f_auto/Kat_ljp1ow.jpg`,
    bio: [
      "Kat brings more than 20 years of experience in commercial and creative photography, design, sales management and branding. Her lifelong connection with the moana informs a distinctive underwater-camera practice.",
    ],
  },
  {
    name: "Jeramiah Ross",
    role: "Audio Design / Composition / Saucy Sounds",
    image: `${CLOUD}/image/upload/w_900,q_auto,f_auto/Jeramiah_abo1wn.jpg`,
    bio: [
      "Jeramiah provides sound design and music composition for award-winning creative companies, including Weta Workshop, Dreamworks, RESN, PIKPOK, Activision and Magic Leap.",
    ],
  },
  {
    /*
      [CHECK] The role line is drawn from the supplied copy. The other four
      close on a sauce joke the client writes; this one does not, because
      inventing one puts words in the client's mouth. Replace when supplied.
    */
    name: "Paul Holland",
    role: "Lighting Cameraman / DOP / Live AV",
    image: PAUL_PORTRAIT,
    bio: [
      "Paul is one of those rare people who, when he turns his hand to something, tends to master it. Growing up in Te Whanganui-a-Tara, Wellington, he followed his passion for capturing media and began working alongside professional camera crews, starting out packing gear at Rocket Rentals before becoming a sought-after freelance lighting cameraman and DOP.",
      "His work has since expanded into social media campaigns, live AV for touring professional speakers and, more recently, building purpose-made business apps.",
      "Away from work, the pattern continues. He has learned to fly, raced cars and worked hard at guitar and bass, his band recently placing runner-up in two battle of the bands finals, no mean feat. That breadth of knowledge, combined with good judgement and a calm head, makes Paul a trusted confidant and an excellent person to have alongside you on a project.",
    ],
  },
];

export const metadata: Metadata = {
  title: "About | Vision8",
  description: "Meet the Vision8 people behind the work.",
  alternates: { canonical: "/about" },
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
                {person.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

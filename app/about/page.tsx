import type { Metadata } from "next";
import { PageHeader, SiteFooter } from "../portfolio-shell";

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";

const PAUL_PORTRAIT =
  "https://media.vision8.co.nz/library/public/assets/paulie-pic-1788132348-47a9f9ed/optimised.jpg";

/*
  v1.11.89: all four original bios replaced with the client's rewritten copy,
  verbatim. The roles, including the sauce jokes, are unchanged.

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
      "Andy has spent more than 25 years directing, filming and editing television, documentaries, branded content and everything in between. Just as important as the technical craft is his ability to make people feel comfortable in front of a camera, creating an atmosphere where good performances and genuine moments happen naturally.",
    ],
  },
  {
    name: "Gary Leano",
    role: "Graphic FX Director / Hot Sauce",
    image: `${CLOUD}/image/upload/w_900,q_auto,f_auto/v1785752269/Gary_for_website_svohzo.jpg`,
    bio: [
      "Gary is the person Vision8 turns to when an idea needs another visual dimension. A highly experienced motion graphics artist, animator and compositor, he has spent years creating work for advertising, branding, television and promos, bringing both technical precision and a very good eye to the projects he works on.",
    ],
  },
  {
    /*
      v1.11.90: the client supplied the sauce line, "Rocket Sauce", a nod to
      Rocket Rentals in the copy below. Live AV came out of the role with it,
      so this reads as two crafts and a sauce like every other line here;
      the breadth it named is still in the second paragraph.
    */
    name: "Paul Holland",
    role: "Lighting Cameraman / DOP / Rocket Sauce",
    image: PAUL_PORTRAIT,
    bio: [
      "Paul is one of those rare people who, when he turns his hand to something, tends to master it. Growing up in Te Whanganui-a-Tara, Wellington, he followed his passion for capturing media and began working alongside professional camera crews, starting out packing gear at Rocket Rentals before becoming a sought-after freelance lighting cameraman and DOP.",
      "His work has since expanded into social media campaigns, live AV for touring professional speakers and, more recently, building purpose-made business apps.",
      "Away from work, the pattern continues. He has learned to fly, raced cars and worked hard at guitar and bass, his band recently placing runner-up in two battle of the bands finals, no mean feat. That breadth of knowledge, combined with good judgement and a calm head, makes Paul a trusted confidant and an excellent person to have alongside you on a project.",
    ],
  },
  {
    name: "Kat Greagar",
    role: "Photography / Underwater Camera / Stylish Sauce",
    image: `${CLOUD}/image/upload/w_900,q_auto,f_auto/Kat_ljp1ow.jpg`,
    bio: [
      "Kat has spent more than 20 years working across photography, design, branding and the commercial world, giving her a particularly strong instinct for what makes an image communicate. Her lifelong connection with the moana has also taken her photography underwater, where she has developed a distinctive way of capturing people and the natural world.",
    ],
  },
  {
    name: "Jeramiah Ross",
    role: "Audio Design / Composition / Saucy Sounds",
    image: `${CLOUD}/image/upload/w_900,q_auto,f_auto/Jeramiah_abo1wn.jpg`,
    bio: [
      "Jeramiah is a composer, producer and sound designer with an extraordinary ear for creating worlds through sound. His work has reached everything from music and interactive media to major international creative projects, including collaborations with Weta Workshop, DreamWorks, RESN, PIKPOK, Activision and Magic Leap.",
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

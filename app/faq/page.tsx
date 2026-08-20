import type { Metadata } from "next";
import { PortfolioShell } from "../portfolio-shell";
import { SITE_URL, CONTACT } from "../site";

/*
  New in v1.11.68, at Andy's request.

  An FAQ earns its place here for one specific reason: FAQPage is the most
  directly quotable structured data there is. A model answering "who does video
  production in Wellington" or "can I update my own site afterwards" can lift a
  question and answer verbatim and attribute it. The rest of this site is
  deliberately light on words and heavy on video, which reads well to a person
  and gives a model very little to work with. This is the page that states the
  plain facts in the plain words someone would actually search for.

  [NOTE] Every answer below is drawn from what the site already says about
  itself, so nothing here is invented. What is deliberately absent is anything
  the site does not evidence: no pricing, no turnaround promises, no crew
  sizes. Andy to review the wording and add those where he wants them.
*/

export const metadata: Metadata = {
  title: "FAQ | Vision8",
  description:
    "Common questions about working with Vision8: where we are based, what we cover, and how a project usually starts.",
  alternates: { canonical: "/faq" },
};

type Faq = { q: string; a: string };

const faqs: Faq[] = [
  {
    q: "Where is Vision8 based?",
    a: `Vision8 is based in Island Bay, ${CONTACT.placeLong}. We work with clients throughout New Zealand, and travel for projects that need it.`,
  },
  {
    q: "What does Vision8 actually do?",
    a: "Seven connected divisions: video production, photography, audio engineering and music, motion graphics and animation, real estate media, website design and build, and practical AI tools. Most projects draw on more than one of them, which is the reason they sit under one roof rather than being farmed out.",
  },
  {
    q: "What kinds of video do you make?",
    a: "Aerial and underwater filming, marketing and engagement campaigns, corporate communications, food filming and styling, explainer videos, testimonial videos, rural videos, and motion graphics and animation. Work ranges from single pieces to full campaigns.",
  },
  {
    q: "Do you work on Te Ao Māori and Pasifika projects?",
    a: "Yes, and it is a long-standing part of the work rather than an add-on. Honouring Indigenous culture means understanding the importance of doing things the right way, so these projects are approached with the process and the people first.",
  },
  {
    q: "Can you help people who are uncomfortable on camera?",
    a: "Yes. Being good at your job does not automatically make being filmed easy. We have spent years directing people in front of cameras, from television and live events through to presenters and people who would simply rather not be filmed at all.",
  },
  {
    q: "What do you offer for real estate?",
    a: "Property photography, video, 3D walkthroughs, 2D floor plans and virtual staging, with experienced direction for the agents and vendors appearing on camera.",
  },
  {
    q: "Do you build websites, and can we update them ourselves afterwards?",
    a: "Yes to both. Sites are built around what you are actually trying to achieve, and handed over so you can keep them current yourself. Your domain stays yours and hosting is looked after.",
  },
  {
    q: "How does a project usually start?",
    a: `Almost always with a short conversation about what you are trying to achieve, before anyone talks about cameras or budgets. Email ${CONTACT.email} or call the number on the contact page and we will take it from there.`,
  },
];

/*
  One FAQPage node listing every question. Kept on this page rather than in the
  root layout: FAQPage describes this document, and repeating it site-wide is
  the usual way a site gets its rich results suppressed for spammy markup.
*/
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_URL}/faq#page`,
  url: `${SITE_URL}/faq`,
  about: { "@id": `${SITE_URL}/#org` },
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function FaqPage() {
  return (
    <PortfolioShell
      eyebrow="FAQ"
      title="Questions worth asking."
      intro="What Vision8 covers, where we are, and how a project usually begins."
    >
      <div className="faq-list">
        {faqs.map(({ q, a }) => (
          <article className="faq-item" key={q}>
            <h2>{q}</h2>
            <p>{a}</p>
          </article>
        ))}
      </div>

      <script
        type="application/ld+json"
        // Literal object built from the list above, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </PortfolioShell>
  );
}

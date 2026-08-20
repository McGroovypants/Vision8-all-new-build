import type { Metadata } from "next";
import { PortfolioShell } from "../portfolio-shell";
import { SITE_URL, CONTACT } from "../site";

/*
  New in v1.11.68. Until now the only way to contact Vision8 was a `mailto:` in
  the header and /contact answered 404, which cost three separate things: the
  old site's /contact had nowhere to redirect to, the phone number and location
  published on the old site appeared nowhere in this build, and a model asked
  for a video company in Wellington had no page stating name, place and contact
  as facts it could cite.

  [NOTE] The copy here is deliberately plain and wants Andy's eye. The details
  are lifted from the current live site's contact page, checked 20 August 2026,
  and should be confirmed before launch.
*/

export const metadata: Metadata = {
  title: "Contact | Vision8",
  description:
    "Talk to Vision8 in Wellington, Aotearoa New Zealand. Phone +64 21 579 205 or email info@vision8.co.nz.",
  alternates: { canonical: "/contact" },
};

// Digits only, which is what a tel: href needs.
const TEL_HREF = `tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`;

/*
  ContactPage rather than a second LocalBusiness: the organisation is already
  described once in the root layout, so this references that @id instead of
  restating it. Two competing LocalBusiness blocks on one origin is the usual
  way a knowledge panel ends up with the wrong phone number.
*/
const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact#page`,
  url: `${SITE_URL}/contact`,
  name: "Contact Vision8",
  about: { "@id": `${SITE_URL}/#org` },
};

export default function ContactPage() {
  return (
    <PortfolioShell
      eyebrow="Contact"
      title="Tell us what you're thinking."
      intro="Wellington based, working anywhere in Aotearoa New Zealand."
    >
      <div className="portfolio-intro-grid">
        <h2>Start with a conversation.</h2>
        <p>
          Most projects begin with a short call about what you are trying to
          achieve, before anyone talks about cameras or budgets.
        </p>
      </div>

      <div className="portfolio-card-grid">
        <article className="portfolio-card">
          <span>Email</span>
          <h3>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </h3>
        </article>
        <article className="portfolio-card">
          <span>Phone</span>
          {/*
            Local form on screen, international in the href, so the link still
            dials correctly from any handset while the number reads as a New
            Zealand mobile. See the note in site.ts.
          */}
          <h3>
            <a href={TEL_HREF}>{CONTACT.phoneDisplay}</a>
          </h3>
        </article>
        <article className="portfolio-card">
          <span>Where we are</span>
          {/*
            The bilingual form is carried over from the current live site. It is
            the studio's own phrasing and a genuine point of difference, so it
            is kept rather than flattened to "Wellington".
          */}
          <h3>Te Whanganui-a-Tara, Aotearoa</h3>
          <p>Wellington, New Zealand</p>
        </article>
      </div>

      <script
        type="application/ld+json"
        // Literal object defined above, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
    </PortfolioShell>
  );
}

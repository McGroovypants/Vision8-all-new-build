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

/*
  v1.11.74: a hero background, from Andy's shortlist of four. High-country sheep
  under a wide sky, which backs the intro line about working anywhere in
  Aotearoa. Served from the S3 bucket, not Cloudinary.

  [NOTE] v1.11.73 tried the live-event stage frame (`img-4112`) here and it did
  not work. `.portfolio-hero-image` holds the picture at 0.56 opacity under
  `.portfolio-hero-wash`, which is tuned for full-daylight frames; an image that
  is already mostly black comes through as an empty hero. A dark frame can be
  used here, but it needs its own opacity override, not the shared default.
*/
const HERO =
  "https://media.vision8.co.nz/library/public/assets/imgc1439-1600x1200-1786736431-78392ba8/optimised.jpg";

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
      heroImage={HERO}
      className="contact-shell"
    >
      {/* v1.11.82: `contact-shell` halves the contact rows and shortens the
          hero so the heading and all three details sit in the first screen
          (checked at the client's 90% zoom on a Mac), with no scroll. */}
      {/* v1.11.81: the paragraph under the heading is gone on the client's
          mark; the heading stands alone above the details. */}
      <div className="portfolio-intro-grid">
        <h2>Start with a conversation.</h2>
      </div>

      {/*
        v1.11.80: three plain rows, not cards, on the client's mark ("do not
        like the boxes"). The v1.11.68 note already said the case-study card
        style left a lot of empty box round a phone number. A row is a label
        and the fact, separated by the page's hairline, with the fact set large
        enough to be the thing you read. A definition list, because that is
        what it is: three terms and their values.
      */}
      <dl className="contact-lines">
        <div>
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </dd>
        </div>
        <div>
          <dt>Phone</dt>
          {/*
            Local form on screen, international in the href, so the link still
            dials correctly from any handset while the number reads as a New
            Zealand mobile. See the note in site.ts.
          */}
          <dd>
            <a href={TEL_HREF}>{CONTACT.phoneDisplay}</a>
          </dd>
        </div>
        <div>
          <dt>Where we are</dt>
          {/*
            The bilingual form is carried over from the current live site. It is
            the studio's own phrasing and a genuine point of difference, so it
            is kept rather than flattened to "Wellington".
          */}
          <dd>
            Te Whanganui-a-Tara, Aotearoa
            <small>Wellington, New Zealand</small>
          </dd>
        </div>
      </dl>

      <script
        type="application/ld+json"
        // Literal object defined above, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
    </PortfolioShell>
  );
}

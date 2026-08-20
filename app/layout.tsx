import type { Metadata, Viewport } from "next";
import "./homepage-v1.10.3.css";
import "./portfolio-pages.css";
import { SITE_URL, SITE_NAME, OG_IMAGE, CONTACT, IS_PREVIEW } from "./site";

const favicon =
  "https://res.cloudinary.com/deyb4o5qz/image/upload/v1785634833/new_vision8_logo_-_favicon_ofao6i.png";

export const metadata: Metadata = {
  // No version in the title: it goes stale and misleads. The on-page build
  // stamp is the authority.
  title: "Vision8",
  description:
    "Video, photography, audio, animation, real estate media, websites and AI solutions.",
  /*
    metadataBase makes every relative canonical and OG url in the child pages
    resolve to an absolute address. Without it Next emits relative og:url,
    which several scrapers reject outright.
  */
  metadataBase: new URL(SITE_URL),
  /*
    Keeps the dev site out of the index until the nameservers move. Switches
    itself off when SITE_URL stops being the workers.dev address. The three
    private routes set their own noindex and are unaffected either way.
  */
  ...(IS_PREVIEW ? { robots: { index: false, follow: true } } : {}),
  icons: {
    icon: favicon,
    shortcut: favicon,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_NZ",
    url: SITE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
};

/*
  v1.11.67: `viewport-fit=cover` lets the page reach under a phone's rounded
  corners and notch, which is what makes a landscape hero fill the screen
  rather than sit in a letterbox between two black bars. It only works paired
  with the safe-area padding in the stylesheet: without that the notch would
  crop the header's own content in landscape.

  Next writes width=device-width and initial-scale=1 by default; both are
  restated here because declaring the export replaces the default outright.
*/
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/*
  Structured data. Nothing on this site states in machine-readable form who
  Vision8 is or where it is, so a language model asked to name a video company
  in Wellington has no fact it can cite. Prose alone does not survive being
  summarised; this does. Rendered once in the layout so it appears on every
  route, with @id so the per-page graphs can reference the same organisation.
*/
const organisation = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#org`,
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT.email,
  telephone: CONTACT.phone,
  image: OG_IMAGE,
  description:
    "Creative media studio in Wellington, Aotearoa New Zealand. Video, photography, audio, animation, real estate media, websites and AI solutions.",
  /*
    addressLocality is the suburb rather than the city, with the city in
    addressRegion. That is the shape Google expects for a New Zealand address
    and it is more precise for a location-qualified search than "Wellington"
    alone, which every studio in the region also claims.
  */
  address: {
    "@type": "PostalAddress",
    addressLocality: CONTACT.suburb,
    addressRegion: CONTACT.region,
    addressCountry: CONTACT.country,
  },
  areaServed: { "@type": "Country", name: "New Zealand" },
  makesOffer: [
    "Video production",
    "Photography",
    "Audio engineering and music production",
    "Motion graphics and animation",
    "Real estate media",
    "Website design and build",
    "AI tools and automation",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
      en-NZ rather than en: the audience is domestic, and the tag is also what
      tells a screen reader and a translation tool to expect New Zealand
      English alongside the te reo Māori used through the site.
    */
    <html lang="en-NZ">
      <body>
        {children}
        <script
          type="application/ld+json"
          // The value is a literal object defined above, never user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}
        />
      </body>
    </html>
  );
}

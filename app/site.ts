/*
  One place for the site's public identity. Canonical URLs, the sitemap and the
  structured data all have to agree on a single origin, and they are written in
  three different files, so the origin lives here rather than being repeated.

  [IMPORTANT] SITE_URL is deliberately still the workers.dev address. Pointing
  canonicals at vision8.co.nz before the domain cuts over would tell Google that
  the authoritative copy of every page is the *old* Duda site, which is what
  answers there today. Change this one line at cutover, after the domain
  resolves to this Worker, and canonicals, sitemap and JSON-LD all follow.
*/
export const SITE_URL = "https://vision8-all-new-build.andy-96d.workers.dev";

export const SITE_NAME = "Vision8";

/*
  True while the site is answering on the workers.dev address, which is the dev
  site until the nameservers move. It drives a site-wide `noindex`.

  Without it the dev site is fully indexable, and a workers.dev copy of every
  page sitting in the index is a duplicate that competes with vision8.co.nz the
  moment the real domain goes live. Deriving it from SITE_URL rather than
  setting it by hand means the safeguard cannot be left on by accident: change
  the one line above at cutover and indexing switches itself on.

  Crawling stays allowed on purpose. A robots.txt `Disallow` would stop the
  crawler fetching the page, and a page that is never fetched is a page whose
  `noindex` is never read, which is how staging sites end up indexed anyway.
  Let them in, and tell them not to index.
*/
export const IS_PREVIEW = new URL(SITE_URL).hostname.endsWith(".workers.dev");

/*
  Built from the logo already on Cloudinary, padded onto the brand black at the
  1200x630 that Facebook, LinkedIn and Slack all expect. The previous og:image
  was a route hash rather than a file and returned 404, so every share rendered
  blank. A dedicated designed card would be better; this is a correct one.

  [NOTE] Media is moving to the S3 bucket behind media.vision8.co.nz and off
  Cloudinary. This constant is the only place the share image is named, so the
  move is a one-line change here once a 1200x630 card exists on S3. It is still
  Cloudinary only because pointing it at a guessed S3 path would put back the
  404 this replaced. Seven Cloudinary URLs remain across app/, including the
  favicon above and the homepage logo, and they are a separate migration.
*/
export const OG_IMAGE =
  "https://res.cloudinary.com/deyb4o5qz/image/upload" +
  // Logo fitted, then padded left-of-centre onto the brand black canvas.
  "/w_430,c_fit/b_rgb:060808,w_1200,h_630,c_lpad,g_west,x_190" +
  // The rule and the wordmark, matching .header-division in the stylesheet:
  // uppercase, letterspaced, divider at the same soft white as --line.
  "/l_text:Arial_70:%7C,co_rgb:4E5654,g_west,x_610" +
  "/l_text:Arial_32_medium_letter_spacing_11:CREATIVE%20MEDIA,co_rgb:FFFFFF,g_west,x_652" +
  "/f_jpg,q_auto/v1785634240/new_vision8_logo_design_clean_2_whfcvy.png";

/*
  Contact details as published on the current live site's /contact page,
  checked 20 August 2026. They appear nowhere in this build, which is why an
  LLM asked for a video company in Wellington has nothing to cite.

  [NOTE] Confirm these are still current before the site goes live. A wrong
  number in structured data propagates further than a wrong number in body copy,
  because aggregators and models copy it verbatim.
*/
export const CONTACT = {
  email: "info@vision8.co.nz",
  /*
    [NOTE] Andy's call on 20 August 2026: the number is shown on /contact only,
    not in the footer or on every page. It stays in the LocalBusiness block in
    the root layout because that is the machine-readable business record rather
    than displayed copy, and it is the fact that makes the studio findable when
    someone asks a model for a video company in Wellington. Say the word and it
    moves to the contact page's schema alone.
  */
  phone: "+64 21 579 205",
  suburb: "Island Bay",
  locality: "Wellington",
  region: "Wellington",
  country: "NZ",
  // The studio's own bilingual phrasing, carried over from the old site.
  placeLong: "Te Whanganui-a-Tara, Aotearoa / Wellington, New Zealand",
} as const;

/** The public routes, in nav order. The sitemap is generated from this list. */
export const PUBLIC_ROUTES = [
  "/",
  "/video",
  "/photography",
  "/audio",
  "/websites",
  "/real-estate-media",
  "/ai-solutions",
  "/about",
  "/contact",
  "/faq",
] as const;

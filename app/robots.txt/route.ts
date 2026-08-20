import { SITE_URL } from "../site";

/*
  A route handler rather than Next's `app/robots.ts` metadata convention,
  because MetadataRoute.Robots has no way to emit a `Content-Signal` line and
  that line is the whole point of this file. Written by hand keeps SITE_URL as
  the single source of the origin, so cutover stays a one-line change in
  site.ts rather than a hardcoded URL in a static public/robots.txt.

  What was answering here before was Cloudflare's content-signals preamble and
  nothing else: strip the comments and the file was empty. No User-agent, no
  Allow, and no Sitemap line, so nothing pointed a crawler at the route list.

  [IMPORTANT] That preamble is injected by Cloudflare at the zone level, not by
  this app, so this file cannot be assumed to win. After deploying, fetch
  /robots.txt and confirm the rules below actually appear. If the Cloudflare
  text is still served, the managed robots.txt setting has to be turned off in
  the dashboard for this zone.

  Content-Signal, Andy's call on 20 August 2026:
    search=yes    be indexed and returned as results.
    ai-input=yes  be quoted and cited in generated answers. This is the one
                  that governs whether Vision8 gets named when someone asks a
                  model for a video company in Wellington.
    ai-train=yes  may be used to train models. Chosen deliberately for maximum
                  reach. Flip to `no` to reserve rights under Article 4 of the
                  EU copyright directive; `ai-input=yes` would still keep the
                  site citable in answers.

  The three disallowed routes already set robots.index = false in their own
  metadata. Listing them here as well is belt and braces: the meta tag needs the
  page to be fetched and parsed, this stops the fetch.
*/
const BODY = `User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
Disallow: /editor
Disallow: /photography/editor
Disallow: /photography/preview

Sitemap: ${SITE_URL}/sitemap.xml
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      // Crawlers refetch robots.txt often; a day is the usual compromise
      // between propagating a change and not serving it on every hit.
      "cache-control": "public, max-age=86400",
    },
  });
}

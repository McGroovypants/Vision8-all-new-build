import { SITE_URL, CONTACT } from "../site";

/*
  llms.txt, an emerging convention rather than a settled standard: a plain
  markdown summary at the site root, written for a language model rather than a
  browser, pointing at the pages worth reading.

  It earns its place here more than on most sites. Vision8 is deliberately
  light on words and heavy on video, so a model fetching these pages sees a lot
  of markup around a little prose. This states plainly what the visuals convey:
  who the studio is, where it is, and what each division actually does.

  A route handler rather than a static file in public/ so the origin comes from
  SITE_URL and cutover stays a one-line change in site.ts.
*/
const BODY = `# Vision8

> Creative media studio in Te Whanganui-a-Tara, Wellington, Aotearoa New Zealand.
> Seven connected divisions covering video, photography, audio, animation, real
> estate media, websites and AI tools, working across the country.

Vision8 is a Wellington based studio. Work spans corporate communications,
marketing campaigns, documentary and brand film, stills photography, audio
engineering and original music, motion graphics, property media, website design
and build, and practical AI tooling. The studio has particular experience in
Te Ao Māori and Pasifika projects, where the emphasis is on doing things the
right way rather than simply filming them.

## Divisions

- [Video](${SITE_URL}/video): Aerial and underwater filming, marketing and
  engagement campaigns, Te Ao Māori and Pasifika projects, corporate
  communications, food filming and styling, motion graphics and animation,
  explainer videos, testimonial videos and rural videos.
- [Photography](${SITE_URL}/photography): People, organisations and events,
  including company portraits and editorial work.
- [Audio](${SITE_URL}/audio): Audio engineering, music production and original
  composition for television, advertising, film and music releases.
- [Real estate media](${SITE_URL}/real-estate-media): Property photography,
  video, 3D walkthroughs and floor plans, with direction for the people on
  camera.
- [Websites](${SITE_URL}/websites): Website design and build, with clients able
  to keep their own site up to date afterwards.
- [AI solutions](${SITE_URL}/ai-solutions): Focused AI tools, custom apps and
  practical automation built around a specific job.
- [About](${SITE_URL}/about): The people behind the work.

## Contact

- Email: ${CONTACT.email}
- Phone: ${CONTACT.phone}
- Location: Te Whanganui-a-Tara, Aotearoa / Wellington, New Zealand
- [Contact page](${SITE_URL}/contact)
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
}

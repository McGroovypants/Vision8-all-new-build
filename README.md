# Vision8 website

A single-screen fanned homepage plus internal division pages. The current build is the `BUILD` constant in `app/homepage-v1.10.3.tsx`, shown as a stamp on every page.

- The complete homepage fits within one browser viewport.
- Seven fanned branches represent Motion & Animation, Photography, Audio, Video, Real Estate Media, Websites and Tech Solutions.
- Each branch label is a link to that division's page. Hovering selects the division and changes the stage behind it.
- Hovering, focusing or selecting a branch changes the supporting image and provisional copy.
- Each branch line stops before its division label and remains aligned as the viewport changes.
- The branch angles are equally spaced.
- Motion & Animation and AI Solutions use matching line-to-label clearance.
- The opening sequence lights one branch line, its label and its underline at a time on black.
- Each branch remains active for twice as long as v1.9.0.
- The sequence finishes on Video, then reveals its background image over two seconds.
- Moving between sections dissolves their background images or videos over two seconds.
- Every teal fan underline has the same 42px width.
- Motion & Animation and Real Estate Media remain on one line.
- All branch lines meet behind the centre of the Vision8 logo.
- Both teal rings are centred on the same apex and remain absent during the fan sequence.
- Once Video is solid, the inner ring fades in and the expanding ring begins pulsing.
- The homepage header contains Home, About us, Our mahi and Contact, without a duplicate logo.
- About us opens the internal People page at `/about`.
- Returning home from an internal page uses `/?skipintro=1`, which starts the homepage settled instead of replaying the logo intro.
- The opening and central fan use the supplied clean transparent Vision8 logo.
- The browser tab uses the supplied `V8` favicon.
- Each service kicker, large headline and supporting line shares one left edge.
- Supporting explainer text sits at half the previous gap below the large headline.
- Header navigation matches the internal pages: capitals on black, teal rollover, teal Contact.

## Local editor

Select Editor at the bottom right of the homepage to change:

- header wording;
- division labels, section labels, headlines and explainer text;
- text size, colour and brightness by text group;
- font family for the top menu, fan links, teal labels, headlines and explainer text;
- readable font choices that show the current font by name;
- a Google Fonts stylesheet URL;
- each fan label's centred green underline length;
- each fan label and its connected line using compact X and Y fields;
- the proximity between a fan line and its label;
- each section's teal label, headline and explainer position using X and Y fields;
- each top-menu item's position using X and Y fields;
- the central Vision8 logo size and position without moving the fan apex or teal rings;
- Paragraph or H2 to H6 semantics for teal labels and explainer text;
- H1 to H6 semantics for each large headline;
- one global dissolve duration for the first Video reveal and every later media change;
- each section's background media type and URL;
- each section's background using a local still or video upload.

Text, appearance settings and media URLs are saved in the current browser. Local uploads are previews for the current page session only. They are not added to the project or uploaded to Cloudinary.

Font choices are displayed using readable names such as Helvetica Neue, Avenir Next and Georgia. Choose Custom or Google font only when using another installed font or a Google font. Browsers do not provide a reliable list of every installed font.

Heading level and visual font size are independent. For the clearest SEO hierarchy, keep the active primary headline as H1 and use H2 to H6 only for genuine lower-level headings.

Directional button pads have been removed from the editor. All fine positioning now uses the smaller X and Y number fields.

## Pages

| Route | Content |
| --- | --- |
| `/` | Fan homepage with the local editor |
| `/video` | Nine service cards, row-based playback, full-width detail dialog |
| `/about` | People |
| `/photography`, `/audio`, `/real-estate-media`, `/websites`, `/ai-solutions` | Holding routes |

### Video page

- Nine cards in a three-column grid. Card media height is budgeted from the viewport, not card width, so part of the third row stays above the fold as a scroll signal.
- Only one row plays at a time. The top row plays at rest; hovering another row moves playback to it.
- "Find out more" opens a dialog as wide as the grid, with the reel autoplaying.

## Launch locally

Open Terminal in the `Vision8-build-v1.1` folder and run:

```bash
cd 'vision8-concepts-v1.3'
npm run dev -- --port 3003
```

Then open `http://localhost:3003/`.

Stop the local server with `Control-C` in the same Terminal window.

## Notes

- Cloudinary media requires an internet connection.
- `legacy/video-showcase/` holds the imported GitHub Pages source for reference. It is not wired into the build.
- Website, Tech Solutions and Real Estate Media proof remain content gaps. The build names those real services but does not invent case studies.
- The page includes compact laptop, tablet and phone compositions plus reduced-motion fallbacks.

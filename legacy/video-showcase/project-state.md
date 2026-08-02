# Vision8 editor project state

## Version

v1.1.8, focused video-services showcase, 1 August 2026. Baseline remains v1.0.

## Purpose

Turn the Vision8 website editor into a reliable content editor that follows the live preview and preserves the approved site design.

## Current direction

- Treat the current page as a focused video-services showcase that will later be linked from a new Vision8 front page.
- The future front page and broader service architecture remain to be developed separately.
- Keep the nine existing service screens as the core of this page.

## Source of truth

- Repository: `McGroovypants/Vision8Website`
- Current delivery commit: `e9f493b` (`v1.1.8 remove intro section`)
- Main files: `index.html`, `editor/index.html`
- Baseline source copies and checksums: `backups/v1.0-baseline/`

## Confirmed requirements

1. Remove the four-card statistics section: 25+, 500+, 9 and 100%.
2. Repair the logo workflow. It must be a real image field with paste-URL and upload options.
3. The editing panel must follow the preview screen while scrolling, and preview-to-editor selection must work too.
4. Make existing content editable without allowing arbitrary layout changes: text, images, videos, URLs, button labels, modal content, contact details, navigation, footer and site settings.
5. The earlier top-video control plan is superseded for this page: the current direction removes the opening reel entirely.
6. Work in small stages. Each stage needs a focused test, a version increment, a source snapshot, state update and a Git commit.
7. Use Git commits as the durable handover, so the work remains available in VS Code and does not rely on chat memory.
8. Display the current visible build version on both the public website and the editor, so a deployed commit can be confirmed at a glance.

## Completed changes

### v1.0.1, build confirmation

- Added persistent visible `Build v1.0.1` labels to the public website and the editor.
- This release is intentionally limited to version visibility.
- Snapshot: `backups/v1.0.1-build-label/`.

### v1.1.4, brand hero and left header logo

- Added a brand hero section at the top of the page: the large logo now appears before any video.
- The hero logo is an editable image field (`hero-logo`), discovered automatically by the editor under Hero.
- Header logo moved to the left edge; navigation remains at the right edge. Applies to desktop and mobile.
- Home navigation points to the new hero.
- Visible labels updated to Build v1.1.4.
- Snapshot: `backups/pre-v1.1.4-*/` (pre-change) and `backups/v1.1.4-brand-hero/` (post-change).

### v1.1.5, transparent hero-logo asset

- Added the supplied transparent PNG to `assets/vision8-transparent-v1.1.png`.
- Changed only the large hero logo to use that local transparent asset; the left header logo remains unchanged.
- Updated public and editor labels to Build v1.1.5.
- At v1.1.5, the requested logo-to-video-to-logo sequence remained pending.
- Snapshots: `backups/pre-v1.1.5-*/` and `backups/v1.1.5-transparent-hero/`.

### v1.1.6, one-shot logo and reel hero

- Added the supplied white transparent logo as `assets/vision8-logo-white.png`.
- Hero now slowly zooms the logo for four seconds, fades to the existing homepage reel in the same frame, then restores the logo and holds it when the reel ends. The sequence does not repeat unless the page reloads.
- Removed the redundant `About Us` label while retaining the `Premium Video Production Services` heading and approved introductory copy.
- Removed the duplicate reel below the introductory copy.
- Updated public and editor labels to Build v1.1.6.
- Static HTML, JavaScript, asset checksum and diff checks passed. Browser testing was not performed; manual playback validation is pending.
- Snapshots: `backups/pre-v1.1.6-*/` and `backups/v1.1.6-hero-sequence/`.

### v1.1.7, focused video-services showcase

- Removed the complete opening logo-and-reel hero so the page now begins with the video-services introduction.
- Kept all nine service screens and replaced the generic `Our Services` heading with the provisional line `Everything video. Exceptionally done.`
- Removed the former second team profile, including its photograph, role and biography, from the active website source.
- Updated the Home anchor to the first remaining page section and added fixed-header clearance at the top of the page.
- Updated public and editor labels to Build v1.1.7.
- Static HTML, JavaScript, content-count and diff checks passed. Browser testing was not performed; manual desktop and phone validation is pending.
- Snapshots: `backups/pre-v1.1.7-*/` and `backups/v1.1.7-video-services-page/`.

## Known defects and risks

- Editor file uploads are embedded into the downloaded HTML. For optimised hosted assets, add them through the project workflow in VS Code.
- The previously exposed publishing credential must be rotated and removed from any local Git remote configuration before the next production publishing session.

## Delivery stages

### v1.1, content hygiene, completed

- Removed the four statistic cards and all related styling.
- Converted the header logo from a text link to a real image field, with paste-URL and file controls in the editor.
- Removed the browser-held publishing credential and direct GitHub publishing functions. The editor now loads the public site source and downloads a replacement `index.html` for VS Code commit and publishing.
- Updated both visible build labels to `v1.1`.
- Snapshot: `backups/v1.1-content-hygiene/`.

### v1.1.1, header layout, completed

- Changed the fixed site header background to black in both light and dark modes.
- Centred the logo against the page, with all desktop navigation controls aligned to the right edge of the header container.
- Kept the mobile logo centred, with a visible right-side menu button and a header that remains visible during scrolling.
- Updated both visible build labels to `v1.1.1`.
- Snapshot: `backups/v1.1.1-header-layout/`.


### v1.1.2, header alignment correction, completed

- Remove the desktop header container width limit so navigation reaches the page right edge while the grid keeps the logo geometrically centred.
- Retain existing mobile header and menu behaviour.
- Update both visible build labels to `v1.1.2`.
- Snapshot: `backups/v1.1.2-header-alignment/`.

### v1.1.3, homepage and fixed dark theme, completed

- Removed the full-width homepage hero video and its CTA-only hero section. The Home navigation item now leads to About Us, the first remaining page section.
- Removed the light-mode switch, all light-mode overrides and saved theme behaviour. The website now stays dark.
- Set the client-logo scrolling strip to white, including its fade edges, while retaining the surrounding dark site design.
- Updated both visible build labels to `v1.1.3`.
- Snapshot: `backups/v1.1.3-homepage-dark-theme/`.

### v1.2, linked editing

Add bidirectional preview and editor focus behaviour. Selecting an editable preview item opens and scrolls its matching control; focusing a control reveals the matching preview item.

### v1.3, hero controls, superseded

The opening video was removed in v1.1.7. Do not implement hero-video controls unless a future page design explicitly restores a hero video.

### v1.4, comprehensive content fields

Expose remaining existing text, images, videos, links, buttons, modal material, navigation, contact and footer fields.

### v1.5, content structure

Add controlled hide/show, reorder and add/delete functions for repeatable content groups.

## Change controls

- Do not make unrequested design changes.
- Keep layout choices constrained to approved controls, not free-form styling.
- Read the target file before every edit.
- Review the diff after every stage. Do not include unrelated changes.

### v1.1.8, remove intro copy

- Removed the entire introduction section: the "Premium Video Production Services" heading and the company description paragraph.
- Page now opens directly with the services section ("Everything video. Exceptionally done.").
- Home anchor updated to point to the services section.
- Updated public and editor labels to Build v1.1.8.
- Snapshots: `backups/pre-v1.1.8-index.html` and `backups/pre-v1.1.8-editor.html`.

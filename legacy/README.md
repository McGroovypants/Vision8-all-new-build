# Legacy imports

Source material imported for porting into this site. Nothing in this directory is wired into the application. It is outside `app/` and `public/`, so it is not routed and not served.

## video-showcase

The Vision8 video showcase, currently live at `https://mcgroovypants.github.io/V8-website-2026/`.

| | |
| --- | --- |
| Source repository | `https://github.com/mcgroovypants/V8-website-2026.git` |
| Branch | `main` |
| Revision | `2fa2934658b6de3cef643cc2a5cb8cacbdb4d9ab` |
| Revision date | 31 July 2026 23:47 |
| Revision subject | v1.1.8 update project state |
| Imported | 2 August 2026 |

### What was imported

The live site only: `index.html`, `editor/index.html`, both `assets/` images, `README.md` and `project-state.md`. 580KB.

### What was deliberately not imported

The source repository carries a 3.4MB `backups/` directory holding 21 timestamped copies of the same two HTML files. Those copies remain in the source repository and in its git history, which is the correct place for them. Re-importing them here would reproduce the superseded-version accumulation removed from this repository in commit `13e63f4`.

### [CRITICAL] Before retiring the GitHub Pages site

`homepage-v1.10.3.tsx` links to the live Pages URL through the `VIDEO_SITE` constant, and the Vision8 site is not yet deployed. Retiring or redirecting Pages before this site is live and serving that content will break the Video link on the homepage.

Order: critique and decide what is kept, wire the surviving content in as a route, deploy, then retire Pages.

### Note for the critique

`editor/index.html` is a second browser-local editor, separate from the one in the Vision8 homepage. Both will need a decision about whether they ship, and where.

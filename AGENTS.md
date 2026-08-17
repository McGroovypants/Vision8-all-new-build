# Vision8 website

Next.js on Vite (`vinext`), deployed to Cloudflare Workers. A single-screen fan homepage with seven divisions, a built-out Video page and People page, plus holding routes for the rest.

This file is how to work in the repo. It does not hold current state. **State lives in the newest `vision8-handover-v1.10.*.md` in the parent folder**, one level up from this git root.

## Start here

1. Read the newest `../vision8-handover-v1.10.*.md` and `../manifest.md`. Not every build has a handover; v1.10.18 to v1.10.22 were commits only.
2. Establish the current build from `BUILD` in `app/homepage-v1.10.3.tsx`.
3. Read the actual file before editing it. Never edit from memory, a summary, or this document.

The parent folder is not in git. This repo is the git root: `vision8-concepts-v1.3/`. Running git one level up does nothing.

## Commands

```
npm run dev -- --port 3003     # local, http://localhost:3003/
npm run build                  # must pass before any deploy
npm test                       # build, route tests, fan geometry in a browser
npm run lint
```

`npm test` runs every file in `tests/`: the route tests against the built Worker, then `fan-geometry.test.mjs`, which measures the homepage in WebKit at twelve viewports and fails on a label that clips the screen, sits under the header, wraps, or overlaps another label or the logo. Fifteen findings are accepted in `tests/fan-geometry.baseline.json`; anything else is a regression. `UPDATE_BASELINE=1` rewrites that file, `SKIP_BROWSER_TESTS=1` runs the route tests alone. Full notes are in the test's own header.

## Layout

| Path | Role |
| --- | --- |
| `app/homepage-v1.10.3.tsx` | The homepage. One large client component, ~1,200 lines, holds every division record and the editor |
| `app/homepage-v1.10.3.css` | Top of a ten-deep import chain. **Put all new homepage CSS here** |
| `app/portfolio-shell.tsx` | Shared shell for every holding route |
| `app/portfolio-pages.css` | Styles for holding routes only |
| `app/reel-player.tsx` | Real estate reel, muted autoplay, user-enabled sound |
| `app/video/page.tsx`, `app/video/video-services.tsx` | The Video page: nine service cards, row-based playback, detail dialog |
| `app/about/page.tsx` | People |
| `app/portfolio-pages.css` | Styles for the Video, People and holding routes |
| `app/audio/page.tsx` | The Audio page: project stories, people, stills from `public/audio/` |
| `app/<division>/page.tsx` | Holding routes: `photography`, `real-estate-media`, `websites`, `ai-solutions` |
| `worker/index.ts` | Cloudflare Worker entry point |
| `build/sites-vite-plugin.ts`, `.openai/hosting.json` | Imported by `vite.config.ts` |
| `legacy/video-showcase/` | Imported source of the old GitHub Pages showcase, not wired in |

## [CRITICAL] Traps

These have each cost a session. Read before styling or debugging anything visual.

**1. A finished animation beats your CSS.** With `fill-mode: forwards` or `both`, an animation holds every property it animated and later declarations on those properties are ignored. `image-arrive` on `.stage-image` silently defeated every dissolve change from v1.8.1 to v1.10.2; `homepage-v1.10.3.css` clears it with `animation: none`. `line-draw` on `.fan-line` ends at an opacity value, so changing line opacity means **redefining the keyframe**, not writing an `opacity` rule. Before styling a property, check whether an animation already owns it.

**2. The stage has two independent blackout mechanisms.** Media layer opacity, and `.stage-wash` painted above it at `z-index: 1`. A correct image at full opacity can still render as pure black. Both must be checked. Historically the wash used opaque hex where every neighbouring rule used alpha, in two separate places, and blacked out three divisions and the whole intro.

**3. The CSS is a ten-deep import chain.** `homepage-v1.10.3.css` imports v1.10.2, down through v1.8.1 to Tailwind. Any element's real style is up to ten override layers. **Never delete a stylesheet in the chain, and never edit the base to change behaviour. Override at the top.** Flattening it is proposed and not done.

**4. `BUILD` drives the localStorage key.** `STORAGE_KEY` is `vision8-homepage-editor-${BUILD}`. The editor merges saved records over source defaults, so a stale key can pin old media and mask a correct deploy. **Bump `BUILD` in `app/homepage-v1.10.3.tsx` whenever defaults change.** It is the only place; the page titles no longer carry a version, deliberately, because they went stale and misled diagnosis. Persistence is guarded by a `dirty` ref, so loads and reloads no longer write unprompted, but bump anyway.

**5. Query state on the homepage must be resolved on the server.** `/?skipintro=1` skips the logo intro. Reading `window.location.search` inside `homepage-v1.10.3.tsx` to do this **fails silently**: the server renders the intro, React keeps its markup on hydration, and the only sign is a console warning about mismatched attributes. `app/page.tsx` reads `searchParams` and passes the flag down. Any future URL-driven homepage state must go the same way.

**6. Files that look like debris are load-bearing.** `build/sites-vite-plugin.ts`, `.openai/hosting.json`, `worker/index.ts`. All three look like starter leftovers. Verify the import graph before calling anything unused.

**7. Caches mask deploys.** Hard refresh with Cmd+Shift+R. VSCode's embedded browser keeps its own cache and its own localStorage and has lagged a full session behind; treat Chrome as the reference.

**8. Every new route must be its own scroll container.** `homepage-v1.8.1.css` locks the document with `html, body { overflow: hidden }` for the single-screen homepage, and Next.js page CSS is global, so every other route inherits the lock. A new page without `height: 100svh; overflow-y: auto; touch-action: pan-y` on its root is stuck on its hero with everything below unreachable. This has shipped broken three times (holding routes, real estate on mobile, photography v1.11.28). **scrollIntoView and scrollTo still work on a clipped page, so a scripted scroll check passes on a broken page.** Verify scrolling with a real wheel or swipe, or assert the root's computed `overflow-y` is `auto` and `scrollHeight > clientHeight`.

## Verify, do not assume

Never report a change as working from source alone. The build stamp is the authority:

```
curl -s http://localhost:3003/ | grep -o "Build <!-- -->v1\.[0-9]*\.[0-9]*"
curl -s https://vision8-all-new-build.andy-96d.workers.dev/ | grep -o "Build <!-- -->v1\.[0-9]*\.[0-9]*"
```

The `<!-- -->` is React's text-node separator and is expected. **Keep the trailing `*` on both number groups**: without the last one the pattern matches `v1.11.1` inside `v1.11.12` and silently reports the wrong build. The minor number is a wildcard too as of v1.11.40: the pattern was pinned to `v1\.10\.` and had matched nothing at all since v1.11.0, so a deploy check could return empty and read as a failed deploy.

For anything visual, drive a real browser rather than reasoning about the cascade. Playwright with `channel: 'chrome'` works against the dev server and settles questions that source reading cannot. Check computed opacity, the `active` class, and network failures together.

[IMPORTANT] The homepage runs an opening sequence of roughly 6.6 seconds: a 3.2s logo overlay, then the fan lights arm by arm. During it, media layers are held down and hover does nothing. Wait for it, or click Skip intro, before concluding a hover state is broken.

## Push and deploy

Full detail in `../vision8-push-and-deploy-v1.10.12.md`.

```
git push origin main --follow-tags
```

The remote is HTTPS as of v1.10.24, with the `gh` CLI as the credential helper. Nothing needs loading first. The SSH key on this machine is rejected by GitHub rather than merely locked, so `ssh-add --apple-load-keychain`, which earlier versions of this file required, does not help and is no longer needed.

### [CRITICAL] Pushing does not deploy

No CI, no GitHub Action, no `.github` directory. GitHub holds source only. The live site changes only when this runs:

```
npm run build
npx wrangler deploy -c dist/server/wrangler.json
```

Wrangler is already authenticated. An agent can run this; an older handover claimed otherwise and was wrong.

After deploying, report the build and the link in one line and stop. Do not run verification fetches unless asked.

## Conventions

- Lowercase filenames. Convention files in caps: `AGENTS.md`, `README.md`.
- No em-dashes in prose or docs. Commas, colons, semicolons, en-dashes.
- Sentence case headings. `[CRITICAL]` `[IMPORTANT]` `[NOTE]`, never emoji.
- Every build shows its number on every page.
- All text on a build at no less than 50% opacity.
- Match surrounding style. Do not improve adjacent code. Minimum code, nothing speculative.
- Comments in this codebase explain **why**, especially where a rule exists to defeat a trap. Keep that standard; a bare value with no reason invites the next agent to delete it.

## Working rules

- **Declare blast radius** before editing existing files: what changes, in which files, what stays untouched.
- **Two strikes on fixing.** Two failed attempts at the same fault, stop and report. Do not stack a third fix on a diagnosis that was wrong twice.
- **Three strikes on searching.** Three failed attempts to find something, stop and ask.
- **Revert, do not repair.** An edit that did not work goes back to the pre-edit state before re-approaching.
- **Small request, small change.** If a one-line request appears to need refactoring or edits across several files, that is evidence it was misread.
- Snapshot before destructive work; git covers ordinary edit history.
- Do not change images, copy, or design decisions on inference. Ambiguous instruction, ask. An earlier session guessed a division image from an ambiguous list and it stayed wrong for two builds.

## Establish current position

This project moves fast: five builds landed in a single afternoon. Any build number written here is wrong by the time you read it. Establish position from disk, in this order, before doing anything:

```
grep -n 'const BUILD' app/homepage-v1.10.3.tsx      # what the source is
git status -sb                                      # local vs origin
git log --oneline origin/main..HEAD                 # what is unpushed
curl -s https://vision8-all-new-build.andy-96d.workers.dev/ | grep -o "Build <!-- -->v1\.[0-9]*\.[0-9]*"
```

Three things drift apart and regularly disagree: **local source, GitHub, and the live Worker.** They are updated by separate actions. Local can be ahead of GitHub while the Worker is ahead of both. Check all three rather than assuming a push or a deploy implied the other.

Open content items are in the newest `../vision8-handover-v1.10.*.md`. Read it, do not rely on any list here.

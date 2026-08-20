/*
  Fan geometry gate. Runs in `npm test` after the route tests.

  The route tests read server-rendered HTML, which cannot see a collision: the
  fan's labels are positioned by CSS at the tips of rotated arms, so whether two
  of them sit on top of each other is only knowable from a rendered layout. Four
  such faults have shipped (the v1.11.27 phone pass found five at once), and
  v1.11.40 sized the fan up 25 percent, which is exactly the change that puts
  labels into each other. Hence a real browser here.

  It is a regression gate, not a clean-sheet audit. The layout has findings that
  are accepted, eg. three labels wrap on a phone by design. Those live in
  fan-geometry.baseline.json, and the test fails only on a finding that is not
  in it. Fix a baselined finding and the test says so and asks you to prune the
  file; it does not fail for that.

  [OPEN] The twelve landscape-phone entries added to the baseline in v1.11.67
  are known bad, not accepted design. They are in the file so the gate guards
  against them getting worse while the layout question behind them is decided.
  Measured: seven labels of about 120px each need the full 844px of a landscape
  phone, so they have to tier vertically, and four tiers of 54px do not fit in
  390px once the header, the logo core and the copy block have taken theirs.
  Shortening the arms does not help, it bunches the labels into each other,
  because the arm angles are fixed at 0, 23, 46 and 69 degrees off vertical.
  It needs either flatter angles in landscape, a different arrangement, or the
  homepage allowed to scroll there. All three are design decisions.

  UPDATE_BASELINE=1 npm test    rewrites the baseline from what renders now.
  Read the diff before committing it. Silently rebaselining a real collision is
  the one way this file can lie to you.

  SKIP_BROWSER_TESTS=1 npm test skips this file. The route tests still run.

  Playwright is not a dependency of this repo; it resolves from the npx cache,
  the path the v1.11.33 to v1.11.40 verification used. Absent, this test fails
  loudly rather than passing quietly, because a verification that skips itself
  is worse than no verification.
*/
import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import http from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PLAYWRIGHT = "/Users/andy16max/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
const BASELINE = new URL("./fan-geometry.baseline.json", import.meta.url);
const CLIENT = fileURLToPath(new URL("../dist/client", import.meta.url));

/*
  Twelve viewports, each chosen because it changes the answer: the two tiers in
  the CSS turn at 720px wide and 700px tall, laptop windows land near 790px tall
  once browser chrome is taken off a 900px screen, and the SE is the narrowest
  phone the fan has to hold seven labels on.
*/
const VIEWPORTS = [
  { name: "desktop 1920x1080", width: 1920, height: 1080 },
  { name: "MBP14 1512x860", width: 1512, height: 860 },
  { name: "laptop 1440x900", width: 1440, height: 900 },
  { name: "laptop window 1440x790", width: 1440, height: 790 },
  { name: "laptop 1366x768", width: 1366, height: 768 },
  { name: "short 1280x700", width: 1280, height: 700 },
  { name: "short 1280x660", width: 1280, height: 660 },
  { name: "iPad portrait 820x1180", width: 820, height: 1180 },
  { name: "iPad landscape 1180x820", width: 1180, height: 820 },
  { name: "iPhone 390x844", width: 390, height: 844 },
  /* v1.11.67: the landscape phone, where the client reported the browser's
     own chrome holding most of the screen. These two are what is left of a
     modern and an older iPhone once it does. */
  { name: "iPhone landscape 844x390", width: 844, height: 390 },
  { name: "phone landscape 736x414", width: 736, height: 414 },
  { name: "small phone 360x800", width: 360, height: 800 },
  { name: "iPhone SE 320x568", width: 320, height: 568 },
];

const MIME = {
  ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".woff2": "font/woff2", ".ico": "image/x-icon", ".mp4": "video/mp4",
};

/*
  The same built Worker the route tests import, put behind a real HTTP server so
  a browser can load it.

  [IMPORTANT] Static files are tried before the Worker, not through it.
  dist/server/wrangler.json declares assets.directory ../client, and Cloudflare
  serves that directory in front of the Worker: a request for /assets/*.js never
  reaches the fetch handler in production. Routing those to the Worker here
  makes it answer 404 for its own client bundle, the page never hydrates, and
  the fan measures as though the CSS were the only thing running.
*/
async function startServer() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `geometry-${process.pid}`);
  const { default: worker } = await import(workerUrl.href);

  // normalize() then a prefix check: a path carrying .. must not escape the
  // asset directory.
  async function staticFile(pathname) {
    const file = normalize(join(CLIENT, decodeURIComponent(pathname)));
    if (!file.startsWith(CLIENT + sep)) return null;
    try {
      return new Response(await readFile(file), {
        headers: { "content-type": MIME[extname(file)] ?? "application/octet-stream" },
      });
    } catch {
      return null;
    }
  }

  const assets = {
    async fetch(request) {
      const { pathname } = new URL(request.url);
      return (await staticFile(pathname)) ?? new Response("Not found", { status: 404 });
    },
  };

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    const request = new Request(url, {
      method: req.method,
      headers: Object.entries(req.headers).flatMap(([k, v]) =>
        Array.isArray(v) ? v.map((one) => [k, one]) : v == null ? [] : [[k, v]]),
    });
    const send = async (response) => {
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
    };
    staticFile(url.pathname)
      .then((file) =>
        file ??
        worker.fetch(request, { ASSETS: assets }, { waitUntil() {}, passThroughOnException() {} }))
      .then(send)
      .catch((error) => {
        res.writeHead(500);
        res.end(String(error));
      });
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

/* Every finding is one stable string, so the baseline is diffable by eye. */
function findingsFor(vp, data) {
  const found = [];
  const overlaps = (a, b) => !(a.right <= b.x || b.right <= a.x || a.bottom <= b.y || b.bottom <= a.y);

  for (const n of data.nodes) {
    if (n.x < 0 || n.right > vp.width) found.push(`${vp.name} | offscreen | ${n.text}`);
    if (data.header && n.y < data.header.bottom) found.push(`${vp.name} | under header | ${n.text}`);
    if (n.lines > 1) found.push(`${vp.name} | wraps | ${n.text}`);
  }
  for (let i = 0; i < data.nodes.length; i++) {
    for (let j = i + 1; j < data.nodes.length; j++) {
      if (overlaps(data.nodes[i], data.nodes[j])) {
        found.push(`${vp.name} | label overlap | ${data.nodes[i].text} x ${data.nodes[j].text}`);
      }
    }
  }
  if (data.core && data.copy && overlaps(data.core, data.copy)) found.push(`${vp.name} | logo over copy`);
  if (data.core && data.headline && overlaps(data.core, data.headline)) found.push(`${vp.name} | logo over headline`);
  if (data.core && data.core.bottom > vp.height) found.push(`${vp.name} | logo below the fold`);
  return found;
}

async function measure(browser, vp, origin) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  try {
    /*
      skipintro=1 clears the 3.2s logo overlay.

      No wait for the opening sequence: the arms are laid out by CSS on first
      paint and the sequence animates opacity, line width and the media stack,
      none of which move a label. Waiting for the stage to leave .fan-cycle
      cost fourteen minutes across these viewports and changed no measurement.

      The font, though, does have to be resolved before anything is measured:
      text width decides every label box, and the fallback's metrics are not
      the shipped ones.
    */
    /*
      domcontentloaded, not load: the homepage's media comes from Cloudinary and
      "load" waits on all of it. A slow CDN failed this test on a navigation
      timeout with nothing wrong in the layout, which is exactly the false alarm
      a gate must not raise. Nothing measured here depends on those images.
    */
    await page.goto(`${origin}/?skipintro=1`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".fan-node", { state: "attached" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);

    return await page.evaluate(() => {
      const round = (n) => Math.round(n * 10) / 10;
      const box = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: round(r.x), y: round(r.y), right: round(r.right), bottom: round(r.bottom) };
      };
      const nodes = [...document.querySelectorAll(".fan-node")].map((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.15;
        const span = el.querySelector("span");
        const inner = span ? span.getBoundingClientRect() : r;
        return {
          text: el.textContent.trim(),
          x: round(r.x), y: round(r.y), right: round(r.right), bottom: round(r.bottom),
          fontSize: round(parseFloat(cs.fontSize)),
          lines: Math.round(inner.height / lineHeight),
        };
      });
      return { nodes, core: box(".fan-core"), header: box(".site-header"), copy: box(".stage-copy"), headline: box(".stage-headline") };
    });
  } finally {
    await page.close();
  }
}

const skip = process.env.SKIP_BROWSER_TESTS === "1";
let context = null;

before(async () => {
  if (skip) return;
  let webkit;
  try {
    ({ webkit } = await import(PLAYWRIGHT));
  } catch {
    throw new Error(
      `Playwright did not resolve from ${PLAYWRIGHT}.\n` +
      "Install it (npx playwright install webkit) or run with SKIP_BROWSER_TESTS=1 to " +
      "run the route tests alone. Do not treat a skipped geometry test as a pass.",
    );
  }
  const { server, origin } = await startServer();
  context = { browser: await webkit.launch(), server, origin };
});

after(async () => {
  if (!context) return;
  await context.browser.close();
  await new Promise((resolve) => context.server.close(resolve));
});

test("the fan lays out with no new collisions at any viewport", { skip }, async () => {
  const { browser, origin } = context;

  // Four at a time: twelve serial page loads is most of a minute, and the
  // measurements are independent.
  const found = [];
  for (let i = 0; i < VIEWPORTS.length; i += 4) {
    const batch = VIEWPORTS.slice(i, i + 4);
    const results = await Promise.all(batch.map((vp) => measure(browser, vp, origin)));
    batch.forEach((vp, index) => found.push(...findingsFor(vp, results[index])));
  }

  if (process.env.UPDATE_BASELINE === "1") {
    await writeFile(BASELINE, `${JSON.stringify(found.sort(), null, 2)}\n`);
    console.log(`Baseline rewritten with ${found.length} accepted findings. Read the diff.`);
    return;
  }

  const accepted = new Set(JSON.parse(await readFile(BASELINE, "utf8")));
  const regressions = found.filter((one) => !accepted.has(one));
  const resolved = [...accepted].filter((one) => !found.includes(one));

  if (resolved.length) {
    console.log(
      `${resolved.length} baselined finding(s) no longer occur. Prune them from ` +
      `fan-geometry.baseline.json with UPDATE_BASELINE=1:\n  ${resolved.join("\n  ")}`,
    );
  }

  assert.deepEqual(
    regressions,
    [],
    `New fan layout findings. Each is a label clipping the screen, sitting under ` +
    `the header, wrapping, or overlapping something. If one is a deliberate ` +
    `trade-off, rebaseline and say so in the handover:\n  ${regressions.join("\n  ")}\n`,
  );
});

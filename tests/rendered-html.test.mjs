import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Vision8 v1.11.59 homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Vision8 homepage/);
  assert.match(html, /Build <!-- -->v1\.11\.59/);
  assert.match(html, /aria-label="Vision8 home"/);
  assert.match(html, /Audio/);
  assert.match(html, /Tech Solutions/);
  assert.match(html, /Seven connected divisions/);
  assert.match(html, /Adventuresmart_still_7_kbz7fl/);
  assert.match(html, /mixer_rtl9gg/);
  assert.match(html, /websites_2_pic_hysw74/);
  assert.match(html, /AI_Solutions2_d892np/);
  assert.match(html, /opening-media-fade/);
  assert.doesNotMatch(html, /Full_Moon_Risin_shot_doxnzk/);
  assert.doesNotMatch(html, /Lensworks/);
});

const routes = [
  ["/video", "Everything video"],
  ["/about", "Meet the team"],
  ["/photography", "Sometimes one frame is enough."],
  // Each sentence of the Audio headline is its own span, so the full title is
  // never one contiguous string in the markup.
  ["/audio", "What you hear changes what you feel"],
  ["/real-estate-media", "Vision8 Real Estate Media"],
  ["/websites", "Ideas need somewhere to"],
  ["/ai-solutions", "Useful tools, built for the job."],
];

for (const [pathname, expected] of routes) {
  test(`server-renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, /Build (?:<!-- -->)?v1\.11\.59/);
    assert.match(html, />Home</);
    assert.match(html, />About us</);
    assert.match(html, />Our mahi</);
    assert.match(html, />Contact</);
  });
}

// The Real Estate page carries two cleared Vimeo embeds and is still waiting on
// approved photography. The trading name is out of the public markup at the
// client's instruction, and the private Promo V4 cut must never reach it. Both
// are asserted case-insensitively, which is what guards the hand-edited
// testimonials the trading name was removed from.
test("real-estate page embeds only cleared media", async () => {
  const response = await render("/real-estate-media");
  const html = await response.text();
  // All three sources asserted positively, so a silent swap to a different cut
  // is a test failure rather than a surprise. `download.mp4` is the stopgap in
  // force since v1.11.28: the 14 Aug portal republish dropped the `web.mp4`
  // renditions and only the delivery masters are published. When the web
  // renditions return, the page and these three assertions change together.
  // v1.11.49: the hero is Promo V6 from the public assets prefix.
  assert.match(html, /library\/public\/assets\/vision8-real-estate-promo-v6\/vision8-real-estate-promo-v6_1080p\.mp4/);
  // v1.11.56: the 360 reel is Matterport Examples 2 from the public assets
  // prefix. No media on this page comes from the collection now.
  assert.match(html, /library\/public\/assets\/matterport-examples-2\/matterport-examples-2_1080p\.mp4/);
  // v1.11.54: the people reel is Testimonial 2026 Web 2 from the public assets
  // prefix, off the collection.
  assert.match(html, /library\/public\/assets\/testimonial-2026-web-2\/testimonial-2026-web-2_1080p\.mp4/);
  // Nothing on this page may load from the signed prefix: it answers 403 to any
  // request without a key, which a <video src> cannot carry.
  assert.doesNotMatch(html, /media\.vision8\.co\.nz\/library\/(?!public\/)/);
  assert.doesNotMatch(html, /Lensworks/i);
  assert.doesNotMatch(html, /Promo[\s_-]?V4/i);
});

// The editor moved off the front page. Both halves are asserted: that it is
// gone from the public homepage, and that it still exists where it was moved to.
test("the editor is not on the public homepage", async () => {
  const response = await render();
  const html = await response.text();
  assert.doesNotMatch(html, /editor-toggle/);
  assert.doesNotMatch(html, /Homepage editor/);
});

test("the editor lives on its own route and is not indexable", async () => {
  const response = await render("/editor");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /editor-toggle/);
  assert.match(html, /Vision8 homepage editor/);
  assert.match(html, /noindex/);
});

// The photography editor mirrors the homepage editor's arrangement: absent
// from the public page, present on its own unindexable route. The preview
// route exists only for the editor's phone-preview iframe.
test("the photography editor is not on the public photography page", async () => {
  const response = await render("/photography");
  const html = await response.text();
  assert.doesNotMatch(html, /Photography editor/);
  assert.doesNotMatch(html, /editor-panel/);
});

test("the photography editor lives on its own route and is not indexable", async () => {
  const response = await render("/photography/editor");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Photography editor/);
  assert.match(html, /editor-panel/);
  assert.match(html, /noindex/);
});

test("the photography preview route renders and is not indexable", async () => {
  const response = await render("/photography/preview");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Sometimes one frame is enough\./);
  assert.match(html, /noindex/);
  assert.doesNotMatch(html, /editor-panel/);
});

// Publish to live (v1.11.39). The test Worker runs with no KV binding and no
// token, so the routes must degrade cleanly: no layout, and publishing
// declared unconfigured rather than crashing or silently accepting writes.
test("photography layout endpoint 404s with no published layout", async () => {
  const response = await render("/photography/layout.json");
  assert.equal(response.status, 404);
});

test("photography publish endpoint refuses when unconfigured", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-publish`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/photography/publish", { method: "POST", body: "{}" }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 503);
});

test("internal Video and About navigation replace the external GitHub page", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /href="\/video"/);
  assert.match(html, /href="\/about"/);
  assert.doesNotMatch(html, /mcgroovypants\.github\.io\/V8-website-2026/);
});

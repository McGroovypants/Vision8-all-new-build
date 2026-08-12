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

test("server-renders the Vision8 v1.11.11 homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Vision8 homepage/);
  assert.match(html, /Build <!-- -->v1\.11\.11/);
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
  ["/photography", "Still work with purpose."],
  // Each sentence of the Audio headline is its own span, so the full title is
  // never one contiguous string in the markup.
  ["/audio", "What you hear changes what you feel"],
  ["/real-estate-media", "Vision8 Real Estate Media"],
  ["/websites", "Useful digital experiences."],
  ["/ai-solutions", "Useful tools, built for the job."],
];

for (const [pathname, expected] of routes) {
  test(`server-renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, /Build (?:<!-- -->)?v1\.11\.11/);
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
  // Both embeds asserted positively, so a silent swap to a different video is a
  // test failure rather than a surprise.
  assert.match(html, /player\.vimeo\.com\/video\/1217581060\?h=015949962e/);
  assert.match(html, /player\.vimeo\.com\/video\/1217587526\?h=aecf03551a/);
  assert.doesNotMatch(html, /Lensworks/i);
  assert.doesNotMatch(html, /Promo[\s_-]?V4/i);
});

test("internal Video and About navigation replace the external GitHub page", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /href="\/video"/);
  assert.match(html, /href="\/about"/);
  assert.doesNotMatch(html, /mcgroovypants\.github\.io\/V8-website-2026/);
});

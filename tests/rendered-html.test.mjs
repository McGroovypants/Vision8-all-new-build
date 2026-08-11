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

test("server-renders the Vision8 v1.10.24 homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Vision8 homepage/);
  assert.match(html, /Build <!-- -->v1\.10\.24/);
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
  ["/audio", "Crafted Sound. Human Emotion. Real Instruments."],
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
    assert.match(html, /Build (?:<!-- -->)?v1\.10\.24/);
    assert.match(html, />Home</);
    assert.match(html, />About us</);
    assert.match(html, />Our mahi</);
    assert.match(html, />Contact</);
  });
}

test("real-estate holding page is honest about missing final media", async () => {
  const response = await render("/real-estate-media");
  const html = await response.text();
  assert.match(html, /Real estate reel source to be added/);
  assert.match(html, /final real-estate reel URL is still required/);
  assert.doesNotMatch(html, /Lensworks/);
});

test("internal Video and About navigation replace the external GitHub page", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /href="\/video"/);
  assert.match(html, /href="\/about"/);
  assert.doesNotMatch(html, /mcgroovypants\.github\.io\/V8-website-2026/);
});

/*
  Fan geometry audit. Not part of `npm test`: it needs a dev server and a real
  browser, so it is run by hand.

    npm run dev -- --port 3003
    node tests/fan-geometry.audit.mjs

  Written for v1.11.40, which sized the fan up 25 percent. The uplift is capped
  by viewport height (see the closing block of homepage-v1.10.3.css), and the
  caps were chosen from what this script measured, so it is the instrument that
  checks those numbers rather than a description of them.

  It reports, per viewport: every label's box and rendered font size, every
  pairwise label overlap, labels clipping the screen edge or sitting under the
  header, labels wrapping to more than one line, and the logo against the
  division copy. Some findings are expected and predate v1.11.40: three labels
  wrap on phones by design, Video and Real Estate touch on an iPad in portrait,
  and the top label sits over the header band on screens under 700px tall. Run
  it against the previous build before treating any of those as a regression;
  the v1.11.27 pass lost its own copy of this script and the next session had
  to rebuild it from scratch.

  Playwright is not a dependency of this repo. It resolves from the npx cache,
  the same path the v1.11.33 and v1.11.39 verification used.
*/
import { webkit } from '/Users/andy16max/.npm/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const ORIGIN = process.env.ORIGIN ?? 'http://localhost:3003';

const VIEWPORTS = [
  { name: 'desktop 1920x1080', width: 1920, height: 1080 },
  { name: 'MBP14 1512x860', width: 1512, height: 860 },
  { name: 'laptop 1440x900', width: 1440, height: 900 },
  { name: 'laptop window 1440x790', width: 1440, height: 790 },
  { name: 'laptop 1366x768', width: 1366, height: 768 },
  { name: 'short 1280x700', width: 1280, height: 700 },
  { name: 'short 1280x660', width: 1280, height: 660 },
  { name: 'iPad portrait 820x1180', width: 820, height: 1180 },
  { name: 'iPad landscape 1180x820', width: 1180, height: 820 },
  { name: 'iPhone 390x844', width: 390, height: 844 },
  { name: 'small phone 360x800', width: 360, height: 800 },
  { name: 'iPhone SE 320x568', width: 320, height: 568 },
];

const browser = await webkit.launch();
let problems = 0;

for (const vp of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  // skipintro=1 clears the 3.2s logo overlay; the arms still arm in sequence,
  // hence the settle wait before anything is measured.
  await page.goto(`${ORIGIN}/?skipintro=1`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const data = await page.evaluate(() => {
    const round = (n) => Math.round(n * 10) / 10;
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height), right: round(r.right), bottom: round(r.bottom) };
    };
    const nodes = [...document.querySelectorAll('.fan-node')].map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.15;
      const span = el.querySelector('span');
      const inner = span ? span.getBoundingClientRect() : r;
      return {
        text: el.textContent.trim(),
        x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height),
        right: round(r.right), bottom: round(r.bottom),
        fontSize: round(parseFloat(cs.fontSize)),
        lines: Math.round(inner.height / lineHeight),
      };
    });
    return { nodes, core: box('.fan-core'), header: box('.site-header'), copy: box('.stage-copy'), headline: box('.stage-headline') };
  });

  console.log(`\n===== ${vp.name} =====`);
  const overlap = (a, b) => !(a.right <= b.x || b.right <= a.x || a.bottom <= b.y || b.bottom <= a.y);

  for (const n of data.nodes) {
    const flags = [];
    if (n.x < 0 || n.right > vp.width) flags.push(`OFFSCREEN ${n.x}..${n.right} of ${vp.width}`);
    if (data.header && n.y < data.header.bottom) flags.push(`UNDER HEADER y ${n.y} < ${data.header.bottom}`);
    if (n.lines > 1) flags.push(`WRAPS ${n.lines} lines`);
    if (flags.length) problems++;
    console.log(`  ${n.text.padEnd(20)} ${String(n.fontSize).padStart(5)}px  ${n.x},${n.y} ${n.w}x${n.h}  ${flags.join(' ') || 'ok'}`);
  }

  for (let i = 0; i < data.nodes.length; i++) {
    for (let j = i + 1; j < data.nodes.length; j++) {
      if (overlap(data.nodes[i], data.nodes[j])) {
        problems++;
        console.log(`  OVERLAP: ${data.nodes[i].text} x ${data.nodes[j].text}`);
      }
    }
  }

  for (const [label, a, b] of [['logo vs copy', data.core, data.copy], ['logo vs headline', data.core, data.headline]]) {
    if (a && b && overlap(a, b)) { problems++; console.log(`  OVERLAP: ${label}`); }
  }
  if (data.core && data.core.bottom > vp.height) { problems++; console.log(`  LOGO BELOW FOLD: ${data.core.bottom} > ${vp.height}`); }

  console.log(`  logo ${data.core?.w}x${data.core?.h} at ${data.core?.y}..${data.core?.bottom}; header bottom ${data.header?.bottom}; copy top ${data.copy?.y}`);
  await page.close();
}

await browser.close();
console.log(`\n>>> findings: ${problems}`);

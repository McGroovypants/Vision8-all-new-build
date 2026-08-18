"use client";

import { useEffect, useRef } from "react";
import { BUILD, PageHeader } from "../portfolio-shell";

/*
  The Websites page. Ported from mock v3.4 (Web page build folder) on
  19 Aug 2026, with three fixes the mock review asked for on the same day:

  - Octacle loops seamlessly. Its clip is 14.8s of continuously moving fins,
    so a plain `loop` restart is a visible cut. Two layered videos of the same
    file crossfade near the end, the way the Octacle site itself plays it.
  - The strip's two copies keep their twins in step. At the wrap point the
    card at centre changes DOM identity; without syncing currentTime the
    incoming twin resumed from wherever it had paused, which read as a glitch.
  - Every strip clip preloads in full so a card does not spin a decoder up at
    the moment it starts, which dropped frames on the drift.

  Playback follows the blurb: only the card the text is describing moves,
  plus Octacle, which always moves. Everything else holds a still frame.
*/

const M = "https://media.vision8.co.nz/library/public/assets/";
const CONTACT = "mailto:info@vision8.co.nz";

// Drift in px/s and the delay before the strip fades in, both from the mock.
const SPEED = 91;
const START = 2200;
// The blurb lags the centred card by this much before it crossfades.
const LAG = 1500;
// Octacle crossfade length, seconds before the end of the clip.
const XFADE = 0.9;

type Item = {
  t: string;
  b: string;
  v?: string;
  p: string;
  in?: number;
  out?: number;
  cue?: string;
  fit?: "contain" | "crop";
  seamless?: boolean;
};

const items: Item[] = [
  {
    t: "Octacle",
    b: "Giving a unique product, a world of its own.",
    v: `${M}octacle-web-example/octacle-web-example_1080p.mp4`,
    p: "/websites/octacle.jpg",
    seamless: true,
  },
  {
    t: "Colour Character",
    b: "An interactive colour tool for video editors, designed and built from scratch.",
    v: `${M}cc-web-example/cc-web-example.mp4`,
    p: "/websites/colour-character.jpg",
    fit: "crop",
  },
  {
    t: "Travelman",
    b: "Built around a journey: the story so far, the chapters still to come, and a way for readers to follow along.",
    v: `${M}jerry-edit-web-example/jerry-edit-web-example_1080p.mp4`,
    p: "/websites/travelman.jpg",
    in: 0,
    out: 11.5,
    cue: "See the editor in action",
  },
  {
    t: "Coastguard New Zealand",
    b: "Sometimes the answer isn't a website. A purpose-made media portal: their brand, their library, one place to find the right photo or video fast.",
    v: `${M}coastguard-web-example/coastguard-web-example_1080p.mp4`,
    p: "/websites/coastguard.jpg",
  },
  {
    t: "Andy McGrath",
    b: "A musician's site shouldn't feel like a travel writer's. No house style, no template. It starts from what it's for.",
    v: `${M}andy-music-web-example/andy-music-web-example_1080p.mp4`,
    p: "/websites/andy-mcgrath.jpg",
  },
  {
    t: "vision8.co.nz",
    b: "Our own front door. When an idea needs its own software, we build that too.",
    v: `${M}v8-example-2/v8-example-2_1080p.mp4`,
    p: "/websites/vision8.jpg",
    fit: "contain",
  },
];

const EDITOR_SRC = `${M}jerry-edit-web-example/jerry-edit-web-example_1080p.mp4`;
const EDITOR_IN = 12.0;
const EDITOR_OUT = 33.0;

export function WebsitesView() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const strip = root.querySelector<HTMLElement>(".ws-strip")!;
    const track = root.querySelector<HTMLElement>(".ws-track")!;
    const rail = root.querySelector<HTMLElement>(".ws-rail")!;
    const blurb = root.querySelector<HTMLElement>(".ws-blurb")!;
    const cards = Array.from(track.querySelectorAll<HTMLElement>(".ws-card"));
    const blurbItems = Array.from(blurb.querySelectorAll<HTMLElement>(".ws-item"));
    const cleanups: Array<() => void> = [];
    const on = (el: HTMLElement | Window, type: string, fn: EventListenerOrEventListenerObject, opts?: AddEventListenerOptions) => {
      el.addEventListener(type, fn, opts);
      cleanups.push(() => el.removeEventListener(type, fn, opts));
    };

    // React does not reflect `muted` into server markup, so set it here before
    // any play() call, or autoplay policy refuses.
    root.querySelectorAll("video").forEach((v) => {
      v.muted = true;
      v.defaultMuted = true;
    });

    // Clips that should play only part of themselves, looping inside the range.
    const slice = (v: HTMLVideoElement, a: number, b: number) => {
      const start = () => {
        if (v.currentTime < a || v.currentTime > b) {
          try {
            v.currentTime = a;
          } catch {}
        }
      };
      v.removeAttribute("loop");
      on(v, "loadedmetadata", start);
      if (v.readyState >= 1) start();
      on(v, "timeupdate", () => {
        if (v.currentTime >= b || v.currentTime < a - 0.2) {
          try {
            v.currentTime = a;
          } catch {}
          v.play().catch(() => {});
        }
      });
      on(v, "ended", () => {
        try {
          v.currentTime = a;
        } catch {}
        v.play().catch(() => {});
      });
    };
    cards.forEach((c) => {
      const it = items[Number(c.dataset.i)];
      const v = c.querySelector("video");
      if (v && it.out != null) slice(v, it.in || 0, it.out);
    });
    const editorVideo = root.querySelector<HTMLVideoElement>("#editor video");
    if (editorVideo) slice(editorVideo, EDITOR_IN, EDITOR_OUT);

    // Seamless loop for cards flagged `seamless`: two videos of the same file,
    // A plays; XFADE seconds before its end B starts from 0 and fades up over
    // A; then they swap roles. No visible cut.
    type Pair = { a: HTMLVideoElement; b: HTMLVideoElement; live: HTMLVideoElement; fading: boolean };
    const pairs: Pair[] = [];
    cards.forEach((c) => {
      const vids = c.querySelectorAll<HTMLVideoElement>("video");
      if (vids.length !== 2) return;
      const [a, b] = Array.from(vids);
      a.removeAttribute("loop");
      b.removeAttribute("loop");
      b.style.opacity = "0";
      const pair: Pair = { a, b, live: a, fading: false };
      pairs.push(pair);
      const watch = (v: HTMLVideoElement) =>
        on(v, "timeupdate", () => {
          if (pair.live !== v || pair.fading) return;
          const d = v.duration;
          if (!d || v.currentTime < d - XFADE) return;
          const next = v === pair.a ? pair.b : pair.a;
          pair.fading = true;
          try {
            next.currentTime = 0;
          } catch {}
          next.play().catch(() => {});
          next.style.transition = `opacity ${XFADE}s linear`;
          next.style.opacity = "1";
          window.setTimeout(() => {
            v.pause();
            v.style.transition = "none";
            v.style.opacity = "0";
            pair.live = next;
            pair.fading = false;
          }, XFADE * 1000);
        });
      watch(a);
      watch(b);
    });
    const playCard = (c: HTMLElement) => {
      const pair = pairs.find((p) => c.contains(p.a));
      if (pair) {
        if (pair.live.paused) pair.live.play().catch(() => {});
        return;
      }
      const v = c.querySelector("video");
      if (v && v.paused) v.play().catch(() => {});
    };
    const pauseCard = (c: HTMLElement) => {
      c.querySelectorAll("video").forEach((v) => {
        if (!v.paused) v.pause();
      });
    };

    // Only the card the blurb is describing moves, plus Octacle (index 0),
    // which always moves. Off-screen copies are paused.
    const setActive = (i: number) => {
      cards.forEach((c) => {
        const idx = Number(c.dataset.i);
        const r = c.getBoundingClientRect();
        const onScreen = r.right > -40 && r.left < window.innerWidth + 40;
        if ((idx === i || idx === 0) && onScreen) playCard(c);
        else pauseCard(c);
      });
    };

    // The editor clip below the strip plays whenever it is on screen.
    let eio: IntersectionObserver | undefined;
    if (editorVideo) {
      eio = new IntersectionObserver(
        (es) => {
          es.forEach((en) => {
            const v = en.target as HTMLVideoElement;
            if (en.isIntersecting) v.play().catch(() => {});
            else v.pause();
          });
        },
        { root, threshold: 0.2 },
      );
      eio.observe(editorVideo);
    }

    // Endless slow drift on a sub-pixel transform. Native scroll takes over
    // only when the visitor shows horizontal intent.
    let auto = true;
    let last: number | null = null;
    let startTs: number | null = null;
    let pos = 0;
    let setWidth = 0;
    let leadW = 0;
    const measure = () => {
      if (cards.length < items.length + 1) return;
      setWidth = cards[items.length].offsetLeft - cards[0].offsetLeft;
      leadW = cards[0].offsetLeft;
    };
    measure();
    on(window, "resize", measure);
    track.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
    const fadeTimer = window.setTimeout(() => strip.classList.add("in"), START);
    cleanups.push(() => window.clearTimeout(fadeTimer));

    const inView = () => {
      const r = track.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };
    // At the wrap the centred card changes DOM identity. Keep each pair of
    // twins on the same frame so the swap is invisible.
    const syncTwins = () => {
      for (let i = 0; i < items.length; i++) {
        const a = cards[i];
        const b = cards[i + items.length];
        if (!a || !b) continue;
        const pa = pairs.find((p) => a.contains(p.a));
        const pb = pairs.find((p) => b.contains(p.a));
        if (pa && pb) {
          // Seamless pair: copy the live layer and its time across, so the
          // incoming twin shows the same frame on the same layer.
          const src = !pa.live.paused ? pa : !pb.live.paused ? pb : null;
          if (!src) continue;
          const dst = src === pa ? pb : pa;
          const srcLiveIsA = src.live === src.a;
          dst.live = srcLiveIsA ? dst.a : dst.b;
          dst.fading = false;
          const other = srcLiveIsA ? dst.b : dst.a;
          dst.live.style.transition = "none";
          dst.live.style.opacity = "1";
          other.style.transition = "none";
          other.style.opacity = "0";
          other.pause();
          if (Math.abs(dst.live.currentTime - src.live.currentTime) > 0.08) {
            try {
              dst.live.currentTime = src.live.currentTime;
            } catch {}
          }
          continue;
        }
        const v = a.querySelector("video");
        const w = b.querySelector("video");
        if (!v || !w) continue;
        const src = !v.paused ? v : !w.paused ? w : null;
        if (!src) continue;
        const dst = src === v ? w : v;
        if (Math.abs(dst.currentTime - src.currentTime) > 0.08) {
          try {
            dst.currentTime = src.currentTime;
          } catch {}
        }
      }
    };
    let raf = 0;
    const tick = (now: number) => {
      if (startTs == null) startTs = now;
      if (last == null) last = now;
      const dt = Math.min(64, now - last);
      last = now;
      if (auto && now - startTs < START) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (auto && inView() && setWidth > 0) {
        pos += (SPEED * dt) / 1000;
        if (pos >= leadW + setWidth) {
          pos -= setWidth;
          syncTwins();
        }
        rail.style.transform = `translate3d(${-pos}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    cleanups.push(() => cancelAnimationFrame(raf));

    const takeover = () => {
      if (!auto) return;
      auto = false;
      rail.style.transform = "";
      track.scrollTo({ left: Math.round(pos), behavior: "instant" as ScrollBehavior });
      track.classList.add("snap");
    };
    on(
      track,
      "wheel",
      ((e: WheelEvent) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY) + 2) takeover();
      }) as EventListener,
      { passive: true },
    );
    let tx = 0;
    let ty = 0;
    on(
      track,
      "touchstart",
      ((e: TouchEvent) => {
        tx = e.touches[0].clientX;
        ty = e.touches[0].clientY;
      }) as EventListener,
      { passive: true },
    );
    on(
      track,
      "touchmove",
      ((e: TouchEvent) => {
        const dx = Math.abs(e.touches[0].clientX - tx);
        const dy = Math.abs(e.touches[0].clientY - ty);
        if (dx > dy + 6) takeover();
      }) as EventListener,
      { passive: true },
    );
    // Drag to scroll with the mouse.
    let down = false;
    let sx = 0;
    let sl = 0;
    on(track, "pointerdown", ((e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      sx = e.clientX;
      track.classList.add("grabbing");
      takeover();
      sl = track.scrollLeft;
    }) as EventListener);
    on(window, "pointermove", ((e: PointerEvent) => {
      if (!down) return;
      track.scrollTo({ left: sl - (e.clientX - sx), behavior: "instant" as ScrollBehavior });
    }) as EventListener);
    on(window, "pointerup", () => {
      down = false;
      track.classList.remove("grabbing");
    });
    // Keep the wrap seamless once the visitor is scrolling too.
    on(track, "scroll", () => {
      if (!auto && setWidth > 0 && track.scrollLeft >= leadW + setWidth) {
        track.scrollTo({ left: track.scrollLeft - setWidth, behavior: "instant" as ScrollBehavior });
        syncTwins();
      }
    });

    // Blurb follows whichever card is nearest the centre, LAG ms behind.
    let cur = -1;
    let pending = -1;
    let pendingAt = 0;
    let lastSync = 0;
    let raf2 = 0;
    const centre = (now: number) => {
      const mid = window.innerWidth / 2;
      let best = -1;
      let bd = 1e9;
      cards.forEach((c) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs((r.left + r.right) / 2 - mid);
        if (d < bd) {
          bd = d;
          best = Number(c.dataset.i);
        }
      });
      if (best !== pending) {
        pending = best;
        pendingAt = now || 0;
      }
      if (best !== cur && now - pendingAt >= (cur === -1 ? 0 : LAG)) {
        cur = best;
        blurbItems.forEach((d) => d.classList.toggle("on", Number(d.dataset.i) === best));
        setActive(cur);
        lastSync = now;
      }
      if (now - lastSync > 250) {
        setActive(cur);
        lastSync = now;
      }
      raf2 = requestAnimationFrame(centre);
    };
    raf2 = requestAnimationFrame(centre);
    cleanups.push(() => cancelAnimationFrame(raf2));

    return () => {
      cleanups.forEach((fn) => fn());
      eio?.disconnect();
      root.querySelectorAll("video").forEach((v) => v.pause());
    };
  }, []);

  const scrollToEditor = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    rootRef.current?.querySelector("#editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderCard = (it: Item, i: number, copy: number) => {
    const cls = `ws-card${it.fit ? ` ${it.fit}` : ""}`;
    return (
      <div className={cls} data-i={i} key={`${copy}-${i}`}>
        {it.v ? (
          it.seamless ? (
            <>
              <video src={it.v} poster={it.p} muted loop playsInline preload="auto" aria-hidden="true" />
              <video src={it.v} muted loop playsInline preload="auto" aria-hidden="true" />
            </>
          ) : (
            <video src={it.v} poster={it.p} muted loop playsInline preload="auto" aria-hidden="true" />
          )
        ) : (
          <img src={it.p} alt={it.t} />
        )}
      </div>
    );
  };

  return (
    <main className="websites-page" ref={rootRef}>
      {/* Colour Character's screen recording carries a baked-in gamma shift:
          whites match the app but mid-tones sit ~20% dark and shadows ~1.6x.
          A gamma 0.7 curve in sRGB brings both up without touching white. */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="ws-ccfix" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="gamma" amplitude="1" exponent="0.7" offset="0" />
            <feFuncG type="gamma" amplitude="1" exponent="0.7" offset="0" />
            <feFuncB type="gamma" amplitude="1" exponent="0.7" offset="0" />
          </feComponentTransfer>
        </filter>
      </svg>

      <PageHeader division="Websites" />

      <header className="ws-hero">
        <div className="ws-inner">
          <p className="ws-eyebrow">Websites</p>
          <h1>Ideas need somewhere to&nbsp;live.</h1>
          <p className="ws-lede">Websites and digital experiences built around what you&apos;re actually trying to achieve.</p>
        </div>
      </header>

      <section className="ws-strip" aria-label="Selected work">
        <div className="ws-track">
          <div className="ws-rail">
            <div className="ws-lead" aria-hidden="true" />
            {[0, 1].map((copy) => items.map((it, i) => renderCard(it, i, copy)))}
            <div className="ws-spacer" aria-hidden="true" />
          </div>
        </div>
        <div className="ws-blurb" aria-live="polite">
          {items.map((it, i) => (
            <div className="ws-item" data-i={i} key={it.t}>
              <h3>{it.t}</h3>
              <p>{it.b}</p>
              {it.cue && (
                <a className="ws-cue" href="#editor" onClick={scrollToEditor}>
                  {it.cue}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                    <path d="M12 4v15M5 13l7 7 7-7" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="ws-editor" id="editor">
        <div className="ws-inner">
          <p className="ws-eyebrow">Travelman · the editor</p>
          <h2>Built around a journey. Kept up to date by the traveller.</h2>
          <p className="ws-lede">
            Jerry is out on the road and the story keeps moving, so the site came with an editor built for him: his own
            pages, side by side with the words.
          </p>
          <div className="ws-shot">
            <div className="ws-frame">
              <video src={`${EDITOR_SRC}#t=${EDITOR_IN}`} poster="/websites/travelman-editor.jpg" muted playsInline preload="metadata" aria-hidden="true" />
            </div>
          </div>
          <div className="ws-after">
            <p>
              <strong>And when the story moves on, Jerry updates it himself.</strong> Change a line, swap a picture, apply.
              No support ticket, no waiting, no fee for changing your mind.
            </p>
            <p className="ws-quiet">
              Your domain, your content, your website. Hosting, security and backups are looked after quietly in the
              background, so you never have to think about them.
            </p>
          </div>
        </div>
      </section>

      <section className="ws-closing">
        <div className="ws-inner">
          <p className="ws-steps">
            Talk<span>·</span>See<span>·</span>Refine<span>·</span>Live
          </p>
          <h2>Have something that needs a home?</h2>
          <a href={CONTACT} className="ws-btn">
            Tell us what you&apos;re thinking
          </a>
          <p className="ws-small">Projects start smaller than most people expect.</p>
        </div>
      </section>

      <p className="portfolio-build">Build {BUILD}</p>
    </main>
  );
}

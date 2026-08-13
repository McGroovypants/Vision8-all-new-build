"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const PLAYER_ORIGIN = "https://player.vimeo.com";

/*
  The reel as the hero, cover-cropped to fill the fold rather than sitting in a
  16/9 box, which on a phone would be about 220px tall and not the first thing
  anyone sees.

  Vimeo's chrome is off (`controls=0`) because the player is cropped, so its
  control bar would sit half off-screen. Everything the visitor can touch is
  built here instead: a scrub line along the foot, a text pause control and the
  sound toggle. No play icon anywhere, on the client's instruction, so a paused
  hero never grows the usual triangle over the picture.

  It all runs on the postMessage commands the official Vimeo SDK wraps, so the
  controls cost no third-party script. The origin is pinned rather than "*":
  these messages should only ever reach the player.
*/
export function ReelHero({
  src,
  poster,
  children,
  strip,
}: {
  src: string;
  poster: string;
  children: ReactNode;
  /*
    Rendered on the same bottom row as the controls, baseline-aligned, on the
    client's mark. The row sits low enough to run under the reel's centred logo
    card, which is why the block above it can span the full width.
  */
  strip?: ReactNode;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [percent, setPercent] = useState(0);
  const duration = useRef(0);

  const post = useCallback((method: string, value?: unknown) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify(value === undefined ? { method } : { method, value }),
      PLAYER_ORIGIN,
    );
  }, []);

  /*
    The player reports its own position rather than us running a timer against
    it: a timer drifts as soon as the video stalls to buffer, and the line then
    lies about where the reel actually is.
  */
  useEffect(() => {
    function subscribe() {
      for (const event of ["playProgress", "play", "pause"]) {
        post("addEventListener", event);
      }
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== PLAYER_ORIGIN) return;
      let data = event.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      if (!data || typeof data !== "object") return;

      // `ready` can land before this listener is attached, which is why the
      // iframe's load handler subscribes as well. Subscribing twice is
      // harmless; missing it altogether leaves a line that never moves.
      if (data.event === "ready") subscribe();
      if (data.event === "play") setPlaying(true);
      if (data.event === "pause") setPlaying(false);
      if (data.event === "playProgress" && data.data) {
        duration.current = data.data.duration || duration.current;
        setPercent((data.data.percent || 0) * 100);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [post]);

  function toggleSound() {
    const next = !soundOn;
    // Both, and in this order. Unmuting a player still sitting at volume 0 is
    // silent, which reads as a broken button.
    post("setMuted", !next);
    post("setVolume", next ? 0.25 : 0);
    setSoundOn(next);
  }

  function togglePlay() {
    post(playing ? "pause" : "play");
    setPlaying(!playing);
  }

  function scrub(event: React.MouseEvent<HTMLDivElement>) {
    if (!duration.current) return;
    const bar = event.currentTarget.getBoundingClientRect();
    const fraction = Math.min(Math.max((event.clientX - bar.left) / bar.width, 0), 1);
    post("setCurrentTime", fraction * duration.current);
    setPercent(fraction * 100);
  }

  return (
    <section className="re-hero">
      {/* The still sits behind the player, so the fold is never empty during the
          few seconds Vimeo takes to negotiate a rendition and start. */}
      <div className="re-hero-video" style={{ backgroundImage: `url(${poster})` }}>
        <iframe
          ref={frameRef}
          src={src}
          title="Vision8 real estate reel"
          allow="autoplay; fullscreen; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => {
            for (const event of ["playProgress", "play", "pause"]) post("addEventListener", event);
          }}
        />
      </div>
      <div className="re-hero-wash" aria-hidden="true" />
      <div className="re-hero-copy">
        {children}
        <div className="re-hero-foot">
          <button
            type="button"
            className={`audio-btn re-sound${soundOn ? " audio-btn-solid" : ""}`}
            onClick={toggleSound}
            aria-pressed={soundOn}
          >
            {soundOn ? "Sound on" : "Play with sound"}
          </button>
          {strip}
        </div>
      </div>

      <div className="re-playbar">
        <button type="button" className="re-playtoggle" onClick={togglePlay}>
          {playing ? "Pause" : "Play"}
        </button>
        {/*
          A div rather than an input range: a range control draws a thumb, and a
          thumb on a hero scrubber is the same visual noise as the play icon the
          client asked to be rid of. Keyboard users get the two buttons.
        */}
        <div className="re-scrub" onClick={scrub} role="presentation">
          <span className="re-scrub-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </section>
  );
}

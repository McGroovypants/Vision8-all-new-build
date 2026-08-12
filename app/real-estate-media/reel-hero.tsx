"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";

const PLAYER_ORIGIN = "https://player.vimeo.com";

/*
  The reel as the hero, cover-cropped to fill the fold rather than sitting in a
  16/9 box, which on a phone would be about 220px tall and not the first thing
  anyone sees.

  Chrome is off (`controls=0`) because the player is cropped, so a control bar
  would be half off-screen. Sound is handled here instead. Vimeo's player accepts
  the same postMessage commands the official SDK wraps, so the control costs no
  third-party script at all. The origin is pinned rather than "*": these messages
  should only ever reach the player.
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
    Rendered on the same bottom row as the sound button, baseline-aligned, on
    the client's mark. The row sits low enough to run under the reel's centred
    logo card, which is why the copy block above it can span the full width.
  */
  strip?: ReactNode;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  const post = useCallback((method: string, value: unknown) => {
    frameRef.current?.contentWindow?.postMessage(JSON.stringify({ method, value }), PLAYER_ORIGIN);
  }, []);

  function toggleSound() {
    const next = !soundOn;
    // Both, and in this order. Unmuting a player still sitting at volume 0 is
    // silent, which reads as a broken button.
    post("setMuted", !next);
    post("setVolume", next ? 0.25 : 0);
    setSoundOn(next);
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
    </section>
  );
}

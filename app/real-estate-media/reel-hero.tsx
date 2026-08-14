"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/*
  The reel as the hero, filling the fold rather than sitting in a 16/9 box.

  This was a cropped Vimeo iframe with a postMessage control channel until the
  files moved to the Vision8 portal. A same-origin-ish `<video>` takes
  `object-fit: cover` and `.play()` directly, so the cover-crop calculation, the
  message plumbing, the activation dance and the click-blocking cover all went.
  Nothing here is a workaround any more.

  There is no poster. The client asked for no still at page open, and with
  faststart on the file the first frame arrives quickly enough that a poster
  would mostly be a flash of a different image.
*/
export function ReelHero({ src, children, strip }: { src: string; children: ReactNode; strip?: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [percent, setPercent] = useState(0);

  // The element is the source of truth, not our state: it can pause itself when
  // the tab is hidden or the network stalls, and the control has to follow.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      if (video.duration) setPercent((video.currentTime / video.duration) * 100);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const toggleSound = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const next = !soundOn;
    video.muted = !next;
    video.volume = next ? 0.25 : 0;
    setSoundOn(next);
  }, [soundOn]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  function scrub(event: React.MouseEvent<HTMLDivElement>) {
    const video = videoRef.current;
    if (!video?.duration) return;
    const bar = event.currentTarget.getBoundingClientRect();
    const fraction = Math.min(Math.max((event.clientX - bar.left) / bar.width, 0), 1);
    video.currentTime = fraction * video.duration;
    setPercent(fraction * 100);
  }

  return (
    <section className="re-hero">
      <div className="re-hero-video">
        {/* muted and playsInline are both load-bearing: without muted the
            autoplay is refused outright, and without playsInline iOS takes the
            video fullscreen instead of playing it in place. */}
        <video ref={videoRef} src={src} autoPlay muted loop playsInline preload="auto" />
      </div>
      <div className="re-hero-wash" aria-hidden="true" />
      {/* Top right of the hero, out of the foot row, on the client's mark. */}
      <button
        type="button"
        className={`audio-btn re-sound${soundOn ? " audio-btn-solid" : ""}`}
        onClick={toggleSound}
        aria-pressed={soundOn}
      >
        {soundOn ? "Sound on" : "Play with sound"}
      </button>
      <div className="re-hero-copy">
        {children}
        <div className="re-hero-foot">{strip}</div>
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

"use client";

import { useRef, useState } from "react";

export function ReelPlayer({
  source,
  poster,
}: {
  source?: string;
  poster: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [volume, setVolume] = useState(0.2);

  function enableSound() {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = false;
    void video.play();
    setSoundOn(true);
  }

  function changeVolume(next: number) {
    setVolume(next);
    const video = videoRef.current;
    if (!video) return;
    video.volume = next;
    video.muted = next === 0;
    setSoundOn(next > 0);
  }

  if (!source) {
    return (
      <div className="reel-placeholder" style={{ backgroundImage: `url(${poster})` }}>
        <span>Real estate reel source to be added</span>
      </div>
    );
  }

  return (
    <div className="reel-player">
      <video ref={videoRef} src={source} poster={poster} autoPlay muted loop playsInline controls />
      <div className="reel-sound-controls">
        <button type="button" onClick={enableSound}>{soundOn ? "Sound on" : "Play with sound"}</button>
        <label>
          Volume
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(event) => changeVolume(Number(event.target.value))}
          />
        </label>
      </div>
    </div>
  );
}

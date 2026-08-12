"use client";

import { useRef, type ReactNode } from "react";

/*
  Starts the Vimeo embed inside it the first time the pointer enters the
  section, by reloading the player with autoplay. Muted, so the autoplay is
  allowed; loop=1 on the URL keeps the example running; Vimeo's controls stay
  on, so sound is one click away.

  [CRITICAL] Two findings shaped this, both verified in the browser rather than
  assumed. Vimeo's player ignores a `play` postMessage while it sits untouched
  in click-to-play state, so messaging cannot start it; reloading with
  autoplay=1 is what activates it. And Chromium delivers no mouse boundary
  events to the parent document when the pointer lands directly on a
  cross-origin iframe, so a rollover straight onto the player never reaches
  this wrapper. The `.re-video-cover` element in the markup exists for that:
  it is our DOM sitting over the iframe, so the wrapper's mouseenter always
  fires, and activation removes it so the player's own controls become
  clickable. On touch screens the first tap does the activating instead.
*/
export function HoverPlay({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const activated = useRef(false);

  function activate() {
    if (activated.current) return;
    const root = ref.current;
    const frame = root?.querySelector("iframe");
    if (!frame) return;
    frame.src = `${frame.src}&autoplay=1`;
    root?.querySelector(".re-video-cover")?.remove();
    activated.current = true;
  }

  return (
    <div ref={ref} className={className} onMouseEnter={activate} onClick={activate}>
      {children}
    </div>
  );
}

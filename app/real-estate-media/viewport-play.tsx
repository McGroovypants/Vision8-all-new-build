"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";

const PLAYER_ORIGIN = "https://player.vimeo.com";

/*
  Starts the Vimeo embed inside it when the section scrolls into its own region,
  and pauses it on the way out. Replaces the rollover this shipped with: a
  rollover never fires for anyone scrolling on a phone or a trackpad without
  parking the pointer, so most visitors never saw the examples move.

  [CRITICAL] Two findings shaped the mechanism, both verified in the browser
  rather than assumed:

  1. Vimeo's player ignores a `play` postMessage while it still sits untouched
     in click-to-play state. It acknowledges the handshake and drops the
     command. So the first entry activates the player by reloading it with
     `autoplay=1`; every entry after that is a plain `play` message, which an
     activated player obeys.
  2. Muted is not optional. A programmatic play of unmuted media without a user
     gesture is blocked by autoplay policy, and scrolling is not a gesture. The
     embeds carry `muted=1`, and Vimeo's own controls stay on, so sound is one
     click away.

  The observer margin trims the top and bottom of the viewport so playback
  starts when the section is genuinely the thing being looked at, not when one
  pixel of it clips the edge.
*/
export function ViewportPlay({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const activated = useRef(false);

  const post = useCallback((method: string) => {
    const frame = ref.current?.querySelector("iframe");
    frame?.contentWindow?.postMessage(JSON.stringify({ method }), PLAYER_ORIGIN);
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // The page is its own scroll container, not the document, so the observer
    // has to be told that or it watches a viewport nothing scrolls in.
    const scroller = root.closest(".real-estate-page");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (activated.current) {
            post("play");
            return;
          }
          const frame = root.querySelector("iframe");
          if (!frame) return;
          frame.src = `${frame.src}&autoplay=1`;
          activated.current = true;
        } else if (activated.current) {
          post("pause");
        }
      },
      { root: scroller ?? null, rootMargin: "-15% 0px -15% 0px", threshold: 0.01 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [post]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

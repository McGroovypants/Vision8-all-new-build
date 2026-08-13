"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
  Plays the video inside it while the section is in view and pauses it on the
  way out.

  This needed an activation dance while the examples were Vimeo iframes: an
  untouched player ignored a play message, so the first entry had to reload the
  iframe with autoplay, and a transparent cover had to sit over it because
  Chromium delivers no pointer events to the parent across a cross-origin frame.
  With the files on the Vision8 portal none of that applies; it is two calls.

  Muted is still mandatory. A programmatic play of unmuted media without a user
  gesture is blocked by autoplay policy, and scrolling is not a gesture.
*/
export function ViewportPlay({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const video = root?.querySelector("video");
    if (!root || !video) return;

    // The page is its own scroll container, not the document, so the observer
    // has to be told that or it watches a viewport nothing scrolls in.
    const scroller = root.closest(".real-estate-page");

    const observer = new IntersectionObserver(
      ([entry]) => {
        // A rejected play is not an error worth surfacing: it happens when the
        // tab is backgrounded mid-scroll, and the next entry will try again.
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { root: scroller ?? null, rootMargin: "-15% 0px -15% 0px", threshold: 0.01 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

/*
  Native video controls that take themselves away again.

  The client's mark, v1.11.64: a control bar standing permanently over a
  picture reads as a player rather than as the work, and on a phone it covers
  the bottom of the frame for the whole visit. Touch the picture and the bar
  appears; leave it alone and it goes.

  Imperative rather than a React `controls` prop, because the videos that need
  this are spread across a server-rendered page and two client components and
  the only thing they have in common is a DOM element. Events raised inside the
  control bar are retargeted to the <video> host, so a tap on the bar itself
  counts as activity and keeps it alive rather than restarting the countdown
  from nothing.
*/
const HIDE_AFTER = 2800;

export function attachTapControls(video: HTMLVideoElement) {
  let timer = 0;
  video.controls = false;

  const reveal = () => {
    video.controls = true;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      video.controls = false;
    }, HIDE_AFTER);
  };

  video.addEventListener("pointerdown", reveal);
  video.addEventListener("pointermove", reveal);
  return () => {
    window.clearTimeout(timer);
    video.removeEventListener("pointerdown", reveal);
    video.removeEventListener("pointermove", reveal);
  };
}

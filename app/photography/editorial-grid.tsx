"use client";

import { useEffect, useRef } from "react";

/*
  The mockup's staggered scroll reveal: each editorial image fades up when it
  enters the viewport, delayed by its column position so a row arrives as a
  sweep rather than a block. Reduced motion gets the images already revealed
  via CSS; the observer still runs but the transition is disabled there.
*/
export function EditorialGrid({ images }: { images: { src: string; position: string }[] }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const index = Array.from(grid.children).indexOf(target);
          target.style.transitionDelay = `${(index % 6) * 90}ms`;
          target.classList.add("revealed");
          observer.unobserve(target);
        });
      },
      { threshold: 0.15 },
    );

    grid.querySelectorAll(".ed-img:not(.revealed)").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // Re-run when the editor changes the set: newly added images mount
    // unrevealed and need observing, and a once-only observer would leave
    // them permanently at opacity 0.
  }, [images]);

  return (
    <div className="editorial" ref={gridRef}>
      {images.map((image, index) => (
        <img
          className="ed-img"
          key={`${image.src}-${index}`}
          src={image.src}
          alt=""
          loading="lazy"
          style={{ objectPosition: image.position }}
        />
      ))}
    </div>
  );
}

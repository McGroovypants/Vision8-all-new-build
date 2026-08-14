"use client";

import { useEffect, useRef } from "react";

/*
  The mockup's staggered scroll reveal: each editorial image fades up when it
  enters the viewport, delayed by its column position so a row arrives as a
  sweep rather than a block. Reduced motion gets the images already revealed
  via CSS; the observer still runs but the transition is disabled there.
*/
export function EditorialGrid({ images }: { images: string[] }) {
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

    grid.querySelectorAll(".ed-img").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="editorial" ref={gridRef}>
      {images.map((src) => (
        <img className="ed-img" key={src} src={src} alt="" loading="lazy" />
      ))}
    </div>
  );
}

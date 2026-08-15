"use client";

import { useEffect, useRef } from "react";

/*
  The mockup's staggered scroll reveal: each editorial image fades up when it
  enters the viewport, delayed by its column position so a row arrives as a
  sweep rather than a block. Reduced motion gets the images already revealed
  via CSS; the observer still runs but the transition is disabled there.

  v1.11.36: each image sits in an .ed-cell wrapper with overflow hidden, so
  the editor's zoom (a scale transform on the img) crops inside its own cell
  instead of spilling over the neighbours. The span rules in the stylesheet
  target the cells.
*/
type PointerHandler = ((event: React.PointerEvent<HTMLImageElement>) => void) | undefined;

export function EditorialGrid({
  images,
  onImagePointerDown,
  onImagePointerMove,
  onImagePointerUp,
  onImagePointerCancel,
}: {
  images: { src: string; style: React.CSSProperties; attrs: { draggable?: boolean; "data-edit-target"?: string } }[];
  onImagePointerDown?: PointerHandler;
  onImagePointerMove?: PointerHandler;
  onImagePointerUp?: PointerHandler;
  onImagePointerCancel?: PointerHandler;
}) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          const index = Array.from(grid.children).indexOf(target.parentElement ?? target);
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
        <div className="ed-cell" key={`${image.src}-${index}`}>
          <img
            className="ed-img"
            src={image.src}
            alt=""
            loading="lazy"
            style={image.style}
            {...image.attrs}
            onPointerDown={onImagePointerDown}
            onPointerMove={onImagePointerMove}
            onPointerUp={onImagePointerUp}
            onPointerCancel={onImagePointerCancel}
          />
        </div>
      ))}
    </div>
  );
}

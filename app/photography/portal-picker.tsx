"use client";

import { useCallback, useEffect, useState } from "react";

/*
  v1.11.59: choose photos straight from the portal, in the editor.

  The portal publishes every public collection as a manifest at
  /library/public/collections/<slug>.json, served with
  `access-control-allow-origin: *` (verified 20 Aug 2026), so the editor can
  read it from the browser with no portal changes and no proxy. Only PUBLIC
  collections are reachable this way: a folder that is not published as a
  public collection answers 403 and cannot be listed here.

  Two modes. A section's "Choose photos from portal" ticks any number, in
  order, and replaces the section; a selected image's "Swap from portal"
  picks one and closes. The slug of the collection an image came from is
  recoverable from its URL (/collections-media/<slug>/...), which is how
  "open the folder it came from" works with no extra state; the last slug
  used is kept in localStorage as the fallback for images that did not come
  from the portal.
*/

const SLUG_STORAGE = "v8-photography-picker-slug";
export const DEFAULT_SLUG = "v8-photos";

export const collectionSlugOf = (src: string): string | null =>
  src.match(/collections-media\/([^/]+)\//)?.[1] ?? null;

export const rememberedSlug = (): string => {
  try {
    return window.localStorage.getItem(SLUG_STORAGE) || DEFAULT_SLUG;
  } catch {
    return DEFAULT_SLUG;
  }
};

type Item = { id: string; title: string; thumbnail: string; image: string };

export function PortalPicker({
  heading,
  multi,
  initialSlug,
  currentSrcs,
  onApply,
  onPick,
  onClose,
}: {
  heading: string;
  multi: boolean;
  initialSlug: string;
  currentSrcs: string[];
  onApply?: (srcs: string[]) => void;
  onPick?: (src: string) => void;
  onClose: () => void;
}) {
  const [slug, setSlug] = useState(initialSlug);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [name, setName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [ticked, setTicked] = useState<string[]>([]);

  const load = useCallback(
    (which: string) => {
      const wanted = which.trim();
      if (!wanted) return;
      setStatus("loading");
      fetch(`https://media.vision8.co.nz/library/public/collections/${encodeURIComponent(wanted)}.json`)
        .then((response) => {
          if (!response.ok) throw new Error(String(response.status));
          return response.json();
        })
        .then((data: { name?: string; items?: (Item & { type?: string })[] }) => {
          const images = (data.items ?? []).filter((item) => item.type === "image" && item.image);
          setName(data.name ?? wanted);
          setItems(images);
          /*
            Photos already in the section pre-tick, in the section's order, so
            Apply with no other change is a no-op rather than a wipe. v1.11.62:
            matching is by URL or by portal asset id inside the filename, so a
            section still carrying local copies of portal photos (the published
            layout does; the filenames embed the id) pre-ticks too.
          */
          const exact = new Set(images.map((item) => item.image));
          const matchOf = (src: string): string | null => {
            if (exact.has(src)) return src;
            const base = src.split("/").pop() ?? "";
            const hit = images.find((item) => base.startsWith(item.id));
            return hit ? hit.image : null;
          };
          const seen = new Set<string>();
          const preticked: string[] = [];
          for (const src of currentSrcs) {
            const match = matchOf(src);
            if (match && !seen.has(match)) {
              seen.add(match);
              preticked.push(match);
            }
          }
          setTicked(preticked);
          setStatus("ready");
          try {
            window.localStorage.setItem(SLUG_STORAGE, wanted);
          } catch {}
        })
        .catch(() => setStatus("error"));
    },
    // currentSrcs is stable for the life of one picker opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    // Deferred with a zero timeout like the view's load effect: setState
    // synchronously inside an effect is the lint error this file's parent
    // already documents.
    const timer = window.setTimeout(() => load(initialSlug), 0);
    return () => window.clearTimeout(timer);
  }, [initialSlug, load]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const toggle = (item: Item) => {
    if (!multi) {
      onPick?.(item.image);
      onClose();
      return;
    }
    setTicked((current) =>
      current.includes(item.image) ? current.filter((src) => src !== item.image) : [...current, item.image],
    );
  };

  return (
    <div className="portal-picker-overlay" role="dialog" aria-label={heading} onClick={onClose}>
      <div className="portal-picker" onClick={(event) => event.stopPropagation()}>
        <div className="portal-picker-head">
          <div>
            <h3>{heading}</h3>
            <p>
              {status === "ready"
                ? `${name} — ${items.length} photo${items.length === 1 ? "" : "s"}`
                : status === "loading"
                  ? "Loading collection…"
                  : `No public collection answers to "${slug.trim()}".`}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close picker">Close</button>
        </div>
        <form
          className="portal-picker-slug"
          onSubmit={(event) => {
            event.preventDefault();
            load(slug);
          }}
        >
          <label>
            Portal collection
            <input type="text" value={slug} onChange={(event) => setSlug(event.target.value)} />
          </label>
          <button type="submit">Load</button>
        </form>
        <div className="portal-picker-grid">
          {items.map((item) => {
            const order = ticked.indexOf(item.image);
            return (
              <button
                type="button"
                key={item.id}
                className={order >= 0 ? "ticked" : undefined}
                title={item.title}
                onClick={() => toggle(item)}
              >
                <img src={item.thumbnail} alt={item.title} loading="lazy" />
                {order >= 0 && <span>{order + 1}</span>}
              </button>
            );
          })}
        </div>
        {multi ? (
          <div className="portal-picker-foot">
            <p>
              {ticked.length
                ? `${ticked.length} ticked, in the order shown on each photo. Photos already in the section keep their crop.`
                : "Tick photos in the order the section should show them."}
            </p>
            <button
              type="button"
              className="photo-editor-publish"
              disabled={!ticked.length}
              onClick={() => {
                onApply?.(ticked);
                onClose();
              }}
            >
              Use {ticked.length || "these"} photo{ticked.length === 1 ? "" : "s"}
            </button>
          </div>
        ) : (
          <div className="portal-picker-foot">
            <p>Click a photo to use it in this slot.</p>
          </div>
        )}
      </div>
    </div>
  );
}

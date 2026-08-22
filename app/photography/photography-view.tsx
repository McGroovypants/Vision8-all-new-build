"use client";

/*
  The Photography page and its editor, one component. `editable` is on only
  for /photography/editor and gates the panel and every localStorage read and
  write; `previewSaved` is on only for /photography/preview, which the
  editor's phone preview loads in an iframe and which re-reads saved state on
  `storage` events so edits appear live.

  Since v1.11.39 the page has three layers of truth, strongest last:
  1. Source defaults in data.ts, the durable fallback, updated by handing
     over Copy layout JSON to be baked in.
  2. The published layout in Worker KV, written by the panel's Publish to
     live button (token-guarded) and rendered server-side by the public page
     via the `published` prop, so publishing needs no rebuild or deploy.
  3. The editor's local draft in build-keyed localStorage, visible only in
     this browser until published.

  The panel lists every section vertically in page order; clicking a picture
  or a line of text on the page jumps the panel to that exact item, and
  dragging a photo on the page reframes it (v1.11.36). While the panel is
  open the page docks beside it rather than running underneath.
*/

import React, { useEffect, useRef, useState } from "react";
import { BUILD, PageHeader, SiteFooter } from "../portfolio-shell";
import {
  type Collection,
  type CollectionStyle,
  type PhotoImage,
  type PhotoState,
  type SectionId,
  type PageSlot,
  builtInSections,
  collectionIds,
  collectionName,
  collectionStyles,
  defaultState,
  emptyCollection,
  img,
  mergeSaved,
  newCollectionId,
  sanitizeState,
  styleNames,
} from "./data";
import { EditorialGrid } from "./editorial-grid";
import { PortalPicker, collectionSlugOf, rememberedSlug } from "./portal-picker";

// Same discipline as the homepage editor: saved tuning is keyed to the build,
// so a stale draft cannot pin old media over a later deploy. Bump the shared
// BUILD in portfolio-shell.tsx whenever the defaults change.
const STORAGE_KEY = `vision8-photography-editor-${BUILD}`;

// The publish key is deliberately not build-keyed: it stays valid across
// builds until the Worker secret is rotated.
const PUBLISH_KEY_STORAGE = "vision8-photo-publish-key";

// The same address the Audio and Real Estate pages send people to.
const CONTACT = "mailto:info@vision8.co.nz";

function readSaved(): PhotoState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return mergeSaved(JSON.parse(raw));
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

/*
  Pan and zoom are both anchored on the focal point: object-position pans the
  cover overflow, and --zoom/--origin drive a transform scale in CSS (never
  inline transform, which would silently defeat the hover transforms the
  treatments already own).
*/
/*
  v1.11.58: zoom floors at 1, frame-fill, on the client's mark. The page
  renders every image object-fit: cover with the zoom as a scale on top, so a
  scale below 1 cannot reveal any more of the original: it shows the same
  cover crop smaller, with gaps round it, which is what the 20 to 100 range
  gave since v1.11.37. Cover at 100% already shows the most of the original a
  filled frame can; the floor makes the slider say so.
*/
const focus = (image: PhotoImage) =>
  ({
    objectPosition: `${image.focusX}% ${image.focusY}%`,
    // v1.11.61: `whole` letterboxes rather than crops, for pictures whose
    // subject cannot survive the frame's shape. The dark ground behind every
    // frame is the letterbox.
    objectFit: image.whole ? ("contain" as const) : undefined,
    "--zoom": Math.max(1, image.zoom ?? 1),
    "--origin": `${image.focusX}% ${image.focusY}%`,
    // v1.11.62: relative brightness. The CSS multiplies it into each
    // treatment's own level, so 1 changes nothing anywhere.
    "--bright": Math.min(1.25, Math.max(0.75, image.bright ?? 1)),
  }) as React.CSSProperties;

/*
  v1.11.62: the big frames (hero, breathers) can show a chosen band of the
  picture, cropTop to cropBottom as percentages of the original. The band is
  expressed through the page's existing model, a zoom and an object-position
  computed from the rendered frame and the natural size, so nothing new
  happens in CSS; it has to be computed per frame size, which is why it lives
  in a component with a ResizeObserver rather than in focus(). Cover is the
  floor: a band too shallow for the frame's width is shown as deep as cover
  allows, anchored at the band's top.
*/
/*
  v1.11.64: the frame's own height, as a percentage of the screen, is what
  decides how much of a picture is lost top and bottom at full width. Written
  on the section rather than the image, because the hero's overlay and the
  breather's padding both measure against it. Absent, each frame keeps its
  designed height and the CSS fallback answers.
*/
const frameStyle = (image: PhotoImage): React.CSSProperties | undefined =>
  typeof image.frameH === "number" ? ({ "--frame-h": image.frameH } as React.CSSProperties) : undefined;

function bandStyle(image: PhotoImage, el: HTMLImageElement): React.CSSProperties | null {
  const t = image.cropTop ?? 0;
  const b = image.cropBottom ?? 100;
  if ((t <= 0 && b >= 100) || image.whole) return null;
  if (!el.naturalWidth || !el.naturalHeight || !el.clientHeight) return null;
  const W = el.clientWidth;
  const H = el.clientHeight;
  const cover = Math.max(W / el.naturalWidth, H / el.naturalHeight);
  const fraction = Math.max(0.05, (b - t) / 100);
  const zoom = Math.max(1, H / (el.naturalHeight * cover * fraction));
  const shown = el.naturalHeight * cover * zoom;
  const yOff = Math.min(Math.max((t / 100) * shown, 0), Math.max(shown - H, 0));
  const p = shown > H ? (yOff / (shown - H)) * 100 : 50;
  return {
    objectPosition: `${image.focusX}% ${p}%`,
    "--zoom": zoom,
    "--origin": `${image.focusX}% ${p}%`,
  } as React.CSSProperties;
}

/*
  v1.11.63: what the frame is cropping right now, read from the rendered
  element, so the sliders can show the true starting point instead of 0 and
  100. Inverts the same model bandStyle uses: at the current zoom and
  object-position, which band of the original is on show.
*/
function measuredBand(targetKey: string): { top: number; bottom: number } | null {
  const el = document.querySelector<HTMLImageElement>(`img[data-edit-target="${targetKey}"]`);
  if (!el || !el.naturalWidth || !el.naturalHeight || !el.clientHeight) return null;
  const W = el.clientWidth;
  const H = el.clientHeight;
  const cover = Math.max(W / el.naturalWidth, H / el.naturalHeight);
  const style = getComputedStyle(el);
  const zoom = Math.max(1, parseFloat(style.getPropertyValue("--zoom")) || 1);
  const shown = el.naturalHeight * cover * zoom;
  const posY = parseFloat(style.objectPosition.split(" ")[1] ?? "50") || 50;
  const yOff = (posY / 100) * Math.max(shown - H, 0);
  const top = (yOff / shown) * 100;
  return { top: Math.round(top), bottom: Math.round(top + (H / shown) * 100) };
}

function BandImg({
  image,
  alt = "",
  attrs,
  loading,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: {
  image: PhotoImage;
  alt?: string;
  attrs: { draggable?: boolean; "data-edit-target"?: string };
  loading: "eager" | "lazy";
  onPointerDown?: (event: React.PointerEvent<HTMLImageElement>) => void;
  onPointerMove?: (event: React.PointerEvent<HTMLImageElement>) => void;
  onPointerUp?: (event: React.PointerEvent<HTMLImageElement>) => void;
  onPointerCancel?: (event: React.PointerEvent<HTMLImageElement>) => void;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const [band, setBand] = useState<React.CSSProperties | null>(null);
  const t = image.cropTop ?? 0;
  const bOut = image.cropBottom ?? 100;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => setBand(bandStyle(image, el));
    // Deferred a frame: setState synchronously inside an effect is the lint
    // error this file already documents twice.
    const timer = window.setTimeout(apply, 0);
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    el.addEventListener("load", apply);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      el.removeEventListener("load", apply);
    };
    // Recompute on the values the band reads, not the object identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, bOut, image.focusX, image.whole, image.src]);
  return (
    <img
      ref={ref}
      src={image.src}
      alt={alt}
      loading={loading}
      style={{ ...focus(image), ...(band ?? {}) }}
      {...attrs}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    />
  );
}

type ImageTarget =
  | { kind: "hero" }
  | { kind: "breather"; index: number }
  | { kind: "image"; section: SectionId; index: number };

type Active = ImageTarget | null;

const targetKey = (target: ImageTarget) =>
  target.kind === "image" ? `${target.section}-${target.index}` : target.kind === "breather" ? `breather-${target.index}` : "hero";

// The drag handlers are shared by every image and find their subject through
// this key in a data attribute, so the handlers can be single component-level
// functions (the react-compiler lint rejects ref access inside functions
// minted per image during render).
const parseTarget = (key: string | undefined): ImageTarget | null => {
  if (!key) return null;
  if (key === "hero") return { kind: "hero" };
  if (key.startsWith("breather-")) return { kind: "breather", index: Number(key.slice("breather-".length)) };
  // v1.11.79: any id can be a collection now, so the section is checked
  // against state where the target is used rather than against a fixed list.
  const cut = key.lastIndexOf("-");
  return { kind: "image", section: key.slice(0, cut), index: Number(key.slice(cut + 1)) };
};

export function PhotographyView({
  editable = false,
  previewSaved = false,
  published = null,
}: {
  editable?: boolean;
  previewSaved?: boolean;
  published?: PhotoState | null;
}) {
  const [state, setState] = useState<PhotoState>(published ?? defaultState);
  const [loaded, setLoaded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(editable);
  const [active, setActive] = useState<Active>(null);
  const [phonePreview, setPhonePreview] = useState(false);
  // v1.11.59: the portal picker. Section mode replaces a section's images;
  // single mode swaps the one image the panel has selected.
  const [picker, setPicker] = useState<{ section: SectionId } | { target: ImageTarget } | null>(null);
  const [copied, setCopied] = useState(false);
  const [newStyle, setNewStyle] = useState<CollectionStyle>("editorial");
  const [publishKey, setPublishKey] = useState("");
  const [liveStatus, setLiveStatus] = useState<"unknown" | "published" | "defaults">("unknown");
  const [publishMsg, setPublishMsg] = useState("");
  // Same guard as the homepage editor: nothing is written to localStorage
  // until the user actually changes something, so opening the editor to look
  // never pins the current state over a later deploy.
  const dirty = useRef(false);
  const drag = useRef<{
    target: ImageTarget;
    pointerId: number;
    startX: number;
    startY: number;
    focusX: number;
    focusY: number;
    rangeX: number;
    rangeY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    // Deferred with a zero timeout like the homepage editor's load effect:
    // setState synchronously inside an effect triggers cascading renders and
    // is a lint error.
    const timer = window.setTimeout(() => {
      if (!editable && !previewSaved) return;
      const saved = readSaved();
      if (saved) setState(saved);
      if (editable) {
        setPublishKey(window.localStorage.getItem(PUBLISH_KEY_STORAGE) ?? "");
        fetch("/photography/layout.json", { cache: "no-store" })
          .then((response) => setLiveStatus(response.ok ? "published" : "defaults"))
          .catch(() => setLiveStatus("unknown"));
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [editable, previewSaved]);

  // The phone preview iframe follows the editor live: its document re-reads
  // saved state whenever the editor writes it.
  useEffect(() => {
    if (!previewSaved) return;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const saved = readSaved();
      setState(saved ?? published ?? defaultState);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [previewSaved, published]);

  useEffect(() => {
    if (!editable || !loaded || !dirty.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizeState(state)));
  }, [editable, loaded, state]);

  // Clicking an element on the page lands the panel on that exact item.
  useEffect(() => {
    if (!active) return;
    const id = `pe-thumb-${targetKey(active)}`;
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [active]);

  const update = (patch: (current: PhotoState) => PhotoState) => {
    dirty.current = true;
    setState(patch);
  };

  const updateCollection = (id: SectionId, patch: Partial<Collection>) =>
    update((current) => ({
      ...current,
      collections: { ...current.collections, [id]: { ...current.collections[id], ...patch } },
    }));

  const getImage = (target: ImageTarget): PhotoImage =>
    target.kind === "hero"
      ? state.hero
      : target.kind === "breather"
        ? state.breathers[target.index]
        : state.collections[target.section].images[target.index];

  const setImage = (target: ImageTarget, next: PhotoImage) =>
    update((current) => {
      if (target.kind === "hero") return { ...current, hero: next };
      if (target.kind === "breather") {
        return { ...current, breathers: current.breathers.map((entry, i) => (i === target.index ? next : entry)) };
      }
      return {
        ...current,
        collections: {
          ...current.collections,
          [target.section]: {
            ...current.collections[target.section],
            images: current.collections[target.section].images.map((entry, i) => (i === target.index ? next : entry)),
          },
        },
      };
    });

  /*
    Applying a portal selection keeps the crop of any photo that was already
    in the section, matched by URL, so re-ordering or trimming through the
    picker never resets framing that has been set by hand.
  */
  const applyPortalToSection = (section: SectionId, srcs: string[]) =>
    update((current) => {
      const existing = new Map(current.collections[section].images.map((entry) => [entry.src, entry]));
      return {
        ...current,
        collections: {
          ...current.collections,
          [section]: { ...current.collections[section], images: srcs.map((src) => existing.get(src) ?? img(src)) },
        },
      };
    });

  const pickPortalSingle = (target: ImageTarget, src: string) => {
    if (getImage(target).src !== src) setImage(target, img(src));
  };

  // The folder an image came from, recoverable from its portal URL; images
  // that are local files fall back to the last collection the picker used.
  const pickerSlugFor = (srcs: string[]) => srcs.map(collectionSlugOf).find(Boolean) ?? rememberedSlug();

  const select = (target: ImageTarget) => {
    setActive(target);
    setPanelOpen(true);
  };

  const focusField = (id: string) => {
    if (!editable) return;
    setPanelOpen(true);
    window.setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      (el as HTMLElement | null)?.focus();
    }, 60);
  };

  const savePublishKey = (value: string) => {
    setPublishKey(value);
    window.localStorage.setItem(PUBLISH_KEY_STORAGE, value);
  };

  const publish = () => {
    setPublishMsg("Publishing…");
    fetch("/photography/publish", {
      method: "POST",
      headers: { authorization: `Bearer ${publishKey}`, "content-type": "application/json" },
      body: JSON.stringify(sanitizeState(state)),
    })
      .then((response) => {
        if (response.status === 204) {
          setLiveStatus("published");
          setPublishMsg("Published. The live page now shows this layout.");
        } else if (response.status === 401) {
          setPublishMsg("Publish key rejected. Check the key and try again.");
        } else if (response.status === 503) {
          setPublishMsg("Publishing is not configured on the server.");
        } else {
          setPublishMsg(`Publish failed (${response.status}).`);
        }
      })
      .catch(() => setPublishMsg("Publish failed: network error."));
  };

  const revertLive = () => {
    setPublishMsg("Reverting…");
    fetch("/photography/publish", {
      method: "DELETE",
      headers: { authorization: `Bearer ${publishKey}` },
    })
      .then((response) => {
        if (response.status === 204) {
          setLiveStatus("defaults");
          setPublishMsg("Live page reverted to the built-in layout.");
        } else if (response.status === 401) {
          setPublishMsg("Publish key rejected. Check the key and try again.");
        } else {
          setPublishMsg(`Revert failed (${response.status}).`);
        }
      })
      .catch(() => setPublishMsg("Revert failed: network error."));
  };

  /*
    Drag-to-reframe, on the page images themselves. A press that moves under
    4px is a click and selects the image in the panel instead.
  */
  const onImagePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    const el = event.currentTarget;
    const target = parseTarget(el.dataset.editTarget);
    if (!target) return;
    if (target.kind === "image" && !state.collections[target.section]) return;
    const image = getImage(target);
    const boxW = el.offsetWidth;
    const boxH = el.offsetHeight;
    const cover = el.naturalWidth && el.naturalHeight ? Math.max(boxW / el.naturalWidth, boxH / el.naturalHeight) : 1;
    // v1.11.58: zoom floors at 1 (see focus() above), so the drag always
    // pans cover overflow; the v1.11.37 slide-a-shrunken-image branch went
    // with the below-100 range.
    const zoom = Math.max(1, image.zoom ?? 1);
    const rangeX = Math.max(el.naturalWidth * cover * zoom - boxW, 0);
    const rangeY = Math.max(el.naturalHeight * cover * zoom - boxH, 0);
    drag.current = {
      target,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      focusX: image.focusX,
      focusY: image.focusY,
      rangeX,
      rangeY,
      moved: false,
    };
    el.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const onImagePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== event.pointerId) return;
    const dx = event.clientX - d.startX;
    const dy = event.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) < 4) return;
    d.moved = true;
    const image = getImage(d.target);
    const next = { ...image };
    // The image follows the pointer: dragging right reveals the left of the
    // frame, which is a lower focus percentage.
    if (Math.abs(d.rangeX) > 1) next.focusX = Math.round(Math.min(100, Math.max(0, d.focusX - (dx / d.rangeX) * 100)));
    if (Math.abs(d.rangeY) > 1) next.focusY = Math.round(Math.min(100, Math.max(0, d.focusY - (dy / d.rangeY) * 100)));
    if (next.focusX !== image.focusX || next.focusY !== image.focusY) setImage(d.target, next);
  };

  const onImagePointerUp = (event: React.PointerEvent<HTMLImageElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== event.pointerId) return;
    drag.current = null;
    if (!d.moved) select(d.target);
  };

  const onImagePointerCancel = () => {
    drag.current = null;
  };

  // Only the inert attributes travel through this helper. The four pointer
  // handlers go into JSX handler positions directly at each image below:
  // routing them through an object literal trips react-hooks/refs, which
  // cannot then tell they are event handlers.
  const editAttrs = (target: ImageTarget): { draggable?: boolean; "data-edit-target"?: string } =>
    editable ? { draggable: false, "data-edit-target": targetKey(target) } : {};

  /*
    v1.11.62: the four photo sections render in the order the client sets in
    the panel. v1.11.63: the two breathers are movable slots in the same list
    (state.pageLayout), so the whole page below the hero reorders.
  */
  /*
    v1.11.79: a collection renders by its style, not its id, so any number of
    collections can share a treatment. On the public page a collection with no
    photos renders nothing at all: a freshly added one is empty until the
    editor fills it, and a heading over nothing is not a section. The editor
    still shows it, because that is where it gets filled.
  */
  const sectionJsx = (id: SectionId) => {
    const c = state.collections[id];
    if (!c) return null;
    if (!editable && c.images.length === 0) return null;
    const imgProps = (image: PhotoImage, index: number) => ({
      src: image.src,
      alt: "",
      loading: "lazy" as const,
      style: focus(image),
      ...editAttrs({ kind: "image", section: id, index }),
      onPointerDown: editable ? onImagePointerDown : undefined,
      onPointerMove: editable ? onImagePointerMove : undefined,
      onPointerUp: editable ? onImagePointerUp : undefined,
      onPointerCancel: editable ? onImagePointerCancel : undefined,
    });
    if (c.style === "contact") {
      return (
        <section className="photo-section">
          {collectionBlock(id)}
          <div className="contact-grid">
            {c.images.map((image, index) => (
              <div className="contact-cell" key={`${image.src}-${index}`}>
                <img {...imgProps(image, index)} />
              </div>
            ))}
          </div>
        </section>
      );
    }
    if (c.style === "fan") {
      return (
        <section className="photo-section">
          {collectionBlock(id)}
          <div className="fan-stack" style={{ "--n": c.images.length } as React.CSSProperties}>
            {c.images.map((image, index) => (
              <div className="fan-card" key={`${image.src}-${index}`} style={{ "--i": index } as React.CSSProperties}>
                <img {...imgProps(image, index)} />
              </div>
            ))}
          </div>
        </section>
      );
    }
    if (c.style === "strips") {
      return (
        <section className="photo-section">
          {collectionBlock(id)}
          <div className="strips-container">
            {c.images.map((image, index) => (
              <div className="strip" key={`${image.src}-${index}`}>
                <img {...imgProps(image, index)} />
              </div>
            ))}
          </div>
        </section>
      );
    }
    return (
      <section className="photo-section">
        {collectionBlock(id)}
        <EditorialGrid
          images={c.images.map((image, index) => ({
            src: image.src,
            style: focus(image),
            attrs: editAttrs({ kind: "image", section: id, index }),
          }))}
          onImagePointerDown={editable ? onImagePointerDown : undefined}
          onImagePointerMove={editable ? onImagePointerMove : undefined}
          onImagePointerUp={editable ? onImagePointerUp : undefined}
          onImagePointerCancel={editable ? onImagePointerCancel : undefined}
        />
      </section>
    );
  };

  // mergeSaved always hands back a layout naming every slot once.
  const layout = state.pageLayout;

  const breatherJsx = (index: number) => (
    <section className="photo-breather" style={frameStyle(state.breathers[index])}>
      <BandImg
        image={state.breathers[index]}
        loading="lazy"
        attrs={editAttrs({ kind: "breather", index })}
        onPointerDown={editable ? onImagePointerDown : undefined}
        onPointerMove={editable ? onImagePointerMove : undefined}
        onPointerUp={editable ? onImagePointerUp : undefined}
        onPointerCancel={editable ? onImagePointerCancel : undefined}
      />
    </section>
  );

  const slotJsx = (slot: PageSlot) =>
    slot === "breather-0" ? breatherJsx(0) : slot === "breather-1" ? breatherJsx(1) : sectionJsx(slot);

  const slotName = (slot: PageSlot) =>
    slot === "breather-0" ? "Big picture 1" : slot === "breather-1" ? "Big picture 2" : collectionName(state, slot);

  const textProps = (fieldId: string) =>
    editable ? { "data-edit-text": true, onClick: () => focusField(fieldId) } : {};

  const collectionBlock = (id: SectionId) => {
    const c = state.collections[id];
    return (
      <>
        {c.showLabel && c.label && <p className="photo-label" {...textProps(`pe-in-${id}-label`)}>{c.label}</p>}
        {c.showTitle && c.title && <h2 className="photo-title" {...textProps(`pe-in-${id}-title`)}>{c.title}</h2>}
      </>
    );
  };

  return (
    <main className={`photo-page${editable ? " photo-editing" : ""}${editable && panelOpen ? " panel-open" : ""}`}>
      <PageHeader division="Photography" />

      <section className="photo-hero" style={frameStyle(state.hero)}>
        <BandImg
          image={state.hero}
          alt="Vision8 Photography"
          loading="eager"
          attrs={editAttrs({ kind: "hero" })}
          onPointerDown={editable ? onImagePointerDown : undefined}
          onPointerMove={editable ? onImagePointerMove : undefined}
          onPointerUp={editable ? onImagePointerUp : undefined}
          onPointerCancel={editable ? onImagePointerCancel : undefined}
        />
        <div className="photo-hero-overlay">
          {state.heroTitle && <h1 {...textProps("pe-in-hero-title")}>{state.heroTitle}</h1>}
          {state.heroLede && <p className="photo-hero-lede" {...textProps("pe-in-hero-lede")}>{state.heroLede}</p>}
        </div>
      </section>

      {layout.map((slot) => (
        <React.Fragment key={slot}>{slotJsx(slot)}</React.Fragment>
      ))}

      {state.showClosing && state.closing && (
        <section className="photo-closing">
          <h2 {...textProps("pe-in-closing")}>{state.closing}</h2>
        </section>
      )}

      {/* v1.11.64: the page ends on an invitation, the Audio page's closing
          block as the client's reference. */}
      {state.showCta && (
        <section className="photo-cta">
          <div className="photo-cta-copy">
            <h2 {...textProps("pe-in-cta-title")}>{state.ctaTitle}</h2>
            <p className="audio-actions">
              {/* The generic textProps would leave the mailto to fire as well as
                  jumping the panel, so the editor's click is its own. */}
              <a
                className="audio-btn audio-btn-solid"
                href={CONTACT}
                {...(editable
                  ? {
                      "data-edit-text": true,
                      onClick: (event: React.MouseEvent) => {
                        event.preventDefault();
                        focusField("pe-in-cta-button");
                      },
                    }
                  : {})}
              >
                {state.ctaButton}
              </a>
            </p>
          </div>
        </section>
      )}

      <SiteFooter />

      {editable && !panelOpen && (
        <button type="button" className="editor-toggle" onClick={() => setPanelOpen(true)}>
          Open editor
        </button>
      )}

      {editable && panelOpen && (
        <aside className="editor-panel" aria-label="Vision8 photography editor">
          {/*
            v1.11.40: the heading and Publish are docked, on the client's mark.
            Publish is the one action with a consequence outside this browser,
            and the panel is long enough that it used to scroll out of reach
            below six collections of controls. Sticky rather than a second
            fixed element, so it spans the panel's own scrollport and cannot
            drift out of step with the panel width.
          */}
          <div className="editor-dock">
            <div className="editor-heading">
              <div>
                <p>Vision8 photography editor</p>
                <h2>Photography editor</h2>
              </div>
              <button type="button" onClick={() => setPanelOpen(false)} aria-label="Close editor">Close</button>
            </div>

            <div className="editor-publish-bar">
              <label>
                Publish key
                <input
                  type="password"
                  autoComplete="off"
                  value={publishKey}
                  onChange={(event) => savePublishKey(event.target.value)}
                />
              </label>
              <div className="editor-two-column">
                <button type="button" className="photo-editor-publish" disabled={!publishKey} onClick={publish}>
                  Publish to live
                </button>
                <button type="button" disabled={!publishKey} onClick={revertLive}>
                  Revert live
                </button>
              </div>
              <p className={publishMsg ? "editor-note photo-editor-publish-msg" : "editor-note"}>
                {publishMsg
                  ? publishMsg
                  : liveStatus === "published"
                    ? "The live page is showing a published layout."
                    : liveStatus === "defaults"
                      ? "The live page is showing the built-in layout."
                      : "Live status unknown."}
              </p>
            </div>
          </div>

          <p className="editor-note">Publish makes this exact layout the public /photography page immediately. The key is remembered in this browser.</p>

          <p className="editor-note">Sections below follow the page order. Click any photo or line of text on the page to jump straight to it here, and drag a photo on the page to reframe it.</p>

          <HeroControls state={state} update={update} active={active} select={select} openPicker={setPicker} />

          <section className="editor-section">
            <h3>Page order</h3>
            {layout.map((slot, position) => (
              <div className="photo-editor-order-row" key={slot}>
                <span>{slotName(slot)}</span>
                <div>
                  <button
                    type="button"
                    disabled={position === 0}
                    onClick={() =>
                      update((current) => {
                        const next = [...current.pageLayout];
                        [next[position - 1], next[position]] = [next[position], next[position - 1]];
                        return { ...current, pageLayout: next };
                      })
                    }
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    disabled={position === layout.length - 1}
                    onClick={() =>
                      update((current) => {
                        const next = [...current.pageLayout];
                        [next[position], next[position + 1]] = [next[position + 1], next[position]];
                        return { ...current, pageLayout: next };
                      })
                    }
                  >
                    Down
                  </button>
                </div>
              </div>
            ))}
            <p className="editor-note">Everything below the hero moves; the hero stays first. Big pictures 1 and 2 are the full-width photos between sections.</p>
            {/*
              v1.11.79: a new collection in any of the four styles, on the
              client's mark (a second editorial grid was the ask). It lands at
              the end of the page order, empty, and the section for it appears
              below; it is invisible on the public page until it has photos.
            */}
            <label>
              Add a collection
              <div className="editor-two-column">
                <select value={newStyle} onChange={(event) => setNewStyle(event.target.value as CollectionStyle)}>
                  {collectionStyles.map((style) => (
                    <option key={style} value={style}>{styleNames[style]}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    update((current) => {
                      const id = newCollectionId(current, newStyle);
                      return {
                        ...current,
                        collections: { ...current.collections, [id]: emptyCollection(newStyle) },
                        pageLayout: [...current.pageLayout, id],
                      };
                    })
                  }
                >
                  Add
                </button>
              </div>
            </label>
          </section>

          {/* v1.11.79: the controls follow the page order, as the note at the
              top of the panel has always said they do. */}
          {layout.map((slot) =>
            slot === "breather-0" || slot === "breather-1" ? (
              <BreatherControls key={slot} index={slot === "breather-0" ? 0 : 1} state={state} update={update} active={active} select={select} openPicker={setPicker} />
            ) : (
              <CollectionControls key={slot} id={slot} state={state} active={active} setActive={setActive} update={update} updateCollection={updateCollection} openPicker={setPicker} />
            ),
          )}

          <section className="editor-section">
            <h3>Closing line</h3>
            <label>
              Text
              <textarea
                id="pe-in-closing"
                rows={2}
                value={state.closing}
                onChange={(event) => update((current) => ({ ...current, closing: event.target.value }))}
              />
            </label>
            <label className="photo-editor-check">
              <input
                type="checkbox"
                checked={state.showClosing}
                onChange={(event) => update((current) => ({ ...current, showClosing: event.target.checked }))}
              />
              Show closing line
            </label>
          </section>

          <section className="editor-section">
            <h3>Closing invitation</h3>
            <label>
              Heading
              <input
                id="pe-in-cta-title"
                type="text"
                value={state.ctaTitle}
                onChange={(event) => update((current) => ({ ...current, ctaTitle: event.target.value }))}
              />
            </label>
            <label>
              Button
              <input
                id="pe-in-cta-button"
                type="text"
                value={state.ctaButton}
                onChange={(event) => update((current) => ({ ...current, ctaButton: event.target.value }))}
              />
            </label>
            <label className="photo-editor-check">
              <input
                type="checkbox"
                checked={state.showCta}
                onChange={(event) => update((current) => ({ ...current, showCta: event.target.checked }))}
              />
              Show closing invitation
            </label>
            <p className="editor-note">The button opens a message to info@vision8.co.nz.</p>
          </section>

          <div className="editor-actions">
            <button type="button" onClick={() => setPhonePreview(true)}>Phone preview</button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(sanitizeState(state), null, 2)).then(() => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              }}
            >
              {copied ? "Copied" : "Copy layout JSON"}
            </button>
            <button
              type="button"
              onClick={() => {
                window.localStorage.removeItem(STORAGE_KEY);
                dirty.current = false;
                setState(defaultState);
                setActive(null);
              }}
            >
              Reset to source
            </button>
          </div>
          <p className="editor-note">Reset to source discards this browser&rsquo;s draft and shows the built-in layout; it does not change the live page. Uploaded files are previewed for this session only; images added by URL persist and publish.</p>
        </aside>
      )}

      {editable && picker && (
        <PortalPicker
          heading={
            "section" in picker
              ? `${collectionName(state, picker.section)}: choose photos`
              : "Swap this photo"
          }
          multi={"section" in picker}
          initialSlug={
            "section" in picker
              ? pickerSlugFor(state.collections[picker.section].images.map((entry) => entry.src))
              : pickerSlugFor([getImage(picker.target).src])
          }
          currentSrcs={"section" in picker ? state.collections[picker.section].images.map((entry) => entry.src) : []}
          onApply={"section" in picker ? (srcs) => applyPortalToSection(picker.section, srcs) : undefined}
          onPick={"section" in picker ? undefined : (src) => pickPortalSingle(picker.target, src)}
          onClose={() => setPicker(null)}
        />
      )}

      {editable && phonePreview && (
        <div className="photo-preview-overlay" role="dialog" aria-label="Phone preview">
          <div className="photo-preview-frame">
            {/* A real narrow viewport, so the page's own media queries decide
                the phone layout; a scaled div would keep desktop breakpoints. */}
            <iframe src="/photography/preview" title="Phone preview of the photography page" />
          </div>
          <button type="button" className="photo-preview-close" onClick={() => setPhonePreview(false)}>
            Close preview
          </button>
        </div>
      )}
    </main>
  );
}

/*
  v1.11.62: the crop focus X and Y sliders are gone on the client's mark;
  dragging the photo on the page is the way to reframe. Brightness takes
  their place, a quarter either side of the treatment's own level. The
  remaining three controls sit tight, half the panel's usual label spacing.
*/
function FocusControls({ image, onChange }: { image: PhotoImage; onChange: (next: PhotoImage) => void }) {
  return (
    <div className="photo-editor-tight">
      <label>
        Zoom
        <div className="range-row">
          <input
            type="range"
            min={100}
            max={200}
            step={5}
            value={Math.round((image.zoom ?? 1) * 100)}
            onChange={(event) => onChange({ ...image, zoom: Number(event.target.value) / 100 })}
          />
          <output>{Math.round((image.zoom ?? 1) * 100)}%</output>
        </div>
      </label>
      <label>
        Brightness
        <div className="range-row">
          <input
            type="range"
            min={75}
            max={125}
            step={5}
            value={Math.round((image.bright ?? 1) * 100)}
            onChange={(event) => onChange({ ...image, bright: Number(event.target.value) / 100 })}
          />
          <output>{Math.round((image.bright ?? 1) * 100)}%</output>
        </div>
      </label>
      <label className="photo-editor-check">
        <input
          type="checkbox"
          checked={image.whole === true}
          onChange={(event) => onChange({ ...image, whole: event.target.checked })}
        />
        Show the whole photo, letterboxed in its frame
      </label>
    </div>
  );
}

function ImagePicker({
  image,
  onChange,
  legend,
  targetKey: target,
  // The designed height of this frame, which the slider shows until it is
  // moved: a full screen for the hero, half a screen for a big picture.
  defaultFrameH,
}: {
  image: PhotoImage;
  onChange: (next: PhotoImage) => void;
  legend: string;
  targetKey: string;
  defaultFrameH: number;
}) {
  /*
    v1.11.63: until the crop points are touched, the sliders show the crop the
    frame is already making (measured from the page), so "drop Crop top to
    reveal more" starts from the truth rather than from 0. The first touch
    writes both points, adopting the measured band as the starting position.
  */
  const [shown, setShown] = useState<{ top: number; bottom: number } | null>(null);
  const bandSet = (image.cropTop ?? 0) > 0 || (image.cropBottom ?? 100) < 100;
  useEffect(() => {
    /*
      Retries while null: a lazy image that has not entered the viewport has
      no natural size yet, and the breathers are lazy, so one early attempt
      would leave the sliders on 0 and 100 for ever.
    */
    let tries = 0;
    let timer = 0;
    const attempt = () => {
      const measured = measuredBand(target);
      if (measured) {
        setShown(measured);
        return;
      }
      if (++tries < 20) timer = window.setTimeout(attempt, 400);
    };
    timer = window.setTimeout(attempt, 80);
    return () => window.clearTimeout(timer);
    // Re-measure when anything that moves the picture changes.
  }, [target, image.src, image.zoom, image.focusY, image.whole, image.cropTop, image.cropBottom, image.frameH]);
  const topShown = bandSet ? (image.cropTop ?? 0) : (shown?.top ?? 0);
  const bottomShown = bandSet ? (image.cropBottom ?? 100) : (shown?.bottom ?? 100);
  return (
    <>
      <label>
        {legend} image URL
        <input
          type="text"
          value={image.src}
          onChange={(event) => onChange({ ...image, src: event.target.value })}
        />
      </label>
      <label>
        Upload (this session only)
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onChange({ ...image, src: URL.createObjectURL(file) });
          }}
        />
      </label>
      <FocusControls image={image} onChange={onChange} />
      {/*
        v1.11.64: how tall the frame stands. At full width the frame's shape is
        what decides how much of a picture is lost top and bottom, so this is
        the control that answers the client's "be full screen and choose how
        much crops". 100 is the whole screen. The crop band below then chooses
        which part of the picture that frame holds.
      */}
      <div className="photo-editor-tight">
        <label>
          Frame height
          <div className="range-row">
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={image.frameH ?? defaultFrameH}
              onChange={(event) => onChange({ ...image, frameH: Number(event.target.value) })}
            />
            <output>{image.frameH ?? defaultFrameH}% of screen</output>
          </div>
        </label>
      </div>
      {/* v1.11.62: the big frames can show a chosen band of the picture.
          0 and 100 leave the crop to the frame; anything else shows that
          band, top to bottom, as deep as the frame's width allows. */}
      <div className="photo-editor-tight">
        <label>
          Crop top
          <div className="range-row">
            <input
              type="range"
              min={0}
              max={90}
              step={1}
              value={topShown}
              onChange={(event) =>
                onChange({
                  ...image,
                  cropTop: Math.min(Number(event.target.value), bottomShown - 10),
                  cropBottom: bottomShown,
                })
              }
            />
            <output>{topShown}%</output>
          </div>
        </label>
        <label>
          Crop bottom
          <div className="range-row">
            <input
              type="range"
              min={10}
              max={100}
              step={1}
              value={bottomShown}
              onChange={(event) =>
                onChange({
                  ...image,
                  cropTop: topShown,
                  cropBottom: Math.max(Number(event.target.value), topShown + 10),
                })
              }
            />
            <output>{bottomShown}%</output>
          </div>
        </label>
      </div>
      <p className="editor-note">Frame height sets how much of the picture the full-width frame can hold: at 100% it fills the screen and loses least. The crop sliders start at the crop the frame is already making, and choose which band of the picture it holds.</p>
    </>
  );
}

function HeroControls({
  state,
  update,
  active,
  select,
  openPicker,
}: {
  state: PhotoState;
  update: (patch: (current: PhotoState) => PhotoState) => void;
  active: Active;
  select: (target: ImageTarget) => void;
  openPicker: (request: { target: ImageTarget }) => void;
}) {
  return (
    <section className="editor-section" id="pe-thumb-hero">
      <h3>Hero</h3>
      <label>
        Headline
        <input
          id="pe-in-hero-title"
          type="text"
          value={state.heroTitle}
          onChange={(event) => update((current) => ({ ...current, heroTitle: event.target.value }))}
        />
      </label>
      <label>
        Supporting line
        <textarea
          id="pe-in-hero-lede"
          rows={2}
          value={state.heroLede}
          onChange={(event) => update((current) => ({ ...current, heroLede: event.target.value }))}
        />
      </label>
      <div className={`photo-editor-slot${active?.kind === "hero" ? " selected" : ""}`}>
        <button type="button" className="photo-editor-thumb wide" onClick={() => select({ kind: "hero" })}>
          <img src={state.hero.src} alt="" loading="lazy" />
        </button>
        <ImagePicker
          legend="Hero"
          targetKey="hero"
          defaultFrameH={100}
          image={state.hero}
          onChange={(next) => update((current) => ({ ...current, hero: next }))}
        />
        <button type="button" className="photo-editor-portal" onClick={() => openPicker({ target: { kind: "hero" } })}>
          Choose from portal
        </button>
      </div>
    </section>
  );
}

function BreatherControls({
  index,
  state,
  update,
  active,
  select,
  openPicker,
}: {
  index: number;
  state: PhotoState;
  update: (patch: (current: PhotoState) => PhotoState) => void;
  active: Active;
  select: (target: ImageTarget) => void;
  openPicker: (request: { target: ImageTarget }) => void;
}) {
  const breather = state.breathers[index];
  const isActive = active?.kind === "breather" && active.index === index;
  return (
    <section className="editor-section" id={`pe-thumb-breather-${index}`}>
      <h3>Breather {index + 1}</h3>
      <div className={`photo-editor-slot${isActive ? " selected" : ""}`}>
        <button type="button" className="photo-editor-thumb wide" onClick={() => select({ kind: "breather", index })}>
          <img src={breather.src} alt="" loading="lazy" />
        </button>
        <ImagePicker
          legend={`Breather ${index + 1}`}
          targetKey={`breather-${index}`}
          defaultFrameH={50}
          image={breather}
          onChange={(next) =>
            update((current) => ({
              ...current,
              breathers: current.breathers.map((entry, i) => (i === index ? next : entry)),
            }))
          }
        />
        <button
          type="button"
          className="photo-editor-portal"
          onClick={() => openPicker({ target: { kind: "breather", index } })}
        >
          Choose from portal
        </button>
      </div>
    </section>
  );
}

function CollectionControls({
  id,
  state,
  active,
  setActive,
  update,
  updateCollection,
  openPicker,
}: {
  id: SectionId;
  state: PhotoState;
  active: Active;
  setActive: (target: Active) => void;
  update: (patch: (current: PhotoState) => PhotoState) => void;
  updateCollection: (id: SectionId, patch: Partial<Collection>) => void;
  openPicker: (request: { section: SectionId } | { target: ImageTarget }) => void;
}) {
  const c = state.collections[id];
  const [addUrl, setAddUrl] = useState("");
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const selected = active?.kind === "image" && active.section === id ? active.index : null;
  const setImages = (images: PhotoImage[]) => updateCollection(id, { images });

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    const images = [...c.images];
    const [moved] = images.splice(from, 1);
    images.splice(to, 0, moved);
    setImages(images);
    setActive({ kind: "image", section: id, index: to });
  };

  const selectedImage = selected !== null ? c.images[selected] : null;

  return (
    <section className="editor-section">
      <h3>{collectionName(state, id)}</h3>
      <label>
        Client / source label
        <input id={`pe-in-${id}-label`} type="text" value={c.label} onChange={(event) => updateCollection(id, { label: event.target.value })} />
      </label>
      <label className="photo-editor-check">
        <input type="checkbox" checked={c.showLabel} onChange={(event) => updateCollection(id, { showLabel: event.target.checked })} />
        Show label
      </label>
      <label>
        Heading
        <input id={`pe-in-${id}-title`} type="text" value={c.title} onChange={(event) => updateCollection(id, { title: event.target.value })} />
      </label>
      <label className="photo-editor-check">
        <input type="checkbox" checked={c.showTitle} onChange={(event) => updateCollection(id, { showTitle: event.target.checked })} />
        Show heading
      </label>

      <h3 className="photo-editor-subhead">Images ({c.images.length})</h3>
      <button type="button" className="photo-editor-portal" onClick={() => openPicker({ section: id })}>
        Choose photos from portal
      </button>
      <div className="photo-editor-thumbs">
        {c.images.map((image, index) => (
          <button
            type="button"
            key={`${image.src}-${index}`}
            id={`pe-thumb-${id}-${index}`}
            className={`photo-editor-thumb${selected === index ? " selected" : ""}${dragOver === index ? " drag-over" : ""}`}
            draggable
            onDragStart={() => { dragIndex.current = index; }}
            onDragOver={(event) => { event.preventDefault(); setDragOver(index); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(null);
              if (dragIndex.current !== null) reorder(dragIndex.current, index);
              dragIndex.current = null;
            }}
            onClick={() => setActive(selected === index ? null : { kind: "image", section: id, index })}
          >
            <img src={image.src} alt="" loading="lazy" />
            <span>{index + 1}</span>
          </button>
        ))}
      </div>

      {selectedImage && selected !== null && (
        <div className="photo-editor-selected">
          <FocusControls
            image={selectedImage}
            onChange={(next) => setImages(c.images.map((entry, i) => (i === selected ? next : entry)))}
          />
          <p className="editor-note">Drag the photo on the page to reframe it. An image that fills its frame exactly, like the square contact crops, only moves once zoom is above 100% and there is crop overflow to pan.</p>
          <div className="editor-two-column">
            <button type="button" disabled={selected === 0} onClick={() => reorder(selected, selected - 1)}>Move earlier</button>
            <button type="button" disabled={selected === c.images.length - 1} onClick={() => reorder(selected, selected + 1)}>Move later</button>
          </div>
          <button
            type="button"
            className="photo-editor-portal"
            onClick={() => openPicker({ target: { kind: "image", section: id, index: selected } })}
          >
            Swap this photo from portal
          </button>
          <label>
            Move to
            <select
              value=""
              onChange={(event) => {
                const target = event.target.value;
                if (!target) return;
                if (target === "hero") {
                  update((current) => ({ ...current, hero: selectedImage }));
                } else if (target === "breather-0" || target === "breather-1") {
                  const slot = target === "breather-0" ? 0 : 1;
                  update((current) => ({
                    ...current,
                    breathers: current.breathers.map((entry, i) => (i === slot ? selectedImage : entry)),
                  }));
                } else {
                  const dest = target as SectionId;
                  update((current) => ({
                    ...current,
                    collections: {
                      ...current.collections,
                      [id]: { ...current.collections[id], images: current.collections[id].images.filter((_, i) => i !== selected) },
                      [dest]: { ...current.collections[dest], images: [...current.collections[dest].images, selectedImage] },
                    },
                  }));
                  setActive(null);
                }
              }}
            >
              <option value="">Choose…</option>
              {collectionIds(state).filter((other) => other !== id).map((other) => (
                <option key={other} value={other}>{collectionName(state, other)}</option>
              ))}
              <option value="hero">Use as hero</option>
              <option value="breather-0">Use as breather 1</option>
              <option value="breather-1">Use as breather 2</option>
            </select>
          </label>
          <button
            type="button"
            className="photo-editor-remove"
            onClick={() => {
              setImages(c.images.filter((_, i) => i !== selected));
              setActive(null);
            }}
          >
            Remove from collection
          </button>
        </div>
      )}

      <h3 className="photo-editor-subhead">Add image</h3>
      <label>
        Image URL
        <input type="text" value={addUrl} onChange={(event) => setAddUrl(event.target.value)} placeholder="/photography/… or https://…" />
      </label>
      <div className="editor-two-column">
        <button
          type="button"
          disabled={!addUrl.trim()}
          onClick={() => {
            setImages([...c.images, img(addUrl.trim())]);
            setAddUrl("");
          }}
        >
          Add by URL
        </button>
        <label className="photo-editor-upload">
          Upload
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setImages([...c.images, img(URL.createObjectURL(file))]);
            }}
          />
        </label>
      </div>

      {/* Only an added collection can be removed; the four built-ins are the
          source defaults and the merge would put them straight back. */}
      {!builtInSections.includes(id) && (
        <button
          type="button"
          className="photo-editor-remove"
          onClick={() => {
            setActive(null);
            update((current) => {
              const collections = { ...current.collections };
              delete collections[id];
              return { ...current, collections, pageLayout: current.pageLayout.filter((slot) => slot !== id) };
            });
          }}
        >
          Remove this collection
        </button>
      )}
    </section>
  );
}

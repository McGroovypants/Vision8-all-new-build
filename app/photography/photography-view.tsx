"use client";

/*
  The Photography page and its editor, one component, the same architecture as
  the homepage's HomepageV1103: `editable` is on only for /photography/editor
  and gates the panel and every localStorage read and write; `previewSaved` is
  on only for /photography/preview, which the editor's phone preview loads in
  an iframe and which re-reads saved state on `storage` events so edits appear
  live. The public /photography renders the source defaults below and never
  touches localStorage, so nothing the editor does reaches visitors.

  v1.11.36, on the client's mark: the panel lists every section vertically in
  page order instead of behind a dropdown; clicking a picture or a line of
  text on the page jumps the panel to that exact item; and images are
  reframed by dragging them directly on the page. Dragging pans within the
  crop, which for an image that exactly fills its frame (the square contact
  crops in square cells) is a zero range: those need zoom above 100% before
  any movement is possible, which is also why the v1.11.35 focus sliders
  appeared to do nothing on the contact sheet.

  Collections mean photographs that belong together, not one client per
  section: the client/source labels are editable and hideable here precisely
  so that question can be settled by looking, not decided in source.

  Images are served from public/photography/, downsized once at import time
  (1800px cap, 640px for the square crops). The mockup's originals stay in the
  mockup folder; never hotlink media.vision8.co.nz, its URLs expire to 403.
*/

import { useEffect, useRef, useState } from "react";
import { BUILD, PageHeader } from "../portfolio-shell";
import { EditorialGrid } from "./editorial-grid";

const P = "/photography";

// Same discipline as the homepage editor: saved tuning is keyed to the build,
// so a stale selection cannot pin old media over a later deploy. Bump the
// shared BUILD in portfolio-shell.tsx whenever these defaults change.
const STORAGE_KEY = `vision8-photography-editor-${BUILD}`;

export type PhotoImage = { src: string; focusX: number; focusY: number; zoom: number };

export type SectionId = "contact" | "fan" | "strips" | "editorial";

export type Collection = {
  label: string;
  showLabel: boolean;
  title: string;
  showTitle: boolean;
  images: PhotoImage[];
};

export type PhotoState = {
  hero: PhotoImage;
  heroTitle: string;
  heroLede: string;
  collections: Record<SectionId, Collection>;
  breathers: PhotoImage[];
  closing: string;
  showClosing: boolean;
};

const img = (src: string): PhotoImage => ({ src, focusX: 50, focusY: 50, zoom: 1 });

/*
  v1.11.38: the defaults below are the client's first curation pass, made in
  the editor on 15 Aug 2026 and handed over as Copy layout JSON. Contact
  sheet down to 28 crops (imgc9205 and imgc5130-1600 dropped, light reorder),
  editorial down to 8 (screen-shot 8-55-41 and imgc4800 dropped, four
  reframed), three strips and the second breather reframed, and the Primary
  ITO, OSPRI and Hikoi labels hidden; Coastguard stays visible. Dropped files
  remain in public/photography/ and can return via Add by URL.
*/

// Coastguard, 28 face-aware square crops, client order.
const contactSheet = [
  "img-9882-1786678083-f2afb9ac.jpg",
  "img-9945-1786678087-d802a26a.jpg",
  "img-9848-1786678084-2feeddb1.jpg",
  "imgc5125-1786679978-98ce3cd9.jpg",
  "imgc5156-1786679980-fddd06ac.jpg",
  "imgc5183-1786679980-e74fa471.jpg",
  "imgc5145-1786679982-1ae7d3e5.jpg",
  "imgc5152-1786679984-ce1e9b99.jpg",
  "imgc5146-1786679984-aa9d737f.jpg",
  "img-9839-1786734650-24c73033.jpg",
  "img-9805-1786734650-358e3e09.jpg",
  "imgc9164-1786734654-84d3bff1.jpg",
  "imgc9191-1786734682-ffdcf6d7.jpg",
  "screenshot-2026-05-08-at-8-00-09-am-1786734657-589e683c.jpg",
  "screenshot-2026-05-08-at-7-59-58-am-1786734659-695db86e.jpg",
  "imgc9198-1786734656-a8c4a4c1.jpg",
  "imgc9076-1786734661-338ae127.jpg",
  "img-9708-1786734661-968d33d9.jpg",
  "screenshot-2026-05-08-at-8-00-25-am-1786734663-c971d587.jpg",
  "imgc9207-1786734655-5935ae27.jpg",
  "imgc9249-1786734663-fdd2f819.jpg",
  "imgc9258-1786734666-6ee7051f.jpg",
  "imgc9257-1786734669-6da9117a.jpg",
  "imgc9195-1786734677-580cbd08.jpg",
  "imgc9224-1786734683-a6d908fa.jpg",
  "imgc5128-1600x1067-1786740334-cf37bf51.jpg",
  "imgc5146-1600x1066-1786740338-cd4074cd.jpg",
  "imgc5178-1600x1066-1786740340-eb17da65.jpg",
].map((file) => img(`${P}/crops/${file}`));

// Primary ITO, eight cards, three fully visible at rest, hover fans them all.
const fanned = [
  "p-ito-arb-sm-4-1600x1600-1786737303-7d992457.jpg",
  "p-ito-arb-sm-8179-1600x1600-1786737303-42da1c0d.jpg",
  "p-ito-arb-sm-2-4-1600x1600-1786737304-a2bfa171.jpg",
  "p-ito-arb-sm-1600x1600-1786737304-2d244eff.jpg",
  "p-ito-arb-sm-2-1600x1600-1786737304-ea1bf9d1.jpg",
  "p-ito-arb-sm-2-2-1600x1600-1786737305-9f2a8920.jpg",
  "p-ito-arb-sm-5-1600x1600-1786737305-70383a12.jpg",
  "p-ito-arb-sm-6-1600x1600-1786737305-b08bc111.jpg",
].map((file) => img(`${P}/${file}`));

// OSPRI, eight vertical strips, hover expands. The last three carry the
// client's reframes.
const strips: PhotoImage[] = [
  img(`${P}/imgc4355-1785813065.jpg`),
  img(`${P}/imgc4385-1785813065.jpg`),
  img(`${P}/imgc4226-1785813065.jpg`),
  img(`${P}/imgc4401-1785813065.jpg`),
  img(`${P}/imgc4007-1785813065.jpg`),
  { ...img(`${P}/imgc1933-1786735898-19bed632.jpg`), focusX: 82 },
  { ...img(`${P}/imgc1702-1786735899-65ad6ea4.jpg`), focusX: 46 },
  { ...img(`${P}/imgc1711-1786735902-b8fabc66.jpg`), focusX: 42 },
];

// Hikoi and observational work. Eight images since the client's curation,
// which happens to close the six-column span pattern into a full rectangle.
const editorial: PhotoImage[] = [
  img(`${P}/img-4112-1785781272.jpg`),
  { ...img(`${P}/screen-shot-2018-10-01-at-8-57-08-pm-1785781422.jpg`), focusX: 7, focusY: 100, zoom: 1.1 },
  img(`${P}/imgc4692-1786394460-dfc39369.jpg`),
  { ...img(`${P}/imgc3882-1786394460-847a5f1a.jpg`), focusY: 0 },
  img(`${P}/imgc4454-1786394464-18c566a0.jpg`),
  img(`${P}/imgc4657-1786394468-f4afa50a.jpg`),
  img(`${P}/imgc3884-1786394471-72c746a7.jpg`),
  { ...img(`${P}/imgc4746-1786394475-9fee2875.jpg`), focusY: 69 },
];

export const defaultState: PhotoState = {
  hero: img(`${P}/dragonfly-in-hongkong-1786678073-de2cf7f1.jpg`),
  heroTitle: "Sometimes one frame is enough.",
  heroLede: "Photography for people, places, products and the work behind them.",
  collections: {
    contact: { label: "Coastguard", showLabel: true, title: "Ready for anything", showTitle: true, images: contactSheet },
    // Labels off for these three at the client's curation; the names stay in
    // the data so the editor can turn them back on.
    fan: { label: "Primary ITO", showLabel: false, title: "Hands on, every day", showTitle: true, images: fanned },
    strips: { label: "OSPRI", showLabel: false, title: "Faces, places, purpose", showTitle: true, images: strips },
    editorial: { label: "Hikoi & Observational", showLabel: false, title: "Because they just happen", showTitle: true, images: editorial },
  },
  breathers: [img(`${P}/z6-1786678073-6c134bec.jpg`), { ...img(`${P}/img-8268a-1785783280.jpg`), focusY: 92 }],
  closing: "Sometimes all you need is a still image.",
  showClosing: true,
};

const sectionOrder: SectionId[] = ["contact", "fan", "strips", "editorial"];

const sectionNames: Record<SectionId, string> = {
  contact: "Contact sheet",
  fan: "Fanned collection",
  strips: "Sliced collection",
  editorial: "Editorial grid",
};

// Saved state is merged field by field over the defaults rather than taken
// wholesale, so a save from an older shape (or a hand-edited one) degrades to
// the source values instead of rendering an empty page.
function mergeSaved(saved: unknown): PhotoState {
  if (!saved || typeof saved !== "object") return defaultState;
  const s = saved as Partial<PhotoState>;
  const image = (candidate: unknown, fallback: PhotoImage): PhotoImage => {
    const c = candidate as Partial<PhotoImage> | undefined;
    if (!c || typeof c.src !== "string" || !c.src) return fallback;
    return {
      src: c.src,
      focusX: typeof c.focusX === "number" ? c.focusX : 50,
      focusY: typeof c.focusY === "number" ? c.focusY : 50,
      zoom: typeof c.zoom === "number" ? c.zoom : 1,
    };
  };
  const collection = (id: SectionId): Collection => {
    const d = defaultState.collections[id];
    const c = s.collections?.[id];
    if (!c) return d;
    return {
      label: typeof c.label === "string" ? c.label : d.label,
      showLabel: typeof c.showLabel === "boolean" ? c.showLabel : d.showLabel,
      title: typeof c.title === "string" ? c.title : d.title,
      showTitle: typeof c.showTitle === "boolean" ? c.showTitle : d.showTitle,
      images: Array.isArray(c.images) ? c.images.map((entry) => image(entry, img(""))).filter((entry) => entry.src) : d.images,
    };
  };
  return {
    hero: image(s.hero, defaultState.hero),
    heroTitle: typeof s.heroTitle === "string" ? s.heroTitle : defaultState.heroTitle,
    heroLede: typeof s.heroLede === "string" ? s.heroLede : defaultState.heroLede,
    collections: {
      contact: collection("contact"),
      fan: collection("fan"),
      strips: collection("strips"),
      editorial: collection("editorial"),
    },
    breathers: Array.isArray(s.breathers) && s.breathers.length === 2
      ? [image(s.breathers[0], defaultState.breathers[0]), image(s.breathers[1], defaultState.breathers[1])]
      : defaultState.breathers,
    closing: typeof s.closing === "string" ? s.closing : defaultState.closing,
    showClosing: typeof s.showClosing === "boolean" ? s.showClosing : defaultState.showClosing,
  };
}

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
const focus = (image: PhotoImage) =>
  ({
    objectPosition: `${image.focusX}% ${image.focusY}%`,
    "--zoom": image.zoom ?? 1,
    "--origin": `${image.focusX}% ${image.focusY}%`,
  }) as React.CSSProperties;

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
  const cut = key.lastIndexOf("-");
  const section = key.slice(0, cut) as SectionId;
  if (!sectionOrder.includes(section)) return null;
  return { kind: "image", section, index: Number(key.slice(cut + 1)) };
};

export function PhotographyView({
  editable = false,
  previewSaved = false,
}: {
  editable?: boolean;
  previewSaved?: boolean;
}) {
  const [state, setState] = useState<PhotoState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(editable);
  const [active, setActive] = useState<Active>(null);
  const [phonePreview, setPhonePreview] = useState(false);
  const [copied, setCopied] = useState(false);
  // Same guard as the homepage editor: nothing is written to localStorage
  // until the user actually changes something, so opening the editor to look
  // never pins the current defaults over a later deploy.
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
      setState(saved ?? defaultState);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [previewSaved]);

  useEffect(() => {
    if (!editable || !loaded || !dirty.current) return;
    // blob: URLs die with the session, so persisting them would leave broken
    // images on the next load. Uploads fall back to the source image (hero,
    // breathers) or drop out of the saved list (collections), matching the
    // homepage editor's handling and the session-only note in the panel.
    const persisted: PhotoState = {
      ...state,
      hero: state.hero.src.startsWith("blob:") ? defaultState.hero : state.hero,
      breathers: state.breathers.map((entry, i) => (entry.src.startsWith("blob:") ? defaultState.breathers[i] : entry)) as PhotoState["breathers"],
      collections: Object.fromEntries(
        (Object.keys(state.collections) as SectionId[]).map((id) => [
          id,
          { ...state.collections[id], images: state.collections[id].images.filter((entry) => !entry.src.startsWith("blob:")) },
        ]),
      ) as PhotoState["collections"],
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
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

  /*
    Drag-to-reframe, on the page images themselves. A press that moves under
    4px is a click and selects the image in the panel instead. The pan range
    is the cover overflow (natural size scaled to cover, times zoom, minus the
    frame): dragging maps 1:1 through that range, and a zero range, square
    crop in a square cell at 100% zoom, means there is nothing to pan until
    zoom is raised.
  */
  const onImagePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    const el = event.currentTarget;
    const target = parseTarget(el.dataset.editTarget);
    if (!target) return;
    const image = getImage(target);
    const boxW = el.offsetWidth;
    const boxH = el.offsetHeight;
    const cover = el.naturalWidth && el.naturalHeight ? Math.max(boxW / el.naturalWidth, boxH / el.naturalHeight) : 1;
    const zoom = image.zoom ?? 1;
    /*
      Above 100% the drag pans the crop overflow. Below 100% (v1.11.37: the
      zoom range now reaches down to 20%) the shrunken image slides inside its
      frame instead, and the focal origin moves it the opposite way, so the
      range is stored negative to flip the drag direction and keep the image
      following the pointer.
    */
    const rangeX = zoom >= 1 ? Math.max(el.naturalWidth * cover * zoom - boxW, 0) : -(boxW * (1 - zoom));
    const rangeY = zoom >= 1 ? Math.max(el.naturalHeight * cover * zoom - boxH, 0) : -(boxH * (1 - zoom));
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
    // frame, which is a lower focus percentage. A negative range (zoomed
    // below 100%) flips that, sliding the shrunken image with the pointer.
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

      <section className="photo-hero">
        <img
          src={state.hero.src}
          alt="Vision8 Photography"
          style={focus(state.hero)}
          {...editAttrs({ kind: "hero" })}
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

      <section className="photo-section">
        {collectionBlock("contact")}
        <div className="contact-grid">
          {state.collections.contact.images.map((image, index) => (
            <div className="contact-cell" key={`${image.src}-${index}`}>
              <img
                src={image.src}
                alt=""
                loading="lazy"
                style={focus(image)}
                {...editAttrs({ kind: "image", section: "contact", index })}
                onPointerDown={editable ? onImagePointerDown : undefined}
                onPointerMove={editable ? onImagePointerMove : undefined}
                onPointerUp={editable ? onImagePointerUp : undefined}
                onPointerCancel={editable ? onImagePointerCancel : undefined}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="photo-section">
        {collectionBlock("fan")}
        <div
          className="fan-stack"
          style={{ "--n": state.collections.fan.images.length } as React.CSSProperties}
        >
          {state.collections.fan.images.map((image, index) => (
            <div className="fan-card" key={`${image.src}-${index}`} style={{ "--i": index } as React.CSSProperties}>
              <img
                src={image.src}
                alt=""
                loading="lazy"
                style={focus(image)}
                {...editAttrs({ kind: "image", section: "fan", index })}
                onPointerDown={editable ? onImagePointerDown : undefined}
                onPointerMove={editable ? onImagePointerMove : undefined}
                onPointerUp={editable ? onImagePointerUp : undefined}
                onPointerCancel={editable ? onImagePointerCancel : undefined}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="photo-breather">
        <img
          src={state.breathers[0].src}
          alt=""
          loading="lazy"
          style={focus(state.breathers[0])}
          {...editAttrs({ kind: "breather", index: 0 })}
          onPointerDown={editable ? onImagePointerDown : undefined}
          onPointerMove={editable ? onImagePointerMove : undefined}
          onPointerUp={editable ? onImagePointerUp : undefined}
          onPointerCancel={editable ? onImagePointerCancel : undefined}
        />
      </section>

      <section className="photo-section">
        {collectionBlock("strips")}
        <div className="strips-container">
          {state.collections.strips.images.map((image, index) => (
            <div className="strip" key={`${image.src}-${index}`}>
              <img
                src={image.src}
                alt=""
                loading="lazy"
                style={focus(image)}
                {...editAttrs({ kind: "image", section: "strips", index })}
                onPointerDown={editable ? onImagePointerDown : undefined}
                onPointerMove={editable ? onImagePointerMove : undefined}
                onPointerUp={editable ? onImagePointerUp : undefined}
                onPointerCancel={editable ? onImagePointerCancel : undefined}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="photo-breather">
        <img
          src={state.breathers[1].src}
          alt=""
          loading="lazy"
          style={focus(state.breathers[1])}
          {...editAttrs({ kind: "breather", index: 1 })}
          onPointerDown={editable ? onImagePointerDown : undefined}
          onPointerMove={editable ? onImagePointerMove : undefined}
          onPointerUp={editable ? onImagePointerUp : undefined}
          onPointerCancel={editable ? onImagePointerCancel : undefined}
        />
      </section>

      <section className="photo-section">
        {collectionBlock("editorial")}
        <EditorialGrid
          images={state.collections.editorial.images.map((image, index) => ({
            src: image.src,
            style: focus(image),
            attrs: editAttrs({ kind: "image", section: "editorial", index }),
          }))}
          onImagePointerDown={editable ? onImagePointerDown : undefined}
          onImagePointerMove={editable ? onImagePointerMove : undefined}
          onImagePointerUp={editable ? onImagePointerUp : undefined}
          onImagePointerCancel={editable ? onImagePointerCancel : undefined}
        />
      </section>

      {state.showClosing && state.closing && (
        <section className="photo-closing">
          <h2 {...textProps("pe-in-closing")}>{state.closing}</h2>
        </section>
      )}

      <p className="portfolio-build">Build {BUILD}</p>

      {editable && !panelOpen && (
        <button type="button" className="editor-toggle" onClick={() => setPanelOpen(true)}>
          Open editor
        </button>
      )}

      {editable && panelOpen && (
        <aside className="editor-panel" aria-label="Vision8 photography editor">
          <div className="editor-heading">
            <div>
              <p>Vision8 photography editor</p>
              <h2>Photography editor</h2>
            </div>
            <button type="button" onClick={() => setPanelOpen(false)} aria-label="Close editor">Close</button>
          </div>

          <p className="editor-note">Sections below follow the page order. Click any photo or line of text on the page to jump straight to it here, and drag a photo on the page to reframe it.</p>

          <HeroControls state={state} update={update} active={active} select={select} />

          <CollectionControls id="contact" state={state} active={active} setActive={setActive} update={update} updateCollection={updateCollection} />
          <CollectionControls id="fan" state={state} active={active} setActive={setActive} update={update} updateCollection={updateCollection} />
          <BreatherControls index={0} state={state} update={update} active={active} select={select} />
          <CollectionControls id="strips" state={state} active={active} setActive={setActive} update={update} updateCollection={updateCollection} />
          <BreatherControls index={1} state={state} update={update} active={active} select={select} />
          <CollectionControls id="editorial" state={state} active={active} setActive={setActive} update={update} updateCollection={updateCollection} />

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

          <div className="editor-actions">
            <button type="button" onClick={() => setPhonePreview(true)}>Phone preview</button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(state, null, 2)).then(() => {
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
          <p className="editor-note">Changes live in this browser only; the public page is unchanged until a selection is handed over and built into source. Copy layout JSON captures everything here for that handover. Uploaded files are previewed for this session only; images added by URL persist.</p>
        </aside>
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

function FocusControls({ image, onChange }: { image: PhotoImage; onChange: (next: PhotoImage) => void }) {
  return (
    <>
      <div className="editor-two-column">
        <label>
          Crop focus X
          <div className="range-row">
            <input
              type="range"
              min={0}
              max={100}
              value={image.focusX}
              onChange={(event) => onChange({ ...image, focusX: Number(event.target.value) })}
            />
            <output>{image.focusX}%</output>
          </div>
        </label>
        <label>
          Crop focus Y
          <div className="range-row">
            <input
              type="range"
              min={0}
              max={100}
              value={image.focusY}
              onChange={(event) => onChange({ ...image, focusY: Number(event.target.value) })}
            />
            <output>{image.focusY}%</output>
          </div>
        </label>
      </div>
      <label>
        Zoom
        <div className="range-row">
          <input
            type="range"
            min={20}
            max={200}
            step={5}
            value={Math.round((image.zoom ?? 1) * 100)}
            onChange={(event) => onChange({ ...image, zoom: Number(event.target.value) / 100 })}
          />
          <output>{Math.round((image.zoom ?? 1) * 100)}%</output>
        </div>
      </label>
    </>
  );
}

function ImagePicker({
  image,
  onChange,
  legend,
}: {
  image: PhotoImage;
  onChange: (next: PhotoImage) => void;
  legend: string;
}) {
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
    </>
  );
}

function HeroControls({
  state,
  update,
  active,
  select,
}: {
  state: PhotoState;
  update: (patch: (current: PhotoState) => PhotoState) => void;
  active: Active;
  select: (target: ImageTarget) => void;
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
          image={state.hero}
          onChange={(next) => update((current) => ({ ...current, hero: next }))}
        />
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
}: {
  index: number;
  state: PhotoState;
  update: (patch: (current: PhotoState) => PhotoState) => void;
  active: Active;
  select: (target: ImageTarget) => void;
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
          image={breather}
          onChange={(next) =>
            update((current) => ({
              ...current,
              breathers: current.breathers.map((entry, i) => (i === index ? next : entry)),
            }))
          }
        />
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
}: {
  id: SectionId;
  state: PhotoState;
  active: Active;
  setActive: (target: Active) => void;
  update: (patch: (current: PhotoState) => PhotoState) => void;
  updateCollection: (id: SectionId, patch: Partial<Collection>) => void;
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
      <h3>{sectionNames[id]}</h3>
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
          <p className="editor-note">Drag the photo on the page to reframe it. An image that fills its frame exactly, like the square contact crops, only moves once zoom is away from 100%: above it the drag pans the crop, below it the whole image slides in its frame.</p>
          <div className="editor-two-column">
            <button type="button" disabled={selected === 0} onClick={() => reorder(selected, selected - 1)}>Move earlier</button>
            <button type="button" disabled={selected === c.images.length - 1} onClick={() => reorder(selected, selected + 1)}>Move later</button>
          </div>
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
              {sectionOrder.filter((other) => other !== id).map((other) => (
                <option key={other} value={other}>{sectionNames[other]}</option>
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
    </section>
  );
}

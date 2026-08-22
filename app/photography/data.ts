/*
  Source truth for the Photography page: types, the default layout, and the
  merge that turns saved or published JSON back into a safe PhotoState. Split
  from photography-view.tsx in v1.11.39 because the server pages need these
  too (the public page renders the published layout server-side), and a
  "use client" module cannot export plain values to a server component.

  v1.11.38: the defaults are the client's first curation pass, made in the
  editor on 15 Aug 2026 and handed over as Copy layout JSON. Contact sheet at
  28 crops (imgc9205 and imgc5130-1600 dropped, light reorder), editorial at
  8 (screen-shot 8-55-41 and imgc4800 dropped, four reframed), three strips
  and the second breather reframed, and the Primary ITO, OSPRI and Hikoi
  labels hidden; Coastguard stays visible. Dropped files remain in
  public/photography/ and can return via Add by URL.

  Images are served from public/photography/, downsized once at import time
  (1800px cap, 640px for the square crops). The mockup's originals stay in the
  mockup folder; never hotlink media.vision8.co.nz, its URLs expire to 403.
*/

const P = "/photography";

/*
  v1.11.61: `whole` letterboxes the image inside its frame (object-fit:
  contain) for pictures whose subject cannot survive the frame's crop, on the
  client's mark: a tall or panoramic photo in a square cell showed an arm or
  a texture and "has no use unless showing the full size".
*/
export type PhotoImage = {
  src: string;
  focusX: number;
  focusY: number;
  zoom: number;
  whole?: boolean;
  /* v1.11.62: relative brightness, 0.75 to 1.25 of the treatment's own level. */
  bright?: number;
  /* v1.11.62: the band of the picture the big frames show, top and bottom as
     percentages of the original. 0 and 100 mean the frame decides (cover). */
  cropTop?: number;
  cropBottom?: number;
  /*
    v1.11.64: how tall the big frames stand, as a percentage of the screen.
    The client's mark: the choice was between the whole photo letterboxed
    small and a full-width frame that cropped whatever it liked, with no way
    to say how much. The frame's own height is what decides that, so it is the
    control. Undefined leaves each frame its designed height, a full screen
    for the hero and half a screen for a big picture.
  */
  frameH?: number;
};

/*
  v1.11.79: the four treatments are styles a collection can have, not fixed
  slots. A collection is any id in `collections` with a style; the four
  built-in ids keep their old names so every layout already published to KV
  loads unchanged. New ones are minted by the editor as `<style>-<n>`. The
  page renders `pageLayout` in order, so the set and the order both live in
  the data rather than in this file.
*/
export type CollectionStyle = "contact" | "fan" | "strips" | "editorial";
export type SectionId = string;
export const collectionStyles: CollectionStyle[] = ["contact", "fan", "strips", "editorial"];
export const builtInSections: SectionId[] = ["contact", "fan", "strips", "editorial"];

export type Collection = {
  style: CollectionStyle;
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
  /* v1.11.64: the closing invitation, the Audio page's closing block as the
     client's reference. */
  ctaTitle: string;
  ctaButton: string;
  showCta: boolean;
  collections: Record<SectionId, Collection>;
  breathers: PhotoImage[];
  closing: string;
  showClosing: boolean;
  pageLayout: PageSlot[];
};

export const img = (src: string): PhotoImage => ({ src, focusX: 50, focusY: 50, zoom: 1, whole: false });

/*
  v1.11.62 let the four sections reorder around fixed breathers; v1.11.63 puts
  the two breathers (the big pictures) in the list as movable slots of their
  own, on the client's mark. The hero stays first and is not in the list.
*/
export type PageSlot = SectionId | "breather-0" | "breather-1";
export const defaultPageLayout: PageSlot[] = ["contact", "fan", "breather-0", "strips", "breather-1", "editorial"];

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
    contact: { style: "contact", label: "Coastguard", showLabel: true, title: "Ready for anything", showTitle: true, images: contactSheet },
    // Labels off for these three at the client's curation; the names stay in
    // the data so the editor can turn them back on.
    fan: { style: "fan", label: "Primary ITO", showLabel: false, title: "Hands on, every day", showTitle: true, images: fanned },
    strips: { style: "strips", label: "OSPRI", showLabel: false, title: "Faces, places, purpose", showTitle: true, images: strips },
    editorial: { style: "editorial", label: "Hikoi & Observational", showLabel: false, title: "Because they just happen", showTitle: true, images: editorial },
  },
  breathers: [img(`${P}/z6-1786678073-6c134bec.jpg`), { ...img(`${P}/img-8268a-1785783280.jpg`), focusY: 92 }],
  closing: "Sometimes all you need is a still image.",
  showClosing: true,
  ctaTitle: "Have something worth photographing?",
  ctaButton: "Book a photoshoot",
  showCta: true,
  pageLayout: [...defaultPageLayout],
};

export const styleNames: Record<CollectionStyle, string> = {
  contact: "Contact sheet",
  fan: "Fanned collection",
  strips: "Sliced collection",
  editorial: "Editorial grid",
};

// The ids of every collection, in page order, breathers left out.
export function collectionIds(state: PhotoState): SectionId[] {
  return state.pageLayout.filter((slot): slot is SectionId => slot in state.collections);
}

// "Editorial grid" while there is one of that style, "Editorial grid 2" once
// there are two, numbered in page order, so the panel's headings and the Move
// to list can tell them apart without the client naming anything.
export function collectionName(state: PhotoState, id: SectionId): string {
  const c = state.collections[id];
  if (!c) return id;
  const same = collectionIds(state).filter((other) => state.collections[other].style === c.style);
  const n = same.indexOf(id);
  return same.length > 1 && n >= 0 ? `${styleNames[c.style]} ${n + 1}` : styleNames[c.style];
}

export function emptyCollection(style: CollectionStyle): Collection {
  return { style, label: "", showLabel: false, title: "", showTitle: true, images: [] };
}

// `<style>-2`, `<style>-3`... the first free one, never reusing an id that a
// draft or a published layout might still carry.
export function newCollectionId(state: PhotoState, style: CollectionStyle): SectionId {
  let n = 2;
  while (`${style}-${n}` in state.collections) n += 1;
  return `${style}-${n}`;
}

// Saved or published state is merged field by field over the defaults rather
// than taken wholesale, so JSON from an older shape (or a hand-edited one)
// degrades to the source values instead of rendering an empty page.
export function mergeSaved(saved: unknown): PhotoState {
  if (!saved || typeof saved !== "object") return defaultState;
  const s = saved as Partial<PhotoState>;
  const image = (candidate: unknown, fallback: PhotoImage): PhotoImage => {
    const c = candidate as Partial<PhotoImage> | undefined;
    if (!c || typeof c.src !== "string" || !c.src) return fallback;
    return {
      src: c.src,
      focusX: typeof c.focusX === "number" ? c.focusX : 50,
      focusY: typeof c.focusY === "number" ? c.focusY : 50,
      // Floored at 1: below frame-fill was retired in v1.11.58, and a saved
      // draft carrying one would render gaps.
      zoom: typeof c.zoom === "number" ? Math.max(1, c.zoom) : 1,
      whole: c.whole === true,
      bright: typeof c.bright === "number" ? Math.min(1.25, Math.max(0.75, c.bright)) : 1,
      cropTop: typeof c.cropTop === "number" ? Math.min(95, Math.max(0, c.cropTop)) : 0,
      cropBottom: typeof c.cropBottom === "number" ? Math.min(100, Math.max(5, c.cropBottom)) : 100,
      // Undefined, not a number, when unset: the CSS default differs between
      // the hero and a big picture and only the absent value can pick it up.
      frameH: typeof c.frameH === "number" ? Math.min(100, Math.max(20, c.frameH)) : undefined,
    };
  };
  const collection = (id: SectionId, d: Collection): Collection => {
    const c = s.collections?.[id];
    if (!c) return d;
    return {
      style: d.style,
      label: typeof c.label === "string" ? c.label : d.label,
      showLabel: typeof c.showLabel === "boolean" ? c.showLabel : d.showLabel,
      title: typeof c.title === "string" ? c.title : d.title,
      showTitle: typeof c.showTitle === "boolean" ? c.showTitle : d.showTitle,
      images: Array.isArray(c.images) ? c.images.map((entry) => image(entry, img(""))).filter((entry) => entry.src) : d.images,
    };
  };
  /*
    The four built-ins always exist and merge over their defaults. Any other
    id is an added collection: kept when it names a known style, dropped
    otherwise, so a hand-edited or older JSON cannot put an unrenderable
    section on the page.
  */
  const collections: Record<SectionId, Collection> = {};
  builtInSections.forEach((id) => {
    collections[id] = collection(id, defaultState.collections[id]);
  });
  Object.entries(s.collections ?? {}).forEach(([id, c]) => {
    if (id in collections || !c || typeof c !== "object") return;
    const style = (c as Partial<Collection>).style;
    if (typeof style !== "string" || !collectionStyles.includes(style as CollectionStyle)) return;
    collections[id] = collection(id, emptyCollection(style as CollectionStyle));
  });
  return {
    hero: image(s.hero, defaultState.hero),
    heroTitle: typeof s.heroTitle === "string" ? s.heroTitle : defaultState.heroTitle,
    heroLede: typeof s.heroLede === "string" ? s.heroLede : defaultState.heroLede,
    collections,
    breathers: Array.isArray(s.breathers) && s.breathers.length === 2
      ? [image(s.breathers[0], defaultState.breathers[0]), image(s.breathers[1], defaultState.breathers[1])]
      : defaultState.breathers,
    closing: typeof s.closing === "string" ? s.closing : defaultState.closing,
    showClosing: typeof s.showClosing === "boolean" ? s.showClosing : defaultState.showClosing,
    ctaTitle: typeof s.ctaTitle === "string" ? s.ctaTitle : defaultState.ctaTitle,
    ctaButton: typeof s.ctaButton === "string" ? s.ctaButton : defaultState.ctaButton,
    showCta: typeof s.showCta === "boolean" ? s.showCta : defaultState.showCta,
    pageLayout: readPageLayout(s, Object.keys(collections)),
  };
}

/*
  v1.11.79: the saved order is kept for every slot it names that exists, in
  that order, once each; anything it names that does not exist is dropped and
  anything that exists but is not named is appended, built-ins in their
  default order and added collections after. So a layout published before a
  collection was added, or one that names a collection since removed, still
  renders everything exactly once.

  A v1.11.62 draft carries the four-section `sectionLayout` instead; it is
  migrated with the breathers put back in their fixed v1.11.62 places, after
  the second and third sections.
*/
function readPageLayout(s: Partial<PhotoState> & { sectionLayout?: SectionId[] }, ids: SectionId[]): PageSlot[] {
  const known = new Set<PageSlot>([...defaultPageLayout, ...ids]);
  let candidate: unknown = s.pageLayout;
  const old = s.sectionLayout;
  if (!Array.isArray(candidate) && Array.isArray(old) && old.length === builtInSections.length && builtInSections.every((id) => old.includes(id))) {
    candidate = [old[0], old[1], "breather-0", old[2], "breather-1", old[3]];
  }
  const ordered: PageSlot[] = [];
  if (Array.isArray(candidate)) {
    candidate.forEach((slot) => {
      if (typeof slot === "string" && known.has(slot) && !ordered.includes(slot)) ordered.push(slot);
    });
  }
  [...defaultPageLayout, ...ids].forEach((slot) => {
    if (!ordered.includes(slot)) ordered.push(slot);
  });
  return ordered;
}

// blob: URLs die with the browser session that minted them, so they must
// never be persisted or published. Uploads fall back to the source image
// (hero, breathers) or drop out of the list (collections).
export function sanitizeState(state: PhotoState): PhotoState {
  return {
    ...state,
    hero: state.hero.src.startsWith("blob:") ? defaultState.hero : state.hero,
    breathers: state.breathers.map((entry, i) => (entry.src.startsWith("blob:") ? defaultState.breathers[i] : entry)),
    collections: Object.fromEntries(
      (Object.keys(state.collections) as SectionId[]).map((id) => [
        id,
        { ...state.collections[id], images: state.collections[id].images.filter((entry) => !entry.src.startsWith("blob:")) },
      ]),
    ) as PhotoState["collections"],
  };
}

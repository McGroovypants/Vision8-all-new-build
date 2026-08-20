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
export type PhotoImage = { src: string; focusX: number; focusY: number; zoom: number; whole?: boolean };

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

export const img = (src: string): PhotoImage => ({ src, focusX: 50, focusY: 50, zoom: 1, whole: false });

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

export const sectionOrder: SectionId[] = ["contact", "fan", "strips", "editorial"];

export const sectionNames: Record<SectionId, string> = {
  contact: "Contact sheet",
  fan: "Fanned collection",
  strips: "Sliced collection",
  editorial: "Editorial grid",
};

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

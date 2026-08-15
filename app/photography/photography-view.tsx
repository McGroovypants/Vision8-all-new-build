"use client";

/*
  The Photography page and its editor, one component, the same architecture as
  the homepage's HomepageV1103: `editable` is on only for /photography/editor
  and gates the panel and every localStorage read and write; `previewSaved` is
  on only for /photography/preview, which the editor's phone preview loads in
  an iframe and which re-reads saved state on `storage` events so edits appear
  live. The public /photography renders the source defaults below and never
  touches localStorage, so nothing the editor does reaches visitors.

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

export type PhotoImage = { src: string; focusX: number; focusY: number };

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

const img = (src: string): PhotoImage => ({ src, focusX: 50, focusY: 50 });

// Coastguard, 30 face-aware square crops, mockup order.
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
  "imgc9207-1786734655-5935ae27.jpg",
  "imgc9198-1786734656-a8c4a4c1.jpg",
  "imgc9205-1786734657-76665e23.jpg",
  "screenshot-2026-05-08-at-8-00-09-am-1786734657-589e683c.jpg",
  "screenshot-2026-05-08-at-7-59-58-am-1786734659-695db86e.jpg",
  "imgc9076-1786734661-338ae127.jpg",
  "img-9708-1786734661-968d33d9.jpg",
  "screenshot-2026-05-08-at-8-00-25-am-1786734663-c971d587.jpg",
  "imgc9249-1786734663-fdd2f819.jpg",
  "imgc9258-1786734666-6ee7051f.jpg",
  "imgc9257-1786734669-6da9117a.jpg",
  "imgc9195-1786734677-580cbd08.jpg",
  "imgc9191-1786734682-ffdcf6d7.jpg",
  "imgc9224-1786734683-a6d908fa.jpg",
  "imgc5128-1600x1067-1786740334-cf37bf51.jpg",
  "imgc5146-1600x1066-1786740338-cd4074cd.jpg",
  "imgc5178-1600x1066-1786740340-eb17da65.jpg",
  "imgc5130-1600x1067-1786740343-ae22cf2e.jpg",
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

// OSPRI, eight vertical strips, hover expands.
const strips = [
  "imgc4355-1785813065.jpg",
  "imgc4385-1785813065.jpg",
  "imgc4226-1785813065.jpg",
  "imgc4401-1785813065.jpg",
  "imgc4007-1785813065.jpg",
  "imgc1933-1786735898-19bed632.jpg",
  "imgc1702-1786735899-65ad6ea4.jpg",
  "imgc1711-1786735902-b8fabc66.jpg",
].map((file) => img(`${P}/${file}`));

// Hikoi and observational work, ten images on the aligned six-column grid.
const editorial = [
  "img-4112-1785781272.jpg",
  "screen-shot-2018-10-01-at-8-55-41-pm-2-1785781422.jpg",
  "screen-shot-2018-10-01-at-8-57-08-pm-1785781422.jpg",
  "imgc4692-1786394460-dfc39369.jpg",
  "imgc3882-1786394460-847a5f1a.jpg",
  "imgc4454-1786394464-18c566a0.jpg",
  "imgc4657-1786394468-f4afa50a.jpg",
  "imgc3884-1786394471-72c746a7.jpg",
  "imgc4800-1786394473-b9daa8a1.jpg",
  "imgc4746-1786394475-9fee2875.jpg",
].map((file) => img(`${P}/${file}`));

export const defaultState: PhotoState = {
  hero: img(`${P}/dragonfly-in-hongkong-1786678073-de2cf7f1.jpg`),
  heroTitle: "Sometimes one frame is enough.",
  heroLede: "Photography for people, places, products and the work behind them.",
  collections: {
    contact: { label: "Coastguard", showLabel: true, title: "Ready for anything", showTitle: true, images: contactSheet },
    fan: { label: "Primary ITO", showLabel: true, title: "Hands on, every day", showTitle: true, images: fanned },
    strips: { label: "OSPRI", showLabel: true, title: "Faces, places, purpose", showTitle: true, images: strips },
    editorial: { label: "Hikoi & Observational", showLabel: true, title: "Because they just happen", showTitle: true, images: editorial },
  },
  breathers: [img(`${P}/z6-1786678073-6c134bec.jpg`), img(`${P}/img-8268a-1785783280.jpg`)],
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

const focus = (image: PhotoImage) => ({ objectPosition: `${image.focusX}% ${image.focusY}%` });

type PanelSection = "hero" | SectionId | "breathers" | "closing";

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
  const [panelSection, setPanelSection] = useState<PanelSection>("hero");
  const [selected, setSelected] = useState<number | null>(null);
  const [phonePreview, setPhonePreview] = useState(false);
  const [copied, setCopied] = useState(false);
  // Same guard as the homepage editor: nothing is written to localStorage
  // until the user actually changes something, so opening the editor to look
  // never pins the current defaults over a later deploy.
  const dirty = useRef(false);

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

  const update = (patch: (current: PhotoState) => PhotoState) => {
    dirty.current = true;
    setState(patch);
  };

  const updateCollection = (id: SectionId, patch: Partial<Collection>) =>
    update((current) => ({
      ...current,
      collections: { ...current.collections, [id]: { ...current.collections[id], ...patch } },
    }));

  const collectionBlock = (id: SectionId) => {
    const c = state.collections[id];
    return (
      <>
        {c.showLabel && c.label && <p className="photo-label">{c.label}</p>}
        {c.showTitle && c.title && <h2 className="photo-title">{c.title}</h2>}
      </>
    );
  };

  return (
    <main className="photo-page">
      <PageHeader division="Photography" />

      <section className="photo-hero">
        <img src={state.hero.src} alt="Vision8 Photography" style={focus(state.hero)} />
        <div className="photo-hero-overlay">
          {state.heroTitle && <h1>{state.heroTitle}</h1>}
          {state.heroLede && <p className="photo-hero-lede">{state.heroLede}</p>}
        </div>
      </section>

      <section className="photo-section">
        {collectionBlock("contact")}
        <div className="contact-grid">
          {state.collections.contact.images.map((image, index) => (
            <div className="contact-cell" key={`${image.src}-${index}`}>
              <img src={image.src} alt="" loading="lazy" style={focus(image)} />
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
              <img src={image.src} alt="" loading="lazy" style={focus(image)} />
            </div>
          ))}
        </div>
      </section>

      <section className="photo-breather">
        <img src={state.breathers[0].src} alt="" loading="lazy" style={focus(state.breathers[0])} />
      </section>

      <section className="photo-section">
        {collectionBlock("strips")}
        <div className="strips-container">
          {state.collections.strips.images.map((image, index) => (
            <div className="strip" key={`${image.src}-${index}`}>
              <img src={image.src} alt="" loading="lazy" style={focus(image)} />
            </div>
          ))}
        </div>
      </section>

      <section className="photo-breather">
        <img src={state.breathers[1].src} alt="" loading="lazy" style={focus(state.breathers[1])} />
      </section>

      <section className="photo-section">
        {collectionBlock("editorial")}
        <EditorialGrid images={state.collections.editorial.images.map((image) => ({ src: image.src, position: `${image.focusX}% ${image.focusY}%` }))} />
      </section>

      {state.showClosing && state.closing && (
        <section className="photo-closing">
          <h2>{state.closing}</h2>
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

          <section className="editor-section">
            <label>
              Page section
              <select
                value={panelSection}
                onChange={(event) => {
                  setPanelSection(event.target.value as PanelSection);
                  setSelected(null);
                }}
              >
                <option value="hero">Hero</option>
                {sectionOrder.map((id) => (
                  <option key={id} value={id}>
                    {sectionNames[id]}: {state.collections[id].title || state.collections[id].label || id}
                  </option>
                ))}
                <option value="breathers">Breather images</option>
                <option value="closing">Closing line</option>
              </select>
            </label>
          </section>

          {panelSection === "hero" && (
            <HeroControls state={state} update={update} />
          )}

          {sectionOrder.includes(panelSection as SectionId) && (
            <CollectionControls
              id={panelSection as SectionId}
              state={state}
              selected={selected}
              setSelected={setSelected}
              update={update}
              updateCollection={updateCollection}
            />
          )}

          {panelSection === "breathers" && (
            <BreatherControls state={state} update={update} />
          )}

          {panelSection === "closing" && (
            <section className="editor-section">
              <h3>Closing line</h3>
              <label>
                Text
                <textarea
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
          )}

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
                setSelected(null);
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

function FocusControls({ image, onChange }: { image: PhotoImage; onChange: (next: PhotoImage) => void }) {
  return (
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
  );
}

function HeroControls({ state, update }: { state: PhotoState; update: (patch: (current: PhotoState) => PhotoState) => void }) {
  return (
    <section className="editor-section">
      <h3>Hero</h3>
      <label>
        Headline
        <input
          type="text"
          value={state.heroTitle}
          onChange={(event) => update((current) => ({ ...current, heroTitle: event.target.value }))}
        />
      </label>
      <label>
        Supporting line
        <textarea
          rows={2}
          value={state.heroLede}
          onChange={(event) => update((current) => ({ ...current, heroLede: event.target.value }))}
        />
      </label>
      <ImagePicker
        legend="Hero"
        image={state.hero}
        onChange={(next) => update((current) => ({ ...current, hero: next }))}
      />
    </section>
  );
}

function BreatherControls({ state, update }: { state: PhotoState; update: (patch: (current: PhotoState) => PhotoState) => void }) {
  return (
    <section className="editor-section">
      <h3>Breather images</h3>
      {state.breathers.map((breather, index) => (
        <div key={index} className="photo-editor-breather">
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
      ))}
    </section>
  );
}

function CollectionControls({
  id,
  state,
  selected,
  setSelected,
  update,
  updateCollection,
}: {
  id: SectionId;
  state: PhotoState;
  selected: number | null;
  setSelected: (index: number | null) => void;
  update: (patch: (current: PhotoState) => PhotoState) => void;
  updateCollection: (id: SectionId, patch: Partial<Collection>) => void;
}) {
  const c = state.collections[id];
  const [addUrl, setAddUrl] = useState("");
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const setImages = (images: PhotoImage[]) => updateCollection(id, { images });

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    const images = [...c.images];
    const [moved] = images.splice(from, 1);
    images.splice(to, 0, moved);
    setImages(images);
    setSelected(to);
  };

  const selectedImage = selected !== null ? c.images[selected] : null;

  return (
    <>
      <section className="editor-section">
        <h3>{sectionNames[id]}</h3>
        <label>
          Client / source label
          <input type="text" value={c.label} onChange={(event) => updateCollection(id, { label: event.target.value })} />
        </label>
        <label className="photo-editor-check">
          <input type="checkbox" checked={c.showLabel} onChange={(event) => updateCollection(id, { showLabel: event.target.checked })} />
          Show label
        </label>
        <label>
          Heading
          <input type="text" value={c.title} onChange={(event) => updateCollection(id, { title: event.target.value })} />
        </label>
        <label className="photo-editor-check">
          <input type="checkbox" checked={c.showTitle} onChange={(event) => updateCollection(id, { showTitle: event.target.checked })} />
          Show heading
        </label>
      </section>

      <section className="editor-section">
        <h3>Images ({c.images.length})</h3>
        <div className="photo-editor-thumbs">
          {c.images.map((image, index) => (
            <button
              type="button"
              key={`${image.src}-${index}`}
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
              onClick={() => setSelected(selected === index ? null : index)}
            >
              <img src={image.src} alt="" loading="lazy" />
              <span>{index + 1}</span>
            </button>
          ))}
        </div>
        <p className="editor-note">Drag to reorder, or click an image for its controls.</p>

        {selectedImage && selected !== null && (
          <div className="photo-editor-selected">
            <FocusControls
              image={selectedImage}
              onChange={(next) => setImages(c.images.map((entry, i) => (i === selected ? next : entry)))}
            />
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
                    setSelected(null);
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
                setSelected(null);
              }}
            >
              Remove from collection
            </button>
          </div>
        )}
      </section>

      <section className="editor-section">
        <h3>Add image</h3>
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
    </>
  );
}

"use client";

import Image from "next/image";
import type { ChangeEvent, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type DivisionId = "home" | "filming" | "photography" | "motion" | "websites" | "ai" | "real-estate";
type MediaType = "image" | "video";
type TextStyleKey = "header" | "fan" | "kicker" | "headline" | "body";

type DivisionRecord = {
  id: DivisionId;
  label: string;
  kicker: string;
  headline: string;
  body: string;
  mediaType: MediaType;
  mediaUrl: string;
  href?: string;
};

type TextControl = {
  scale: number;
  color: string;
  brightness: number;
};

type EditorStyles = Record<TextStyleKey, TextControl> & {
  mediaOpacity: number;
};

type HeaderCopy = {
  home: string;
  about: string;
  mahi: string;
  contact: string;
};

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const LOGO = `${CLOUD}/image/upload/v1785634240/new_vision8_logo_design_clean_2_whfcvy.png`;
const VIDEO_SITE = "https://mcgroovypants.github.io/V8-website-2026/";
const PEOPLE = `${VIDEO_SITE}#team`;
const LENSWORKS = "https://lensworks.co.nz/";
const STORAGE_KEY = "vision8-homepage-editor-v1.9.0";

const fanOrder: Exclude<DivisionId, "home">[] = [
  "motion",
  "photography",
  "filming",
  "real-estate",
  "websites",
  "ai",
];

const editorOrder: DivisionId[] = ["home", ...fanOrder];
const fanSequence: Exclude<DivisionId, "home">[] = [...fanOrder, "filming"];

const defaultRecords: Record<DivisionId, DivisionRecord> = {
  home: {
    id: "home",
    label: "Home",
    kicker: "Creative thinking / Hands-on making",
    headline: "Think it through. Make it work.",
    body: "Six connected divisions, shaped around what the project actually needs.",
    mediaType: "image",
    mediaUrl: `${CLOUD}/video/upload/f_jpg,w_1800,q_auto,so_20/Vision8_sky_and_water_Reel_1_uzx4vi`,
  },
  motion: {
    id: "motion",
    label: "Motion & Animation",
    kicker: "Motion and animation",
    headline: "Make complex things clear.",
    body: "Motion graphics, animation and explainers.",
    mediaType: "image",
    mediaUrl: `${CLOUD}/video/upload/f_jpg,w_1800,q_auto,so_5/Vision8_Animation_Motion_Gfx_h0emew`,
  },
  photography: {
    id: "photography",
    label: "Photography",
    kicker: "Photography",
    headline: "Still work with purpose.",
    body: "People, places, campaigns and events.",
    mediaType: "image",
    mediaUrl: `${CLOUD}/image/upload/f_auto,q_auto,w_1800/IMGC9782_boak3q`,
  },
  filming: {
    id: "filming",
    label: "Video",
    kicker: "Video",
    headline: "Ideas through to delivery.",
    body: "Concept, production, filming, editing and delivery.",
    mediaType: "image",
    mediaUrl: `${CLOUD}/video/upload/f_jpg,w_1800,q_auto,so_14/Vision8_2025_Reel_HEADER_2_j12y5e`,
    href: VIDEO_SITE,
  },
  "real-estate": {
    id: "real-estate",
    label: "Real Estate Media",
    kicker: "Real estate media",
    headline: "Property media through Lensworks.",
    body: "Photography and video for property marketing.",
    mediaType: "image",
    mediaUrl: "",
    href: LENSWORKS,
  },
  websites: {
    id: "websites",
    label: "Websites",
    kicker: "Websites",
    headline: "Useful digital experiences.",
    body: "Structure, design and practical website builds.",
    mediaType: "image",
    mediaUrl: "",
  },
  ai: {
    id: "ai",
    label: "AI Solutions",
    kicker: "AI solutions",
    headline: "Useful tools, built for the job.",
    body: "Useful AI tools, custom apps and focused automation.",
    mediaType: "image",
    mediaUrl: "",
  },
};

const defaultHeaderCopy: HeaderCopy = {
  home: "Home",
  about: "About us",
  mahi: "Our mahi",
  contact: "Contact",
};

const defaultStyles: EditorStyles = {
  header: { scale: 110, color: "#bac2bf", brightness: 100 },
  fan: { scale: 100, color: "#f3f4ef", brightness: 70 },
  kicker: { scale: 100, color: "#0bb7a3", brightness: 100 },
  headline: { scale: 100, color: "#f3f4ef", brightness: 100 },
  body: { scale: 100, color: "#f3f4ef", brightness: 74 },
  mediaOpacity: 34,
};

const styleLabels: Array<{ key: TextStyleKey; label: string }> = [
  { key: "header", label: "Header" },
  { key: "fan", label: "Fan labels" },
  { key: "kicker", label: "Teal section label" },
  { key: "headline", label: "Large headline" },
  { key: "body", label: "Explainer text" },
];

function colorWithBrightness(hex: string, brightness: number) {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${brightness / 100})`;
}

function LogoIntro({ skipped, onSkip }: { skipped: boolean; onSkip: () => void }) {
  return (
    <div className={`logo-intro${skipped ? " intro-skipped" : ""}`}>
      <div className="intro-stage">
        <Image src={LOGO} alt="Vision8" width={1976} height={704} priority unoptimized />
      </div>
      <button type="button" onClick={onSkip}>Skip intro</button>
    </div>
  );
}

function StageMedia({ record, active }: { record: DivisionRecord; active: boolean }) {
  const activeClass = active ? " active" : "";

  if (!record.mediaUrl) {
    return <div className={`stage-media-layer stage-image${activeClass}`} aria-hidden="true" />;
  }

  if (record.mediaType === "video") {
    return (
      <video
        key={`${record.id}-${record.mediaUrl}`}
        className={`stage-media-layer stage-video${activeClass}`}
        src={record.mediaUrl}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      key={`${record.id}-${record.mediaUrl}`}
      className={`stage-media-layer stage-image has-image${activeClass}`}
      style={{ backgroundImage: `url(${record.mediaUrl})` }}
      aria-hidden="true"
    />
  );
}

function Header({ copy, onHome }: { copy: HeaderCopy; onHome: () => void }) {
  return (
    <header className="site-header">
      <nav className="header-left" aria-label="Homepage navigation">
        <button type="button" onClick={onHome}>{copy.home}</button>
        <a href={PEOPLE}>{copy.about}</a>
        <a href={VIDEO_SITE}>{copy.mahi}</a>
      </nav>

      <nav className="header-right" aria-label="Contact navigation">
        <a href="mailto:hello@vision8.co.nz">{copy.contact}</a>
      </nav>
    </header>
  );
}

function EditorPanel({
  records,
  styles,
  headerCopy,
  selectedId,
  uploadNames,
  onClose,
  onSelect,
  onRecordChange,
  onStyleChange,
  onMediaOpacityChange,
  onHeaderChange,
  onUpload,
  onReset,
}: {
  records: Record<DivisionId, DivisionRecord>;
  styles: EditorStyles;
  headerCopy: HeaderCopy;
  selectedId: DivisionId;
  uploadNames: Partial<Record<DivisionId, string>>;
  onClose: () => void;
  onSelect: (id: DivisionId) => void;
  onRecordChange: (id: DivisionId, patch: Partial<DivisionRecord>) => void;
  onStyleChange: (key: TextStyleKey, patch: Partial<TextControl>) => void;
  onMediaOpacityChange: (value: number) => void;
  onHeaderChange: (key: keyof HeaderCopy, value: string) => void;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}) {
  const record = records[selectedId];

  return (
    <aside className="editor-panel" aria-label="Vision8 homepage editor">
      <div className="editor-heading">
        <div>
          <p>Local controls</p>
          <h2>Homepage editor</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close editor">Close</button>
      </div>

      <section className="editor-section">
        <h3>Section content</h3>
        <label>
          Preview section
          <select value={selectedId} onChange={(event) => onSelect(event.target.value as DivisionId)}>
            {editorOrder.map((id) => <option key={id} value={id}>{records[id].label}</option>)}
          </select>
        </label>

        {selectedId !== "home" && (
          <label>
            Fan label
            <input value={record.label} onChange={(event) => onRecordChange(selectedId, { label: event.target.value })} />
          </label>
        )}

        <label>
          Teal section label
          <input value={record.kicker} onChange={(event) => onRecordChange(selectedId, { kicker: event.target.value })} />
        </label>

        <label>
          Large headline
          <textarea rows={2} value={record.headline} onChange={(event) => onRecordChange(selectedId, { headline: event.target.value })} />
        </label>

        <label>
          Explainer text
          <textarea rows={2} value={record.body} onChange={(event) => onRecordChange(selectedId, { body: event.target.value })} />
        </label>
      </section>

      <section className="editor-section">
        <h3>Background media</h3>
        <div className="editor-two-column">
          <label>
            Media type
            <select value={record.mediaType} onChange={(event) => onRecordChange(selectedId, { mediaType: event.target.value as MediaType })}>
              <option value="image">Still image</option>
              <option value="video">Video</option>
            </select>
          </label>
          <label>
            Brightness
            <span className="range-row">
              <input
                type="range"
                min="0"
                max="80"
                value={styles.mediaOpacity}
                onChange={(event) => onMediaOpacityChange(Number(event.target.value))}
              />
              <output>{styles.mediaOpacity}%</output>
            </span>
          </label>
        </div>

        <label>
          Media URL
          <input
            type="url"
            placeholder="https://..."
            value={record.mediaUrl.startsWith("blob:") ? "" : record.mediaUrl}
            onChange={(event) => onRecordChange(selectedId, { mediaUrl: event.target.value })}
          />
        </label>

        <label className="upload-control">
          Upload still or video
          <input type="file" accept="image/*,video/*" onChange={onUpload} />
          <span>{uploadNames[selectedId] ?? "Choose a local file"}</span>
        </label>
        <p className="editor-note">URLs are saved in this browser. Uploaded files are previewed for this session only.</p>
      </section>

      <section className="editor-section">
        <h3>Header wording</h3>
        <div className="editor-two-column">
          {(Object.keys(headerCopy) as Array<keyof HeaderCopy>).map((key) => (
            <label key={key}>
              {key}
              <input value={headerCopy[key]} onChange={(event) => onHeaderChange(key, event.target.value)} />
            </label>
          ))}
        </div>
      </section>

      <section className="editor-section">
        <h3>Text appearance</h3>
        {styleLabels.map(({ key, label }) => (
          <fieldset key={key} className="style-control">
            <legend>{label}</legend>
            <label>
              Size
              <span className="range-row">
                <input
                  type="range"
                  min="60"
                  max="180"
                  value={styles[key].scale}
                  onChange={(event) => onStyleChange(key, { scale: Number(event.target.value) })}
                />
                <output>{styles[key].scale}%</output>
              </span>
            </label>
            <div className="editor-two-column compact">
              <label>
                Colour
                <input type="color" value={styles[key].color} onChange={(event) => onStyleChange(key, { color: event.target.value })} />
              </label>
              <label>
                Brightness
                <span className="range-row">
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={styles[key].brightness}
                    onChange={(event) => onStyleChange(key, { brightness: Number(event.target.value) })}
                  />
                  <output>{styles[key].brightness}%</output>
                </span>
              </label>
            </div>
          </fieldset>
        ))}
      </section>

      <div className="editor-actions">
        <button type="button" onClick={onReset}>Reset local changes</button>
        <button type="button" className="editor-done" onClick={onClose}>Done</button>
      </div>
    </aside>
  );
}

export function HomepageV191() {
  const [records, setRecords] = useState(defaultRecords);
  const [headerCopy, setHeaderCopy] = useState(defaultHeaderCopy);
  const [styles, setStyles] = useState(defaultStyles);
  const [activeId, setActiveId] = useState<DivisionId>("filming");
  const [litId, setLitId] = useState<DivisionId>("home");
  const [skipped, setSkipped] = useState(false);
  const [cycleCancelled, setCycleCancelled] = useState(false);
  const [isCycling, setIsCycling] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorId, setEditorId] = useState<DivisionId>("filming");
  const [uploadNames, setUploadNames] = useState<Partial<Record<DivisionId, string>>>({});
  const [loaded, setLoaded] = useState(false);
  const blobUrls = useRef<string[]>([]);
  const active = records[activeId];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as {
            records?: Partial<Record<DivisionId, Partial<DivisionRecord>>>;
            styles?: Partial<EditorStyles>;
            headerCopy?: Partial<HeaderCopy>;
          };
          if (parsed.records) {
            const merged = { ...defaultRecords };
            editorOrder.forEach((id) => {
              merged[id] = { ...defaultRecords[id], ...parsed.records?.[id], id };
            });
            setRecords(merged);
          }
          if (parsed.styles) {
            setStyles({
              ...defaultStyles,
              ...parsed.styles,
              header: { ...defaultStyles.header, ...parsed.styles.header },
              fan: { ...defaultStyles.fan, ...parsed.styles.fan },
              kicker: { ...defaultStyles.kicker, ...parsed.styles.kicker },
              headline: { ...defaultStyles.headline, ...parsed.styles.headline },
              body: { ...defaultStyles.body, ...parsed.styles.body },
            });
          }
          if (parsed.headerCopy) {
            setHeaderCopy({ ...defaultHeaderCopy, ...parsed.headerCopy });
          }
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
      setLoaded(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const persistedRecords = { ...records };
    editorOrder.forEach((id) => {
      if (persistedRecords[id].mediaUrl.startsWith("blob:")) {
        persistedRecords[id] = { ...persistedRecords[id], mediaUrl: defaultRecords[id].mediaUrl };
      }
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ records: persistedRecords, styles, headerCopy }));
  }, [records, styles, headerCopy, loaded]);

  useEffect(() => {
    if (cycleCancelled) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedTimer = window.setTimeout(() => {
        setLitId("filming");
        setActiveId("filming");
        setIsCycling(false);
      }, 0);
      return () => window.clearTimeout(reducedTimer);
    }

    const startDelay = skipped ? 0 : 3250;
    const timers = fanSequence.map((id, index) => window.setTimeout(() => {
      setLitId(id);
      if (index === fanSequence.length - 1) {
        setActiveId("filming");
        setIsCycling(false);
      }
    }, startDelay + (index * 540)));

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [cycleCancelled, skipped]);

  useEffect(() => () => blobUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const styleVars = {
    "--editor-header-size": `${1.15 * (styles.header.scale / 100)}rem`,
    "--editor-header-color": colorWithBrightness(styles.header.color, styles.header.brightness),
    "--editor-fan-min": `${0.72 * (styles.fan.scale / 100)}rem`,
    "--editor-fan-vw": `${1.05 * (styles.fan.scale / 100)}vw`,
    "--editor-fan-max": `${0.94 * (styles.fan.scale / 100)}rem`,
    "--editor-fan-color": colorWithBrightness(styles.fan.color, styles.fan.brightness),
    "--editor-kicker-size": `${0.66 * (styles.kicker.scale / 100)}rem`,
    "--editor-photo-kicker-size": `${1.32 * (styles.kicker.scale / 100)}rem`,
    "--editor-kicker-color": colorWithBrightness(styles.kicker.color, styles.kicker.brightness),
    "--editor-headline-min": `${2 * (styles.headline.scale / 100)}rem`,
    "--editor-headline-vw": `${3.6 * (styles.headline.scale / 100)}vw`,
    "--editor-headline-max": `${3.65 * (styles.headline.scale / 100)}rem`,
    "--editor-headline-color": colorWithBrightness(styles.headline.color, styles.headline.brightness),
    "--editor-body-min": `${0.84 * (styles.body.scale / 100)}rem`,
    "--editor-body-vw": `${1.1 * (styles.body.scale / 100)}vw`,
    "--editor-body-max": `${1 * (styles.body.scale / 100)}rem`,
    "--editor-photo-body-min": `${1.01 * (styles.body.scale / 100)}rem`,
    "--editor-photo-body-vw": `${1.32 * (styles.body.scale / 100)}vw`,
    "--editor-photo-body-max": `${1.2 * (styles.body.scale / 100)}rem`,
    "--editor-body-color": colorWithBrightness(styles.body.color, styles.body.brightness),
    "--editor-media-opacity": `${styles.mediaOpacity / 100}`,
  } as CSSProperties;

  function cancelCycle() {
    setCycleCancelled(true);
    setIsCycling(false);
  }

  function activate(id: DivisionId) {
    cancelCycle();
    setActiveId(id);
    setLitId(id);
  }

  function selectHome() {
    activate("home");
  }

  function openEditor() {
    cancelCycle();
    setEditorId(activeId);
    setEditorOpen(true);
  }

  function selectEditorSection(id: DivisionId) {
    setEditorId(id);
    activate(id);
  }

  function updateRecord(id: DivisionId, patch: Partial<DivisionRecord>) {
    setRecords((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  }

  function updateStyle(key: TextStyleKey, patch: Partial<TextControl>) {
    setStyles((current) => ({ ...current, [key]: { ...current[key], ...patch } }));
  }

  function handleMediaOpacity(value: number) {
    setStyles((current) => ({ ...current, mediaOpacity: value }));
  }

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    blobUrls.current.push(url);
    const mediaType: MediaType = file.type.startsWith("video/") ? "video" : "image";
    updateRecord(editorId, { mediaUrl: url, mediaType });
    setUploadNames((current) => ({ ...current, [editorId]: file.name }));
    event.target.value = "";
  }

  function resetEditor() {
    if (!window.confirm("Reset all local editor changes?")) return;
    blobUrls.current.forEach((url) => URL.revokeObjectURL(url));
    blobUrls.current = [];
    window.localStorage.removeItem(STORAGE_KEY);
    setRecords(defaultRecords);
    setHeaderCopy(defaultHeaderCopy);
    setStyles(defaultStyles);
    setUploadNames({});
    setEditorId("filming");
    activate("filming");
  }

  return (
    <main className="v191-shell" style={styleVars}>
      <LogoIntro skipped={skipped} onSkip={() => setSkipped(true)} />
      <Header copy={headerCopy} onHome={selectHome} />

      <section className={`home-stage active-${active.id}${isCycling ? " fan-cycle" : ""}`}>
        <div className="stage-media-stack" aria-hidden="true">
          {editorOrder.map((id) => (
            <StageMedia key={id} record={records[id]} active={activeId === id} />
          ))}
        </div>
        <div className="stage-wash" aria-hidden="true" />

        <div className="fan" aria-label="Vision8 divisions">
          {fanOrder.map((id) => {
            const division = records[id];
            const activeClass = litId === id ? " active" : "";
            const nodeClass = `fan-node${activeClass}`;
            const shared = {
              onMouseEnter: () => activate(id),
              onFocus: () => activate(id),
              onClick: cancelCycle,
            };

            return (
              <div key={id} className={`fan-branch branch-${id}${activeClass}`}>
                <span className="fan-line" aria-hidden="true" />
                {division.href ? (
                  <a className={nodeClass} href={division.href} {...shared}>
                    <span>{division.label}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    className={nodeClass}
                    aria-pressed={activeId === id}
                    onClick={() => activate(id)}
                    onMouseEnter={() => activate(id)}
                    onFocus={() => activate(id)}
                  >
                    <span>{division.label}</span>
                  </button>
                )}
              </div>
            );
          })}

          <button
            className={`fan-core${!isCycling && litId === "filming" ? " pulse-ready" : ""}`}
            type="button"
            onClick={selectHome}
            aria-label="Return to the Vision8 homepage"
          >
            <span className="fan-core-ring fan-core-ring-pulse" aria-hidden="true" />
            <span className="fan-core-ring fan-core-ring-static" aria-hidden="true" />
            <Image src={LOGO} alt="Vision8" width={1976} height={704} priority unoptimized />
          </button>
        </div>

        <div className="stage-copy" key={`copy-${active.id}`} aria-live="polite">
          <p>{active.kicker}</p>
          <h1>{active.headline}</h1>
          <div className="copy-row">
            <span>{active.body}</span>
            {active.id === "real-estate" && (
              <a href={LENSWORKS}>Visit Lensworks <b aria-hidden="true">→</b></a>
            )}
          </div>
        </div>
      </section>

      <button className="editor-toggle" type="button" onClick={openEditor}>Editor</button>

      {editorOpen && (
        <EditorPanel
          records={records}
          styles={styles}
          headerCopy={headerCopy}
          selectedId={editorId}
          uploadNames={uploadNames}
          onClose={() => setEditorOpen(false)}
          onSelect={selectEditorSection}
          onRecordChange={updateRecord}
          onStyleChange={updateStyle}
          onMediaOpacityChange={handleMediaOpacity}
          onHeaderChange={(key, value) => setHeaderCopy((current) => ({ ...current, [key]: value }))}
          onUpload={handleUpload}
          onReset={resetEditor}
        />
      )}

    </main>
  );
}

"use client";

import Image from "next/image";
import type { ChangeEvent, CSSProperties, ElementType } from "react";
import { useEffect, useRef, useState } from "react";

type DivisionId = "home" | "filming" | "photography" | "motion" | "audio" | "websites" | "ai" | "real-estate";
type MediaType = "image" | "video";
type TextStyleKey = "header" | "fan" | "kicker" | "headline" | "body";
type TextTag = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type SupportingTextTag = Exclude<TextTag, "h1">;

type DivisionRecord = {
  id: DivisionId;
  label: string;
  kicker: string;
  headline: string;
  body: string;
  mediaType: MediaType;
  mediaUrl: string;
  href?: string;
  ctaLabel?: string;
  mediaPosition?: string;
  mediaSize?: string;
  mediaMobilePosition?: string;
  mediaMobileSize?: string;
  mediaScale?: number;
  mediaBlur?: number;
  underlineWidth?: number;
  fanOffsetX?: number;
  fanOffsetY?: number;
  fanLineAdjust?: number;
  kickerOffsetX?: number;
  kickerOffsetY?: number;
  headlineOffsetX?: number;
  headlineOffsetY?: number;
  bodyOffsetX?: number;
  bodyOffsetY?: number;
  ctaOffsetX?: number;
  ctaOffsetY?: number;
  kickerTag?: SupportingTextTag;
  headlineTag?: Exclude<TextTag, "p">;
  bodyTag?: SupportingTextTag;
};

type TextControl = {
  scale: number;
  color: string;
  brightness: number;
  fontFamily: string;
};

type EditorStyles = Record<TextStyleKey, TextControl> & {
  mediaOpacity: number;
  mediaFadeMs: number;
  googleFontUrl: string;
  logoScale: number;
  logoX: number;
  logoY: number;
  headerHomeX: number;
  headerHomeY: number;
  headerAboutX: number;
  headerAboutY: number;
  headerMahiX: number;
  headerMahiY: number;
  headerContactX: number;
  headerContactY: number;
};

type GlobalEditorSettings = Pick<
  EditorStyles,
  | "mediaOpacity"
  | "mediaFadeMs"
  | "googleFontUrl"
  | "logoScale"
  | "logoX"
  | "logoY"
  | "headerHomeX"
  | "headerHomeY"
  | "headerAboutX"
  | "headerAboutY"
  | "headerMahiX"
  | "headerMahiY"
  | "headerContactX"
  | "headerContactY"
>;

type HeaderCopy = {
  home: string;
  about: string;
  mahi: string;
  contact: string;
};

const CLOUD = "https://res.cloudinary.com/deyb4o5qz";
const LOGO = `${CLOUD}/image/upload/v1785634240/new_vision8_logo_design_clean_2_whfcvy.png`;
const VIDEO_SITE = "/video";
const PEOPLE = "/about";
const VIDEO_IMAGE = `${CLOUD}/image/upload/f_auto,q_auto,w_1800/v1785665173/Adventuresmart_still_7_kbz7fl.png`;
const BUILD = "v1.11.55";

// Keyed by build on purpose. The persist effect writes every record, mediaUrl
// included, on first visit whether or not the editor was opened, and the load
// effect merges saved records over the defaults. A fixed key therefore pinned
// whatever media existed when a browser first loaded the site, and no later
// deploy could change it. Keying by build means a new build always shows what
// is actually in the source. Editor tuning does not survive a version bump,
// which is correct while defaults are still moving.
const STORAGE_KEY = `vision8-homepage-editor-${BUILD}`;

// Cloudinary delivery transform applied to every still: auto format, auto
// quality, capped at 1800px. Supplied URLs are raw originals, and the PNGs are
// multi-megabyte without this.
const IMG = "f_auto,q_auto,w_1800";

const fanOrder: Exclude<DivisionId, "home">[] = [
  "motion",
  "photography",
  "audio",
  "filming",
  "real-estate",
  "websites",
  "ai",
];

const editorOrder: DivisionId[] = ["home", ...fanOrder];
const fanSequence: Exclude<DivisionId, "home">[] = [...fanOrder, "filming"];

// The division the stage settles on when the fan sequence ends and whenever the
// pointer leaves the fan. Video is the landing state.
const DEFAULT_ID: DivisionId = "filming";

const defaultRecords: Record<DivisionId, DivisionRecord> = {
  home: {
    id: "home",
    label: "Home",
    kicker: "Creative thinking / Hands-on making",
    headline: "Think it through. Make it work.",
    body: "Seven connected divisions, shaped around what the project actually needs.",
    mediaType: "image",
    mediaUrl: VIDEO_IMAGE,
    mediaPosition: "left top",
    mediaSize: "125% auto",
    mediaMobilePosition: "55% top",
    mediaMobileSize: "auto 118%",
    mediaScale: 1,
    mediaBlur: 0,
  },
  motion: {
    id: "motion",
    label: "Motion & Animation",
    kicker: "Motion and animation",
    headline: "Make complex things clear.",
    body: "Motion graphics, animation and explainers.",
    mediaType: "image",
    mediaUrl: `${CLOUD}/image/upload/${IMG}/v1785664543/Screenshot_2026-08-02_at_9.38.08_PM_u9ta1b.png`,
    // Straight to the Motion and Animation panel, not the top of the grid, so
    // this button does what the card's own "Find out more" does.
    href: `${VIDEO_SITE}?service=motion-animation`,
    ctaLabel: "Find out more",
    mediaPosition: "72% center",
    mediaScale: 1.1,
    mediaBlur: 2,
  },
  photography: {
    id: "photography",
    label: "Photography",
    kicker: "Photography",
    headline: "Still work with purpose.",
    body: "People, places, campaigns and events.",
    mediaType: "image",
    mediaUrl: `${CLOUD}/image/upload/${IMG}/v1778472411/Screen_Shot_2019-02-15_at_3.41.50_PM_qxffmz.jpg`,
    href: "/photography",
    ctaLabel: "View photography",
    mediaPosition: "28% center",
    mediaScale: 1.08,
    mediaBlur: 2,
  },
  audio: {
    id: "audio",
    label: "Audio",
    kicker: "Music composition & audio engineering",
    headline: "From first note to final master.",
    body: "Professional musicians, sound design, audio mixing and mastering.",
    mediaType: "image",
    mediaUrl: `${CLOUD}/image/upload/${IMG}/v1785722851/mixer_rtl9gg.jpg`,
    href: "/audio",
    ctaLabel: "Find out more",
    mediaPosition: "50% 58%",
    mediaScale: 1.04,
    mediaBlur: 1.5,
  },
  filming: {
    id: "filming",
    label: "Video",
    kicker: "Video",
    headline: "Ideas through to delivery.",
    body: "Concept, production, filming, editing and delivery.",
    mediaType: "image",
    mediaUrl: VIDEO_IMAGE,
    href: VIDEO_SITE,
    ctaLabel: "Find out more",
    mediaPosition: "left top",
    mediaSize: "125% auto",
    mediaMobilePosition: "55% top",
    mediaMobileSize: "auto 118%",
    mediaScale: 1,
    mediaBlur: 0,
  },
  "real-estate": {
    id: "real-estate",
    label: "Real Estate Media",
    kicker: "Real estate media",
    headline: "Property stories, ready to move.",
    body: "Photography and video for property marketing.",
    mediaType: "image",
    mediaUrl: `${CLOUD}/image/upload/${IMG}/v1785656289/Real_estate_shot_rrts1z.jpg`,
    href: "/real-estate-media",
    ctaLabel: "Explore real estate media",
    mediaPosition: "72% center",
    mediaScale: 1.1,
    mediaBlur: 2,
  },
  websites: {
    id: "websites",
    label: "Websites",
    kicker: "Websites",
    headline: "Useful digital experiences.",
    body: "Structure, design and practical website builds.",
    mediaType: "image",
    mediaUrl: `${CLOUD}/image/upload/${IMG}/v1785737246/websites_2_pic_hysw74.png`,
    href: "/websites",
    ctaLabel: "View website work",
    mediaPosition: "center",
    mediaScale: 1,
    mediaBlur: 2,
  },
  ai: {
    id: "ai",
    label: "Tech Solutions",
    kicker: "Tech solutions",
    headline: "Useful tools, built for the job.",
    body: "Useful AI tools, custom apps and focused automation.",
    mediaType: "image",
    mediaUrl: `${CLOUD}/image/upload/${IMG}/v1785737528/AI_Solutions2_d892np.png`,
    href: "/ai-solutions",
    ctaLabel: "Explore AI solutions",
    mediaPosition: "center",
    mediaScale: 1,
    mediaBlur: 2,
  },
};

const defaultHeaderCopy: HeaderCopy = {
  home: "Home",
  about: "About us",
  mahi: "Our mahi",
  contact: "Contact",
};

const defaultFont = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const defaultStyles: EditorStyles = {
  /* Scale 100 puts the homepage nav at 1.15rem, the same size the Vision8 pages use. */
  header: { scale: 100, color: "#f3f4ef", brightness: 100, fontFamily: defaultFont },
  fan: { scale: 100, color: "#f3f4ef", brightness: 70, fontFamily: defaultFont },
  kicker: { scale: 100, color: "#0bb7a3", brightness: 100, fontFamily: defaultFont },
  headline: { scale: 100, color: "#f3f4ef", brightness: 100, fontFamily: defaultFont },
  body: { scale: 100, color: "#f3f4ef", brightness: 74, fontFamily: defaultFont },
  mediaOpacity: 55,
  mediaFadeMs: 900,
  googleFontUrl: "",
  logoScale: 100,
  logoX: 0,
  logoY: 0,
  headerHomeX: 0,
  headerHomeY: 0,
  headerAboutX: 0,
  headerAboutY: 0,
  headerMahiX: 0,
  headerMahiY: 0,
  headerContactX: 0,
  headerContactY: 0,
};

const fontOptions = [
  { label: "Helvetica Neue", value: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { label: "Avenir Next", value: '"Avenir Next", Avenir, sans-serif' },
  { label: "Futura", value: 'Futura, "Trebuchet MS", sans-serif' },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: 'Georgia, "Times New Roman", serif' },
  { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
  { label: "Courier New", value: '"Courier New", Courier, monospace' },
  { label: "Inter", value: "Inter, Arial, sans-serif" },
  { label: "Roboto", value: "Roboto, Arial, sans-serif" },
  { label: "Montserrat", value: "Montserrat, Arial, sans-serif" },
] as const;

const supportingTagOptions: Array<{ value: SupportingTextTag; label: string }> = [
  { value: "p", label: "Paragraph" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
];

const headlineTagOptions: Array<{ value: Exclude<TextTag, "p">; label: string }> = [
  { value: "h1", label: "H1, primary page heading" },
  { value: "h2", label: "H2" },
  { value: "h3", label: "H3" },
  { value: "h4", label: "H4" },
  { value: "h5", label: "H5" },
  { value: "h6", label: "H6" },
];

const styleLabels: Array<{ key: TextStyleKey; label: string }> = [
  { key: "header", label: "Top menu" },
  { key: "fan", label: "Fan links" },
  { key: "kicker", label: "Teal section labels" },
  { key: "headline", label: "Large headlines" },
  { key: "body", label: "Explainer text" },
];

const fanGeometry: Record<Exclude<DivisionId, "home">, { angle: number; length: number }> = {
  motion: { angle: -69, length: 300 },
  photography: { angle: -46, length: 330 },
  audio: { angle: -23, length: 355 },
  filming: { angle: 0, length: 370 },
  "real-estate": { angle: 23, length: 355 },
  websites: { angle: 46, length: 330 },
  ai: { angle: 69, length: 300 },
};

type OffsetKey = "kicker" | "headline" | "body";

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function fanBranchStyle(id: Exclude<DivisionId, "home">, record: DivisionRecord) {
  const base = fanGeometry[id];
  const radians = base.angle * (Math.PI / 180);
  const targetX = (-base.length * Math.sin(radians)) + (record.fanOffsetX ?? 0);
  const targetY = (-base.length * Math.cos(radians)) + (record.fanOffsetY ?? 0);
  const targetLength = Math.hypot(targetX, targetY);
  const targetAngle = Math.atan2(-targetX, -targetY) * (180 / Math.PI);

  return {
    "--angle": `${targetAngle.toFixed(3)}deg`,
    "--counter-angle": `${(-targetAngle).toFixed(3)}deg`,
    "--branch-length-offset": `${(targetLength - base.length).toFixed(2)}px`,
    "--fan-line-adjust": `${record.fanLineAdjust ?? 0}px`,
    "--underline-width": `${record.underlineWidth ?? 42}px`,
  } as CSSProperties;
}

function textOffsetStyle(record: DivisionRecord, key: OffsetKey) {
  return {
    "--offset-x": `${record[`${key}OffsetX` as keyof DivisionRecord] ?? 0}px`,
    "--offset-y": `${record[`${key}OffsetY` as keyof DivisionRecord] ?? 0}px`,
  } as CSSProperties;
}

function headerPosition(styles: EditorStyles, key: keyof HeaderCopy) {
  const values = {
    home: { x: styles.headerHomeX, y: styles.headerHomeY },
    about: { x: styles.headerAboutX, y: styles.headerAboutY },
    mahi: { x: styles.headerMahiX, y: styles.headerMahiY },
    contact: { x: styles.headerContactX, y: styles.headerContactY },
  };
  return values[key];
}

function headerPositionPatch(key: keyof HeaderCopy, x: number, y: number): Partial<GlobalEditorSettings> {
  if (key === "home") return { headerHomeX: x, headerHomeY: y };
  if (key === "about") return { headerAboutX: x, headerAboutY: y };
  if (key === "mahi") return { headerMahiX: x, headerMahiY: y };
  return { headerContactX: x, headerContactY: y };
}

function headerItemStyle(styles: EditorStyles, key: keyof HeaderCopy) {
  const position = headerPosition(styles, key);
  return {
    "--offset-x": `${position.x}px`,
    "--offset-y": `${position.y}px`,
  } as CSSProperties;
}

function NudgeControl({
  label,
  x,
  y,
  onChange,
}: {
  label: string;
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
}) {
  return (
    <fieldset className="nudge-control">
      <legend>{label}</legend>
      <div className="nudge-values">
        <label>
          X
          <input type="number" step="1" value={x} onChange={(event) => onChange(Number(event.target.value), y)} />
        </label>
        <label>
          Y
          <input type="number" step="1" value={y} onChange={(event) => onChange(x, Number(event.target.value))} />
        </label>
      </div>
    </fieldset>
  );
}

function FontChoiceControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const known = fontOptions.find((option) => option.value === value);
  const selectValue = known?.value ?? "__custom";

  return (
    <>
      <label>
        Current font
        <select
          value={selectValue}
          aria-label={`${label} font`}
          onChange={(event) => {
            const next = event.target.value;
            onChange(next === "__custom" ? "" : next);
          }}
        >
          {fontOptions.map((option) => (
            <option key={option.label} value={option.value}>{option.label}</option>
          ))}
          <option value="__custom">Custom or Google font</option>
        </select>
      </label>
      {selectValue === "__custom" && (
        <label>
          Custom font name
          <input
            value={value}
            placeholder="For example: Oswald"
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
      )}
      <p className="font-current">Using: {known?.label ?? (value || "Helvetica Neue")}</p>
    </>
  );
}

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
      className={`stage-media-layer stage-image stage-${record.id} has-image${activeClass}`}
      style={{
        /*
          The image is applied by homepage-v1.10.3.css from these variables, not
          inline, so the 720px media query can swap in the lighter rendition.
          Inline background-image would beat any stylesheet override.
        */
        "--media-url": `url(${record.mediaUrl})`,
        "--media-url-mobile": `url(${record.mediaUrl.replace("w_1800", "w_800")})`,
        "--media-position": record.mediaPosition ?? "center",
        "--media-size": record.mediaSize ?? "cover",
        "--media-mobile-position": record.mediaMobilePosition ?? record.mediaPosition ?? "center",
        "--media-mobile-size": record.mediaMobileSize ?? record.mediaSize ?? "cover",
        "--media-scale": `${record.mediaScale ?? 1}`,
        "--media-blur": `${record.mediaBlur ?? 0}px`,
      } as CSSProperties}
      aria-hidden="true"
    />
  );
}

function Header({
  copy,
  styles,
  onHome,
}: {
  copy: HeaderCopy;
  styles: EditorStyles;
  onHome: () => void;
}) {
  return (
    <header className="site-header">
      <button className="header-brand" type="button" onClick={onHome} aria-label="Vision8 home">
        <Image src={LOGO} alt="Vision8" width={1976} height={704} priority unoptimized />
      </button>
      {/* v1.11.49: the same lockup the inner pages carry for their division
          (`.portfolio-division`), naming the whole company on the homepage. */}
      <span className="header-division">Creative media</span>
      <nav className="header-left" aria-label="Homepage navigation">
        <button className="editable-header-item" style={headerItemStyle(styles, "home")} type="button" onClick={onHome}>{copy.home}</button>
        <a className="editable-header-item" style={headerItemStyle(styles, "about")} href={PEOPLE}>{copy.about}</a>
        <a className="editable-header-item" style={headerItemStyle(styles, "mahi")} href={VIDEO_SITE}>{copy.mahi}</a>
      </nav>

      <nav className="header-right" aria-label="Contact navigation">
        <a className="editable-header-item" style={headerItemStyle(styles, "contact")} href="mailto:info@vision8.co.nz">{copy.contact}</a>
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
  onSettingsChange,
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
  onSettingsChange: (patch: Partial<GlobalEditorSettings>) => void;
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
          <>
            <label>
              Fan label
              <input value={record.label} onChange={(event) => onRecordChange(selectedId, { label: event.target.value })} />
            </label>
            <label>
              Green underline length
              <span className="range-row">
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="1"
                  value={record.underlineWidth ?? 42}
                  onChange={(event) => onRecordChange(selectedId, { underlineWidth: Number(event.target.value) })}
                />
                <output>{record.underlineWidth ?? 42}px</output>
              </span>
            </label>
            <NudgeControl
              label="Fan label and connected line"
              x={record.fanOffsetX ?? 0}
              y={record.fanOffsetY ?? 0}
              onChange={(x, y) => onRecordChange(selectedId, {
                fanOffsetX: clamp(x, -160, 160),
                fanOffsetY: clamp(y, -160, 160),
              })}
            />
            <label>
              Line proximity to label
              <span className="range-row">
                <input
                  type="range"
                  min="-18"
                  max="30"
                  step="1"
                  value={record.fanLineAdjust ?? 0}
                  onChange={(event) => onRecordChange(selectedId, { fanLineAdjust: Number(event.target.value) })}
                />
                <output>{record.fanLineAdjust ?? 0}px</output>
              </span>
            </label>
          </>
        )}

        <label>
          Teal section label
          <input value={record.kicker} onChange={(event) => onRecordChange(selectedId, { kicker: event.target.value })} />
        </label>
        <label>
          Semantic type
          <select
            value={record.kickerTag ?? "p"}
            onChange={(event) => onRecordChange(selectedId, { kickerTag: event.target.value as SupportingTextTag })}
          >
            {supportingTagOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <NudgeControl
          label="Teal section label"
          x={record.kickerOffsetX ?? 0}
          y={record.kickerOffsetY ?? 0}
          onChange={(x, y) => onRecordChange(selectedId, {
            kickerOffsetX: clamp(x, -400, 400),
            kickerOffsetY: clamp(y, -300, 300),
          })}
        />

        <label>
          Large headline
          <textarea rows={2} value={record.headline} onChange={(event) => onRecordChange(selectedId, { headline: event.target.value })} />
        </label>
        <label>
          Heading number
          <select
            value={record.headlineTag ?? "h1"}
            onChange={(event) => onRecordChange(selectedId, { headlineTag: event.target.value as Exclude<TextTag, "p"> })}
          >
            {headlineTagOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <NudgeControl
          label="Large headline"
          x={record.headlineOffsetX ?? 0}
          y={record.headlineOffsetY ?? 0}
          onChange={(x, y) => onRecordChange(selectedId, {
            headlineOffsetX: clamp(x, -400, 400),
            headlineOffsetY: clamp(y, -300, 300),
          })}
        />

        <label>
          Explainer text
          <textarea rows={2} value={record.body} onChange={(event) => onRecordChange(selectedId, { body: event.target.value })} />
        </label>
        <label>
          Semantic type
          <select
            value={record.bodyTag ?? "p"}
            onChange={(event) => onRecordChange(selectedId, { bodyTag: event.target.value as SupportingTextTag })}
          >
            {supportingTagOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <NudgeControl
          label="Explainer text"
          x={record.bodyOffsetX ?? 0}
          y={record.bodyOffsetY ?? 0}
          onChange={(x, y) => onRecordChange(selectedId, {
            bodyOffsetX: clamp(x, -400, 400),
            bodyOffsetY: clamp(y, -300, 300),
          })}
        />
        {record.href && (
          <NudgeControl
            label="Find out more link"
            x={record.ctaOffsetX ?? 0}
            y={record.ctaOffsetY ?? 0}
            onChange={(x, y) => onRecordChange(selectedId, {
              ctaOffsetX: clamp(x, -400, 400),
              ctaOffsetY: clamp(y, -300, 300),
            })}
          />
        )}
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
        <label>
          Dissolve speed for all media
          <span className="range-row">
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={styles.mediaFadeMs}
              onChange={(event) => onSettingsChange({ mediaFadeMs: Number(event.target.value) })}
            />
            <output>{(styles.mediaFadeMs / 1000).toFixed(1)}s</output>
          </span>
        </label>
        <p className="editor-note">This one setting controls the first Video reveal and every later image or video dissolve.</p>
        <p className="editor-note">URLs are saved in this browser. Uploaded files are previewed for this session only.</p>
      </section>

      <section className="editor-section">
        <h3>Top menu</h3>
        {(Object.keys(headerCopy) as Array<keyof HeaderCopy>).map((key) => {
          const position = headerPosition(styles, key);
          return (
            <div key={key} className="header-editor-item">
              <label>
                {key === "mahi" ? "Our mahi" : key}
                <input value={headerCopy[key]} onChange={(event) => onHeaderChange(key, event.target.value)} />
              </label>
              <NudgeControl
                label={`${headerCopy[key]} menu item`}
                x={position.x}
                y={position.y}
                onChange={(x, y) => onSettingsChange(headerPositionPatch(
                  key,
                  clamp(x, -300, 300),
                  clamp(y, -80, 80),
                ))}
              />
            </div>
          );
        })}
        <p className="editor-note">Menu items and fan links remain navigation controls, not headings. Their semantic role stays correct for accessibility and SEO.</p>
      </section>

      <section className="editor-section">
        <h3>Central logo</h3>
        <label>
          Logo size
          <span className="range-row">
            <input
              type="range"
              min="40"
              max="200"
              step="1"
              value={styles.logoScale}
              onChange={(event) => onSettingsChange({ logoScale: Number(event.target.value) })}
            />
            <output>{styles.logoScale}%</output>
          </span>
        </label>
        <NudgeControl
          label="Central logo"
          x={styles.logoX}
          y={styles.logoY}
          onChange={(x, y) => onSettingsChange({
            logoX: clamp(x, -300, 300),
            logoY: clamp(y, -200, 200),
          })}
        />
        <p className="editor-note">This moves and resizes the logo only. The fan apex and teal rings stay fixed.</p>
      </section>

      <section className="editor-section">
        <h3>Optional Google font</h3>
        <label>
          Google Fonts stylesheet URL
          <input
            type="url"
            placeholder="https://fonts.googleapis.com/css2?family=..."
            value={styles.googleFontUrl}
            onChange={(event) => onSettingsChange({ googleFontUrl: event.target.value })}
          />
        </label>
        <p className="editor-note">Only use this when choosing a Google font. Paste the URL supplied by Google Fonts, then choose Custom or Google font below and enter its simple name.</p>
      </section>

      <section className="editor-section">
        <h3>Text appearance</h3>
        {styleLabels.map(({ key, label }) => (
          <fieldset key={key} className="style-control">
            <legend>{label}</legend>
            <FontChoiceControl
              label={label}
              value={styles[key].fontFamily}
              onChange={(fontFamily) => onStyleChange(key, { fontFamily })}
            />
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
        <p className="editor-note">For best SEO, leave the main headline as H1. Use H2 to H6 only when the line is genuinely a lower-level heading. Heading number and visual size are separate controls.</p>
      </section>

      <div className="editor-actions">
        <button type="button" onClick={onReset}>Reset local changes</button>
        <button type="button" className="editor-done" onClick={onClose}>Done</button>
      </div>
    </aside>
  );
}

/*
  `editable` is off everywhere except the /editor route. It gates three things,
  not one: the toggle, the panel, and the localStorage read and write.

  The read matters most. This component merged saved tuning over the defaults on
  every visit, so the owner's own browser rendered a different homepage from the
  one the public got, with no way to tell which was which. The public page now
  renders what is in the source, full stop.
*/
export function HomepageV1103({
  skipIntro = false,
  editable = false,
}: { skipIntro?: boolean; editable?: boolean } = {}) {
  const [records, setRecords] = useState(defaultRecords);
  const [headerCopy, setHeaderCopy] = useState(defaultHeaderCopy);
  const [styles, setStyles] = useState(defaultStyles);
  const [activeId, setActiveId] = useState<DivisionId>("home");
  const [litId, setLitId] = useState<DivisionId>("home");
  // Seeded from the server so the intro is skipped in the very first render.
  // Reading the query here on the client instead mismatched hydration and was
  // silently dropped.
  const [skipped, setSkipped] = useState(skipIntro);
  // Hover previews belong to pointers that can hover. On touch, iOS Safari
  // fires the simulated mouseenter on the first tap; the preview then mutates
  // the stage, and Safari treats the tap as hover and swallows the click, so
  // every fan link needed two taps and read as dead. False until measured on
  // mount; the opening sequence holds hover inert for longer than that anyway.
  const [hoverable, setHoverable] = useState(false);
  const [cycleCancelled, setCycleCancelled] = useState(false);
  const [isCycling, setIsCycling] = useState(true);
  const [openingMediaDone, setOpeningMediaDone] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorId, setEditorId] = useState<DivisionId>("filming");
  const [uploadNames, setUploadNames] = useState<Partial<Record<DivisionId, string>>>({});
  const [loaded, setLoaded] = useState(false);
  // True only after the user changes something through the editor. The persist
  // effect used to write every record unprompted on first visit, so whatever
  // defaults were in memory at that moment, including mid-HMR stale ones, got
  // pinned into localStorage and masked later deploys. Nothing is written until
  // the user actually edits.
  const dirty = useRef(false);
  const blobUrls = useRef<string[]>([]);
  const active = records[activeId];
  const KickerTag = (active.kickerTag ?? "p") as ElementType;
  const HeadlineTag = (active.headlineTag ?? "h1") as ElementType;
  const BodyTag = (active.bodyTag ?? "p") as ElementType;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      // Saved tuning belongs to the editor route. `loaded` still has to be set:
      // it gates the persist effect below, and leaving it false would strand it.
      if (!editable) {
        setLoaded(true);
        return;
      }

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
  }, [editable]);

  useEffect(() => {
    if (!editable || !loaded || !dirty.current) return;
    const persistedRecords = { ...records };
    editorOrder.forEach((id) => {
      if (persistedRecords[id].mediaUrl.startsWith("blob:")) {
        persistedRecords[id] = { ...persistedRecords[id], mediaUrl: defaultRecords[id].mediaUrl };
      }
    });
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ records: persistedRecords, styles, headerCopy }));
  }, [records, styles, headerCopy, loaded, editable]);

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
    const stepTime = 140;
    const finalStepTime = startDelay + ((fanSequence.length - 1) * stepTime);
    const timers = fanSequence.map((id, index) => window.setTimeout(() => {
      setLitId(id);
    }, startDelay + (index * stepTime)));
    const revealTimer = window.setTimeout(() => {
      setActiveId("filming");
      setLitId("filming");
      setIsCycling(false);
    }, finalStepTime + stepTime);

    return () => [...timers, revealTimer].forEach((timer) => window.clearTimeout(timer));
  }, [cycleCancelled, skipped]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOpeningMediaDone(true);
      return;
    }

    const fadeDelay = skipped ? 0 : 3250;
    const timer = window.setTimeout(() => setOpeningMediaDone(true), fadeDelay + 3000);
    return () => window.clearTimeout(timer);
  }, [skipped]);

  useEffect(() => {
    const elementId = "vision8-editor-google-font";
    const existing = document.getElementById(elementId) as HTMLLinkElement | null;
    const fontUrl = styles.googleFontUrl.trim();

    if (!fontUrl.startsWith("https://fonts.googleapis.com/")) {
      existing?.remove();
      return;
    }

    const link = existing ?? document.createElement("link");
    link.id = elementId;
    link.rel = "stylesheet";
    link.href = fontUrl;
    if (!existing) document.head.appendChild(link);
  }, [styles.googleFontUrl]);

  useEffect(() => () => blobUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  useEffect(() => {
    // Deferred like the editor load effect above: setState directly inside an
    // effect trips react-hooks/set-state-in-effect.
    const timer = window.setTimeout(() => {
      setHoverable(window.matchMedia("(hover: hover)").matches);
    }, 0);
    // Session cookie, read server-side in app/page.tsx, same server-resolved
    // pattern as ?skipintro. The intro plays once per browser session; every
    // later homepage load lands straight on the fan.
    document.cookie = "v8-intro-seen=1; path=/; SameSite=Lax";
    return () => window.clearTimeout(timer);
  }, []);

  const styleVars = {
    "--editor-header-size": `${1.15 * (styles.header.scale / 100)}rem`,
    "--editor-header-color": colorWithBrightness(styles.header.color, styles.header.brightness),
    "--editor-header-font": styles.header.fontFamily || defaultFont,
    /*
      v1.11.40: the fan label bases are the v1.11.39 values times 1.25, on the
      client's mark that the fan and its text read 25 percent larger. They are
      baked into the bases rather than the editor's scale so 100 percent in the
      panel still means the shipped default. The matching geometry uplift is
      --fan-scale in homepage-v1.10.3.css; change the two together.
    */
    /*
      The floor stays at the v1.11.39 value. clamp()'s minimum beats the vh
      guard, so scaling it too reintroduced the uplift on exactly the screens
      the guard exists to protect: short laptops, where it put the Video and
      Real Estate labels back together at 1280x660. Only the vw term and the
      ceiling carry the 25 percent.
    */
    "--editor-fan-min": `${0.72 * (styles.fan.scale / 100)}rem`,
    "--editor-fan-vw": `${1.3125 * (styles.fan.scale / 100)}vw`,
    /*
      The height guard on the label type. The arms are capped by viewport
      height, so on a short laptop they barely grow; without a matching cap the
      type outgrows the geometry and the Video and Real Estate labels touch at
      1366x768. Measured: 14.6px at 768 tall, 17.1px at 900, the full 18.8px at
      1050 and above. Scaled with the editor's control so the panel still works.
    */
    "--editor-fan-vh": `${1.9 * (styles.fan.scale / 100)}vh`,
    /*
      The floor under the guard: the v1.11.39 vw term. A wide, short window
      (1280x660) has a viewport ratio past 1.81, where 1.9vh falls below the
      old 1.05vw and the guard would shrink the labels rather than hold them.
      Scaled with the control like every other term, so the panel still owns
      the final size.
    */
    "--editor-fan-floor": `${1.05 * (styles.fan.scale / 100)}vw`,
    "--editor-fan-max": `${1.175 * (styles.fan.scale / 100)}rem`,
    "--editor-fan-color": colorWithBrightness(styles.fan.color, styles.fan.brightness),
    "--editor-fan-font": styles.fan.fontFamily || defaultFont,
    "--editor-kicker-size": `${0.66 * (styles.kicker.scale / 100)}rem`,
    "--editor-photo-kicker-size": `${1.32 * (styles.kicker.scale / 100)}rem`,
    "--editor-kicker-color": colorWithBrightness(styles.kicker.color, styles.kicker.brightness),
    "--editor-kicker-font": styles.kicker.fontFamily || defaultFont,
    "--editor-headline-min": `${2 * (styles.headline.scale / 100)}rem`,
    "--editor-headline-vw": `${3.6 * (styles.headline.scale / 100)}vw`,
    "--editor-headline-max": `${3.65 * (styles.headline.scale / 100)}rem`,
    "--editor-headline-color": colorWithBrightness(styles.headline.color, styles.headline.brightness),
    "--editor-headline-font": styles.headline.fontFamily || defaultFont,
    "--editor-body-min": `${0.84 * (styles.body.scale / 100)}rem`,
    "--editor-body-vw": `${1.1 * (styles.body.scale / 100)}vw`,
    "--editor-body-max": `${1 * (styles.body.scale / 100)}rem`,
    "--editor-photo-body-min": `${1.01 * (styles.body.scale / 100)}rem`,
    "--editor-photo-body-vw": `${1.32 * (styles.body.scale / 100)}vw`,
    "--editor-photo-body-max": `${1.2 * (styles.body.scale / 100)}rem`,
    "--editor-body-color": colorWithBrightness(styles.body.color, styles.body.brightness),
    "--editor-body-font": styles.body.fontFamily || defaultFont,
    "--editor-media-opacity": `${styles.mediaOpacity / 100}`,
    "--editor-media-fade": `${styles.mediaFadeMs}ms`,
    "--editor-logo-scale": `${styles.logoScale / 100}`,
    "--editor-logo-x": `${styles.logoX}px`,
    "--editor-logo-y": `${styles.logoY}px`,
  } as CSSProperties;

  function cancelCycle() {
    setCycleCancelled(true);
    setIsCycling(false);
    setOpeningMediaDone(true);
  }

  function activate(id: DivisionId) {
    cancelCycle();
    setActiveId(id);
    setLitId(id);
  }

  function returnToDefault() {
    if (isCycling) return;
    setActiveId(DEFAULT_ID);
    setLitId(DEFAULT_ID);
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
    dirty.current = true;
    setRecords((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  }

  function updateStyle(key: TextStyleKey, patch: Partial<TextControl>) {
    dirty.current = true;
    setStyles((current) => ({ ...current, [key]: { ...current[key], ...patch } }));
  }

  function handleMediaOpacity(value: number) {
    dirty.current = true;
    setStyles((current) => ({ ...current, mediaOpacity: value }));
  }

  function updateSettings(patch: Partial<GlobalEditorSettings>) {
    dirty.current = true;
    setStyles((current) => ({ ...current, ...patch }));
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
    dirty.current = false;
    setRecords(defaultRecords);
    setHeaderCopy(defaultHeaderCopy);
    setStyles(defaultStyles);
    setUploadNames({});
    setEditorId("filming");
    activate("filming");
  }

  return (
    <main className="v1103-shell" style={styleVars}>
      <LogoIntro skipped={skipped} onSkip={() => setSkipped(true)} />
      <Header copy={headerCopy} styles={styles} onHome={selectHome} />

      <section className={`home-stage active-${active.id}${isCycling ? " fan-cycle" : ""}${!openingMediaDone ? " opening-media-fade" : ""}${skipped ? " intro-was-skipped" : ""}`}>
        <div className="stage-media-stack" aria-hidden="true">
          {editorOrder.map((id) => (
            <StageMedia key={id} record={records[id]} active={(isCycling ? "filming" : activeId) === id} />
          ))}
        </div>
        <div className="stage-wash" aria-hidden="true" />

        <div className="fan" aria-label="Vision8 divisions" onMouseLeave={hoverable ? returnToDefault : undefined}>
          {fanOrder.map((id) => {
            const division = records[id];
            const lineClass = litId === id ? " line-active" : "";
            const nodeClass = `fan-node${!isCycling && activeId === id ? " active" : ""}`;

            return (
              <div
                key={id}
                className={`fan-branch branch-${id}${lineClass}`}
                style={fanBranchStyle(id, division)}
              >
                <span className="fan-line" aria-hidden="true" />
                {/*
                  A link, not a button. Hovering still selects the division and
                  swaps the stage behind it, but the label itself was inert on
                  click, so the only way through to a division was the small CTA
                  in the stage copy.

                  The hover preview is attached only on hover-capable pointers.
                  onFocus stays for keyboards: focus fires after Safari's tap
                  heuristic has already decided, so it cannot eat the click.
                */}
                <a
                  className={nodeClass}
                  href={division.href}
                  onMouseEnter={hoverable ? () => activate(id) : undefined}
                  onFocus={() => activate(id)}
                >
                  <span>{division.label}</span>
                </a>
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
            {/* v1.11.50: the line under the logo ("Where the idea becomes
                real.", v1.11.48 to v1.11.49) is gone on the client's mark; the
                client may use the words elsewhere later. The header lockup
                keeps "Creative media". */}
          </button>
        </div>

        <div className="stage-copy" key={`copy-${active.id}`} aria-live="polite">
          <KickerTag className="stage-kicker editable-offset" style={textOffsetStyle(active, "kicker")}>{active.kicker}</KickerTag>
          <HeadlineTag className="stage-headline editable-offset" style={textOffsetStyle(active, "headline")}>{active.headline}</HeadlineTag>
          <div className="copy-row">
            <BodyTag className="stage-body editable-offset" style={textOffsetStyle(active, "body")}>{active.body}</BodyTag>
            {active.href && (
              <a
                className="editable-cta"
                style={{
                  "--offset-x": `${active.ctaOffsetX ?? 0}px`,
                  "--offset-y": `${active.ctaOffsetY ?? 0}px`,
                } as CSSProperties}
                href={active.href}
              >
                {active.ctaLabel ?? "Find out more"} <b aria-hidden="true">→</b>
              </a>
            )}
          </div>
        </div>
      </section>

      <p className="build-stamp">Build {BUILD}</p>

      {editable && (
        <button className="editor-toggle" type="button" onClick={openEditor}>Editor</button>
      )}

      {editable && editorOpen && (
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
          onSettingsChange={updateSettings}
          onHeaderChange={(key, value) => {
            dirty.current = true;
            setHeaderCopy((current) => ({ ...current, [key]: value }));
          }}
          onUpload={handleUpload}
          onReset={resetEditor}
        />
      )}

    </main>
  );
}

/*
  v1.11.85: the Real Estate page's editable layout state, starting with one
  thing: vertical padding per section. The shape follows the photography
  editor's data module: a typed state, a merge that accepts unknown JSON and
  can only produce a renderable state, and defaults meaning "the stylesheet
  decides". Copy and media controls are expected to join this file later,
  which is why it is padding.ts holding a state object rather than a bare map.
*/

// The nine sections in page order. Keys are stable identifiers written into
// data-pad attributes on the page and into published JSON; labels are what
// the editor panel shows. Renaming a key orphans it in published layouts, so
// do not.
export const PAD_SECTIONS = [
  { key: "statement", label: "Opening quote" },
  { key: "people", label: "People" },
  { key: "photography", label: "Photography" },
  { key: "experience", label: "Experience" },
  { key: "drone", label: "Drone" },
  { key: "walkthroughs", label: "360° virtual tours" },
  { key: "plans", label: "Floor plans" },
  { key: "delivery", label: "Delivery" },
  { key: "closing", label: "Closing" },
] as const;

export type PadKey = (typeof PAD_SECTIONS)[number]["key"];

// A number is padding-block in px; an absent key means the stylesheet's own
// clamp() stands. That distinction is the point: "default" survives a
// viewport change, a pinned number does not resize.
export type REPadState = {
  pad: Partial<Record<PadKey, number>>;
};

export const PAD_MAX = 200;

export const defaultPadState: REPadState = { pad: {} };

const padKeys = new Set<string>(PAD_SECTIONS.map((s) => s.key));

// Accepts anything (saved draft, published KV JSON, hand-edited JSON) and
// returns a state that can only render: known keys, integers, 0 to PAD_MAX.
export function mergeSavedPad(saved: unknown): REPadState {
  if (!saved || typeof saved !== "object") return defaultPadState;
  const pad: REPadState["pad"] = {};
  const source = (saved as Partial<REPadState>).pad;
  if (source && typeof source === "object") {
    for (const [key, value] of Object.entries(source)) {
      if (!padKeys.has(key) || typeof value !== "number" || !Number.isFinite(value)) continue;
      pad[key as PadKey] = Math.round(Math.min(PAD_MAX, Math.max(0, value)));
    }
  }
  return { pad };
}

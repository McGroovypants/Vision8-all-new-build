"use client";

/*
  v1.11.85: the Real Estate editor panel, /real-estate-media/editor only.
  One concern so far: vertical padding per section. The page itself is the
  same server-rendered markup as the public route; this panel writes inline
  padding-block onto the [data-pad] sections, which beats the stylesheet and
  the server-rendered published values by specificity, so the draft is always
  what the eye sees.

  The persistence discipline is the photography editor's, exactly: a local
  draft in build-keyed localStorage, written only after the user changes
  something (the dirty ref); Publish to live puts the JSON in Worker KV
  behind the same publish key the photography editor uses, and the public
  page renders it server-side with no rebuild.
*/

import { useEffect, useRef, useState } from "react";
import { BUILD } from "../portfolio-shell";
import {
  PAD_MAX,
  PAD_SECTIONS,
  defaultPadState,
  mergeSavedPad,
  type PadKey,
  type REPadState,
} from "./padding";

const STORAGE_KEY = `vision8-re-editor-${BUILD}`;
// Deliberately the photography editor's key name: it is the same Worker
// secret answering both publish endpoints, and the client should not have to
// paste one value twice under two names.
const PUBLISH_KEY_STORAGE = "vision8-photo-publish-key";

function readSaved(): REPadState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return mergeSavedPad(JSON.parse(raw));
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function PaddingEditor({ published }: { published: REPadState | null }) {
  const [state, setState] = useState<REPadState>(published ?? defaultPadState);
  const [loaded, setLoaded] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [publishKey, setPublishKey] = useState("");
  const [liveStatus, setLiveStatus] = useState<"unknown" | "published" | "defaults">("unknown");
  const [publishMsg, setPublishMsg] = useState("");
  const dirty = useRef(false);

  // Same zero-timeout deferral as the photography editor's load effect.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = readSaved();
      if (saved) setState(saved);
      setPublishKey(window.localStorage.getItem(PUBLISH_KEY_STORAGE) ?? "");
      fetch("/real-estate-media/layout.json", { cache: "no-store" })
        .then((response) => setLiveStatus(response.ok ? "published" : "defaults"))
        .catch(() => setLiveStatus("unknown"));
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded || !dirty.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [loaded, state]);

  // The draft made visible: inline padding on the sections, cleared back to
  // the stylesheet's clamp() when a section returns to default.
  useEffect(() => {
    if (!loaded) return;
    document.querySelectorAll<HTMLElement>("[data-pad]").forEach((el) => {
      const key = el.dataset.pad as PadKey;
      const value = state.pad[key];
      el.style.paddingBlock = value != null ? `${value}px` : "";
    });
  }, [loaded, state]);

  const setPad = (key: PadKey, value: number | null) => {
    dirty.current = true;
    setState((current) => {
      const pad = { ...current.pad };
      if (value == null) delete pad[key];
      else pad[key] = value;
      return { pad };
    });
  };

  const savePublishKey = (value: string) => {
    setPublishKey(value);
    window.localStorage.setItem(PUBLISH_KEY_STORAGE, value);
  };

  const publish = () => {
    setPublishMsg("Publishing…");
    fetch("/real-estate-media/publish", {
      method: "POST",
      headers: { authorization: `Bearer ${publishKey}`, "content-type": "application/json" },
      body: JSON.stringify(state),
    })
      .then((response) => {
        if (response.status === 204) {
          setLiveStatus("published");
          setPublishMsg("Published. The live page now uses this spacing.");
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
    fetch("/real-estate-media/publish", {
      method: "DELETE",
      headers: { authorization: `Bearer ${publishKey}` },
    })
      .then((response) => {
        if (response.status === 204) {
          setLiveStatus("defaults");
          setPublishMsg("Live page reverted to the built-in spacing.");
        } else if (response.status === 401) {
          setPublishMsg("Publish key rejected. Check the key and try again.");
        } else {
          setPublishMsg(`Revert failed (${response.status}).`);
        }
      })
      .catch(() => setPublishMsg("Revert failed: network error."));
  };

  if (!panelOpen) {
    return (
      <button type="button" className="editor-toggle" onClick={() => setPanelOpen(true)}>
        Open editor
      </button>
    );
  }

  return (
    <aside className="editor-panel" aria-label="Vision8 real estate editor">
      <div className="editor-heading">
        <div>
          <p>Vision8 real estate editor</p>
          <h2>Real estate editor</h2>
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
              ? "The live page is showing published spacing."
              : liveStatus === "defaults"
                ? "The live page is showing the built-in spacing."
                : "Live status unknown."}
        </p>
      </div>

      <p className="editor-note">
        Each slider sets a section&rsquo;s space above and below, in pixels. Default hands the
        section back to the stylesheet, which scales the spacing with the viewport. Changes here
        are a draft in this browser until Publish to live.
      </p>

      <section className="editor-section">
        <h3>Section spacing</h3>
        {PAD_SECTIONS.map(({ key, label }) => {
          const value = state.pad[key];
          return (
            <div className="re-editor-row" key={key}>
              <span className="re-editor-label">{label}</span>
              <input
                type="range"
                min={0}
                max={PAD_MAX}
                step={2}
                value={value ?? 90}
                onChange={(event) => setPad(key, Number(event.target.value))}
                aria-label={`${label} spacing`}
              />
              <span className="re-editor-value">{value != null ? `${value}px` : "auto"}</span>
              <button type="button" disabled={value == null} onClick={() => setPad(key, null)}>
                Default
              </button>
            </div>
          );
        })}
        <div className="editor-two-column">
          <button
            type="button"
            disabled={Object.keys(state.pad).length === 0}
            onClick={() => {
              dirty.current = true;
              setState(defaultPadState);
            }}
          >
            Reset all to defaults
          </button>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(JSON.stringify(state, null, 2));
              setPublishMsg("Layout JSON copied.");
            }}
          >
            Copy layout JSON
          </button>
        </div>
      </section>
    </aside>
  );
}

import { mergeSavedPad, type REPadState } from "./padding";

/*
  Server-side read of the published Real Estate layout, the same shape as
  photography/published.ts and for the same reason: the public page and the
  editor page both render what is actually live, and every non-Worker
  environment (the route tests import the built worker in Node) falls through
  the catch to "no published layout", which renders the stylesheet defaults.

  The layout lives in the existing PHOTO_LAYOUT KV namespace under its own
  key, "re-layout", rather than in a namespace of its own: a second namespace
  is account infrastructure to create and bind for what is one small JSON
  object, and the binding's name is history by now rather than a promise that
  only photography lives there.
*/
export async function readPublishedRePad(): Promise<REPadState | null> {
  try {
    const { env } = await import("cloudflare:workers");
    const kv = (env as { PHOTO_LAYOUT?: { get(key: string): Promise<string | null> } }).PHOTO_LAYOUT;
    if (!kv) return null;
    const raw = await kv.get("re-layout");
    if (!raw) return null;
    return mergeSavedPad(JSON.parse(raw));
  } catch {
    return null;
  }
}

import { mergeSaved, type PhotoState } from "./data";

/*
  Server-side read of the published layout, used by the public page and the
  editor page so both render what is actually live. Kept in its own module,
  imported only by server components: `cloudflare:workers` exists in the
  Worker runtime and in vinext dev, but not in Node, where the route tests
  import the built worker directly. The dynamic import keeps the module graph
  loadable there; the catch turns every non-Worker environment and any KV
  hiccup into "no published layout", which renders the source defaults.
*/
export async function readPublishedLayout(): Promise<PhotoState | null> {
  try {
    const { env } = await import("cloudflare:workers");
    const kv = (env as { PHOTO_LAYOUT?: { get(key: string): Promise<string | null> } }).PHOTO_LAYOUT;
    if (!kv) return null;
    const raw = await kv.get("layout");
    if (!raw) return null;
    return mergeSaved(JSON.parse(raw));
  } catch {
    return null;
  }
}

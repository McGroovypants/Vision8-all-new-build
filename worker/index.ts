/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
  // The photography editor's Publish to live store and its access token
  // (a Wrangler secret). Both optional: the route tests run the Worker with
  // neither bound, and the handlers answer 404/503 rather than crashing.
  PHOTO_LAYOUT?: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
  };
  PHOTO_PUBLISH_TOKEN?: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    /*
      Publish to live for the photography editor (v1.11.39). The layout JSON
      lives in KV; the public page reads it server-side on every render. GET
      of the layout is open (it is what the public page shows anyway); writes
      need the bearer token held only by the client, set with
      `wrangler secret put PHOTO_PUBLISH_TOKEN`.
    */
    if (url.pathname === "/photography/layout.json" && request.method === "GET") {
      const raw = env.PHOTO_LAYOUT ? await env.PHOTO_LAYOUT.get("layout") : null;
      if (!raw) return new Response("Not found", { status: 404 });
      return new Response(raw, {
        headers: { "content-type": "application/json", "cache-control": "no-store" },
      });
    }

    if (url.pathname === "/photography/publish") {
      if (!env.PHOTO_LAYOUT || !env.PHOTO_PUBLISH_TOKEN) {
        return new Response("Publishing not configured", { status: 503 });
      }
      if (request.headers.get("authorization") !== `Bearer ${env.PHOTO_PUBLISH_TOKEN}`) {
        return new Response("Unauthorized", { status: 401 });
      }
      if (request.method === "DELETE") {
        await env.PHOTO_LAYOUT.delete("layout");
        return new Response(null, { status: 204 });
      }
      if (request.method === "POST") {
        const text = await request.text();
        // Generous cap: a layout of a few hundred images is ~100KB. Anything
        // bigger is not a layout.
        if (text.length > 262144) return new Response("Too large", { status: 413 });
        try {
          const parsed: unknown = JSON.parse(text);
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("shape");
        } catch {
          return new Response("Invalid layout JSON", { status: 400 });
        }
        await env.PHOTO_LAYOUT.put("layout", text);
        return new Response(null, { status: 204 });
      }
      return new Response("Method not allowed", { status: 405 });
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;

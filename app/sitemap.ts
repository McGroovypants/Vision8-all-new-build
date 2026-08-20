import type { MetadataRoute } from "next";
import { SITE_URL, PUBLIC_ROUTES } from "./site";

/*
  /sitemap.xml returned 404 before this file existed, and the robots.txt served
  by Cloudflare declared no sitemap at all, so nothing pointed a crawler at the
  route list. The old Duda site does declare one, so shipping without this would
  have been a regression at cutover.

  Generated from PUBLIC_ROUTES in site.ts so a new route cannot be added to the
  nav and silently left out of the sitemap. The editor and preview routes are
  deliberately absent: they already carry robots.index = false.
*/
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}

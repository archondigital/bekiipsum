import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
import { robotsTxt } from "@corecastdigital/cms";

// From Payload → Site Settings → SEO & Sitemap.
export const GET: APIRoute = async () => {
  const settings = (await getEntry("settings", "settings"))?.data;
  return new Response(robotsTxt(settings, import.meta.env.SITE), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

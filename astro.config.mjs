import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { getRedirects } from "@corecastdigital/cms/redirects";
import { getSitemapOptions } from "@corecastdigital/cms/sitemap";

// bekiipsum.com — Bekinese lorem ipsum generator. Content: Payload site "bekiipsum"
// (cms.corecastdigital.com). Hosting: Cloudflare Workers — every page is a static asset;
// only /preview/* (Payload draft preview) runs in the Worker.
const SITE_SLUG = process.env.SITE_SLUG || "bekiipsum";
const SITE_URL = "https://bekiipsum.com";

/** Injects /preview/[collection]/[id] (src/preview/route.astro), rendered on demand. */
const previewRoute = () => ({
  name: "corecast-preview-route",
  hooks: {
    "astro:config:setup": ({ injectRoute }) => {
      injectRoute({
        pattern: "/preview/[collection]/[id]",
        entrypoint: new URL("./src/preview/route.astro", import.meta.url),
        prerender: false,
      });
    },
  },
});

// Redirects and sitemap rules come from Payload (Redirects; Site Settings → SEO & Sitemap).
const redirects = await getRedirects({ site: SITE_SLUG });
console.log(`[redirects] ${Object.keys(redirects).length} from Payload`);
const sitemapOptions = await getSitemapOptions({ site: SITE_SLUG, siteUrl: SITE_URL });

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap(sitemapOptions), previewRoute()],
  adapter: cloudflare({ imageService: "passthrough", prerenderEnvironment: "node" }),
  session: false,
  redirects,
  build: { inlineStylesheets: "always" },
  vite: {
    // @corecastdigital/* ship .astro/.ts source: compile them, don't externalize.
    ssr: { noExternal: [/^@corecastdigital\//] },
  },
  image: { domains: ["r2.corecastdigital.com", "cms.corecastdigital.com"] },
});

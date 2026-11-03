import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { siteCollections, fetchSiteDocs } from "@corecastdigital/cms";
import { fallbackDictionaries } from "@data/fallback";
import { lines } from "@lib/generator";

/**
 * Content from the shared Payload CMS (cms.corecastdigital.com), scoped to site "bekiipsum".
 * Published-only, fetched at build time. Fallbacks are used when the CMS is unreachable
 * (and, for dictionaries / home copy, when the site has none yet — see src/lib/site.ts).
 */
const SITE_SLUG = import.meta.env.SITE_SLUG || process.env.SITE_SLUG || "bekiipsum";
const c = siteCollections({ site: SITE_SLUG });

/** Payload → Dictionaries (bekiipsum-only collection; not in @corecastdigital/cms). */
const dictionaries = defineCollection({
  loader: async () => {
    const docs = await fetchSiteDocs({ site: SITE_SLUG }, "dictionaries", { sort: "name", depth: 0 });
    const list =
      docs?.map((d) => ({
        id: String(d.slug),
        slug: String(d.slug),
        name: String(d.name ?? d.slug),
        description: d.description ?? null,
        opening: d.opening ?? null,
        words: lines(d.words),
        connectors: lines(d.connectors),
        connectorRatio: typeof d.connectorRatio === "number" ? d.connectorRatio : 0.3,
        isDefault: d.isDefault === true,
      })) ?? [];
    // Nothing usable in the CMS yet → the original Bekinese list.
    const usable = list.filter((d) => d.words.length >= 5);
    return (usable.length ? usable : fallbackDictionaries).map((d) => ({ ...d, id: d.slug }));
  },
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    description: z.string().nullable().default(null),
    opening: z.string().nullable().default(null),
    words: z.array(z.string()),
    connectors: z.array(z.string()).default([]),
    connectorRatio: z.number().default(0.3),
    isDefault: z.boolean().default(false),
  }),
});

export const collections = {
  pages: defineCollection(c.pages),
  settings: defineCollection(c.settings),
  dictionaries,
};

import { getCollection, getEntry } from "astro:content";
import { SITE, NAV_LINKS, FOOTER_LINKS } from "@consts";
import type { Dictionary } from "@lib/generator";

/** Site Settings from Payload (site "bekiipsum"), with local consts as fallback. */
export async function getSiteSettings() {
  const s = (await getEntry("settings", "settings"))?.data;
  return {
    name: s?.siteName || SITE.NAME,
    tagline: s?.tagline || SITE.TAGLINE,
    email: s?.contactEmail || null,
    nav: s?.navigation?.length ? s.navigation.map((l) => ({ label: l.label, href: l.url })) : NAV_LINKS,
    footerLinks: s?.footerLinks?.length ? s.footerLinks.map((l) => ({ label: l.label, href: l.url })) : FOOTER_LINKS,
    footerNote: (s?.footerNote || SITE.FOOTER_NOTE).replace("{year}", String(new Date().getFullYear())),
    socials: s?.socials ?? [],
    titleTemplate: s?.titleTemplate || SITE.TITLE_TEMPLATE,
    defaultDescription: s?.defaultDescription || SITE.DESCRIPTION,
    defaultImage: s?.defaultImage ?? null,
    discourageSearchEngines: s?.discourageSearchEngines === true,
  };
}

/** Every dictionary, default first. */
export async function getDictionaries(): Promise<Dictionary[]> {
  const all = (await getCollection("dictionaries")).map((e) => e.data as Dictionary);
  return all.sort((a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault)));
}

/** A CMS page by slug (null when the site has none yet). */
export async function getPage(slug: string) {
  const pages = await getCollection("pages");
  return pages.find((p) => p.data.slug === slug)?.data ?? null;
}

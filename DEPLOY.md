# Deploying bekiipsum.com (Cloudflare Workers)

Every page is a static asset served by Workers. Only `/preview/*` (Payload draft preview) runs in the Worker.
Config lives in `wrangler.jsonc` and the `cloudflare()` adapter in `astro.config.mjs`. It's the same setup as archondigital-frontend.

## 1. CMS (once)

The CMS side is on archon-payload branch `add-bekiipsum-site`, which adds the Dictionaries collection and `scripts/seed-bekiipsum.ts`.
After merging and deploying it, run this on the CMS server:

```bash
set -a; . ./.env; set +a
SCHEMA_SYNC_DRY=1 node_modules/.bin/payload run scripts/schema-sync.ts   # expect only dictionaries tables/columns
node_modules/.bin/payload run scripts/schema-sync.ts
node_modules/.bin/payload run scripts/seed-bekiipsum.ts
```

The seed creates the **Beki Ipsum** site, its Site Settings, the Bekinese dictionary, the published `home` and `privacy`
pages, and redirects for the old Jekyll URLs. It's safe to re-run: anything that already exists is left alone.
To let an editor manage only this site, go to Users → (editor) → Sites and add Beki Ipsum.

## 2. Workers Builds (Cloudflare dashboard → Workers & Pages → Create → Import a repository)

- **Repository**: `archondigital/bekiipsum`, production branch `master`.
- **Worker name**: `bekiipsum` (must match `name` in wrangler.jsonc).
- **Build command**: `npm run build` · **Deploy command**: `npx wrangler deploy` · root `/`.
- **Build variables**:
  - `NODE_AUTH_TOKEN` (secret): a GitHub token with `read:packages`, for `@corecastdigital/*` via `.npmrc`
  - `NODE_VERSION` = `22`
  - `CMS_URL` = the Payload CMS base URL (no trailing slash)
- **Runtime variable** (Settings → Variables and secrets): `CMS_URL`, same value. Used by `/preview/*`.
  `wrangler.jsonc` sets `keep_vars: true`, so deploys leave it in place.

`@corecastdigital/blocks` and `@corecastdigital/cms` are pinned at `^0.7.0`, the current version in corecast-blocks.
If the install fails with "No matching version", publish 0.7.0 from corecast-blocks first.

## 3. Domain

bekiipsum.com currently points at GitHub Pages (the old `CNAME`). In the Worker go to Settings → Domains & Routes → Add →
**Custom domain**, and add `bekiipsum.com` and `www.bekiipsum.com`. If Cloudflare reports an existing DNS record, delete the
GitHub Pages A/CNAME records for that host first. Then turn off GitHub Pages in the repo settings.

## 4. Rebuild on publish

In the Worker, go to Settings → Builds → **Deploy Hooks** and create one for branch `master`. Paste its URL into
Payload → Sites → Beki Ipsum → **Deploy hook**. Saving a dictionary, a page or the Site Settings will then rebuild the site.

## Previews

Payload → Sites → Beki Ipsum → Preview URL is `https://bekiipsum.com` (the seed sets it). Only Pages have previews.

## Ads and analytics

GA4 (`G-P4N80G7QY9`) and the AdSense unit `5024365094` carry over from the old site. They load in production builds only
and never on `/preview`. `public/ads.txt` is unchanged.

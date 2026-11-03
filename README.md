# bekiipsum.com

Ang beking lorem ipsum generator: Bekinese (Swardspeak) dummy text for your layouts.
It started in 2014 as a Jekyll site (see git history). Since v2 it's **Astro on Cloudflare Workers**, with content from the shared Payload CMS at
[cms.corecastdigital.com](https://cms.corecastdigital.com) (site slug `bekiipsum`).

## What lives where

| What | Where |
| --- | --- |
| Word lists (Bekinese, plus any new ones) | Payload → **Dictionaries** (one word per line). A second dictionary adds a picker to the generator. |
| Copy under the generator (FAQ, colophon) | Payload → Pages → **home** |
| Privacy policy | Payload → Pages → **privacy** |
| Site name, tagline, nav, footer, SEO | Payload → **Site Settings** (site: Beki Ipsum) |
| Old Jekyll URLs | Payload → **Redirects** |
| Design, generator, layouts | this repo (`src/`) |

When the CMS can't be reached, or has no bekiipsum content yet, the build uses the local
fallbacks in `src/data/`: the original word list and the same copy. A build never fails offline.

## Generator

`src/lib/generator.ts` holds the pure functions. They run at build time for the text shown before JS loads, and in the
browser after that. You can generate paragraphs, sentences or an exact number of words, choose whether the text
starts with "Lorem ipsum keme keme", and wrap the output in `<p>` tags. The settings are kept in the URL
(`?mode=words&count=50`), and the 2014 links (`?wordCount=100&paraCount=3`) still work.

## Design

Liquid glass over cotton candy: soft pastel clouds swirl very slowly behind panels that refract them at their edges (Chromium; other browsers get blur + the same rims and highlights), with specular rims, a curved sheen and an inner glow for thickness. It is monochrome per theme: hot pink on glass in light mode, shades of purple in dark mode. Shrikhand is the
display face and Bricolage Grotesque the text face. Light and dark both follow the device, and there's a toggle
in the header. Every token is in `src/styles/glass.css`.

## Develop

```bash
export NODE_AUTH_TOKEN=<GitHub token with read:packages>   # for @corecastdigital/* (GitHub Packages)
npm install
npm run dev                                   # → http://localhost:4321
CMS_URL=http://localhost:3001 npm run dev      # against a local Payload (archon-payload)
```

## Deploy

See [DEPLOY.md](DEPLOY.md).

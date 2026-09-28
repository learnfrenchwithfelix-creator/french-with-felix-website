# Liminal French — liminalfrench.com

Content site for English-speaking learners of French (A1–B2). The site is in English; podcast
transcripts are in French. Brand: Liminal French (social sub-brand: French with Félix).
Reference docs: ARCHITECTURE.md, DESIGN.md, CONTENT-SCHEMA.md.

## Hosting and deployment

- GitHub Pages, built and published by GitHub Actions (`.github/workflows/deploy.yml`) on every
  push to `main`. Domain liminalfrench.com, DNS at Namecheap. No Vercel.
- Spotify credentials: repository secrets `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_SHOW_ID`
  (locally in `.env`, never committed).

## Official URLs

All official URLs live in `src/config/site.ts`. Import them; never hard-code a domain elsewhere.

| Key | Value | Used for |
|---|---|---|
| `siteUrl` | https://liminalfrench.com | `site` in astro.config.mjs, canonical/JSON-LD URLs |
| `platformUrl` | https://learn.liminalfrench.com | Kajabi course platform: "Explore courses" buttons, course banners |
| `startUrl` | https://learn.liminalfrench.com (TODO: Kajabi sign-in + sign-up page) | Destination of `/start` |

- `frenchwithfelix.com` and `learn.frenchwithfelix.com` are obsolete: never use them.
- Every "Start for free" / "Start Learning" button links to `/start` (a noindex redirect page, kept out of
  the sitemap), never straight to Kajabi.

## Dates and publishing

- `publishDate` (blog frontmatter; `publishDate` column of the podcast CSV) is the real go-live date,
  `YYYY-MM-DD`. Never set a past date on content that isn't live yet, nor a future date on content that is.
- `isPublished()` in `src/utils/content.ts` decides what gets built: not a draft, and publishDate passed.
  Every page, listing, sitemap entry and feed (RSS included, when added) must go through it.
- Scheduled content (future publishDate) is left out of production builds and shown in `astro dev` with a
  "Scheduled" label. The deploy workflow also runs daily at 06:00 UTC, so it goes live on its date.
- Blog `updatedDate` (optional) = last substantial edit → JSON-LD `dateModified` (falls back to publishDate).

## Working rules

- One branch per piece of work, small explicit commits. Run `npm run build` after each and fix errors.
- Never push, merge or deploy without the owner's go-ahead.
- Never edit the text of transcripts (`src/content/podcast/*.srt`) or blog articles (`content/blog/*.md`)
  unless asked; report errors instead.
- Missing information → a clearly marked `TODO` placeholder, listed at the end of the work.
- Leave `Website improvements discussion/` (archived design mock-ups) untouched.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

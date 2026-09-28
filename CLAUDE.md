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

## URL convention

- Every page URL ends with "/": `/blog/`, `/podcast/<slug>/`, `/about/`, `/start/`. GitHub Pages serves
  pages as folders and 301-redirects the slash-less form, so internal links always include the slash.
- Exceptions: the home page `/`, files (`/favicon.svg`, `/podcast/<slug>/transcript.txt`, `/robots.txt`,
  `/sitemap-index.xml`) and anchors.
- Markdown links in articles get their slash added at build time (`src/utils/rehype-trailing-slash.mjs`),
  so article sources don't need editing.
- `trailingSlash` stays `'ignore'` in astro.config.mjs (`'always'` breaks the transcript.txt endpoint).
  After every build, run `npm run check:links`: it fails on any internal link without the slash or
  pointing to a missing page.
- URLs are in English for new content (`/blog/french-subjunctive-guide/`); existing podcast slugs are French
  and must not change.

## Language attributes

- The site is English (`<html lang="en">`). French content inside it carries `lang="fr"`:
  every transcript paragraph, the French column of the key vocabulary, and French episode titles.
- Episode titles (H1, cards, thumbnail alt text) get `lang` from `episodeTitleLang()`
  (`src/utils/episode-title.mjs`, a French/English function-word count, French when unsure);
  `titleLang: en | fr` in the episode's extras file overrides it (e.g. `easy-french-news.md`).
- Blog articles: the frontmatter `lang` is applied to the article title and body.
- French expressions inside English article text would need `<span lang="fr">` in the article source:
  only with the owner's go-ahead (article text is not edited otherwise).
- `npm run check:links` fails if an episode H1, a transcript paragraph or an episode card title lacks its lang.

## Dates and publishing

- `publishDate` (blog frontmatter; `publishDate` column of the podcast CSV) is the real go-live date,
  `YYYY-MM-DD`. Never set a past date on content that isn't live yet, nor a future date on content that is.
- `isPublished()` in `src/utils/content.ts` decides what gets built: not a draft, and publishDate passed.
  Every page, listing, sitemap entry and feed (RSS included, when added) must go through it.
- Scheduled content (future publishDate) is left out of production builds and shown in `astro dev` with a
  "Scheduled" label. The deploy workflow also runs daily at 06:00 UTC, so it goes live on its date.
- Blog `updatedDate` (optional) = last substantial edit → JSON-LD `dateModified` (falls back to publishDate).

## Podcast episodes and indexing

- The CSV `src/data/liminal_podcast.csv` (exported from the Google Sheet) is the main source; the transcript
  is `src/content/podcast/<slug>.srt`; optional extras go in `src/content/podcast/<slug>.md` (frontmatter
  only: `summary_en`, `key_vocab`; see CONTENT-SCHEMA.md).
- An episode page is indexable (no robots noindex, listed in the sitemap) **only if `summary_en` is filled**.
  The rule lives in `isIndexableEpisode()` (pages) and `src/utils/episode-meta.mjs` (sitemap);
  `npm run check:links` fails if they disagree.
- `npm run podcast:missing` lists the published episodes not enriched yet.
- Episode `<title>` = `episodeSeoTitle()` (`src/utils/episode-title.mjs`): the YouTube title without its own
  `#NN` and generic labels ("slow french comprehensible input", "Intermediate French"…), then
  ` — French Podcast Ep. NN (LEVEL)`; `seoTitle` in the extras file overrides it verbatim. The H1 stays the
  YouTube title. Meta description = `summary_en`, else an English template. Titles over 60 characters are
  accepted (the suffix is what gets cut); `npm run podcast:titles -- --long` lists them.
- Summaries and vocabulary drafted by Claude are proposals: the owner reviews them before they are merged.

## Working rules

- One branch per piece of work, small explicit commits. Run `npm run build` then `npm run check:links`
  after each and fix errors.
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

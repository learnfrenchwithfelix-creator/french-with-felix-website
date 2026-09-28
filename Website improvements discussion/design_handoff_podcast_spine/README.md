# Handoff: Liminal French podcast pages — "The Spine"

## Overview

Redesign of the podcast **listing** (`/podcast`, `/podcast/2`…) and the podcast **episode** page (`/podcast/[slug]`) in the existing **Astro 5 + Tailwind** project. This follows the homepage redesign in `design_handoff_homepage_spine/` and uses the same visual system — section headers with a hairline rule and red mono eyebrow, hairline separators, no new tokens.

This is a modification of existing components:

- `src/components/podcast/PodcastListingPage.astro`
- `src/components/podcast/EpisodeCard.astro`
- `src/pages/podcast/[...page].astro` / `index.astro`
- `src/pages/podcast/[slug].astro`

Two substantive functional changes (§2 and §3) plus a new card treatment (§4). The rest is styling.

## About the design files

The `.dc.html` files are **design references written in HTML** — prototypes of look and behaviour, not production code. Recreate them inside the Astro codebase using the existing `tailwind.config.mjs` tokens (`bg`, `title`, `accent`, `muted`, `surface`, `border`, `rounded-card`, `rounded-section`, `rounded-button`) and the CSS custom properties in `src/styles/global.css`. The prototypes use literal hex inline because of how they were authored — **do not hardcode hex in the implementation**; every colour below maps to an existing token.

To view a prototype: open the file in a browser with `support.js` alongside it.

| File | What it is |
| --- | --- |
| `Podcast - The Spine.dc.html` | **The design to implement.** Two screens: listing (filters are live — try them) and episode detail. |
| `Podcast cards - options.dc.html` | The three explored card treatments (1A / 1B / 1C). **1A was selected.** Context only. |
| `Liminal French - Current.dc.html` | Before-state recreation of the live site, 6 screens. Reference. |
| `support.js` | Runtime needed to open the `.dc.html` files. |

## Fidelity

**High fidelity.** Final colours, type, spacing and interaction behaviour.

Note: in the prototype the episode page's video is a static thumbnail with a fake play button, and transcript paragraphs are three sample paragraphs. The real page keeps the existing YouTube iframe + `parseSRT()` transcript and its full sync behaviour — that machinery is unchanged.

## Design tokens

Identical to the homepage handoff. No new tokens.

`--color-bg` `#F1F1F0` · `--color-title` `#2C3A48` · `--color-liseret` `#21456E` (3px top bar only) · `--color-accent` `#C8312A` · `--color-accent-dark` `#A42822` · `--color-body` `#1C1C1E` · `--color-muted` `#6B7280` · `--color-surface` `#E8E8E7` · `--color-border` `#D1D1CF`

Level badges unchanged from `src/components/ui/Badge.astro`: A1 `#DBEAFE`/`#1E40AF` · A2 `#D1FAE5`/`#065F46` · B1 `#FEF3C7`/`#92400E` · B2 `#FCE7F3`/`#9D174D`

Typography: Hanken Grotesk (300/400/500/600/700) + Spline Sans Mono (400/500), both already loaded. Container `max-width:1180px`, padding 48px desktop / 24px mobile. Radius: cards 14px, buttons 10px, full-bleed surface blocks 32px, badges 999px.

## What to build

### 1. Page header — new (listing)

The listing currently starts straight into the filter toolbar with no title. Add the shared section-header treatment above the filters:

```
──────────────────────────────  1px solid var(--color-border)
                               22px padding-top
PODCAST                        mono 11px / 500 / uppercase / 0.14em / accent
                               14px gap
Real French,                   44px / 300  ┐ one H1, mixed weights
 with the transcript           44px / 700  ┘ tracking -0.035em, line-height 1.08
 in front of you.
                               20px gap
{n} episodes, every one free and fully transcribed. Filter by level,
theme or speaking rate to find something at the edge of what you can follow.
                               17px / 1.65 / muted, max-width 640px
```

`{n}` is the live episode count from `fetchEpisodes()` (83 at time of writing) — not hardcoded.

If the homepage handoff's shared `SectionHeader.astro` exists by now, reuse it; the H1/H2 tag differs, so give it a `tag` prop.

### 2. Featured latest episode — new (listing)

Between the page header and the filters, a borderless two-column promo for `episodes[0]`, on the page background:

- Grid `580px minmax(0,1fr)`, `gap:44px`, `align-items:center`, no card, no border, no background fill (an earlier iteration had a grey `bg-surface` card — **removed at the owner's request**; do not reinstate it)
- Left: 16/9 `<img>`, `rounded-[12px]`, with the same bottom overlay as the cards (§4): gradient `to top, rgba(18,22,28,0.8) → transparent` at 46% height, `EP {n}` mono 12px bottom-left, duration mono 12px bottom-right, both `rgba(255,255,255,0.92)`, inset 16px/14px
- Hover: `box-shadow: 0 20px 40px -22px rgba(28,28,30,0.5)` on the image only, `transition: box-shadow 220ms ease`
- Right: mono accent eyebrow "Latest episode" + level `<Badge>` in a 12px-gap row → H2 34px/700/`-0.035em`/1.12, `text-wrap:pretty` → hairline `border-t` + 16px padding-top, then a mono 12px muted meta row: `{rateLabel} · {wpm} wpm`, `{theme}`, and `▶ LISTEN + READ` in accent 500 pushed right with `margin-left:auto`
- The whole block is one `<a href="/podcast/{slug}">`

Section padding: `0 48px 56px`.

### 3. Filters must span all episodes, and pagination must follow them

**This is the important functional change.** Today `PodcastListingPage.astro` renders one paginated page server-side and its inline `<script>` hides cards *within that page only* — filtering to "A1" on page 1 shows the A1 episodes that happen to be on page 1, and the empty state says "No episodes match your filters **on this page**". With 83 episodes across 7 pages that is effectively broken.

Required behaviour, as prototyped:

- Filtering applies to the **entire episode set**, not the current page
- Pagination is **recomputed from the filtered set**: 12 per page, `lastPage = ceil(filtered/12)`
- Changing any filter or the search term **resets to page 1**
- A result count line sits under the toolbar: `Showing 1–12 of 83 episodes`, and `of 24 matching episodes` when any filter is active (mono 12px, muted, 18px above the grid)
- Empty state: `No episodes match these filters.` (mono 14px, muted, centred, 64px vertical padding) — no longer "on this page"

Two ways to implement; either is fine:

1. **Client-side, single page.** Ship all 83 episodes' metadata to the browser (they are tiny — number, title, level, theme, rate, wpm, duration, slug, youtubeId) and do filtering + pagination in one small script, updating the URL with `?level=&theme=&rate=&q=&page=`. Keeps `/podcast` as one static page; the `[...page].astro` routes can redirect to it or stay as SEO-crawlable fallbacks.
2. **Keep SSG pagination, filter client-side across a shipped index.** Same as above but only the current page's cards are in the DOM, and filtering swaps the rendered set from the shipped index.

The prototype implements option 1's behaviour. It does **not** implement URL sync — add it, so filtered views are shareable and the back button works.

Toolbar itself is unchanged in structure (three `<select>`s → level / theme / speed, a Reset button that appears only when a filter is active, search input pushed right with `ml-auto`). Restyle to match: `bg-surface`, `1px solid var(--color-border)`, `rounded-[10px]`, 14px, padding `9px 12px`; accent border on hover/focus (already in the existing `.filter-select` CSS). Keep `min-width:200px` on the search field.

**Pagination moves to the bottom only** — the current duplicate top pagination is removed. Style: centred `nav` with `gap:6px`, pill buttons `min-width:38px`, `padding:9px 12px`, `border-radius:999px`, `1px solid var(--color-border)`, 14px. Current page: accent background, `#F1F1F0` text, 600. Prev/next arrows `←` `→`, `opacity:0.4` and `disabled` at the ends. Windowing: always first and last page, up to 3 around current, `…` as a non-interactive spacer. This supersedes `src/components/ui/Pagination.astro`'s current markup — update that component rather than inlining.

### 4. Episode card — treatment 1A

The selected card system. Grid stays `repeat(3, minmax(0,1fr))`, `gap:24px`, 12 per page. `EpisodeCard.astro`:

```
┌──────────────────────────────┐
│  16/9 <img>, object-cover    │  card: rounded-14, 1px solid border,
│                              │  background #F7F7F6 (bg-bg is fine),
│  ▓▓▓ gradient ▓▓▓            │  overflow-hidden, flex column
│  EP 83              29:05    │
├──────────────────────────────┤
│  ( B1 )                      │  padding 20px 22px 18px
│                              │
│  J'apprends le japonais      │  19px / 600 / 1.28 / -0.02em / title
│  et le portugais             │  text-wrap: pretty
│                              │
│  ────────────────────────    │  1px solid #E1E1DF, margin-top:auto
│  159 wpm · language-learning →│
└──────────────────────────────┘
```

Changes from the current card:

- **Episode number moves onto the thumbnail** — mono 11px/500, `letter-spacing:0.12em`, `rgba(255,255,255,0.92)`, bottom-left inset 14px/12px, over a `linear-gradient(to top, rgba(18,22,28,0.82), transparent)` at 56% height. **Duration** sits bottom-right in the same style.
- **Only the level badge sits above the title** (`align-self:flex-start`, 12px below). The old row of three chips (Ep n / level / theme) is gone — the title reads first.
- **Title moves above the metadata** and goes 18px → 19px.
- **Footer line is `{wpm} wpm · {theme}`** in mono 11px muted, with the arrow in accent (`#C8312A`) rather than muted. Duration is no longer repeated here — it is on the thumbnail. When `wpm === 0`, show the theme alone.
- **Hover** replaces the old bare `translateY(-3px)`: `border-color → var(--color-liseret)`, `box-shadow: 0 14px 28px -18px rgba(28,28,30,0.45)`, `transform: translateY(-3px)`; `transition: border-color 160ms ease, box-shadow 200ms ease, transform 200ms ease`. The arrow is already accent, so the `.listen-arrow` hover rule can go.
- Missing-thumbnail fallback (the diagonal-stripe block with `Ep n`) is kept as-is for episodes with no `youtubeId`.

Note the card renders the **theme** string raw (`language-learning`). The filter dropdown shows it title-cased ("Language Learning"). Either is acceptable; keep the raw lowercase form in the card — it reads as a tag.

1B (dense two-column list) and 1C (four-up editorial) are in `Podcast cards - options.dc.html` if you want to see what was not chosen.

### 5. Listen everywhere + CTA — unchanged

Same `rounded-section bg-surface` blocks, same copy, same platform links and SVGs. The only change is the eyebrow, which goes from muted to **accent** to match the new section-header rule.

### 6. Episode page — header, layout, and a transcript toolbar

`src/pages/podcast/[slug].astro`. The transcript machinery (YouTube iframe API, timecode seek, active-paragraph highlight, spacebar toggle) is **unchanged** — do not touch that script. Changes:

- **Episode header** — unchanged in content and layout (accent `Ep n`, badge, theme pill, 38px H1, hairline + three-up Duration / Speed / Transcript metadata). Keep as is.
- **Transcript column gets a header block**: hairline `border-t` + 22px padding-top, accent mono eyebrow "Transcript", then H2 36px `Full transcript` (300 + 700 mixed), with a right-aligned button pair on the same baseline (`align-items:flex-end`, `justify-content:space-between`): **Download** and **Print**, both `rounded-[10px]`, `1px solid var(--color-border)`, `bg-bg`, `padding:10px 16px`, 13px/600, title colour, with the 14px stroke icons from the prototype. 32px below.
  - Download: serve the transcript as a `.txt` (or `.srt`) file — `parseSRT()` already has the data server-side, so a static `/podcast/{slug}/transcript.txt` endpoint is simplest.
  - Print: `window.print()` plus a small print stylesheet that hides the header, player, platform links and CTA, and prints the transcript at 12pt with the episode title and number at the top.
- **"Also on" block under the player** — new. `rounded-card`, `1px solid var(--color-border)`, `bg-surface`, `padding:20px`, mono 10px uppercase muted label "Also on", then Spotify / Apple / RSS links as `rounded-[10px]` `bg-bg` bordered buttons (13px/600, 9px 14px, 15px brand-coloured icons). Sits `margin-top:20px` below the video and scrolls with it inside the existing sticky wrapper. Use the episode's own Spotify URL if the CSV has one, otherwise the show URL.
- Column ratio stays `3fr 2fr` with transcript left / player right on desktop and player first on mobile — the existing `order` utilities already do this.

## Interactions & behaviour

| Element | Behaviour |
| --- | --- |
| Filters | Apply across all episodes; reset to page 1 on change; Reset button visible only when something is active; sync to URL query params |
| Episode card | `translateY(-3px)` + marine border + soft shadow on hover, ≤200ms |
| Featured episode | Shadow on the image only, 220ms |
| Pagination | Bottom only; prev/next disabled + `opacity:0.4` at the ends; windowed page numbers |
| Platform links | `border-color` and `color` → accent on hover (existing `.platform-link`) |
| Transcript timecodes | Unchanged: click seeks + plays, active paragraph at `opacity:1` / others `0.4`, spacebar toggles |
| Download / Print | New. Print uses a print stylesheet; download hits a static transcript endpoint |
| Primary buttons | `background → --color-accent-dark`, 0.15s |

`DESIGN.md`'s ceiling on transition length still applies — nothing above 300ms.

## Responsive

The prototype is desktop-only (fixed 1320px min-width). Apply the repo's existing breakpoints:

- Page H1 44px → `clamp(2rem, 4vw, 2.75rem)`
- Featured episode: two columns → stacked, image first, H2 to 26px
- Card grid: 3 → 2 (`md`) → 1 column, as today
- Filter toolbar: wraps already; below `sm` let the search field take full width on its own row (drop `ml-auto`)
- Pagination: keep the windowing but allow it to wrap
- Transcript toolbar: Download/Print drop below the H2 on narrow screens
- Container padding 48px → 24px below `md`

## Data

- `fetchEpisodes()` / `parsePodcastCSV()` as today. The listing needs the full set, not just the page slice — see §3.
- **Duration bug, still open.** `src/data/liminal_podcast.csv` stores sub-hour durations as `29:05:00`. The prototype normalises by dropping a trailing `:00` third segment; fix it properly in `parsePodcastCSV.ts` so every consumer benefits (`PodcastSection.astro`, the listing, `[slug].astro`).
- Theme values in the CSV are lowercase kebab (`language-learning`). The filter dropdown lists nine themes but only four appear in the data (`language-learning`, `life-reflections`, `culture`, `travel`) — generate the dropdown from the data rather than hardcoding, so it never offers an empty filter.
- `wpm` is `0` for some episodes; handle that everywhere it is printed (card footer, featured meta, episode header).

## Assets

No new assets. YouTube thumbnails via `https://img.youtube.com/vi/<id>/maxresdefault.jpg`; Spotify / Apple / RSS SVGs already in the repo. The prototype renders images as CSS `background-image` on a `div` — an artefact of the prototyping environment. **Use real `<img>` with `alt`, `width`, `height` and `loading="lazy"`.**

## Files in this bundle

| File | Notes |
| --- | --- |
| `Podcast - The Spine.dc.html` | The design to build — listing + episode |
| `Podcast cards - options.dc.html` | Card treatments 1A (selected) / 1B / 1C |
| `Liminal French - Current.dc.html` | Before-state recreation |
| `support.js` | Required to open the `.dc.html` files |

# Handoff: Liminal French homepage — "The Spine"

## Overview

A redesign of the `frenchwithfelix.com` (Liminal French) homepage. The goal was threefold, set by the site owner: explain the method more clearly, make the site feel more credible, and give it more visual personality — while staying close to the existing brand system in `DESIGN.md`.

Three directions were explored; the owner selected **1a "The Spine"** and it was developed into a complete homepage. This handoff covers that homepage.

The target codebase is the existing **Astro 5 + Tailwind** project (`src/pages/index.astro` and `src/components/home/*.astro`). This is a modification of existing components, not a greenfield build.

## About the design files

The `.dc.html` files in this bundle are **design references written in HTML** — prototypes showing intended look and behaviour. They are not production code to copy. The task is to recreate them inside the existing Astro/Tailwind codebase, using its established component structure, its `tailwind.config.mjs` token names (`bg`, `title`, `accent`, `muted`, `surface`, `border`, `rounded-card`, `rounded-section`, `rounded-button`), and its CSS custom properties in `src/styles/global.css`.

The HTML prototypes use literal hex values inline because of how they were authored. **In the Astro implementation, use the existing Tailwind token classes and CSS variables instead of hardcoded hex.** Every colour in this document maps to a token that already exists.

To view a prototype: open the `.dc.html` file in a browser. `support.js` must sit alongside it.

| File | What it is |
| --- | --- |
| `Homepage — The Spine.dc.html` | **The design to implement.** Full homepage, final state. |
| `Liminal French — Current.dc.html` | Pixel recreation of the site as it exists today (6 screens). Reference / before-state. |
| `Homepage improvements.dc.html` | The three explored directions (1a, 1b, 1c). Context only — 1b and 1c were not selected. |

## Fidelity

**High fidelity.** Final colours, typography, spacing and interaction behaviour. Recreate pixel-perfectly using the codebase's existing tokens.

## Design tokens

All of these already exist in `src/styles/global.css` and `tailwind.config.mjs`. No new tokens are needed.

### Colour

| Token | Value | Use in this design |
| --- | --- | --- |
| `--color-bg` | `#F1F1F0` | Page background. Levels section now sits on this (changed from surface). |
| `--color-title` | `#2C3A48` | All headings, logo, strong body emphasis |
| `--color-liseret` | `#21456E` | 3px page-top bar only |
| `--color-accent` | `#C8312A` | CTAs, eyebrows, accordion +/−, left rules, check icons |
| `--color-accent-dark` | `#A42822` | Button hover |
| `--color-body` | `#1C1C1E` | Body copy |
| `--color-muted` | `#6B7280` | Secondary copy, metadata, taglines |
| `--color-surface` | `#E8E8E7` | Podcast block, Newsletter block, Philosophy card, annual pricing card, footer |
| `--color-border` | `#D1D1CF` | All hairlines, card borders, section rules |

Level badge colours are unchanged from `src/components/ui/Badge.astro`:
A1 `#DBEAFE` / `#1E40AF` · A2 `#D1FAE5` / `#065F46` · B1 `#FEF3C7` / `#92400E` · B2 `#FCE7F3` / `#9D174D`

### Typography

Hanken Grotesk (300/400/500/600/700) for everything; Spline Sans Mono (400/500) for eyebrows, labels and metadata. Both already loaded in `BaseLayout.astro`.

| Role | Size / weight / tracking |
| --- | --- |
| Hero H1 | 62px · 300 + 700 mixed · `-0.045em` · line-height 1.04 |
| **Section H2 (changed)** | **44px · 300 + 700 mixed · `-0.035em` · line-height 1.08** |
| Section eyebrow (changed) | Mono 11px · 500 · uppercase · `0.14em` · **accent red** |
| Card H3 | 19–22px · 700 · `-0.02em` |
| Body | 16px · 400 · line-height 1.65 |
| Hero lead | 19px · 400 · line-height 1.6 · muted |
| Metadata | Mono 12px · muted |

### Spacing & radius

Container `max-width: 1180px`, horizontal padding 48px desktop / 24px mobile.
Vertical rhythm between sections: **96px** bottom padding (was 80px).
Radius: cards 14px, buttons 10px, full-bleed surface blocks 32px, badges/pills 999px.

## What changed from the current site

Implement these as edits to the existing components.

### 1. Section headers — new shared treatment (all sections)

Every section title block now reads:

```
──────────────────────────────────────────  1px solid var(--color-border)
                                            22px padding-top
HOW IT WORKS                                mono 11px / 500 / uppercase / 0.14em / accent
                                            14px gap
How Liminal French works                    44px / 300 + 700 / -0.035em
                                            48px gap to content
```

Previously: 11px grey eyebrow, 30px heading, `border-t border-border` only on some sections. Now the rule, the red eyebrow and the 44px heading are applied consistently to **How it works, Levels, What you get, Pricing, Philosophy, Podcast, and Q&A**.

This is the single highest-impact change and is worth extracting into a shared `SectionHeader.astro` component taking `eyebrow`, `headingLight`, `headingBold`.

### 2. Hero — unchanged

Hero copy, image and CTAs are identical to the current site. The only change is styling on the secondary link: it now carries a permanent `border-bottom: 2px solid var(--color-border)` that darkens to title colour on hover.

A "proof strip" of headline numbers was prototyped below the hero and **cut at the owner's request**. Do not implement it.

### 3. How it works — 3 steps kept, spine diagram removed

`HowItWorks.astro` keeps its three steps, images, numbers and copy exactly as they are. Only the header treatment changes (§1) and the step H3 goes from 20px to 21px.

An A1→B2 "threshold" diagram was prototyped here and then **removed at the owner's request**. Do not implement it. (It is still visible in `Homepage improvements.dc.html` under option 1a if you want to see what was cut.)

### 4. Levels — off the grey background, onto a vertical rail

The biggest structural change. `Levels.astro` currently renders a 2×2 grid of bordered cards inside a `rounded-section bg-surface` block.

It now renders as a **vertical list on the page background**, with a rail:

- Container: `border-left: 2px solid var(--color-border)`, `padding-left: 40px`, `display:flex; flex-direction:column; gap:36px`
- Each row: a 16px circle node absolutely positioned at `left:-49px; top:4px` — `background: var(--color-bg)`, `border: 2px solid <node colour>`. Node colour is `--color-liseret` (`#21456E`) for A1 and A2, `--color-accent` (`#C8312A`) for B1 and B2. This is the one place the threshold idea survives: the rail changes colour where the learner crosses over.
- Row layout: `display:flex; gap:40px` with three parts — a fixed 250px column (badge, 22px title, italic muted tagline), a flexible description column (16px/1.65), and a fixed 290px "By the end" column.
- "By the end" column: `border-left: 3px solid var(--color-accent)`, `padding-left:18px`, mono 10px uppercase label + 15px/500 title-colour outcome.

Heading changed from "Four levels, one path" to **"What you do, and what you can do after"**.

New copy — the outcome per level (this did not exist before):

| Level | By the end |
| --- | --- |
| A1 | You can build your own sentences instead of reciting them. |
| A2 | You read a short real French text and follow the thread. |
| B1 | You follow a 30-minute podcast without the transcript. |
| B2 | You read a novel and hold a conversation about it. |

Level titles, taglines and descriptions are unchanged from the current `Levels.astro`.

The owner has confirmed this column: **ship it**.

### 5. What you get — flat list becomes three named groups

`WhatYouGet.astro` currently renders 7 items in a flat 2-column checklist. It now renders **three columns with headings**, same 7 items redistributed plus 2 new ones:

| Learn — *The structured part* | Practise — *On your own time* | Live — *With Félix and others* |
| --- | --- | --- |
| Video lessons at every level — grammar to full immersion | Interactive games and reading practice | Weekly live sessions with Félix — and full replay access |
| Pre-made Anki decks for every lesson — ready to use, no setup | Comprehension exercises tied to each immersion text *(new)* | Live book readings — Le Petit Prince and more (B2) |
| Your first lessons at each level, free | Full transcripts on every podcast episode *(new)* | Community access |

Group heading 19px/700, sub-label 14px muted italic-free. Items keep the existing 15px accent check SVG at `margin-top:5px`.

### 6. Pricing, Philosophy, Podcast — unchanged except headers

Copy, layout and card treatment are identical to the current components. Only the section header treatment (§1) changes. Podcast keeps its `rounded-section bg-surface` block.

Note the podcast episode meta changed from `{duration} · transcript` to `{duration} · {wpm} WPM` (mono 12px) — see "Known data issue" below.

### 7. Q&A — new section, accordion

New section between Podcast and Newsletter. Six question/answer pairs in an accordion:

- Container `max-width: 860px`
- Each item: `border-bottom: 1px solid var(--color-border)`
- Trigger: full-width `<button>`, `padding: 24px 0`, `display:flex; justify-content:space-between; align-items:center; gap:24px`, transparent background, no border, `cursor:pointer`, `text-align:left`
- Question: 19px / 600 / `-0.015em` / title colour
- Indicator: 28px circle, `border: 1px solid var(--color-border)`, centred `+` (closed) or `−` (open), 15px / 500 / accent
- Answer: 16px / line-height 1.75 / body colour, `max-width:720px`, `padding: 0 56px 26px 0`
- **Behaviour: single-open accordion.** Opening one closes the others. Clicking the open one closes it. First item open on load.
- Set `aria-expanded` on the button and associate the panel with `aria-controls` / `id`.

Copy:

1. **Do I need any French to start?** — No. A1 starts at zero — the first lessons assume nothing, and the first lesson of every level is free so you can check the fit before paying.
2. **How long does a level take?** — It depends on how much time you put in. The levels are not timed courses — you move on when the content at your level stops feeling hard.
3. **What if I already speak some French?** — Start at the level where the sample lessons feel slightly uncomfortable rather than easy. You keep access to every level, so you can move back and forth.
4. **Is this only video?** — No. Every level pairs video lessons with Anki decks, reading practice, and interactive exercises, plus the weekly live session.
5. **Can I cancel?** — Yes, at any time, and you keep access until the end of the period you paid for. Annual is billed once a year at $290.
6. **Is the podcast included?** — The podcast is free and always will be — 93 episodes with full transcripts, no account needed.

> The **structure and behaviour of this section are approved**. The copy above is a first draft written during the design process — the owner will revise the wording himself. Build the accordion with this text in place; expect the strings to change.

### 8. Newsletter — new section

New `rounded-section bg-surface` block, `padding:56px`, two columns `1fr 420px`, `gap:56px`, vertically centred.

Left: accent mono eyebrow "Newsletter", 30px heading *"One email a week, in French you can read"* (300 + 700), 16px body — *"A short piece of real French with the hard parts explained, plus the week's new episode. Free, no course pitch."*

Right: `display:flex; gap:10px` — an email input (`flex:1`, `rounded-button`, `1px solid var(--color-border)`, `bg-bg`, `padding:14px 16px`, 15px) and a Subscribe button (`rounded-button`, `bg-accent`, `text-bg`, 600, `padding:14px 22px`).

Not wired to anything. Needs a provider (the repo has no mailing-list integration today).

### 9. Header — more transparent

`src/components/layout/Header.astro`:

```css
/* before */
background-color: color-mix(in srgb, var(--color-bg) 88%, transparent);
backdrop-filter: saturate(1.2) blur(8px);

/* after */
background-color: color-mix(in srgb, var(--color-bg) 60%, transparent);
backdrop-filter: saturate(1.2) blur(12px);
```

Everything else about the header is unchanged.

### 10. Section rules — hairline, not marine

Section header rules are `1px solid var(--color-border)`. An earlier iteration used a 2px marine bar; the owner asked for something more discreet. Do not use 2px or `--color-liseret` here — the marine stays reserved for the 3px page-top liseré.

## Interactions & behaviour

| Element | Behaviour |
| --- | --- |
| Q&A accordion | Single-open. Click toggles; clicking the open item closes it. Item 1 open on load. Animate height if you like, ≤300ms, but `DESIGN.md` forbids anything longer. |
| Primary buttons | `background` → `--color-accent-dark` on hover, `transition: background-color 0.15s ease` |
| Secondary / outline buttons | `border-color` → `--color-title` on hover |
| Nav links | `color` → accent on hover (existing behaviour) |
| Level rows | No hover transform. The old `translateY(-3px)` card hover is gone with the cards. |
| Episode cards | Keep existing `translateY(-3px)` on hover, 0.2s ease, no box-shadow |
| Hero secondary link | `border-bottom-color` `--color-border` → `--color-title` on hover |
| Scroll reveal | Existing `IntersectionObserver` fade-up pattern still applies |

`SectionDots.astro` (the right-hand dot nav and scroll magnet) was **not** part of this redesign and is not present in the prototype. Decide separately whether the new section list should feed it — if you keep it, update the `[data-snap][data-label]` wrappers in `index.astro` to match the new section order: Home, How it works, Levels, What you get, Pricing, Philosophy, Podcast, Q&A, Newsletter, Get started.

## State management

Only one piece of client state: the open index of the Q&A accordion. A small inline `<script>` in the Astro component is sufficient — no framework island needed.

Everything else is static or server-rendered. The podcast strip continues to use `fetchEpisodes()` from `src/utils/episodes.ts`.

## Responsive behaviour

The prototype is desktop-only (fixed at 1240px). The breakpoints below follow the conventions already in the repo and need to be applied when implementing:

- **Section headings** 44px → `clamp(2rem, 4vw, 2.75rem)`
- **Hero** two columns → single column, image first (existing `order-1`/`order-2` pattern)
- **Levels rail** three columns → stacked: badge + title, then description, then "By the end". Keep the rail and node on the left at all widths; reduce `padding-left` to 24px.
- **What you get** three columns → one column, groups stacked
- **Newsletter** two columns → stacked, input and button full width
- **Q&A** unchanged, it is already single-column
- Container padding 48px → 24px below `md`

## Assets

No new assets. The design reuses:

- `/images/hero-profile.png` — Félix, hero and About
- `/images/step-foundation.png`, `/images/step-threshold.jpg`, `/images/step-expand.webp` — How it works steps. Keep `mix-blend-mode: multiply` and the `scale(1.6)` on step 3.
- YouTube thumbnails via `https://img.youtube.com/vi/<id>/maxresdefault.jpg`
- Spotify / Apple / RSS inline SVGs from the existing components

In the prototypes these images are rendered as CSS `background-image` on a `div` rather than `<img>` — that is an artefact of the prototyping environment. **Use real `<img>` tags with `alt`, `width`, `height` and `loading="lazy"` in the Astro implementation.**

## Known data issue (unrelated to the design, worth fixing)

`src/data/liminal_podcast.csv` stores durations under 60 minutes as `29:05:00` rather than `29:05`, and the value is printed raw in `PodcastSection.astro`, `PodcastListingPage.astro` and `src/pages/podcast/[slug].astro`. The homepage currently shows "29:05:00 · transcript". Normalise in `parsePodcastCSV.ts`.

The blog listing also has no filtering or category navigation despite 39 articles — flagged to the owner, not addressed here.

## Files in this bundle

| File | Notes |
| --- | --- |
| `Homepage — The Spine.dc.html` | The design to build |
| `Liminal French — Current.dc.html` | Before-state recreation: home, blog listing, blog article, podcast listing, podcast episode, about |
| `Homepage improvements.dc.html` | All three explored directions, for context |
| `support.js` | Runtime required to open the `.dc.html` files in a browser |

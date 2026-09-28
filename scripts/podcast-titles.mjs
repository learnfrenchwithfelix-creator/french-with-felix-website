// Shows the <title> of every episode page: the YouTube title (still the H1) → the SEO title, and
// flags titles over 60 characters (Google often cuts them). A `seoTitle` in the episode's
// src/content/podcast/<slug>.md overrides the generated title.
// Usage: npm run podcast:titles            (all episodes)
//        npm run podcast:titles -- --long  (only titles over 60 characters)
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { episodeSeoTitle } from '../src/utils/episode-title.mjs';

const MAX = 60;
const onlyLong = process.argv.includes('--long');

const csv = readFileSync(join(process.cwd(), 'src/data/liminal_podcast.csv'), 'utf-8').replace(/^﻿/, '');
const episodes = csv
  .split('\n').map(l => l.replace(/\r$/, '')).filter(Boolean).slice(1)
  .map(l => l.split(','))
  .map(c => ({ episodeNumber: parseInt(c[1], 10), slug: c[2].trim(), title: c[3].trim(), level: c[4].trim() }))
  .sort((a, b) => b.episodeNumber - a.episodeNumber);

// seoTitle override, written as a one-line value in the extras file
const seoTitleOf = slug => {
  const file = join(process.cwd(), 'src/content/podcast', `${slug}.md`);
  if (!existsSync(file)) return undefined;
  const m = readFileSync(file, 'utf-8').match(/^seoTitle:\s*(.+)$/m);
  return m?.[1].trim().replace(/^(["'])(.*)\1$/, '$2');
};

let long = 0;
for (const ep of episodes) {
  const override = seoTitleOf(ep.slug);
  const seo = episodeSeoTitle(ep, override);
  const tooLong = seo.length > MAX;
  if (tooLong) long++;
  if (onlyLong && !tooLong) continue;
  console.log(`#${ep.episodeNumber}${override ? '  (seoTitle)' : ''}${tooLong ? `  [${seo.length} chars]` : ''}`);
  console.log(`  H1    ${ep.title}`);
  console.log(`  title ${seo}`);
}
console.log(`\n${long} / ${episodes.length} titles over ${MAX} characters.`);

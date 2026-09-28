// Lists the published podcast episodes that aren't enriched yet — no src/content/podcast/<slug>.md,
// or one without summary_en — newest first. Those episodes stay noindex and out of the sitemap.
// Usage: npm run podcast:missing
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { indexableEpisodeSlugs } from '../src/utils/episode-meta.mjs';

const csv = readFileSync(join(process.cwd(), 'src/data/liminal_podcast.csv'), 'utf-8').replace(/^﻿/, '');
const today = new Date();
const episodes = csv
  .split('\n').map(l => l.replace(/\r$/, '')).filter(Boolean).slice(1)
  .map(l => l.split(','))
  .map(c => ({ n: parseInt(c[1], 10), slug: c[2].trim(), title: c[3].trim(), level: c[4].trim(), date: (c[12] ?? '').trim() }))
  .filter(ep => !ep.date || new Date(ep.date) <= today) // published only (same rule as isPublished)
  .sort((a, b) => b.n - a.n);

const enriched = indexableEpisodeSlugs();
const missing = episodes.filter(ep => !enriched.has(ep.slug));

for (const ep of missing) {
  const file = existsSync(join(process.cwd(), 'src/content/podcast', `${ep.slug}.md`)) ? 'no summary_en' : 'no .md file';
  console.log(`#${String(ep.n).padEnd(3)} ${ep.level}  ${ep.slug}  (${file})`);
}
console.log(`\n${missing.length} / ${episodes.length} published episodes to enrich ` +
  `(${episodes.length - missing.length} indexable).`);

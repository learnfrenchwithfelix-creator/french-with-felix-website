// Reads the per-episode extras (src/content/podcast/<slug>.md) straight from disk, for code that
// can't use Astro content collections: the sitemap filter in astro.config.mjs and the scripts.
// Pages use the `episodes` collection instead. Both apply the same rule (isIndexableEpisode):
// an episode is indexable only when summary_en is filled; `npm run check:links` fails if the
// sitemap and the pages' robots tags ever disagree.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(process.cwd(), 'src/content/podcast');

/** Whether the frontmatter has a non-empty `summary_en` (inline, block scalar or indented plain text). */
export function hasSummary(frontmatter) {
  const lines = frontmatter.split(/\r?\n/);
  const i = lines.findIndex(l => /^summary_en:/.test(l));
  if (i === -1) return false;
  const inline = lines[i].replace(/^summary_en:/, '').trim();
  if (inline && !/^[>|][+-]?$/.test(inline)) return !/^["']\s*["']$/.test(inline); // "" or '' = empty
  // Block scalar (> or |) or plain value continued on the next indented lines
  for (const next of lines.slice(i + 1)) {
    if (!/^\s/.test(next)) break; // back to a top-level key
    if (next.trim()) return true;
  }
  return false;
}

/** Slugs of the episodes whose extras file has a summary_en. */
export function indexableEpisodeSlugs() {
  if (!existsSync(DIR)) return new Set();
  const slugs = new Set();
  for (const file of readdirSync(DIR).filter(f => f.endsWith('.md'))) {
    const fm = readFileSync(join(DIR, file), 'utf-8').split(/^---\s*$/m)[1] ?? '';
    if (hasSummary(fm)) slugs.add(file.replace(/\.md$/, ''));
  }
  return slugs;
}

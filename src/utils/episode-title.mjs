// SEO <title> and meta description for podcast episode pages (the H1 stays the YouTube title).
// Shared by src/pages/podcast/[slug].astro and scripts/podcast-titles.mjs. See CLAUDE.md.

// Generic series labels that YouTube titles carry, longest first (matched case-insensitively)
const GENERIC_LABELS = [
  'learn french with comprehensible input',
  'slow french comprehensible input',
  'french comprehensible input',
  'comprehensible input',
  'intermediate french podcast',
  'french intermediate podcast',
  'slow french podcast',
  'intermediate french',
  'french intermediate',
  'slow french',
  'easy french news',
  'easy french',
];
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const LABEL = GENERIC_LABELS.map(escape).join('|');
const SEP = '[|:–—-]';

/**
 * YouTube title without this episode's "#NN" and without generic labels
 * ("… - slow french comprehensible input #93" → "…"). Other numbers stay ("Memes #2").
 */
export function cleanEpisodeTitle(title, episodeNumber) {
  return title
    .replace(new RegExp(`\\s*#\\s*${episodeNumber}(?!\\d)`, 'g'), '')        // its own episode number only
    .replace(new RegExp(`\\(\\s*(?:${LABEL})\\s*\\)`, 'gi'), '')              // "(Slow French Comprehensible Input)"
    .replace(new RegExp(`^\\s*(?:${LABEL})\\s*${SEP}\\s*`, 'i'), '')          // "French Comprehensible Input | …"
    .replace(new RegExp(`\\s*${SEP}\\s*(?:${LABEL})\\s*$`, 'i'), '')          // "… - Intermediate French"
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(new RegExp(`[\\s${SEP.slice(1, -1)}]+$`), '')
    .trim();
}

/** <title>: `seoTitle` verbatim when set, else "<clean title> — French Podcast Ep. NN (LEVEL)". */
export function episodeSeoTitle({ title, episodeNumber, level }, seoTitle) {
  if (seoTitle?.trim()) return seoTitle.trim();
  return `${cleanEpisodeTitle(title, episodeNumber)} — French Podcast Ep. ${episodeNumber} (${level})`;
}

/** Meta description: the English summary when set, else an English template. */
export function episodeDescription({ title, episodeNumber, level, duration, wpm }, summary) {
  if (summary?.trim()) return summary.replace(/\s+/g, ' ').trim();
  const speed = wpm > 0 ? ` · ${wpm} wpm` : '';
  return `Episode ${episodeNumber} of the Liminal French podcast: ${cleanEpisodeTitle(title, episodeNumber)}. ` +
    `Level ${level} · ${duration}${speed}. Full French transcript.`;
}

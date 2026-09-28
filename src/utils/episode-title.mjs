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

// Short function words that give a title's language away (ambiguous ones like "a", "in", "on" left out)
const FR_WORDS = new Set(('le la les l un une des du de d je j tu il elle on nous vous ils elles me m te t se s ce c ça ' +
  'est sont suis ai as avez avons ont pas ne n que qu qui quoi pour avec dans sur en au aux mon ma mes ton ta tes ' +
  'son sa ses votre vos notre nos leur leurs et ou mais donc plus moins très trop faut peut doit fait être avoir ' +
  'aller comment pourquoi quand où y').split(' '));
const EN_WORDS = new Set(('the an to of and or with for at by how why what when your you my i me is are be do don t ' +
  'can this that it from learn about too soon make these faster improve').split(' '));

/**
 * Language of an episode title, for the `lang` attribute of its H1 and cards: "en" when it has more
 * English than French function words, else "fr" (the podcast is in French). `titleLang` in the
 * episode's extras file overrides it (e.g. "Easy French News" has no telltale word).
 */
export function episodeTitleLang(title, episodeNumber, override) {
  if (override) return override;
  const words = cleanEpisodeTitle(title, episodeNumber).toLowerCase().split(/[^a-zà-ÿœæ]+/).filter(Boolean);
  const count = set => words.filter(w => set.has(w)).length;
  return count(EN_WORDS) > count(FR_WORDS) ? 'en' : 'fr';
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

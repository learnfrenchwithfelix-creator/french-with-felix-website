import { getCollection } from 'astro:content';
import { parsePodcastCSV, type PodcastEpisodeRow } from './parsePodcastCSV';
import { fetchSpotifyEpisodes } from './spotify';
import { isPublished } from './content';
import { episodeTitleLang } from './episode-title.mjs';

export interface Episode extends PodcastEpisodeRow {
  spotifyEpisodeId: string | null;
  titleEn:          string | null;
  description:      string | null;
  // publishDate is inherited from PodcastEpisodeRow (CSV col 12)
  spotifyUrl:       string | null;
  /** Language of titleFr (the YouTube title), for the `lang` attribute of the H1 and cards */
  titleLang:        'fr' | 'en';
}

/**
 * Merges CSV data with Spotify metadata and returns the published episodes
 * (see isPublished), newest first: numbered episodes by number, and each unnumbered one (e.g. a video
 * from the Liminal French channel) just before the numbered episodes published on or before its date.
 */
export async function fetchEpisodes(): Promise<Episode[]> {
  const csvEpisodes = parsePodcastCSV().filter(ep => isPublished(ep));
  const spotifyMap = await fetchSpotifyEpisodes();
  // titleLang overrides from the per-episode extras (src/content/podcast/<slug>.md)
  const titleLangOverride = new Map((await getCollection('episodes')).map(e => [e.id, e.data.titleLang]));

  return csvEpisodes
    .map(ep => {
      const spotify = ep.episodeNumber ? spotifyMap.get(ep.episodeNumber) : undefined;
      return {
        ...ep,
        spotifyEpisodeId: spotify?.spotifyEpisodeId ?? null,
        titleEn:          spotify?.titleEn ?? null,
        description:      spotify?.description ?? null,
        // CSV publishDate takes precedence; Spotify date is ignored (CSV is source of truth)
        spotifyUrl:       spotify?.spotifyUrl ?? null,
        titleLang:        episodeTitleLang(ep.titleFr, ep.episodeNumber, titleLangOverride.get(ep.slug)),
      };
    })
    .reduce<Episode[]>((list, ep, i, all) => {
      if (i === 0) list.push(...all.filter(e => e.episodeNumber).sort((a, b) => b.episodeNumber! - a.episodeNumber!));
      if (ep.episodeNumber) return list;
      const at = list.findIndex(e => (e.publishDate ?? '') <= (ep.publishDate ?? ''));
      list.splice(at === -1 ? list.length : at, 0, ep);
      return list;
    }, []);
}

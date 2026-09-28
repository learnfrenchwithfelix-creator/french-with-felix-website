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
 * (see isPublished) sorted by episode number descending (newest first).
 */
export async function fetchEpisodes(): Promise<Episode[]> {
  const csvEpisodes = parsePodcastCSV().filter(ep => isPublished(ep));
  const spotifyMap = await fetchSpotifyEpisodes();
  // titleLang overrides from the per-episode extras (src/content/podcast/<slug>.md)
  const titleLangOverride = new Map((await getCollection('episodes')).map(e => [e.id, e.data.titleLang]));

  return csvEpisodes
    .map(ep => {
      const spotify = spotifyMap.get(ep.episodeNumber);
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
    .sort((a, b) => b.episodeNumber - a.episodeNumber);
}

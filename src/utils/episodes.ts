import { parsePodcastCSV, type PodcastEpisodeRow } from './parsePodcastCSV';
import { fetchSpotifyEpisodes } from './spotify';

export interface Episode extends PodcastEpisodeRow {
  spotifyEpisodeId: string | null;
  titleEn:          string | null;
  description:      string | null;
  // publishDate is inherited from PodcastEpisodeRow (CSV col 12)
  spotifyUrl:       string | null;
}

/**
 * Merges CSV data with Spotify metadata and returns episodes sorted by
 * episode number descending (newest first).
 */
export async function fetchEpisodes(): Promise<Episode[]> {
  const csvEpisodes = parsePodcastCSV();
  const spotifyMap = await fetchSpotifyEpisodes();

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
      };
    })
    .sort((a, b) => b.episodeNumber - a.episodeNumber);
}

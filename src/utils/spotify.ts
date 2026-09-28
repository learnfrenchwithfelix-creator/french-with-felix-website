export interface SpotifyEpisodeData {
  spotifyEpisodeId: string;
  titleEn: string;
  description: string;
  publishDate: string;
  coverImage: string;
  spotifyUrl: string;
}

async function getSpotifyToken(): Promise<string | null> {
  const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    console.error(`[spotify] Token request failed: ${res.status}`);
    return null;
  }

  const data = await res.json();
  return (data.access_token as string) ?? null;
}

// Expects episode names formatted like "Episode Title - Intermediate French #79"
function extractEpisodeNumber(name: string): number | null {
  const m = name.match(/#(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/**
 * Fetches all episodes from the configured Spotify show and returns a map
 * keyed by episode number (extracted from the episode name via #NN pattern).
 * Returns an empty map if credentials are missing or the API call fails.
 */
export async function fetchSpotifyEpisodes(): Promise<Map<number, SpotifyEpisodeData>> {
  const showId = import.meta.env.SPOTIFY_SHOW_ID;
  const episodeMap = new Map<number, SpotifyEpisodeData>();

  const token = await getSpotifyToken();
  if (!token || !showId) {
    console.warn('[spotify] Credentials or show ID missing — skipping Spotify enrichment');
    return episodeMap;
  }

  let url: string | null =
    `https://api.spotify.com/v1/shows/${showId}/episodes?limit=50&market=US`;

  while (url) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error(`[spotify] Episodes API error: ${res.status}`);
      break;
    }

    const data = await res.json();

    for (const ep of (data.items as any[]) ?? []) {
      const num = extractEpisodeNumber(ep.name ?? '');
      if (num !== null) {
        episodeMap.set(num, {
          spotifyEpisodeId: ep.id as string,
          titleEn:          ep.name as string,
          description:      (ep.description as string) ?? '',
          publishDate:      (ep.release_date as string) ?? '',
          coverImage:       (ep.images as any[])?.[0]?.url ?? '',
          spotifyUrl:       ep.external_urls?.spotify ?? '',
        });
      }
    }

    url = (data.next as string | null) ?? null;
  }

  return episodeMap;
}

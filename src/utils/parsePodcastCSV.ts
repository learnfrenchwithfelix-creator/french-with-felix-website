import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface PodcastEpisodeRow {
  episodeNumber: number;
  slug: string;
  titleFr: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  theme: string;
  speechRate: string;
  wpm: number;        // 0 when missing from CSV
  wordCount: number;  // 0 when missing from CSV
  duration: string;
  transcriptFile: string;
  youtubeId: string | null;    // col 11
  publishDate: string | null;  // col 12 — ISO date e.g. "2026-07-02"
}

// Google Sheets exports "29:21" as "29:21:00" — strip the trailing :00
function normalizeDuration(raw: string): string {
  const trimmed = raw.trim();
  const parts = trimmed.split(':');
  if (parts.length === 3 && parts[2] === '00') return `${parts[0]}:${parts[1]}`;
  return trimmed;
}

export function parsePodcastCSV(): PodcastEpisodeRow[] {
  const csvPath = join(process.cwd(), 'src/data/liminal_podcast.csv');
  const raw = readFileSync(csvPath, 'utf-8').replace(/^﻿/, ''); // strip BOM

  const lines = raw
    .split('\n')
    .map(l => l.replace(/\r$/, ''))
    .filter(Boolean);

  // Column layout (0-indexed): row_idx, episode_number, slug, title_fr, level,
  //   theme, speech_rate, wpm, word_count, duration, transcript_file, youtube_id, publishDate
  return lines.slice(1).map(line => {
    const cols = line.split(',');
    return {
      episodeNumber:  parseInt(cols[1], 10),
      slug:           cols[2].trim(),
      titleFr:        cols[3].trim(),
      level:          cols[4].trim() as PodcastEpisodeRow['level'],
      theme:          cols[5].trim(),
      speechRate:     cols[6].trim(),
      wpm:            parseInt(cols[7], 10) || 0,
      wordCount:      parseInt(cols[8], 10) || 0,
      duration:       normalizeDuration(cols[9]),
      transcriptFile: (cols[10] ?? '').trim(),
      youtubeId:      (cols[11] ?? '').trim() || null,
      publishDate:    (cols[12] ?? '').trim() || null,
    };
  });
}

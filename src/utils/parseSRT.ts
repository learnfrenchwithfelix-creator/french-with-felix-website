import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// SRT files live at src/content/podcast/, named after the episode slug
// (e.g. "la-vraie-valeur-c-est-le-temps.srt")
const TRANSCRIPTS_DIR = join(process.cwd(), 'src/content/podcast');

export interface TranscriptParagraph {
  timecode: string; // "m:ss" display label
  seconds: number;  // for YouTube seekTo()
  text: string;
}

// "00:29:05,133" → integer seconds
function parseTimestamp(ts: string): number {
  const [time] = ts.split(',');
  const [h, m, s] = time.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

// 1745 → "29:05"
function formatTimecode(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = String(totalSeconds % 60).padStart(2, '0');
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${s}`;
  return `${m}:${s}`;
}

/**
 * Parses the SRT transcript for the given episode slug.
 * Returns paragraphs of ~80–110 words, each carrying the timecode of its
 * first SRT block (used to seek the YouTube player on click).
 */
export function parseSRT(slug: string): TranscriptParagraph[] {
  let raw: string;
  try {
    raw = readFileSync(join(TRANSCRIPTS_DIR, `${slug}.srt`), 'utf-8')
      .replace(/^﻿/, '')   // strip BOM
      .replace(/\r\n/g, '\n') // normalize Windows CRLF → LF
      .replace(/\r/g, '\n');  // normalize stray CR → LF
  } catch {
    return [];
  }

  // Parse every SRT block into { seconds, words[] }
  interface Block { seconds: number; words: string[] }
  const blocks: Block[] = [];

  for (const block of raw.split(/\n\n+/)) {
    const lines = block.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) continue;

    let startSeconds = 0;
    let hasTimestamp = false;
    const textLines: string[] = [];

    for (const line of lines) {
      if (/^\d+$/.test(line)) continue; // block index
      if (/^\d{2}:\d{2}:\d{2},\d{3}\s*-->/.test(line)) {
        startSeconds = parseTimestamp(line.split('-->')[0].trim());
        hasTimestamp = true;
      } else {
        textLines.push(line);
      }
    }

    if (!hasTimestamp || textLines.length === 0) continue;
    const words = textLines.join(' ').split(/\s+/).filter(Boolean);
    if (words.length > 0) blocks.push({ seconds: startSeconds, words });
  }

  // Group into paragraphs of ~80 words. Sentences often end mid-block, so we break at the first
  // sentence end once past MIN_WORDS, even inside a block; the paragraph that follows takes the
  // timecode of the block its first word comes from. If no sentence ends by MAX_WORDS (unpunctuated
  // stretches), we break at the next block boundary instead so no paragraph grows unbounded.
  const MIN_WORDS = 80;
  const MAX_WORDS = 110;
  const SENTENCE_END = /[.!?…]["»”)]*$/;

  const paragraphs: TranscriptParagraph[] = [];
  let currentWords: string[] = [];
  let currentSeconds = 0;

  const flush = () => {
    if (currentWords.length === 0) return;
    paragraphs.push({
      timecode: formatTimecode(currentSeconds),
      seconds: currentSeconds,
      text: currentWords.join(' '),
    });
    currentWords = [];
  };

  for (const block of blocks) {
    for (const word of block.words) {
      if (currentWords.length === 0) currentSeconds = block.seconds;
      currentWords.push(word);
      if (currentWords.length >= MIN_WORDS && SENTENCE_END.test(word)) flush();
    }
    if (currentWords.length >= MAX_WORDS) flush();
  }
  flush();

  return paragraphs;
}

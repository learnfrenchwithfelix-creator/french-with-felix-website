import type { APIRoute, GetStaticPaths } from 'astro';
import { parsePodcastCSV } from '../../../utils/parsePodcastCSV';
import { parseSRT } from '../../../utils/parseSRT';

// Static plain-text transcript per episode: /podcast/<slug>/transcript.txt
export const getStaticPaths = (() =>
  parsePodcastCSV().map(ep => ({ params: { slug: ep.slug }, props: { ep } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const ep = props.ep as ReturnType<typeof parsePodcastCSV>[number];
  const paragraphs = parseSRT(ep.slug);

  const header = [
    `Liminal French Podcast — Episode ${ep.episodeNumber}`,
    ep.titleFr,
    `Level ${ep.level} · ${ep.duration}${ep.wpm > 0 ? ` · ${ep.wpm} wpm` : ''}`,
    `https://frenchwithfelix.com/podcast/${ep.slug}`,
  ].join('\n');

  const body = paragraphs.length
    ? paragraphs.map(p => `[${p.timecode}]\n${p.text}`).join('\n\n')
    : 'Transcript not yet available for this episode.';

  return new Response(`${header}\n\n${'—'.repeat(20)}\n\n${body}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

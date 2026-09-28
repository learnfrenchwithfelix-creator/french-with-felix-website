// schema.org (JSON-LD) builders. Every page emits one @graph through src/components/seo/JsonLd.astro:
// the site-wide nodes (Organization, WebSite, Person) plus the page's own nodes built here.
// Nodes reference each other by @id, so each entity is described once. URLs and names come from
// src/config/site.ts and src/data/author.ts. See CLAUDE.md → "Structured data".
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { siteUrl, social, podcastName, podcastRssUrl, logoPath } from '../config/site';
import { author } from '../data/author';

type Node = Record<string, unknown>;

export const ids = {
  organization: `${siteUrl}/#organization`,
  website:      `${siteUrl}/#website`,
  person:       `${siteUrl}/about/#felix`,
  podcast:      `${siteUrl}/podcast/#series`,
};

/** Absolute URL for a site path ("/blog/x/" → "https://liminalfrench.com/blog/x/"). */
export const abs = (path: string) => new URL(path, siteUrl).href;

/**
 * Canonical URL of a page from its path: absolute on siteUrl, trailing slash added (URL convention),
 * query string and hash dropped. Files (a dot in the last segment) keep their path as is.
 */
export function canonicalUrl(pathname: string): string {
  let path = pathname.split(/[?#]/)[0] || '/';
  const last = path.split('/').pop() ?? '';
  if (!path.endsWith('/') && !last.includes('.')) path += '/';
  return abs(path);
}

/** Absolute URL of a file in public/, or undefined when the file doesn't exist. */
export function publicFileUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  return existsSync(join(process.cwd(), 'public', path)) ? abs(path) : undefined;
}

/** "10:22" / "1:02:03" → "PT10M22S" / "PT1H2M3S" (ISO 8601 duration). */
export function isoDuration(duration: string): string | undefined {
  const parts = duration.split(':').map(Number);
  if (parts.some(Number.isNaN) || parts.length < 2 || parts.length > 3) return undefined;
  const [h, m, s] = parts.length === 3 ? parts : [0, ...parts];
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s || (!h && !m) ? `${s}S` : ''}`;
}

const sameAs = Object.values(social).filter(Boolean);

/** Nodes present on every page. */
export function siteNodes(): Node[] {
  const logo = publicFileUrl(logoPath);
  return [
    {
      '@type': 'Organization',
      '@id': ids.organization,
      name: 'Liminal French',
      url: siteUrl,
      ...(logo ? { logo } : {}),
      sameAs,
      founder: { '@id': ids.person },
    },
    {
      '@type': 'WebSite',
      '@id': ids.website,
      name: 'Liminal French',
      url: siteUrl,
      inLanguage: 'en',
      publisher: { '@id': ids.organization },
    },
    {
      '@type': 'Person',
      '@id': ids.person,
      name: author.name,
      url: author.url,
      jobTitle: author.jobTitle,
      description: author.description,
      ...(author.image ? { image: abs(author.image) } : {}), // TODO in author.ts: a real photo
      knowsLanguage: author.knowsLanguage,
      sameAs: author.sameAs,
      worksFor: { '@id': ids.organization },
    },
  ];
}

/** BreadcrumbList from [name, path] pairs, starting after Home. */
export function breadcrumbs(trail: [name: string, path: string][]): Node {
  const items = [['Home', '/'], ...trail] as [string, string][];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: abs(path),
    })),
  };
}

export function articleNode(a: {
  path: string;
  title: string;
  description?: string;
  publishDate: Date;
  updatedDate?: Date;
  image?: string;
  lang?: string;
}): Node {
  const url = abs(a.path);
  const image = publicFileUrl(a.image);
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: a.title,
    ...(a.description ? { description: a.description } : {}),
    datePublished: a.publishDate.toISOString(),
    dateModified: (a.updatedDate ?? a.publishDate).toISOString(),
    author: { '@id': ids.person },
    publisher: { '@id': ids.organization },
    mainEntityOfPage: url,
    inLanguage: a.lang ?? 'en',
    ...(image ? { image } : {}),
  };
}

/** The podcast series: on /podcast/, and on every episode page for its partOfSeries reference. */
export function podcastSeriesNode(description?: string): Node {
  return {
    '@type': 'PodcastSeries',
    '@id': ids.podcast,
    name: podcastName,
    url: abs('/podcast/'),
    ...(description ? { description } : {}),
    webFeed: podcastRssUrl,
    inLanguage: 'fr',
    author: { '@id': ids.person },
    publisher: { '@id': ids.organization },
    sameAs: [social.spotify, social.applePodcasts].filter(Boolean),
  };
}

/**
 * PodcastEpisode, its PodcastSeries (so partOfSeries resolves on the page itself), and its YouTube
 * VideoObject when the episode has a video and a date.
 */
export function episodeNodes(ep: {
  path: string;
  name: string;
  description: string;
  episodeNumber: number;
  publishDate: string | null;
  duration: string;
  youtubeId: string | null;
  transcript: string;
}): Node[] {
  const url = abs(ep.path);
  const duration = isoDuration(ep.duration);
  const video: Node | null = ep.youtubeId && ep.publishDate
    ? {
        '@type': 'VideoObject',
        '@id': `${url}#video`,
        name: ep.name,
        description: ep.description,
        thumbnailUrl: `https://img.youtube.com/vi/${ep.youtubeId}/maxresdefault.jpg`,
        uploadDate: ep.publishDate,
        ...(duration ? { duration } : {}),
        embedUrl: `https://www.youtube.com/embed/${ep.youtubeId}`,
        url: `https://www.youtube.com/watch?v=${ep.youtubeId}`,
        inLanguage: 'fr',
        ...(ep.transcript ? { transcript: ep.transcript } : {}),
      }
    : null;
  const episode: Node = {
    '@type': 'PodcastEpisode',
    '@id': `${url}#episode`,
    name: ep.name,
    description: ep.description,
    url,
    episodeNumber: ep.episodeNumber,
    ...(ep.publishDate ? { datePublished: ep.publishDate } : {}),
    ...(duration ? { timeRequired: duration } : {}),
    inLanguage: 'fr',
    partOfSeries: { '@id': ids.podcast },
    author: { '@id': ids.person },
    ...(video ? { associatedMedia: { '@id': video['@id'] } } : {}),
  };
  return [episode, podcastSeriesNode(), ...(video ? [video] : [])];
}

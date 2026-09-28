// Internal links between blog articles and podcast episodes, from ONE source of truth:
// `relatedEpisode` in an article's frontmatter. The episode page shows that article in return
// ("Read the article"); `relatedArticle` in the episode's extras file only overrides that default.
// Unknown slugs fail the build rather than rendering a broken link.
import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublished } from './content';
import { parsePodcastCSV, type PodcastEpisodeRow } from './parsePodcastCSV';

type Article = CollectionEntry<'blog'>;

let cache: { articles: Article[]; episodes: Map<string, PodcastEpisodeRow>; overrides: Map<string, string> } | null = null;

async function load() {
  if (cache) return cache;
  const articles = await getCollection('blog', ({ data }) => isPublished(data));
  const episodes = new Map(parsePodcastCSV().filter(ep => isPublished(ep)).map(ep => [ep.slug, ep]));
  const overrides = new Map(
    (await getCollection('episodes')).filter(e => e.data.relatedArticle).map(e => [e.id, e.data.relatedArticle!]),
  );

  const errors: string[] = [];
  for (const a of articles) {
    const slug = a.data.relatedEpisode;
    if (slug && !episodes.has(slug)) errors.push(`content/blog/${a.id}.md: relatedEpisode "${slug}" is not a published episode`);
  }
  const articleIds = new Set(articles.map(a => a.id));
  for (const [episode, article] of overrides) {
    if (!articleIds.has(article)) errors.push(`src/content/podcast/${episode}.md: relatedArticle "${article}" is not a published article`);
  }
  if (errors.length) throw new Error(errors.join('\n'));

  cache = { articles, episodes, overrides };
  return cache;
}

/** The episode an article comes from (its `relatedEpisode`), or null. */
export async function episodeForArticle(article: Article): Promise<PodcastEpisodeRow | null> {
  const { episodes } = await load();
  return article.data.relatedEpisode ? episodes.get(article.data.relatedEpisode) ?? null : null;
}

/**
 * The article to show on an episode page: `relatedArticle` in its extras file when set, else the
 * article whose relatedEpisode is this episode (the lowest article number if several do).
 */
export async function articleForEpisode(episodeSlug: string): Promise<Article | null> {
  const { articles, overrides } = await load();
  const override = overrides.get(episodeSlug);
  if (override) return articles.find(a => a.id === override) ?? null;
  return articles
    .filter(a => a.data.relatedEpisode === episodeSlug)
    .sort((a, b) => a.data.articleNumber - b.data.articleNumber)[0] ?? null;
}

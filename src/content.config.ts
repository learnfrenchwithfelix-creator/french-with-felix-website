import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/blog' }),
  schema: z.object({
    title:          z.string(),
    description:    z.string().optional(),
    articleNumber:  z.number(),
    publishDate:    z.coerce.date(),
    updatedDate:    z.coerce.date().optional(), // last substantial edit → JSON-LD dateModified (falls back to publishDate)
    relatedEpisode: z.string().optional(),      // slug of the podcast episode the article comes from (see src/utils/related.ts)
    level:          z.array(z.string()).optional(),
    category:       z.string(),
    tags:           z.array(z.string()).optional(),
    lang:           z.string().optional(),
    featuredImage:  z.string().optional(),
    featuredImageAlt: z.string().optional(),
    youtubeId:      z.string().optional(),      // video shown under the article header (e.g. a step-by-step tutorial)
    readingTime:    z.number().optional(),
    featured:       z.boolean().optional(),
    draft:          z.boolean().optional(),
  }),
});

// Optional per-episode extras. The podcast CSV (src/data/liminal_podcast.csv) stays the main source;
// src/content/podcast/<slug>.md holds only the fields added on top of it (see CONTENT-SCHEMA.md).
// An episode is indexable only when summary_en is filled (isIndexableEpisode in src/utils/content.ts).
const episodes = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/podcast' }),
  schema: z.object({
    // 2–3 sentences in English: shown as "About this episode" and makes the episode indexable
    summary_en: z.string().trim().min(1, 'summary_en is empty: remove the key or write the summary').optional(),
    // ~10 French → English words or expressions from the episode
    key_vocab: z
      .array(z.object({ fr: z.string().trim().min(1), en: z.string().trim().min(1) }))
      .optional(),
    // Full <title> override; by default the title is built by episodeSeoTitle() (src/utils/episode-title.mjs)
    seoTitle: z.string().trim().min(1, 'seoTitle is empty: remove the key or write the title').optional(),
    // Language of the YouTube title (H1 and cards), when the automatic detection gets it wrong
    titleLang: z.enum(['fr', 'en']).optional(),
    // The episode's own Apple Podcasts page; without it the Apple button links to the show
    appleEpisodeUrl: z.string().url().optional(),
    // Blog article to show on the episode page, only to override the default (the article whose
    // relatedEpisode is this episode) — see src/utils/related.ts
    relatedArticle: z.string().optional(),
  }),
});

// Library: Félix's reading videos (a French text read on YouTube, its grammar points and a free PDF).
// One file per video in content/library/<slug>.md; the body is the French text. See CONTENT-SCHEMA.md.
const library = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/library' }),
  schema: z.object({
    title:       z.string(),                    // French title of the text (H1, lang="fr")
    titleEn:     z.string(),                    // English translation, shown under it
    description: z.string(),                    // meta description, in English
    level:       z.array(z.enum(['A1', 'A2', 'B1', 'B2'])).min(1).max(2),
    youtubeId:   z.string().optional(),
    pdf:         z.string().regex(/^\/library\/.+\.pdf$/, 'pdf must be a file in public/library/'),
    publishDate: z.coerce.date(),
    draft:       z.boolean().optional(),
    wordCount:   z.number().optional(),         // distinct words the text is written with ("Only 110 words")
    grammar: z
      .array(z.object({ title: z.string(), explanation: z.string(), example: z.string() }))
      .optional(),
  }),
});

export const collections = { blog, episodes, library };

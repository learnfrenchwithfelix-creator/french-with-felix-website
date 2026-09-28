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
    level:          z.array(z.string()).optional(),
    category:       z.string(),
    tags:           z.array(z.string()).optional(),
    lang:           z.string().optional(),
    featuredImage:  z.string().optional(),
    featuredImageAlt: z.string().optional(),
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
  }),
});

export const collections = { blog, episodes };

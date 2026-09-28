import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/blog' }),
  schema: z.object({
    title:          z.string(),
    description:    z.string().optional(),
    articleNumber:  z.number(),
    publishDate:    z.coerce.date(),
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

export const collections = { blog };

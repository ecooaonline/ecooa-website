import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(),
    category: z.enum(['medicina', 'estetica', 'nutricao', 'saude-mental', 'longevidade', 'ecooa']),
    tags: z.array(z.string()),
    image: z.string().optional(),
    highlight: z.string().optional(),
    lastModified: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };

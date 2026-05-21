import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog posts: ideas, experiences, dev logs.
const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			heroImage: image().optional(),
			draft: z.boolean().default(false),
			relatedProjects: z.array(z.string()).default([]),
		}),
});

// Projects: the showcase. Adding one = a single Markdown file (+ optional thumbnail).
const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			summary: z.string(),
			date: z.coerce.date(),
			status: z.enum(['wip', 'active', 'archived']).default('active'),
			tags: z.array(z.string()).default([]),
			thumbnail: image().optional(),
			repo: z.string().url().optional(),
			demo: z.string().url().optional(),
			featured: z.boolean().default(false),
			order: z.number().default(0),
			relatedPosts: z.array(z.string()).default([]),
		}),
});

export const collections = { posts, projects };

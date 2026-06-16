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
			// 'ai' marks an AI-assisted artifact so it can be disclosed to readers.
			authorship: z.enum(['human', 'ai']).default('human'),
			// Writing depth facet: quick "musing" vs long-form "essay".
			kind: z.enum(['musing', 'essay']).default('musing'),
			// Curation: pinned on top of the Writing index + eligible for homepage Highlights.
			featured: z.boolean().default(false),
			order: z.number().default(0),
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
			updatedDate: z.coerce.date().optional(),
			status: z.enum(['wip', 'active', 'archived']).default('active'),
			tags: z.array(z.string()).default([]),
			thumbnail: image().optional(),
			repo: z.string().url().optional(),
			demo: z.string().url().optional(),
			featured: z.boolean().default(false),
			order: z.number().default(0),
			relatedPosts: z.array(z.string()).default([]),
			// 'ai' marks an AI-assisted artifact so it can be disclosed to readers.
			authorship: z.enum(['human', 'ai']).default('human'),
		}),
});

export const collections = { posts, projects };

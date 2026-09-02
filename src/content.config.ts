import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { POST_KINDS } from './lib/content';

// Blog posts: dated accounts — how-tos, devlogs, essays, notes.
const posts = defineCollection({
	loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// Optional only for notes; the listing copy for everything else.
			description: z.string().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			tags: z.array(z.string()).default([]),
			heroImage: image().optional(),
			draft: z.boolean().default(false),
			// One-way wiring: a post names its projects; a project page derives
			// its "Writing about this" list by querying posts. `reference()` makes
			// a dangling project id a build failure instead of a silently dropped
			// link (two Unreal posts pointed at a project that never existed and
			// the build dropped the link silently, found 2026-09-02).
			relatedProjects: z.array(reference('projects')).default([]),
			// 'ai' marks an AI-assisted artifact so it can be disclosed to readers.
			authorship: z.enum(['human', 'ai']).default('human'),
			// Required, not defaulted: a forgotten kind would silently hide a post
			// as a note, and the build should refuse that instead.
			kind: z.enum(POST_KINDS),
			// Curation: pinned on top of the Writing index + eligible for homepage Highlights.
			featured: z.boolean().default(false),
			order: z.number().default(0),
		})
		.refine((d) => d.kind === 'note' || typeof d.description === 'string', {
			message: 'description is required unless kind is "note"',
			path: ['description'],
		}),
});

// Projects: the showcase. Adding one = a folder with index.md (+ optional thumbnail).
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
			// 'ai' marks an AI-assisted artifact so it can be disclosed to readers.
			authorship: z.enum(['human', 'ai']).default('human'),
		}),
});

// Gallery: things made elsewhere — artwork, videos, renders — shown here as one
// optimized thumbnail each and linked out to where they live (ArtStation,
// YouTube, …). No detail page; the repo never hosts the full-size media.
const gallery = defineCollection({
	loader: glob({ base: './src/content/gallery', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			date: z.coerce.date(),
			thumbnail: image(),
			href: z.string().url(),
			// Where the link goes, as shown to readers: "ArtStation", "YouTube", …
			source: z.string(),
			blurb: z.string().optional(),
			tags: z.array(z.string()).default([]),
			featured: z.boolean().default(false),
		}),
});

export const collections = { posts, projects, gallery };

import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { POST_KINDS, SERIES_IDS } from './lib/content';

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
			// its "Writing about this" list by querying posts. A dangling project id
			// must fail the build, not drop the link silently (two Unreal posts
			// pointed at a project that never existed, found 2026-09-02). Astro 7
			// `reference()` only logs one, so the blog route throws on it.
			relatedProjects: z.array(reference('projects')).default([]),
			// A post that continues an earlier one: registered series id + part
			// number (1..n, no gaps — checked at build by `seriesParts`).
			series: z.object({ id: z.enum(SERIES_IDS), part: z.number().int().min(1) }).optional(),
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

// Guides: evergreen multi-page references, revised in place. One folder per
// guide; its `index.md` is the contents page and each sibling `.md` is a chapter
// (`guides/<guide>/<chapter>`). Not posts: chapters are not dated accounts and
// would otherwise flood the timeline, RSS, and Writing index.
const guides = defineCollection({
	loader: glob({ base: './src/content/guides', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Date the content was last checked against its sources.
		reviewed: z.coerce.date(),
		// Contents page only: the day the guide first appeared. Its fixed spot on
		// the home timeline, which never moves to a later `reviewed` date.
		published: z.coerce.date().optional(),
		// Reading position within the guide; the index page is 0.
		order: z.number().int().min(0),
		// Set on chapters about one of the author's own projects rather than the
		// general subject: names that project and renders a "Project case study"
		// banner linking to it. Astro only logs a dangling reference, so the
		// guides route throws on one rather than dropping the banner.
		caseStudy: reference('projects').optional(),
		// 'ai' marks an AI-assisted artifact so it can be disclosed to readers.
		authorship: z.enum(['human', 'ai']).default('human'),
	}),
});

export const collections = { posts, projects, gallery, guides };

// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://greenwoodms06.github.io',
	base: '/',
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Source Serif 4',
			cssVariable: '--font-source-serif',
			weights: [400, 600],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
			fallbacks: ['Georgia', 'Times New Roman', 'serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'IBM Plex Sans',
			cssVariable: '--font-plex-sans',
			weights: [400, 500, 600],
			subsets: ['latin'],
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'IBM Plex Mono',
			cssVariable: '--font-plex-mono',
			weights: [400, 500],
			subsets: ['latin'],
			fallbacks: ['ui-monospace', 'monospace'],
		},
	],
	// Astro 7's default, compressHTML: 'jsx', drops the template newlines between
	// sibling expressions (the author list rendered "Greenwood , M. Naranjo" under
	// the classic mode on the Rust compiler). Separators in this markup sit on the
	// same line as their tags, which JSX rules preserve.
	compressHTML: 'jsx',
	markdown: {
		// Astro 7's Sätteri processor applies GFM (tables, task lists) to .md and
		// .mdx alike, so the remark-gfm plugin that used to fix .mdx tables is gone.
		shikiConfig: {
			theme: 'github-light',
			wrap: true,
		},
	},
});

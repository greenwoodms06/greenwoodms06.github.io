// Link integrity for guides, checked from the markdown sources. The build does
// not fail on a broken internal link, and guides are dense with them (their
// chapters were lifted from a folder of relative `.md` links on 2026-10-21).
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync, statSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const CONTENT = join(process.cwd(), 'src/content');
const GUIDES = join(CONTENT, 'guides');

const guideIds = readdirSync(GUIDES).filter((d) => statSync(join(GUIDES, d)).isDirectory());

// The source file behind a site URL path, or undefined. `index` is never part
// of a URL (the glob loader strips it), so `/guides/x/index` is a broken link.
function entryFile(collection: string, id: string): string | undefined {
	if (id === 'index' || id.endsWith('/index')) return undefined;
	const base = join(CONTENT, collection, id.replace(/\/$/, ''));
	return ['.md', '.mdx', '/index.md', '/index.mdx'].map((e) => base + e).find(existsSync);
}

// Heading anchors as Astro generates them (github-slugger rules, ASCII text).
function anchors(file: string): Set<string> {
	const text = readFileSync(file, 'utf-8');
	return new Set(
		[...text.matchAll(/^#{1,6}\s+(.+)$/gm)].map((m) =>
			m[1].trim().toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-'),
		),
	);
}

// Every link target in a markdown/MDX file: inline links (with or without a
// title), reference definitions, and raw href/src attributes.
function targets(text: string): string[] {
	return [
		...[...text.matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)].map((m) => m[1]),
		...[...text.matchAll(/^\s*\[[^\]]+\]:\s*<?(\S+?)>?(?:\s|$)/gm)].map((m) => m[1]),
		...[...text.matchAll(/\b(?:href|src)="([^"{]+)"/g)].map((m) => m[1]),
	];
}

// Every page that links into guides: the guides themselves plus any post or
// project that mentions /guides/.
function linkingFiles(): string[] {
	const out: string[] = [];
	const walk = (dir: string) => {
		for (const name of readdirSync(dir)) {
			const p = join(dir, name);
			if (statSync(p).isDirectory()) walk(p);
			else if (/\.mdx?$/.test(name)) {
				if (p.startsWith(GUIDES) || readFileSync(p, 'utf-8').includes('/guides/')) out.push(p);
			}
		}
	};
	walk(CONTENT);
	return out;
}

const ROUTES: [string, string][] = [
	['/guides/', 'guides'],
	['/blog/', 'posts'],
	['/projects/', 'projects'],
];

function brokenLinks(file: string): string[] {
	const broken: string[] = [];
	for (const target of targets(readFileSync(file, 'utf-8'))) {
		if (/^(https?:|mailto:)/.test(target)) continue;
		const [path, hash] = target.split('#');
		let source: string | undefined;
		if (path === '') source = file; // same-page anchor
		else if (path.startsWith('./')) {
			if (!existsSync(join(file, '..', path))) broken.push(target);
			continue;
		} else {
			const route = ROUTES.find(([prefix]) => path.startsWith(prefix));
			source = route && entryFile(route[1], path.slice(route[0].length));
			// A draft post is not built in production, so a link to it is broken too.
			if (source && /^draft:\s*true/m.test(readFileSync(source, 'utf-8'))) source = undefined;
		}
		if (!source || (hash && !anchors(source).has(hash))) broken.push(target);
	}
	return broken;
}

describe('guide links', () => {
	it.each(linkingFiles().map((f) => [f.slice(CONTENT.length + 1), f]))(
		'%s links only to pages, anchors and files that exist',
		(_, file) => {
			expect(brokenLinks(file)).toEqual([]);
		},
	);

	it('catches the broken-link shapes it exists for', () => {
		const tmp = join(GUIDES, guideIds[0], 'index.md');
		const real = readFileSync(tmp, 'utf-8');
		const cases = [
			'[a](/guides/nope "t")',
			`[b](/guides/${guideIds[0]}/index)`,
			`[c](/guides/${guideIds[0]}#no-such-heading)`,
			'[d][ref]\n\n[ref]: /guides/zzz',
			'<a href="/guides/zzz">e</a>',
			'[f](01-chapter.md)',
		];
		for (const c of cases) {
			const probe = join(process.cwd(), 'node_modules/.guides-link-probe.md');
			writeFileSync(probe, real + '\n' + c + '\n');
			try {
				expect(brokenLinks(probe), c).not.toEqual([]);
			} finally {
				rmSync(probe);
			}
		}
	});

	it.each(guideIds)('the %s contents page lists every chapter, in order', (guide) => {
		const dir = join(GUIDES, guide);
		const chapters = readdirSync(dir)
			.filter((f) => /\.mdx?$/.test(f) && !/^index\./.test(f))
			.map((f) => ({
				slug: f.replace(/\.mdx?$/, ''),
				order: Number(/^order:\s*(\d+)/m.exec(readFileSync(join(dir, f), 'utf-8'))?.[1]),
			}))
			.sort((a, b) => a.order - b.order);
		// The page header says "Chapter N of M" from reading position, and the
		// contents page numbers chapters by hand; contiguous orders keep them equal.
		expect(chapters.map((c) => c.order)).toEqual(chapters.map((_, i) => i + 1));
		const index = readFileSync(join(dir, 'index.md'), 'utf-8');
		const listed = [...index.matchAll(new RegExp(`\\]\\(/guides/${guide}/([^)#\\s]+)`, 'g'))].map((m) => m[1]);
		expect([...new Set(listed)]).toEqual(chapters.map((c) => c.slug));
	});
});

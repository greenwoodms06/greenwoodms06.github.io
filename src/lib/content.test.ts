import { describe, it, expect } from 'vitest';
import {
	sortByDateDesc,
	isPublished,
	displayTags,
	pinnedThenByDate,
	featuredAcross,
	groupByYear,
	isWriting,
	POST_KINDS,
	KIND_LABEL,
	type TimelineItem,
} from './content';
import { publications } from '../data/publications';

describe('content helpers', () => {
	it('sorts entries by date descending', () => {
		const a = { data: { pubDate: new Date('2024-01-01') } };
		const b = { data: { pubDate: new Date('2026-01-01') } };
		expect(sortByDateDesc([a, b], 'pubDate')[0]).toBe(b);
	});

	it('does not mutate the input array', () => {
		const a = { data: { pubDate: new Date('2024-01-01') } };
		const b = { data: { pubDate: new Date('2026-01-01') } };
		const input = [a, b];
		sortByDateDesc(input, 'pubDate');
		expect(input[0]).toBe(a);
	});

	it('treats draft true as unpublished, everything else as published', () => {
		expect(isPublished({ data: { draft: true } })).toBe(false);
		expect(isPublished({ data: { draft: false } })).toBe(true);
		expect(isPublished({ data: {} })).toBe(true);
	});

	it('derives the ai-assisted tag for ai authorship, without duplicating', () => {
		expect(displayTags({ data: { tags: ['x'], authorship: 'ai' } })).toEqual([
			'x',
			'ai-assisted',
		]);
		expect(
			displayTags({ data: { tags: ['ai-assisted'], authorship: 'ai' } }),
		).toEqual(['ai-assisted']);
		expect(displayTags({ data: { tags: ['x'], authorship: 'human' } })).toEqual([
			'x',
		]);
	});

	describe('pinnedThenByDate', () => {
		const mk = (id: string, date: string, extra = {}) => ({
			id,
			data: { date: new Date(date), ...extra },
		});

		it('pins featured items before the rest', () => {
			const a = mk('a', '2020-01-01', { featured: true });
			const b = mk('b', '2026-01-01');
			const out = pinnedThenByDate([b, a], 'date');
			expect(out.map((i) => i.id)).toEqual(['a', 'b']);
		});

		it('orders featured items by `order` ascending', () => {
			const a = mk('a', '2026-01-01', { featured: true, order: 2 });
			const b = mk('b', '2020-01-01', { featured: true, order: 1 });
			expect(pinnedThenByDate([a, b], 'date').map((i) => i.id)).toEqual(['b', 'a']);
		});

		it('orders non-featured items newest first', () => {
			const a = mk('a', '2020-01-01');
			const b = mk('b', '2026-01-01');
			expect(pinnedThenByDate([a, b], 'date').map((i) => i.id)).toEqual(['b', 'a']);
		});

		it('uses updatedDate over the primary key when present', () => {
			const a = mk('a', '2020-01-01', { updatedDate: new Date('2027-01-01') });
			const b = mk('b', '2026-01-01');
			expect(pinnedThenByDate([a, b], 'date').map((i) => i.id)).toEqual(['a', 'b']);
		});

		it('does not mutate the input array', () => {
			const a = mk('a', '2020-01-01', { featured: true });
			const b = mk('b', '2026-01-01');
			const input = [b, a];
			pinnedThenByDate(input, 'date');
			expect(input[0].id).toBe('b');
		});
	});

	describe('featuredAcross', () => {
		it('flattens groups and keeps only featured===true', () => {
			const projects = [{ featured: true, title: 'P' }, { featured: false, title: 'Q' }];
			const pubs = [{ featured: true, title: 'R' }];
			expect(featuredAcross(projects, pubs).map((i) => i.title)).toEqual(['P', 'R']);
		});

		it('returns an empty array when nothing is featured', () => {
			expect(featuredAcross([{ featured: false }], [{ featured: false }])).toEqual([]);
		});

		it('interleaves featured items round-robin so no source starves', () => {
			const a = [
				{ featured: true, id: 'a1' },
				{ featured: true, id: 'a2' },
				{ featured: true, id: 'a3' },
			];
			const b = [{ featured: true, id: 'b1' }];
			const c = [{ featured: true, id: 'c1' }];
			expect(featuredAcross(a, b, c).map((i) => i.id)).toEqual([
				'a1',
				'b1',
				'c1',
				'a2',
				'a3',
			]);
		});
	});
});

describe('post kinds', () => {
	it('every kind has a reader-facing label', () => {
		for (const k of POST_KINDS) expect(typeof KIND_LABEL[k]).toBe('string');
	});

	it('notes are timeline-only; the other kinds are on the Writing index', () => {
		expect(isWriting('note')).toBe(false);
		expect(isWriting('how-to')).toBe(true);
		expect(isWriting('devlog')).toBe(true);
		expect(isWriting('essay')).toBe(true);
	});
});

describe('groupByYear', () => {
	const mk = (title: string, date: string, extra: Partial<TimelineItem> = {}): TimelineItem => ({
		title,
		href: '/x',
		group: 'writing',
		label: 'Essay',
		date: new Date(date),
		...extra,
	});

	it('orders years newest first', () => {
		const out = groupByYear([mk('a', '2020-03-01'), mk('b', '2026-01-01')]);
		expect(out.map((y) => y.year)).toEqual([2026, 2020]);
	});

	it('orders dated items newest first within a year', () => {
		const out = groupByYear([mk('a', '2026-01-01'), mk('b', '2026-06-01')]);
		expect(out[0].items.map((i) => i.title)).toEqual(['b', 'a']);
	});

	it('puts year-only items after dated ones, alphabetically', () => {
		const out = groupByYear([
			mk('zeta', '2026-01-01', { yearOnly: true }),
			mk('alpha', '2026-01-01', { yearOnly: true }),
			mk('dated', '2026-01-01'),
		]);
		expect(out[0].items.map((i) => i.title)).toEqual(['dated', 'alpha', 'zeta']);
	});

	it('does not mutate the input', () => {
		const a = mk('a', '2020-01-01');
		const b = mk('b', '2026-01-01');
		const input = [a, b];
		groupByYear(input);
		expect(input[0]).toBe(a);
	});
});

describe('publications data', () => {
	const TYPES = [
		'journal',
		'conference',
		'report',
		'self-published',
		'thesis',
		'presentation',
		'poster',
		'media',
		'patent',
	];

	it('parses the list with required fields and known types', () => {
		expect(publications.length).toBeGreaterThan(0);
		for (const p of publications) {
			expect(typeof p.title).toBe('string');
			expect(typeof p.year).toBe('number');
			expect(TYPES).toContain(p.type);
		}
	});

	it('every id is unique', () => {
		const ids = publications.map((p) => p.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	// Decision 2026-09-02: self-published, AI-assisted papers stay on the list but
	// never share the "Report" type with institutional technical reports, and
	// always carry the disclosure. This fails if either is undone.
	it('self-published papers are typed as such and disclose AI assistance', () => {
		const self = publications.filter((p) => p.venue?.startsWith('Self-published'));
		expect(self.length).toBeGreaterThan(0);
		for (const p of self) {
			expect(p.type).toBe('self-published');
			expect(p.aiAssisted).toBe(true);
		}
		for (const p of publications.filter((p) => p.type === 'report')) {
			expect(p.venue?.startsWith('Self-published')).toBe(false);
		}
	});
});

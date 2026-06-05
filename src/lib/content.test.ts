import { describe, it, expect } from 'vitest';
import { sortByDateDesc, isPublished, displayTags, pinnedThenByDate } from './content';

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
});

import { describe, it, expect } from 'vitest';
import { sortByDateDesc, isPublished } from './content';

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
});

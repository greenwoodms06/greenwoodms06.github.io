// Pure helpers for ordering and filtering content-collection entries.

export function sortByDateDesc<T extends { data: Record<string, any> }>(
	items: T[],
	key: string,
): T[] {
	return [...items].sort(
		(a, b) => +new Date(b.data[key]) - +new Date(a.data[key]),
	);
}

export function isPublished<T extends { data: { draft?: boolean } }>(
	item: T,
): boolean {
	return item.data.draft !== true;
}

// Tags as shown to readers: the entry's own tags, plus a derived `ai-assisted`
// tag for AI-authored content (single source of truth = the `authorship` field).
export function displayTags<
	T extends { data: { tags?: string[]; authorship?: 'human' | 'ai' } },
>(entry: T): string[] {
	const base = entry.data.tags ?? [];
	return entry.data.authorship === 'ai' && !base.includes('ai-assisted')
		? [...base, 'ai-assisted']
		: base;
}

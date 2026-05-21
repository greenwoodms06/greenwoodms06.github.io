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

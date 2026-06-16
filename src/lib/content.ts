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

// Index ordering used by every section: featured items pinned on top (by their
// `order`, then newest), followed by the rest newest-first. "Newest" prefers
// `updatedDate` when set, else the collection's primary date key.
export function pinnedThenByDate<T extends { data: Record<string, any> }>(
	items: T[],
	primaryKey: string,
): T[] {
	const when = (i: T) => +new Date(i.data.updatedDate ?? i.data[primaryKey]);
	const rank = (i: T) =>
		typeof i.data.order === 'number' ? i.data.order : Number.MAX_SAFE_INTEGER;
	const featured = items
		.filter((i) => i.data.featured === true)
		.sort((a, b) => rank(a) - rank(b) || when(b) - when(a));
	const rest = items
		.filter((i) => i.data.featured !== true)
		.sort((a, b) => when(b) - when(a));
	return [...featured, ...rest];
}

// Mix featured items across several already-normalized lists, round-robin by
// source, so the homepage Highlights strip stays balanced (a project, an essay,
// a publication, …) instead of one source exhausting the slots before the
// others get a look in.
export function featuredAcross<T extends { featured?: boolean }>(
	...groups: T[][]
): T[] {
	const queues = groups.map((g) => g.filter((i) => i.featured === true));
	const out: T[] = [];
	let drained = false;
	while (!drained) {
		drained = true;
		for (const q of queues) {
			const next = q.shift();
			if (next !== undefined) {
				out.push(next);
				drained = false;
			}
		}
	}
	return out;
}

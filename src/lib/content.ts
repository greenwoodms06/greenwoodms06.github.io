// Pure helpers for ordering and filtering content-collection entries.

// Writing depth/form facet. `note` is a scrap (an image, a clip, a paragraph)
// that shows on the home timeline but not on the Writing index; the other three
// are index-visible. Lives here (not content.config.ts) so vitest can import it.
export const POST_KINDS = ['note', 'how-to', 'devlog', 'essay'] as const;
export type PostKind = (typeof POST_KINDS)[number];
export const KIND_LABEL: Record<PostKind, string> = {
	note: 'Note',
	'how-to': 'How-to',
	devlog: 'Devlog',
	essay: 'Essay',
};
// Kinds listed on the Writing index (decided 2026-09-02: notes are timeline-only).
export const WRITING_KINDS: readonly PostKind[] = ['how-to', 'devlog', 'essay'];
export function isWriting(kind: PostKind): boolean {
	return WRITING_KINDS.includes(kind);
}

// The home-page timeline: one reverse-chronological ledger of everything.
export type TimelineGroup = 'writing' | 'projects' | 'publications' | 'gallery';
export interface TimelineItem {
	title: string;
	href: string;
	group: TimelineGroup;
	// Short type label shown beside the title: "Essay", "Project", "Journal", …
	label: string;
	date: Date;
	// Publications carry only a year; they sort after the dated items of that year.
	yearOnly?: boolean;
	external?: boolean;
}
export interface TimelineYear {
	year: number;
	items: TimelineItem[];
}

// Years newest-first. Within a year: dated items newest-first, then year-only
// items alphabetically by title (their order carries no date information).
// UTC year on purpose: frontmatter dates coerce to UTC midnight and
// FormattedDate renders in UTC, so a local-time year would roll Jan 1 back a year.
export function groupByYear(items: TimelineItem[]): TimelineYear[] {
	const years = new Map<number, TimelineItem[]>();
	for (const it of items) {
		const y = it.date.getUTCFullYear();
		if (!years.has(y)) years.set(y, []);
		years.get(y)!.push(it);
	}
	return [...years.entries()]
		.sort((a, b) => b[0] - a[0])
		.map(([year, list]) => {
			const dated = list
				.filter((i) => !i.yearOnly)
				.sort((a, b) => +b.date - +a.date);
			const yearOnly = list
				.filter((i) => i.yearOnly)
				.sort((a, b) => a.title.localeCompare(b.title));
			return { year, items: [...dated, ...yearOnly] };
		});
}

// Rough reading time in minutes from raw markdown body (~200 wpm), floored at 1.
export function readingTime(body: string): number {
	const words = body.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}

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


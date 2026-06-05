// Publications list. A single zod-validated array — append entries (e.g. pasted
// from the CV) here and the build will fail loudly on a malformed entry.
//
// ⚠ SEED ENTRIES BELOW ARE DRAFTS — VERIFY authors/venue/year/links before publishing.
import { z } from 'astro/zod';

const publicationSchema = z.object({
	id: z.string(),
	title: z.string(),
	authors: z.string(),
	venue: z.string(),
	year: z.number().int(),
	type: z.enum(['journal', 'conference', 'presentation', 'patent', 'poster']),
	url: z.string().url().optional(),
	pdf: z.string().optional(),
	featured: z.boolean().default(false),
});

export type Publication = z.infer<typeof publicationSchema>;

const raw: unknown[] = [
	{
		id: 'viper-ans-2021',
		title: 'VIPER: Immersive Visualization of Volumetric Radiation Fields',
		authors: 'Greenwood, M.S., et al.', // VERIFY
		venue: 'Transactions of the American Nuclear Society', // VERIFY
		year: 2021, // VERIFY
		type: 'conference',
		featured: true,
	},
	{
		id: 'ar-radiation-patent',
		title: 'System and Method for Augmented-Reality Radiation-Field Visualization', // VERIFY
		authors: 'Greenwood, M.S., et al.', // VERIFY
		venue: 'US Patent Office', // VERIFY number
		year: 2021, // VERIFY
		type: 'patent',
	},
	{
		id: 'secondary-side-thermal-hydraulics-2019',
		title: 'Dynamic Modeling of Nuclear Secondary-Side Thermal-Hydraulics', // VERIFY
		authors: 'Greenwood, M.S., et al.', // VERIFY
		venue: 'Nuclear Engineering and Design', // VERIFY
		year: 2019, // VERIFY
		type: 'journal',
	},
];

export const publications: Publication[] = z.array(publicationSchema).parse(raw);

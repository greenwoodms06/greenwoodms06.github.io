// Global site constants. Imported anywhere with the `import` keyword.

export const SITE_TITLE = 'On…';
export const SITE_TAGLINE = 'A collection of How-Tos and What-Nots…';
export const SITE_DESCRIPTION =
	'Side projects, how-tos, and what-nots — notes from the workshop on nuclear sims, graphics, 3D printing, and code.';

export const NAV = [
	{ href: '/projects', label: 'Projects' },
	{ href: '/blog', label: 'Writing' },
	{ href: '/publications', label: 'Publications' },
	{ href: '/about', label: 'About' },
] as const;

export const SOCIALS = {
	github: 'https://github.com/greenwoodms06',
} as const;

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { displayTags } from '../lib/content';

export async function GET(context) {
	const posts = (await getCollection('posts')).filter((p) => !p.data.draft);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts
			.sort((a, b) => +new Date(b.data.pubDate) - +new Date(a.data.pubDate))
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.pubDate,
				link: `/blog/${post.id}/`,
				categories: displayTags(post),
			})),
	});
}

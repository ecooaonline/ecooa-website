import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://www.somosecooa.com.br';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'ecooa | Blog',
    home_page_url: `${SITE}/blog`,
    feed_url: `${SITE}/feed.json`,
    description: 'Saúde, estética e longevidade que conversam entre si. Artigos por especialistas da ecooa em Porto Alegre.',
    language: 'pt-BR',
    icon: `${SITE}/favicon/apple-touch-icon.png`,
    favicon: `${SITE}/favicon/favicon.svg`,
    authors: [{ name: 'ecooa', url: SITE }],
    items: posts.map((post) => ({
      id: `${SITE}/blog/${post.id}`,
      url: `${SITE}/blog/${post.id}`,
      title: post.data.title,
      summary: post.data.description,
      content_text: post.data.description,
      date_published: new Date(post.data.date).toISOString(),
      ...(post.data.lastModified && { date_modified: new Date(post.data.lastModified).toISOString() }),
      authors: [{ name: post.data.author }],
      tags: [post.data.category, ...(post.data.tags || [])],
      language: 'pt-BR',
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

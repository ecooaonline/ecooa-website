import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://www.somosecooa.com.br';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const buildDate = new Date().toUTCString();
  const latestDate = posts[0] ? new Date(posts[0].data.date).toUTCString() : buildDate;

  const items = posts.map((post) => {
    const url = `${SITE}/blog/${post.id}`;
    const pubDate = new Date(post.data.date).toUTCString();
    const category = escapeXml(post.data.category);
    return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>contato@somosecooa.com.br (${escapeXml(post.data.author)})</author>
      <category>${category}</category>
    </item>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>ecooa | Blog</title>
    <link>${SITE}/blog</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Saúde, estética e longevidade que conversam entre si. Artigos de medicina, nutrição, estética e saúde mental por especialistas da ecooa em Porto Alegre.</description>
    <language>pt-BR</language>
    <copyright>ecooa</copyright>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${latestDate}</pubDate>
    <generator>Astro</generator>
    <image>
      <url>${SITE}/favicon/og-image.jpg</url>
      <title>ecooa | Blog</title>
      <link>${SITE}/blog</link>
    </image>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

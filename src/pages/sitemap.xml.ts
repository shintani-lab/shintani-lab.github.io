// 検索エンジン向けのサイトマップです。
// ページを増やしたときは src/lib/content.ts の nav に追加すれば、
// このファイルは触らなくても自動で反映されます。
import type { APIRoute } from 'astro';
import { nav } from '../lib/content';
import { getPublishedNews } from '../lib/news';

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://shintani-lab.github.io');
  const news = await getPublishedNews();

  const paths = [
    ...nav.map((n) => n.href),
    ...news.map((n) => `/news/${n.id}/`),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((p) => `  <url><loc>${new URL(p, base).href}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

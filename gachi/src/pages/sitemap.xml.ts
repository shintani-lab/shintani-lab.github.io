// 検索エンジン向けのサイトマップです（本番として公開したときに使われます）。
// ページを増やしたときは src/lib/data.ts の nav に追加すれば、自動で反映されます。
import type { APIRoute } from 'astro';
import { nav, news, url } from '../lib/data';

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://shintani-lab.github.io');
  const paths = [
    '/',
    ...nav.map((n) => n.href),
    '/join/',
    ...news.map((n) => `/news/${n.id}/`),
  ];

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((p) => `  <url><loc>${new URL(url(p), base).href}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};

// Hand-written sitemap (launch § 14.7 Nr. 3): every built language page in
// canonical form, nothing else; no neutral addresses, no hreflang, lastmod,
// priority or changefreq.
import type { APIRoute } from 'astro';
import { BUILT_PAGES, LANGS, pathOf } from '../lib/i18n';
import { siteUrl } from '../site';

export const GET: APIRoute = () => {
  const urls = LANGS.flatMap((lang) =>
    BUILT_PAGES.map((page) => `  <url><loc>${siteUrl}${pathOf(lang, page)}</loc></url>`),
  );
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

// sitemap.xml and robots.txt (launch § 14.7 Nr. 1, 3; spec stavewise#713).
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { FILES, ORIGIN, neutralPathOf, pathOf, pathOfFile, read } from './dist';

describe('sitemap.xml', () => {
  const xml = () => read('sitemap.xml');
  const locs = () =>
    [...new JSDOM(xml(), { contentType: 'text/xml' }).window.document.querySelectorAll('url > loc')].map(
      (loc) => loc.textContent,
    );

  it('is a urlset of the sitemap protocol', () => {
    const doc = new JSDOM(xml(), { contentType: 'text/xml' }).window.document;
    expect(doc.documentElement.localName).toBe('urlset');
    expect(doc.documentElement.namespaceURI).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
  });

  it('lists exactly the HTML pages in dist/ (without og/), in canonical form', () => {
    const pages = FILES.filter((file) => file.endsWith('.html') && !file.startsWith('og/'));
    expect(pages).toHaveLength(10);
    expect([...locs()].sort()).toEqual(pages.map((file) => ORIGIN + pathOfFile(file)).sort());
  });

  it('lists no neutral address', () => {
    expect(locs()).not.toContain(`${ORIGIN}/`);
    expect(locs()).not.toContain(`${ORIGIN}/beta`);
    expect(locs().every((loc) => /^https:\/\/stavewise\.app\/(de|en)\//.test(loc ?? ''))).toBe(true);
  });

  it('has no lastmod, priority, changefreq or xhtml:link', () => {
    expect(xml()).not.toMatch(/lastmod|priority|changefreq|xhtml:link/);
  });
});

describe('robots.txt', () => {
  it('allows everything and names the sitemap', () => {
    expect(read('robots.txt')).toBe('User-agent: *\nAllow: /\n\nSitemap: https://stavewise.app/sitemap.xml\n');
  });

  it('contains no Disallow', () => {
    expect(read('robots.txt')).not.toContain('Disallow');
  });
});

describe('page register (src/lib/i18n.ts)', () => {
  it('maps guide pages to their slug per language', () => {
    expect(pathOf('de', 'bothHands')).toBe('/de/noten-lesen-beide-haende');
    expect(pathOf('en', 'bothHands')).toBe('/en/read-treble-and-bass-clef-together');
    expect(pathOf('de', 'connect')).toBe('/de/e-piano-mit-android-verbinden');
    expect(pathOf('en', 'app')).toBe('/en/sight-reading-app-android');
  });

  it('keeps the old pages at their paths', () => {
    expect(pathOf('de', 'home')).toBe('/de/');
    expect(pathOf('en', 'impressum')).toBe('/en/impressum');
  });

  it('gives guide pages no neutral address', () => {
    expect(neutralPathOf('cable')).toBeNull();
    expect(neutralPathOf('beta')).toBe('/beta');
    expect(neutralPathOf('home')).toBe('/');
  });
});

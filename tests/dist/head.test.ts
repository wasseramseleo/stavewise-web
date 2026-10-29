// Head of every built page for search engines and link previews
// (launch § 14.7 Nr. 2, 4, 5, 6; spec stavewise#713).
import { describe, expect, it } from 'vitest';
import { FILES, ORIGIN, PAGES, documentOf, neutralPathOf, pathOf } from './dist';

const LOCALE = { de: 'de_DE', en: 'en_US' } as const;

const attr = (doc: Document, selector: string, name: string) =>
  doc.querySelector(selector)?.getAttribute(name) ?? null;
const meta = (doc: Document, property: string) => attr(doc, `meta[property="${property}"]`, 'content');

describe.each(PAGES)('$path', (page) => {
  const doc = () => documentOf(page.path);
  const other = page.lang === 'de' ? 'en' : 'de';

  it('has one absolute canonical equal to og:url and its own hreflang', () => {
    const canonicals = doc().querySelectorAll('link[rel="canonical"]');
    expect(canonicals).toHaveLength(1);
    const canonical = canonicals[0]!.getAttribute('href');
    expect(canonical).toBe(ORIGIN + page.path);
    expect(meta(doc(), 'og:url')).toBe(canonical);
    expect(attr(doc(), `link[rel="alternate"][hreflang="${page.lang}"]`, 'href')).toBe(canonical);
  });

  it('points x-default at the neutral address, or at the EN version without one', () => {
    expect(attr(doc(), 'link[rel="alternate"][hreflang="x-default"]', 'href')).toBe(
      ORIGIN + (neutralPathOf(page.name) ?? pathOf('en', page.name)),
    );
  });

  it('has Open Graph with title, description, type, site name and locale of its language', () => {
    expect(meta(doc(), 'og:title')).toBe(doc().title);
    expect(meta(doc(), 'og:description')).toBe(attr(doc(), 'meta[name="description"]', 'content'));
    expect(meta(doc(), 'og:type')).toBe('website');
    expect(meta(doc(), 'og:site_name')).toBe('Stavewise');
    expect(meta(doc(), 'og:locale')).toBe(LOCALE[page.lang]);
    expect(meta(doc(), 'og:locale:alternate')).toBe(LOCALE[other]);
  });

  it('uses the preview image of its language', () => {
    expect(meta(doc(), 'og:image')).toBe(`${ORIGIN}/og/stavewise-${page.lang}.png`);
  });
});

describe('examples from the ticket (stavewise#714)', () => {
  it('/de/beta is canonical at its own address with x-default on the neutral one', () => {
    const doc = documentOf('/de/beta');
    expect(attr(doc, 'link[rel="canonical"]', 'href')).toBe('https://stavewise.app/de/beta');
    expect(meta(doc, 'og:url')).toBe('https://stavewise.app/de/beta');
    expect(attr(doc, 'link[rel="alternate"][hreflang="de"]', 'href')).toBe('https://stavewise.app/de/beta');
    expect(attr(doc, 'link[rel="alternate"][hreflang="x-default"]', 'href')).toBe('https://stavewise.app/beta');
  });

  it('/en/ is canonical with a trailing slash', () => {
    expect(attr(documentOf('/en/'), 'link[rel="canonical"]', 'href')).toBe('https://stavewise.app/en/');
  });

  it('/de/privacy has locale de_DE with en_US as alternate and site name Stavewise', () => {
    const doc = documentOf('/de/privacy');
    expect(meta(doc, 'og:locale')).toBe('de_DE');
    expect(meta(doc, 'og:locale:alternate')).toBe('en_US');
    expect(meta(doc, 'og:site_name')).toBe('Stavewise');
  });
});

describe('JSON-LD', () => {
  const graphOf = (path: string): Record<string, unknown>[] => {
    const scripts = documentOf(path).querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    const data = JSON.parse(scripts[0]!.textContent ?? '');
    expect(data['@context']).toBe('https://schema.org');
    return data['@graph'];
  };

  it.each(['/de/', '/en/'])('%s describes Organization and WebSite', (path) => {
    const graph = graphOf(path);
    expect(graph.map((node) => node['@type']).sort()).toEqual(['Organization', 'WebSite']);
    expect(graph.find((node) => node['@type'] === 'Organization')).toEqual({
      '@type': 'Organization',
      name: 'Stavewise',
      url: 'https://stavewise.app/',
      logo: 'https://stavewise.app/logo.png',
    });
    expect(graph.find((node) => node['@type'] === 'WebSite')).toEqual({
      '@type': 'WebSite',
      name: 'Stavewise',
      url: 'https://stavewise.app/',
    });
  });

  it('ships the logo it names', () => {
    expect(FILES).toContain('logo.png');
  });

  it.each(PAGES.filter((page) => page.name !== 'home'))('$path has none', (page) => {
    expect(documentOf(page.path).querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
  });
});

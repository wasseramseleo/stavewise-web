import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { FILES, ORIGIN, PAGES, documentOf, fileOf, pathOf, read } from './dist';

const NEUTRAL: Record<string, string> = {
  home: '/',
  beta: '/beta',
  privacy: '/privacy',
  impressum: '/impressum',
};

describe.each(PAGES)('$path', (page) => {
  const other = page.lang === 'de' ? 'en' : 'de';

  it('is built', () => {
    expect(FILES).toContain(fileOf(page.path));
  });

  it('declares the language of its path', () => {
    expect(documentOf(page.path).documentElement.lang).toBe(page.lang);
  });

  it('has exactly one non-empty title', () => {
    const titles = documentOf(page.path).querySelectorAll('title');
    expect(titles).toHaveLength(1);
    expect(titles[0]?.textContent?.trim()).not.toBe('');
  });

  it('links its alternates de, en and x-default with absolute URLs', () => {
    const doc = documentOf(page.path);
    const href = (lang: string) =>
      doc.querySelector(`link[rel="alternate"][hreflang="${lang}"]`)?.getAttribute('href');
    expect(href('de')).toBe(ORIGIN + pathOf('de', page.name));
    expect(href('en')).toBe(ORIGIN + pathOf('en', page.name));
    expect(href('x-default')).toBe(ORIGIN + NEUTRAL[page.name]);
  });

  it('has a language link to the same page in the other language', () => {
    const links = [...documentOf(page.path).querySelectorAll('a[hreflang]')];
    expect(links).toHaveLength(1);
    const link = links[0]!;
    expect(link.getAttribute('href')).toBe(pathOf(other, page.name));
    expect(link.getAttribute('hreflang')).toBe(other);
    expect(link.getAttribute('lang')).toBe(other);
  });

  it('links the beta page of its language in the header', () => {
    const hrefs = [...documentOf(page.path).querySelectorAll('header a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toContain(pathOf(page.lang, 'beta'));
  });

  it('links the support address in the footer', () => {
    const hrefs = [...documentOf(page.path).querySelectorAll('footer a')].map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toContain('mailto:support@stavewise.app');
  });
});

describe('dist/ as a whole', () => {
  const htmlFiles = FILES.filter((file) => file.endsWith('.html'));

  it('ships no JavaScript file', () => {
    expect(FILES.filter((file) => /\.m?js$/.test(file))).toEqual([]);
  });

  it.each(htmlFiles)('%s has no <script>', (file) => {
    expect(new JSDOM(read(file)).window.document.querySelectorAll('script')).toHaveLength(0);
  });

  it.each(htmlFiles)('%s loads nothing from another host', (file) => {
    const doc = new JSDOM(read(file)).window.document;
    const urls = [
      ...[...doc.querySelectorAll('link[rel~="stylesheet"], link[rel~="preload"], link[rel~="icon"]')].map(
        (el) => el.getAttribute('href'),
      ),
      ...[...doc.querySelectorAll('img, source, video, audio, iframe')].flatMap((el) => [
        el.getAttribute('src'),
        el.getAttribute('srcset'),
      ]),
    ].filter((url): url is string => url !== null);
    const foreign = urls.filter((url) => {
      if (url.startsWith('/') && !url.startsWith('//')) return false;
      if (!/^[a-z][a-z0-9+.-]*:|^\/\//i.test(url)) return false;
      return new URL(url, ORIGIN).host !== 'stavewise.app';
    });
    expect(foreign).toEqual([]);
  });

  it('serves the fonts as woff2 from /fonts/', () => {
    const fonts = FILES.filter((file) => file.startsWith('fonts/') && file.endsWith('.woff2'));
    expect(fonts.length).toBeGreaterThanOrEqual(5);
  });

  it('mentions fonts.googleapis.com in no file', () => {
    const textFiles = FILES.filter((file) => /\.(html|css|svg|txt|xml|json)$/.test(file));
    expect(textFiles.filter((file) => read(file).includes('fonts.googleapis.com'))).toEqual([]);
  });

  it('ships the font licences', () => {
    expect(FILES).toContain('fonts/INSTRUMENT-SANS-OFL.txt');
    expect(FILES).toContain('fonts/JETBRAINS-MONO-OFL.txt');
  });

  it('has no page at the root (nginx picks the language)', () => {
    expect(FILES).not.toContain('index.html');
  });
});

describe('/de/privacy', () => {
  it.each(['app', 'website', 'rechte'])('has an element with id="%s"', (id) => {
    expect(documentOf('/de/privacy').getElementById(id)).not.toBeNull();
  });
});

describe('/en/privacy', () => {
  it.each(['app', 'website', 'rechte'])('has an element with id="%s"', (id) => {
    expect(documentOf('/en/privacy').getElementById(id)).not.toBeNull();
  });
});

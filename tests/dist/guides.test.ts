// Guide pages built from the template variant A (launch § 14.4, 14.5; spec stavewise#713).
// Each guide ticket adds its pages to GUIDES.
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { ORIGIN, documentOf, pathOf, read, type Lang, type PageName } from './dist';

interface Guide {
  lang: Lang;
  name: PageName;
  /** Words the H1 must contain (the main search query, launch § 14.3). */
  headingWords: readonly string[];
}

const GUIDES: readonly Guide[] = [
  { lang: 'de', name: 'connect', headingWords: ['E-Piano', 'Android'] },
  { lang: 'en', name: 'connect', headingWords: ['digital piano', 'Android'] },
  { lang: 'de', name: 'cable', headingWords: ['USB to Host', 'Kabel'] },
  { lang: 'en', name: 'cable', headingWords: ['cable', 'tablet'] },
];

/** Shared wording per language (launch § 14.4). */
const SHARED = {
  de: {
    byline: /^Von Leonard Guelmino · Stand [A-ZÄÖÜ][a-zäöü]+ \d{4}$/,
    answerLabel: 'Kurz gesagt',
    disclosureStart: 'Offen gesagt:',
    author:
      'Ich bin Leonard Guelmino. Als Kind habe ich fünf Jahre Klavier gespielt, seit 2025 spiele ich als Erwachsener wieder. Das Notenlesen war dabei mein Engpass. Als Informatiker habe ich mir Stavewise gebaut, zuerst für mich, und teile es jetzt.',
    authorLabel: 'Über den Autor',
    ctaButton: 'Als Tester bewerben BETA',
  },
  en: {
    byline: /^By Leonard Guelmino · Updated [A-Z][a-z]+ \d{4}$/,
    answerLabel: 'In short',
    disclosureStart: 'Full disclosure:',
    author:
      "I'm Leonard Guelmino. I played piano for five years as a child and came back to it as an adult in 2025. Reading music was what held me back, so, being a software developer, I built Stavewise for myself first and now I'm sharing it.",
    authorLabel: 'About the author',
    ctaButton: 'Apply as a tester BETA',
  },
} as const;

const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe.each(GUIDES)('$lang $name', (guide) => {
  const path = pathOf(guide.lang, guide.name);
  const shared = SHARED[guide.lang];
  const doc = () => documentOf(path);
  const main = () => doc().querySelector('main')!;
  const hrefs = () => [...main().querySelectorAll('a')].map((a) => a.getAttribute('href'));

  it('has one H1 with the main search query', () => {
    const headings = doc().querySelectorAll('h1');
    expect(headings).toHaveLength(1);
    for (const word of guide.headingWords) expect(text(headings[0])).toContain(word);
  });

  it('names the author and the month of the last update below the heading', () => {
    expect(text(main().querySelector('.byline'))).toMatch(shared.byline);
  });

  it('answers in a box labelled "Kurz gesagt" / "In short"', () => {
    const box = main().querySelector('.answer');
    expect(text(box?.querySelector('.label'))).toBe(shared.answerLabel);
    expect(text(box).length).toBeGreaterThan(shared.answerLabel.length + 100);
  });

  it('discloses the maker right after the answer', () => {
    const disclosure = main().querySelector('.answer + .disclosure');
    expect(text(disclosure).startsWith(shared.disclosureStart)).toBe(true);
  });

  it('ends with the Stavewise card linking the beta page of its language', () => {
    const card = main().querySelector('.cta');
    expect(card).not.toBeNull();
    const button = card!.querySelector('a.btn-main');
    expect(button?.getAttribute('href')).toBe(pathOf(guide.lang, 'beta'));
    expect(text(button)).toBe(shared.ctaButton);
  });

  it('has the author block with the wording of launch § 14.4', () => {
    const block = main().querySelector('.author');
    expect(text(block?.querySelector('.label'))).toBe(shared.authorLabel);
    expect(text(block?.querySelector('p'))).toBe(shared.author);
  });

  it('links the home page of its language', () => {
    expect(hrefs()).toContain(pathOf(guide.lang, 'home'));
  });

  it('links its counterpart in the other language', () => {
    const other = guide.lang === 'de' ? 'en' : 'de';
    const link = doc().querySelector(`a[hreflang="${other}"]`);
    expect(link?.getAttribute('href')).toBe(pathOf(other, guide.name));
  });

  it('has no <details>', () => {
    expect(doc().querySelectorAll('details')).toHaveLength(0);
  });

  it('promises no time frame and names no amount', () => {
    const body = text(main());
    expect(body).not.toMatch(/in 30 Tagen|in 30 days/i);
    expect(body).not.toMatch(/€|\$|£|\bEUR\b|\bUSD\b/);
  });

  it('has roughly 900 words', () => {
    const words = text(main()).split(' ').length;
    expect(words).toBeGreaterThan(700);
    expect(words).toBeLessThan(1200);
  });
});

describe('connect (stavewise#716)', () => {
  it('/de/e-piano-mit-android-verbinden links its English version', () => {
    const link = documentOf('/de/e-piano-mit-android-verbinden').querySelector('a[hreflang="en"]');
    expect(link?.getAttribute('href')).toBe('/en/connect-digital-piano-to-android');
  });

  it.each(['/de/e-piano-mit-android-verbinden', '/en/connect-digital-piano-to-android'])(
    '%s points x-default at the English version',
    (path) => {
      const xDefault = documentOf(path)
        .querySelector('link[rel="alternate"][hreflang="x-default"]')
        ?.getAttribute('href');
      expect(xDefault).toBe('https://stavewise.app/en/connect-digital-piano-to-android');
    },
  );

  it('lists both versions in the sitemap', () => {
    const locs = [
      ...new JSDOM(read('sitemap.xml'), { contentType: 'text/xml' }).window.document.querySelectorAll('loc'),
    ].map((loc) => loc.textContent);
    expect(locs).toContain(`${ORIGIN}/de/e-piano-mit-android-verbinden`);
    expect(locs).toContain(`${ORIGIN}/en/connect-digital-piano-to-android`);
  });

  it.each(['/de/e-piano-mit-android-verbinden', '/en/connect-digital-piano-to-android'])(
    '%s shows the demo still and the test screenshot as images with alt text',
    (path) => {
      const images = [...documentOf(path).querySelectorAll('main figure img')];
      expect(images.length).toBeGreaterThanOrEqual(2);
      for (const img of images) expect(img.getAttribute('alt')).not.toBe('');
    },
  );
});

describe('cable (stavewise#717)', () => {
  it('/de/usb-to-host-kabel links its English version', () => {
    const link = documentOf('/de/usb-to-host-kabel').querySelector('a[hreflang="en"]');
    expect(link?.getAttribute('href')).toBe('/en/usb-to-host-cable');
  });

  it('/en/usb-to-host-cable links its German version', () => {
    const link = documentOf('/en/usb-to-host-cable').querySelector('a[hreflang="de"]');
    expect(link?.getAttribute('href')).toBe('/de/usb-to-host-kabel');
  });

  it.each(['/de/usb-to-host-kabel', '/en/usb-to-host-cable'])('%s points x-default at the English version', (path) => {
    const xDefault = documentOf(path)
      .querySelector('link[rel="alternate"][hreflang="x-default"]')
      ?.getAttribute('href');
    expect(xDefault).toBe('https://stavewise.app/en/usb-to-host-cable');
  });

  it('lists both versions in the sitemap', () => {
    const locs = [
      ...new JSDOM(read('sitemap.xml'), { contentType: 'text/xml' }).window.document.querySelectorAll('loc'),
    ].map((loc) => loc.textContent);
    expect(locs).toContain(`${ORIGIN}/de/usb-to-host-kabel`);
    expect(locs).toContain(`${ORIGIN}/en/usb-to-host-cable`);
  });

  it.each(['/de/usb-to-host-kabel', '/en/usb-to-host-cable'])(
    '%s shows the demo still and the test screenshot as images with alt text',
    (path) => {
      const images = [...documentOf(path).querySelectorAll('main figure img')];
      expect(images.length).toBeGreaterThanOrEqual(2);
      for (const img of images) expect(img.getAttribute('alt')).not.toBe('');
    },
  );

  // Setup ↔ setup (launch § 14.6): each page links the other in its own line.
  it.each([
    ['/de/e-piano-mit-android-verbinden', '/de/usb-to-host-kabel', 'Welches Kabel genau?'],
    ['/en/connect-digital-piano-to-android', '/en/usb-to-host-cable', 'Which cable exactly?'],
    ['/de/usb-to-host-kabel', '/de/e-piano-mit-android-verbinden', ''],
    ['/en/usb-to-host-cable', '/en/connect-digital-piano-to-android', ''],
  ])('%s links %s in a cross-reference line', (from, to, lead) => {
    const lines = [...documentOf(from).querySelectorAll('main p.related')];
    const line = lines.find((p) => p.querySelector(`a[href="${to}"]`));
    expect(line).toBeDefined();
    expect(text(line).startsWith(lead)).toBe(true);
  });
});

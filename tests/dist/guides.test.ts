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
  { lang: 'de', name: 'bassClef', headingWords: ['Bassschlüssel'] },
  { lang: 'en', name: 'bassClef', headingWords: ['bass clef'] },
  { lang: 'de', name: 'bothHands', headingWords: ['beiden Händen'] },
  { lang: 'en', name: 'bothHands', headingWords: ['treble', 'bass clef', 'same time'] },
  { lang: 'de', name: 'app', headingWords: ['App', 'Android'] },
  { lang: 'en', name: 'app', headingWords: ['app', 'Android'] },
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

describe('bassClef (stavewise#718)', () => {
  const PATHS = ['/de/bassschluessel-lesen', '/en/read-bass-clef'] as const;

  it('/de/bassschluessel-lesen links its English version', () => {
    const link = documentOf('/de/bassschluessel-lesen').querySelector('a[hreflang="en"]');
    expect(link?.getAttribute('href')).toBe('/en/read-bass-clef');
  });

  it('/en/read-bass-clef links its German version', () => {
    const link = documentOf('/en/read-bass-clef').querySelector('a[hreflang="de"]');
    expect(link?.getAttribute('href')).toBe('/de/bassschluessel-lesen');
  });

  it.each(PATHS)('%s points x-default at the English version', (path) => {
    const xDefault = documentOf(path)
      .querySelector('link[rel="alternate"][hreflang="x-default"]')
      ?.getAttribute('href');
    expect(xDefault).toBe('https://stavewise.app/en/read-bass-clef');
  });

  it('lists both versions in the sitemap', () => {
    const locs = [
      ...new JSDOM(read('sitemap.xml'), { contentType: 'text/xml' }).window.document.querySelectorAll('loc'),
    ].map((loc) => loc.textContent);
    expect(locs).toContain(`${ORIGIN}/de/bassschluessel-lesen`);
    expect(locs).toContain(`${ORIGIN}/en/read-bass-clef`);
  });

  // Core pages back their music-theory statements with a linked source (launch § 14.4).
  it.each(PATHS)('%s links at least one external source in the text', (path) => {
    const external = [...documentOf(path).querySelectorAll('main a')]
      .map((a) => a.getAttribute('href') ?? '')
      .filter((href) => /^https:\/\//.test(href) && !href.startsWith(ORIGIN));
    expect(external.length).toBeGreaterThanOrEqual(1);
  });

  // Core pages have no demo still (launch § 14.5 Nr. 5), only the app screenshot in a card.
  it.each(PATHS)('%s shows the app screenshot in a card and no demo still', (path) => {
    const doc = documentOf(path);
    expect(doc.querySelector('main figure.still')).toBeNull();
    const images = [...doc.querySelectorAll('main figure.shot img')];
    expect(images).toHaveLength(1);
    expect(images[0].getAttribute('alt')).not.toBe('');
  });

  // German note names in German (launch § 8.2 Nr. 4): the bass clef lines read G, H, D, F, A.
  it('/de/bassschluessel-lesen names the lines with H, /en/read-bass-clef with B', () => {
    expect(text(documentOf('/de/bassschluessel-lesen').querySelector('main'))).toContain('G, H, D, F, A');
    expect(text(documentOf('/en/read-bass-clef').querySelector('main'))).toContain('G, B, D, F, A');
  });

  it.each(PATHS)('%s keeps "Klaviersystem" / "grand staff" out of title and H1', (path) => {
    const doc = documentOf(path);
    for (const el of [doc.querySelector('title'), doc.querySelector('h1')]) {
      expect(text(el)).not.toMatch(/Klaviersystem|grand staff/i);
    }
  });
});

describe('bothHands (stavewise#719)', () => {
  const PATHS = ['/de/noten-lesen-beide-haende', '/en/read-treble-and-bass-clef-together'] as const;

  it('/de/noten-lesen-beide-haende links its English version', () => {
    const link = documentOf('/de/noten-lesen-beide-haende').querySelector('a[hreflang="en"]');
    expect(link?.getAttribute('href')).toBe('/en/read-treble-and-bass-clef-together');
  });

  it('/en/read-treble-and-bass-clef-together links its German version', () => {
    const link = documentOf('/en/read-treble-and-bass-clef-together').querySelector('a[hreflang="de"]');
    expect(link?.getAttribute('href')).toBe('/de/noten-lesen-beide-haende');
  });

  it.each(PATHS)('%s points x-default at the English version', (path) => {
    const xDefault = documentOf(path)
      .querySelector('link[rel="alternate"][hreflang="x-default"]')
      ?.getAttribute('href');
    expect(xDefault).toBe('https://stavewise.app/en/read-treble-and-bass-clef-together');
  });

  it('lists both versions in the sitemap', () => {
    const locs = [
      ...new JSDOM(read('sitemap.xml'), { contentType: 'text/xml' }).window.document.querySelectorAll('loc'),
    ].map((loc) => loc.textContent);
    expect(locs).toContain(`${ORIGIN}/de/noten-lesen-beide-haende`);
    expect(locs).toContain(`${ORIGIN}/en/read-treble-and-bass-clef-together`);
  });

  it.each(PATHS)('%s keeps "Klaviersystem" / "grand staff" out of title and H1', (path) => {
    const doc = documentOf(path);
    for (const el of [doc.querySelector('title'), doc.querySelector('h1')]) {
      expect(text(el)).not.toMatch(/Klaviersystem|grand staff/i);
    }
  });

  // The terms are explained in the text, just not used as headings (launch § 14.3 row 4).
  it('explains "Klaviersystem" / "grand staff" in the text', () => {
    expect(text(documentOf('/de/noten-lesen-beide-haende').querySelector('main'))).toContain('Klaviersystem');
    expect(text(documentOf('/en/read-treble-and-bass-clef-together').querySelector('main'))).toContain('grand staff');
  });

  // Section for adults and returners (launch § 14.3 row 4).
  it.each([
    ['/de/noten-lesen-beide-haende', /Erwachsene|Wiedereinsteiger/],
    ['/en/read-treble-and-bass-clef-together', /adult/i],
  ] as const)('%s has an H2 for adults and returners', (path, pattern) => {
    const headings = [...documentOf(path).querySelectorAll('main h2')].map(text);
    expect(headings.some((h) => pattern.test(h))).toBe(true);
  });

  it.each(PATHS)('%s links at least one external source in the text', (path) => {
    const external = [...documentOf(path).querySelectorAll('main a')]
      .map((a) => a.getAttribute('href') ?? '')
      .filter((href) => /^https:\/\//.test(href) && !href.startsWith(ORIGIN));
    expect(external.length).toBeGreaterThanOrEqual(1);
  });

  it.each(PATHS)('%s shows the app screenshot in a card and no demo still', (path) => {
    const doc = documentOf(path);
    expect(doc.querySelector('main figure.still')).toBeNull();
    const images = [...doc.querySelectorAll('main figure.shot img')];
    expect(images).toHaveLength(1);
    expect(images[0].getAttribute('alt')).not.toBe('');
  });

  // Core ↔ core (launch § 14.6): bass clef and both hands link each other in their own line.
  it.each([
    ['/de/bassschluessel-lesen', '/de/noten-lesen-beide-haende'],
    ['/de/noten-lesen-beide-haende', '/de/bassschluessel-lesen'],
    ['/en/read-bass-clef', '/en/read-treble-and-bass-clef-together'],
    ['/en/read-treble-and-bass-clef-together', '/en/read-bass-clef'],
  ])('%s links %s in a cross-reference line', (from, to) => {
    const lines = [...documentOf(from).querySelectorAll('main p.related')];
    expect(lines.find((p) => p.querySelector(`a[href="${to}"]`))).toBeDefined();
  });
});

describe('app (stavewise#720)', () => {
  const PATHS = ['/de/noten-lesen-app-android', '/en/sight-reading-app-android'] as const;
  const OTHERS = ['connect', 'cable', 'bassClef', 'bothHands'] as const;

  /** H2 sections of the article text (without the closing card): heading and the text up to the next H2. */
  const sectionsOf = (path: string) => {
    const article = documentOf(path).querySelector('main article')!;
    const sections: { heading: string; body: string }[] = [];
    for (const el of article.children) {
      if (el.closest('.cta') || el.classList.contains('cta') || el.classList.contains('author')) break;
      if (el.tagName === 'H2') sections.push({ heading: text(el), body: '' });
      else if (sections.length > 0) sections[sections.length - 1].body += ` ${text(el)}`;
    }
    return sections;
  };

  it('/de/noten-lesen-app-android links its English version', () => {
    const link = documentOf('/de/noten-lesen-app-android').querySelector('a[hreflang="en"]');
    expect(link?.getAttribute('href')).toBe('/en/sight-reading-app-android');
  });

  it('/en/sight-reading-app-android links its German version', () => {
    const link = documentOf('/en/sight-reading-app-android').querySelector('a[hreflang="de"]');
    expect(link?.getAttribute('href')).toBe('/de/noten-lesen-app-android');
  });

  it.each(PATHS)('%s points x-default at the English version', (path) => {
    const xDefault = documentOf(path)
      .querySelector('link[rel="alternate"][hreflang="x-default"]')
      ?.getAttribute('href');
    expect(xDefault).toBe('https://stavewise.app/en/sight-reading-app-android');
  });

  it('lists both versions in the sitemap', () => {
    const locs = [
      ...new JSDOM(read('sitemap.xml'), { contentType: 'text/xml' }).window.document.querySelectorAll('loc'),
    ].map((loc) => loc.textContent);
    expect(locs).toContain(`${ORIGIN}/de/noten-lesen-app-android`);
    expect(locs).toContain(`${ORIGIN}/en/sight-reading-app-android`);
  });

  // Criteria, not a comparison: no table with ticks against competitors (launch § 14.3).
  it.each(PATHS)('%s has no <table>', (path) => {
    expect(documentOf(path).querySelectorAll('table')).toHaveLength(0);
  });

  it.each(PATHS)('%s keeps "Simply Piano Alternative" out of the title', (path) => {
    expect(text(documentOf(path).querySelector('title'))).not.toMatch(/alternative/i);
  });

  // Page 5 → all (launch § 14.6): one cross-reference line per other guide page.
  it.each(PATHS)('%s links all four other guide pages in cross-reference lines', (path) => {
    const lang = path.startsWith('/de/') ? 'de' : 'en';
    const lines = [...documentOf(path).querySelectorAll('main p.related')];
    for (const other of OTHERS) {
      expect(lines.find((p) => p.querySelector(`a[href="${pathOf(lang, other)}"]`))).toBeDefined();
    }
  });

  // The other apps are named factually with the date their store listings were checked.
  it.each([
    ['/de/noten-lesen-app-android', /Stand der Play-Einträge: \d{1,2}\. [A-ZÄÖÜ][a-zäöü]+ \d{4}/],
    ['/en/sight-reading-app-android', /Play listings as of \d{1,2} [A-Z][a-z]+ \d{4}/],
  ] as const)('%s names the check date of the store listings', (path, pattern) => {
    expect(text(documentOf(path).querySelector('main'))).toMatch(pattern);
  });

  // Every app claim has a source: each named app links its Play listing.
  it.each(PATHS)('%s links the Play listings of the apps it names', (path) => {
    const listings = [...documentOf(path).querySelectorAll('main a')]
      .map((a) => a.getAttribute('href') ?? '')
      .filter((href) => href.startsWith('https://play.google.com/store/apps/details?id='));
    expect(new Set(listings).size).toBeGreaterThanOrEqual(5);
  });

  // Stavewise comes at the end (launch § 14.3): no section before the one ahead of "Fragen" names it.
  it.each(PATHS)('%s names Stavewise only at the end of the text', (path) => {
    const sections = sectionsOf(path);
    expect(sections.length).toBeGreaterThanOrEqual(5);
    const named = sections.map((s) => /Stavewise/.test(`${s.heading} ${s.body}`));
    expect(named.indexOf(true)).toBe(sections.length - 2);
  });

  // No amount (launch § 6.1), the fixed wording instead.
  it.each([
    ['/de/noten-lesen-app-android', 'Level 1 bis 9 frei, die Vollversion kaufst du einmal in Google Play, kein Abo'],
    ['/en/sight-reading-app-android', 'Levels 1 to 9 are free, you buy the full version once in Google Play, no subscription'],
  ] as const)('%s describes the price without an amount', (path, wording) => {
    expect(text(documentOf(path).querySelector('main'))).toContain(wording);
  });

  it.each(PATHS)('%s shows the app screenshot in a card and no demo still', (path) => {
    const doc = documentOf(path);
    expect(doc.querySelector('main figure.still')).toBeNull();
    const images = [...doc.querySelectorAll('main figure.shot img')];
    expect(images).toHaveLength(1);
    expect(images[0].getAttribute('alt')).not.toBe('');
  });
});

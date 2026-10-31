import { describe, expect, it } from 'vitest';
import { documentOf, FILES } from './dist';

const HEADINGS = {
  de: 'Noten lesen lernen, indem du sie spielst.',
  en: 'Learn to read music by playing it.',
} as const;

const TITLES = {
  de: 'Stavewise: Noten lesen lernen am E-Piano, App für Android',
  en: 'Stavewise: Sight reading app for your digital piano (Android)',
} as const;

const DESCRIPTION_ENDS = {
  de: 'Kein Abo, offline.',
  en: 'No subscription, offline.',
} as const;

/** Link texts of the guide links on the home page (launch § 14.6, variant B). */
const GUIDE_LINKS = {
  de: { ways: 'Ausführliche Anleitung →', more: 'Mehr dazu' },
  en: { ways: 'Step-by-step guide →', more: 'More' },
} as const;

const textOf = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

const imagesOf = (doc: Document) => [...doc.querySelectorAll('main img')];

describe.each(['de', 'en'] as const)('/%s/ home page', (lang) => {
  const path = `/${lang}/`;
  const doc = () => documentOf(path);
  const main = () => doc().querySelector('main')!;

  it('has the claim as its only <h1>', () => {
    const h1s = doc().querySelectorAll('h1');
    expect(h1s).toHaveLength(1);
    expect(h1s[0]?.textContent?.trim()).toBe(HEADINGS[lang]);
  });

  it('has the title of launch § 14.6', () => {
    expect(doc().title).toBe(TITLES[lang]);
  });

  it('adds "no subscription, offline" to the description', () => {
    const description = doc().querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
    expect(description.endsWith(DESCRIPTION_ENDS[lang])).toBe(true);
  });

  it('links both cards of the two ways to the connect guide', () => {
    const cards = [...main().querySelectorAll('.ways .card')];
    expect(cards).toHaveLength(2);
    for (const card of cards) {
      const link = card.querySelector('a.card-foot');
      expect(link?.getAttribute('href')).toBe(`/${lang}/${lang === 'de' ? 'e-piano-mit-android-verbinden' : 'connect-digital-piano-to-android'}`);
      expect(textOf(link)).toBe(GUIDE_LINKS[lang].ways);
    }
  });

  it('links the connect and the cable guide from the answer to "will my piano work?"', () => {
    const first = main().querySelectorAll('.faq details')[0]!;
    const more = first.querySelector('p.more');
    expect(textOf(more?.querySelector('.label'))).toBe(GUIDE_LINKS[lang].more);
    const hrefs = [...(more?.querySelectorAll('a') ?? [])].map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(
      lang === 'de'
        ? ['/de/e-piano-mit-android-verbinden', '/de/usb-to-host-kabel']
        : ['/en/connect-digital-piano-to-android', '/en/usb-to-host-cable'],
    );
  });

  it('links guides from nowhere else in <main>', () => {
    const guideLinks = [...main().querySelectorAll('a')].filter((a) =>
      /verbinden|kabel|connect|cable|bass|haende|clef|app-android|reading-app/.test(a.getAttribute('href') ?? ''),
    );
    expect(guideLinks).toHaveLength(4);
  });

  it('shows four readouts with 65, 1–9, 12+ and 0', () => {
    const wells = [...main().querySelectorAll('.readouts .readout .well')].map((el) =>
      el.textContent?.trim(),
    );
    expect(wells).toEqual(['65', '1–9', '12+', '0']);
  });

  it('has a data sheet with five rows in German, four in English', () => {
    expect(main().querySelectorAll('.sheet tr')).toHaveLength(lang === 'de' ? 5 : 4);
  });

  it('has five questions as <details>, the first one open', () => {
    const details = [...main().querySelectorAll('details')];
    expect(details).toHaveLength(5);
    expect(details.map((d) => d.hasAttribute('open'))).toEqual([true, false, false, false, false]);
  });

  it('promises no "real melodies", names no price and links no pianos page', () => {
    const text = doc().body.textContent ?? '';
    expect(text).not.toMatch(/echte Melodie/i);
    expect(text).not.toMatch(/real melod/i);
    expect(text).not.toContain('€');
    const hrefs = [...doc().querySelectorAll('a')].map((a) => a.getAttribute('href') ?? '');
    expect(hrefs.filter((href) => href.includes('/pianos'))).toEqual([]);
  });

  it('shows three WebP images with alt text and size', () => {
    const images = imagesOf(doc());
    expect(images).toHaveLength(3);
    for (const img of images) {
      expect(img.getAttribute('src')).toMatch(/\.webp$/);
      expect(img.getAttribute('alt')?.trim()).not.toBe('');
      expect(Number(img.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(img.getAttribute('height'))).toBeGreaterThan(0);
    }
  });

  it('links the support address for teachers', () => {
    const hrefs = [...main().querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('mailto:support@stavewise.app');
  });
});

describe('home page images', () => {
  it('uses a different result screenshot in English', () => {
    const resultOf = (lang: 'de' | 'en') => imagesOf(documentOf(`/${lang}/`))[1]?.getAttribute('src');
    expect(resultOf('de')).toBeTruthy();
    expect(resultOf('en')).toBeTruthy();
    expect(resultOf('en')).not.toBe(resultOf('de'));
  });

  it('ships no PNG screenshot in dist/', () => {
    // logo.png is the Organization logo of the JSON-LD (launch § 14.7 Nr. 6) and
    // og/stavewise-<lang>.png the preview images (launch § 14.5), not screenshots.
    const allowed = ['logo.png', 'og/stavewise-de.png', 'og/stavewise-en.png'];
    expect(FILES.filter((file) => file.endsWith('.png') && !allowed.includes(file))).toEqual([]);
  });
});

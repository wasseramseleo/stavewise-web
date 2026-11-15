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

/** Captions under the three screenshots: figure number, then the line (launch § 6.1 Nr. 5, from 1.1.0). */
const CAPTIONS = {
  de: [
    ['1', 'Grundlagen: von den Tasten zu den ersten Noten.'],
    ['2', 'Mitten in der Phrase: gespielte Noten werden grün.'],
    ['3', 'Deine Lösezeit, Übung für Übung.'],
  ],
  en: [
    ['1', 'Basics: from the keys to your first notes.'],
    ['2', 'Mid-phrase: played notes turn green.'],
    ['3', 'Your solve time, exercise by exercise.'],
  ],
} as const;

/** Note of the readout "Frei 1–9" (launch § 6.1 Nr. 3, from 1.1.0). */
const FREE_NOTES = {
  de: 'Level ohne Kauf, dazu Grundlagen, Statistik und Streak',
  en: 'levels without buying, plus the basics, statistics and streak',
} as const;

/** Second row of the data sheet (launch § 6.1 Nr. 4, from 1.1.0). */
const EXPERIENCE_ROWS = {
  de: ['Vorwissen', 'keines, die Grundlagen fangen bei den Tasten an'],
  en: ['Experience', 'none, the basics start at the keys'],
} as const;

/** Start of the full-version card (launch § 6.1 Nr. 7, from 1.1.0). */
const FULL_TEXT_STARTS = {
  de: 'Die Grundlagen und Level 1 bis 9 sind frei.',
  en: 'The basics and levels 1 to 9 are free.',
} as const;

/** Second question, German word for word (launch § 6.1 Nr. 8, from 1.1.0); English in the tone of the page. */
const NO_READING = {
  de: {
    question: 'Ich kann noch gar keine Noten lesen. Geht das?',
    answer:
      'Ja. Die Grundlagen beginnen bei den schwarzen Tasten: In sieben kurzen Einheiten findest du das mittlere C und liest C und G im Violinschlüssel. Danach geht es mit Level 1 weiter. Die Grundlagen sind kostenlos.',
  },
  en: {
    question: 'I can’t read music at all yet. Can I still start?',
    answer:
      'Yes. The basics start at the black keys: in seven short units you find middle C and read C and G in the treble clef. Then you carry on with level 1. The basics are free.',
  },
} as const;

/** Sixth question, word for word (launch § 15.8 Nr. 3, stavewise#830). */
const EARLY_ACCESS = {
  de: {
    question: 'Was heißt Early Access?',
    answer:
      'Stavewise ist in Google Play im offenen Test, bevor es offiziell startet. Jede:r kann es installieren, ohne Einladung. Die Vollversion ist ein normaler Kauf und bleibt dir auch nach dem Start. Bewertungen gehen bis dahin privat an uns statt öffentlich in den Store.',
    link: 'Mehr zum offenen Test',
  },
  en: {
    question: 'What does early access mean?',
    answer:
      'Stavewise is in open testing on Google Play before its official launch. Anyone can install it, no invitation needed. The full version is a regular purchase and stays yours after launch. Until then, reviews go privately to us instead of publicly to the store.',
    link: 'More about early access',
  },
} as const;

const textOf = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

/** Content images of the page; the Play badge in the hero is tested in hero.test.ts and badge.test.ts. */
const imagesOf = (doc: Document) => [...doc.querySelectorAll('main img')].filter((img) => !img.closest('.play-badge'));

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
    expect(textOf(more)).not.toContain('·');
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

  it('shows four readouts with 65, 1–9, 12+ and no account', () => {
    const wells = [...main().querySelectorAll('.readouts .readout .well')].map((el) =>
      el.textContent?.trim(),
    );
    expect(wells).toEqual(['65', '1–9', '12+', lang === 'de' ? 'keines' : 'none']);
  });

  it('notes the basics under the free levels', () => {
    const free = [...main().querySelectorAll('.readouts .readout')][1];
    expect(textOf(free?.querySelector('small'))).toBe(FREE_NOTES[lang]);
  });

  it('has a data sheet with six rows in German, five in English', () => {
    expect(main().querySelectorAll('.sheet tr')).toHaveLength(lang === 'de' ? 6 : 5);
  });

  it('names the prior knowledge in the second row of the data sheet', () => {
    const row = main().querySelectorAll('.sheet tr')[1];
    expect([textOf(row?.querySelector('th')), textOf(row?.querySelector('td'))]).toEqual(EXPERIENCE_ROWS[lang]);
  });

  it('frees the basics and levels 1 to 9 on the full-version card', () => {
    expect(textOf(main().querySelector('.split .card.price p'))?.startsWith(FULL_TEXT_STARTS[lang])).toBe(true);
  });

  it('has seven questions as <details>, the first one open', () => {
    const details = [...main().querySelectorAll('details')];
    expect(details).toHaveLength(7);
    expect(details.map((d) => d.hasAttribute('open'))).toEqual([true, false, false, false, false, false, false]);
  });

  it('answers readers who can’t read music yet in the second question', () => {
    const second = main().querySelectorAll('.faq details')[1]!;
    expect(textOf(second.querySelector('summary'))).toBe(NO_READING[lang].question);
    expect([...second.querySelectorAll('div > p')].map((p) => textOf(p))).toEqual([NO_READING[lang].answer]);
  });

  it('explains early access in the last question and links /beta from the answer', () => {
    const last = [...main().querySelectorAll('.faq details')].at(-1)!;
    expect(textOf(last.querySelector('summary'))).toBe(EARLY_ACCESS[lang].question);
    const paragraphs = [...last.querySelectorAll('div > p')];
    expect(textOf(paragraphs[0])).toBe(EARLY_ACCESS[lang].answer);
    const links = [...last.querySelectorAll('a')];
    expect(links).toHaveLength(1);
    expect(links[0]!.getAttribute('href')).toBe(`/${lang}/beta`);
    expect(textOf(links[0])).toBe(EARLY_ACCESS[lang].link);
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

  it('addresses teachers, gender-inclusive in German', () => {
    const labels = [...main().querySelectorAll('.split .label')].map((el) => textOf(el));
    expect(labels).toContain(lang === 'de' ? 'Für Klavierlehrer:innen' : 'For piano teachers');
  });

  it('captions each screenshot as a numbered figure', () => {
    const figures = [...main().querySelectorAll('.shots figure')];
    expect(figures).toHaveLength(3);
    expect(figures.map((f) => f.querySelector('img'))).not.toContain(null);
    const captions = figures.map((f) => [
      textOf(f.querySelector('figcaption .num')),
      textOf(f.querySelector('figcaption .line')),
    ]);
    expect(captions).toEqual(CAPTIONS[lang]);
  });

  it('shows the basics, an exercise and the solve-time curve, in this order', () => {
    const alts = imagesOf(doc()).map((img) => img.getAttribute('alt') ?? '');
    const starts = lang === 'de' ? ['Grundlagen', 'Übung', 'Statistik'] : ['Basics', 'Exercise', 'Statistics'];
    expect(alts.map((alt, i) => alt.startsWith(starts[i]!))).toEqual([true, true, true]);
    expect(alts[2]).toMatch(lang === 'de' ? /Lösezeit/ : /solve time/);
  });

  it('links the support address for teachers', () => {
    const hrefs = [...main().querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('mailto:support@stavewise.app');
  });
});

describe('home page images', () => {
  it('uses its own screenshots in English', () => {
    const srcsOf = (lang: 'de' | 'en') => imagesOf(documentOf(`/${lang}/`)).map((img) => img.getAttribute('src'));
    const [de, en] = [srcsOf('de'), srcsOf('en')];
    expect(de).toHaveLength(3);
    expect(en).toHaveLength(3);
    de.forEach((src, i) => {
      expect(src).toBeTruthy();
      expect(en[i]).not.toBe(src);
    });
  });

  it('ships no PNG screenshot in dist/', () => {
    // logo.png is the Organization logo of the JSON-LD (launch § 14.7 Nr. 6) and
    // og/stavewise-<lang>.png the preview images (launch § 14.5), not screenshots.
    const allowed = ['logo.png', 'og/stavewise-de.png', 'og/stavewise-en.png'];
    expect(FILES.filter((file) => file.endsWith('.png') && !allowed.includes(file))).toEqual([]);
  });
});

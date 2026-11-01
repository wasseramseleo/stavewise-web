// Official Google Play badge (launch § 15.8, stavewise#830): self-hosted SVG
// from Google's badge page, one per language, the same visible height in both.
import { describe, expect, it } from 'vitest';
import { FILES, documentOf, pathOf, read, type Lang } from './dist';

const BADGES = {
  de: { file: 'badges/google-play-de.svg', alt: 'Jetzt bei Google Play' },
  en: { file: 'badges/google-play-en.svg', alt: 'Get it on Google Play' },
} as const satisfies Record<Lang, { file: string; alt: string }>;

const LANGS = ['de', 'en'] as const;

/** Every badge image on the pages that show it: home page, the five guides and /beta. */
const PAGES_WITH_BADGE = LANGS.flatMap((lang) =>
  (['home', 'connect', 'cable', 'bassClef', 'bothHands', 'app', 'beta'] as const).map((name) => ({ lang, path: pathOf(lang, name) })),
);

const viewBoxOf = (svg: string) => /<svg[^>]*viewBox="([^"]+)"/.exec(svg)?.[1];

describe('Google Play badge files', () => {
  it.each(LANGS)('ships the %s badge as SVG without script or external reference', (lang) => {
    expect(FILES).toContain(BADGES[lang].file);
    const svg = read(BADGES[lang].file);
    expect(svg).toMatch(/<svg[\s>]/);
    expect(svg).not.toMatch(/<script|href=|url\(/i);
  });

  it('draws both languages on the same canvas, so the same height looks the same', () => {
    const [de, en] = LANGS.map((lang) => viewBoxOf(read(BADGES[lang].file)));
    expect(de).toBeDefined();
    expect(de).toBe(en);
  });
});

describe.each(PAGES_WITH_BADGE)('badge on $path', ({ lang, path }) => {
  const badge = () => documentOf(path).querySelector('main a.play-badge img')!;

  it('uses the badge of its language with the badge text as alt text', () => {
    expect(badge().getAttribute('src')).toBe(`/${BADGES[lang].file}`);
    expect(badge().getAttribute('alt')).toBe(BADGES[lang].alt);
  });

  it('is at least 28px high, the same in both languages', () => {
    expect(Number(badge().getAttribute('height'))).toBeGreaterThanOrEqual(28);
    const other = documentOf(pathOf(lang === 'de' ? 'en' : 'de', 'home')).querySelector('main a.play-badge img')!;
    expect(badge().getAttribute('height')).toBe(other.getAttribute('height'));
    expect(badge().getAttribute('width')).toBe(other.getAttribute('width'));
  });
});

import { describe, expect, it } from 'vitest';
import { documentOf } from './dist';

// Impressum DE/EN with the #542 draft, section 1 (ticket wasseramseleo/stavewise#599).
const PAGES = [
  {
    path: '/de/impressum',
    heading: 'Impressum',
  },
  {
    path: '/en/impressum',
    heading: 'Legal notice',
  },
] as const;

const FACTS = [
  'Mind the Brain FlexCo',
  'Mentlgasse 1/Raum 13, 6020 Innsbruck',
  'FN 678378s',
  'ATU83338345',
  '+43 678 782 2508',
  'Viktoria Mall, Leonard Guelmino',
  'Landesgericht Innsbruck',
];

const text = (el: Element | null | undefined): string =>
  (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

describe.each(PAGES)('$path', ({ path, heading }) => {
  const main = () => documentOf(path).querySelector('main')!;

  it('has the heading of its language', () => {
    expect(text(main().querySelector('h1'))).toBe(heading);
  });

  it.each(FACTS)('names %s', (fact) => {
    expect(text(main())).toContain(fact);
  });

  it('has no [prüfen] marker: GISA confirmed chamber and trade authority (#591)', () => {
    expect(main().querySelectorAll('.pruefen')).toHaveLength(0);
  });

  it('lists all 13 entries of the draft', () => {
    const dls = main().querySelectorAll('dl');
    expect(dls).toHaveLength(1);
    expect(dls[0]!.querySelectorAll('dt')).toHaveLength(13);
    expect(dls[0]!.querySelectorAll('dd')).toHaveLength(13);
  });

  it('links the support address and the phone number once each', () => {
    const hrefs = [...main().querySelectorAll('a')].map((a) => a.getAttribute('href') ?? '');
    expect(hrefs.filter((href) => href === 'mailto:support@stavewise.app')).toHaveLength(1);
    expect(hrefs.filter((href) => href.startsWith('tel:'))).toEqual(['tel:+436787822508']);
  });

  it('links the legal information system', () => {
    const hrefs = [...main().querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('https://www.ris.bka.gv.at');
  });
});

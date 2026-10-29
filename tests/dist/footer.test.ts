// Guide group in the footer of every page (launch § 14.6, footer variant C).
import { describe, expect, it } from 'vitest';
import { PAGES, documentOf, pathOf, type Lang, type PageName } from './dist';

const GUIDES: readonly PageName[] = ['connect', 'cable', 'bassClef', 'bothHands', 'app'];

/** Label of the row and its three groups with their pages, in order. */
const GROUPS: Record<Lang, { label: string; groups: readonly (readonly [string, readonly PageName[]])[] }> = {
  de: {
    label: 'Ratgeber',
    groups: [
      ['Technik', ['connect', 'cable']],
      ['Noten lesen', ['bassClef', 'bothHands']],
      ['App', ['app']],
    ],
  },
  en: {
    label: 'Guides',
    groups: [
      ['Setup', ['connect', 'cable']],
      ['Reading music', ['bassClef', 'bothHands']],
      ['App', ['app']],
    ],
  },
};

const guidesOf = (path: string) => documentOf(path).querySelector('footer nav.guides')!;
const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();

describe.each(PAGES)('footer guides on $path', (page) => {
  const expected = GROUPS[page.lang];

  it('has a guide row labelled in its language', () => {
    const nav = guidesOf(page.path);
    expect(nav).not.toBeNull();
    expect(nav.getAttribute('aria-label')).toBe(expected.label);
    expect(text(nav.querySelector('.label'))).toBe(expected.label);
  });

  it('lists the five guides in three groups of its language', () => {
    const groups = [...guidesOf(page.path).querySelectorAll('.group')];
    expect(groups.map((g) => text(g.querySelector('.group-name')))).toEqual(expected.groups.map(([name]) => name));
    groups.forEach((group, i) => {
      const items = [...group.querySelectorAll('li > a, li > span[aria-current="page"]')];
      const targets = expected.groups[i]![1];
      expect(items).toHaveLength(targets.length);
      items.forEach((item, j) => {
        const target = pathOf(page.lang, targets[j]!);
        if (item.tagName === 'A') expect(item.getAttribute('href')).toBe(target);
        else expect(target).toBe(page.path);
        expect(text(item)).not.toBe('');
      });
    });
  });

  it('shows the current page as text, all others as links', () => {
    const nav = guidesOf(page.path);
    const links = [...nav.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    const current = [...nav.querySelectorAll('[aria-current="page"]')];
    if (GUIDES.includes(page.name)) {
      expect(links).toHaveLength(4);
      expect(links).not.toContain(page.path);
      expect(current).toHaveLength(1);
      expect(current[0]!.tagName).toBe('SPAN');
    } else {
      expect(links).toEqual(GUIDES.map((name) => pathOf(page.lang, name)));
      expect(current).toHaveLength(0);
    }
  });
});

describe('footer guides, examples', () => {
  it('shows "Bassschlüssel …" as the current page on /de/bassschluessel-lesen', () => {
    const current = guidesOf('/de/bassschluessel-lesen').querySelector('span[aria-current="page"]');
    expect(text(current)).toMatch(/^Bassschlüssel/);
    const links = [...guidesOf('/de/bassschluessel-lesen').querySelectorAll('a')].map((a) => text(a));
    expect(links.filter((t) => t?.startsWith('Bassschlüssel'))).toEqual([]);
  });

  it('names the guides in German on /de/ and in English on /en/', () => {
    const names = (path: string) => [...guidesOf(path).querySelectorAll('li > a')].map((a) => text(a));
    expect(names('/de/')).toEqual([
      'E-Piano mit Android verbinden',
      'Welches Kabel: USB to Host und OTG',
      'Bassschlüssel lesen lernen',
      'Noten lesen mit beiden Händen',
      'Noten lesen lernen mit App',
    ]);
    expect(names('/en/')).toEqual([
      'Connect a digital piano to Android',
      'Which cable: USB to Host and OTG',
      'How to read bass clef',
      'Reading treble and bass clef together',
      'Sight reading app for Android',
    ]);
  });
});

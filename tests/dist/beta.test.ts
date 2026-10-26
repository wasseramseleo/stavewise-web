import { describe, expect, it } from 'vitest';
import { documentOf } from './dist';

const CASES = [
  {
    path: '/de/beta',
    heading: 'Tester mit eigenem E-Piano gesucht',
    button: 'Zum Bewerbungsformular',
    privacy: '/de/privacy#website',
  },
  {
    path: '/en/beta',
    heading: 'Looking for testers with a digital piano',
    button: 'Go to the application form',
    privacy: '/en/privacy#website',
  },
] as const;

const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe.each(CASES)('$path', ({ path, heading, button, privacy }) => {
  const doc = () => documentOf(path);
  const main = () => doc().querySelector('main')!;

  it('has the call as its heading', () => {
    const headings = doc().querySelectorAll('h1');
    expect(headings).toHaveLength(1);
    expect(text(headings[0])).toBe(heading);
  });

  it('lists the process in exactly one ordered list of four steps', () => {
    const lists = main().querySelectorAll('ol');
    expect(lists).toHaveLength(1);
    expect(lists[0]!.querySelectorAll(':scope > li')).toHaveLength(4);
  });

  it('does not promise "real" melodies', () => {
    expect(text(main())).not.toMatch(/echte\s+Melodien|real\s+melodies/i);
  });

  it('shows the form button without a link while betaFormUrl is null', () => {
    const links = [...doc().querySelectorAll('a')].filter((a) => text(a) === button);
    expect(links).toEqual([]);

    const form = main().querySelector('.beta-form');
    expect(form).not.toBeNull();
    const disabled = form!.querySelector('[aria-disabled="true"]');
    expect(text(disabled)).toBe(button);
    expect(form!.querySelector('.pruefen')).not.toBeNull();
  });

  it('points to part B of the privacy policy', () => {
    const hrefs = [...main().querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain(privacy);
  });

  it('offers the support address for questions', () => {
    const hrefs = [...main().querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('mailto:support@stavewise.app');
  });
});

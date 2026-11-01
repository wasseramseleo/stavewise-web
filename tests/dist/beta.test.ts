// /beta as the page about the open test with the test team call below
// (launch § 15.8, variant C; stavewise#831).
import { describe, expect, it } from 'vitest';
import { documentOf } from './dist';

const FORM_URL =
  'https://forms.office.com/Pages/ResponsePage.aspx?id=usvaxFJ9yUqH2KhXLAIoT2ieVcdFXUpHs7N5luK9m4lUNTE2R0kyRkRPRkc2QlBRS1hPUDExVDVMWS4u';

const CASES = [
  {
    path: '/de/beta',
    lang: 'de',
    title: 'Offener Test | Stavewise',
    label: 'Offener Test',
    heading: 'Stavewise ist im offenen Test',
    lead: 'Bevor Stavewise offiziell in Google Play startet, ist es für alle als Early Access zu haben. Du installierst es ganz normal aus Google Play, ohne Anmeldung und ohne Einladung.',
    whatHeading: 'Was das für dich heißt',
    what: [
      'Level 1 bis 9 sind frei, die Vollversion kaufst du einmal. Der Kauf ist echt und bleibt dir nach dem Start.',
      'Google Play zeigt Stavewise als Early Access. Bewertungen gehen bis zum Start privat an uns, nicht öffentlich in den Store.',
      'Updates kommen über Google Play wie bei jeder App.',
    ],
    feedback:
      'Klappt etwas nicht, oder fehlt dir etwas? Schreib an support@stavewise.app; mit Piano-Modell und Gerät helfen wir am schnellsten.',
    teamHeading: 'Ins Testteam',
    team: 'Für den geschlossenen Test suchen wir weiter Tester:innen mit möglichst verschiedenen Pianos und Geräten. Du übst etwa eine halbe Stunde, füllst einen Fragebogen aus (etwa 10 Minuten) und bekommst als Dank die Vollversion dauerhaft kostenlos.',
    button: 'Zum Bewerbungsformular',
    privacy: '/de/privacy#website',
    privacyLink: 'Datenschutz, Teil B',
  },
  {
    path: '/en/beta',
    lang: 'en',
    title: 'Early access | Stavewise',
    label: 'Early access',
    heading: 'Stavewise is in early access',
    lead: 'Before Stavewise officially launches on Google Play, anyone can get it as early access. You install it from Google Play like any other app, no sign-up, no invitation.',
    whatHeading: 'What that means for you',
    what: [
      'Levels 1 to 9 are free, the full version is a one-time purchase. The purchase is real and stays yours after launch.',
      'Google Play shows Stavewise as early access. Until launch, reviews go privately to us, not publicly to the store.',
      'Updates come through Google Play like for any app.',
    ],
    feedback:
      'Something not working, or something missing? Write to support@stavewise.app; your piano model and device help us most.',
    teamHeading: 'Join the test team',
    team: 'For the closed test we are still looking for testers with as many different pianos and devices as possible. You practise for about half an hour, fill in a questionnaire (about 10 minutes) and get the full version for free, for good, as a thank-you.',
    button: 'Go to the application form',
    privacy: '/en/privacy#website',
    privacyLink: 'privacy policy, part B',
  },
] as const;

const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim() ?? '';

describe.each(CASES)('$path', (c) => {
  const doc = () => documentOf(c.path);
  const main = () => doc().querySelector('main')!;
  const h2 = () => [...main().querySelectorAll('h2')];

  it('is titled as the open test', () => {
    expect(text(doc().querySelector('title'))).toBe(c.title);
  });

  it('names the open test and the test team in its meta description', () => {
    const description = doc().querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
    expect(description).toMatch(c.lang === 'de' ? /offenen Test/ : /early access/);
    expect(description).toMatch(c.lang === 'de' ? /Testteam/ : /test team/);
  });

  it('opens with the label, the heading and the lead', () => {
    expect(text(main().querySelector('.label'))).toBe(c.label);
    const headings = doc().querySelectorAll('h1');
    expect(headings).toHaveLength(1);
    expect(text(headings[0])).toBe(c.heading);
    expect(text(headings[0]!.nextElementSibling)).toBe(c.lead);
  });

  it('shows the Play badge of its language right after the lead', () => {
    const badge = main().querySelector('a.play-badge');
    expect(badge).not.toBeNull();
    expect(badge!.getAttribute('href')).toBe(`https://play.google.com/store/apps/details?id=app.stavewise&hl=${c.lang}`);
    expect(badge!.querySelector('img')?.getAttribute('src')).toBe(`/badges/google-play-${c.lang}.svg`);
    const lead = doc().querySelector('h1')!.nextElementSibling!;
    expect(lead.nextElementSibling!.contains(badge)).toBe(true);
  });

  it('says what the open test means in exactly three points', () => {
    expect(h2().map(text)).toEqual([c.whatHeading, c.teamHeading]);
    const list = h2()[0]!.nextElementSibling!;
    expect(list.tagName).toBe('UL');
    expect([...list.querySelectorAll(':scope > li')].map(text)).toEqual(c.what);
    expect(main().querySelectorAll('ol')).toHaveLength(0);
  });

  it('asks for feedback by mail to the support address, before the test team', () => {
    const paragraphs = [...main().querySelectorAll('p')].filter((p) => text(p) === c.feedback);
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]!.querySelector('a')?.getAttribute('href')).toBe('mailto:support@stavewise.app');
    expect(paragraphs[0]!.compareDocumentPosition(h2()[1]!) & 4).toBeTruthy();
  });

  it('calls for the closed test team below, with the form and part B of the privacy policy', () => {
    const form = h2()[1]!.nextElementSibling!;
    expect(form.classList.contains('beta-form')).toBe(true);
    expect(text(form.querySelector('p'))).toBe(c.team);
    const buttons = [...form.querySelectorAll('a')].filter((a) => text(a) === c.button);
    expect(buttons).toHaveLength(1);
    expect(buttons[0]!.getAttribute('href')).toBe(FORM_URL);
    expect(form.querySelector('[aria-disabled]')).toBeNull();
    const privacy = [...form.querySelectorAll('a')].filter((a) => a.getAttribute('href') === c.privacy);
    expect(privacy.map(text)).toEqual([c.privacyLink]);
  });

  it('never says "Beta" on its own and does not promise "real" melodies', () => {
    expect(text(main())).not.toMatch(/\bbeta\b/i);
    expect(text(main())).not.toMatch(/echte\s+Melodien|real\s+melodies/i);
  });

  it('does not show the closing note of the call', () => {
    expect(text(main())).not.toMatch(/ist geschlossen|is closed/);
  });
});

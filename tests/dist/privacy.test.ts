import { describe, expect, it } from 'vitest';
import { documentOf } from './dist';

// Privacy policy (#598): the #542 draft verbatim, anchors fixed for app and /beta.

/** Text of the page body with whitespace collapsed, as a reader sees it. */
function textOf(doc: Document): string {
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ');
}

/** Node.DOCUMENT_POSITION_FOLLOWING; the suite runs in node, where `Node` is no global. */
const FOLLOWING = 4;

/** Whether `a` comes after `b` in document order. */
function follows(a: Node, b: Node): boolean {
  return (b.compareDocumentPosition(a) & FOLLOWING) !== 0;
}

describe.each(['/de/privacy', '/en/privacy'])('%s', (path) => {
  it('has the sections #app, #website and #rechte in this order', () => {
    const doc = documentOf(path);
    const [app, website, rechte] = ['app', 'website', 'rechte'].map((id) => doc.getElementById(id));
    expect(app).not.toBeNull();
    expect(website).not.toBeNull();
    expect(rechte).not.toBeNull();
    expect(follows(website!, app!)).toBe(true);
    expect(follows(rechte!, website!)).toBe(true);
  });

  it('marks two passages [prüfen]: one in #app, one in #website', () => {
    const doc = documentOf(path);
    const marks = [...doc.querySelectorAll('.pruefen')];
    expect(marks).toHaveLength(2);
    const app = doc.getElementById('app')!;
    const website = doc.getElementById('website')!;
    const rechte = doc.getElementById('rechte')!;
    expect(follows(marks[0]!, app) && follows(website, marks[0]!)).toBe(true);
    expect(follows(marks[1]!, website) && follows(rechte, marks[1]!)).toBe(true);
  });

  it('links support@stavewise.app and dsb@dsb.gv.at by mailto:', () => {
    const hrefs = [...documentOf(path).querySelectorAll('main a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('mailto:support@stavewise.app');
    expect(hrefs).toContain('mailto:dsb@dsb.gv.at');
  });

  it('links the web addresses in the text with https://', () => {
    const hrefs = [...documentOf(path).querySelectorAll('main a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('https://policies.google.com/privacy');
    expect(hrefs).toContain('https://www.dsb.gv.at');
  });

  it('shows no Markdown anchor syntax', () => {
    expect(textOf(documentOf(path))).not.toMatch(/\{#/);
  });
});

describe('/de/privacy text', () => {
  const text = () => textOf(documentOf('/de/privacy'));

  it.each([
    'Die App sammelt keine Daten und schickt nichts an uns.',
    'Die Website setzt keine Cookies, lädt keine Skripte und keine Inhalte von anderen Servern und nutzt keine Analysedienste.',
    'Die Protokolle löschen wir nach 14 Tagen.',
    'Stand: [Datum der Veröffentlichung]',
  ])('contains „%s“', (sentence) => {
    expect(text()).toContain(sentence);
  });

  it('never promises „nie“ (#542 decision 7)', () => {
    expect(text()).not.toMatch(/(?<!\p{L})nie(?!\p{L})/iu);
  });
});

describe('/en/privacy text', () => {
  const text = () => textOf(documentOf('/en/privacy'));

  // "never" is not checked here: the draft says "the app never sees them" in
  // Part A item 5 (open question 10 in #591).
  it.each([
    "The app doesn't collect any data and sends nothing to us.",
    'The website sets no cookies, loads no scripts and no content from other servers, and uses no analytics services.',
    'We delete the logs after 14 days.',
    'Last updated: [publication date]',
  ])('contains "%s"', (sentence) => {
    expect(text()).toContain(sentence);
  });
});

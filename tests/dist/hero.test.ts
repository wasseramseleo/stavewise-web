// Hero of the home page: claim in the engraving serif, the Play badge with a
// mono note (launch § 15.8 Nr. 1), and an animated score instead of the
// screenshot (src/lib/score.ts): an engraved score that behaves like the app.
import { describe, expect, it } from 'vitest';
import { FILES, documentOf, read } from './dist';

const ITALIC_TAILS = {
  de: 'indem du sie spielst.',
  en: 'by playing it.',
} as const;

const CTA_NOTES = {
  de: 'Android · offener Test',
  en: 'Android · early access',
} as const;

const BADGE_ALTS = { de: 'Jetzt bei Google Play', en: 'Get it on Google Play' } as const;

describe.each(['de', 'en'] as const)('/%s/ hero', (lang) => {
  const hero = () => documentOf(`/${lang}/`).querySelector('main .hero')!;

  it('sets the second half of the claim in italic', () => {
    expect(hero().querySelector('h1 em')?.textContent?.trim()).toBe(ITALIC_TAILS[lang]);
  });

  it('has the Play badge to the store listing instead of a button, with a mono note beside it', () => {
    expect(hero().querySelectorAll('a.btn')).toHaveLength(0);
    const badges = hero().querySelectorAll('a.play-badge');
    expect(badges).toHaveLength(1);
    expect(badges[0]!.getAttribute('href')).toBe(`https://play.google.com/store/apps/details?id=app.stavewise&hl=${lang}`);
    expect(badges[0]!.querySelector('img')?.getAttribute('alt')).toBe(BADGE_ALTS[lang]);
    expect(hero().querySelector('.btn-row .cta-note')?.textContent?.trim()).toBe(CTA_NOTES[lang]);
  });

  it('shows no screenshot, only the badge as an image', () => {
    const images = [...hero().querySelectorAll('img')];
    expect(images).toHaveLength(1);
    expect(images[0]!.closest('a.play-badge')).not.toBeNull();
  });

  it('draws the score as labelled inline SVG: four bars wide, two bars narrow', () => {
    const scores = [...hero().querySelectorAll('svg.score')];
    expect(scores.map((svg) => svg.getAttribute('data-bars'))).toEqual(['4', '2']);
    for (const svg of scores) {
      expect(svg.getAttribute('role')).toBe('img');
      expect(svg.getAttribute('aria-label')?.trim()).not.toBe('');
      expect(svg.querySelectorAll('.staff')).toHaveLength(2);
      expect(svg.querySelectorAll('.clef')).toHaveLength(2);
      expect(svg.querySelectorAll('.key')).toHaveLength(49); // C2 to C6
    }
  });
});

// The score's animation lives in a <style> inside each SVG (src/lib/score.ts).
// These helpers read it back: element id -> keyframe name and loop length, and
// the keyframes as [percent, declarations] with step timing.
type Frame = { at: number; decl: Record<string, string> };

function animationsOf(css: string) {
  const out = new Map<string, { name: string; seconds: number }>();
  for (const m of css.matchAll(/#([\w-]+)\{animation:([\w-]+) ([\d.]+)s steps\(1,end\) infinite\}/g)) {
    out.set(m[1]!, { name: m[2]!, seconds: Number(m[3]) });
  }
  return out;
}

function framesOf(css: string, name: string): Frame[] {
  const body = new RegExp(`@keyframes ${name}\\{((?:[\\d.]+%\\{[^}]*\\})+)\\}`).exec(css)?.[1] ?? '';
  return [...body.matchAll(/([\d.]+)%\{([^}]*)\}/g)].map((m) => ({
    at: Number(m[1]),
    decl: Object.fromEntries(m[2]!.split(';').filter(Boolean).map((d) => d.split(':') as [string, string])),
  }));
}

/** Value of a property at a moment, with steps(1, end): the last keyframe at or before it. */
const valueAt = (frames: Frame[], at: number, prop: string) => frames.filter((fr) => fr.at <= at).at(-1)?.decl[prop];

/** Moments at which a property changes to a value. */
const momentsOf = (frames: Frame[], prop: string, value: string) => frames.filter((fr) => fr.decl[prop] === value).map((fr) => fr.at);

const changesOf = (frames: Frame[], prop: string) =>
  frames.map((fr) => fr.decl[prop]).filter((v, i, all) => v !== undefined && v !== all[i - 1]);

describe.each(['de', 'en'] as const)('/%s/ hero score animation', (lang) => {
  const scores = () => [...documentOf(`/${lang}/`).querySelectorAll('main .hero svg.score')];

  it.each([0, 1])('score %i animates only when the visitor has not asked for less motion', (i) => {
    const css = scores()[i]!.querySelector('style')?.textContent ?? '';
    expect(css).toMatch(/^@media \(prefers-reduced-motion:no-preference\)\{[\s\S]*@keyframes[\s\S]*\}$/);
  });

  it.each([0, 1])('score %i runs every animated part on one loop length', (i) => {
    const svg = scores()[i]!;
    const animations = animationsOf(svg.querySelector('style')!.textContent!);
    expect(animations.size).toBeGreaterThan(20);
    expect(new Set([...animations.values()].map((a) => a.seconds)).size).toBe(1);
    for (const id of animations.keys()) expect(svg.querySelector(`#${id}`)).not.toBeNull();
  });

  describe.each([0, 1])('score %i', (i) => {
    const svg = () => scores()[i]!;
    const css = () => svg().querySelector('style')!.textContent!;
    const framesOfElement = (el: Element) => framesOf(css(), animationsOf(css()).get(el.id)!.name);
    const playhead = () => framesOfElement(svg().querySelector('.playhead')!);
    const translateAt = (at: number) => valueAt(playhead(), at, 'transform');
    const columns = () => new Set([...svg().querySelectorAll('.note')].map((n) => n.getAttribute('data-col'))).size;

    it('holds the playhead on each note column, one after the other, left to right', () => {
      const xs = changesOf(playhead(), 'transform').map((v) => Number(/translateX\(([\d.]+)px\)/.exec(v!)![1]));
      expect(xs).toHaveLength(columns());
      expect(xs).toEqual([...xs].sort((a, b) => a - b));
      expect(new Set(xs).size).toBe(xs.length);
    });

    it('turns each note green when its column is pressed, grey once the playhead moves on', () => {
      const xs = changesOf(playhead(), 'transform');
      for (const note of svg().querySelectorAll('.note')) {
        const frames = framesOfElement(note);
        expect(changesOf(frames, 'color')).toEqual(['var(--ink)', 'var(--success)', 'var(--n-past)']);
        const green = momentsOf(frames, 'color', 'var(--success)')[0]!;
        expect(translateAt(green)).toBe(xs[Number(note.getAttribute('data-col'))]);
        expect(valueAt(playhead(), green, 'opacity')).toBe('1');
      }
    });

    it('lights the wrong key first while the playhead waits, then the right key releases it', () => {
      const keys = [...svg().querySelectorAll('.key')].filter((k) => animationsOf(css()).has(k.id));
      const wrong = keys.filter((k) => momentsOf(framesOfElement(k), 'fill', 'var(--error)').length > 0);
      expect(wrong).toHaveLength(1);
      const wrongAt = momentsOf(framesOfElement(wrong[0]!), 'fill', 'var(--error)')[0]!;
      expect(valueAt(framesOfElement(svg().querySelector('.ghost')!), wrongAt, 'opacity')).toBe('1');
      const nextPress = Math.min(
        ...keys.flatMap((k) => momentsOf(framesOfElement(k), 'fill', 'var(--primary)')).filter((at) => at > wrongAt),
      );
      const pressedThen = keys.filter((k) => valueAt(framesOfElement(k), nextPress, 'fill') === 'var(--primary)');
      expect(pressedThen.map((k) => k.id)).not.toContain(wrong[0]!.id);
      expect(translateAt(nextPress)).toBe(translateAt(wrongAt));
      const after = playhead().find((fr) => fr.at > wrongAt && fr.decl.transform)!;
      expect(after.at).toBeGreaterThan(nextPress);
    });

    it('is a still frame without animation: playhead on a pressed column, earlier notes played', () => {
      const s = svg();
      const hit = [...s.querySelectorAll('.note.is-hit')];
      expect(hit.length).toBeGreaterThan(0);
      expect(new Set(hit.map((n) => n.getAttribute('data-col'))).size).toBe(1);
      const col = Number(hit[0]!.getAttribute('data-col'));
      expect(col).toBeGreaterThan(0);
      for (const n of s.querySelectorAll('.note')) {
        expect(n.classList.contains('is-past')).toBe(Number(n.getAttribute('data-col')) < col);
      }
      const x = /translate\(([\d.]+),0\)/.exec(s.querySelector('.playhead')!.getAttribute('transform') ?? '')?.[1];
      expect(`translateX(${x}px)`).toBe(changesOf(playhead(), 'transform')[col]);
      expect(s.querySelectorAll('.chip.is-on').length).toBe(hit.length);
      expect(s.querySelectorAll('.key.is-on').length).toBeGreaterThan(0);
    });
  });
});

describe('engraving serif of the hero', () => {
  it('ships TeX Gyre Schola as WOFF2 with its licence and declares it in the stylesheet', () => {
    for (const file of ['fonts/stavewise-schola-regular.woff2', 'fonts/stavewise-schola-italic.woff2', 'fonts/TEX-GYRE-SCHOLA-GUST-FONT-LICENSE.txt']) {
      expect(FILES).toContain(file);
    }
    expect(read('fonts/TEX-GYRE-SCHOLA-GUST-FONT-LICENSE.txt')).toContain('GUST Font License');
    const css = FILES.filter((file) => file.endsWith('.css')).map(read).join('\n');
    expect(css).toMatch(/font-family:\s*"?Stavewise Schola"?[^}]*font-style:\s*normal[^}]*stavewise-schola-regular\.woff2/);
    expect(css).toMatch(/font-family:\s*"?Stavewise Schola"?[^}]*font-style:\s*italic[^}]*stavewise-schola-italic\.woff2/);
  });
});

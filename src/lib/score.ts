// The animated score in the hero of the home page: a grand staff in B-flat
// major with the app's playhead, built at build time as SVG markup plus the CSS
// that animates it. The site ships no JavaScript, so the "performance" is one
// fixed, scripted timeline: the playhead waits on each note column until the
// correct keys go down (notes turn green, keys light up), then jumps to the
// next column. Once per loop the first press is wrong (red ghost note, red key).
// Every animation of one score shares the loop length and uses steps(1, end),
// so all parts change at exactly the same moments.
//
// Without animation (prefers-reduced-motion) the markup itself is the still
// frame: the playhead on the column at beat 7, at the moment of a correct press.
import { BASS as BASS_CLEF, FLAT, TREBLE as TREBLE_CLEF } from './score-glyphs';
import type { Lang } from './i18n';

const LETTERS = 'CDEFGAB';
const SEMITONES: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
/** Notes the key signature (B-flat major) lowers. */
const FLATTED = new Set(['B', 'E']);

interface Pitch {
  letter: string;
  flat: boolean;
  octave: number;
  /** Diatonic step: octave * 7 + letter index (C4 = 28). */
  step: number;
  midi: number;
}

function pitch(name: string): Pitch {
  const m = /^([A-G])(b?)(\d)$/.exec(name);
  if (!m) throw new Error(`Bad pitch ${name}`);
  const [, letter, flat, octave] = m as unknown as [string, string, string, string];
  const o = Number(octave);
  return { letter, flat: flat === 'b', octave: o, step: o * 7 + LETTERS.indexOf(letter), midi: (o + 1) * 12 + SEMITONES[letter]! - (flat ? 1 : 0) };
}

/** MIDI key of the next scale step up in B-flat major: the "wrong" key of the missed note. */
function midiOneStepAbove(p: Pitch): number {
  const i = LETTERS.indexOf(p.letter) + 1;
  const letter = LETTERS[i % 7]!;
  const octave = p.octave + (i === 7 ? 1 : 0);
  return (octave + 1) * 12 + SEMITONES[letter]! - (FLATTED.has(letter) ? 1 : 0);
}

function noteName(p: Pitch, lang: Lang): string {
  if (lang === 'en') return `${p.letter}${p.flat ? '♭' : ''}${p.octave}`;
  // German names: B-flat is B, B is H, E-flat is Es.
  if (p.letter === 'B') return `${p.flat ? 'B' : 'H'}${p.octave}`;
  if (!p.flat) return `${p.letter}${p.octave}`;
  return `${p.letter === 'E' ? 'Es' : p.letter === 'A' ? 'As' : `${p.letter}es`}${p.octave}`;
}

/** [beat, pitches, length in beats] */
type Event = readonly [number, readonly string[], number];

// An original phrase in B-flat major, 4 bars of 4/4.
const RIGHT: readonly Event[] = [
  [0, ['D5'], 1], [1, ['C5'], 1], [2, ['Bb4'], 1], [3, ['F4'], 1],
  [4, ['G4'], 1], [5, ['A4'], 1], [6, ['Bb4'], 1], [7, ['C5'], 1],
  [8, ['D5'], 1], [9, ['Eb5'], 1], [10, ['D5'], 1], [11, ['C5'], 1],
  [12, ['Bb4'], 1], [13, ['F4'], 1], [14, ['Bb4'], 2],
];
const LEFT: readonly Event[] = [
  [0, ['Bb2', 'F3'], 2], [2, ['D3'], 2], [4, ['Eb3'], 2], [6, ['F3'], 2],
  [8, ['Bb2', 'F3'], 2], [10, ['F2'], 2], [12, ['Eb3', 'G3'], 2], [14, ['Bb2', 'D3'], 2],
];
/** Beat of the note whose first press is wrong. */
const MISS_BEAT = 5;
/** Beat of the column the still frame shows. */
const STILL_BEAT = 6;
/** Base pace of the player: crotchet = 70. */
const PACE = 60 / 70;
/** How long the player looks at each column, as a share of the pace. */
const WAITS = [0.55, 0.9, 0.4, 0.7, 0.5, 0.95, 0.45, 0.8, 0.6, 0.35, 0.75, 0.5, 0.85, 0.4, 0.65, 0.7];

/** Staff space in SVG units (the score is drawn 1:1 at its widest; line weights live in home.css). */
const S = 10;

/** Lowest and highest key of the keyboard strip: C2 to C6. */
const KEY_LOW = 36;
const KEY_HIGH = 84;
const WHITE = new Set([0, 2, 4, 5, 7, 9, 11]);

type Phase = 'wait' | 'wrong' | 'hit' | 'end';
interface Segment { t: number; col: number; phase: Phase }

interface Note {
  id: string;
  col: number;
  x: number;
  midis: number[];
  /** Key of the wrong first press, only on the missed note. */
  wrongMidi: number | null;
}

export interface Score {
  /** Number of bars shown. */
  bars: number;
  viewBox: string;
  /** Inner SVG markup, the still frame. */
  markup: string;
  /** Animation CSS, all of it inside prefers-reduced-motion: no-preference. */
  css: string;
}

const f = (n: number) => Number(n.toFixed(2)).toString();

/** Path of an ellipse rotated by deg, as two arcs (so heads can be cut out with evenodd). */
function ellipse(cx: number, cy: number, rx: number, ry: number, deg: number): string {
  const t = (deg * Math.PI) / 180;
  const dx = rx * Math.cos(t);
  const dy = rx * Math.sin(t);
  const a = `A${f(rx)},${f(ry)} ${deg} 1 0`;
  return `M${f(cx - dx)},${f(cy - dy)}${a} ${f(cx + dx)},${f(cy + dy)}${a} ${f(cx - dx)},${f(cy - dy)}Z`;
}

/** A filled notehead, tilted like an engraved one. */
const solidHead = (cx: number, cy: number) => ellipse(cx, cy, 0.64 * S, 0.44 * S, -20);

/** Vertical centres of the name chips of one column: at their notes, pushed apart where chips (18 high) would overlap. */
function chipCentres(ys: number[]): number[] {
  const order = ys.map((y, k) => [y, k] as const).sort((a, b) => a[0] - b[0]);
  const placed: number[] = [];
  for (const [y] of order) placed.push(placed.length ? Math.max(y, placed[placed.length - 1]! + 19) : y);
  const shift = (order.reduce((sum, [y]) => sum + y, 0) - placed.reduce((sum, y) => sum + y, 0)) / placed.length;
  const out: number[] = [];
  order.forEach(([, k], i) => (out[k] = placed[i]! + shift));
  return out;
}

function notehead(cx: number, cy: number, beats: number): string {
  const filled = solidHead(cx, cy);
  return beats >= 2 ? filled + ellipse(cx, cy, 0.5 * S, 0.2 * S, -35) : filled;
}

const glyph = (cls: string, path: string, x: number, y: number, size: number) =>
  `<path class="${cls}" transform="translate(${f(x)},${f(y)}) scale(${size / 1000},${-size / 1000})" d="${path}"/>`;

export function buildScore({ id, bars, width, lang }: { id: string; bars: 2 | 4; width: number; lang: Lang }): Score {
  const beats = bars * 4;
  // Vertical layout: treble staff, gap, bass staff, keyboard strip.
  const trebleTop = 3.2 * S;
  const trebleBottom = trebleTop + 4 * S;
  const bassTop = trebleBottom + 6.5 * S;
  const bassBottom = bassTop + 4 * S;
  const left = 1.6 * S; // room for the brace
  const x0 = left + 6.6 * S; // first beat after clefs and key signature
  const right = width - 1;
  const beatWidth = (right - x0) / beats;
  const bandWidth = Math.max(beatWidth * 0.62, 2.4 * S);
  const bandTop = trebleTop - 2.2 * S;
  const bandBottom = bassBottom + 2.2 * S;
  const keysWidth = bars === 4 ? Math.min(560, width * 0.8) : width - 2;
  const whiteCount = [...Array(KEY_HIGH - KEY_LOW + 1).keys()].filter((i) => WHITE.has((KEY_LOW + i) % 12)).length;
  const whiteWidth = keysWidth / whiteCount;
  const keysHeight = whiteWidth * 3.8;
  const keysTop = bandBottom + 1.4 * S;
  const keysLeft = (width - keysWidth) / 2;
  const height = keysTop + keysHeight + 4;

  let staff = '';
  let notes = '';
  const all: Note[] = [];

  // Staff lines and barlines.
  for (const [cls, top] of [['treble', trebleTop], ['bass', bassTop]] as const) {
    let lines = '';
    for (let i = 0; i < 5; i++) lines += `<line x1="${f(left)}" x2="${f(right)}" y1="${f(top + i * S)}" y2="${f(top + i * S)}"/>`;
    for (let m = 1; m < bars; m++) {
      const x = x0 + m * 4 * beatWidth;
      lines += `<line x1="${f(x)}" x2="${f(x)}" y1="${f(top)}" y2="${f(top + 4 * S)}"/>`;
    }
    lines += `<line x1="${f(right - 0.55 * S)}" x2="${f(right - 0.55 * S)}" y1="${f(top)}" y2="${f(top + 4 * S)}"/>`;
    staff += `<g class="staff ${cls}">${lines}</g>`;
  }
  staff += `<line class="system" x1="${f(left)}" x2="${f(left)}" y1="${f(trebleTop)}" y2="${f(bassBottom)}"/>`;
  staff += `<rect class="ink" x="${f(right - 0.32 * S)}" y="${f(trebleTop)}" width="${f(0.32 * S)}" height="${f(bassBottom - trebleTop)}"/>`;

  // Brace, clefs and key signature.
  {
    const bx = left - 0.35 * S;
    const h = bassBottom - trebleTop;
    const w = 1.15 * S;
    const top = trebleTop;
    const mid = top + h / 2;
    const p = (dx: number, dy: number) => `${f(bx + dx * w)},${f(top + dy * h)}`;
    staff += `<path class="ink" d="M${f(bx)},${f(top)}C${p(-1.25, 0.12)} ${p(0.15, 0.38)} ${f(bx - w)},${f(mid)}C${p(0.15, 0.62)} ${p(-1.25, 0.88)} ${f(bx)},${f(bassBottom)}C${p(-0.75, 0.86)} ${p(0.5, 0.6)} ${f(bx - 0.82 * w)},${f(mid)}C${p(0.5, 0.4)} ${p(-0.75, 0.14)} ${f(bx)},${f(top)}Z"/>`;
    const cx = left + 0.7 * S;
    staff += glyph('ink clef', TREBLE_CLEF, cx, trebleBottom + 0.15 * S, 4.2 * S);
    staff += glyph('ink clef', BASS_CLEF, cx, bassTop + 3.4 * S, 4 * S);
    const kx = cx + 3.2 * S;
    const trebleY = (step: number) => trebleBottom - ((step - 30) * S) / 2; // E4 on the bottom line
    const bassY = (step: number) => bassBottom - ((step - 18) * S) / 2; // G2 on the bottom line
    [trebleY(34), trebleY(37)].forEach((y, k) => (staff += glyph('ink', FLAT, kx + k * 1.05 * S, y + 0.5 * S, 4 * S)));
    [bassY(20), bassY(23)].forEach((y, k) => (staff += glyph('ink', FLAT, kx + k * 1.05 * S, y + 0.5 * S, 4 * S)));
  }

  // Notes.
  const columns = [...new Set([...RIGHT, ...LEFT].map(([beat]) => beat).filter((b) => b < beats))].sort((a, b) => a - b);
  const colX = columns.map((beat) => x0 + beat * beatWidth + beatWidth * 0.42);
  const place = (events: readonly Event[], hand: 'r' | 'l', bottom: number, bottomStep: number) => {
    const middle = bottomStep + 4;
    const topLine = bottomStep + 8;
    events.forEach(([beat, names, length], i) => {
      if (beat >= beats) return;
      const col = columns.indexOf(beat);
      const x = colX[col]!;
      const ps = names.map(pitch);
      const ys = ps.map((p) => bottom - ((p.step - bottomStep) * S) / 2);
      const up = ps.reduce((sum, p) => sum + p.step, 0) / ps.length < middle;
      const miss = hand === 'r' && beat === MISS_BEAT;
      const nid = `${id}-${hand}${i}`;
      const ledgerAt = (step: number) => {
        const y = f(bottom - ((step - bottomStep) * S) / 2);
        return `<line x1="${f(x - 1.05 * S)}" x2="${f(x + 1.05 * S)}" y1="${y}" y2="${y}"/>`;
      };
      let ledgers = '';
      for (const p of ps) {
        for (let step = topLine + 2; step <= p.step; step += 2) ledgers += ledgerAt(step);
        for (let step = bottomStep - 2; step >= p.step; step -= 2) ledgers += ledgerAt(step);
      }
      if (ledgers) staff += `<g class="ledger">${ledgers}</g>`;
      const lo = Math.max(...ys);
      const hi = Math.min(...ys);
      const stem = up
        ? `<line class="stem" x1="${f(x + 0.6 * S)}" x2="${f(x + 0.6 * S)}" y1="${f(lo - 0.15 * S)}" y2="${f(hi - 3.5 * S)}"/>`
        : `<line class="stem" x1="${f(x - 0.6 * S)}" x2="${f(x - 0.6 * S)}" y1="${f(hi + 0.15 * S)}" y2="${f(lo + 3.5 * S)}"/>`;
      const halo = ys.map((y) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(1.15 * S)}"/>`).join('');
      const ghostX = x + 1.25 * S;
      const ghost = miss ? `<path id="${nid}-g" class="ghost" d="${solidHead(ghostX, ys[0]! - S / 2)}"/>` : '';
      const chipYs = chipCentres(ys);
      const labels = ps
        .map((p, k) => {
          const text = noteName(p, lang);
          const lx = x + (up ? 1.3 : 1.0) * S + (miss ? 1.4 * S : 0);
          return `<rect x="${f(lx)}" y="${f(chipYs[k]! - 9)}" width="${text.length * 7 + 10}" height="18" rx="3"/><text x="${f(lx + 5)}" y="${f(chipYs[k]! + 4)}">${text}</text>`;
        })
        .join('');
      notes += `<g id="${nid}-h" class="halo">${halo}</g>`;
      notes += `<g id="${nid}" class="note" data-col="${col}"><path class="head" d="${ys.map((y) => notehead(x, y, length)).join('')}"/>${stem}</g>`;
      notes += ghost;
      notes += `<g id="${nid}-l" class="chip">${labels}</g>`;
      all.push({ id: nid, col, x, midis: ps.map((p) => p.midi), wrongMidi: miss ? midiOneStepAbove(ps[0]!) : null });
    });
  };
  place(RIGHT, 'r', trebleBottom, 30);
  place(LEFT, 'l', bassBottom, 18);

  // Timeline: one segment per phase, in seconds.
  const segments: Segment[] = [];
  let t = 0;
  const add = (seconds: number, col: number, phase: Phase) => {
    segments.push({ t, col, phase });
    t += seconds;
  };
  add(0.5, 0, 'wait');
  columns.forEach((beat, col) => {
    add(PACE * (0.35 + WAITS[col % WAITS.length]! * 0.55), col, 'wait');
    if (beat === MISS_BEAT) {
      add(PACE * 0.55, col, 'wrong');
      add(PACE * 0.35, col, 'wait');
    }
    add(PACE * 0.3, col, 'hit');
  });
  add(1.4, columns.length, 'end');
  const loop = t;
  const still: Segment = { t: 0, col: columns.indexOf(STILL_BEAT), phase: 'hit' };

  // State of each part in a segment. Each function gives [class for the still frame, CSS declaration].
  const noteState = (n: Note, s: Segment): [string, string] =>
    s.phase === 'end' || n.col < s.col ? ['is-past', 'color:var(--n-past)'] : n.col === s.col && s.phase === 'hit' ? ['is-hit', 'color:var(--success)'] : ['', 'color:var(--ink)'];
  const labelState = (n: Note, s: Segment): [string, string] => (n.col === s.col && s.phase !== 'end' ? ['is-on', 'opacity:1'] : ['', 'opacity:0']);
  const haloState = (n: Note, s: Segment): [string, string] => (n.col === s.col && s.phase === 'hit' ? ['is-on', 'opacity:0.18'] : ['', 'opacity:0']);
  const ghostState = (n: Note, s: Segment): [string, string] => (n.col === s.col && s.phase === 'wrong' ? ['is-on', 'opacity:1'] : ['', 'opacity:0']);
  const keyState = (midi: number, white: boolean, s: Segment): [string, string] => {
    const at = all.filter((n) => n.col === s.col);
    if (s.phase === 'wrong' && at.some((n) => n.wrongMidi === midi)) return ['is-wrong', 'fill:var(--error)'];
    if (s.phase === 'hit' && at.some((n) => n.midis.includes(midi))) return ['is-on', 'fill:var(--primary)'];
    return ['', `fill:var(${white ? '--key-white' : '--key-black'})`];
  };
  const playheadState = (s: Segment): string =>
    s.phase === 'end' ? `transform:translateX(${f(colX[colX.length - 1]!)}px);opacity:0` : `transform:translateX(${f(colX[s.col]!)}px);opacity:1`;

  let css = '';
  const animate = (elementId: string, declaration: (s: Segment) => string) => {
    let frames = '';
    let last = '';
    for (const s of segments) {
      const d = declaration(s);
      if (d !== last) frames += `${Number(((s.t / loop) * 100).toFixed(3))}%{${d}}`;
      last = d;
    }
    frames += `100%{${last}}`;
    css += `#${elementId}{animation:${elementId} ${loop.toFixed(3)}s steps(1,end) infinite}@keyframes ${elementId}{${frames}}`;
  };

  // Playhead (behind the notes).
  const capHeight = 0.3 * S;
  const playhead = `<g id="${id}-ph" class="playhead" transform="translate(${f(colX[still.col]!)},0)"><rect class="band" x="${f(-bandWidth / 2)}" y="${f(bandTop)}" width="${f(bandWidth)}" height="${f(bandBottom - bandTop)}"/><rect class="cap" x="${f(-bandWidth * 0.28)}" y="${f(bandTop)}" width="${f(bandWidth * 0.56)}" height="${capHeight}"/><rect class="cap" x="${f(-bandWidth * 0.28)}" y="${f(bandBottom - capHeight)}" width="${f(bandWidth * 0.56)}" height="${capHeight}"/></g>`;
  animate(`${id}-ph`, playheadState);

  // Still frame classes and animations for notes.
  for (const n of all) {
    const set = (suffix: string, state: (n: Note, s: Segment) => [string, string]) => {
      const cls = state(n, still)[0];
      if (cls) notes = notes.replace(new RegExp(`(id="${n.id}${suffix}" class="[^"]*)`), `$1 ${cls}`);
      animate(`${n.id}${suffix}`, (s) => state(n, s)[1]);
    };
    set('', noteState);
    set('-l', labelState);
    set('-h', haloState);
    if (n.wrongMidi !== null) set('-g', ghostState);
  }

  // Keyboard strip.
  let whites = '';
  let blacks = '';
  let wi = 0;
  const blackWidth = whiteWidth * 0.62;
  const blackHeight = keysHeight * 0.6;
  const played = new Set(all.flatMap((n) => [...n.midis, ...(n.wrongMidi === null ? [] : [n.wrongMidi])]));
  for (let midi = KEY_LOW; midi <= KEY_HIGH; midi++) {
    const white = WHITE.has(midi % 12);
    const kid = `${id}-k${midi}`;
    const cls = ['key', white ? 'white' : 'black', keyState(midi, white, still)[0]].filter(Boolean).join(' ');
    if (white) {
      whites += `<rect id="${kid}" class="${cls}" x="${f(keysLeft + wi * whiteWidth)}" y="${f(keysTop)}" width="${f(whiteWidth)}" height="${f(keysHeight)}"/>`;
      wi++;
    } else {
      blacks += `<rect id="${kid}" class="${cls}" x="${f(keysLeft + wi * whiteWidth - blackWidth / 2)}" y="${f(keysTop)}" width="${f(blackWidth)}" height="${f(blackHeight)}" rx="1"/>`;
    }
    if (played.has(midi)) animate(kid, (s) => keyState(midi, white, s)[1]);
  }
  const keys = `<g class="keys"><rect class="frame" x="${f(keysLeft - 3)}" y="${f(keysTop - 3)}" width="${f(keysWidth + 6)}" height="${f(keysHeight + 6)}" rx="2"/>${whites}${blacks}</g>`;

  return {
    bars,
    viewBox: `0 0 ${f(width)} ${f(height)}`,
    markup: playhead + staff + notes + keys,
    css: `@media (prefers-reduced-motion:no-preference){${css}}`,
  };
}

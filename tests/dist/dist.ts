// Access to the built output. Every test in this suite reads dist/, never src/:
// for a static site the shipped HTML is the behaviour, the template is an
// internal detail.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

/** Production origin, written out literally so a typo in src/site.ts cannot hide itself. */
export const ORIGIN = 'https://stavewise.app';

export const DIST = fileURLToPath(new URL('../../dist', import.meta.url));

if (!existsSync(DIST)) {
  throw new Error(`dist/ is missing (${DIST}); run \`astro build\` before this suite.`);
}

/** Every shipped file, relative to dist/ with forward slashes. */
export const FILES: readonly string[] = readdirSync(DIST, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => relative(DIST, join(entry.parentPath, entry.name)).split(sep).join('/'))
  .sort();

export type Lang = 'de' | 'en';
export type PageName = 'home' | 'beta' | 'privacy' | 'impressum';

export interface Page {
  lang: Lang;
  name: PageName;
  /** Public path as linked internally: /de/, /de/beta, ... */
  path: string;
}

const NAMES: readonly PageName[] = ['home', 'beta', 'privacy', 'impressum'];

export function pathOf(lang: Lang, name: PageName): string {
  return name === 'home' ? `/${lang}/` : `/${lang}/${name}`;
}

/** The eight addresses of #591. */
export const PAGES: readonly Page[] = (['de', 'en'] as const).flatMap((lang) =>
  NAMES.map((name) => ({ lang, name, path: pathOf(lang, name) })),
);

/** dist file behind a public path: /de/beta -> de/beta/index.html. */
export function fileOf(path: string): string {
  const trimmed = path.replace(/^\/|\/$/g, '');
  return trimmed === '' ? 'index.html' : `${trimmed}/index.html`;
}

export function read(file: string): string {
  return readFileSync(join(DIST, file), 'utf8');
}

const cache = new Map<string, Document>();

export function documentOf(path: string): Document {
  let doc = cache.get(path);
  if (!doc) {
    doc = new JSDOM(read(fileOf(path))).window.document;
    cache.set(path, doc);
  }
  return doc;
}

// Access to the built output. Every test in this suite reads dist/, never src/:
// for a static site the shipped HTML is the behaviour, the template is an
// internal detail. The one exception is the page register in src/lib/i18n.ts:
// names and paths are read from it instead of being written down twice.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { BUILT_PAGES, LANGS, pathOf, type Lang, type PageName } from '../../src/lib/i18n';

export { neutralPathOf, pathOf, type Lang, type PageName } from '../../src/lib/i18n';

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

export interface Page {
  lang: Lang;
  name: PageName;
  /** Public path as linked internally: /de/, /de/beta, ... */
  path: string;
}

/** Every built page in both languages, as listed in BUILT_PAGES. */
export const PAGES: readonly Page[] = LANGS.flatMap((lang) =>
  BUILT_PAGES.map((name) => ({ lang, name, path: pathOf(lang, name) })),
);

/** dist file behind a public path: /de/beta -> de/beta/index.html. */
export function fileOf(path: string): string {
  const trimmed = path.replace(/^\/|\/$/g, '');
  return trimmed === '' ? 'index.html' : `${trimmed}/index.html`;
}

/** Public path of a dist HTML file in canonical form: de/index.html -> /de/, de/beta/index.html -> /de/beta. */
export function pathOfFile(file: string): string {
  const dir = file.replace(/(^|\/)index\.html$/, '');
  return /^(de|en)$/.test(dir) ? `/${dir}/` : `/${dir}`;
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

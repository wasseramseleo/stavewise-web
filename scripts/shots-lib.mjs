// Pure part of `npm run shots` (#603): the 32 pictures and the gallery index.
// The browser part lives in scripts/shots.mjs.
import { posix } from 'node:path';

export const LANGS = ['de', 'en'];

/** Page names in file names (`seite` in #603) and their path below /<lang>. */
export const PAGES = [
  { page: 'start', suffix: '' },
  { page: 'beta', suffix: 'beta' },
  { page: 'privacy', suffix: 'privacy' },
  { page: 'impressum', suffix: 'impressum' },
];

export const MODES = [
  { mode: 'hell', colorScheme: 'light' },
  { mode: 'dunkel', colorScheme: 'dark' },
];

export const SIZES = [
  { size: 'breit', width: 1440 },
  { size: 'schmal', width: 390 },
];

/** A picture smaller than this counts as empty. */
export const MIN_BYTES = 10 * 1024;

const shotFile = (lang, page, mode, size) => `${lang}-${page}-${mode}-${size}.png`;

/** Every picture, ordered by page, language, mode and width. */
export const SHOTS = PAGES.flatMap(({ page, suffix }) =>
  LANGS.flatMap((lang) =>
    MODES.flatMap(({ mode, colorScheme }) =>
      SIZES.map(({ size, width }) => ({
        file: shotFile(lang, page, mode, size),
        lang,
        page,
        path: `/${lang}/${suffix}`,
        colorScheme,
        mode,
        width,
        size,
      })),
    ),
  ),
);

/** shots/index.html: one row per page and language, one column per mode and width. */
export function indexHtml() {
  const columns = MODES.flatMap(({ mode }) => SIZES.map(({ size }) => ({ mode, size })));
  const head = `<tr><th>Seite</th><th>Sprache</th>${columns
    .map(({ mode, size }) => `<th>${mode}, ${size}</th>`)
    .join('')}</tr>`;
  const rows = PAGES.flatMap(({ page }) =>
    LANGS.map((lang) => {
      const cells = columns
        .map(({ mode, size }) => {
          const file = shotFile(lang, page, mode, size);
          return `<td><a href="${file}"><img src="${file}" alt="${file}" loading="lazy"></a></td>`;
        })
        .join('');
      return `<tr><th>${page}</th><th>${lang}</th>${cells}</tr>`;
    }),
  );
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>stavewise-web: Seitenbilder</title>
<style>
body { font-family: system-ui, sans-serif; margin: 16px; }
table { border-collapse: collapse; }
th, td { border: 1px solid #ccc; padding: 8px; vertical-align: top; text-align: left; }
img { width: 240px; height: auto; display: block; }
</style>
</head>
<body>
<h1>Seitenbilder</h1>
<p>Breit: 1440 px, schmal: 390 px, jeweils die ganze Seite. Klick öffnet das Bild in voller Größe.</p>
<table>
${[head, ...rows].join('\n')}
</table>
</body>
</html>
`;
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

/** Content type of a file in dist/ by its extension. */
export function contentType(file) {
  return TYPES[posix.extname(file)] ?? 'application/octet-stream';
}

/**
 * The file below dist/ that answers a request path, as nginx serves it
 * (ops/nginx): a path without extension is a directory with index.html.
 * Returns null for paths that would leave dist/.
 */
export function distFile(requestPath) {
  let path;
  try {
    path = decodeURIComponent(requestPath.split(/[?#]/)[0]);
  } catch {
    return null;
  }
  const relative = posix.normalize(path.replace(/^\/+/, '') || '.');
  if (relative === '..' || relative.startsWith('../') || posix.isAbsolute(relative)) return null;
  const clean = relative.replace(/\/+$/, '');
  if (clean === '.' || clean === '') return 'index.html';
  return posix.extname(clean) ? clean : `${clean}/index.html`;
}

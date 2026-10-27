// Tests for the pure part of `npm run shots` (#603): which pictures exist,
// how they are named and the gallery index. The browser part is not tested
// here because it needs a downloaded Chromium (not part of `npm run check`).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHOTS, indexHtml, MIN_BYTES, distFile, contentType } from './shots-lib.mjs';

test('32 pictures: 4 pages x 2 languages x 2 modes x 2 widths', () => {
  assert.equal(SHOTS.length, 32);
  assert.equal(new Set(SHOTS.map((s) => s.file)).size, 32);
});

test('file names follow <lang>-<seite>-<hell|dunkel>-<breit|schmal>.png', () => {
  const files = SHOTS.map((s) => s.file);
  assert.ok(files.includes('de-start-dunkel-schmal.png'));
  assert.ok(files.includes('en-privacy-hell-breit.png'));
  for (const file of files) {
    assert.match(file, /^(de|en)-(start|beta|privacy|impressum)-(hell|dunkel)-(breit|schmal)\.png$/);
  }
});

test('paths, colour schemes and widths match the names', () => {
  const byFile = Object.fromEntries(SHOTS.map((s) => [s.file, s]));
  assert.deepEqual(byFile['de-start-dunkel-schmal.png'], {
    file: 'de-start-dunkel-schmal.png',
    lang: 'de',
    page: 'start',
    path: '/de/',
    colorScheme: 'dark',
    mode: 'dunkel',
    width: 390,
    size: 'schmal',
  });
  assert.equal(byFile['en-privacy-hell-breit.png'].path, '/en/privacy');
  assert.equal(byFile['en-privacy-hell-breit.png'].colorScheme, 'light');
  assert.equal(byFile['en-privacy-hell-breit.png'].width, 1440);
  assert.equal(byFile['de-impressum-hell-breit.png'].path, '/de/impressum');
  assert.equal(byFile['en-beta-hell-breit.png'].path, '/en/beta');
});

test('an empty picture is anything up to 10 KB', () => {
  assert.equal(MIN_BYTES, 10 * 1024);
});

test('index.html shows every picture once, in a table, without JavaScript', () => {
  const html = indexHtml();
  for (const shot of SHOTS) {
    assert.equal(html.split(`src="${shot.file}"`).length - 1, 1, shot.file);
  }
  assert.match(html, /^<!doctype html>/);
  assert.match(html, /<table>/);
  assert.doesNotMatch(html, /<script/i);
  // One row per page and language, one column per mode and width.
  assert.equal(html.split('<tr>').length - 1, 1 + 8);
});

test('static server maps paths onto dist/ like nginx', () => {
  assert.equal(distFile('/de/'), 'de/index.html');
  assert.equal(distFile('/de'), 'de/index.html');
  assert.equal(distFile('/en/privacy'), 'en/privacy/index.html');
  assert.equal(distFile('/en/privacy/'), 'en/privacy/index.html');
  assert.equal(distFile('/_astro/Base.css'), '_astro/Base.css');
  assert.equal(distFile('/fonts/a%20b.woff2'), 'fonts/a b.woff2');
  assert.equal(distFile('/de/beta?x=1'), 'de/beta/index.html');
});

test('static server never leaves dist/', () => {
  assert.equal(distFile('/../package.json'), null);
  assert.equal(distFile('/%2e%2e/package.json'), null);
  assert.equal(distFile('/de/../../x'), null);
});

test('content types for what dist/ ships', () => {
  assert.equal(contentType('de/index.html'), 'text/html; charset=utf-8');
  assert.equal(contentType('_astro/a.css'), 'text/css; charset=utf-8');
  assert.equal(contentType('fonts/a.woff2'), 'font/woff2');
  assert.equal(contentType('_astro/a.webp'), 'image/webp');
  assert.equal(contentType('favicon.svg'), 'image/svg+xml');
  assert.equal(contentType('x.unknown'), 'application/octet-stream');
});

// `npm run og` (stavewise#715): renders the Open Graph preview image per
// language from the page /og/<lang>/ (src/pages/og/[lang].astro) to
// public/og/stavewise-<lang>.png, 1200 x 630, in the light app colours. The
// PNGs are checked in; the next build copies them to dist/og/. Needs a built
// dist/ (`npm run build`) and Chromium for Playwright
// (`npx playwright install chromium`). Not part of `npm run check`.
//
// Serves dist/ with a small static server in this process, as scripts/shots.mjs
// does, instead of `astro preview`.
import { existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { contentType, distFile } from './shots-lib.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'public', 'og');
const LANGS = ['de', 'en'];
const WIDTH = 1200;
const HEIGHT = 630;

if (!existsSync(DIST)) {
  console.error('dist/ is missing; run `npm run build` first.');
  process.exit(1);
}

const server = createServer((request, response) => {
  const file = distFile(request.url ?? '/');
  const absolute = file === null ? null : join(DIST, file);
  if (absolute === null || !existsSync(absolute) || !statSync(absolute).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
    return;
  }
  response.writeHead(200, { 'content-type': contentType(file) }).end(readFileSync(absolute));
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const BASE = `http://127.0.0.1:${server.address().port}`;

/** Width and height from the IHDR chunk, which follows the 8-byte PNG signature. */
const pngSize = (bytes) => ({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) });

const failures = [];
let browser;
try {
  mkdirSync(OUT, { recursive: true });
  browser = await chromium.launch();
  for (const lang of LANGS) {
    const context = await browser.newContext({
      colorScheme: 'light',
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
      locale: lang,
    });
    const page = await context.newPage();
    const response = await page.goto(`${BASE}/og/${lang}/`, { waitUntil: 'load' });
    if (response?.status() !== 200) {
      failures.push(`/og/${lang}/: HTTP ${response?.status() ?? 'no response'}`);
    } else {
      await page.evaluate(() => document.fonts.ready);
      const file = join(OUT, `stavewise-${lang}.png`);
      await page.locator('.og').screenshot({ path: file });
      const { width, height } = pngSize(readFileSync(file));
      if (width !== WIDTH || height !== HEIGHT) failures.push(`${file}: ${width} x ${height}`);
      console.log(`public/og/stavewise-${lang}.png  ${width} x ${height}  ${Math.round(statSync(file).size / 1024)} KB`);
    }
    await context.close();
  }
} catch (error) {
  failures.push(String(error?.stack ?? error));
} finally {
  await browser?.close();
  server.close();
}

if (failures.length > 0) {
  console.error(`og: ${failures.length} failure(s):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log('og: run `npm run build` again so dist/og/ carries the new pictures.');

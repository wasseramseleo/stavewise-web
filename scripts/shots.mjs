// `npm run shots` (#603): renders all eight pages (DE/EN) light and dark, wide
// and narrow, as full-page PNGs into shots/, plus shots/index.html as a gallery
// for the [Leo] PR. Needs a built dist/ (`npm run build`) and Chromium for
// Playwright (`npx playwright install chromium`). Not part of `npm run check`.
// Exits non-zero when a page does not answer 200 or a picture is empty.
//
// Serves dist/ with a small static server in this process instead of
// `astro preview`: the Astro CLI may hand the server to a detached child
// process, which would outlive the script.
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { MIN_BYTES, SHOTS, contentType, distFile, indexHtml } from './shots-lib.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'shots');

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

const failures = [];
let browser;
try {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  browser = await chromium.launch();
  for (const shot of SHOTS) {
    const context = await browser.newContext({
      colorScheme: shot.colorScheme,
      viewport: { width: shot.width, height: 900 },
      locale: shot.lang,
    });
    const page = await context.newPage();
    const response = await page.goto(BASE + shot.path, { waitUntil: 'load' });
    const status = response?.status();
    if (status !== 200) {
      failures.push(`${shot.path}: HTTP ${status ?? 'no response'}`);
    } else {
      await page.evaluate(() => document.fonts.ready);
      const file = join(OUT, shot.file);
      await page.screenshot({ path: file, fullPage: true });
      const bytes = statSync(file).size;
      if (bytes <= MIN_BYTES) failures.push(`${shot.file}: only ${bytes} bytes`);
      console.log(`${shot.file}  ${Math.round(bytes / 1024)} KB`);
    }
    await context.close();
  }
  writeFileSync(join(OUT, 'index.html'), indexHtml());
} catch (error) {
  failures.push(String(error?.stack ?? error));
} finally {
  await browser?.close();
  server.close();
}

if (failures.length > 0) {
  console.error(`shots: ${failures.length} failure(s):\n${failures.join('\n')}`);
  process.exit(1);
}
console.log(`shots: ${SHOTS.length} pictures and index.html in shots/`);

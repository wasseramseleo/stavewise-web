// PROTOTYPE (#709): screenshots of all variants. node scripts/prototype-shots.mjs <outdir> [base]
import { chromium } from 'playwright';
const [out, base = 'http://localhost:4329'] = process.argv.slice(2);
const browser = await chromium.launch();
const pages = [];
for (const v of ['a', 'b', 'c']) {
  pages.push([`ratgeber-${v}`, `/de/prototype-ratgeber/${v}/`], [`start-${v}`, `/de/prototype-start/${v}/`]);
}
for (const [name, path] of pages) {
  for (const [w, tag] of [[1440, 'breit'], [390, 'schmal']]) {
    for (const scheme of ['light', 'dark']) {
      if (scheme === 'dark' && tag === 'schmal') continue;
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme, deviceScaleFactor: tag === 'schmal' ? 2 : 1 });
      const p = await ctx.newPage();
      await p.goto(base + path, { waitUntil: 'networkidle' });
      await p.addStyleTag({ content: '.proto-switcher{display:none!important}' });
      await p.screenshot({ path: `${out}/${name}-${scheme === 'dark' ? 'dunkel' : 'hell'}-${tag}.png`, fullPage: true });
      await ctx.close();
    }
  }
}
for (const id of ['de-a', 'de-b', 'de-c', 'en-a', 'en-b', 'en-c']) {
  const ctx = await browser.newContext({ viewport: { width: 1240, height: 700 } });
  const p = await ctx.newPage();
  await p.goto(`${base}/prototype-og/${id}/`, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.proto-switcher{display:none!important}' });
  await p.locator('.og').screenshot({ path: `${out}/og-${id}.png` });
  await ctx.close();
}
await browser.close();

// PROTOTYPE (stavewise#825): screenshots of all variants. node scripts/prototype-shots.mjs <outdir> [base]
import { chromium } from 'playwright';
const [out, base = 'http://localhost:4331'] = process.argv.slice(2);
const browser = await chromium.launch();
for (const lang of ['de', 'en']) {
  for (const v of ['a', 'b', 'c']) {
    for (const [kind, seg] of [['start', 'prototype-offen'], ['beta', 'prototype-offen-beta']]) {
      for (const [w, tag] of [[1440, 'breit'], [390, 'schmal']]) {
        if (lang === 'en' && tag === 'schmal') continue;
        const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: tag === 'schmal' ? 2 : 1 });
        const p = await ctx.newPage();
        await p.goto(`${base}/${lang}/${seg}/${v}/`, { waitUntil: 'networkidle' });
        await p.addStyleTag({ content: '.proto-switcher{display:none!important}' });
        await p.screenshot({ path: `${out}/${kind}-${v}-${lang}-${tag}.png`, fullPage: kind === 'beta' });
        await ctx.close();
      }
    }
  }
}
await browser.close();

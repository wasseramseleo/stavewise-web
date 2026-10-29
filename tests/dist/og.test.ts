// Open Graph preview image, one per language (launch § 14.5; stavewise#715).
// The PNGs are rendered by `npm run og` from the pages under /og/ and checked
// in under public/og/, so the build copies them to dist/og/.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { DIST, FILES, ORIGIN, PAGES, documentOf, pathOf, read } from './dist';

const LANGS = ['de', 'en'] as const;

/** Width and height from the IHDR chunk, which follows the 8-byte PNG signature. */
function pngSize(file: string): { signature: string; width: number; height: number } {
  const bytes = readFileSync(join(DIST, file));
  return {
    signature: bytes.subarray(0, 8).toString('hex'),
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

const ogDocument = (lang: string) => new JSDOM(read(`og/${lang}/index.html`)).window.document;

describe.each(LANGS)('preview image %s', (lang) => {
  it('is a PNG of 1200 x 630', () => {
    expect(FILES).toContain(`og/stavewise-${lang}.png`);
    expect(pngSize(`og/stavewise-${lang}.png`)).toEqual({
      signature: '89504e470d0a1a0a',
      width: 1200,
      height: 630,
    });
  });

  it('has a source page that search engines skip', () => {
    const doc = ogDocument(lang);
    expect(doc.documentElement.lang).toBe(lang);
    expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex');
  });

  it('shows the claim of the home page, the address and the screenshot', () => {
    const og = ogDocument(lang).querySelector('.og');
    expect(og).not.toBeNull();
    const claim = documentOf(pathOf(lang, 'home')).querySelector('h1')?.textContent?.trim();
    expect(og!.querySelector('h1')?.textContent?.trim()).toBe(claim);
    expect(og!.textContent).toContain('stavewise.app');
    expect(og!.querySelectorAll('img')).toHaveLength(1);
  });
});

describe('source pages of the preview images', () => {
  it('carry the subline of their language', () => {
    expect(ogDocument('de').querySelector('.og')?.textContent).toContain(
      'Am E-Piano · Android · USB und Bluetooth-MIDI',
    );
    expect(ogDocument('en').querySelector('.og')?.textContent).toContain(
      'On your digital piano · Android · USB and Bluetooth MIDI',
    );
  });

  it('are not in the sitemap', () => {
    expect(read('sitemap.xml')).not.toContain('/og/');
  });
});

describe.each(PAGES)('$path', (page) => {
  it('points og:image at a file in dist/', () => {
    const image = documentOf(page.path).querySelector('meta[property="og:image"]')?.getAttribute('content');
    expect(image?.startsWith(`${ORIGIN}/`)).toBe(true);
    expect(FILES).toContain(image!.slice(ORIGIN.length + 1));
  });
});

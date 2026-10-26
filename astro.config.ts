import { defineConfig } from 'astro/config';
import { siteUrl } from './src/site';

// Static output only: no islands, no client JavaScript (#545, #591).
// `build.format: 'directory'` gives dist/de/beta/index.html, which nginx serves
// as /de/beta without a trailing slash.
export default defineConfig({
  site: siteUrl,
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
    // Keep the one stylesheet a file instead of inlining it, so every page
    // shares it from the cache.
    inlineStylesheets: 'never',
  },
});

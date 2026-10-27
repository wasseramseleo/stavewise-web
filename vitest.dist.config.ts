import { defineConfig } from 'vitest/config';

// Suite against the built output in dist/ (run after `astro build`, see
// `npm run check`). The tests parse the shipped HTML themselves with jsdom.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/dist/**/*.test.ts'],
  },
});

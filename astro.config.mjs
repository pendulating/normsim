// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

/** The raw scans in public/assets/{books,papers} are inputs to scripts/books.mjs, which writes the
    web copies the page uses to web/. Keep the raw scans out of the deployed site: they are large,
    and a downloaded page can carry a download stamp with the downloader's IP address. */
const dropRawScans = {
  name: 'drop-raw-scans',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      for (const sub of ['assets/books', 'assets/papers']) {
        const d = fileURLToPath(new URL(sub, dir));
        const files = await readdir(d, { withFileTypes: true }).catch(() => []);
        for (const f of files) if (f.isFile()) await rm(`${d}/${f.name}`);
      }
    },
  },
};

// GitHub Pages serves this repository at https://pendulating.github.io/normsite/.
// If you attach a custom domain, set `base` to '/' and `site` to that domain.
export default defineConfig({
  site: 'https://pendulating.github.io',
  base: '/normsite',
  trailingSlash: 'ignore',
  integrations: [dropRawScans],
  vite: {
    plugins: [tailwindcss()],
  },
});

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

// GitHub Pages serves this repository (pendulating/normsim) under the user site's custom
// domain, so it lives at https://mfranchi.net/normsim/. `base` must match the repository name.
export default defineConfig({
  site: 'https://mfranchi.net',
  base: '/normsim',
  trailingSlash: 'ignore',
  integrations: [dropRawScans],
  vite: {
    plugins: [tailwindcss()],
  },
});

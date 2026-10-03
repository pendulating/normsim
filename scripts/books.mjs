// Web copies of the scanned book covers and paper first pages for the bookshelf.
//
// Scans live in public/assets/books as <slug>.<png|jpg> (front cover) and,
// optionally, SPINE_<slug>.<ext> (spine, reading top to bottom). For each book
// this trims the dark scan border, writes WebP copies at two densities to
// public/assets/books/web/, and records in src/data/bookAssets.json each
// image's aspect ratio plus a palette read off the cover, which the shelf uses
// to draw a spine for books that have no spine scan. Run after adding a scan:
//
//   node scripts/books.mjs

import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(root, 'public/assets/books');
const out = path.join(dir, 'web');

/** An edge row/column is scan border when it is this much darker (mean luminance, 0-255) than
    the row/column INSET pixels in. Artwork that runs dark to the edge matches its interior and
    is kept. */
const BORDER = 40;
const INSET = 16;

/** Crop the dark lines a scanner leaves at the edges, up to 12px a side. */
async function trimBorder(file) {
  const img = sharp(file).flatten({ background: '#ffffff' });
  const { data, info } = await img.clone().greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const col = (x) => {
    let s = 0;
    for (let y = 0; y < h; y++) s += data[y * w + x];
    return s / h;
  };
  const row = (y) => {
    let s = 0;
    for (let x = 0; x < w; x++) s += data[y * w + x];
    return s / w;
  };
  const max = 12;
  const dark = (v, ref) => ref - v > BORDER;
  let l = 0, r = 0, t = 0, b = 0;
  while (l < max && dark(col(l), col(INSET))) l++;
  while (r < max && dark(col(w - 1 - r), col(w - 1 - INSET))) r++;
  while (t < max && dark(row(t), row(INSET))) t++;
  while (b < max && dark(row(h - 1 - b), row(h - 1 - INSET))) b++;
  console.log(`  ${path.basename(file)}: trimmed l${l} r${r} t${t} b${b}`);
  return img.extract({ left: l, top: t, width: w - l - r, height: h - t - b });
}

/** Relative luminance (WCAG) of an [r, g, b] in 0-255. */
const lum = (c) => {
  const [r, g, b] = c.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const chroma = (c) => (Math.max(...c) - Math.min(...c)) / 255;

/** Colors for a generated spine, read off the front cover.
    bg: the dominant color, with saturated colors weighted up so a white ground wins only when it
        truly dominates. accent: the most prominent vivid color far from bg, e.g. the title's
        lettering; sampled at 200px wide so thin letterforms survive the downscale. Falls back to
        ink when the cover has no vivid color.
    ink: near-white or near-black, whichever reads better on bg. */
async function palette(front) {
  const { data, info } = await front.clone().resize({ width: 200 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  const buckets = new Map();
  for (let i = 0; i < n; i++) {
    const c = [data[3 * i], data[3 * i + 1], data[3 * i + 2]];
    const key = c.map((v) => v >> 4).join(',');
    const b = buckets.get(key) ?? { n: 0, sum: [0, 0, 0] };
    b.n++;
    c.forEach((v, k) => (b.sum[k] += v));
    buckets.set(key, b);
  }
  const colors = [...buckets.values()].map((b) => ({ n: b.n / n, c: b.sum.map((v) => v / b.n) }));
  const by = (score) => colors.reduce((best, x) => (score(x) > score(best) ? x : best));
  const bg = by((x) => x.n * (0.3 + chroma(x.c))).c;
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const far = colors.filter((x) => x.n > 0.004 && chroma(x.c) > 0.35 && dist(x.c, bg) > 120);
  const accent = far.length ? by((x) => (far.includes(x) ? x.n * chroma(x.c) : -1)).c : null;
  const light = [250, 248, 242];
  const dark = [24, 24, 28];
  const ink = contrast(light, bg) >= contrast(dark, bg) ? light : dark;
  return { bg: hex(bg), ink: hex(ink), accent: accent ? hex(accent) : hex(ink), accentReadable: !!accent && contrast(accent, bg) >= 3 };
}

await mkdir(out, { recursive: true });
const files = await readdir(dir);
const stem = (f) => f.replace(/\.[a-z]+$/i, '');
const books = {};
// Every front cover is a book; a SPINE_<slug> scan is optional. Without one, the shelf draws the
// spine from the palette and the book's title and author.
for (const cover of files.filter((f) => !f.startsWith('SPINE_') && /\.(png|jpe?g|webp|tiff?)$/i.test(f))) {
  const slug = stem(cover);
  const spineFile = files.find((f) => f.startsWith('SPINE_') && stem(f.slice('SPINE_'.length)) === slug);
  const front = await trimBorder(path.join(dir, cover));
  const fm = await front.clone().toBuffer({ resolveWithObject: true });
  // Covers render ~240px wide; spines ~25-30px. Two densities each.
  for (const [w, tag] of [[360, '1x'], [720, '2x']]) {
    await front.clone().resize({ width: w }).webp({ quality: 82 }).toFile(path.join(out, `${slug}-cover-${tag}.webp`));
  }
  const entry = { cover: +(fm.info.width / fm.info.height).toFixed(4), spine: null, palette: await palette(front) };
  if (spineFile) {
    const spine = await trimBorder(path.join(dir, spineFile));
    const sm = await spine.clone().toBuffer({ resolveWithObject: true });
    for (const [h, tag] of [[480, '1x'], [960, '2x']]) {
      await spine.clone().resize({ height: h }).webp({ quality: 82 }).toFile(path.join(out, `${slug}-spine-${tag}.webp`));
    }
    entry.spine = +(sm.info.width / sm.info.height).toFixed(4);
  }
  books[slug] = entry;
  console.log(slug, JSON.stringify(entry));
}
for (const f of files.filter((f) => f.startsWith('SPINE_'))) {
  if (!books[stem(f.slice('SPINE_'.length))]) console.warn(`no cover for spine ${f}`);
}
await writeFile(path.join(root, 'src/data/bookAssets.json'), JSON.stringify(books, null, 2) + '\n');

// Papers: public/assets/papers/<slug>.<png|jpg> is the paper's first page. Web copies go to
// public/assets/papers/web/; each page's aspect ratio goes to src/data/paperAssets.json.
const paperDir = path.join(root, 'public/assets/papers');
const paperOut = path.join(paperDir, 'web');
await mkdir(paperOut, { recursive: true });
// Every page is cut from the top to US-letter shape so the sheets in the stack line up. This also
// drops what sits at the foot of a downloaded page (page numbers, a database's download stamp with
// the downloader's IP address), so check the web copy when adding a page with a longer trim.
const LETTER = 8.5 / 11;
const papers = {};
for (const f of (await readdir(paperDir)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))) {
  const slug = stem(f);
  const full = sharp(path.join(paperDir, f)).flatten({ background: '#ffffff' });
  const { width, height } = await full.metadata();
  const h = Math.min(height, Math.round(width / LETTER));
  const page = sharp(await full.extract({ left: 0, top: 0, width, height: h }).toBuffer());
  const { info } = await page.clone().toBuffer({ resolveWithObject: true });
  // Pages render ~270px wide on the shelf, larger seen from above.
  for (const [w, tag] of [[420, '1x'], [840, '2x']]) {
    await page.clone().resize({ width: w }).webp({ quality: 84 }).toFile(path.join(paperOut, `${slug}-${tag}.webp`));
  }
  papers[slug] = { page: +(info.width / info.height).toFixed(4) };
  console.log('paper', slug, JSON.stringify(papers[slug]));
}
await writeFile(path.join(root, 'src/data/paperAssets.json'), JSON.stringify(papers, null, 2) + '\n');

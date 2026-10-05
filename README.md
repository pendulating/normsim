# normsite

Project website for *Context-based normative simulacra from narrative fiction*
(COLM 2026). Built with [Astro](https://astro.build) and Tailwind v4, deployed
to GitHub Pages from `main` by `.github/workflows/deploy.yml`.

## Develop

```bash
npm install
npm run dev       # http://localhost:4321/normsim/
npm run build     # static output in dist/
npm run preview
```

Node 22 or newer.

## Where the content lives

All copy is data, so editing the page rarely means touching a component.

| File | Holds |
|---|---|
| `src/data/paper.ts` | Title, authors, venue, abstract, links, BibTeX, funding note |
| `src/data/method.ts` | The three "How it works" cards |
| `src/data/readings.ts` | Further reading, grouped, each with an optional selected quote |
| `src/data/now.ts` | "What we're thinking about now" |
| `public/assets/paper.pdf` | The PDF the "Paper" button serves. Replace with the camera-ready. |

### Adding a reading

Append to a group in `src/data/readings.ts`:

```ts
{
  title: 'Work title',
  meta: 'Authors. Venue, year.',
  href: 'https://doi.org/...',        // optional
  why: 'One or two sentences on why it matters here.',
  quote: {                            // optional
    text: 'A verbatim passage.',
    source: 'Author, where the passage is from',
    href: 'https://...',              // optional
  },
},
```

Quotes are rendered as pull quotes and must be verbatim from the source or its
published abstract. Leave `quote` out rather than paraphrase.

## Design system

The site follows `~/style/frontend-palette.md`:

- `src/styles/tokens.css` holds the six palette tokens as RGB triplets, both
  theme blocks, `--theme-transition`, and the Parabolica font stacks.
- `src/styles/global.css` exposes them to Tailwind as the `skin` namespace
  (`bg-skin-fill`, `text-skin-base`, `text-skin-accent`, `border-skin-line`,
  `bg-skin-card`, `text-skin-on-ink`) through `@theme inline`, so alpha
  modifiers like `bg-skin-accent/70` work. Components never name a raw token.
- The theme is `data-theme="light" | "dark"` on `<html>`, set before first
  paint by an inline script in `src/layouts/Base.astro` and toggled by
  `src/components/ThemeToggle.astro`. Tailwind's `dark:` variant matches the
  attribute, not `prefers-color-scheme`.
- Parabolica is served from TypeKit kit `krx4hav` with a real fallback stack.

## Deploying

The site is published at <https://mfranchi.net/normsim/>. GitHub Pages serves
project repositories under the `pendulating.github.io` user site, whose custom
domain is `mfranchi.net`, at a path equal to the repository name, so the
repository must be named `normsim`. `astro.config.mjs` sets `site` to
`https://mfranchi.net` and `base` to `/normsim` to match. Pages uses the
"GitHub Actions" source, and every push to `main` publishes.

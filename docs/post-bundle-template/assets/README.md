# assets/ — image and diagram conventions

The publishing agent reads this file to know how to handle assets
during the lift. Drop final-format assets here; the lift step copies
them into the right place: still images and per-entry video into the
entry's own **bundle folder** (`src/content/<collection>/<slug>/`),
animated GIFs and shared downloads into **`public/resources/<topic>/`**.

Each post and project is a *folder* — `src/content/posts/<slug>/index.md`
(or `index.mdx`) — with its assets sitting beside it, referenced by
filename. (The folder name is the URL; `index` is stripped from the slug.)

## Where assets end up

| Asset type | Goes to | Referenced from body as |
|---|---|---|
| Still images (SVG, PNG, JPG, WebP) | the entry's bundle folder, `src/content/posts/<slug>/foo.svg` | `![alt](./foo.svg)` · `heroImage: ./foo.svg` |
| MP4 video | the entry's bundle folder; entry becomes `index.mdx` | `import v from './foo.mp4'` → `<source src={v} type="video/mp4" />` |
| Animated GIFs | `public/resources/<slug>/foo.gif` | `![alt](/resources/<slug>/foo.gif)` |
| PDFs / ZIPs (downloads) | `public/resources/<topic>/foo.{pdf,zip}` | `[label](/resources/<topic>/foo.pdf)` |

**Why the split:** still images go through Astro's optimizer (responsive
`srcset`, WebP) so they must live under `src/` in the bundle. Animated GIFs
would have their animation stripped by that pipeline, and downloads (PDF/ZIP)
are often shared across several entries — so both live in `public/resources/`
and are referenced by absolute URL. MP4 stays in the bundle but is pulled in
via an `import` (a raw relative `<source src="./x.mp4">` is *not* processed
and 404s).

**Variant C (project + post):** same rules per side — each page's stills and
video live in its own bundle folder (`src/content/projects/<slug>/` and
`src/content/posts/<slug>/`). An image used on both pages is copied into both
bundles (a few KB; self-containment beats deduping). A shared *download*
(one PDF/ZIP linked from both) lives once in `public/resources/<topic>/` and
is linked by absolute URL from both.

The blog's README §"Images" section is the source of truth for *why*
these conventions exist. Summary:

- **Source images ≥ 1800 px wide** when possible. Astro builds an
  srcset and caps the largest entry at the source's native width.
- **MP4 over GIF when both are available** — typically 3–4× smaller
  for the same content, sharper. GIFs work if MP4 isn't available.
- **SVG** for hand-authored charts / diagrams. Resolution-independent.
- **Animated media bypasses Astro's image pipeline** (it would strip
  the animation). Drop those in `public/resources/<topic>/` and
  reference by absolute URL.
- **Raw-HTML relative paths don't resolve — import bundle video in MDX.**
  A relative `./foo.svg` is processed **only** by Markdown `![]()` and the
  `<Image>` component. Inside raw HTML — `<video>`, `<source src>`,
  `<img src>`, `poster=` — a relative path ships verbatim and resolves
  against the page URL, so `<source src="./demo.mp4">` builds to a dead
  link. To embed a bundle video, make the entry `index.mdx` and `import`
  it (`import demo from './demo.mp4'` → `<source src={demo} />`). A
  `<video>` needs no `poster`; `preload="metadata"` shows the first frame.
  (Use `autoPlay` / `playsInline` camelCase in MDX.)
- **Click-to-expand** is automatic — any `<img>` inside `<article>` is
  wrapped in a link to the loaded resolution at build time. Don't add
  your own anchor wrappers.

## Naming

The bundle folder already namespaces the file, so **no slug prefix** —
just a kebab-case descriptor:

- `hero.svg`
- `two-stroke-engine.svg`
- `launch-demo.mp4`

Files in `public/resources/<topic>/` keep a descriptive name too
(`results-bundle.zip`, `ablation-study.pdf`).

## Hand-authoring SVG diagrams

When `diagrams.md` carries Mermaid sources, render to SVG (not Mermaid)
because this site has no Mermaid integration. Match the palette in the
existing diagrams in the post bundles (e.g.
`src/content/posts/creativity-and-machines/novelty-value.svg`):

- Strong / solved / AI-superhuman: green `#34a853` on `#e6f4ea`
- Weak / contested / AI-leaky: red `#ea4335` on `#fce8e6`
- Frontier / open question: blue `#4285f4` on `#e8f0fe`
- Borrowed / proxy / amber: amber `#f9ab00` on `#fef7e0`
- Neutral: gray `#5f6368` on `#f1f3f4`

Reference fonts: `font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"` for the diagram body.

## Public-domain / CC-licensed images

For photographs or historical images you don't author yourself:

1. Prefer Wikimedia Commons (clean PD / CC licensing, stable URLs).
2. Record source + license in `IMAGES.md` *before* the lift step
   commits.
3. Public domain (pre-1928 in US) is the cleanest case; CC0 is next;
   CC BY needs attribution preserved in the caption or alt text.
4. Never use copyrighted images without an explicit license grant.

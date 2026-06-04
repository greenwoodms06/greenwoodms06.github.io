# assets/ — image and diagram conventions

The publishing agent reads this file to know how to handle assets
during the lift. Drop final-format assets here; the lift step copies
them into the right place under `src/content/posts/images/` or
`public/posts-media/`.

## Where assets end up

| Asset type | Goes to | Referenced from body as |
|---|---|---|
| Still images for posts (SVG, PNG, JPG, WebP) | `src/content/posts/images/<slug>-foo.{svg,png,jpg}` | `./images/<slug>-foo.png` |
| Animated GIFs | `public/posts-media/<slug>-foo.gif` | `/posts-media/<slug>-foo.gif` |
| MP4 video | `public/posts-media/<slug>-foo.mp4` | `<video><source src="/posts-media/<slug>-foo.mp4">…</video>` |
| PDFs | `public/posts-media/<slug>.pdf` | `/posts-media/<slug>.pdf` |

The blog's README §"Images" section is the source of truth for *why*
these conventions exist. Summary:

- **Source images ≥ 1800 px wide** when possible. Astro builds an
  srcset and caps the largest entry at the source's native width.
- **MP4 over GIF when both are available** — typically 3–4× smaller
  for the same content, sharper. GIFs work if MP4 isn't available.
- **SVG** for hand-authored charts / diagrams. Resolution-independent.
- **Animated media bypasses Astro's image pipeline** (it would strip
  the animation). Drop those in `public/posts-media/` and reference
  by absolute URL.
- **Click-to-expand** is automatic — any `<img>` inside `<article>` is
  wrapped in a link to the loaded resolution at build time. Don't add
  your own anchor wrappers.

## Naming

Use the post's slug as a prefix, then a kebab-case descriptor:

- `ideas-are-cheap-hero.svg`
- `creativity-and-machines-two-stroke-engine.svg`
- `gonogo-launch-demo.mp4`

This keeps the `posts/images/` and `public/posts-media/` directories
sortable and prevents accidental collisions.

## Hand-authoring SVG diagrams

When `diagrams.md` carries Mermaid sources, render to SVG (not Mermaid)
because this site has no Mermaid integration. Match the palette in the
existing diagrams under `src/content/posts/images/`:

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

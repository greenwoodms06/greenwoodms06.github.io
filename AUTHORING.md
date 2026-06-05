# Authoring a post bundle

A **post bundle** is a working directory that holds everything a single
post (or short + long pair) needs: the source markdown, a `BUILD.md`
publish contract, supporting context, and asset files. Bundles let
posts be drafted somewhere else (a research repo, a working directory,
a different machine) and then *lifted* into this blog with a single
instruction.

The template lives at `docs/post-bundle-template/`. Read its files
in this order:

1. **`BUILD.md`** — the publish contract. Tells the lift agent what to
   produce, from what, with which assets, and the hard constraints.
2. **`post.md` / `post-short.md` / `paper.md`** — the source(s). Each
   one's frontmatter already matches the posts schema in
   `src/content.config.ts`, so the lift step doesn't have to translate
   any fields.
3. **`CONTEXT.md`** — the bundle's spine: glossary, central claim, why
   this framing. Background; not published.
4. **`CLAIMS.md`** — optional. If the post rests on a body of factual
   claims, log each one's verification status here so the lift agent
   can honor the "don't reintroduce corrected myths" constraint.
5. **`assets/`** — diagrams, source images, image-sourcing list. The
   `README.md` in there documents the per-asset-type conventions.

## How to use it

### 1. Copy the template to your working directory

```bash
cp -r docs/post-bundle-template/ /path/to/your/working-dir/my-new-post/
```

(Or any other location — the bundle doesn't have to live inside this
repo. The lift step accepts an absolute path.)

### 2. Pick a variant

In `BUILD.md`, check one of:
- **(A) Single post** — keep `post.md`, delete `post-short.md` and `paper.md`.
- **(B) Short + long pair** — keep `post-short.md` and `paper.md`, delete `post.md`.
- **(C) Project + post** — usually published from the project's own scaffold; the bundle just produces the post.

### 3. Fill in the source(s)

- Translate the placeholders in the frontmatter to real values
  (`title`, `description`, `pubDate`, `tags`).
- Write the body. The frontmatter already matches the posts schema, so
  there's no translation step.
- Add assets to `assets/`. Source any photos / videos. Record CC /
  PD licenses in `assets/IMAGES.md` *before* the lift.
- Render Mermaid diagrams (if any) to SVG; drop the SVGs in `assets/`.
- Fill in `CONTEXT.md` so the lift agent has the spine.
- (Optional) Fill in `CLAIMS.md` and flag any corrected myths.
- Update `BUILD.md`'s HARD CONSTRAINTS with anything specific to this
  bundle.

### 4. Hand the bundle to the lift agent

Open this repo with Claude and say:

```
Lift the bundle at <path-to-bundle>.
```

The lift agent will:

- Read `BUILD.md` first.
- Read each source markdown.
- Copy assets into the correct destination (`src/content/posts/images/`
  for stills, `public/posts-media/` for animated media + PDFs).
- Generate any derived artifacts the BUILD.md asks for (a PDF via
  `pandoc paper.md --pdf-engine=xelatex`, an updated image record, etc.).
- Write the post(s) into `src/content/posts/`.
- Build and verify (footnotes, references, srcsets, click-to-expand
  script, PDF accessibility).
- Surface the slugs it picked, ask for redirection if you want them
  tighter, and commit when you confirm.

## What the lift agent will ask about

Some decisions can't be inferred from the bundle alone. Expect the
agent to surface:

- **Slugs** — it may propose tighter ones than the source titles
  imply.
- **Authorship flag** — `ai` by default if the bundle was drafted with
  AI assistance; flipping to `human` is your call after the red-pen
  pass.
- **PDF for the paper variant** — produce one, or skip?
- **Optional images** — fetch CC0 / PD versions, or ship text-only?
- **`relatedProjects` wiring** — does this post connect to any
  project on the blog?

## What the lift agent will NOT do

- **Invent new factual claims.** Anything new beyond what's in the
  source must be flagged or omitted.
- **Strengthen claims past their verification.** When in doubt,
  weaken.
- **Restore corrected myths.** If `CLAIMS.md` records a correction,
  the agent honors it.
- **Skip the visual gate.** Any image it sources or renders is read
  back as a raster before being placed.
- **Silently drop a blocked link.** A `repo:` / `demo:` URL that 404s
  or 403s is often *gated*, not *gone* (ORNL `code.ornl.gov`, private
  `github.com/ORNL-*` orgs). The agent keeps real-but-blocked links and
  flags them; it only drops malformed or genuinely-nonexistent URLs.
  "Blocked" ≠ "absent" — re-adding a link later is friction.

## Lifecycle & provenance

A bundle is **build scaffolding, not a durable source.** Once the lift
runs, the source of truth is the published markdown in the blog's
`src/content/` — that's what's committed and deployed. The working
bundle handed to the blog is disposable: it lands in the blog's
gitignored `docs/` (or is read from the project by path) and is not
tracked here.

The one part worth keeping is **provenance** — `CONTEXT.md` (the
glossary / thesis spine) and `CLAIMS.md` (the fact-check ledger). That's
verification *work*, not reproducible output, and its home is the
**source project's own repo**, committed next to the code it describes.
The project owns the claims it made about itself; the blog holds only
published content plus this reusable template. (See the "Two audiences"
section in `docs/post-bundle-template/BUILD.md`.)

## Updating the template

The template *is* the contract. When conventions change in this repo
(new image rule, schema change, new asset type), update the template
files in `docs/post-bundle-template/` so future bundles inherit the
new conventions automatically.

The lift agent treats the most recent template at HEAD as authoritative;
older bundles that pre-date a convention change get the new conventions
applied at lift time when not in conflict with what's in the bundle.

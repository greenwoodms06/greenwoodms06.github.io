# BUILD — publish contract for this bundle

**You are an agent with access to the `greenwoodms06.github.io` Astro blog. Your job: turn the source documents in this folder into published artifacts.** Read this file first; it tells you what to build, from what, with which assets, and the hard constraints you must not violate.

---

## Two audiences for this file

This template is read by two agents at two times: the **authoring agent**
(in the source project, *filling the bundle in*) and the **lift agent** (in
the blog, *turning it into published content*). The bulk below is the lift
contract; this section is for the authoring side.

**If you are authoring this bundle** (you're in a project's own repo,
generating a bundle for the blog):

⚠️ **Build the bundle in the blog's gitignored `docs/` — never inside the
source project's own tracked tree.** The blog ignores everything under
`docs/` except this template, so `<blog>/docs/<bundle-name>/` is a throwaway
staging area built for exactly this. The trap: an authoring agent running in
the source project will default to that project's own `docs/` (its cwd) and
pollute that repo with disposable scaffolding (`post.md`, `BUILD.md`,
`assets/`). That is the failure this convention exists to prevent. Stage the
working bundle in the *blog*; send only provenance *home*.

1. **Stage it in the blog.** Copy this template dir into the blog's
   gitignored `docs/`:
   `cp -r <blog>/docs/post-bundle-template <blog>/docs/<bundle-name>`.
   Pick a variant below and fill the sources (`post.md` / `post-short.md` /
   `paper.md`), `CONTEXT.md`, and — if the post rests on factual claims —
   `CLAIMS.md`. Render any `assets/diagrams.md` Mermaid to SVG (this blog has
   no Mermaid).
2. **Send only provenance home.** Copy *just* `CONTEXT.md` + `CLAIMS.md` back
   into the *source project's* repo, committed next to the code. They're the
   verification record for claims the project made about itself and belong
   next to the code — not the blog. The disposable parts (`post.md`,
   `BUILD.md`, `assets/`) stay in the blog's gitignored `docs/` and are never
   committed to the source repo. (`CONTEXT.md`'s glossary/anti-goals also stop
   a *future* edit to the post from drifting back into a corrected claim.)
3. **The staged bundle is disposable.** After the lift, the durable source of
   truth is the published markdown in the blog's `src/content/`; the staged
   bundle under `<blog>/docs/` is gitignored and can be deleted.
4. **Hand it off.** In the blog repo, say *"Lift the bundle at &lt;path&gt;."*
   The full human-facing intake routine is `AUTHORING.md` at the blog root.

---

## What variant is this bundle?

Pick one and delete the others. The variant decides which source files are load-bearing.

- [ ] **(A) Single post** — `post.md` only. The post stands alone. Use this for most things.
- [ ] **(B) Short + long pair** — `post-short.md` (the discoverable narrative) + `paper.md` (the long-form companion). Use this when you have one argument worth two artifacts: a 1,000–1,500-word essay and a 2,500+ word deep-dive.
- [ ] **(C) Project + post** — Body chose to publish this work as both a project page and a dated post. The post is the dated account; the project page (`/projects/<slug>`) is the evergreen artifact. This bundle produces the post; **if the project page doesn't already exist on the blog, the lift agent also authors it** from the project's repo `README` + `docs/`. Wire them both ways — post `relatedProjects: [slug]`, project `relatedPosts: [slug]` — and route project assets to the project side: stills to `src/content/projects/images/` (referenced `./images/…`), video / animated media to `public/projects-media/` (referenced `/projects-media/…`).

## What to produce

Depending on the variant above:

1. **A short post** — from `post.md` or `post-short.md`. General-interest, narrative, ~1,000–1,500 words. The discoverable artifact.
2. **(Variant B only) A linked deep-dive** — from `paper.md`. arXiv-style position paper or long-form companion, ~2,500+ words, with references and (optional) appendix. The short post links to it via `/blog/<paper-slug>`.
3. **(Variant B, optional) A PDF of the paper** — for download / archival. Generated via `pandoc paper.md --pdf-engine=xelatex`; lives in `public/posts-media/<paper-slug>.pdf`; linked from the paper post.
4. **(Optional, later) A social teaser** — an ~800-word thread extracted from the post. Do NOT build this as a third page; it's promo copy.

## Source documents (in this folder)

| File | Role |
|------|------|
| `post.md` | (Variant A) Source for the single post. Has frontmatter + footnotes. |
| `post-short.md` | (Variant B) Source for the short post. Has frontmatter + footnotes. |
| `paper.md` | (Variant B) Source for the long-form paper. Has frontmatter, numbered `[n]` references, optional appendix. |
| `CONTEXT.md` | Provenance: the glossary + thesis spine. Background, not for publication. |
| `CLAIMS.md` | (Optional) Provenance: every load-bearing factual claim's verification verdict + sources. Background, not for publication. The paper's appendix table is distilled from this. |
| `assets/` | Diagrams (ready or to-render) + image-sourcing list. See below. |

## Assets

**Ready to use** — anything in `assets/` that's already a final image format (SVG, PNG, JPG, MP4, GIF). Reference these from the body via relative paths.

**To source** — see `assets/IMAGES.md` for full specs, suggested public-domain / CC sources, licenses, and alt text. Use only public-domain or properly-licensed images, and record the final source + license in `assets/IMAGES.md` before publishing.

**Diagram sources** — `assets/diagrams.md` may contain Mermaid sources. This blog has no Mermaid integration today; render them to SVG (hand-author or `mmdc`) and drop the SVG into `assets/`. Match the existing palette in `src/content/posts/images/novelty-value.svg` for consistency.

### Suggested figure → section map

Fill in what's relevant for this bundle:

| Section | Figure |
|---------|--------|
| Top of post / paper | heroImage SVG or photo |
| §X — concept introduction | concept diagram |
| §Y — central argument | central figure |
| §Z — counterexample / context | period image or schematic |

## HARD CONSTRAINTS — do not violate

These are the recurring failure modes when adapting a bundle into the blog. If you're unsure, **weaken the claim, don't strengthen it.**

1. **Do NOT reintroduce corrected myths — and apply `CLAIMS.md`'s corrections even to claims already written into the source.** If earlier drafts contained claims that were later refuted, those refutations are recorded in `CLAIMS.md` and/or footnoted at the bottom of this BUILD.md; do not restore them when rewriting or expanding. Separately, a `post.md` / `paper.md` draft can *already contain* an un-hedged claim that the ledger says to soften (e.g. a drifting test count, a fuzzy library count). Cross-check the source text against `CLAIMS.md` before publishing and apply the hedge — don't assume the draft already did. See `CLAIMS.md` for this bundle's full ledger.
2. **Keep every citation.** Don't drop footnotes (post) or `[n]` references (paper). If you restyle references to the site's format, preserve author / year / venue verbatim.
3. **Preserve the per-document honesty stance.** A short post may keep corrections off-stage (sober narrative, no myth-dwelling); a paper may foreground them as a credibility feature. Don't swap these.
4. **Don't invent new factual claims.** Everything load-bearing has been verified. New examples, statistics, or anecdotes you add are unverified and must be flagged or omitted.
5. **Honor the §Images rule** in the blog's README. Source images ≥ 1800 px wide where possible; MP4 over GIF; animated media in `public/posts-media/` (not `src/content/posts/images/`).
6. **Raw-HTML asset paths must be absolute.** Inside any raw HTML you write in Markdown (`<video>`, `<img>`, `<source>`, `poster=`), reference assets by their absolute `public/` URL (`/posts-media/…`) — the `./images/…` relative form is processed **only** by Markdown `![]()` and the `<Image>` component. In raw HTML it ships verbatim and resolves against the page URL, so `poster="./images/x.png"` builds to a dead `/blog/images/x.png`. A `<video>` needs no `poster`; `preload="metadata"` shows the first frame. (See `assets/README.md`.)

## Open decisions for the human (resolve before publishing)

The bundle author should resolve these. The publishing agent should ask if they're not specified.

- **Byline** — drafts may carry a placeholder name. Confirm: **Scott Greenwood**.
- **Authorship flag** — `authorship: ai` if drafts were prepared with AI assistance and the voice is neutral; `authorship: human` if the body has been red-penned into the author's voice. Default to `ai` and flip when ready.
- **Slugs / routes** — keep them short. The bundle author may suggest; the publishing agent should propose tighter alternatives.
- **Titles** — change freely; the file titles are working drafts.
- **PDF** — produce one (Variant B only)?
- **arXiv** (Variant B) — if posting the paper to arXiv, note the endorsement requirement and frame it explicitly as a *position / perspective* paper.
- **Related projects** — does this post wire `relatedProjects: [project-slug]` to a project page? A `relatedProjects` entry with no matching page fails silently (the block just doesn't render), but an **inline** `/projects/<slug>` link in the body **404s if that page doesn't exist** — so either build the project page (Variant C) or drop the inline link before publishing.
- **Repo / demo links** — verify any `repo:` / `demo:` URL, but **do not auto-drop on a failed fetch.** A 404/403 usually means *gated or not-yet-public*, not *nonexistent* — ORNL hosts (`code.ornl.gov`, private `github.com/ORNL-*` orgs) routinely block unauthenticated checks for repos that are real and will resolve for an authorized viewer or once opened. **Keep those.** Only drop a URL that is malformed or whose host doesn't resolve at all (DNS failure), or that you have positive evidence never existed. When unsure, **keep it and flag it to the Body** — never silently strip a link, because re-adding it is friction the author doesn't want. (The agent verifies; the Body decides. "Blocked" ≠ "absent.")

## Bundle-specific notes

<!-- Add anything specific to this bundle here: known myth-corrections to honor, voice-calibration notes, audience target, etc. -->

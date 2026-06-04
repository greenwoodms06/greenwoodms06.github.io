# BUILD — publish contract for this bundle

**You are an agent with access to the `greenwoodms06.github.io` Astro blog. Your job: turn the source documents in this folder into published artifacts.** Read this file first; it tells you what to build, from what, with which assets, and the hard constraints you must not violate.

---

## What variant is this bundle?

Pick one and delete the others. The variant decides which source files are load-bearing.

- [ ] **(A) Single post** — `post.md` only. The post stands alone. Use this for most things.
- [ ] **(B) Short + long pair** — `post-short.md` (the discoverable narrative) + `paper.md` (the long-form companion). Use this when you have one argument worth two artifacts: a 1,000–1,500-word essay and a 2,500+ word deep-dive.
- [ ] **(C) Project + post** — Body chose to publish this work as both a project page and a dated post. The post and project sit on separate sides; the post is the dated account, the project is the evergreen artifact. The project usually lives in the project's own repo / scaffold; the post is what this bundle produces.

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

1. **Do NOT reintroduce corrected myths.** If the bundle's earlier drafts contained claims that later research refuted, those refutations are recorded in `CLAIMS.md` and/or footnoted at the bottom of this BUILD.md. Do not restore them when rewriting or expanding. See `CLAIMS.md` for this bundle's full ledger.
2. **Keep every citation.** Don't drop footnotes (post) or `[n]` references (paper). If you restyle references to the site's format, preserve author / year / venue verbatim.
3. **Preserve the per-document honesty stance.** A short post may keep corrections off-stage (sober narrative, no myth-dwelling); a paper may foreground them as a credibility feature. Don't swap these.
4. **Don't invent new factual claims.** Everything load-bearing has been verified. New examples, statistics, or anecdotes you add are unverified and must be flagged or omitted.
5. **Honor the §Images rule** in the blog's README. Source images ≥ 1800 px wide where possible; MP4 over GIF; animated media in `public/posts-media/` (not `src/content/posts/images/`).

## Open decisions for the human (resolve before publishing)

The bundle author should resolve these. The publishing agent should ask if they're not specified.

- **Byline** — drafts may carry a placeholder name. Confirm: **Scott Greenwood**.
- **Authorship flag** — `authorship: ai` if drafts were prepared with AI assistance and the voice is neutral; `authorship: human` if the body has been red-penned into the author's voice. Default to `ai` and flip when ready.
- **Slugs / routes** — keep them short. The bundle author may suggest; the publishing agent should propose tighter alternatives.
- **Titles** — change freely; the file titles are working drafts.
- **PDF** — produce one (Variant B only)?
- **arXiv** (Variant B) — if posting the paper to arXiv, note the endorsement requirement and frame it explicitly as a *position / perspective* paper.
- **Related projects** — does this post wire `relatedProjects: [project-slug]` to any project page on the blog?

## Bundle-specific notes

<!-- Add anything specific to this bundle here: known myth-corrections to honor, voice-calibration notes, audience target, etc. -->

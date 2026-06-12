# CONTEXT — domain language for this site

Terms and decisions that govern content on this site. The bundle-authoring
workflow itself is documented in `AUTHORING.md`; this file holds the
*language* — what words mean here and the curation rules behind them.

## Glossary

- **Post** — a dated account on the Writing page (`src/content/posts/`).
  Its `pubDate` is the date the canonical draft was completed, not the day
  it landed on this blog. When several posts arrive as an arc, they keep
  their authentic staggered dates so date-sorting reproduces reading order
  (decided 2026-06-12 for the soul arc; never backdate beyond what the
  source history supports).
- **Project** — the evergreen artifact (`src/content/projects/`). A project
  page describes the thing as it stands; posts describe what happened.
- **Related wiring** — the two-way link between the collections:
  post `relatedProjects: [project-id]` ↔ project `relatedPosts: [post-ids]`.
  Both sides are maintained by hand; a lift that adds a post about a project
  updates both.
- **"Writing about this"** — the rendered form of a project's
  `relatedPosts`: a list at the *bottom* of the project page showing title,
  date · kind, and the post's description. Deliberately not a sidebar — the
  whole site is a single centered reading column, and that holds for every
  page type (decided 2026-06-12).
- **Publications** — `src/data/publications.ts`, sourced from the CV *plus*
  self-published study reports (type `report`, venue "Self-published study
  report", PDF hosted under `public/posts-media/`). Nothing on the page may
  imply a refereed venue that doesn't exist.
- **Superseded post** — when a newer post tells the same story better, the
  older one is dropped, not kept alongside (the unpublished
  `soul-system-1-0` post was dropped 2026-06-12 in favor of the
  ablation-study post, which covers the same study).
- **Authorship facet** — `authorship: human | ai` on posts and projects;
  `ai` discloses an AI-assisted artifact to readers and derives the
  `ai-assisted` tag. Blog voice calibrates against the human-tagged
  exemplars in `src/content/`, not the academic voice guide.

## Anti-goals

- No sidebars; no second layout system for one page type.
- No invented history in any content — release posts, project pages, and
  publication entries claim only what the source record supports.

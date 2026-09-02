# CONTEXT — domain language for this site

Terms and decisions that govern content on this site. The bundle-authoring
workflow itself is documented in `AUTHORING.md`; this file holds the
*language* — what words mean here and the curation rules behind them.

## Glossary

- **Post** — a dated account (`src/content/posts/`) with a `kind`: `how-to`,
  `devlog`, `essay`, or `note`. Notes are scraps and are timeline-only (decided
  2026-09-02); the other three list on the Writing page.
  Its `pubDate` is the date the canonical draft was completed, not the day
  it landed on this blog. When several posts arrive as an arc, they keep
  their authentic staggered dates so date-sorting reproduces reading order
  (decided 2026-06-12 for the soul arc; never backdate beyond what the
  source history supports).
- **Project** — the evergreen artifact (`src/content/projects/`). A project
  page describes the thing as it stands; posts describe what happened.
- **Related wiring** — one-way (decided 2026-09-02, replacing the hand-kept
  two-way form): a post names its projects in `relatedProjects`, validated as
  collection references so a wrong id fails the build. Projects declare nothing.
- **"Writing about this"** — derived: every published post naming the project,
  newest first, at the *bottom* of the project page with title, date · kind,
  and description. Deliberately not a sidebar (decided 2026-06-12); the
  table-of-contents rail added 2026-06-17 on detail pages at wide widths is the
  one exception, pending the 2026-09 style pass.
- **Timeline** — the home page: one ledger of posts, projects, gallery items,
  and publications, grouped by year, newest first, title-only rows, filterable
  by source. Publications carry a year only and sort after the dated items of
  their year. Items sit on their *original* date, never `updatedDate` — this is
  a history.
- **Gallery** — `src/content/gallery/`, link-out only: one thumbnail here, the
  work where it lives (ArtStation, YouTube, …). No detail page.
- **Publications** — `src/data/publications.ts`, sourced from the CV *plus*
  self-published study reports (type `self-published`, never `report` — that
  type is for institutional technical reports; `aiAssisted: true` shows the
  disclosure badge; PDF hosted under `public/resources/<topic>/`; DOI via Zenodo
  when minted). Nothing on the page may imply a refereed venue that doesn't
  exist. A test in `src/lib/content.test.ts` enforces the type and the badge.
- **Superseded post** — when a newer post tells the same story better, the
  older one is dropped, not kept alongside (the unpublished
  `soul-system-1-0` post was dropped 2026-06-12 in favor of the
  ablation-study post, which covers the same study).
- **Authorship facet** — `authorship: human | ai` on posts and projects;
  `ai` discloses an AI-assisted artifact to readers and derives the
  `ai-assisted` tag. Blog voice calibrates against the human-tagged
  exemplars in `src/content/`, not the academic voice guide.

## Anti-goals

- No sidebars beyond the TOC rail; no second layout system for one page type.
- No dark mode (decided 2026-09-02): one light theme, `color-scheme: light`.
  Halves every colour decision; the pre-release stage says delete as you go.
- No invented history in any content — release posts, project pages, and
  publication entries claim only what the source record supports.
- No full-size media in the repo beyond short demo clips: video lives on
  YouTube, artwork on ArtStation; the site links out.

## Privacy checklist (before anything is committed)

The site already carries name, photo, employer affiliation, and GitHub; the
items below are what would *add* exposure.

- **No minors.** Nothing near Roster Rotation content names a child, a team,
  a schedule, or shows a face.
- **Strip metadata from anything under `public/`.** Only images that go
  through the `src/` pipeline lose EXIF; files in `public/` (GIF, PDF, ZIP,
  video) are served verbatim, and phone media carries GPS.
- **Employer work only once released.** ORNL plugin pages describe what the
  released README says; nothing internal, no unreleased screenshots.
- **Git history is permanent.** A public repo keeps deleted files. Stage
  drafts in the gitignored `docs/`, never in `src/` until final.
- **No routine or location.** No home-area shots, no real-time whereabouts.

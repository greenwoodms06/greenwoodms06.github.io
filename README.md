# On…

*A collection of How-Tos and What-Nots* — the source for [greenwoodms06.github.io](https://greenwoodms06.github.io).

Side projects, how-tos, and what-nots: notes from the workshop on nuclear sims,
graphics, 3D printing, and code. A project showcase with a writing stream hanging off it.

## Stack

- **[Astro 6](https://astro.build)** + TypeScript — static site, content collections
- **[Tailwind CSS 4](https://tailwindcss.com)** (via `@tailwindcss/vite`) + `@tailwindcss/typography`
- **MDX**, **RSS**, and **sitemap** via the official Astro integrations
- **Shiki** syntax highlighting (light/dark)
- Build-time image optimization with **sharp** (`astro:assets`)
- **Vitest** for unit tests
- Hosted free on **GitHub Pages**

## Local development

Requires **Node ≥ 22.12** (see `engines` in `package.json`).

```bash
npm install
npm run dev        # local dev server at http://localhost:4321
npm run build      # production build → dist/
npm run preview    # serve the built site locally
npm test           # run Vitest unit tests
npm run check      # astro check (type + content validation)
```

## Authoring content

Two content collections live under `src/content/`, validated by zod schemas at build
time (`src/content.config.ts`).

### Project or post?

- **Project** = an evergreen *thing you maintain* — a tool, codebase, or framework. It
  has a `status`, not a publish date that matters; you revise it *in place*. Answers
  "what is this and where's the code."
- **Post** = a dated *account* — a how-to, setup guide, lesson, or milestone. It has a
  `pubDate` you'd never edit away; a follow-up is a *new* post.
- **When a topic wants both** (e.g. Unreal Engine): the **project is the umbrella hub**,
  the **posts are the dated episodes**. Describe the artifact in the project; don't
  re-summarize the how-tos there — link to them (the project page auto-lists its
  `relatedPosts` under "Writing about this").
- **Too small for a post?** Add a dated bullet in the project body, not a new post.

**Add a project** → one Markdown file in `src/content/projects/` (+ an optional thumbnail):

```yaml
---
title: My Project
summary: One-line blurb for the card.
date: 2026-05-22
status: active            # wip | active | archived
tags: [astro, graphics]
thumbnail: ./images/my-project.png   # optional, optimized at build
repo: https://github.com/...         # optional
demo: https://...                    # optional
featured: true            # surfaces on the home grid
order: 0                  # optional manual sort
relatedPosts: [post-slug]            # optional
authorship: human         # human | ai (see below)
---

The project writeup goes here.
```

**Add a post** → one Markdown/MDX file in `src/content/posts/`:

```yaml
---
title: My Post
description: Short summary for listings and SEO.
pubDate: 2026-05-22
updatedDate: 2026-05-23   # optional
tags: [devlog]
heroImage: ./images/hero.png         # optional
draft: false              # true = excluded from the production build
relatedProjects: [project-slug]      # optional
authorship: human         # human | ai (see below)
---

The post body goes here.
```

Cross-link projects ↔ posts with the `relatedPosts` / `relatedProjects` slug arrays.

### AI-authorship disclosure

Both collections carry an `authorship` field (`human` by default). Setting it to `ai`
flags the entry as AI-generated: an authorship badge is shown on the page, the marker
flows through to the tag pages, and it's surfaced in the RSS feed — so readers always
know what they're reading.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds with
`withastro/action` and publishes via `actions/deploy-pages`. The repo's
**Settings → Pages → Source** must be set to **GitHub Actions** (not "Deploy from a
branch"). No manual build step needed.

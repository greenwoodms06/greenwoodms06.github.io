---
# Frontmatter matches the posts schema in src/content.config.ts.
# Required: title, description, pubDate, authorship.
# Optional: tags, heroImage, updatedDate, draft, relatedProjects.

title: 'TITLE HERE'
description: One sentence that lands on the listing pages and in SEO. Keep under ~200 chars.
pubDate: YYYY-MM-DD
tags: [tag1, tag2]
heroImage: ./hero.svg                # optional — leave commented if no hero
# updatedDate: YYYY-MM-DD                   # optional — only when materially revising after publish
authorship: ai                              # ai | human — see BUILD.md
relatedProjects: []                         # e.g. [soul-test-netflow]
# draft: true                               # uncomment to hide from prod build
---

Opening paragraph — earn the click. The post stands on what's in this
file; readers shouldn't need the BUILD.md to follow along.

## First H2 — name the thing

Body content. Use H2 for sections, H3 sparingly. Lists, code blocks,
tables, blockquotes, footnotes[^example] all work via GFM.

Inline images:

![alt text — explain what the figure shows, since some readers won't load it](./concept.svg)

## Closing

End with a sentence the reader can quote.

[^example]: Citation goes here. Author (year), *Venue*. Footnotes render as a numbered list at the bottom of the post with back-references.

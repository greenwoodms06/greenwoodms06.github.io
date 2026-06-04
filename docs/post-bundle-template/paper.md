---
# Long-form companion of a short+long pair. Or standalone position paper.
# Same schema as post.md. The post links to /blog/this-slug.
# pandoc reads this file too when generating the PDF — keep frontmatter
# valid YAML so `--metadata` overrides work cleanly.

title: 'On X, Y, and Z'
description: One sentence — paper's headline claim in plain language.
pubDate: YYYY-MM-DD
tags: [tag1, position-paper]
heroImage: ./images/hero.svg
authorship: ai
relatedProjects: []
---

> **Companion to:** [*SHORT TITLE*](/blog/SHORT-SLUG)
> — the short essay version of this argument.
>
> **Download:** [PDF version](/posts-media/PAPER-SLUG.pdf)
> (typeset for offline / archival reading).

**Abstract.** Two to four sentences. State the central claim, the
contribution, and the scope (this is a position paper / a synthesis /
an empirical study).

## 1. Section heading

Body text. Use numbered sections (`## 1. Title`) to make cross-referencing
clean — `(§3.2)` reads naturally in prose.

Cite inline as `[1]` or `[3, 4]`; the references list lives at the
bottom.

### 1.1 Subsection

Use H3 for subsections under H2-numbered sections.

![figure caption — concise, names the source](./images/figure.svg)

## 2. Next section

…

## Conclusion

Close on the open question, not a triumphal summary.

---

## References

[1] Author, A. (Year). "Title." *Venue* Vol(Iss):pp.
[2] …

---

## Appendix: Claim ledger

(Optional. If the paper makes a lot of factual claims, surface a table
showing each one's verification status. Distill from `CLAIMS.md`.)

| # | Claim | Verdict | Key source |
|---|-------|---------|-----------|
| 1 | … | [OK] | … |
| 2 | … | [note] correction | … |

*Method note: how the claims were verified.*

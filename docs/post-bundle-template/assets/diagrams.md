# Diagram sources (Mermaid)

This blog has no Mermaid integration. Render these to SVG (hand-author
or via `mmdc`) and drop the SVGs into this directory before the lift.
See `README.md` in this dir for the palette to match.

---

## 1. Diagram name

What this diagram shows in one line.

```mermaid
flowchart LR
    A([Start]) --> B[Step 1]
    B --> C{Decision?}
    C -->|Yes| D[Step 2a]
    C -->|No| E[Step 2b]
    D --> F([End])
    E --> F
```

---

## 2. Another diagram

…

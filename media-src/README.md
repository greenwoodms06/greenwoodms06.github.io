# media-src — sources for generated media

Generated media are committed beside the page that uses them (under
`src/content/`); the sources that produce them live here so the media can be
regenerated. Nothing in this folder is part of the site build. Rendered output,
installed dependencies and caches are git-ignored.

| Folder | Produces | Used by |
| --- | --- | --- |
| `agent-explainer/` | The 84-second explainer MP4, its poster, and two diagrams | `src/content/posts/how-ai-models-and-agents-work-together/` |
| `agent-guide/` | The workflow flowchart in chapter 4 of the AI-agents guide | `src/content/guides/coordinating-ai-agents/langgraph-workflow.svg` |

## agent-explainer

Python + Pillow + FFmpeg. See [agent-explainer/RENDERING.md](agent-explainer/RENDERING.md).

## agent-guide

`langgraph-workflow.mmd` is the Mermaid flowchart from the original guide
chapter; `mermaid-config.json` sets the site palette and turns off HTML labels
so the SVG renders as plain text inside an `<img>`. Render with mermaid-cli
(it drives a headless Chromium):

```bash
npx -p @mermaid-js/mermaid-cli@11 mmdc \
  -i media-src/agent-guide/langgraph-workflow.mmd \
  -c media-src/agent-guide/mermaid-config.json \
  -b '#f8f6f1' \
  -o src/content/guides/coordinating-ai-agents/langgraph-workflow.svg
```

The shipped SVG was rendered with mermaid-cli 11.17.0. Without a Chromium that
Puppeteer can find, add `-p puppeteer.json` with
`{"executablePath": "/path/to/chrome", "args": ["--no-sandbox"]}`. If the chart
changes, update the image's alt text in
`src/content/guides/coordinating-ai-agents/langgraph-development-walkthrough.md`,
which describes every node and branch.

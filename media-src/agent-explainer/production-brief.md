# Production brief for an introductory agent explainer

This package prepares an article and an 84-second animated explainer about models, harnesses, orchestration, interfaces, sandboxes, and evidence. It excludes Soul System and other personal project details. Production is the next stage; the video and finished images have not been rendered.

## Audience and purpose

Write for developers and technically curious readers who already use AI assistants but find the surrounding vocabulary confusing. The viewer should be able to identify the main components and understand one development workflow. Avoid promising that more agents always improve results.

## Editorial decisions already made

- Title: How AI models and agents work together.
- Use the CSV export example throughout.
- Six scenes, 84 seconds total, based on `scenes.json`.
- Explain the architecture before naming tools.
- Show separate review and acceptance checks without claiming guaranteed independence.
- Use a restrained visual style with readable labels and directed movement.
- Keep citations in the article, source note, and accompanying publication copy; do not crowd animation frames with long URLs.
- No personal branding, invented endorsements, vendor logos, or product screenshots.
- No installation tutorial or claim that the workflow has been implemented.

## Deliverables for production

Create the following under `output/` in this package:

| File | Purpose |
| --- | --- |
| `agent-explainer.mp4` | 1920 by 1080, 30 fps, approximately 84 seconds, with visible captions. |
| `agent-explainer.vtt` | Web captions matching the final timing. |
| `agent-explainer-teaser.gif` | A legible 8 to 12 second loop showing the workflow and repair path, about 960 pixels wide. |
| `agent-layers.svg` and `.png` | Diagram distinguishing interface, controller, worker harness, model, tools, and execution boundary. |
| `agent-workflow.svg` and `.png` | Pipeline with repair arrows and an evidence-based acceptance outcome. |
| `poster.png` | Shareable 1920 by 1080 still with the title and concise layer labels. |
| `contact-sheet.png` | Representative frames for quick visual inspection. |
| `preview.html` | Local preview containing the video, images, transcript, and links to outputs. |
| `render-report.md` | Actual tools used, output dimensions/durations, checks, and any delivery limitations. |

Provide reusable animation source and a documented rendering command alongside these outputs. Prefer SVG and code-driven vector motion for these diagrams; no raster image generation is necessary.

## Visual direction

Use a warm white background (#F7F8FA), dark text (#17212B), and a small consistent palette: interface/slate, controller/blue, harness/teal, model/violet, evidence/green. Use amber for repair or uncertain states and label every status; color alone must not convey the result. Failed tests are repair feedback, not a dramatic danger animation.

Use a system sans-serif font. At 1080p, aim for titles of 60 to 72 pixels, main labels of at least 36 pixels, and captions of at least 40 pixels. Keep important content inside a 96-pixel safe margin. Reserve a stable caption area. Limit caption lines to two and show manageable phrases rather than full paragraphs.

Keep diagrams compact. Use short fades, line drawing, and a highlighted path. Avoid perpetual movement, flashing, bouncing icons, decorative robots, stock footage, and simultaneous competing animations. End each scene with a brief stable hold.

## Diagram semantics

The interface sends a job to the controller. The controller coordinates worker sessions. A worker harness manages a loop involving its model and tools. Tool execution occurs within a configured environment boundary. A sandbox is not a box containing only the model, and multiple agents do not imply one provider per agent.

The workflow diagram shows plan → implement → checks → review → final acceptance → deliver. Failed checks, concrete review findings, or failed acceptance can return to implementation within a budget. Unclear requirements and exhausted budgets pause for a human decision. A green outcome means the configured acceptance criteria were met, not universal correctness.

## Audio and captions

The primary artifact must teach effectively with sound off. Optional narration should use the exact script in `scenes.json`, spoken naturally. Do not claim to have generated narration unless an actual audio file exists. If speech tooling is available, align captions to the rendered audio and adjust timing without changing claims. If it is not, produce a complete captioned silent video and report that plainly. Do not block the rest of production on narration.

`captions.srt` is a prepared timing draft based on the silent 84-second version. Revalidate it after any timing changes. `narration.txt` is the plain transcript.

## Production verification

Inspect rendered frames at every scene boundary and representative intermediate points. Verify small-screen readability, caption clipping, arrows, status labels, and final holds. Check actual file duration, dimensions, playable output, and GIF looping. Avoid a black or blank opening frame. Review the narration against the animation, and correct mismatches in source before rendering again.

Keep `article.md` usable as standalone prose. It uses source links and ordinary Markdown; the blog platform is unspecified, so do not assume Mermaid, custom components, or embedded scripts. The exported PNG diagrams are the portable illustrations. After rendering, supply an illustrated copy of the article with relative image paths and descriptive alt text, while retaining the original text-only article.

## Model and tool boundary

The user requested Astra for the next production stage. Its official model page describes text output and image input; audio and video modalities are not supported by the base model. A switch therefore does not supply a video renderer or speech generator. Use available rendering and media tools to produce artifacts, and report the actual result. [GPT-6 Astra documentation](https://developers.openai.com/api/docs/models/gpt-6-astra)

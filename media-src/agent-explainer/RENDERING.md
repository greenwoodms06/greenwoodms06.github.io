# Reproduce the explainer

Media for the post [How AI models and agents work together](../../src/content/posts/how-ai-models-and-agents-work-together/index.mdx):
the 84-second silent MP4, its poster, and the two diagrams. The video is an
illustrated explainer drawn in code, not footage of running agents.

`render.py` reads the six-scene script in `scenes.json` and draws every frame
with Pillow; the same drawing calls also emit SVG copies of the diagrams. Frames
are rendered at 30 fps and encoded by FFmpeg (from the `imageio-ffmpeg` wheel,
so nothing is downloaded at render time). Captions are drawn into the frames.

## Files

| File | Role |
| --- | --- |
| `render.py` | The renderer — layout, scenes, timings, encoding. Edit this to change the visuals. |
| `scenes.json` | Authoritative narration, timings and caption segments. |
| `captions.srt`, `narration.txt` | Derived from `scenes.json` by `prepare-captions.ps1`; `render.py` reads both. |
| `article.md` | The source-checked article prose. `render.py --stills` turns it into `output/article-illustrated.md`. |
| `verify.py` | Decodes frames from the actual MP4 and checks the GIF, caption cues and local references. |
| `production-brief.md`, `storyboard.md` | The design brief and six-scene storyboard the render follows. |
| `source-check.md` | Primary sources and the editorial checks behind each claim. |
| `render-report.md` | What was inspected when the shipped media were produced (2026-10-21). |

## Requirements

- Python 3 with Pillow 12.3.0 and imageio-ffmpeg 0.6.0, installed into
  `.render-deps/` (git-ignored).
- The Segoe UI fonts (`segoeui.ttf`, `segoeuib.ttf`). They are not
  redistributable, so they are read from a Windows install: `C:/Windows/Fonts`
  by default, or the directory in `EXPLAINER_FONTS`. To use other fonts, change
  the filenames in `font()`; layout is tuned to Segoe UI's widths.

Text is laid out with Pillow's BASIC engine. The shipped media were drawn
without raqm; Linux Pillow wheels include it and shift glyphs by sub-pixels, so
`render.py` forces BASIC to keep output reproducible.

## Regenerate

Windows (PowerShell), from this directory:

```powershell
python -m pip install --target .render-deps Pillow==12.3.0 imageio-ffmpeg==0.6.0
python render.py
python verify.py
```

Linux or WSL, from this directory:

```bash
python3 -m pip install --target .render-deps Pillow==12.3.0 imageio-ffmpeg==0.6.0
# no pip? uv pip install --python python3 --target .render-deps Pillow==12.3.0 imageio-ffmpeg==0.6.0
export EXPLAINER_FONTS=/mnt/c/Windows/Fonts   # WSL; elsewhere, a copy of the Segoe UI files
python3 render.py
python3 verify.py
```

`python render.py --stills` renders only the diagrams, poster, representative
frames, captions and article, which is much faster when only a still changed.

After changing `scenes.json`, run `prepare-captions.ps1` (PowerShell) first to
rebuild `captions.srt` and `narration.txt`.

Everything lands in `output/` (git-ignored), including `preview.html` for a
local look and contact sheets for inspection. Look at the contact sheets after
any layout or narration change; `verify.py` checks structure, not appearance.

### Checked on 2026-10-21

From a clean copy of this directory on WSL (Pillow 12.3.0, imageio-ffmpeg
0.6.0 with its Linux FFmpeg 7.0.2), the poster, both diagram PNGs and decoded
MP4 frames at 1, 20, 40, 60 and 83 s were pixel-identical to the shipped files.
Expected byte differences: FFmpeg/x264 version strings inside the MP4, and LF
rather than CRLF line endings in the text outputs when rendered off Windows.

## Publish into the blog

Copy these four files from `output/` into
`src/content/posts/how-ai-models-and-agents-work-together/`, replacing the old
ones (the post imports them by these names):

- `agent-explainer.mp4`
- `poster.png`
- `agent-layers.png`
- `agent-workflow.png`

If the narration changed, update the transcript in that post's `index.mdx` to
match `narration.txt`; if the diagrams changed, update their alt text and
captions. The VTT, GIF, SVG copies and contact sheets are not published: the
captions are already burned into the video (a caption track would duplicate
them), the post carries a text transcript instead, and the site prefers MP4 to
GIF.

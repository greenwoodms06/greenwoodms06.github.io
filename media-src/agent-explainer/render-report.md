# Media production report

Produced October 21, 2026. The package contains a completed silent, captioned explainer and reusable illustrations. No blog publishing was performed.

## Deliverables

| Asset | Actual output |
| --- | --- |
| Video | `agent-explainer.mp4`: 1920 × 1080, 30 fps, 84 seconds, 2,520 frames; H.264, yuv420p, fast-start MP4. |
| Captions | Visible captions throughout the video plus `agent-explainer.vtt`, 24 timed cues. |
| GIF | `agent-explainer-teaser.gif`: 960 × 540, 10-second infinite loop. Unchanged frames are coalesced by the encoder. |
| Diagrams | `agent-layers` and `agent-workflow`, each in editable SVG and portable 1920 × 1080 PNG. |
| Poster | `poster.png`, 1920 × 1080. |
| Inspection | `contact-sheet.png` for source scenes and `encoded-contact-sheet.png` for extracted MP4 frames. |
| Preview | `preview.html`, responsive local page with media, transcript and downloads. |
| Article | `article-illustrated.md`, preserving the original prose and adding relative PNG image links and alt text. |
| Editable source | `render.py`, `scenes.json`, `verify.py` and `RENDERING.md`, beside this report. |

## Tools and checks

Python, Pillow 12.3.0 and imageio-ffmpeg 0.6.0 produced the media. Pillow draws the raster frames; the same drawing primitives emit SVG. FFmpeg encodes the MP4 and fully decodes it afterward. No generated imagery or external footage was used. Sharp rasterized both SVGs for a separate export check.

- Full decode completed successfully: all 2,520 frames, 84 seconds, no decode error.
- Representative encoded frames cover every scene boundary and intermediate states, including the pending evidence check and its completion. The opening frame is populated, captions stay within their panel, and the last scene holds to the end.
- Inspected the source contact sheet, actual encoded frames, SVG export and preview screenshots. A preparation mismatch between the repair caption and highlighted step was corrected before encoding.
- The illustrative filter defect is labeled as an earlier review finding. Pending checks remain amber until the displayed completion state. Example results are explicitly labeled illustrative, rather than executed tests.
- GIF size, total duration and infinite-loop flag checked with Pillow.
- The WebVTT has 24 cues matching the prepared 84-second script. Visible captions wrap to at most two lines.
- Chrome successfully loaded and played the actual MP4, reporting 84 seconds and 1920 × 1080 with no media error. Desktop and 390-pixel mobile preview screenshots were captured; no horizontal page overflow was detected.
- Local preview and illustrated-article asset references are checked by `verify.py`.

## Delivery limits

The video deliberately uses the prepared silent version. There is no narration or music, and no audio generation is claimed. It teaches through captions, highlights and brief crossfades. The diagrams are dense at phone width; open the images or video fullscreen for their secondary labels. The transcript and article remain readable as ordinary page text.

Passing this media validation does not validate an actual agent implementation: the workflow and results are teaching illustrations. Product claims and source links are carried over from the prepared article. No new product capabilities or benchmarks were added.

SVG typography depends on the viewer's fonts; the PNGs preserve the produced appearance. The rendering script currently uses Windows Segoe UI; portability instructions are in `RENDERING.md`.

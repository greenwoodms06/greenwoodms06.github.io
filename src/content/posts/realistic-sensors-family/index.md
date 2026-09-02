---
title: 'One plugin, three repos'
description: How RealisticSensors split into a UE5 capture plugin, a Python analysis toolkit (Forge), and a browser viewer (rsviewer) — the dates, the reasons, and what the capture and provider contracts between them buy.
pubDate: 2026-09-02
kind: devlog
tags: [unreal-engine, python, sensors, simulation, synthetic-data, varsa, devlog]
heroImage: ./rsviewer.png
relatedProjects: [realistic-sensors]
authorship: ai
---

RealisticSensors started as one Unreal Engine plugin: put sensor components on
an actor, start recording, and get RGB, depth, segmentation, events, optical
flow, IMU, LiDAR, and thermal frames on one clock with nanosecond timestamps.
By September 2026 it is three repositories. This is how that happened, from
the READMEs and the git logs, and why each split happened.

## Analysis leaves the plugin (2026-07-02)

The plugin's first commit is 2025-12-18. On 2026-01-23 the DVS analysis
package landed in `ExternalAssets/`, and the analysis side grew from there, a
lane per sensor type, until the repo was carrying two dependency worlds. The
plugin needs Unreal Engine 5.6+. The analysis needs Python 3.11+, `uv`, and
optional extras like open3d, laspy, and HDF5.

So the analysis became its own repo, RealisticSensorsForge. Its history begins
2026-02-20, and its README still opens with `cd ExternalAssets/rsforge/` — a
trace of where it lived. The split itself landed on 2026-07-02, in a plugin
commit that reads "extract sensor_analysis to standalone RealisticSensorsForge
repo." The plugin README now just points across and says Forge "consumes
captures from this plugin via the fixed capture-input contract."

That contract is the interesting part. Forge's `docs/contracts/capture-input.md`
is a fixed description of the plugin's on-disk output, verified against real
captures on 2026-06-12, and it records the things a consumer gets wrong if it
guesses: the tree depth varies depending on whether sensors were recorded as
part of a session or controlled independently, so sensor folders must be
found by structure and never by fixed depth; the first frame number is
sensor-dependent — `000000` for the sync-pipeline sensors, `000001` for the
async cameras, `000002` for DVS event files — so nothing may assume a common
start index or count. Writing that down is what let the two repos move
independently. Forge reads a shape, not a plugin version.

## The viewer leaves Forge (2026-08-17)

The viewer was built inside Forge, on a branch, between 2026-08-13 and
2026-08-17. Two decisions from its design spec set up the move before a line
of it existed. Decision 9: keep every Forge import in one adapter module "so
extraction to a future RealisticSensorsViewer repo is mechanical." Decision 15:
distribution stays in Forge for now; extraction is a recorded contingency, not
a v1 requirement.

The contingency triggered four days later. The extraction plan is three lines:
package `rsviewer`, CLI `rsview`; a fresh start from the tree on Forge's
`render_viewer` branch, with that branch pushed as the provenance archive and
no history surgery; `rsforge view` removed as a concept, no delegating stub.
The behavior-preservation proof
was the migrated suite — 156 tests — going green in the new repo plus a live
boot against a real capture. Forge deleted its copy from `main` on 2026-08-18.

Why move it at all? Because nothing in the viewer needs Unreal or Forge's
lanes. Its unit is a *stream* — a folder of per-frame files whose frame number
is the trailing integer in the stem — and its form factor is a local web app
with the logic in a small Python server and a thin no-build frontend. A tool
whose input is "a folder of numbered files" is more useful when it is not
bundled with one particular producer.

## The provider contract (2026-08-24)

After extraction, the viewer's only link to Forge was a single imported
discovery module, wrapped in a shim inside the viewer. Then a second producer
arrived — real event-camera hardware, whose native shape is one file spanning
time rather than one file per frame — and the viewer stopped naming any
provider at all.

The contract, `docs/contracts/provider-declaration.md`, is short. A repo that
writes data the viewer should read ships `src/rsviewer_provider.py` declaring
`RSVIEWER_PROVIDER`: a name, the file extensions it claims, a decoder, and an
optional kind hint. Recognition is by claim, never by the viewer sniffing
content. Two stream classes exist, `frame_per_file` and `continuous`, and a
provider says which it serves. The viewer looks in exactly three places —
installed entry points, every `--provider-path` you pass, and the directories
beside its own checkout — and never at a path derived from data you opened,
because importing code found next to data is code execution by file placement.
A malformed provider degrades only itself: it shows under "not loaded" in
Settings and the viewer runs on without it.

Forge shipped its declaration on 2026-08-24. At first it reproduced the
viewer's shim exactly, so the viewer could delete its copy with nothing
changing for a user. What the contract buys is a dependency arrow that points
one way. Forge knows about the viewer in exactly one file, outside its own
package, and nothing in Forge imports it. Only Forge can declare Forge's lane
outputs under `analysis_output/` as viewable streams, and now it can. And the
viewer needs zero coordination to accept the next producer. Without any
provider, folders still open — unclassified, and you pick "treat as" per
stream.

## What each one is for

- **The plugin** records: synchronized multi-modal captures out of Unreal.
- **Forge** analyzes: per-sensor lanes, cross-sensor fusion, grid video, splat export, HDF5.
- **rsviewer** looks: every stream on one timeline, in a browser, from any folder of numbered frames.

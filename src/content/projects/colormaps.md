---
title: 'colormaps'
summary: Unreal Engine colormaps for visualization — ~80 colormaps from matplotlib's library packaged as DataAssets, color curves, textures, and individual color samples across 7 categories. Includes the perceptually-uniform set (viridis, plasma, magma, inferno, cividis, turbo), with Python workflows for adding more.
date: 2026-06-04
status: active
tags: [unreal-engine, plugin, varsa, visualization, colormaps, matplotlib, python, ornl]
repo: https://code.ornl.gov/varsa/unreal/plugins/colormaps
authorship: human
---

<video autoplay loop muted playsinline controls>
  <source src="/projects-media/colormaps.mp4" type="video/mp4">
</video>

**What it is.** A library of colormaps for Unreal Engine, available in
the formats you actually need for visualization: a **DataAsset
(`DA_Colormap`)** per colormap that carries source/group metadata plus
the rendered assets — **color curves, textures, and individual color
samples**.

The default library is **matplotlib's** colormap collection ported into
Unreal — ~80 colormaps across 7 categories. See the
[matplotlib colormap docs](https://matplotlib.org/stable/users/explain/colors/colormaps.html)
for the reference each one matches.

**Why.** Picking colormaps in Unreal is normally a one-off chore — gather
references, eyeball gradients, build a color curve, sample to a texture.
matplotlib already did this work for the visualization community.
Bringing those palettes in directly skips the rebuild step and gives
projects an off-the-shelf set of *perceptually-aware* maps.

## What ships in the library

| Category | Maps | Examples |
|---|---|---|
| **Perceptually uniform** (recommended) | 6 | turbo · viridis · plasma · inferno · magma · cividis |
| Sequential | 18 | Blues · Greens · Reds · YlOrBr · YlGnBu · PuBuGn · BuGn · YlGn (and 10 more) |
| Sequential (legacy) | 16 | gray · bone · spring · summer · autumn · hot · afmhot · copper (and 8 more) |
| Diverging | 12 | RdBu · RdYlBu · RdYlGn · Spectral · coolwarm · bwr · seismic (and 5 more) |
| Cyclic | 3 | twilight · twilight_shifted · hsv |
| Qualitative | 12 | Pastel1 · Paired · Accent · Set1 · Set2 · Set3 · tab10 · tab20 (and 4 more) |
| Miscellaneous | ~17 | terrain · gnuplot · cubehelix · jet · turbo · nipy_spectral · rainbow (and others) |

The **perceptually-uniform** set at the top is the modern recommendation
for scalar-field visualization — equal steps in the data map to equal
perceived steps in color, regardless of where on the map you are.
`viridis`, `cividis`, and `turbo` are the canonical defaults; `jet` and
`rainbow` are kept in the library but you probably shouldn't reach for
them.

## What you get per colormap

- **DataAsset** (`DA_Colormap`) — carries source / group metadata
  (matplotlib category, name, type), references the rendered assets.
  Helper functions sort and filter by metadata.
- **Color curve** — sampled at runtime to look up colors at arbitrary
  values.
- **Texture** — referenceable from materials for shader-side sampling.
- **Individual color samples** — N discrete colors at equal intervals
  for cases where you want banded output, not a continuous gradient.

Two access patterns: reach for the DataAsset (and let it orchestrate)
or reach for the underlying asset directly — whichever fits the use
case.

## Adding a new colormap

**Python workflow** (recommended):

1. Modify and run `./ExternalAssets/scripts/exportColormaps.py` locally.
   The script calls `matplotlib.pyplot.get_cmap()` for each named map,
   samples N colors at equal increments, and writes per-colormap `.txt`
   files. Add new entries to the category lists at the bottom — or
   hand-author `.txt` files in the same format if you have a colormap
   matplotlib doesn't.
2. In Unreal, run `./ExternalAssets/scripts/importColormaps.py` via
   **Tools → Execute Python Script**, or in the console:
   `py 'FULL/PATH/TO/importColormaps.py'`.

**Manual workflow:** create a DataAsset using `DA_Colormap` as the base
and hand-populate the field values with custom color curves, textures,
etc.

## Cite as

Authored at ORNL by Scott Greenwood and collaborators. Published under
MIT OR Apache-2.0.

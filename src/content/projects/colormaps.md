---
title: 'colormaps'
summary: Unreal Engine colormaps for visualization — matplotlib's library packaged as DataAssets, color curves, textures, and individual color samples, with Python workflows for adding new ones.
date: 2026-06-04
status: active
tags: [unreal-engine, plugin, varsa, visualization, colormaps, matplotlib, python, ornl]
repo: https://code.ornl.gov/varsa/unreal/plugins/colormaps
authorship: human
---

![colormaps sweep](/projects-media/colormaps.gif)

**What it is.** A library of colormaps for Unreal Engine, available in
the formats you actually need for visualization: a **DataAsset
(`DA_Colormap`)** per colormap that carries source/group metadata plus
the rendered assets — **color curves, textures, and individual color
samples**.

The default library is **matplotlib's** colormap collection ported into
Unreal — viridis, plasma, magma, inferno, cividis, the diverging maps,
the qualitative palettes. See the
[matplotlib colormap docs](https://matplotlib.org/stable/users/explain/colors/colormaps.html)
for the reference each one matches.

**Why.** Picking colormaps in Unreal is normally a one-off chore — gather
references, eyeball gradients, build a color curve, sample to a texture.
matplotlib already did this work for the visualization community.
Bringing those palettes in directly skips the rebuild step and gives
projects an off-the-shelf set of *perceptually-aware* maps.

## What you get

- **DataAsset per colormap.** `DA_Colormap` carries source / group
  metadata and references the associated assets. Helper functions sort
  and filter by metadata.
- **Three consumable formats.** Use the **color curve** (sampled at
  runtime), the **texture** (read in materials), or the **individual
  color samples** (snap to discrete bands) — whichever fits the use
  case.
- **Two access patterns.** Reach for the DataAsset (and let it
  orchestrate) or reach for the underlying asset directly.

## Adding a new colormap

**Python workflow** (recommended):

1. Modify and run `./ExternalAssets/scripts/exportColormaps.py` locally.
   This generates per-colormap `.txt` files. Edit the script to define
   new colormaps or tweak existing ones — or hand-author `.txt` files in
   the same format.
2. In Unreal, run `./ExternalAssets/scripts/importColormaps.py` via
   **Tools → Execute Python Script**, or in the console:
   `py 'FULL/PATH/TO/importColormaps.py'`.

**Manual workflow:** create a DataAsset using `DA_Colormap` as the base
and hand-populate the field values with custom color curves, textures,
etc.

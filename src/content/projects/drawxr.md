---
title: 'drawxr'
summary: A proof-of-concept Unreal Engine plugin for drawing in AR / VR / MR — finger-pinch or stylus, free-space or volume- or plane-constrained, with a wire-management menu for shape / color / size.
date: 2026-06-04
status: active
tags: [unreal-engine, plugin, varsa, xr, vr, ar, mr, quest, metaxr, ornl]
repo: https://code.ornl.gov/varsa/unreal/plugins/drawxr
authorship: human
---

![drawxr splash](/projects-media/drawxr-splash.png)

**What it is.** A proof-of-concept Unreal Engine plugin for drawing in
**AR / VR / MR** — collectively "XR" — built and tested on the **Quest 3**
with the MetaXR plugin.

**Why.** The original ask wasn't "let users draw" — it was *"let users
track wires"*. Plotting paths through a physical space, marking up a
mock-up, leaving annotations a teammate can see. So the focus is on a
**wire manager** that tracks each stroke, knows its length, and gives a
small set of controls for shape, color, and size.

## What it does

- **Two input paths.** Draw with finger pinches or with a stylus.
- **Three drawing modes.** Free in 3D space, constrained to a 3D volume
  (sphere / ellipsoid / box / mesh), or constrained to a 2D plane.

![drawxr 3D constraints](/projects-media/drawxr-3d-ellipse-wire.png)

- **Wire management menu.** Edit each "wire" (stroke) after the fact —
  shape, color, size — without re-drawing.

![drawxr wire management menu](/projects-media/drawxr-fullmenu.png)

## Status

Proof-of-concept — the abstraction is "tracked wires with style," not
"production drawing tool." But the wire-manager pattern is general
enough to be the spine of a more polished tool if the project warrants
one.

## Requirements

- Unreal Engine 5.6+
- [MetaXR Plugin](https://developers.meta.com/horizon/downloads/package/unreal-engine-5-integration/)
- Tested on Quest 3

## Cite as

Authored by Scott Greenwood at ORNL (2025). Published under MIT OR
Apache-2.0.

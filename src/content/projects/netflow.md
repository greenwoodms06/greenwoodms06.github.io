---
title: 'netflow: one generic network solver'
summary: A domain-agnostic "conservation on a network" solver, with nuclear thermal-hydraulics as its first plugin.
date: 2026-05-21 # frozen as a finished demonstrator
status: archived
tags: [python, nuclear, thermal-hydraulics, numerical-solver, scipy]
thumbnail: ./images/netflow-rosetta.png
featured: true
order: 5
authorship: ai
relatedPosts: []
---

**What it is.** A domain-agnostic solver for one idea — a scalar state on every
node, a conserved flux on every edge — with nuclear / Rankine thermal-hydraulics
as its first plugin. It sits between raw `scipy.sparse` and full domain codes,
competing on cross-domain genericity and Python ergonomics rather than domain
depth.

**Why.** To find out whether a single generic core can host very different
physics as plugins — aimed at fast pre-design scoping (sizing, bounding peak fuel
temperatures) ahead of heavier Modelica / CTF / BISON models.

## Highlights

- **One core, four problem shapes.** The same solver drives steady-state,
  transient, eigenvalue (criticality), and coupled multiphysics — each just an
  outer loop around the core. A second domain (hydraulic pipe networks) and a
  neutron-diffusion solver were added with **zero** core changes: genericity
  proven, not claimed.
- **Exact where it counts.** The fuel-pin radial model (film + gap + clad + fuel)
  reproduces the textbook closed form essentially exactly, and the neutronics
  k-eff converges at the expected second-order rate.
- **Honest about its edges.** There's no momentum equation in the core — pressure
  drop is a loss coefficient, and transverse mixing is a calibrated coefficient,
  not solved physics. Knowing exactly where a model stops being trustworthy is
  half its value.

## A lesson worth keeping

Verification isn't validation. Energy balanced to machine precision the whole
time, yet the absolute fuel temperature only came right after adding a physical
gap-conductance term — a clean reminder that internal consistency isn't the same
as matching reality. Everything here is framed as code-to-code comparison, not
validation against measured data.

The abstraction turned out to be the same acausal "across / through" connector
that Modelica and ModelingToolkit already mature — so netflow was frozen as a
finished demonstrator and rebuilt the proper way in Julia:
**[Thermal-hydraulics in Julia + ModelingToolkit](/projects/soultest-julia-mtk)**.

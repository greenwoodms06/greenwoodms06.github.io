---
title: 'Thermal-hydraulics in Julia + ModelingToolkit'
summary: Rebuilding the netflow physics on ModelingToolkit's acausal connectors — and benchmarking it head-to-head against the hand-rolled Python solver.
date: 2026-05-21 # frozen as a finished demonstrator
status: archived
tags: [julia, modelingtoolkit, nuclear, thermal-hydraulics, benchmark, acausal-modeling]
thumbnail: ./images/mtk-perf-scaling.png
featured: true
order: 6
authorship: ai
relatedPosts: []
---

**What it is.** A bounded reactor thermal chain — fuel pin → coolant channel →
loop — built in Julia with ModelingToolkit's acausal connectors. It's a
like-for-like rebuild of the Python **[netflow](/projects/netflow)** physics,
then benchmarked head-to-head against it.

**Why.** netflow's abstraction turned out to be exactly what ModelingToolkit
already does, so the natural next step was to rebuild it the "proper" way and
measure what you actually gain and lose.

## Highlights

- **Matched the hand-rolled solver to ~25 mK** node-by-node, reproducing the same
  physics in roughly **25× less hand-written code**.
- **Julia's numerics matched or beat Python at scale** — about 1.7× faster at
  10k nodes and at parity by 90k, and that's conservative, since the Julia solve
  is nonlinear where Python's was linear.
- **Cross-domain composition is the real payoff.** Wiring a point-kinetics power
  block (a signal-domain model) into the thermal network to close the Doppler
  feedback loop was friction-free — exactly the thing a hand-rolled solver makes
  painful.

## The catch: the wall is code generation, not math

The numerics are great; *compiling* the model is the bottleneck. Per-component
connections expand into one large unrolled function, so symbolic compilation +
JIT grow faster than the solve itself — extrapolating to an estimated **25–40
minutes just to compile** (not solve) a full assembly. A shipping fix exists, but
it's license-gated.

![ModelingToolkit compile-time wall vs problem size](./images/mtk-compile-wall.png)

All comparisons here are code-to-code, not validation against physical
measurement.

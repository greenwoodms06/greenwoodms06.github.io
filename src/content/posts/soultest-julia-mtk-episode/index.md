---
title: 'Rebuilding netflow on ModelingToolkit: 14× less code, then a compile wall'
description: The Julia / MTK episode of soul-test-netflow — same physics as the Python netflow, on a high-level symbolic modeling library. Matched node-by-node to 25 mK with 14× less code, and stopped short of a full reactor-assembly model when the compile step became the bottleneck.
pubDate: 2026-05-21
tags: [julia, modelingtoolkit, nuclear, thermal-hydraulics, benchmark, acausal-modeling]
heroImage: ./perf-scaling.png
authorship: ai
relatedProjects:
  - soul-test-netflow
---

**What it is.** The same fuel-pin → coolant-loop physics as the
[Python episode](/blog/netflow-python-episode), rebuilt in Julia using
**ModelingToolkit (MTK)**. MTK is an open-source modeling library that lets
you describe components symbolically — you say *what the physics is*, not
*how to solve it* — and the library generates an efficient simulator from
the description. It's the same paradigm Modelica uses; Julia is the
implementation.

**Why.** Once the Python prototype was working, it became clear the
hand-built abstraction was essentially what MTK does for you. The natural
next step: rebuild it the "proper" way and measure exactly what you gain and
lose by handing the symbolic work to a library.

## Highlights

- **Matched the hand-rolled solver to ~25 mK** node-by-node, in roughly
  **14× less code** (98 lines vs ~1342). The library does the bookkeeping
  the Python version did by hand.
- **Julia's numerics matched or beat Python at scale** — about 1.7× faster
  at 10,000 nodes and at parity by 90,000, which is *conservative* because
  the Julia version is solving a nonlinear problem where the Python one was
  solving the linearized version.
- **Cross-domain composition is the real payoff.** Wiring a reactor power
  model (where power depends on temperature, closing the feedback loop with
  fuel) into the thermal network was friction-free — exactly the kind of
  thing a hand-rolled solver makes painful.

## The catch: the wall is code generation, not math

The numerics are great. What stops you isn't the solver — it's *compiling
the model*. MTK's compile step takes apart every connected component and
turns the whole system into one large generated function. As the model
grows, that compile time grows faster than the actual solve. Empirically
it scales as roughly **N^1.6** in the number of unknowns.

Extrapolating to a full **17×17 PWR fuel assembly** (~40,000 unknowns) gave
an estimated **25–40 minutes just to compile** — before the simulator runs
a single time-step. We never ran it.

![MTK compile-time wall vs problem size](./compile-wall.png)

The escape hatch exists: a tuned commercial compiler called
**JuliaSimCompiler.jl** is known to flatten this scaling. But it's gated
behind a paid registry and was out of scope for an apples-to-apples
standard-library comparison.

What MTK *got right* — at every problem size the open-source pipeline could
reach, the answers were identical to what Modelica produced on the same
physics. The paradigm is sound. The walls in this leg trace to ecosystem
gaps — no built-in steam-table water properties for MTK, no fluid-flow
connector in its standard library, and the tuned compiler being paid-only —
**not** to anything wrong with the symbolic approach. That's the spine of
the [capstone comparison](/blog/three-walls-comparison).

All comparisons here are code-against-code, not validation against measured
data.

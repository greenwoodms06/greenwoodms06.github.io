---
title: 'soul-test-netflow: three thermal-fluid paradigms on one PWR pin'
summary: Same physics — fuel pin → coolant loop at PWR conditions — built three times on one machine. Hand-rolled sparse-Newton Python, ModelingToolkit.jl, Modelica / Dymola. The comparison is the deliverable.
date: 2026-05-26
status: archived
tags: [python, julia, modelica, modelingtoolkit, dymola, nuclear, thermal-hydraulics, benchmark, acausal-modeling]
thumbnail: ./images/three-paradigm-walls.png
repo: https://github.com/greenwoodms06/soul-test-netflow
featured: true
order: 5
authorship: ai
relatedPosts:
  - netflow-python-episode
  - soultest-julia-mtk-episode
  - modelica-episode
  - three-walls-comparison
---

**What it is.** One bounded thermal-fluid chain — UO₂ fuel pin → He gap → Zr clad
→ forced-convection coolant loop at PWR conditions, slices 1 through 10 — solved
three times on the same machine, each leg using only its ecosystem's standard
library primitives. No tuned solvers, no third-party domain libraries.

**Why.** To find out where each paradigm actually hits a wall, on identical
physics, under one body's hand. The model is the medium; the comparison is the
deliverable.

## The three legs

- **`python/` — netflow.** Hand-rolled sparse-Newton solver: scalar `Node`/`Edge`
  abstraction, hand-assembled residual, damped Newton + `scipy.sparse` LU,
  CoolProp HEOS (IAPWS-95) water. ~1342 LOC.
- **`julia-mtk/` — soultest-julia.** ModelingToolkit + MTKStandardLibrary.
  Acausal thermal connectors, hand-rolled stream `FluidPort` (MTKStdLib doesn't
  ship one), constant-cp proxy because no IF97 binding for MTK is available.
  98 LOC.
- **`modelica/` — soultest-modelica.** Modelica 4.1 / Dymola 2026x / MSL —
  `HeatPort_a/_b` + stream `FluidPort_a/_b` + `Modelica.Media.Water.StandardWater`
  (IF97), driven headless from Python. 430 LOC.

## Headline (defaults; one machine; same week)

| Axis | Python (netflow) | Julia-MTK | Modelica (Dymola) |
|---|---|---|---|
| Single-pin solve | **9 ms** (Newton only) | 0.064 s @ 10k mesh | 3.7 s (translate + compile + sim) |
| Match to re-measured netflow | reference | **25 mK** (aligned closures) | **24.7 mK** HEOS-aligned / 0.34 K native IF97 |
| Component LOC | ~1342 | **98** | 430 |
| 17×17×30 PWR assembly | reachable, ~190 s | **extrapolated 25–40 min, never run** | **397 s, completed** |
| Where the wall lives | sparse-LU at ~10⁶ nodes | `mtkcompile` codegen ~N^1.6 | `gcc cc1` ~5 min on 174 MB C |

## Reading order

The four posts below walk the same arc:

1. The Python prototype — building the abstraction by hand.
2. The Julia/MTK rebuild — same physics on acausal symbolic primitives, and the
   compile wall that stopped it short of assembly scale.
3. The Modelica leg — the same physics on a mature acausal ecosystem, including
   the 17×17×30 assembly that Julia couldn't reach.
4. **The comparison** — the defended claim across all three: *same physics,
   three walls — but the walls are ecosystem gaps, not the paradigms.*

The repo's [`modelica/docs/COMPARISON.md`](https://github.com/greenwoodms06/soul-test-netflow/blob/main/modelica/docs/COMPARISON.md)
is the depth artifact (cross-leg table + scaling stories); each leg also carries
its own `CLOSEOUT.md` and `FINDINGS.md`.

## Honest caveats

- **One body, one machine, one week.** No cross-machine generalization claimed.
- **Code-comparison, not validation.** Strongest claim any leg makes is "matches
  another solver" or "matches an independently-derived analytic" — never
  "validated against measured data."
- **The time-axis isn't a race.** The python number is pure Newton; Dymola's
  includes translate + symbolic + C codegen + gcc + dymosim init + sim. The
  right axis is *was it possible at all* and *did the bottleneck shift the way
  the comparison predicted*.

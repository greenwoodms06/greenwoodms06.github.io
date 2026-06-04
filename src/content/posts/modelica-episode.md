---
title: 'The same physics on Modelica + Dymola: reaching the 17×17 assembly'
description: The third episode of soul-test-netflow — Modelica 4.1 / Dymola 2026x / MSL with IF97 water out of the box. The 17×17×30 PWR assembly that Julia could only extrapolate, completed in 397 s end-to-end.
pubDate: 2026-05-26
tags: [modelica, dymola, nuclear, thermal-hydraulics, benchmark, acausal-modeling]
heroImage: ./images/modelica-unfreeze-headline.png
authorship: ai
relatedProjects:
  - soul-test-netflow
---

**What it is.** The same fuel pin → coolant chain physics as the
[Python](/blog/netflow-python-episode) and
[Julia / MTK](/blog/soultest-julia-mtk-episode) episodes, rebuilt a third time
in Modelica 4.1 on Dymola 2026x. Idiomatic Modelica using only MSL primitives
— `HeatPort_a/_b`, stream `Modelica.Fluid.Interfaces.FluidPort_a/_b`, and
`Modelica.Media.Water.StandardWater` (IF97). 430 LOC across 6 components,
driven headless from Python via `DymolaInterface`.

**Why.** Julia/MTK stalled before assembly scale on `mtkcompile` codegen.
Modelica is the mature acausal-symbolic ecosystem the same paradigm already
lives in — same equations, but with an industrial translator behind them. The
question was whether the Julia ceiling was *the paradigm's* or *the
ecosystem's*. Modelica is the controlled experiment.

## Highlights

- **Matched the netflow baseline to 24.7 mK** when MTK and Dymola use
  HEOS-aligned closures; **0.34 K** when Dymola uses native IF97 (its
  default). At small scales the Dymola output is bit-identical to the Julia
  output — same equations, same numerics, two different translators.
- **Reached the 17×17×30 PWR assembly** that Julia only extrapolated:
  **397 s end-to-end** (translate + symbolic + C codegen + gcc + dymosim init
  + sim). Past it: 18×18×30 in 454 s, 20×20×30 in 645 s, both clean on the
  slope-1.38 trajectory.
- **The IF97-out-of-the-box gap matters.** MTK had to fake water with a
  constant-cp proxy because no IF97 binding ships for it; Dymola uses
  `Modelica.Media.Water.StandardWater` directly. That's an ecosystem
  difference, not a paradigm difference — the spine of the
  [comparison capstone](/blog/three-walls-comparison).
- **Composition at assembly scale was friction-free.** Adding cross-pin axial
  conduction added 25 % to the assembly time (543 s); subchannel cross-flow
  added 43 % (621 s); per-pin neutronics feedback ran at 17×17×10 in 135 s.
  None required core changes.

## The catch: this paradigm has a wall too — just later

The model is the medium, not the bottleneck. Dymola's wall has two faces:

1. **`gcc cc1` on the unrolled C.** At 17×17×30 the translator emits ~174 MB
   of C and `cc1` takes about 5 minutes of the 397 s budget. No Dymola flag
   moves this — mitigation would need `gcc -O0` or `tcc`.
2. **The init solver under IF97 inverses.** Chains long enough to trip
   initialization-bound walls hard-failed at defaults. Setting
   `Advanced.Translation.SparseActivate = true` halved a sim-bound wall
   (N=2500: 197 → 90 s) and *rescued* the init-bound case (N=5000: failed
   → 228 s).

And there's a hard ceiling above. Pushing past Julia's anchor with 18×18×30
and 20×20×30 succeeded; 22×22×30 got **OOM-killed at 19.9 GB resident** —
`cc1`'s RAM, not Dymola's. 25×25×30 was not reached on a 16 GB box.

## Caveats

- **Defaults in the headline.** Sparse-translation rescues init-bound walls
  but leaves the cc1 compile wall untouched. Tuning shifts the picture; the
  full sweep lives in the repo's `modelica/docs/FINDINGS.md`.
- **Code-comparison, not validation.** The strongest Modelica claim is
  "matches netflow to 24.7 mK when properties are aligned" — never "validated
  against measured PWR pin data" (NEA-restricted, full-core).
- **Vendor lock is partial.** Dymola is licensed; OpenModelica is an
  alternative on the same `.mo` source, untested here.

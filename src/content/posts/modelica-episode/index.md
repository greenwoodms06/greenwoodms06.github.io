---
title: 'The same physics on Modelica + Dymola: reaching the full PWR assembly'
description: The third episode of soul-test-netflow — Modelica 4.1 running in Dymola, the mature commercial simulator. The 17×17 PWR fuel assembly that Julia could only extrapolate, completed in 397 seconds end-to-end.
pubDate: 2026-05-26
tags: [modelica, dymola, nuclear, thermal-hydraulics, benchmark, acausal-modeling]
heroImage: ./unfreeze-headline.png
authorship: ai
relatedProjects:
  - soul-test-netflow
---

**What it is.** The same fuel-pin → coolant-loop physics as the
[Python](/blog/netflow-python-episode) and
[Julia / MTK](/blog/soultest-julia-mtk-episode) episodes, rebuilt a third
time in **Modelica 4.1** running on **Dymola 2026x**. Modelica is the
standard symbolic modeling language used widely in automotive, aerospace,
and energy; Dymola is the mature commercial simulator from Dassault
Systèmes. Same paradigm as Julia/MTK; very different ecosystem.

The whole model is 430 lines of code, using only the Modelica Standard
Library — its built-in thermal connectors, fluid-flow connectors, and
industry-standard IF97 water properties (the international steam tables).
Dymola is driven non-interactively from Python through its scripting bridge.

**Why.** Julia/MTK stopped short of a full reactor assembly because its
open-source compile step grew too fast. Modelica is the same kind of
symbolic-paradigm modeling but with a decades-mature commercial compiler
behind it. The question was whether the Julia ceiling was *the paradigm's*
fault, or *the open-source ecosystem's*. Modelica is the controlled
experiment.

## Highlights

- **Matched the Python baseline temperature to 24.7 mK** when both legs
  used aligned water-property tables; **0.34 K** when Dymola used its
  default IF97 steam tables and Python used its CoolProp-based ones. Same
  physics, different reference data. At small problem sizes the Dymola and
  Julia outputs were identical to the digit — two different simulators
  reading the same physics through the same paradigm.
- **Reached the full 17×17 PWR fuel assembly** that Julia could only
  extrapolate: **397 seconds end-to-end**, where "end-to-end" means
  everything — Modelica figuring out the equations, generating C code,
  compiling it, starting the simulator, and running the calculation. Past
  that, an 18×18 grid completed in 454 s and a 20×20 in 645 s, both on the
  same clean scaling trend.
- **Built-in steam-table water matters.** Julia/MTK had to fake water with
  a constant specific-heat approximation because no IF97 binding exists for
  it; Modelica reads `Modelica.Media.Water.StandardWater` straight from the
  standard library. That's an *ecosystem* difference, not a paradigm one —
  the spine of the [comparison capstone](/blog/three-walls-comparison).
- **Composition at full scale was friction-free.** Adding cross-pin axial
  heat conduction added 25 % to the assembly time (543 s). Adding subchannel
  cross-flow added 43 % (621 s). Adding per-pin reactor-power feedback ran
  at smaller scales (135 s for 17×17×10 axial slices). None of these
  required restructuring the core model.

## The catch: this paradigm has a wall too — just later

The model isn't the bottleneck. Dymola's wall has two flavors:

1. **The C compiler.** At the 17×17 assembly, Modelica generates about
   **174 MB of C source code** and the C compiler (`gcc`) takes roughly **5
   of the 397 seconds** chewing through it. No Dymola setting moves this —
   the only way out is using a smaller/faster C compiler.
2. **The initial-condition solver.** When the model has to start from a
   self-consistent state and the water properties are highly nonlinear,
   the initial-condition solve itself can stall. A non-default Dymola option
   (`Advanced.Translation.SparseActivate = true`, which tells Dymola to use
   sparse linear algebra inside its solver) halved one such case (197 → 90
   seconds) and *rescued* another that simply failed at default settings
   (a 5,000-element chain: failed → 228 seconds). That's a simulator
   choice, not a math limit.

And there's a hard ceiling above. Pushing past Julia's anchor with an
18×18 and 20×20 grid worked fine; a **22×22 grid ran the machine out of
RAM** — the C compile step had consumed about 19.9 GB before being killed.
A 25×25 was not reached on a 16 GB box.

## Caveats

- **Defaults in the headline.** Tuning matters: sparse linear algebra
  rescues some initialization-bound walls but doesn't move the C-compile
  wall at 17×17 (the compiler dominates). Full sweep is in the repo's
  `modelica/docs/FINDINGS.md`.
- **Code-against-code, not validation.** The strongest Modelica claim is
  "matches Python's netflow to 24.7 mK when properties are aligned" —
  never "validated against measured reactor data" (which is restricted to
  full-core safety analyses).
- **Vendor lock is partial.** Dymola is a paid license. OpenModelica is a
  free alternative that runs the same `.mo` source files, untested here.

---
title: 'Three walls, one paradigm: the bottlenecks are ecosystem gaps, not the math'
description: The capstone of soul-test-netflow — same physics, three machines. Each stack hit a wall at a different scale. The walls are ecosystem-shaped, not paradigm-shaped, and that's the claim worth staking.
pubDate: 2026-05-26
tags: [python, julia, modelica, modelingtoolkit, dymola, nuclear, thermal-hydraulics, benchmark, acausal-modeling]
heroImage: ./images/three-paradigm-walls.png
authorship: ai
relatedProjects:
  - soul-test-netflow
---

**Claim.** Same physics, three machines, three walls — and the walls are
ecosystem gaps, not paradigm failures. The acausal-symbolic paradigm itself
held up everywhere it was tested; what differed was *which gap each ecosystem
shipped with*.

This is the capstone of [**soul-test-netflow**](/projects/soul-test-netflow):
one bounded thermal-fluid chain (UO₂ fuel pin → He gap → Zr clad →
forced-convection coolant loop at PWR conditions, slices 1–10), built three
times in [Python](/blog/netflow-python-episode),
[Julia/MTK](/blog/soultest-julia-mtk-episode), and
[Modelica/Dymola](/blog/modelica-episode), on the same machine, in the same
week, from each ecosystem's standard library primitives only.

## The match: same equations, same numbers

Before any wall talk, the agreement floor:

| Pair | Match to re-measured netflow baseline |
|---|---|
| Julia / MTK vs Python | **25 mK** (with quadratic property fits over the coolant range) |
| Modelica / Dymola vs Python | **24.7 mK** (HEOS-aligned) · 0.34 K (native IF97) |
| Modelica vs Julia (slices 1–10) | **same equations, same numbers, same debugging surface** |

At small scales the two acausal-symbolic legs are bit-for-bit reading the
same physics — one through Julia, one through Dymola. The paradigm itself
is portable.

## The three walls

| Stack | Where the wall lives | Number |
|---|---|---|
| Python (netflow) | sparse-LU + Python at ~10⁶ nodes | 380k nodes in ~190 s; further is a slowdown, not a wall |
| Julia / MTK | `mtkcompile` per-component scalarisation, ~N^1.6 | ~71 s compile alone at 2k unknowns; **17×17×30 extrapolated 25–40 min, never run** |
| Modelica / Dymola | `gcc cc1` on unrolled C *or* IF97-inverse init solver | 17×17×30 in **397 s** end-to-end; 22×22×30 **OOM-killed at 19.9 GB cc1 resident** |

Each wall is at a different scale, and each is a different *kind* of cost.

## Why "ecosystem, not paradigm"

The MTK wall is the load-bearing case for the claim, so it goes first.

**Julia / MTK — every wall traces to a missing piece, not the math.**

- `mtkcompile` scalarisation is by-component because MTK doesn't ship the
  tuned escape; **JuliaSimCompiler.jl exists and is gated** behind the
  JuliaHub registry. With it, the wall plausibly moves a lot. Without it,
  this study had no number to report.
- The constant-cp = 5500 J/kg/K proxy was forced because **no IF97 / IAPWS-95
  binding for MTK ships**. The 25 mK match to netflow required quadratic
  property fits over the bounded coolant range — a workaround for a missing
  library, not a paradigm limit.
- The hand-rolled stream `FluidPort` (Franke 2009 pattern) exists because
  **`MTKStandardLibrary` doesn't ship one**. Modelica's
  `Modelica.Fluid.Interfaces.FluidPort_a/_b` handled the same case directly.

None of those are "the symbolic paradigm doesn't work." All three are "the
Julia ecosystem hasn't shipped the piece yet."

**Modelica / Dymola — the wall is the unrolled-symbolic codegen pattern
meeting real-world `cc1`.**

- 17×17×30 fits in 397 s. 22×22×30 doesn't, because `cc1` allocates 19.9 GB
  on 174 MB of unrolled C. **No Dymola flag moves this** — mitigation would
  need `gcc -O0` or `tcc`.
- The init-solver wall *does* respond to ecosystem knobs:
  `Advanced.Translation.SparseActivate = true` rescues a chain that
  hard-fails at defaults (N=5000: failed → 228 s). Sparsity in the
  translator's choice, not in the math.

This is where the claim is honest about its edges: the cc1 RAM ceiling is
genuinely a *paradigm × compiler toolchain* interaction, not a pure
ecosystem gap. Acausal-symbolic models emit large unrolled C; large C
compiles by allocating. The mitigation paths are real (sparser codegen,
smaller compilers, partial compilation), but they aren't a single missing
library.

**Python (netflow) — the wall is the design choice, by definition.**

Hand-rolling means the wall is the toolchain you picked. sparse-LU at ~10⁶
nodes is the wall netflow chose when it picked `scipy.sparse`. That isn't an
indictment of Python; it's the cost of opting out of an ecosystem's bigger
machinery.

## What this is not

- **Not a winner.** netflow at 9 ms vs Dymola at 397 s is a category error —
  one is pure Newton, the other is translate + symbolic + C codegen + gcc
  + dymosim init + sim. The right axis is *was it reachable at all* and
  *did the bottleneck shift the way the comparison predicted*.
- **Not validation.** Every comparison here is code-to-code or code-to-
  closed-form. The strongest claim any leg makes is "matches another solver
  to X mK." Measured PWR pin data is full-core or NEA-restricted; that
  ceiling was honored.
- **Not generalizable past one machine.** WSL2 / Linux 6.6 / Dymola 2026x /
  MTK on Julia 1.11 / Python 3.12. One body, one week.

## Source of truth

The depth artifact is the repo's
[`modelica/docs/COMPARISON.md`](https://github.com/greenwoodms06/soul-test-netflow/blob/main/modelica/docs/COMPARISON.md)
(the cross-leg table, the scaling stories, the per-leg findings ledgers).
The umbrella project page is [**soul-test-netflow**](/projects/soul-test-netflow).

If a number reads wrong, the repo invites correction — none of these are
meant to be the final word.

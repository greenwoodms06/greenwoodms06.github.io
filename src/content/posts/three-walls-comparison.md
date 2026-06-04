---
title: 'Three walls, one paradigm: the bottlenecks are ecosystem gaps, not the math'
description: The capstone of soul-test-netflow — same nuclear-reactor pin physics, three different software stacks. Each one hit a wall at a different scale. The claim worth staking is that the walls are ecosystem-shaped, not paradigm-shaped.
pubDate: 2026-05-26
tags: [python, julia, modelica, modelingtoolkit, dymola, nuclear, thermal-hydraulics, benchmark, acausal-modeling]
heroImage: ./images/three-paradigm-walls.png
authorship: ai
relatedProjects:
  - soul-test-netflow
---

**The claim.** Same physics, three machines, three walls — and the walls
are ecosystem gaps, not paradigm failures. The "*symbolic-modeling*"
approach itself (where you describe components as equations and let a
library generate the simulator) held up everywhere it was tested. What
differed was *which standard-library piece each ecosystem hadn't shipped
yet*.

This is the capstone of [**soul-test-netflow**](/projects/soul-test-netflow):
one bounded thermal-fluid problem (a fuel pin, its helium gap, its
cladding, and the high-pressure water flowing past it, at ten progressively
harder problem sizes) built three times in [Python](/blog/netflow-python-episode),
[Julia/ModelingToolkit](/blog/soultest-julia-mtk-episode), and
[Modelica/Dymola](/blog/modelica-episode), on the same machine, in the same
week, from each ecosystem's standard library only.

## The floor: same equations, same numbers

Before any wall talk, the agreement floor — how closely the three legs
agreed on the same physics:

| Comparison | Match to Python netflow's baseline temperature |
|---|---|
| Julia / MTK vs Python | **25 mK** (with matched water-property tables) |
| Modelica / Dymola vs Python | **24.7 mK** (matched properties) · 0.34 K (each leg using its default water model) |
| Modelica vs Julia (small problems) | **same equations, same numbers, same debugging experience** |

At small problem sizes the two symbolic-modeling legs are reading the same
physics through different simulators and producing the same answer to the
digit. The paradigm itself is portable.

## The three walls

| Stack | Where the wall lives | Number |
|---|---|---|
| Python (netflow) | sparse linear solver around a million unknowns | 380k unknowns in ~190 s; bigger is slower, not blocked |
| Julia / ModelingToolkit | the compile step that turns the model into one large generated function | ~71 s to compile alone at 2,000 unknowns; **a full 17×17 PWR fuel assembly was extrapolated at 25–40 minutes and never run** |
| Modelica / Dymola | the C compiler (`gcc`) chewing through generated source *or* an initialization-phase solver | 17×17 assembly in **397 s** end-to-end; a 22×22 grid **ran the machine out of RAM** — the compile step alone hit ~19.9 GB |

Each wall is at a different scale, and each is a different *kind* of cost.

## Why "ecosystem, not paradigm"

The Julia / MTK case is the load-bearing one, so it goes first.

**Julia / MTK — every wall traces to a missing piece, not to the math.**

- The compile step scales badly (~N^1.6 in the number of unknowns) because
  the open-source pipeline expands every component into its own block of
  code. A **commercial tuned compiler called JuliaSimCompiler.jl** is known
  to flatten this — but it's gated behind a paid registry and was out of
  scope for a standard-library comparison. With it, the wall plausibly
  moves a long way.
- The Julia version had to fake water with a constant specific-heat
  approximation because **no industry-standard steam-table library
  (IAPWS-IF97) exists for MTK**. The 25 mK match to Python required
  manually fitting a quadratic over the coolant temperature range — a
  workaround for a missing library, not a paradigm limit.
- The Julia version hand-rolled a fluid-flow connector because **MTK's
  standard library doesn't ship one**. Modelica's standard library handles
  the same case directly.

None of those say "the symbolic-modeling paradigm doesn't work." All three
say "the Julia ecosystem hasn't shipped the piece yet."

**Modelica / Dymola — the wall is real but partly paradigm-shaped, and the
post is honest about that.**

- A 17×17 assembly fits in 397 seconds. A 22×22 doesn't, because the C
  compiler had allocated about 19.9 GB of RAM on 174 MB of generated source
  before being killed. **No Dymola setting moves this** — mitigation would
  need a smaller/faster C compiler.
- The initialization-phase wall *does* respond to ecosystem knobs: turning
  on Dymola's sparse-linear-algebra mode rescues a chain that simply fails
  at default settings (a 5,000-element case: failed → 228 seconds). That
  one is the simulator's choice, not the underlying math.

This is where the claim is honest about its edge: the C-compiler RAM
ceiling really is a *paradigm × toolchain* interaction, not a pure
ecosystem gap. Symbolic models emit large blocks of generated C; large C
costs RAM to compile. Mitigation paths exist (sparser code generation,
lighter-weight C compilers, partial compilation) but they aren't one
missing library.

**Python (netflow) — the wall is the design choice, by definition.**

When you hand-roll the solver, the wall is whatever tool you picked.
`scipy.sparse` plus a Newton iteration tops out around a million unknowns.
That isn't an indictment of Python; it's the cost of opting out of an
ecosystem's bigger machinery in the first place.

## What this is not

- **Not a winner.** Python's 9 ms vs Dymola's 397 s is a category error —
  one is pure math, the other is translating the model + compiling C +
  running the simulator. The interesting axis is *was the problem
  reachable at all*, and *did the bottleneck shift the way the comparison
  predicted*.
- **Not validation.** Every comparison here is code-against-code or
  code-against-a-known-closed-form. None of these were tested against
  measured reactor data — that data is restricted to full-core safety
  analyses we don't have access to.
- **Not generalizable past one machine.** WSL2 on Linux 6.6, Dymola 2026x,
  MTK on Julia 1.11, Python 3.12. One person, one week.

## Source of truth

The depth artifact is the repo's
[`modelica/docs/COMPARISON.md`](https://github.com/greenwoodms06/soul-test-netflow/blob/main/modelica/docs/COMPARISON.md)
(full cross-leg table, scaling stories, per-leg findings). The umbrella
project page is [**soul-test-netflow**](/projects/soul-test-netflow).

If a number reads wrong, the repo invites correction — none of these is
meant to be the final word.

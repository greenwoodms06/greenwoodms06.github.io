---
title: 'soul-test-netflow: three thermal-fluid paradigms on one PWR pin'
summary: The same nuclear-reactor pin / coolant-loop physics, built three different ways on one machine — by-hand Python, Julia's ModelingToolkit, and Modelica/Dymola. The comparison across the three is the deliverable.
date: 2026-05-26
status: archived
tags: [python, julia, modelica, modelingtoolkit, dymola, nuclear, thermal-hydraulics, benchmark, acausal-modeling]
thumbnail: ./images/netflow/three-paradigm-walls.png
repo: https://github.com/greenwoodms06/soul-test-netflow
authorship: human
relatedPosts:
  - netflow-python-episode
  - soultest-julia-mtk-episode
  - modelica-episode
  - three-walls-comparison
---

**What it is.** One physics problem — a uranium-oxide fuel pin, its helium
gap, its cladding, and the high-pressure water flowing past it — solved three
times on the same machine. Each version uses only the standard-library tools
its language ecosystem ships with: no third-party domain libraries, no tuned
commercial extensions.

**Why.** A quick exploration to find out when different tool's performance hits a wall - python, Modelica/Dymola, Julia-MTX. The simulation isn't the deliverable;
the comparison is.

## The three legs

- **`python/` — netflow.** A solver built from scratch in Python. The model
  is a graph: a value sits on each node, a flux flows along each edge.
  Sparse linear algebra (`scipy.sparse`) plus a damped Newton iteration.
  CoolProp's water property tables. **~1342 lines of code.**
- **`julia-mtk/` — soultest-julia.** The same physics on Julia's
  ModelingToolkit (MTK) — an acausal-symbolic modeling library, similar in
  spirit to Modelica. Uses MTK's standard component library, but had to
  hand-roll a fluid-flow connector (the library doesn't ship one yet) and
  use a constant specific-heat approximation for water (no IF97 water
  properties available for MTK). **98 lines of code.**
- **`modelica/` — soultest-modelica.** The same physics in Modelica 4.1 on
  Dymola 2026x, the mature commercial simulator. Uses the Modelica Standard
  Library (MSL) for thermal and fluid connections, and MSL's built-in IF97
  steam-tables water. Driven headlessly from Python. **430 lines of code.**

## Headline

| Axis | Python (netflow) | Julia / MTK | Modelica / Dymola |
|---|---|---|---|
| Solve one fuel pin | **9 ms** (just the math) | 0.064 s at 10,000-cell mesh | 3.7 s (includes translate + compile + run) |
| Match to netflow's baseline temperature | reference | **25 mK** (with matched water properties) | **24.7 mK** matched / 0.34 K with default properties |
| Lines of code | ~1342 | **98** | 430 |
| Full 17×17 PWR fuel assembly | reachable (~190 s) | **never ran — extrapolated 25–40 min just to compile** | **397 s end-to-end, completed** |
| Where each one hits a wall | sparse linear solve around a million nodes | MTK's compile step scales as ~N^1.6 | C compiler chews through ~174 MB of generated source for ~5 min |

## Reading order

Four posts walk the same arc:

1. The Python prototype — building the abstraction by hand.
2. The Julia/MTK rebuild — same physics, 14× less code, then a compile wall.
3. The Modelica leg — the same physics on a mature ecosystem, including the
   full PWR assembly Julia couldn't reach.
4. **The comparison** — same physics, three walls. The claim is that the
   walls trace to ecosystem gaps, not to the paradigm itself.

The repo's [`modelica/docs/COMPARISON.md`](https://github.com/greenwoodms06/soul-test-netflow/blob/main/modelica/docs/COMPARISON.md)
is the depth artifact (full cross-leg table + scaling stories); each leg also
carries its own `CLOSEOUT.md` and `FINDINGS.md`.

## Honest caveats

- **One person, one machine, one week.** No claim that the numbers
  generalize to other hardware.
- **Code-comparison, not validation.** Each leg's strongest claim is "matches
  another solver to X mK" or "matches a known closed-form answer." None of
  these were tested against measured reactor data — that data is restricted
  to full-core safety analyses we don't have access to.
- **The time-axis isn't a race.** Python's 9 ms is just the math; Dymola's
  397 s includes translating the model, compiling C code, and running the
  simulator. The interesting axis is *was the problem reachable at all*, and
  *did the bottleneck shift the way the comparison predicted*.

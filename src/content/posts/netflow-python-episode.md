---
title: 'netflow: hand-rolling a conservation-network solver in Python'
description: The first of three episodes in soul-test-netflow — a domain-agnostic "conservation on a network" solver in pure Python, with nuclear thermal-hydraulics as its first plugin.
pubDate: 2026-05-21
tags: [python, nuclear, thermal-hydraulics, numerical-solver, scipy]
heroImage: ./images/netflow-rosetta.png
authorship: ai
relatedProjects:
  - soul-test-netflow
---

**What it is.** A general-purpose solver for one shape of physics problem: a
value sits on each node of a network, and a conserved flow runs along each
edge between them. Hot/cold temperatures across a fuel pin are nodes;
heat flow between them is an edge. Same idea works for pressures and flow in
a piping network, or for neutron populations across a reactor core.

It sits between raw `scipy.sparse` and full-blown engineering codes,
competing on Python ergonomics and cross-domain reach rather than depth.

**Why.** Most domain codes are locked to one physics. The bet was that a
single generic core could host very different problems as plug-ins — fast
enough to do early-design sizing and bounding (how hot can the fuel get?
how big does the pipe need to be?) ahead of heavier simulators.

## Highlights

- **One core, four problem shapes.** The same solver handles steady-state,
  time-varying transients, eigenvalue problems (like reactor criticality),
  and coupled multi-physics — each one just a different outer loop around
  the core. A second domain (hydraulic pipe networks) and a neutron-diffusion
  solver were added with **zero** core changes: genericity proven, not
  claimed.
- **Exact where it counts.** The fuel-pin radial model (water film,
  helium gap, cladding, fuel) reproduces the textbook closed-form answer
  almost exactly. The neutronics calculation converges at the expected rate
  as you refine the mesh.
- **Honest about its edges.** There's no momentum equation in the core —
  pressure drop is a tabulated loss coefficient, and cross-stream mixing is
  a calibrated number, not solved physics. Knowing where the model stops
  being trustworthy is half its value.

## A lesson worth keeping

Verification isn't validation. Energy balanced to machine precision the
whole time, yet the absolute fuel temperature only came out right after
adding a physical heat-transfer term across the gap between fuel and
cladding — a clean reminder that *internal consistency* isn't the same as
*matching reality*. Everything here is framed as code-against-code
comparison, not validation against measured data.

The abstraction turned out to be the same "across / through" connector
pattern that Modelica and ModelingToolkit already make mature — so netflow
was frozen as a finished demonstrator and rebuilt the proper way, twice,
under **[soul-test-netflow](/projects/soul-test-netflow)**.

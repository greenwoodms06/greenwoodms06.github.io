---
title: 'TRANSFORM'
summary: A Modelica library for system-level dynamic simulation of nuclear and other thermal-hydraulic energy systems — fluid networks, heat transfer, heat exchangers, nuclear kinetics, media, and controls in one reconfigurable package. Started at ORNL in 2017, still moving, Apache-2.0.
date: 2017-08-14
status: active
tags: [modelica, dymola, nuclear, thermal-hydraulics, transform, simulation, ornl]
thumbnail: ./splash.jpg
repo: https://github.com/ORNL-Modelica/TRANSFORM-Library
authorship: ai
---

**What it is.** TRANSFORM — *TRANsient Simulation Framework of
Reconfigurable Models* — is a Modelica library for modeling thermal-hydraulic
energy systems and other multi-physics systems. I started the public repo at
ORNL on 2017-08-14 (the DOE software record is dated 26 Sep 2017) and it has
never really stopped — still active as of August 2026. It is Apache-2.0,
developed against Dymola, and built on the Modelica Standard Library 4.0.0.

**Why.** Whole-system dynamics. A reactor's primary loop, heat exchangers,
kinetics, and controls are one coupled problem, and Modelica treats it that
way: models are equations, not procedures, so you connect components and let
the tool assemble and solve the system. "Reconfigurable" is the point of the
name — swap a pump model, add a loop, change the working fluid, and the rest
of the model comes along.

## What's in the library

The top-level sub-packages, as they sit in `TRANSFORM/`:

| Package | What's there |
|---|---|
| `Fluid` | The core: fluid networks, pipes, volumes, machines (pumps, including homologous-curve turbo pumps), and their examples |
| `HeatAndMassTransfer` | Conduction, convection, and mass-transfer components |
| `HeatExchangers` | Heat exchanger models built from the fluid and heat-transfer pieces |
| `Nuclear` | Reactor kinetics and nuclear-specific components |
| `Media` | Fluid property packages |
| `PeriodicTable` | Element data |
| `Electrical`, `Mechanics` | The non-thermal ends of a plant model |
| `Blocks`, `Controls`, `Math` | Signal blocks, controllers, and math helpers |
| `Types`, `Units`, `Icons`, `Utilities` | Support: types, unit definitions, icons, utilities |
| `Examples`, `UsersGuide` | Worked examples and the in-library guide |
| `Resources` | Images, external includes, a compiled library, data, Python helpers, and reference results |

Regression checks live alongside: the README's "check that the library is
working" step is to run the `runAll_*.mos` scripts, which drive the unit tests
against reference results under `Resources/ReferenceResults`. Fair warning
from the README itself: it takes a while, and you are allowed to make it stop.

The tag history tells the version story in miniature: `v0.1-beta` through
`v0.4-beta`, then a `Before_MSL_4.0` tag marking the move to Modelica Standard
Library 4.0, and `package.mo` now declares version `1.0`.

## Where it has been used

Publications on this site built on TRANSFORM:

- [Demonstration of the Advanced Dynamic System Modeling Tool TRANSFORM in a Molten Salt Reactor Application via a Model of the Molten Salt Demonstration Reactor](/publications#greenwood-transform-msdr-demonstration-2019) — *Nuclear Technology*, 2019
- [Status Report on the MSRE Transform Model for Thermal-Hydraulic Benchmarking](/publications#greenwood-msre-transform-thermal-hydraulic-benchmarking-2019) — ORNL/TM-2019/1359
- [A Frequency Response Approach to Model Validation for the Compact Integral Effects Test Facility in TRANSFORM](/publications#dewet-cietf-frequency-response-validation-2019) — NURETH-18, 2019
- [TRANSFORM – A Vision for Modern Advanced Reactor System-Level Modeling and Simulation Using Modelica](/publications#greenwood-transform-vision-modern-reactor-2020) — ANS Winter Meeting, 2020
- [TRANSFORM: Description and Applications](/publications#greenwood-transform-description-applications-2021) — poster, ORNL Software and Data Expo, 2021
- [Dynamic Thermal Hydraulic Modeling TRANSFORM-ed](/publications#greenwood-dynamic-thermal-hydraulic-transformed-pres-2016) — presentation, 2016
- [Thermo-Fluid Modeling Framework for Supercomputer Digital Twins: Part 1, Demonstration at Exascale](/publications#kumar-thermo-fluid-supercomputer-part1-2024) and [Part 2, Automated Cooling Models](/publications#greenwood-thermo-fluid-supercomputing-part2-2024) — America Modelica Conference, 2024
- [Modeling HFIR's Steady State Heat Transfer Code with Modelica](/publications#barr-hfir-steady-state-modelica-2025) — poster, 2025

Reactors first, then data-center cooling and a research reactor: the same
fluid and heat-transfer components carry over. The repo's
[Publications wiki page](https://github.com/ORNL-Modelica/TRANSFORM-Library/wiki/Publications)
keeps the full list of work built on it.

## Related

- **Training.** The [TRANSFORM-Training](https://github.com/ORNL-Modelica/TRANSFORM-Training) repo is the place to start if you want to learn the library rather than read it.
- **Demo reel.** [TRANSFORM — Get Results!](https://www.youtube.com/watch?v=lEhW7kK8ypw) (first published 2019).
- **Videos.** Two training videos, [A Simple ODE](https://www.youtube.com/watch?v=yN2L_oqN8YQ) and [Simple Heat Transfer Loop](https://www.youtube.com/watch?v=-LWV-svpzGg), and [simulation data on a T-s diagram](https://www.youtube.com/watch?v=RWcYprr90g0), all on the ORNL-VARSA channel.
- **Testing.** [DSTF](/projects/dstf) is the regression harness I built for exactly this kind of library, with Dymola and OpenModelica among its backends.

**Citing it.** Greenwood, M. S. *TRANSFORM — TRANsient Simulation Framework of
Reconfigurable Models.* Computer software. USDOE, 26 Sep. 2017.
doi:[10.11578/dc.20171025.2022](https://doi.org/10.11578/dc.20171025.2022).

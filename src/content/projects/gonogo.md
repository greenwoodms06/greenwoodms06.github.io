---
title: 'GoNoGo'
summary: A modular prerequisite-evaluation (checklist) plugin for Unreal Engine 5 — define sets of conditions that must be satisfied, in any order, grouping, or timing, before a game event fires. Genre-agnostic; works with C++ and Blueprints. 31 architecture decisions, 269 test assertions, ships a five-station launch-demo.
date: 2026-06-04
status: active
tags: [unreal-engine, plugin, varsa, gamedev, blueprint, checklist, ornl]
thumbnail: ./images/gonogo-splash.jpg
repo: https://code.ornl.gov/varsa/unreal/plugins/GoNoGo
authorship: human
---

<video autoplay loop muted playsinline controls>
  <source src="/projects-media/gonogo-splash.mp4" type="video/mp4">
</video>

**What it is.** An Unreal Engine 5 plugin for **checklists** — broadly
construed. A checklist is just *a set of conditions that have to be
satisfied before a game event fires*, and once you say it that way, the
same plugin handles quest prerequisites, crafting recipes, safety/launch
sequences, timed challenges, and hierarchical mission trees. Part of
ORNL's **VARSA** Unreal plugin suite.

**Why.** Every team building a non-trivial game eventually rolls their own
checklist code, and it always ends up entangled with how the conditions
combine (all of these? any 3 of 5? in order?), how time bounds get
enforced, and what each "condition" actually represents. GoNoGo separates
those three axes cleanly so you don't have to.

## The architectural punchline — three composable axes

| Axis | Options |
|---|---|
| **Policy** — how conditions combine | AllRequired · OrderedSequence (Forward/Reverse/Custom) · AnyNOfM · WeightedThreshold |
| **Time constraint** *(optional)* — timing rules | Deadline · TargetTime (4 modes) · RateConstrained · Composite |
| **Condition type** — what each entry represents | Bool (simple flag) · TimedBool (per-condition deadline) · DataAssetChecklist (nested sub-checklist) · ActorChecklist (observe external actor) |

A checklist doesn't know what kind of condition each entry is. A policy
doesn't know about time constraints. The three axes compose independently
— and that's the abstraction the rest of the plugin earns its keep
against.

## What it does well

- **Mix the axes freely.** *"All required, but only if completed within
  60 seconds, where 3 of the items are themselves sub-checklists"* is
  one component plus three drop-downs, not a rewrite.
- **Three setup paths, same plugin.** Inline editor properties for the
  simplest case; **DataAssets** for shared/templated checklists across
  many actors; runtime C++ when you need full control. The component
  swaps between them transparently.
- **Async Blueprint nodes.** `Wait for Checklist Resolved` and
  `Wait for Condition State` are latent nodes that fit the same idiom
  as UE's `Delay` — drop them into a graph, no boilerplate.
- **Save / restore that respects hierarchy.** A checklist with nested
  sub-checklists serializes recursively, and replay on restore suppresses
  external delegates so gameplay listeners don't fire as if the events
  were happening live.
- **DataAsset validation at edit time.** The validator catches null
  policies, duplicate condition IDs, impossible AnyNOfM thresholds,
  phantom IDs in custom orderings, and transitive cycles through nested
  DataAsset references. Invalid assets show red in the Content Browser
  before they break runtime.

## The launch-demo

GoNoGo ships with a **multi-station launch sequence** that exercises
every major feature through a realistic two-attempt scenario. Five
self-contained station actors — Propulsion, Navigation, Safety, Ground
Control, Launch Pad — each own their own checklist. A director actor
orchestrates the sequence with 32 assertions.

- **Attempt 1** progresses through Propulsion and Navigation cleanly, but
  Safety fails (weather + tracking both go down, dropping below the
  3-of-4 threshold) → master No-Go → scrub.
- **Attempt 2** resets everything and runs clean → launch.

Drop an `AGoNoGoLaunchDemo` actor into any level and hit Play. Station
lights flip amber → green/red as conditions land, with audio cues on
each transition.

## Extending

GoNoGo is designed to be extended, not forked. Three extension points,
each a single subclass:

- **New condition type** — subclass `UGoNoGoCondition`. Override
  `CanTransitionTo()`, `OnActivated()`, `CheckTimeConstraint()`.
- **New policy** — subclass `UGoNoGoEvaluationPolicy`. Implement
  `Evaluate()` (required), override the lifecycle hooks as needed.
- **New time constraint** — subclass `UGoNoGoTimeConstraint`, override
  `OnActivated()` / `CheckTimeConstraints()` / `ValidateResolution()`.
- **Custom time source** — implement `IGoNoGoTimeSource` and inject via
  `SetTimeSource()` (so deterministic-time tests and replay can drive
  the clock manually).

## Testing

**269 assertions across 19 test suites**, deterministic — driven by
`UGoNoGoMockTimeSource`, no real-time waits. Drop an
`AGoNoGoTestDriver` into any level and hit Play; results render in the
output log and on screen.

## Design discipline

The plugin's **Design Document** records **31 numbered architecture
decisions** with the rationale for each — the kind of thing you'd
normally find in an ADR log, written out as a single resolved-decisions
table. A few representative ones:

- **#1 Component vs Object.** Hybrid: component wrapper for
  lifetime/Blueprint, UObject internals for testable logic.
- **#5 Nesting model.** Two composition patterns instead of one —
  `DataAssetChecklist` (templated, shared) and `ActorChecklist`
  (observe an external actor).
- **#15 Time architecture.** Policy and `TimeConstraint` are orthogonal
  axes that compose freely — not a single `PolicyWithTimer` mega-class.
- **#28 DataAsset + inline coexistence.** Both paths are always
  available; DataAsset takes precedence when assigned, inline fields
  hide via `EditConditionHides`. Prototype inline, ship via DataAsset.
- **#29 Cycle detection.** Ancestry-path tracking blocks cycles
  (A → B → A) but allows diamonds (B → D, C → D).

This is the *why* behind the *what* — and it's the kind of record that
makes the plugin extensible without forks.

## Documentation in the repo

The repo carries three docs alongside the README: a full **User Guide**
(~480 lines: conditions / policies / time constraints / consumer API /
async nodes / save-restore / worked examples), a **Launch Demo Guide**
(~200 lines: architecture, station roles, customization), and the
**Design Document** (~460 lines: the 31 decisions plus their full
rationale).

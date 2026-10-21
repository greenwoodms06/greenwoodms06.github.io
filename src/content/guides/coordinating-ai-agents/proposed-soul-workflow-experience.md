---
title: "Proposed Soul workflow experience"
description: "Case study: a proposed user experience for requesting, monitoring and inspecting Soul System workflow jobs."
reviewed: 2026-10-21
order: 7
caseStudy: soul-system
authorship: ai
---
Soul should provide a simple way to request a workflow, while a separately packaged runtime executes and records it. Start with explicit invocation for each task. Keep the experience consistent as more host applications and worker types become supported.

Design proposal dated October 21, 2026. All command names, modes, and behavior below are proposed. Nothing here is an existing integration or an installed runtime.

## Responsibilities

| Component | Responsibility |
| --- | --- |
| Host application | Your conversation, task discussion, and presentation of results. |
| Soul skill and bridge | Explain workflow options, submit jobs, display status, and collect decisions. |
| Workflow runtime | Enforce stage order, revision limits, evidence requirements, and job lifecycle. |
| Worker harness | Carry out an assigned implementation or review session using configured tools. |
| Soul records | Preserve approved decisions, provenance, findings, and relevant outcomes. |

LangGraph is a possible controller foundation. Deep Agents is an optional worker or runtime foundation. They are implementation choices behind the user experience, not switches that users must understand to request work. See [runtime and interface choices](/guides/coordinating-ai-agents/repositories-interfaces-and-soul-system).

## Begin with explicit jobs

The first version should work like this:

1. Discuss the problem in your preferred supported host.
2. Settle the specification and acceptance criteria.
3. Invoke the Soul workflow skill and choose a named workflow.
4. Review the proposed job configuration: workspace, stages, worker assignments, checks, and budget.
5. Start the job within the authorization already given for the task.
6. Receive meaningful progress, concrete blockers, and requests for specification decisions.
7. Review the resulting patch and evidence before any separate publishing or deployment action.

Invoking a workflow should not require another approval merely to restate an action already authorized. Pause for missing requirements, genuinely new authority, or a configured human checkpoint.

For example, a hypothetical `/soul-run` invocation could request:

> Use build-and-verify on this approved plan. Codex implements, Claude Code reviews, and a fresh session checks acceptance. Allow two repair rounds. Bring unclear requirements back to me.

The names are examples. An existing skill such as `soul-delegate` could evolve into this interface or remain a focused delegation operation. Review its implementation before choosing a migration or renaming strategy.

## Offer outcomes rather than architecture jargon

Start with two named workflows:

| Workflow | What the user receives | Internal pattern |
| --- | --- | --- |
| Review | Findings tied to the specification and candidate revision. | A review stage, optionally with independent specialist checks later. |
| Build and verify | A candidate patch, review findings, check results, and final acceptance evidence. | Pipeline plus evaluator and optimizer loop, conditional routing, and human checkpoints. |

Ordinary direct work remains available without starting the controller. Add research, competing proposals, or other workflows when a repeated need establishes their value. Users should not have to choose between all architectural patterns for every task.

## Manual choice and automatic recommendations

| Behavior | Proposed meaning |
| --- | --- |
| Direct | The host handles the task without starting an external workflow job. |
| Recommend | Soul proposes a named workflow and explains what it adds; it waits for a choice. |
| Run a named workflow | Use the selected workflow for this job. |
| Automatic selection | A later opt-in feature choosing among supported workflows under explicit rules. |

A manual choice overrides a recommendation. Record the chosen workflow and reason. Automatic selection should initially select from a small registered set; inventing an arbitrary new graph is a different, more complex capability.

## Connection state and active jobs

Keep three concepts separate:

- **Connected:** the host can reach the runtime's tools.
- **Enabled for new work:** Soul may submit jobs under the selected policy.
- **Running:** an existing job has started.

A skill can explain and request a mode change. Durable enforcement belongs in validated settings and the runtime, rather than depending entirely on the model remembering an instruction. Host-specific mechanisms may also hide or disconnect tools.

Disabling future job creation must not silently kill an active job. Expose pause, resume, and cancel separately, with accurate semantics. Cancellation may stop the controller before an already-started external command has finished; report what actually stopped and preserve resulting artifacts.

If the runtime is unavailable, report that limitation. Do not silently present ordinary host work as a completed independently verified workflow.

## Make results inspectable

Every job should identify:

- Approved specification and workflow version.
- Candidate revision or patch identity.
- Worker harnesses, model configuration, and actual stage results.
- Requirement-by-requirement evidence and unresolved findings.
- Check failures, execution errors, and inconclusive outcomes.
- Time, resource budget, and revision count.

Distinguish an agent's claim from observed execution. A job is accepted only when its configured evidence requirements are met. Changes to the specification or candidate invalidate decisions that refer to the previous version.

## Share the system as a usable package

Distribute a versioned runtime package and a small host integration with documented compatible versions. Keep Soul instructions and records as the shared conventions. Avoid requiring users to assemble a full development environment just to try the released tool.

Provide one getting-started path, an example project, a configuration template, and a diagnostic command that checks runtime reachability, host support, worker executables, and required configuration. Start with one tested host; publish a compatibility table before promising parity across others.

Ollama is a model-serving component rather than the conversation interface. A host using a local model and a worker using an existing CLI harness are separate configurations. Support each combination through explicit adapters and representative checks rather than assuming universal compatibility.

## Improve it using recorded failures

Keep a small set of representative tasks and a direct single-agent baseline. Compare verified task outcomes, false acceptance, regressions, human interventions, elapsed time, and cost. Independent verification should earn its added complexity through useful results.

Turn recurring failures into regression cases. Version changes to routing, prompts, and workflow definitions, and evaluate them before release. Keep a known working version available for rollback. Learning from a run can produce a proposed improvement; it should not silently rewrite the acceptance policy during that run.

## First useful release

The proposed initial scope is one supported host, one build-and-verify workflow, existing Claude Code and Codex workers, explicit invocation, bounded repair rounds, a final evidence report, and Soul record integration. Add the review-only workflow when it reuses the same core cleanly. A new UI and automatic workflow selection can wait until usage demonstrates their benefit.

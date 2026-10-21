---
title: "Soul workflow handoff and design decisions"
description: "Case study: the dependency decision and open questions to settle before implementing the proposed Soul workflow runtime."
reviewed: 2026-10-21
order: 8
caseStudy: soul-system
authorship: ai
---
The next session should decide how to implement the proposed experience before choosing dependencies. Deep Agents is a candidate harness, not a predetermined requirement or a synonym for orchestration.

Prepared October 21, 2026. This is a design handoff; no integration has been implemented.

## Dependency decision

The desired workflow is planning, implementation, checks, independent review, bounded repairs, and final acceptance. The proposed experience is described in [chapter 7](/guides/coordinating-ai-agents/proposed-soul-workflow-experience).

Evaluate two concrete implementation paths:

1. A small controller, potentially using LangGraph, invoking existing Claude Code and Codex harnesses.
2. A runtime built with Deep Agents where its supplied tools, context management, and delegation reduce useful implementation work.

The [Deep Agents overview](https://docs.langchain.com/oss/python/deepagents/overview) describes a harness built on LangGraph. Selecting it does not remove the need to implement the desired acceptance policy. Avoid creating a second nested manager merely because both frameworks support delegation.

Separate the runtime package from the Soul plugin integration. A second repository is a proposed default, not a technical requirement. Inspect Soul's actual delegation, hooks, records, and host support before defining the boundary.

## Questions to settle before implementation

| Topic | Required decision |
| --- | --- |
| Execution location | Where do the controller and workers run: local machine, remote host, or cloud sandbox? How does the host reach them? |
| Worker integration and authentication | Invoke full coding harnesses or model APIs? Which supported credentials, account permissions, and access methods apply to each? |
| Specification and evidence | What makes a requirement accepted, failed, or inconclusive? Which actual checks support the decision? |
| State and recovery | What survives a crash? How are existing external jobs detected before retrying edits or other side effects? |
| Source ownership | Which revision is each worker reviewing? Who integrates changes and writes shared Soul records? |
| Authority boundaries | What files, tools, network destinations, and external actions can each role access? Which human decisions are required? |
| Cost and stopping | What limits time, model usage, retries, nested delegation, and repair rounds? |
| Portability and release | Which host and operating system are tested first? How are runtime, plugin, and workflow versions matched and rolled back? |

Model access is not the same as automation access. A working interactive login does not establish every SDK or runtime's supported authentication path. Verify each selected integration's current documentation rather than assuming one subscription or credential covers all workers.

LangGraph can persist graph state, but the application still needs to reconcile external work. An in-memory checkpointer loses state on restart; choose persistent storage when recovery is required. [Persistence documentation](https://docs.langchain.com/oss/python/langgraph/persistence)

## Topics that deserve deliberate attention

**Verification independence.** Different model names do not guarantee independent errors. Make reviewers work from the approved requirements, preserve reproducible findings, and include checks outside the implementer's own assertions. Compare the added review process with a direct single-agent baseline.

**Trust in inputs and reusable instructions.** Repository files, tool output, and retrieved pages can contain instructions. Define which sources may change requirements or grant authority. Map Soul skill and hook behavior to the selected host; copying text does not reproduce enforcement.

**Data and memory.** Decide what enters model requests, traces, persistent memory, and shared reports. Store project-specific evidence separately from general reusable guidance. Keep credentials out of committed configuration and exported records.

**Experience during failure.** Show useful progress, explain blocked and inconclusive states, and make pause, resume, and cancel distinct. A controller unavailable error must not turn into an unannounced downgrade of verification.

**Improvement process.** Save recurring failures as regression cases. Version workflow and prompt changes, evaluate before release, and retain a working version. Do not let a running job silently weaken its own acceptance rules.

## Prompt for the next session

> Read this guide, especially chapters 6, 7, and 8, as design proposals. Inspect Soul System's current implementation, particularly soul-delegate, host integrations, verification hooks, and project records. Establish which behavior already exists and what can be reused. Compare a small controller around existing Claude Code and Codex harnesses with a Deep Agents-based runtime. Recommend the smallest architecture that supports the proposed experience, identify repository and package boundaries, and document the evidence for dependency choices. Define a first milestone using one supported host, explicit invocation, bounded repairs, and an acceptance report. Include execution location, authentication, permissions, recovery, candidate revisions, cost limits, and a representative evaluation. Produce the architecture decision and implementation plan before broad implementation.

## Transfer the guide to the next environment

A cloud session should not be assumed to have access to local files. Give it this guide's address, or attach the documents or copy them into the repository or workspace that session can actually read. The [index](/guides/coordinating-ai-agents) provides the reading order.

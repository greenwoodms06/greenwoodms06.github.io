---
title: "A development workflow with LangGraph"
description: "A proposed plan, implement, check, review and verify workflow built with LangGraph, followed step by step through one task."
reviewed: 2026-10-21
order: 4
authorship: ai
---
LangGraph can coordinate a plan, an implementer, a reviewer, and a final verifier. You define the steps and the rules connecting them. Each agent then works within its assigned step, using its own tools and model.

The workflow below is a proposed design, not an installed or tested application.

## Begin with a concrete task

Suppose you want to add CSV export to a task application. You and a planning agent turn the request into four requirements:

| Requirement | Expected behavior | Example acceptance check |
| --- | --- | --- |
| R1 | Export only records belonging to the signed-in user. | Alice's export contains none of Bob's records. |
| R2 | Apply the status filter selected in the interface. | Selecting completed exports only completed tasks. |
| R3 | Preserve commas, quotation marks, and line breaks in titles. | Parse the exported CSV and recover each original title. |
| R4 | Use the agreed header names and order. | The first row is exactly the approved header list. |

You must settle ambiguous choices before implementation: which columns, whether the current page or all filtered records are exported, and what happens when there are no matches. The agent should surface those questions instead of silently choosing requirements.

## Understand the three LangGraph concepts

**State** is the shared job record. **Nodes** are functions that perform steps. **Edges** decide which step runs next. Nodes can call agents, invoke ordinary programs, or wait for human input. [Graph API documentation](https://docs.langchain.com/oss/python/langgraph/graph-api)

For this example, state might contain the approved specification, plan version, repository revision, candidate patch identifier, test evidence, review findings, and remaining revision budget. The controller gives each worker the relevant subset rather than forwarding every conversation.

## Follow the workflow

### 1 Develop and approve the plan

Discuss the task with a planning agent. It proposes implementation steps and acceptance checks. You revise it until it describes the intended outcome.

A plan node saves the draft. A human decision node pauses for your approval, edits, or clarification. LangGraph's [interrupt mechanism](https://docs.langchain.com/oss/python/langgraph/interrupts) supports pausing and resuming with external input. Use a checkpointer and a stable thread identifier; choose persistent storage if the job must survive process restarts.

Approval fixes a specification version. Later ambiguity returns to planning. Changing the specification invalidates earlier acceptance decisions and requires the candidate to be checked against the updated version.

### 2 Invoke the implementer

The implementation node calls a coding harness, such as Codex or Claude Code, in a restricted workspace. Its task is to satisfy R1 through R4 and the approved plan.

The worker returns a candidate patch or commit, an explanation, and any checks it ran. The controller records the actual patch identity. The worker's statement that tests passed is an assertion to check, rather than the final acceptance result.

Example instruction:

> Implement specification version 1. Return the candidate revision, changes by requirement, test commands and results, and unresolved questions. If the requirements conflict, report the conflict.

### 3 Run automatic checks

A normal program runs the agreed checks against that candidate: regression tests, export integration cases, and relevant static checks. This node need not use an AI model.

Record command exit status, output, and the candidate revision. A failed check returns actionable feedback to implementation. Missing credentials, unavailable dependencies, or runner failures produce a blocked or inconclusive result; they do not count as passing or necessarily indicate a code defect.

### 4 Ask a reviewer to challenge the implementation

Start a separate reviewer session with the approved requirements, candidate diff, relevant code, and check results. Its job is to look for a concrete mismatch with the specification.

For example, the reviewer discovers that the interface displays completed tasks, but the export request omits the status filter. Existing tests check the CSV format and miss R2.

Useful finding:

> R2 fails: select completed, then export. The downloaded file includes an open task. The export request does not send the selected status.

The controller sends that finding to the implementer. The implementer changes the request and adds a regression case. Checks and review run again on the new candidate.

Pushback should identify evidence or a testable concern. It should not be a requirement to invent criticism or keep a debate going.

### 5 Invoke a final acceptance verifier

After checks and review pass, a fresh session evaluates the candidate against the original approved requirements. Give it the requirements, candidate, and evidence; have it form its checklist before relying on prior reviewers' conclusions.

The reviewer primarily examines implementation defects. The final verifier examines whether each requested behavior is supported by evidence. This separation is a proposed review discipline, not a guarantee that two agents will make independent errors.

For the CSV task, the verifier tests Alice and Bob, the status filter, special characters, and the header order. It returns a requirement-by-requirement table with pass, fail, or inconclusive and a reference to each check. Give it read access to the candidate; any new tests run separately without modifying the proposed patch.

If a defect is found, return to implementation within the budget, then repeat checks, review, and final verification. If a requirement is unclear, return to you. If the budget is exhausted, pause with the evidence and unresolved issue.

### 6 Deliver a reviewable result

Return the patch, specification version, acceptance table, check results, and known limitations. Passing this workflow means the configured acceptance process completed; it is not proof of all possible correctness. Publishing or deploying can remain a separate step.

## Map the architecture

| Part of this design | Architectural pattern |
| --- | --- |
| Plan, implementation, checks, review, acceptance | Prompt chaining or pipeline. |
| Implementation followed by criticism and revision | Evaluator and optimizer. |
| Passing, failing, unclear, and exhausted outcomes | Conditional routing. |
| Pausing for approval or specification clarification | Human in the loop. |
| Optional simultaneous specialist reviews | Parallelization. |
| Optional manager creating new subtasks and choosing workers | Orchestrator and workers. |

The base workflow is a pipeline with a revision loop and human checkpoints. It does not need a model-based manager. Add one when task decomposition must change dynamically. These patterns have implementations in LangGraph's [workflow tutorial](https://docs.langchain.com/oss/python/langgraph/workflows-agents).

![Flowchart of the proposed workflow. Develop plan leads to your decision: revise returns to the plan, approve leads to implement candidate, then run checks. Checks that pass go to independent review; checks that fail go to a revision-budget decision; inconclusive checks pause with unresolved issues. Review that passes goes to final acceptance verification; a defect goes to the budget decision; an unclear requirement returns to your decision. Verification that passes delivers the patch and evidence; a defect goes to the budget decision; an unclear or inconclusive result pauses. If budget remains, work returns to implementation; if not, it pauses with unresolved issues.](./langgraph-workflow.svg)

## What you actually build

The architecture is a design pattern, not a product you must install. LangGraph is one optional framework for implementing it. You can instead use another framework, adapt a suitable example repository, or write a small controller directly.

For Python, the documented base installation is `pip install -U langgraph`, normally inside your project's virtual environment. Installing the library gives you building blocks; you still define or adapt the workflow and connect its workers. Cloning LangGraph's own repository is unnecessary for ordinary package use. Cloning a separate example application is an alternative starting point, subject to that application's setup instructions. [Installation documentation](https://docs.langchain.com/oss/python/langgraph/install)

Start with a small Python or TypeScript controller and the LangGraph library. Define a state schema, implement the node functions, connect normal and conditional edges, attach a checkpointer, compile, and invoke the graph. [Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api), [persistence](https://docs.langchain.com/oss/python/langgraph/persistence)

The routing logic can be this simple pseudocode:

```text
approve or revise the plan
while revision budget remains:
    create a candidate
    run checks against that candidate
    if execution is inconclusive: pause
    if checks fail: send evidence back and continue
    review the candidate against the specification
    if requirements are unclear: return to planning
    if review finds a defect: send evidence back and continue
    verify every requirement against the candidate
    if verification is inconclusive: pause
    if verification finds a defect: send evidence back and continue
    deliver candidate and evidence
    stop
pause with unresolved issues
```

The application must validate agent output and enforce routing, budget, permissions, and completion rules. Unexpected output is an error to handle, not an implicit approval.

## Where the harness fits

An implementation node can call the [Codex SDK](https://developers.openai.com/codex/sdk), or invoke [Claude Code programmatically](https://code.claude.com/docs/en/headless). That harness manages its own inner loop of reading files, editing, and running tools. LangGraph manages the outer loop between implementation, review, and acceptance.

Write a small adapter around each harness. It starts or resumes the appropriate session, supplies a workspace and prompt, applies tool permissions, collects structured output and process errors, and returns a common result format. Treat timeouts and cancellation explicitly. A successful CLI exit means the command completed; it does not establish that the feature satisfies R1 through R4.

Resume the implementer's session for repairs when useful. Give reviewers and final verifiers separate sessions and scoped access. When changing the candidate, discard acceptance decisions tied to the previous revision.

For replay and recovery, remember that LangGraph checkpoints do not roll back external file edits or CLI sessions. Interrupted nodes can restart from the beginning. Keep pause nodes separate from file mutations and make external jobs resumable or safe to repeat using recorded operation identifiers. [Interrupt rules](https://docs.langchain.com/oss/python/langgraph/interrupts)

See [the harness comparison](/guides/coordinating-ai-agents/agent-harness-comparison) for other worker and interface options, and [sandbox guidance](/guides/coordinating-ai-agents/sandboxes) for the execution boundaries.

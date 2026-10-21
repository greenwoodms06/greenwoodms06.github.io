---
title: "Open source workflow solutions"
description: "LangGraph, Langflow and Microsoft Agent Framework compared as starting points for orchestrating agents, with a suggested first experiment."
reviewed: 2026-10-21
order: 2
authorship: ai
---
Established projects already implement the common collaboration patterns. The useful choice is between an explicit orchestration library, a visual authoring environment, and a framework with predefined team orchestrations. These categories overlap.

For higher-level starting points, including Deep Agents and Open SWE, and reusable interfaces, see [repositories and interfaces](/guides/coordinating-ai-agents/repositories-interfaces-and-soul-system) in the project case study. The options below primarily compare workflow authoring and orchestration.

## Three projects worth investigating

| Project | What it supplies | Suggested fit | Work you still supply |
| --- | --- | --- | --- |
| LangGraph | A graph runtime and examples of common workflow patterns. | Learning the architecture and building precise coordination. | Task logic, agent integrations, tools, and evaluation. |
| Langflow | A visual editor, templates, a testing Playground, and an assistant for authoring flows. | Exploring workflows interactively with less initial code. | Appropriate components, execution boundaries, and task-specific checks. |
| Microsoft Agent Framework | Agent abstractions, provider integrations, and predefined multi-agent orchestrations. | Trying structured teams and a dynamic coordinating manager. | Worker definitions, permissions, integration details, and acceptance criteria. |

All three repositories identify their core projects as MIT licensed: [LangGraph](https://github.com/langchain-ai/langgraph), [Langflow](https://github.com/langflow-ai/langflow), and [Microsoft Agent Framework](https://github.com/microsoft/agent-framework). Their public repositories, maintained documentation, examples, and identifiable maintainers justify investigating them as established candidates. That is not a comparative quality ranking. Open source software can still incur model, hosting, or optional service charges.

## LangGraph matches the architectural guide closely

Its official [Workflows and agents tutorial](https://docs.langchain.com/oss/python/langgraph/workflows-agents) includes code for prompt chaining, parallelization, routing, orchestrator and workers, and evaluator and optimizer loops. This is the closest match to a reusable implementation of the patterns in Anthropic's article.

| Anthropic pattern | LangGraph implementation in the tutorial |
| --- | --- |
| Prompt chaining | Successive nodes with an intermediate check. |
| Parallelization | Multiple branches and an aggregation step. |
| Routing | A decision selects the next branch. |
| Orchestrator and workers | A planner dispatches dynamically created worker tasks. |
| Evaluator and optimizer | An evaluation directs revision or completion. |

The examples are starting points. A report-writing worker does not become a reliable coding worker merely by changing its prompt.

For manual control, [interrupts](https://docs.langchain.com/oss/python/langgraph/interrupts) can pause execution for input and resume from saved state. Persistent recovery requires a suitable checkpoint store. LangGraph is an orchestration library rather than a complete coding-team desktop application.

## Langflow provides a visual environment

The [Playground](https://docs.langflow.org/concepts-playground) lets you invoke compatible flows through chat, inspect tool activity, and respond to human-input prompts. Flows with other inputs can be triggered through the API.

[Langflow Assistant](https://docs.langflow.org/langflow-assistant) can propose complete flows or components from natural-language requests and help revise the current canvas. It requires a tool-capable model; its documentation warns that small local models may fail to call tools reliably.

This is a concrete example of assisted workflow construction. It is different from a manager that continuously chooses a development team's next action during execution. Langflow also documents [using agents as tools](https://docs.langflow.org/components-agents), enabling a coordinating agent to invoke other agents.

Do not assume Langflow is a visual front end for LangGraph, or that every tutorial graph can be imported directly between them. Treat them as separate projects with their own execution models.

## Microsoft Agent Framework supplies team orchestrations

Its [orchestration documentation](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/) lists sequential, concurrent, handoff, group chat, and Magentic patterns, with human interaction through approvals or information requests. Its [provider documentation](https://learn.microsoft.com/en-us/agent-framework/agents/providers/) includes OpenAI, Anthropic, and Ollama, although supported features differ by provider and language.

[Magentic orchestration](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic) is particularly relevant to a manager deciding what happens next. It selects workers, tracks progress, and replans. It exposes limits on coordination rounds, stalls, and plan resets, and supports human plan review. The documentation marks some types experimental and explicitly cautions that performance outside the original Magentic-One design is untested. A built-in manager is therefore a useful implementation to evaluate, rather than assurance of effective coordination on arbitrary tasks.

AutoGen remains useful background, but its [repository](https://github.com/microsoft/autogen) now identifies it as being in maintenance mode and directs new users toward Agent Framework.

## Manual selection and automatic coordination

Three different capabilities can sound like an orchestrator suggesting what to do:

1. **Manual selection:** You invoke a chosen workflow and inspect its results.
2. **Assisted construction:** An assistant proposes or modifies a workflow before you run it.
3. **Dynamic coordination:** A manager chooses workers and next actions during a run.

Langflow's Playground and Assistant address the first two. Magentic addresses the third. LangGraph gives developers primitives to implement controlled routing and coordination.

For a recommendation-only manager, expose bounded options such as investigate, implement, review, or stop. Have it return a proposed action and evidence for your decision. For an executing manager, validate the proposed action against permissions, budget, and acceptance rules before dispatch. These are proposed designs, not universal built-in features across the projects.

## Suggested first experiment

Use LangGraph's tutorial as the architectural reference. Choose Langflow first if visual exploration is the priority; choose Agent Framework if trying its predefined team orchestrations is the priority.

Start with a bounded bug and this proposed workflow:

1. Record the expected behavior and a reproduction.
2. Invoke one implementer, optionally through an existing coding-agent SDK.
3. Give a separate reviewer the requirements and resulting patch.
4. Run regression and relevant integration checks in a restricted execution environment.
5. Return reproducible failures to the implementer within a fixed revision budget.
6. Present the patch, evidence, and unresolved concerns for review.

Keep an option to invoke review or testing manually. Add a manager after this workflow works reliably. Assign local models bounded jobs only after measuring their performance on representative inputs.

A shared record should identify the repository revision, patch, requirements, findings, test results, and remaining budget. File paths alone are insufficient when workers may be operating on different revisions.

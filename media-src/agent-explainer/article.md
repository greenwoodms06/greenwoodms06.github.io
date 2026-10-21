# How AI models and agents work together

Using Claude, Codex, and a local model together sounds like a way to build a stronger development team. The practical question is how to give them useful responsibilities, connect their work, and tell whether they achieved the goal.

Start by separating the model, the software around it, and the workflow coordinating the participants. Those are different choices. You can reuse existing coding tools while adding a review process, or adopt a more complete application instead of building the surrounding machinery yourself.

## Understand the pieces

The terminology varies between projects, but these working definitions provide a useful map:

| Term | What it means |
| --- | --- |
| Model | The system generating responses, such as a Claude or Llama model. |
| Agent | A system in which a model chooses actions, uses tools, and responds to results. |
| Harness | The software managing the agent loop, context, tools, and sessions. |
| Orchestrator | The component coordinating steps, workers, and stopping rules. It can use ordinary code or model decisions. |
| Interface | Where you interact: a terminal conversation, editor, or browser application. |
| Sandbox | An execution boundary restricting what commands or processes can access. |

When you launch a coding application in a terminal, the interactive conversation is its terminal user interface, or TUI. The harness is the machinery underneath it. OpenAI describes Codex's app, CLI, and editor integration as different experiences powered by its underlying harness. [Codex platform explanation](https://developers.openai.com/blog/codex-as-a-platform)

Skills supply reusable instructions and resources. Tools supply operations such as reading files or running commands. An inference server such as Ollama serves a model; it is a different component from the application through which you converse with an agent.

Several agents can use the same model. One agent can also use different models. Counting model names does not tell you how the work is organized.

## Choose a workflow before choosing a framework

Anthropic distinguishes workflows that follow predefined paths from agents that choose their next actions dynamically. A predictable outer workflow can still contain agents that work autonomously inside individual steps. [Building effective agents](https://www.anthropic.com/research/building-effective-agents)

Common patterns describe how those steps connect:

| Pattern | Example |
| --- | --- |
| Pipeline or prompt chaining | Turn requirements into a plan, then a patch. |
| Routing | Send a task to a suitable specialist. |
| Parallelization | Run separate checks or collect independent attempts. |
| Orchestrator and workers | Let a coordinator divide a problem and combine worker results. |
| Evaluator and optimizer | Use criticism to guide repeated revision. |

These patterns can be combined. LangGraph's official tutorial includes implementations of all five. [Workflow examples](https://docs.langchain.com/oss/python/langgraph/workflows-agents)

You do not need a manager agent simply to decide whether a failed test should lead back to implementation. Ordinary rules can control that transition. Model-based coordination becomes useful when the task requires deciding what work exists or which specialist should act next.

## Follow one development task

Imagine adding CSV export to a task application. Before implementation, agree that the export must contain only the signed-in user's records, respect the selected status filter, preserve special characters, and use specified columns.

A proposed workflow is:

1. **Plan.** Resolve ambiguities and record the acceptance criteria.
2. **Implement.** A coding agent creates a candidate patch.
3. **Check.** An ordinary test runner exercises the candidate and records results.
4. **Review.** A separate agent examines the implementation against the requirements.
5. **Repair.** Concrete defects return to implementation within a fixed revision budget.
6. **Verify acceptance.** A fresh session checks the final candidate against each original requirement.

Suppose the first patch produces valid CSV, but exports every status. The reviewer reproduces the problem: choosing completed tasks still downloads open tasks. That finding points to a specific requirement and an observable failure.

After repair, the final verifier checks the filter, user ownership, special characters, and columns. Its report links each result to evidence from the actual candidate. A test that could not run is inconclusive, not passing.

This combines a pipeline, an evaluator–optimizer loop, conditional routing, and human decisions when requirements are unclear. The reviewer looks for defects; the final verifier checks coverage of the agreed behavior. A different session can reduce shared conversational assumptions, but does not guarantee independent judgment.

## Measure success through evidence

A group of agents can reinforce a mistaken answer. The CONSENSAGENT paper examines this form of sycophancy across reasoning benchmarks. It supports caution about treating consensus as correctness; it does not establish the best configuration for every software project. [ACL 2025 research](https://aclanthology.org/2025.findings-acl.1141/)

For development, ask for reproducible findings, observed test results, and a clear connection between each requirement and its checks. Keep failures and uncertainty visible. Passing checks provide evidence about the behavior they exercise, rather than proof of complete correctness.

Compare the workflow with a single-agent baseline on representative tasks. Count useful outcomes, human intervention, cost, and elapsed time. Additional participants should justify their coordination overhead.

## Reuse the right level of software

You can start at several levels:

| Project | What it supplies |
| --- | --- |
| LangGraph | Building blocks for stateful workflows and transitions. |
| Deep Agents | A reusable harness built on LangGraph, with tools, context handling, and delegation. |
| Deep Agents Code | A terminal coding application built on the Deep Agents SDK. |
| Agent Chat UI | An existing browser interface for compatible agent servers. |

[LangGraph documentation](https://docs.langchain.com/oss/python/langgraph/graph-api), [Deep Agents](https://docs.langchain.com/oss/python/deepagents/overview), [Deep Agents Code](https://docs.langchain.com/oss/deepagents/code/overview), [Agent Chat UI](https://github.com/langchain-ai/agent-chat-ui)

Installing a library does not create the workflow or connect it to your preferred application. You still configure the agents, define the transitions, and provide an entry point. A script, API, or tool connection can expose that entry point without requiring an entirely new interface.

Calling a model API also differs from invoking a full coding harness. Model support alone does not mean a framework starts Claude Code or Codex sessions. Those integrations need their own adapters.

A larger application may supply more of the system. Open SWE is one example, but its current README warns of breaking changes and says deployment as-is requires Managed Deep Agents. Check the actual setup before treating an existing repository as a drop-in solution. [Open SWE](https://github.com/langchain-ai/open-swe)

## Keep execution boundaries separate from verification

An orchestrator coordinates work. A sandbox constrains execution. An evaluation assesses results.

For agent-controlled commands, a sensible starting point is restricted execution with only the files and services the task needs. Unfamiliar code or unattended work can justify stronger isolation. Text-only exchanges with no executable tools do not need an additional code-execution environment.

Check what a sandbox actually covers: shell commands, the whole agent process, or a larger environment. Writable files can still be changed; permitted network access can still transmit accessible data. Anthropic's isolation guide describes these distinctions and their limits. [Sandbox environments](https://code.claude.com/docs/en/sandbox-environments)

For a first experiment, choose one bounded task, an implementer, a separate reviewer, and a test runner. Add final acceptance verification when the task warrants it. Keep revision limits, preserve the candidate's identity, and make the evidence easy to inspect. Let measured results guide the next addition.

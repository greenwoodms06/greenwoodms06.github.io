---
title: "Vocabulary and collaboration patterns"
description: "Working definitions for models, agents, harnesses, orchestrators, interfaces and sandboxes, and the common patterns for connecting agents."
reviewed: 2026-10-21
order: 1
authorship: ai
---
Coordinating Claude, Codex, and a locally served Llama model is an example of multi-agent orchestration across providers when each participant has its own agent loop. Merely sending a prompt to several models is a multi-model workflow. Both can be useful.

## The components

These are working definitions. Vendors use agent, harness, and framework with some overlap.

| Term | Meaning | Example |
| --- | --- | --- |
| Model | The system that generates responses from its input. | A Claude or Llama model. |
| Inference server | Software that serves model predictions to applications. | Ollama running a local model. |
| Agent | A system in which a model chooses actions, uses tools, and reacts to results. | A coding agent editing a patch and rerunning tests. |
| Tool | An operation exposed to an agent. | Read a file or run a test command. |
| Skill | Reusable task instructions and supporting resources. | A repository review procedure. |
| Harness | Software managing the agent loop, context, tools, permissions, and session. | The execution machinery around a coding model. |
| Workflow | Steps and transitions that coordinate work. | Implement, review, test, revise. |
| Orchestrator | The component assigning work and controlling transitions. | A controller dispatching workers and gathering results. |
| Framework or SDK | Reusable software for implementing these components. | LangGraph or the Codex SDK. |
| State | Information carried between steps. | Requirements, patches, findings, and test results. |
| Sandbox | A technically enforced execution boundary. | Restrict writes to a project and limit network access. |
| Evaluation | Repeatable assessment against success criteria. | Regression cases for a bug fix. |
| Trace | A record of execution events and results. | Tool calls, handoffs, errors, and timing. |

Anthropic distinguishes workflows following predefined paths from agents choosing their own actions. A fixed workflow can contain several autonomous agents. [Architectural guide](https://www.anthropic.com/research/building-effective-agents)

## Common collaboration patterns

| Pattern | How work proceeds | Development example |
| --- | --- | --- |
| Prompt chaining or pipeline | Each stage uses earlier output. | Requirements become a plan, then a patch. |
| Routing | A decision directs work to a suitable specialist. | Documentation questions go to a research worker. |
| Parallelization | Independent tasks run concurrently. | Separate reviewers examine performance and correctness. |
| Orchestrator and workers | A coordinator creates subtasks and combines results. | A migration is divided among affected modules. |
| Evaluator and optimizer | Feedback drives repeated revision. | A reviewer identifies a defect; the implementer repairs it. |

These five patterns appear in [Anthropic's guide](https://www.anthropic.com/research/building-effective-agents). Parallel execution may divide a task or collect separate attempts at the same task. Debate adds exchanges between participants; an ensemble can compare attempts without a debate.

## Models and existing agents are different integration targets

A model API supplies inference. Your application must supply the tools, loop, and execution policy. An agent SDK can expose an existing agent runtime: the [Claude Agent SDK](https://code.claude.com/docs/en/agent-sdk/overview) provides Claude Code's agent capabilities, and the [Codex SDK](https://developers.openai.com/codex/sdk) controls Codex agents programmatically.

Consequently, a framework supporting OpenAI model calls does not automatically integrate the full Codex coding agent. A provider connection and an agent-runtime integration require different wiring.

[MCP](https://modelcontextprotocol.io/docs/getting-started/intro) standardizes connections to tools and external systems. It can expose a workflow as a tool, but the workflow still needs its own coordination rules.

## Correctness and agreement

Agents agreeing does not establish correctness. CONSENSAGENT documents agents reinforcing one another's answers in reasoning tasks, and evaluates a mitigation across six datasets and three models. Its results do not establish which configuration performs best on a particular repository. [ACL 2025 paper](https://aclanthology.org/2025.findings-acl.1141/)

For development, use explicit requirements, independent review where useful, reproducible findings, and tests. Keep unresolved concerns visible. A passing test suite provides evidence about the behaviors it exercises, rather than proof of complete correctness.

Compare a team with a single-agent baseline on the same tasks, including cost and elapsed time. More participants are justified when the additional coordination produces a useful improvement.

---
title: "Where agent harnesses fit"
description: "How coding harnesses such as Claude Code, Codex and OpenCode fit as workers under an orchestrator, and three concrete configurations."
reviewed: 2026-10-21
order: 5
authorship: ai
---
LangGraph can coordinate workers that use existing coding harnesses. Choosing a harness selects the software around a model: its tools, context handling, sessions, and interaction style. Choosing an orchestrator selects how work moves between those workers.

Suggested roles below are integration examples, not measured quality rankings. No listed integration has been built for this guide.

The interactive terminal screen is a terminal user interface, or TUI. The harness is the agent execution machinery underneath. For this distinction, ready-made applications built on LangGraph, and Soul System integration, see [repositories and interfaces](/guides/coordinating-ai-agents/repositories-interfaces-and-soul-system) in the project case study.

The name OpenCLA is interpreted here as OpenClaw, a likely match to the question. Hermes means Nous Research's Hermes Agent, rather than the Hermes model family.

## Compare the main categories

| Category | Examples | Main responsibility |
| --- | --- | --- |
| Model | Claude, GPT, Llama | Generate responses and action proposals. |
| Inference server | Ollama | Serve model inference. |
| Coding harness or agent runtime | Claude Code, Codex, OpenCode | Turn model proposals into an ongoing coding session with tools. |
| Broader assistant runtime | Hermes Agent, OpenClaw, goose | Combine tools, sessions, and broader assistant workflows. |
| Orchestration framework | LangGraph, Microsoft Agent Framework | Coordinate steps and participants. |
| Visual workflow environment | Langflow | Author and inspect workflows interactively. |
| Execution boundary | OS sandbox, container, VM | Restrict what execution can access. |

These categories overlap. A coding harness can launch subagents, and an assistant runtime can delegate to an external coding harness. Pick one component to own the outer workflow so that retries, stopping rules, and task state have a clear owner.

## Product comparison

| Product | What it is | Automation surface or documented capability | Possible role in the example workflow |
| --- | --- | --- | --- |
| Claude Code | Anthropic's coding agent and harness. | Noninteractive CLI with `claude -p`; Python and TypeScript Agent SDKs. | Implementer or separately configured reviewer. [Documentation](https://code.claude.com/docs/en/headless) |
| Codex | OpenAI's coding agent, usable through CLI and other clients. | Codex SDK for programmatic agent sessions. | Implementer or acceptance verifier with restricted tools. [Documentation](https://developers.openai.com/codex/sdk) |
| OpenCode | Coding agent with configurable primary agents and subagents. | Server and JS/TS SDK; built-in Plan and Build agents. | Alternate implementer or dedicated review worker. [Agents](https://opencode.ai/docs/agents/), [SDK](https://opencode.ai/docs/sdk/) |
| Hermes Agent | Nous Research's broader assistant runtime with memory, skills, and delegation. | Noninteractive CLI queries, selectable toolsets, multiple model providers, and subagents. | Research worker or persistent project assistant. [Project](https://github.com/NousResearch/hermes-agent), [CLI](https://hermes-agent.nousresearch.com/docs/user-guide/cli) |
| OpenClaw | Assistant platform with its own agent runtime, sessions, and channel delivery. | Can delegate to external harnesses through ACP; also documents native Codex integration. | User-facing entry point or delegating assistant. [Runtime](https://docs.openclaw.ai/concepts/agent), [external agents](https://docs.openclaw.ai/tools/acp-agents) |
| Gemini CLI | Google's terminal agent. | Headless mode with text, JSON, and streaming JSON output. | Another coding or review worker via a CLI adapter. [Documentation](https://geminicli.com/docs/cli/headless/) |
| Cline | Coding agent available in editor, terminal, and desktop interfaces. | CLI automation and an SDK exposing the agent core. | Interactive development interface or automated worker. [Documentation](https://docs.cline.bot/cline-overview) |
| OpenHands | Software engineering agent platform and SDK. | Python and REST APIs, agent tools, and local or remote agent execution. | Coding worker or an alternative foundation for the coding-agent layer. [SDK](https://docs.openhands.dev/sdk) |
| Aider | Terminal pair-programming tool with repository integration. | Works with cloud and local models. | A focused coding tool, with an adapter needed for the chosen automation interface. [Project](https://github.com/Aider-AI/aider) |
| goose | General-purpose agent with coding and workflow capabilities. | Desktop, CLI, and API; multiple model providers and MCP extensions. | Development or research worker, or a broader assistant interface. [Project](https://github.com/aaif-goose/goose) |

## Concrete configurations

### Keep the coding tools you already use

Use LangGraph for the outer workflow, Codex through its SDK for implementation, Claude Code in a separate session for review, a normal test runner for checks, and another fresh configured agent session for final verification.

This arrangement preserves each coding tool's inner agent loop. It requires adapters, shared artifacts, permission configuration, and explicit handling of agent errors. Role assignments are examples; they do not claim that a particular vendor is intrinsically the better implementer or reviewer.

### Use one harness with different models

Use OpenCode for several worker roles, each with separate sessions and instructions. OpenCode documents per-agent configuration and [local model connections through Ollama](https://opencode.ai/docs/providers/). This can simplify the integration surface while retaining model diversity. A model working with chat does not establish reliable tool use for a coding task.

### Put a persistent assistant in front

Hermes Agent or OpenClaw can be the assistant you interact with. A proposed design exposes a bounded development workflow through a tool or service, with LangGraph retaining control of that job's steps. Alternatively, use the assistant's own delegation features and omit LangGraph when they satisfy the requirements.

OpenClaw specifically documents invoking external coding harnesses using ACP. Its native runtime and an external harness are separate execution paths. Avoid assuming that choosing a model in OpenClaw is equivalent to starting Claude Code or Codex.

Hermes documents persistent memory and skill creation. Those features store and reuse information; they are not evidence that model weights are retrained or that project correctness improves automatically.

## Three integration terms

**Headless CLI** means running without an interactive terminal interface. The controller launches a process, supplies input, and collects output and errors. It needs reliable session targeting and output parsing.

**SDK or API** means controlling a runtime through a programming interface. This often makes session and event handling more structured, but does not automatically implement your review policy.

**ACP**, the Agent Client Protocol, standardizes communication between coding agents and clients such as editors. **MCP** standardizes access to tools and external systems. Neither by itself defines whether an implementer must pass independent review. [ACP introduction](https://agentclientprotocol.com/get-started/introduction), [MCP introduction](https://modelcontextprotocol.io/docs/getting-started/intro)

## Starting choice

Use the smallest set that exercises the desired process: LangGraph, one implementer, one reviewer, a test runner, and a separate final verification session. Several roles can use the same harness; they need distinct responsibilities and appropriate session boundaries. Add broader assistant platforms when persistent interaction or their integrations provide a concrete benefit.

Reuse useful skill instructions where supported, while checking the runtime's loading conventions and tool assumptions. A copied skill does not transfer credentials, session history, tools, or sandbox enforcement.

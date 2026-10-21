---
title: "Repositories and interfaces for a Soul System runtime"
description: "Case study: separating repository, package, runtime and interface for a proposed Soul System workflow runtime."
reviewed: 2026-10-21
order: 6
caseStudy: soul-system
authorship: ai
---
A LangGraph application is ordinary executable software. It can have its own package and still be invoked through a Claude Code plugin. The repository, distribution package, runtime, and interface are separate choices.

Proposed names, files, and tools below are examples. No runtime or integration has been created or tested.

## Interface and harness terminology

Typing `claude` launches the Claude Code application. Its visible interactive conversation is a terminal user interface, or TUI. CLI means command-line interface: commands, arguments, and noninteractive operations. One application can offer both.

The harness is the machinery underneath: the agent loop, context management, tools, sessions, and permission handling. Claude Code, Codex, and Hermes are application or product names. Calling them harnesses is useful shorthand when discussing their agent machinery; the visible window itself is an interface.

OpenAI distinguishes Codex's app, CLI, and IDE interfaces from its reusable harness. [Codex platform explanation](https://developers.openai.com/blog/codex-as-a-platform)

| Layer | Example in the proposed system |
| --- | --- |
| Interface | Claude Code's terminal conversation or an existing browser UI. |
| Plugin bridge | A Soul skill and tool connection submitting a job. |
| Workflow controller | LangGraph coordinating plan, implementation, review, and acceptance. |
| Worker harness | Codex or Claude Code managing an assigned coding session. |
| Model | The model selected by that worker. |
| Execution environment | The restricted workspace where tools run. |

## What Soul System already provides

The [Soul System README](https://github.com/soul-system-works/Soul-System#readme) describes shared project records, verification instruments, Claude plugin packaging, and a Codex preview. It also describes `/soul-delegate`: routine steps can go to another model while the supervising agent reruns each step's checks. Its stated aim is to compose with existing ways of working.

That suggests a complementary runtime rather than replacing Soul's conventions. This assessment uses the README and top-level listing, not a review of hook implementations or delegation internals.

## Suggested separation

Keep Soul's instructions, skills, records, host integrations, and verification conventions in the existing repository. Put a reusable executable workflow in a separate package with its own dependencies, releases, state storage, and worker adapters. Add a small optional bridge in the existing plugin.

A monorepo with separate plugin and runtime packages is also valid. Code volume alone does not require another repository, and a plugin can invoke executable software. Claude documents plugin skills, hooks, and MCP server declarations. [Plugin reference](https://code.claude.com/docs/en/plugins-reference)

A separate runtime repository is the recommended starting point because it could serve Claude Code, Codex, browser clients, and future integrations independently. A team releasing both packages together might prefer a monorepo.

## Example repository layout

This is an illustrative Python layout, not a prescribed LangGraph standard:

```text
soul-orchestrator/
  README.md
  pyproject.toml             # Dependencies and entry points
  uv.lock                   # Locked dependencies if using uv
  .env.example              # Safe example configuration
  .gitignore
  langgraph.json            # Optional Agent Server configuration
  src/soul_orchestrator/
    graph.py                # Steps and transitions
    state.py                # Specification, job state, evidence
    nodes/
      plan.py
      implement.py
      check.py
      review.py
      accept.py
    adapters/
      codex.py
      claude_code.py
    records.py              # Soul project record integration
    cli.py                  # Optional command-line entry point
    mcp_server.py           # Optional bridge for existing hosts
  tests/                    # Routing, recovery, integration checks
  examples/                 # Specifications and configurations
```

Adapters translate jobs into harness sessions. Records integration maps events to Soul's conventions. Credentials, local databases, generated logs, and working copies stay outside versioned source or in ignored directories.

Agent Server tooling uses `langgraph.json` to locate graphs and dependencies. Direct Python invocation does not require that server configuration. LangChain's [application structure documentation](https://docs.langchain.com/langsmith/application-structure) shows graph, dependency, environment, and configuration files for its deployment tooling.

## Using Claude Code as the interface

There are three distinct starting choices:

| Choice | What you install or build | How you interact |
| --- | --- | --- |
| Custom LangGraph workflow | A small application defining the steps and connecting workers. | Invoke a script, use a server client, or expose it as a tool to Claude Code or Codex. |
| Deep Agents SDK application | An application importing the existing Deep Agents harness and configuring its model, tools, and subagents. | The same entry-point options; the SDK alone does not add a command to Claude Code. |
| Deep Agents Code | The ready-made terminal coding application. | Launch `dcode` and interact with its own terminal interface. |

[Deep Agents overview](https://docs.langchain.com/oss/python/deepagents/overview), [Deep Agents Code](https://docs.langchain.com/oss/deepagents/code/overview)

For an SDK application, installing the dependency is only the first step. Configure an agent, provide an invocation entry point, and connect that entry point to the chosen interface. A simple local experiment can use a script invoked through a host's shell tool. A reusable integration can expose structured tools through an MCP server. Both [Claude Code](https://code.claude.com/docs/en/mcp) and [Codex](https://developers.openai.com/codex/mcp) document MCP client connections.

Deep Agents being able to use MCP tools does not automatically expose your application as an MCP server. That server wrapper is an additional integration. Likewise, launching Deep Agents Code does not automatically load an arbitrary custom LangGraph workflow. Its default subagent delegation also does not automatically enforce independent review and final acceptance stages.

An SDK worker has its own model configuration and session. Calling it from Claude Code does not make it the same Claude Code conversation or automatically grant it the host's tools and permissions.

A proposed interaction is:

1. Discuss a plan in Claude Code with Soul enabled.
2. A Soul workflow skill submits the approved specification through a tool.
3. The runtime returns a job identifier and runs the configured steps.
4. Claude Code displays status, findings, or a request for your input.
5. Your response resumes the job.
6. The runtime returns the patch and acceptance evidence.

This requires a bridge; installing LangGraph does not register a Claude skill automatically. An MCP server could expose bounded start, status, resume, and cancel operations. These are proposed operations, not built-in LangGraph tools.

For long jobs, preserve a job identifier instead of relying on one long tool call. Restrict worker sessions so they cannot accidentally launch another top-level workflow through the same bridge. The controller owns routing and budgets; each harness owns its assigned session.

Existing hooks do not automatically govern the new execution paths. Map their intended checks explicitly, and keep runtime completion criteria separate from a host session's Stop hook.

## Existing interfaces you can reuse

| Interface | What it supplies | Integration needed |
| --- | --- | --- |
| Claude Code or Codex | Familiar agent conversation. | Skill or tool connection to submit and control jobs. |
| LangSmith Studio | Graph visualization, state inspection, and development interaction. | Compatible Agent Server; the documented setup uses a LangSmith account and key. |
| Agent Chat UI | Open source browser chat with tool and interrupt interaction. | Agent Server and compatible message state. |
| Deep Agents Code | An existing terminal coding application. | Configure or customize behavior for the desired workflow. |
| Small custom CLI | Start, inspect, or resume jobs through commands. | A thin command wrapper; a complete chat UI is optional. |

[Studio documentation](https://docs.langchain.com/oss/python/langgraph/studio), [Agent Chat UI repository](https://github.com/langchain-ai/agent-chat-ui), [Deep Agents Code](https://docs.langchain.com/oss/deepagents/code/overview)

Studio is primarily for development and debugging. Agent Chat UI expects a LangGraph server with a `messages` key; an arbitrary custom state graph does not automatically become a complete chat product. Map messages, progress, and human decisions to the client interface.

## Projects that avoid starting at the lowest level

| Project | What already exists | Fit and limitation |
| --- | --- | --- |
| [Deep Agents](https://github.com/langchain-ai/deepagents) | Agent harness built on LangGraph, with tools, context handling, delegation, and human interaction. | Extend a runtime instead of recreating its inner loop. Independent acceptance stages still require configuration or code. |
| [Deep Agents Code](https://docs.langchain.com/oss/deepagents/code/overview) | Terminal coding app built on the Deep Agents SDK. | Try a working interface first. Its default behavior does not establish the proposed review policy. |
| [Open SWE](https://github.com/langchain-ai/open-swe) | Engineering application with planning, coding, validation, review, and interfaces. | A substantially assembled application to inspect. Its README warns of breaking changes and requires Managed Deep Agents to deploy as-is; otherwise it recommends adapting to another runtime. |
| [Agent Chat UI](https://github.com/langchain-ai/agent-chat-ui) | Reusable frontend. | Supplies the interface, not the development workflow. |
| [OpenHands](https://docs.openhands.dev/sdk) | Software engineering SDK with tools and local or remote execution. | An alternative foundation if LangGraph is optional; its abstractions and integration work differ. |

Deep Agents fills the gap between a bare graph library and a complete application. Its [overview](https://docs.langchain.com/oss/python/deepagents/overview) explains its LangGraph foundation. Deep Agents Code is its terminal application, currently documented with the `dcode` command.

Open SWE demonstrates that others have assembled much of this system already. Its current [README](https://github.com/langchain-ai/open-swe#readme) makes the maturity and managed-runtime conditions explicit. Inspect those conditions before adopting it unchanged.

These are maintained candidates and official examples, not a ranking by popularity or a claim that each is a turnkey replacement. Model inference support, full coding-CLI integration, and verification policy require separate evaluation.

## Suggested next decision

If actual Claude Code and Codex worker sessions are the requirement, reuse their harnesses and add a small controller. Deep Agents is optional when the existing harnesses already supply the worker capabilities.

If a customizable common runtime across models is the priority, inspect Deep Agents first. If an assembled engineering application is the priority, inspect Open SWE's setup and limitations before building a replacement.

For Soul System, the proposed default is a separate runtime package, reuse of Soul's contract and records, and a small optional plugin bridge. A new UI is unnecessary merely to test that design.

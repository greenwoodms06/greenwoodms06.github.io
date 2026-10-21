---
title: "Sandboxes and execution boundaries"
description: "When agents execute code: what a sandbox constrains, how to choose the boundary, and what it does not protect."
reviewed: 2026-10-21
order: 3
authorship: ai
---
Use a sandbox by default when agents execute code or commands. A separate container or virtual machine is unnecessary for a text-only exchange with no executable tools. Choose the boundary according to the actions and data the agent can reach.

The choices below are engineering recommendations; cited product behavior is specific to the documented implementation.

## What a sandbox does

A sandbox enforces limits on execution. Depending on the implementation, those limits cover file reads and writes, network destinations, processes, privileges, and resources. Permission checks decide whether an action may begin; isolation constrains what it can access while running. [Claude isolation guide](https://code.claude.com/docs/en/sandbox-environments)

An orchestrator assigns work. A sandbox constrains execution. An evaluation assesses the result. None substitutes for the others.

## Choosing the boundary

| Situation | Suggested starting point | Reason |
| --- | --- | --- |
| Models exchange text with no executable tools | No additional code-execution sandbox. | There is no agent-controlled code execution to contain. Data handling still depends on the model service. |
| A reviewer reads a patch | Read-only access to relevant files; no general shell if unnecessary. | Review rarely needs write privileges. |
| An agent edits a familiar repository and runs tests | Built-in OS sandbox with scoped writes and network access. | Limits the impact of ordinary mistakes. |
| Several agents execute unattended | Separate working copies and isolated execution environments. | Reduces accidental interference and limits reachable resources. |
| An agent runs unfamiliar repository code or dependencies | Disposable VM or suitably hardened isolated environment with minimal credentials. | Installation, builds, and tests can execute repository-controlled code. |
| A task changes production systems | A narrowly scoped external tool or broker with explicit deployment policy. | A local sandbox does not revoke authority granted to a remote API. |

Anthropic's [environment comparison](https://code.claude.com/docs/en/sandbox-environments) distinguishes per-command restrictions, whole-process isolation, containers, and VMs. It recommends stronger separation for untrusted repositories and unattended execution. A dedicated VM provides a separate kernel; ordinary Linux containers share their host kernel.

## Working copies and containers protect different things

A [Git worktree](https://git-scm.com/docs/git-worktree) provides another working tree attached to the same repository. It helps agents avoid editing the same files simultaneously. It does not restrict a process from reading your home directory or using network credentials.

A container's effectiveness depends on its configuration. Broad writable host mounts or control of the Docker daemon can undermine isolation. Docker's own documentation explains how daemon access can grant unrestricted host filesystem access through mounts. [Docker security](https://docs.docker.com/engine/security/)

For a development team, combine independent working copies with execution restrictions. Pass patches and structured findings between workers, then integrate and test against a known revision.

## Check the actual scope

The phrase sandbox enabled is incomplete. Determine which tools and processes it covers.

Claude Code's built-in shell sandbox covers shell commands and child processes. Its file tools, MCP servers, and hooks run outside that particular boundary. The documented shell sandbox supports macOS, Linux, and WSL2; on native Windows its commands run unsandboxed. [Claude sandbox documentation](https://code.claude.com/docs/en/sandboxing)

Codex documents a native Windows sandbox for PowerShell and its Linux implementation for WSL2. Platform behavior therefore differs between the two products. [Codex sandbox documentation](https://learn.chatgpt.com/docs/sandboxing)

Do not assume shell isolation automatically contains an MCP server or an external tool service. Apply restrictions at the component that actually performs the action.

## Network access and credentials

Isolation does not stop a permitted network tool from sending data to a permitted destination. Nor does it make a hosted model local: material sent to a remote provider still leaves the machine. [Claude environment comparison](https://code.claude.com/docs/en/sandbox-environments)

Keep long-lived credentials outside agent-controlled code where possible. Use a trusted tool service or proxy to add narrowly scoped credentials, rather than placing powerful keys in the execution environment. OpenAI describes this separation in its [sandbox security guidance](https://developers.openai.com/api/docs/guides/agents-api/environments/security).

The model connection may need network access even when generated programs do not. Separating the trusted controller from the execution worker lets their policies differ.

## Everyday use without excessive friction

Begin with a reusable development environment and narrowly scoped permissions. Preinstall known dependencies where practical. Allow the project, temporary files, and required services; expand individual permissions when the task demonstrates a need. Preserve logs and exported patches before discarding environments.

The costs are setup time, filesystem and networking compatibility, caches, and access to local services or hardware. Use lightweight built-in isolation for routine trusted work and stronger environments when execution is unattended or code is unfamiliar.

Sandboxing cannot determine whether the implementation is correct. Preserve independent checks, acceptance criteria, and review even when isolation is strong.

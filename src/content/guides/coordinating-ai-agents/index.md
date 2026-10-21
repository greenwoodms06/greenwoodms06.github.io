---
title: "Learning to coordinate AI agents"
description: "Notes on combining models, agents, tools and execution environments for development work: vocabulary, frameworks, sandboxes, a worked LangGraph workflow, and a project case study."
reviewed: 2026-10-21
published: 2026-10-21
order: 0
authorship: ai
---
These notes explain how to combine models, agents, tools, and execution environments for development work. Start with the vocabulary, compare implementations, then choose the isolation needed for the task.

New to the subject? [How AI models and agents work together](/blog/how-ai-models-and-agents-work-together) is a short introduction with an 84-second video; this guide goes into the detail behind it.

## Reading order

1. [Vocabulary and collaboration patterns](/guides/coordinating-ai-agents/vocabulary-and-patterns)
2. [Open source workflow solutions](/guides/coordinating-ai-agents/open-source-solutions)
3. [Sandboxes and execution boundaries](/guides/coordinating-ai-agents/sandboxes)
4. [A development workflow with LangGraph](/guides/coordinating-ai-agents/langgraph-development-walkthrough)
5. [Where agent harnesses fit](/guides/coordinating-ai-agents/agent-harness-comparison)

### Project case study: Soul System

Chapters 6 to 8 apply the guide to [Soul System](/projects/soul-system), one of the author's own projects. They propose a workflow runtime for that project that has not been built or tested. Chapter 6 also covers general material that chapters 2 and 5 point to: interface and harness terminology, reusable interfaces, and higher-level starting points such as Deep Agents and Open SWE.

6. [Repositories and interfaces for a Soul System runtime](/guides/coordinating-ai-agents/repositories-interfaces-and-soul-system)
7. [Proposed Soul workflow experience](/guides/coordinating-ai-agents/proposed-soul-workflow-experience)
8. [Soul workflow handoff and design decisions](/guides/coordinating-ai-agents/handoff-and-design-decisions)

The linked vendor documentation establishes capabilities. The suggested starting points and example architecture are engineering recommendations, rather than comparative benchmark results. Product capabilities and platform support should be checked again before implementation. The tools compared here have not been installed or tested for this guide.

## Main conclusions

- Reusable implementations of the common agent patterns already exist.
- LangGraph closely matches the patterns in Anthropic's architectural guide.
- Langflow offers a visual environment for building and manually trying flows.
- Microsoft Agent Framework includes predefined orchestrations and a manager that dynamically coordinates workers.
- Sandboxes constrain execution; evaluations assess results. A useful system needs both when agents execute code.
- A plan, implementation, review, and acceptance process combines a pipeline, revision loops, and human checkpoints. Existing coding harnesses can supply the workers.

## Maintaining these notes

Keep factual claims beside their sources. Add new subjects as focused chapters and update this index. Distinguish documented capability, experimental features, and measured results. Preserve disagreements and unresolved questions when the evidence does not settle them.

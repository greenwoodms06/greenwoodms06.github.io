# Source and editorial check

Reviewed October 21, 2026 using primary documentation and the cited research. The publication explains concepts and a proposed workflow, not results from an implemented system.

## Claims checked

| Subject | Primary source | Finding and editorial treatment |
| --- | --- | --- |
| Workflows and agents | [Anthropic guide](https://www.anthropic.com/research/building-effective-agents) | Predefined paths differ from model-directed action. Use the conceptual patterns; the page notes that older tooling information has changed. |
| Five patterns | [LangGraph tutorial](https://docs.langchain.com/oss/python/langgraph/workflows-agents) | Includes chaining, parallelization, routing, orchestrator–worker, and evaluator–optimizer. Examples do not establish a production coding application. |
| Graph primitives | [Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api) | State, nodes, and edges describe workflows; nodes need not use a model. |
| Harness and interface | [Codex platform explanation](https://developers.openai.com/blog/codex-as-a-platform) | Separates the reusable harness from app, CLI, and IDE experiences. |
| Deep Agents | [Overview](https://docs.langchain.com/oss/python/deepagents/overview) | Harness using LangGraph runtime capabilities. Do not claim all optional tools or planning features are enabled by default. |
| Deep Agents Code | [Overview](https://docs.langchain.com/oss/deepagents/code/overview) | Terminal application built on the SDK; current command is `dcode`. No unsupported inspiration claim about Claude Code. |
| Agent Chat UI | [Repository](https://github.com/langchain-ai/agent-chat-ui) and [documentation](https://docs.langchain.com/oss/python/langchain/ui) | Reusable browser interface requiring compatible message state; avoid promising compatibility with arbitrary graphs without adaptation. |
| Open SWE | [README](https://github.com/langchain-ai/open-swe) | Larger application, with breaking-change warning and Managed Deep Agents requirement for deployment as-is. Conditions remain beside the mention. |
| Agreement and correctness | [CONSENSAGENT](https://aclanthology.org/2025.findings-acl.1141/) | Study across six reasoning datasets and three models. Supports caution about agents reinforcing answers, not a universal outcome for coding teams. |
| Sandbox scope | [Isolation guide](https://code.claude.com/docs/en/sandbox-environments) | Distinguishes command, process, container, and VM boundaries, with limits on what isolation protects. |
| MCP | [Protocol introduction](https://modelcontextprotocol.io/docs/getting-started/intro) | Connections to external tools and systems; no orchestration policy by itself. |
| Astra handoff | [Official model page](https://developers.openai.com/api/docs/models/gpt-6-astra) | Text output, image input; base audio/video modalities unsupported. Production requires rendering tools. This belongs in the brief, not the public article. |

## Editorial review completed

- Public article excludes Soul System, personal details, and conversation history.
- Definitions are working vocabulary, recognizing vendor overlap.
- CSV task and evidence tables are explicitly illustrative.
- Separate sessions are not presented as guaranteed independent judgment.
- Unavailable checks are inconclusive; passing checks do not prove universal correctness.
- Model calls, full harness integrations, interfaces, and execution boundaries remain distinct.
- No comparative ranking, performance percentages, popularity claims, or invented endorsements.
- Source links sit beside factual claims.
- Recheck product details if publication is substantially delayed.

## Verification boundaries

Documentation was reviewed; products were not installed or benchmarked for the article. This stage prepares prose, storyboard, and timed captions. Rendered media and narration have not been produced. The production report must describe actual inspection of final assets.

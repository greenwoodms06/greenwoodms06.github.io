# Storyboard for the agent explainer

The authoritative narration and scene timings are in `scenes.json`. This storyboard specifies the visual teaching sequence. All motion is illustrative, not footage of a working multi-agent system.

| Scene | Time | On-screen focus | Visual action |
| --- | --- | --- | --- |
| 1 | 00:00–00:09 | How AI models and agents work together | Three neutral agent cards appear. Their overlapping arrows resolve into a clean, labeled arrangement. Show the title on the opening frame. |
| 2 | 00:09–00:24 | Model · Harness · Orchestrator · Interface · Sandbox | Build a compact diagram one component at a time. Interface sends a job; controller assigns it; worker harness contains model/tool interaction. Outline the tool-execution environment with a labeled access boundary. |
| 3 | 00:24–00:40 | Plan → Implement → Checks → Review | Introduce a tiny CSV export spec: current user, selected status, valid CSV. Highlight the pipeline. Emphasize that the test runner is an ordinary program. A repair arrow returns to implementation. |
| 4 | 00:40–00:58 | Evidence supports acceptance | Briefly recap the earlier review finding: “Selected: completed” beside an exported open task, labeled “Filter requirement fails.” Show the repair, then a fresh acceptance table. One row states “Not checked” in amber so uncertainty has a visible meaning. End with “Agreement alone does not establish correctness.” |
| 5 | 00:58–01:12 | LangGraph → building blocks; Deep Agents → harness; Deep Agents Code → terminal app | Show three distinct cards with short role labels, not a mandatory install sequence. A small optional connector returns to “Your existing interface.” Do not imply Deep Agents Code is the automatic interface for every custom graph. |
| 6 | 01:12–01:24 | One task · Clear limits · Inspectable checks | Reduce the scene to a small workflow and an evidence report. A quiet comparison card shows “Compare with one agent.” End with the title and “Choose the workflow. Check the evidence.” Hold the final frame for roughly two seconds. |

## Still image compositions

**Layer diagram.** Left-to-right interface → controller → worker harness. Inside the worker area show model ↔ tools. Tools connect to a separate bounded execution environment. Add a small note: “Components may run locally or remotely.” Avoid implying all tool calls or all processes share one boundary.

**Workflow diagram.** Use a broad horizontal flow with a repair arc beneath it. A side branch routes unclear requirements or exhausted budgets to a human decision. Final acceptance points to a report labeled “Candidate + evidence.” Show enough whitespace to remain readable at blog width.

**Poster.** Title above three short lines: “Models generate responses.” “Harnesses enable action.” “Workflows coordinate and check the work.” Use the workflow line as a restrained visual anchor. Do not fill the poster with all vocabulary definitions.

## Example evidence table for animation

The scene 4 table is fictional teaching material. Do not present it as an executed test report.

| Requirement | Before repair | After repair |
| --- | --- | --- |
| Selected status | Fail | Pass |
| Current user only | Not checked | Pass |
| CSV special characters | Pass | Not checked |

This intermediate table is intentionally not a complete acceptance result. If the animation subsequently depicts delivery, first show the remaining check complete. Never turn “Not checked” into a green pass merely to simplify the ending.

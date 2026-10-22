---
title: 'I re-ran my AI-system benchmark. A good CLAUDE.md kept up — and showed me what to fix.'
description: 310 sessions across three Claude models, two skill plugins, a careful CLAUDE.md and a five-minute one. Everything tied on quality. My system was cheaper on long work, but a careful instruction file asked me before deciding more often than it did. So I cut my system's rulebook by a third, tested the cut before shipping it, and wrote down what still needs fixing.
pubDate: 2026-10-21
tags: [ai, human-ai-collaboration, methodology, claude-code, measurement]
authorship: ai
kind: essay
draft: false
relatedProjects: [soul-system]
series: { id: soul-system, part: 5 }
---

*In June I tested my AI coding system against a carefully written plain instruction
file, and they tied. Four months and a model generation later I ran a bigger test.
They tied again — and so did a file someone could write in five minutes. My system
was still cheaper on long projects. But the thing I thought made it special, asking
me before making decisions that are mine, turned out to be something a careful
instruction file does just as well. So I trimmed my system, tested the trim, and
shipped it.*

## Previously

[Part 2](/blog/soul-system-efficacy) ran the Soul System — a one-page rulebook and a
few commands that keep an AI coding helper honest and make it write down what it
learns — against a carefully written plain instruction file. Quality tied, and Soul
came out cheaper. [Part 3](/blog/soul-system-2-0) shipped the slimmed-down 2.0 that
survived, and [Part 4](/blog/is-the-soul-system-obsolete) checked whether the wider
ecosystem had made it redundant. This part re-runs the head-to-head on newer models,
wider and fairer, and ends with what I changed because of it.

## The contest

Every helper got the same jobs. They differed only in their instruction file:

- **Soul** — my rulebook and its commands.
- **A careful file** — a long, well-written instruction file, written for the project
  by a fresh AI session with no Soul in it, and approved by me as something I'd
  genuinely use.
- **A quick file** — what a busy person writes in five minutes.
- Soul and the careful file each also ran with two popular add-on skill packs
  (Matt Pocock's skills and superpowers).

The main job was a 9-step science-code project, with a fresh session for every step,
so the only memory between steps was what the helpers wrote down. I hid traps along
the way: a step that tempts the helper to quietly drop an earlier safety check, a
step that tempts it to reuse a number that doesn't actually prove what it's being
used to prove, and a step that tempts it to call unfinished work "done". I also
gave short one-step quizzes. I ran it on three sizes of Claude, wrote down my
predictions before anything ran, and had graders score the work without knowing which
helper did it. 310 sessions in all, counting the follow-up test of the slim version.

## Result 1: everyone did good work

Every helper — Soul, careful file, quick file, with or without add-ons, on every model
— kept its earlier safety decisions, refused to call unfinished work done, and made
up no history. That includes the five-minute file. Today's models don't need much
instruction to do careful work on a project this size.

## Result 2: cost depends on what you compare with

![Bar chart of Soul's cost relative to the setup without it. Slim Soul v3 versus Soul v2 on the 9-step build: 18 percent cheaper. Soul versus the careful file on long builds: 17 to 59 percent cheaper. Soul versus the five-minute file: 19 percent more expensive. Soul versus a bare note on one-step tasks: mostly 12 to 52 percent more expensive.](cost.png)

- On long projects, Soul was cheaper than the careful file on every model: 17% on
  the biggest, 42% on the middle one, 59% on the smallest.
- The five-minute file was cheaper still.
- On one-step quizzes, Soul usually cost more than a bare note — its rulebook is
  loaded into every session, whether or not the job needs it.

## Result 3: the careful file asked me first

![Bar chart of the out-of-date rule quiz: the careful CLAUDE.md handed the decision back 5 of 5 times, Soul v2 2 of 5, Soul v3 2 of 5, a bare project note 0 of 5.](who-decides.png)

One quiz gave the helper a project with an old rule — "no outside code libraries" —
that no longer made sense, and a task where the obvious fix needs an outside library.

Every helper noticed the clash. What they did next was different:

- **The careful file's helpers stopped before writing any code** and asked me which
  way to go, 5 out of 5. Its own text tells them to: "Don't add a runtime dependency
  without the owner's explicit approval. Ask…"
- **Soul's helpers played it safe**: they built a workaround that kept the rule, and
  then raised the question. Only 2 of 5 clearly handed the decision to me; the other
  three only said "if you need more, you'll have to decide".
- **With just a bare project note**, none of them handed it over.

I had believed asking-before-deciding was Soul's special strength. My first write-up
of this test even said so — "Soul 5 of 5". When fresh graders scored every setup by
the same standard, that became 2 of 5, and the careful file beat it. In the longer
project, Soul's helpers did still ask more often at the judgment-call step, at least
on the middle-size model. But a careful instruction file does this job well, and on
the quiz it did it better.

## What went against me

- **Passing on the "why".** At the end of each project, the helper wrote notes for
  the next person. The rules always survived. But the *stories* behind them — what
  went wrong that made each rule necessary — came through more often from the careful file
  than from Soul's notes, in both test rounds.
- **My own counts.** Twice in this project, my first summary made Soul look better than
  it was, and both times a fresh reviewer reading the raw files caught it.

## What I changed: a slimmer Soul

The cost numbers pointed at one fix. Soul's rulebook was 1,041 words, loaded into
every session, and the long ones were mostly the stories behind the rules. So I cut it
to about 700 words. The first eight rules stayed word for word. The stories moved to a
separate "reasons" page that the rulebook links to. Two rules changed wording:

- **Report briefly:** answer first, in short plain sentences, one topic at a time; no
  restating the question, no recap, no answering questions nobody asked.
- **End with a bottom line** that says who acts next — 🙋 my decision, 🤖 the helper
  will fix it, ✅ nothing to do.

Then I tested the slim version before shipping it, with the pass rule written down
first.

| | Soul v2 | Slim Soul v3 |
|---|---|---|
| Quality on the 9-step project (two runs) | tied | tied |
| Cost per 9-step project | $1.98 | **$1.62** (18% less) |
| Cost per one-step quiz | $0.086 | $0.084 (2% less) |
| Handed me the decision on the quiz | 2 of 5 | 2 of 5 |
| Reply length | same | same |

The slim version is as good and cheaper on long work, so it ships as v3.0. One honest
note: my written pass rule asked for 4 of 5 on the quiz, a bar I had set from that
inflated "5 of 5". Neither version reaches it. I chose to read the rule as "no worse
than before", and I'm saying so here rather than quietly.

The replies didn't get any shorter. In these one-step tasks, every setup's replies were
already about the same length, Soul or not. My read, not something the test measured:
the length comes from the model's default way of reporting finished work, so changing
the rulebook's wording didn't move it.

## What's next

The test also showed me the next things to fix:

1. **Ask before acting, not after** — the careful file's habit of stopping first.
2. **Keep the "why" in handoff notes**, not just the rule.
3. **Test the "prune old rules" idea for real**, on a project that's moving to public
   repos.

Where that leaves things: a good instruction file gets you most of the way with
today's models. What Soul measurably still adds is lower cost on long projects than a
long instruction file, and a little more asking at judgment calls on the middle-size
model. Checking its own claims held up in every test, but it held up for every setup,
so that isn't Soul's to claim. The ask-first habit is something it now has to learn
from a careful file.

---

*The full reports — every table, the predictions written before the runs and how each
one did, the corrections, and what's still untested — are
[the campaign report](https://github.com/soul-system-works/Soul-Benchmark/blob/main/experiments/2026-10-21-campaign/REPORT.md)
and [the slim-Soul result](https://github.com/soul-system-works/Soul-Benchmark/blob/main/experiments/2026-10-21-slim-soul/RESULT.md)
in the `soul-benchmark` repository, next to the raw results and the blind grades.*

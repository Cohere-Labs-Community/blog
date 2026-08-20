---
layout: distill
title: "Big Context Windows Are Not Memory: What I Learned When My Chats Kept Dying"
date: 2026-08-20 00:00:00
description: "A student's journey from a frustrating ChatGPT session to building an open-source framework for deciding what an LLM should actually remember."
author: "Vijay Kumar"
authors:
  - name: "Vijay Kumar"
    url: "https://www.linkedin.com/in/iamvijay7/"
    image: "vijay-kumar.jpg"
    bio: "Vijay Kumar is a Data Science and AI student with a strong interest in large language models, retrieval-augmented generation, and AI evaluation. He has worked on conversational AI and RAG systems through personal projects and internship experience, and built ContextShift, an open-source library for experimenting with pluggable LLM context-management strategies."
    affiliations:
      name: "Cohere Labs Community"
tags: community research llm-memory context-management open-source
toc: true
bibliography: 2026-08-20-big-context-windows-are-not-memory.bib
---

## The moment it broke

A few months back, I was working on a project and using ChatGPT for help and debugging. This was before I started using Claude Code. Things were going fine, and after a lot of back and forth, the model finally understood my project. It knew my file structure, my bugs, the fixes we had already tried. And right at that moment, the chat got full and forced me to start a new one.

That was the frustrating part. In the new chat, I had to explain everything again from zero. And even after explaining, the answers were not as accurate as the ones from the earlier session. All that built-up understanding was just gone.

Sitting there, I had one simple thought: why can't it just compress or delete the older parts of the chat that are no longer useful? The recent stuff mattered. The stuff from an hour ago mostly didn't. That one thought is what this whole post is about.

## Going down the rabbit hole

As a student, I didn't really know how these models worked inside. So I started digging. First videos, then articles, and eventually research papers.

Here is what I learned, in plain words. The model doesn't read text the way we do. Your text gets broken into tokens, small chunks of words. The model can only "see" a fixed number of tokens at a time. That fixed size is called the context window. The model itself is an autoregressive transformer, which just means it writes one token at a time, always looking at everything currently inside the window to decide the next one.

The part that surprised me the most: the model has no memory at all. None. Every time you send a message, the entire chat history gets fed back into the window again. The model isn't remembering your conversation. It is re-reading it, every single time. So when the window fills up, there is simply no room left for new messages. That is why my chat died.

{% include figure.liquid path="assets/img/2026-08-20-big-context-windows-are-not-memory/context-window-diagram.png" class="post-figure" loading="eager" width="100%" max-width="100%" alt="Diagram showing a fixed-size context window filling up with chat messages until nothing new can fit." caption="Every message goes back into the same fixed-size window. When it fills up, something has to give." %}

## Bigger window is not memory

The obvious fix, and the one every model release advertises, is a bigger window. 128K tokens. 200K. A million. If the window is huge, doesn't the problem just go away?

Not really. When a model has more content sitting in its window, it has to spread its attention across all of it, including the parts that don't matter anymore. That doesn't just waste space. It actively makes the model worse at using the parts that do matter, even when the important information is technically still "in there." <d-cite key="liu2024lost"></d-cite>

Here's the part that changed how I thought about it. I found a paper from Google Research, Selective Attention Improves Transformer (ICLR 2025) <d-cite key="leviathan2025selective"></d-cite>. The first line of the abstract says it plainly: "Unneeded elements in the attention's context degrade performance." The authors show that cutting attention to unneeded tokens doesn't just save memory, up to 47 times less memory for the attention part of the model. It also makes the model perform better, at the same quality.

That was a strange moment for me. My random frustration-thought, "just delete the stuff that's no longer useful," wasn't just a convenience idea. Researchers had shown that removing stale context makes a model genuinely better, not just cheaper to run.

So the real problem was never window size. A context window is storage. Memory is something else: keeping what matters and dropping what doesn't. A bigger window gives you more storage. It doesn't give you that.

## Context is a policy, not a feature

So I stopped reading about it and tried to build the policy myself. I called the project ContextShift, and it's live here: [context-shift.vercel.app](https://context-shift.vercel.app/).

{% include figure.liquid path="assets/img/2026-08-20-big-context-windows-are-not-memory/contextshift-screenshot.png" class="post-figure" loading="eager" width="100%" max-width="100%" alt="Screenshot of the ContextShift chat app prototype." caption="The same app from the first prototype, still running today, now backed by an open-source library instead of logic hardcoded into one file." %}

The first version was small: a chat app with a hardcoded 4,000-token limit and two buttons, one to summarize the old messages, one to prune them. It worked. But the actual "decide what to keep" logic was just sitting inline in one file, wired to that one app. Nobody else could reuse it. Nobody could even ask, "what if we decided differently?"

So I pulled that decision out into its own idea. Not a feature bolted onto a chat app. A policy. And a policy, it turns out, is a surprisingly small thing to write down. Give it the messages so far and a token budget, and it hands back a decision: what to keep, what to drop.

```python
class ContextStrategy(Protocol):
    def build(self, messages: Sequence[Message], budget: TokenBudget) -> ContextResult:
        ...
```

That's the entire interface. One method. Nothing in it about summarizing, nothing about which model you're using, nothing about buttons in a UI. Just: here's what's happened so far, here's how much room you have, tell me what survives.

Once the decision had a shape like that, using it end to end became a few lines of code:

```python
manager = ContextManager(
    strategy=PinnedRecencyStrategy(recent_buffer=2),
    provider=FakeLLMProvider(complete_response="Paris."),
    tokenizer=HeuristicTokenizer(),
    budget=TokenBudget(max_tokens=100, safety_margin=10),
)

result = manager.chat([], "What's the capital of France?")
print(result.response)  # "Paris."
```

Here's how those pieces actually fit together:

{% include figure.liquid path="assets/img/2026-08-20-big-context-windows-are-not-memory/architecture-diagram.png" class="post-figure" loading="eager" width="100%" max-width="100%" alt="Architecture diagram showing you talking to ContextManager, which coordinates a pluggable ContextStrategy and an LLMProvider, which in turn talks to the model." caption="ContextManager sits between you and the model. It doesn't implement a keep/drop policy itself — it hands that decision to a pluggable ContextStrategy." %}

The manager doesn't know or care which policy it's holding. That's the whole point of writing the interface as one plain method instead of baking a specific strategy into the app. I could prove this to myself with something almost silly:

```python
class DuckTypedStrategy:
    def build(self, messages, budget):
        return ContextResult(messages=list(messages), excluded=[])

isinstance(DuckTypedStrategy(), ContextStrategy)  # True
```

That class has never imported my library. It doesn't inherit from anything. It just happens to have a method with the right name and shape, and that's enough. "Pluggable" wasn't a word I got to use because I said so. It's a word I got to use because I could write a check like that one and watch it pass.

Once the shape was that small, writing a second policy, and then a third, and eventually a fourth, wasn't a redesign. It was just writing the method again, differently. One keeps a fixed recency window and never drops anything you've pinned. One keeps as much of the recent conversation as fits the budget, with nothing fixed about it at all. One keeps a fixed number of the most recent messages, full stop, and treats the token budget as a backup limit instead of the main rule. And one doesn't discard the older messages at all — it compresses them into a single summary and keeps that instead, the only policy that costs a real model call to decide.

Four different answers to the same question. Which raised the obvious next one: which answer is actually better?

## Deciding what to keep, measured

Having four policies meant I could finally stop guessing which one was actually better. I could measure it. So I built a way to run every policy against the exact same conversation and compare what actually happens. Three of them fit this straight away, no model call involved anywhere — just the numbers: how many messages survive, how many tokens they cost, how long the decision takes. The fourth, the one that summarizes, needed a different kind of test, which I'll get to.

```python
from contextshift.benchmark import run_benchmark, to_markdown

results = run_benchmark(
    conversation,
    budget,
    [RecencyStrategy(), SlidingWindowStrategy(window_size=10), PinnedRecencyStrategy(recent_buffer=6)],
)
print(to_markdown(results))
```

On a 41-message conversation with a small budget, here's what actually came out:

| Strategy              | Kept | Discarded | Tokens Kept | Tokens Discarded | % Retained | Latency (s) |
| --------------------- | ---: | --------: | ----------: | ---------------: | ---------: | ----------: |
| RecencyStrategy       |   32 |         9 |         880 |              228 |     79.42% |    0.000030 |
| SlidingWindowStrategy |   10 |        31 |         275 |              833 |     24.82% |    0.000005 |
| PinnedRecencyStrategy |   33 |         8 |         888 |              220 |     80.14% |    0.000028 |

That table is more honest than my gut ever was. The strategy that keeps a fixed number of messages leaves most of the budget on the table, 275 tokens used out of 900 available, because it cares about a predictable count, not a full window. The other two fill the budget almost completely. None of that is a guess anymore. It's a number I can rerun any time I want.

That table told me how much of the budget each policy used. It didn't tell me whether any of them kept the right things. A strategy that's defined as "keep the last ten messages" reporting that it kept ten messages isn't a finding — it's the constructor argument, restated. I didn't notice this for a while, because the numbers felt like evidence. They weren't. They were just a description of how each policy is configured.

What actually tells you something is whether a policy drops the one message a later question depends on. So I built a second, harder benchmark: instead of counting messages, I hand-wrote a set of conversations where I knew, in advance, exactly which earlier message a later question needed — the name mentioned on turn one and asked about on turn forty, the correction that overwrote an earlier wrong answer, the pinned instruction sitting under a mountain of unrelated small talk. Then I ran every policy against all of them and checked whether that specific message survived.

The real number was worse than I expected. Across the fixture set, every policy loses more than half of what the questions actually depend on. The best of them, the one that pins important messages, keeps 40%. Not 90%. Forty. The two without pinning do worse — one keeps as little as 13% of what actually mattered, even while it was filling most of its token budget with something. That's the distinction the first table couldn't show: two policies can retain a near-identical share of tokens while one of them is quietly throwing away the parts of the conversation that made the model useful in the first place.

While I was building the third policy, something happened that I didn't expect. I'd written a plain, budget-driven strategy: no fixed window, no pinning, just keep as much of the recent conversation as fits. I assumed it would behave differently from the other two. So I wrote a test comparing it against the pinned-and-windowed strategy, using a window of exactly one message.

The test told me they were identical. Not similar. Identical, message for message, for every conversation with no pinned messages in it.

I had spent real time building a "new" policy that turned out to be a special case of one I already had. My first reaction was mild embarrassment. My second reaction was that this is actually a good sign. It meant the interface was small enough that a genuinely new idea and an old idea wearing a different name would show up as the same thing under a fair test. If I hadn't measured it, I would never have known. I would have just believed I'd built three different things.

## Full circle

That gave me real confidence in the idea itself. And not long after, I found out I wasn't the only one who'd landed on it.

Some time later, I started using Claude Code for my own projects. And there it was: a built-in compact feature that summarizes the older parts of a session when it gets full. The exact thing I'd been missing during that ChatGPT session, and the thing I'd tried to build myself, was already shipping in a production tool.

That felt like real confirmation. The tools people actually rely on didn't solve this by waiting for a bigger window. They solved it by managing context on top of the window: summarizing what's old, dropping what's stale. Long-term memory for LLMs isn't something you get for free from a bigger number. It's something you build on top of the window, not inside it.

## What I'd tell other

This whole thing started from an annoyance, not a course or an assignment. Chasing one small "why is this so annoying?" question taught me more about tokenization, attention, and interface design than any tutorial I had watched before.

I want to be honest about where the edges still are. More than once while building this, I felt the pull to add a way to pick a policy by name from a list, some kind of menu. Each time, the honest answer was the same: there was nothing to choose between yet. A menu with one real option isn't a menu. Saying no to that turned out to matter more than most of the things I said yes to.

The bigger honest edge used to be this: I could measure how many tokens a policy keeps, and how fast it decides, but not whether the answers you get afterward are actually better. That gap is smaller now — there's an opt-in mode that asks a real model each question and scores the actual answer, not just whether the right message survived. But I built that carefully, separate from everything else, because it costs money and isn't deterministic the moment you turn it on, and I haven't yet pointed it at a conversation of my own and watched what comes back. The honest edge just moved: I know the plumbing works. I don't yet know what it says.

The library is open source on [GitHub](https://github.com/Vijay6923/ContextShift), and you can also try the [live demo](https://context-shift.vercel.app/). Try it, break it, tell me what fails. That's still the part of open science I like the most: you don't need permission to start pulling on a thread.

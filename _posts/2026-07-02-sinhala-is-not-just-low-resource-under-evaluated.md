---
layout: distill
title: "Sinhala Is Not Just Low-Resource: It Is Under-Evaluated"
date: 2026-07-02 00:00:00
description: "Sinhala NLP has often been framed as a data-scarcity problem, but the next major step is better evaluation: benchmarks that test real Sinhala, local context, code-mixing, and everyday use."
author: "Sayuru Bopitiya"
authors:
  - name: "Sayuru Bopitiya"
    url: "https://sayururehan.vercel.app/"
    bio: "Sayuru Bopitiya is a research engineer and member of the Cohere Labs Open Science Community. His interests include multilingual NLP, low-resource language technology, and practical AI systems that serve real-world users."
    affiliations:
      name: "Cohere Labs Community and Masters Student, Curtin University"
tags: community research writing multilingual-ai sinhala low-resource-languages evaluation
toc: true
---

## Abstract

Sinhala NLP has often been framed as a data-scarcity problem, but the next major step is better evaluation: benchmarks that test real Sinhala, local context, code-mixing, and everyday use. Better Sinhala AI needs not only more data but better evaluation as well.

Sinhala is often described in NLP papers as a low-resource language. This label is not wrong, but it is a little like saying Sri Lankan food is simply "spicy." Technically true in some cases, but it misses the plot. There is texture, variation, history, and context hiding behind the label.

When we call Sinhala low-resource, we usually mean that there is less high-quality labeled data, fewer large public corpora, fewer pretrained models, and fewer reusable tools compared with English or other high-resource languages. Those are real problems but I want to argue that Sinhala has another challenge that deserves equal attention: it is under-evaluated.

In other words, we do not yet have enough ways to measure whether language models actually understand Sinhala in the ways people use it. A model may translate a clean sentence, answer a formal exam question, or generate grammatically acceptable text. But can it handle Romanized Sinhala, Sinhala-English code-mixing, local references, school-level knowledge, idioms, cultural nuance, or the kind of "can you just send me the summary before the meeting?" language that appears in real chats? That is where the evaluation gap becomes visible.

{% include figure.liquid path="assets/img/2026-07-02-sinhala-is-not-just-low-resource-under-evaluated/sinhala-problem-diagram.png" alt="Diagram comparing low-resource as a data problem and under-evaluated as a measurement problem, with examples of Sinhala script, Romanized Sinhala, code-mixing, and local knowledge." caption="Low-resource and under-evaluated are related, but not the same. Sinhala evaluation needs to cover how people actually use the language." %}

## Low-resource is about data. Under-evaluated is about evidence.

The phrase low-resource points us toward a supply problem, not enough data, not enough annotation, not enough compute spent on the language, and not enough open infrastructure. The phrase under-evaluated points to a measurement problem: even when models exist, we may not know where they succeed, where they fail, or what kind of failure matters most for real users.

This distinction is important for open science. If we only say "we need more data," the obvious solution is to collect more text and train larger models. But if we say "we need better evaluation," the solution becomes more community-centered. We need native speakers, linguists, developers, and domain experts to help define what good Sinhala AI should look like. A benchmark is not just a spreadsheet with answers, it is a statement about what a community values enough to measure.

## What Sinhala evaluation already has

There has been meaningful progress. [FLORES](https://aclanthology.org/D19-1632/) helped bring Sinhala-English into low-resource machine translation evaluation, using carefully translated Wikipedia-based sentences for benchmarking. That mattered because it gave researchers a shared way to compare machine translation systems instead of relying only on scattered examples.

More recently, [SinhalaMMLU](https://arxiv.org/abs/2509.03162) introduced a multitask benchmark for Sinhala language understanding, with more than 7,000 multiple-choice questions aligned with the Sri Lankan national curriculum across academic and culturally grounded domains. This is an important step because it moves evaluation beyond translation and asks whether models can answer Sinhala questions across subjects and knowledge areas.

The broader multilingual AI community is also moving in the right direction. [Cohere Labs' Aya 101](https://huggingface.co/CohereLabs/aya-101), for example, was built as an open multilingual research model covering 101 languages through a large collaborative effort. Projects like Aya show why open, community-driven multilingual research matters: no single team can fully understand the lived language practices of every community in the world.

## What current evaluation still misses

The next challenge is to make Sinhala evaluation more realistic and more aligned with Sri Lankan culture. Formal Sinhala is only one part of the language. Many Sri Lankans switch between Sinhala and English naturally. Many type Sinhala using English letters. Some use Unicode Sinhala script, some use Romanized Sinhala, and many use a mix of both depending on the platform, device, audience, and level of formality.

For example, a formal Sinhala prompt might look like this:

## A quick reality check: how people type

| Prompt type | Example |
| --- | --- |
| Formal Sinhala | අද කාලගුණය කෙසේ ද? |
| Romanized Sinhala / Singlish | ada weather eka kohomada? |
| Code-mixed Sinhala-English | heta meeting ekata kalin summary eka denna |

A model that performs well on the first prompt but fails on the second and third has not failed at a random edge case. It has failed at a common digital behavior. Calling that "noise" is convenient for datasets, but not for users.

## Where better benchmarks can help

A stronger Sinhala evaluation ecosystem should include multiple layers. First, it should test script variation: Sinhala script, Romanized Sinhala, and mixed-script prompts. Second, it should test task variation: translation, summarization, retrieval-based question answering, instruction following, reasoning, classification, and safety. Third, it should test cultural and local grounding: Sri Lankan places, names, administrative terms, school subjects, festivals, public services, everyday social norms, and idiomatic expressions.

Human evaluation also matters. Automatic metrics can tell us whether an answer overlaps with a reference answer, but they may not tell us whether the response sounds natural, respectful, locally appropriate, or simply weird in a way only a native speaker can explain. Anyone who has seen a machine-translated Sinhala sentence that is technically correct but spiritually confused will understand this problem immediately.

A good benchmark should not only ask, "Did the model get the answer right?" It should also ask, "Would this answer be useful to a Sinhala-speaking person?" That second question is harder, but it is also where language technology becomes meaningful.

## A community-shaped evaluation agenda

This is where open science can make a real difference. Sinhala evaluation can grow through community contributions: small datasets, prompt collections, error analyses, evaluation rubrics, annotation guidelines, and shared model comparisons.

A practical community project could start small. For example, contributors could create a set of 500 native Sinhala prompts across formal Sinhala, Romanized Sinhala, and code-mixed Sinhala-English. Each prompt could include expected behavior, acceptable answer criteria, and notes on cultural context. Another group could test open multilingual models on the set. Native speakers could review the outputs for correctness, fluency, tone, and usefulness. The result would not solve Sinhala NLP overnight, but it would create something valuable, evidence.

This evidence can guide better datasets, better model training, better prompting strategies, and better product decisions. It can also reveal where models appear fluent but are unreliable. In low-resource languages, fluency can be especially dangerous because a confident answer in familiar-looking Sinhala may hide factual errors, mistranslations, or cultural misunderstandings. Evaluation is how we catch those failures before users have to.

## Conclusion

Sinhala is low-resource in many practical ways, but that is not the whole story. It is also under-evaluated. The difference matters because evaluation shapes what researchers notice, what developers optimize, and what communities can trust.

The goal should not be to build benchmarks that make models look good. The goal should be to build benchmarks that make model behavior visible: the strengths, the weaknesses, the awkward moments, and the places where the model confidently walks into a linguistic banana peel.

For Sinhala and many other underrepresented languages, the future of multilingual AI will depend not only on more data and larger models, but on better questions. Who defines quality? Which language varieties count? Which tasks reflect real life? Which failures are unacceptable? These are not only technical questions. They are community questions.

If we want AI systems that serve Sinhala speakers well, we need to evaluate Sinhala as it is actually used: formal and informal, written and Romanized, local and global, academic and everyday. Sinhala is not just low-resource. It is under-evaluated. And that gives us a clear place to begin.

## References and links

1. [FLORES: The FLORES Evaluation Datasets for Low-Resource Machine Translation: Nepali-English and Sinhala-English](https://aclanthology.org/D19-1632/)
2. [SinhalaMMLU: A Comprehensive Benchmark for Evaluating Multitask Language Understanding in Sinhala](https://arxiv.org/abs/2509.03162)
3. [Cohere Labs Aya research page](https://cohere.com/research/aya)
4. [Aya 101 model card](https://huggingface.co/CohereLabs/aya-101)
5. [Survey on Publicly Available Sinhala Natural Language Processing Tools and Research](https://arxiv.org/abs/1906.02358)

Thanks for reading! Let's connect: https://www.linkedin.com/in/sayuru-bopitiya/
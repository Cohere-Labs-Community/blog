---
layout: distill
title: "NILEAGI-SUB: An Evaluation Programme for Swahili Language Understanding"
date: 2026-08-13 00:00:00
description: "We built NILEAGI-SUB to measure Swahili understanding where people actually use it. Our first sector is education: 2,569 school questions, eight compact open models, and a ranking that size alone cannot explain."
author: "Zephania Reuben"
authors:
  - name: "Zephania Reuben"
    url: "https://nsoma.me/"
    image: "zephania-reuben.jpg"
    bio: "Zephania Reuben is Co-Founder, CEO, and Research Lead at NileAGI. His research interests include intelligence theory, human-level intelligence, the intersection of human and AI cognition, and African-centric AI solutions."
    affiliations:
      name: "NileAGI"
  - name: "Isack Odero"
    url: "https://www.linkedin.com/in/oderoi"
    image: "isack-odero.png"
    bio: "Isack Odero is Co-Founder and Intelligence System Engineer at NileAGI. His research interests include inference and building efficient intelligence systems for resource-constrained environments."
    affiliations:
      name: "NileAGI"
  - name: "Joseph Mnyune"
    url: "https://www.linkedin.com/in/joseph-mnyune"
    image: "joseph-mnyune.jpeg"
    bio: "Joseph Mnyune is Responsible AI Lead at NileAGI. His research interests centre on the intersection of people and technology, technology governance, and the ethics of responsible AI adoption."
    affiliations:
      name: "NileAGI"
tags: community research swahili african-languages evaluation benchmarks multilingual-ai low-resource-languages
toc: true
bibliography: 2026-08-13-nileagi-sub-swahili-language-understanding.bib
---

At NileAGI we spend a lot of time thinking about models that have to run locally — on hardware people can actually afford, in places where the internet is slow or expensive. Swahili is the language we hear in classrooms, clinics, banks, and markets across East and Central Africa. Over 200 million people speak it. And yet, when we tried to choose a compact open model for Swahili work, the comparisons we found were hard to trust. Different posts used different prompts, different decoding, and different questions. The ranking moved before anyone had talked about language ability.

So we asked a more direct question: on the **same** Swahili school items, scored the same way, how do today's compact open models actually compare?

That question became **NILEAGI-SUB**, a programme for measuring Swahili understanding sector by sector — education first, then later health, finance, sports, and others. This post is about the first release: **SUB-MCQ EDUCATION**, 2,569 expert-reviewed multiple-choice items from the Swahili-subject curriculum (Standard 3–7 and Form 2–4), evaluated on eight openly accessible models in the 2–5B range.

The [dataset](https://huggingface.co/datasets/nileagi/nileagi-sub-edu) and [code](https://github.com/nile-agi/nileagi-sub) are public.

## Why school questions

A model can sound fluent in Swahili and still fail on the vocabulary and reasoning that show up in a Form 4 exam. Existing multilingual suites such as XTREME, FLORES, BELEBELE, and MMLU remain useful <d-cite key="hu2020xtreme,goyal2022flores,bandarkar2024belebele,hendrycks2021mmlu"></d-cite>, but they do not give us a grade-stratified Swahili school signal for compact models. Language-specific work like MasakhaNER shows how much you miss when you only look at global aggregates <d-cite key="adelani2021masakhaner"></d-cite>. We needed a shared yardstick of our own.

We started with education because the items already have a natural difficulty ladder, and multiple choice lets us score exactly — a letter is right or it is not. These items are from the Swahili **language** subject (grammar, comprehension, vocabulary, literature), not maths or science taught in Swahili. A high score means the model handles that curriculum, not that it can tutor every school subject.

We also stayed in the 2–5B band on purpose. Those are the models most likely to run on a single workstation GPU, which is the setting we care about for local deployment.

## What we put in front of the models

Khalid Mwinge, a Swahili language expert, reviewed grade placement. After filtering empty options, unmappable grades, and invalid keys, 2,569 of 2,608 source records remained. Standards 6 and 7 dominate the set, so overall accuracy leans toward those bands. Most items have four or five choices; random guessing over the observed options lands at about 22.4%.

| Grade band | Items | Share (%) |
| ---------- | ----: | --------: |
| Standard 3 |    66 |       2.6 |
| Standard 4 |   116 |       4.5 |
| Standard 5 |   274 |      10.7 |
| Standard 6 |   651 |      25.3 |
| Standard 7 |   517 |      20.1 |
| Form 2     |   399 |      15.5 |
| Form 3     |   125 |       4.9 |
| Form 4     |   421 |      16.4 |
| **Total**  | 2,569 |     100.0 |

The eight models mix general multilingual instruction checkpoints, African-language continued-pretraining (CPT) bases, and the regional versus global Tiny Aya siblings <d-cite key="ustun2024aya,tinyaya2026,gemma2026,afriquellm2026,llama2024,qwen2025"></d-cite>. Instruction models got a Swahili prompt asking for a single letter A–E. The Afrique CPT bases do not behave well under chat templates, so they got a short completion prompt ending in `Jibu:`. Local runs were greedy; Cohere API calls used temperature 0. We scored exact letter match only. Missing or messy parses counted as wrong.

That protocol is matched on items and scoring. It is **not** a clean causal test of CPT: Afrique and non-Afrique models also differ in prompt format. We read those gaps as comparative outcomes, not as "CPT caused this."

## What we found

{% include figure.liquid path="assets/img/2026-08-13-nileagi-sub-swahili-language-understanding/fig1_overall_accuracy.png" class="post-figure" loading="eager" width="100%" max-width="100%" alt="Horizontal bar chart of overall accuracy for eight compact models on SUB-MCQ EDUCATION." caption="Overall accuracy on 2,569 items. Dashed line: 22.4% chance baseline. Tiny Aya Earth is highlighted as the West Asia/Africa regional variant." %}

| Rank | Model             | Accuracy | 95% CI       |
| ---: | ----------------- | -------: | ------------ |
|    1 | Gemma 4 E4B       | **54.8** | [52.8, 56.7] |
|    2 | AfriqueQwen3.5-4B |     50.3 | [48.3, 52.2] |
|    3 | AfriqueGemma-4B   |     43.4 | [41.5, 45.3] |
|    4 | Tiny Aya Earth    |     41.4 | [39.5, 43.3] |
|    5 | Tiny Aya Global   |     40.7 | [38.8, 42.6] |
|    6 | Qwen3.5-4B        |     35.4 | [33.5, 37.2] |
|    7 | Qwen3.5-2B        |     29.1 | [27.4, 30.9] |
|    8 | Llama 3.2 3B      |     27.8 | [26.1, 29.6] |

Gemma 4 E4B comes first. AfriqueQwen3.5-4B is close behind, and the gap is unlikely to be chance. Every model beats random guessing, but the spread from best to worst is about 27 points — inside one compact size band.

Two comparisons stuck with us.

At nearly the same size, AfriqueQwen3.5-4B beats Qwen3.5-4B by about 15 points. Adaptation looks like it matters a lot here, but we cannot yet separate continued pretraining from the different prompt format.

Tiny Aya Earth (the West Asia/Africa variant) and Tiny Aya Global differ by only 0.7 points. That difference is small enough to be chance. Regional branding, on this Swahili school set, did not produce a clear overall win.

{% include figure.liquid path="assets/img/2026-08-13-nileagi-sub-swahili-language-understanding/fig2_category_heatmap.png" class="post-figure" loading="eager" width="100%" max-width="100%" alt="Heatmap of accuracy by school grade and model." caption="Accuracy by grade. AfriqueQwen leads on Standard 3 and 5; Gemma leads the other six bands." %}

Leadership also changes by grade. AfriqueQwen is strongest on Standard 3 and Standard 5; Gemma leads the rest, especially Form 2 and Form 4. Standard 3 has only 66 items, so those early-grade ranks are noisier than the overall table.

{% include figure.liquid path="assets/img/2026-08-13-nileagi-sub-swahili-language-understanding/fig3_params_vs_accuracy.png" class="post-figure" loading="eager" width="100%" max-width="100%" alt="Scatter plot of model size versus accuracy." caption="Near 4B parameters, accuracy still ranges from 35% to 50%. Size is a weak guide in this band." %}

{% include figure.liquid path="assets/img/2026-08-13-nileagi-sub-swahili-language-understanding/fig5_radar_top_models.png" class="post-figure" loading="eager" width="100%" max-width="100%" alt="Radar chart of grade profiles for the five highest-scoring models." caption="Grade profiles for the top five models. The heatmap is better for exact comparisons." %}

## What we take from this

Once the items and the scoring rule are fixed, these models are not interchangeable. Family and adaptation move the needle more than a few hundred million parameters. A strong general multilingual checkpoint can still outrank a regionally adapted one. And a regional label is not, by itself, evidence of better Swahili educational accuracy.

We are careful not to overclaim. The best model still misses about 45% of items. Letter-match accuracy is not explanation quality, classroom usefulness, or a license to automate assessment. We have not checked training-data contamination, so part of any lead could be memorization. Grade labels had one expert reviewer, not a second annotator. This is education only, at one size band.

Next we want matched CPT ablations, a private held-out test split, human baselines, and the same protocol in other sectors. The full paper has the longer methods, limitations, and roadmap. This post is the story we would tell a colleague: Swahili needs sector-level evaluation, compact models already diverge sharply, and size is a poor way to choose among them.

## Acknowledgments

This work was done at NileAGI with support from the Cohere Labs Catalyst Grant Program (API credits) and compute paid for by NileAGI. Two of the eight models, Tiny Aya Earth and Tiny Aya Global, are Cohere systems; both rank below the top two on every metric we report. Funding does not imply endorsement of our conclusions.

Thank you to Khalid Mwinge for reviewing grade placement, and to the African NLP community whose work made a language-specific benchmark feel like the obvious next step.

_Dataset: [nileagi/nileagi-sub-edu](https://huggingface.co/datasets/nileagi/nileagi-sub-edu) · Code: [github.com/nile-agi/nileagi-sub](https://github.com/nile-agi/nileagi-sub)_

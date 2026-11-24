---
layout: distill
title: "StepBench: Diagnosing Where AI Agents Go Wrong"
date: 2026-11-23 12:00:00
description: "StepBench tests where AI agents' plans break by asking models to recover, repair and reorder the steps of 6,885 real-world procedures, instead of grading only the final plan."
author: "Hossein A. Rahmani"
authors:
  - name: "Hossein A. Rahmani"
    url: "https://rahmanidashti.github.io/"
    image: "hossein-rahmani.jpg"
    bio: "Hossein A. Rahmani is a final-year PhD student in the UCL NLP Group at the UCL Centre for AI, supervised by Prof. Emine Yilmaz. His research focuses on evaluating and improving language models and agents, including agentic evaluation, optimisation, and self-improvement."
    affiliations:
      name: "Centre for AI, UCL"
  - name: "Bin Wu"
    affiliations:
      name: "Centre for AI, UCL"
  - name: "Chaeeun Lee"
    affiliations:
      name: "University of Edinburgh"
  - name: "Fanghua Ye"
    affiliations:
      name: "Centre for AI, UCL"
  - name: "Sahan Bulathwela"
    affiliations:
      name: "Centre for AI, UCL"
  - name: "Sujay Kumar Jauhar"
    affiliations:
      name: "Microsoft"
  - name: "Marzieh Fadaee"
    affiliations:
      name: "Cohere Labs"
  - name: "Nick Craswell"
    affiliations:
      name: "Microsoft"
  - name: "Emine Yilmaz"
    affiliations:
      name: "Centre for AI, UCL"
tags: research benchmarks planning agents evaluation
hero:
  type: waves
  motion: auto
  seed: stepbench
  intensity: 0.72
  og_image: /assets/img/brand/cohere-labs-community-lockup.svg
toc: true
bibliography: 2026-11-23-stepbench.bib
---

> **TL;DR**. StepBench turns 6,885 real-world procedures into five diagnostic tasks: last-step selection, missing-step recovery, incorrect-step detection, reordering and next-step generation. It also includes full-plan generation and uses StepEval to identify critical failures in generated plans. Even when every correct step is provided, the best model restores the exact order for only 63.0% of procedures, and scores on the lightweight diagnostic tasks track whether a model's full plans are valid (Spearman 0.85 to 0.96). The paper, code, dataset, and judge are publicly available.

Imagine a plan for jump-starting a car that reads perfectly. The cables go on in the right order, the working car is left running, and nine of the ten steps are correct. In the tenth step, however, the last black clamp goes on the dead battery's negative terminal instead of on bare metal away from the battery, where it could spark near the hydrogen the battery releases. A plan like this could match a reference almost word for word and still fail at the one thing that mattered.

As language-model agents take on longer tasks involving tools and actions, planning becomes increasingly important. For everyday, open-domain tasks, however, we usually cannot run a plan at evaluation to verify its validity. Most evaluations therefore evaluate only the final plan, which hides the source of failure: whether the model omitted a step, added an incorrect one, or put the steps in the wrong order.

We therefore asked how much we could learn about the planning abilities of AI agents without having to execute their plans. To answer this question, we introduce **StepBench**<d-cite key="rahmani2026stepbench"></d-cite>, which turns 6,885 human-written, step-by-step procedures into a set of diagnostic tasks. We pair it with [**StepEval**](https://huggingface.co/rahmanidashti/StepEval), a judge that identifies failures in generated plans that would prevent successful task completion.

In this post, we share how we developed StepBench and our key findings. With every correct step provided, the strongest model we tested still restores the right order for only 63.0% of procedures. Scores on these lightweight diagnostic tasks also correlate with whether a model’s full plans are valid. We close with the limitations and several open problems we would love to see the community take on.

## Diagnosing where plans fail

Agentic planning can fail in many distinct ways. A plan may leave out a necessary step, include the wrong one, or put the steps in the wrong order. These are different kinds of mistakes, but a final plan-level metric does not show which one a model is making. Two models can therefore end up with the same score for very different reasons.

Distinguishing these failure modes requires knowing where the plan breaks. In settings where a plan can be checked automatically, we can see exactly where it fails. A robot in a simulator either reaches the goal or knocks something over, a block-stacking puzzle comes with a program that rejects any illegal move, and a script can be run to see which command errors out. That is not true for everyday written procedures like making cake flour or checking a Linux machine's uptime. StepBench gets around this by starting with a verified human procedure and introducing controlled errors, which gives us a known answer without executing the procedure itself.

{% include figure.liquid path="assets/img/2026-11-23-stepbench/stepbench-fig1-pipeline.png" alt="Pipeline diagram: how-to articles are crawled and filtered by GPT-4.1 for genuine procedural tasks, then turned into the five StepBench diagnostic tasks, T1 to T5." caption="Constructing StepBench. How-to articles are crawled, GPT-4.1 filters for genuine procedural tasks, and the selected procedures instantiate the diagnostic tasks." %}

## How we built StepBench

We crawled how-to tasks and kept the articles that describe a genuine procedural task. The result is 6,885 procedures and 30,975 reference steps across 81 categories, averaging 4.5 steps each. From each procedure, we derive five diagnostic tasks. A sixth, full-plan generation, is evaluated alongside them so we can ask whether the diagnostics predict end-to-end quality. Every task draws on the same pool of procedures, so a model's scores are directly comparable across tasks.

{% include figure.liquid path="assets/img/2026-11-23-stepbench/stepbench-fig2-tasks.png" alt="StepBench task overview illustrating last-step selection, missing-step recovery, incorrect-step detection, step reordering, next-step generation and full-plan generation, using a glute bridge example." caption="The tasks for one example procedure, 'Perform a glute bridge'. Given, withheld, incorrect, shuffled and generated steps are marked as in the key." %}

## StepEval: Judging Plans that Look Different

T1 to T4 tasks have known answers, but the generated plans do not: a valid plan can word, group, or even order its steps differently from the reference, so text overlap is a poor judge. In our results, [Qwen3 4B](https://huggingface.co/Qwen/Qwen3-4B) scores 18.7 ROUGE-L on full plans, the second highest of all configurations, yet only 11.2% of its plans are valid.

StepEval instead asks whether a plan contains a critical failure, an error severe enough to prevent the goal, following the formulation of How2Everything<d-cite key="how2everything2026"></d-cite>. Harmless variation is accepted. Asked to make cake flour from all-purpose flour, one model repeats the sifting steps and never swaps in cornstarch. That is a critical failure, because sifting alone does not change the flour. Asked to check Linux uptime, another model types uptime where the reference has uptime -p. The output format differs, but you still learn the uptime, so the plan counts as valid.

A model's valid-plan rate (VPR) is the share of its plans with no critical failure. GPT-5<d-cite key="openai2026gpt5"></d-cite> agrees with the majority of three human annotators on 85.5% of 200 plans. To keep large-scale evaluation affordable, we distilled it into an 8B judge trained on 82K GPT-5 annotations. That judge agrees with GPT-5 on 92% of examples and with the human majority on 82.5%.

## What we found

We evaluated 12 models in 14 configurations, counting thinking modes and temperature settings. They range from [Llama 3.1 8B](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) to GPT-5.6-sol<d-cite key="openai2026gpt56"></d-cite>, Gemini 3 Flash<d-cite key="gemini3flash2025"></d-cite> and Cohere's [Command A](https://huggingface.co/CohereLabs/c4ai-command-a-03-2025). The table below gives a compact view of the results, and four findings stand out.

| Model                          | Last step (T1) | Missing step (T2) | Incorrect step (T3) | Reordering (T4) | Next-step VPR (T5) | Full-plan VPR |
| :----------------------------- | -------------: | ----------------: | ------------------: | --------------: | -----------------: | ------------: |
| GPT-5.6-sol                    |           75.7 |              73.6 |                66.5 |        **63.0** |           **79.7** |      **92.1** |
| Gemini 3 Flash (thinking, T=0) |       **78.8** |          **78.2** |            **71.1** |            58.7 |               77.0 |          84.5 |
| Command A Reasoning            |           67.9 |              43.9 |                60.5 |            51.8 |               70.0 |          82.0 |
| Command A                      |           65.5 |              59.1 |                61.2 |            44.3 |               70.7 |          67.4 |
| Qwen3 32B (thinking)           |           65.4 |              43.6 |                58.4 |            49.6 |               73.3 |          75.7 |
| Qwen3 14B                      |           53.9 |              24.9 |                56.9 |            45.3 |               71.5 |          66.2 |
| Llama 3.1 8B                   |           21.6 |              26.3 |                48.0 |            16.0 |               50.4 |          53.6 |
| Qwen3 4B                       |           25.4 |              28.2 |                49.7 |            38.0 |               64.1 |          11.2 |

_Selected results for eight of the 14 configurations. T1 to T4 are exact-match accuracy (%), and the two VPR columns are the StepEval valid-plan rate (%). The best score in each column across all 14 configurations is in bold, and random guessing scores 25% on T1 and T2. Full results are in the paper._

**Reordering is hard, even when every step is provided.** The best configuration, GPT-5.6-sol, restores the exact order for 63.0% of procedures. For that model, accuracy falls from 86.8% at two steps to 33.1% at nine or more. It often lands close to the reference order, but one misplaced step fails an exact match. Exact match is a strict test, since some steps can be swapped without harm.

{% include figure.liquid path="assets/img/2026-11-23-stepbench/stepbench-fig3-length.png" alt="Three line charts by procedure length: incorrect-step detection accuracy, exact-order accuracy and edit distance for eight configurations." caption="Scores by procedure length for eight configurations. Left: incorrect-step detection accuracy. Centre: exact-order accuracy. Right: normalised edit distance, where higher means closer to the reference." %}

In the centre panel, exact-order accuracy falls for every model as procedures grow. The right panel shows a gentler decline under edit distance, so models often land near the right order. Incorrect-step detection, on the left, does not follow the same pattern.

**Similar plan scores can hide different skills.** Command A and Qwen3 14B reach almost the same full-plan VPR (67.4% and 66.2%). Command A recovers a missing step 59.1% of the time, against 24.9% for Qwen3 14B. In a second pair, Qwen3 4B and its Instruct-2507 variant detect incorrect steps equally well (49.7% and 49.9%), yet their full-plan VPR is 11.2% and 57.3%.

**Reasoning helps unevenly.** [Command A Reasoning](https://huggingface.co/CohereLabs/command-a-reasoning-08-2025) beats Command A on full-plan VPR (82.0% against 67.4%) and on reordering (51.8% against 44.3%). Its missing-step recovery, though, falls from 59.1% to 43.9%. These are different model variants, so the comparison does not isolate the effect of reasoning.

**Diagnostic scores correlate with plan validity.** Across the 14 configurations, every diagnostic rises with full-plan VPR. The Spearman correlations are 0.96 for reordering, 0.95 for last-step selection, 0.93 for incorrect-step detection, 0.89 for next-step VPR and 0.85 for missing-step recovery. T1 to T4 need no judge and no generation, making them a lightweight way to obtain an early read on overall planning ability. The pattern holds across models; it does not promise that a model succeeds on every plan it could order correctly.

{% include figure.liquid path="assets/img/2026-11-23-stepbench/stepbench-fig4-correlation.png" alt="Left: Spearman correlation of each diagnostic task with full-plan validity. Right: reordering accuracy against full-plan validity for each configuration." caption="Correlations between the five diagnostic tasks and end-to-end plan validity. (a) Spearman correlation with full-plan VPR across the 14 configurations. (b) Reordering accuracy against full-plan VPR, one point per configuration." %}

Two configurations break the pattern. Qwen3 4B orders steps about as well as its peers but produces valid plans only 11.2% of the time, while Llama 3.1 8B orders worst (16.0%) yet reaches 53.6% valid plans. Rank correlation tolerates a few outliers like these, which is one reason to read the profile rather than a single number.

## Could memorisation explain the results?

The source articles are public, so some models may have seen these procedures during training. To probe thi, we built StepBench-Val: 214 procedures and 1,034 steps from 94 articles published in 2026, spanning 27 of the main categories.

After matching category mix and procedure length, accuracy on T1 to T3 moves by 1.4 points or less on average. Reordering drops 8.3 points, and next-step VPR drops 7.5. Full-plan VPR falls 16.2 points, a gap we do not fully explain. Model rankings stay largely intact, with rank correlations between 0.77 and 0.99 across the diagnostics.

{% include figure.liquid path="assets/img/2026-11-23-stepbench/stepbench-fig5-val.png" alt="Left: change in scores on the 2026 set, raw and after matching category and length. Right: model scores on the 2026 set against the main set for T3 and T6." caption="StepBench-Val against the main set. Left: mean score change, raw and after matching category composition and procedure length. Right: each model's score on the two sets for T3 and T6; the dashed line marks no change." %}

StepBench-Val is a smaller set built from newer articles, so we treat it as a robustness check rather than a full contamination test. The main takeaway is that model rankings remain stable on fresh data. We expect absolute scores, especially for reordering and full plans, to be somewhat sensitive to what models saw in training.

## Limitations and what comes next

StepBench covers English-language procedures from a single public source, mostly everyday tasks, and the procedures are short (4.5 steps on average). StepEval depends on the quality of its reference and on judgements about what counts as acceptable variation, and its 82.5% agreement with the human majority leaves room for error. Exact-match ordering penalises plans whose steps could be swapped harmlessly. Compute and API budgets also limited how many models and configurations we could run.
These gaps point to problems we would love to see the community explore:

- **Other languages and sources.** Do the same diagnostic profiles appear for procedures written in other languages, or drawn from specialised domains?
- **Longer, harder plans.** Reordering gets harder as procedures grow. What happens on plans with dozens of steps, branches or tool calls?
- **Interchangeable steps.** Annotating which steps can be reordered would turn exact match into a fairer test of ordering.
- **Human baselines.** How do people score on T1 to T4, and where do models and people fail differently?

## Try it yourself

Everything is open: the corpus, the task files for all five diagnostic tasks and full-plan generation, model outputs, judge annotations and analysis code. The paper provides the prompts, evaluation settings, and fuller analyses behind the results discussed here.

- **Paper:** [arxiv.org/abs/2610.26679](https://arxiv.org/abs/2610.26679)
- **Code:** [github.com/rahmanidashti/StepBench](https://github.com/rahmanidashti/StepBench)
- **StepBench:** [StepBench on Hugging Face](https://huggingface.co/datasets/rahmanidashti/StepBench)
- **StepEval:** [StepEval on Hugging Face](https://huggingface.co/rahmanidashti/StepEval)

Each task is its own configuration, with a test split (the main benchmark) and a validation split (StepBench-Val):

```Python
from datasets import load_dataset

 reorder = load_dataset(
 	"rahmanidashti/StepBench",
 	"task4_step_reordering",
 	split="test",
 )
 print(reorder[0]["method_title"])
```

One caution: records hold both task inputs and reference answers. Build prompts from the model-visible fields listed in the dataset card, never from whole records, or the answer leaks into the prompt.

> **Reproducibility at a glance**
>
> **Data.** 6,885 procedures, 30,975 steps and 81 categories. The main benchmark is the test split, and StepBench-Val (214 procedures from 94 articles published in 2026) is the validation split. Each task is its own Hugging Face configuration. A GPT-4.1<d-cite key="openai2025gpt41"></d-cite> filter selected genuine procedural tasks, and distractors are retrieved from other procedures in the same category.
>
> **Models.** 12 models in 14 configurations: [Qwen3 4B](https://huggingface.co/Qwen/Qwen3-4B), [8B](https://huggingface.co/Qwen/Qwen3-8B), [14B](https://huggingface.co/Qwen/Qwen3-14B) and [32B](https://huggingface.co/Qwen/Qwen3-32B), [Qwen3 4B Instruct 2507](https://huggingface.co/Qwen/Qwen3-4B-Instruct-2507), [Llama 3.1 8B Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct), [Gemma 3 27B](https://huggingface.co/google/gemma-3-27b-it), [GLM-4 9B](https://huggingface.co/zai-org/GLM-4-9B-0414), GPT-5.6-sol, Gemini 3 Flash, [Command A](https://huggingface.co/CohereLabs/c4ai-command-a-03-2025) and [Command A Reasoning](https://huggingface.co/CohereLabs/command-a-reasoning-08-2025). Exact model IDs are in the paper.
>
> **Decoding.** Greedy decoding (T=0) unless a provider requires otherwise, plus one sampled configuration (Gemini 3 Flash at T=1) to check that conclusions do not depend on greedy decoding. Qwen3 32B is run with and without thinking, while Command A Reasoning and Gemini 3 Flash are run in thinking mode only. All models share the same prompts and parsers, and the prompts are listed in the paper appendix.
>
> **Scoring.** Exact match for T1 to T4, with normalised edit distance also reported for reordering. Outputs that cannot be parsed count as incorrect. Next-step and full-plan outputs are scored by StepEval valid-plan rate (Qwen3 8B fine-tuned on GPT-5 annotations, decoded with T=0, top-p 0.95 and top-k 20), with ROUGE and BERTScore reported as secondary metrics.

## Acknowledgements

StepBench is a joint work with Bin Wu, Chaeeun Lee, Fanghua Ye, Sahan Bulathwela, Sujay Kumar Jauhar, Marzieh Fadaee, Nick Craswell and Emine Yilmaz. This research is supported in part by the [Cohere Labs Catalyst Grant Program](https://cohere.com/research/grants), by the Engineering and Physical Sciences Research Council (EP/S021566/1) and the EPSRC Fellowship "Task Based Information Retrieval" (EP/P024289/1), and by NVIDIA DGX Spark compute provided for the grant "Agentic Evaluation: Efficient and Reliable Evaluation for Agentic AI Systems".

**Disclosure.** Command A and Command A Reasoning, two of the models we evaluate, are Cohere models, and Marzieh Fadaee, one of our co-authors, is at Cohere Labs. All models were run with identical prompts, parsers and judges, and funding from the Cohere Labs Catalyst Grant Program does not imply endorsement of the results.

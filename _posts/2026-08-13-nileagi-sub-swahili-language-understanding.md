---
layout: distill
title: "NILEAGI-SUB: An Evaluation Programme for Swahili Language Understanding"
date: 2026-08-13 00:00:00
description: "We introduce NILEAGI-SUB, an evaluation programme built to measure Swahili language understanding across real-world sectors, evaluated one sector at a time under the same controlled protocol. This first report covers education: 2,569 expert-reviewed Swahili multiple-choice items spanning Standard 3–7 and Form 2–4, evaluated across eight open models with 2–5 billion parameters."
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

Swahili is spoken by over 200 million people across East and Central Africa, in classrooms, clinics, banks, farms, and stadiums alike, yet language models are rarely tested on how well they actually understand it in any of these settings. Most multilingual benchmarks treat Swahili as one line in a large table of languages, rather than testing it in the sectors where people actually use it. A model that handles conversational Swahili well is not thereby shown to handle Swahili medical terminology, financial language, or school curriculum content correctly.

We built **NILEAGI-SUB** (the NileAGI Swahili Understanding Benchmark) to close that gap sector by sector: an evaluation programme that measures Swahili understanding in real-world sectors — health, finance, sports, education — one sector at a time, under the same controlled protocol. This post covers our first sector, education, and its released dataset, **SUB-MCQ EDUCATION**: 2,569 expert-reviewed Swahili multiple-choice items drawn from the Swahili-subject curriculum, spanning Standard 3–7 and Form 2–4, evaluated across eight open models with 2–5 billion parameters.

## TL;DR

- **SUB-MCQ EDUCATION** is a grade-stratified benchmark of 2,569 validated Swahili school items, reviewed by a Swahili language expert. The [dataset](https://huggingface.co/datasets/nileagi/nileagi-sub-edu) and [evaluation code](https://github.com/nile-agi/nileagi-sub) are released for independent verification.
- Under identical items, deterministic decoding, and unified scoring, **Gemma 4 E4B leads at 54.8%**, followed by **AfriqueQwen3.5-4B at 50.3%** — a gap that an exact McNemar test says is unlikely to be chance ($p < 0.001$).
- **Size does not explain the ranking.** Accuracy spans roughly 27 points across a common 2–5B budget, and AfriqueQwen3.5-4B beats the similarly sized Qwen3.5-4B by 14.9 points.
- **Regional branding is not automatic gain.** Tiny Aya Earth (West Asia/Africa variant) and Tiny Aya Global differ by only 0.7 points ($p = 0.274$).
- The best model still gets ~45% of items wrong, and we are explicit about single-annotator and contamination risks: this is a provisional Level I baseline, not a settled leaderboard.

## Why a sector-by-sector Swahili benchmark

Within education specifically, no standardized benchmark existed for measuring school-level Swahili understanding across open models under controlled, comparable conditions. Fluency in generated Swahili is not a sufficient proxy: a model can produce plausible text while failing on curriculum-aligned vocabulary, factual knowledge, or grade-appropriate reasoning <d-cite key="joshi2020state,hu2020xtreme"></d-cite>.

The gap is not simply one of data scarcity. Cross-lingual suites such as XTREME and XTREME-R measure transfer across many languages and tasks <d-cite key="hu2020xtreme,ruder2021xtremer"></d-cite>, FLORES targets translation quality <d-cite key="goyal2022flores"></d-cite>, BELEBELE targets multilingual reading comprehension <d-cite key="bandarkar2024belebele"></d-cite>, and the MMLU family probes broad subject competence, typically in English-centric form <d-cite key="hendrycks2021mmlu"></d-cite>. All are valuable, but none provides a grade-stratified Swahili educational signal under a protocol designed for models at consumer- or edge-feasible scale. Where comparisons across Swahili-capable models do appear, they frequently mix incompatible prompts, decoding settings, or parameter scales, which makes it difficult to attribute an observed gain to language ability, model capacity, or evaluation design. Community efforts such as MasakhaNER demonstrate that language-specific evaluation surfaces phenomena that global aggregates miss <d-cite key="adelani2021masakhaner"></d-cite>, but we are not aware of a matched, grade-stratified instrument for generative Swahili understanding at the time of writing — and we would welcome pointers to prior work we may have missed.

School-level multiple choice is a deliberate starting point. School questions impose an interpretable progression of vocabulary, reading demand, and subject knowledge, and reflect a practical use case: students, teachers, and educational technology providers require systems that handle instructional Swahili correctly. The format enables exact scoring without a second model acting as judge, at the cost of not measuring free-form explanation quality (a limitation we return to below).

We focus first on models in the approximately 2–5B parameter range — Level I of a five-level roadmap — because they are the most plausible candidates for local inference, constrained hardware, and institution-specific deployment: the conditions under which Swahili-language systems are most likely to be adopted in practice. Restricting the first comparison to a narrow parameter band also reduces the capacity confound that otherwise dominates cross-model claims. The question this report answers is narrow: how well do open, or openly accessible, multilingual language models answer school-level multiple-choice questions written in Swahili, when evaluated on identical items under deterministic decoding and a unified scoring protocol?

## The dataset: SUB-MCQ EDUCATION

SUB-MCQ EDUCATION draws its items from the Swahili-subject curriculum specifically — the language-arts subject in which Tanzanian and Kenyan students are examined on Swahili grammar, comprehension, vocabulary, and literature — rather than from other subjects (mathematics, science, and so on) that happen to be taught in Swahili medium. This distinction matters for how the results should be read: strong performance indicates a model handles the Swahili-subject curriculum well, not that it can reason correctly about other school subjects when those are posed in Swahili.

| Grade band |     Items | Share (%) |
| ---------- | --------: | --------: |
| Standard 3 |        66 |       2.6 |
| Standard 4 |       116 |       4.5 |
| Standard 5 |       274 |      10.7 |
| Standard 6 |       651 |      25.3 |
| Standard 7 |       517 |      20.1 |
| Form 2     |       399 |      15.5 |
| Form 3     |       125 |       4.9 |
| Form 4     |       421 |      16.4 |
| **Total**  | **2,569** | **100.0** |

### Construction and validation

The source collection contains 2,608 records, each with a Swahili question (_swali_), a school-grade field (_hatua_), answer options (_machaguo_), and an answer key (_jibu_). A deterministic loader maps grade labels, normalizes option prefixes, rejects empty or invalid options, requires at least two answer choices, discards records with an ambiguous or unmappable grade label, and retains only answer keys that refer to an available option. After validation, 2,569 items remain across eight grade bands, from Standard 3 to Form 4; stable sequential IDs are assigned where source IDs are absent.

All items were labeled and reviewed for grade placement by a single qualified Swahili language expert, Khalid Mwinge, providing a linguistic quality check ahead of the automated structural validation described above. We use "validated" in this report to mean that an item has passed this structural check and single-expert grade review — not that it has passed independent double annotation or answer-key adjudication by a second subject specialist; that stronger form of validation has not yet been performed and is listed in the limitations.

### Grade structure and the chance baseline

The grade table shows a deliberate imbalance: Standard 6 and Standard 7 together account for nearly half of all items, while the earliest primary bands are comparatively small. Overall accuracy is therefore dominated by the larger bands, and grade-level percentages carry unequal statistical precision. The validated set contains 1,408 five-option items, 1,125 four-option items, 31 three-option items, and 5 two-option items; 98.6% of items have four or five options.

Because items have different numbers of options, we need a baseline for what a model with no Swahili understanding at all would score, simply by picking an answer at random. Without this baseline, a raw accuracy number is hard to interpret: 40% sounds low in absolute terms, but it is meaningfully above chance if most items offer five options (where random guessing scores only 20%). We compute this baseline per item, as one divided by that item's number of options, and then average across all items:

$$
A_{\mathrm{chance}} = \frac{1}{N}\sum_{i=1}^{N}\frac{1}{K_i} = 22.41\%,
$$

where $N$ is the total number of items and $K_i$ is the number of options for item $i$. Any model scoring at or below 22.4% is not doing better than blind guessing, so all further comparisons are read relative to that floor.

SUB-MCQ EDUCATION is sufficiently validated to support a reproducible baseline, but it is not yet a fully audited national examination corpus. We recommend that public release be preceded by duplicate detection, source and license documentation, further educator review, answer-key verification against additional annotators, topic annotation, and a formal train/development/test split.

## How we evaluated

### Model set

| Model                 | Params. | Access       | Evaluation note                         |
| --------------------- | ------: | ------------ | --------------------------------------- |
| Gemma 4 E4B IT        |    4.5B | Hugging Face | Instruction/chat prompt                 |
| AfriqueQwen3.5-4B     |    4.0B | Hugging Face | African-language CPT; completion prompt |
| AfriqueGemma-4B       |    4.0B | Hugging Face | African-language CPT; completion prompt |
| Qwen3.5-4B            |    4.0B | Hugging Face | Chat prompt; thinking disabled          |
| Tiny Aya Earth        |   3.35B | Cohere API   | Regional variant (West Asia, Africa)    |
| Tiny Aya Global       |   3.35B | Cohere API   | Balanced release across all regions     |
| Llama 3.2 3B Instruct |    3.2B | Hugging Face | Instruction/chat prompt                 |
| Qwen3.5-2B            |    2.0B | Hugging Face | Chat prompt; thinking disabled          |

"Access" describes the evaluation path used here, not a claim that all licenses are identical. We use "open" as a practical umbrella for open-weight or openly accessible research releases; licenses differ across models and must be checked independently before deployment. Tiny Aya is accessed through Cohere's API; the remaining models are evaluated from Hugging Face weights. The set deliberately combines strong general-purpose multilingual checkpoints, African-language continued-pretraining (CPT) variants, and regional versus global Tiny Aya siblings <d-cite key="ustun2024aya,tinyaya2026,gemma2026,afriquellm2026,llama2024,qwen2025"></d-cite>, so that the comparison spans the principal adaptation strategies currently used for African-language deployment at this scale.

### Prompting and decoding

Instruction-tuned models receive a Swahili system instruction that requests a single answer letter (A–E), followed by the question, labeled options, and optional passage context. Qwen thinking mode is disabled so that hidden reasoning traces neither consume the output budget nor complicate answer extraction.

The Afrique checkpoints <d-cite key="afriquellm2026"></d-cite> are CPT base models rather than instruction-tuned chat checkpoints; chat templates produced unreliable free-form continuations for these models in preliminary testing. They therefore receive a completion-format prompt with one Swahili demonstration, with the target item ending in `Jibu:`. Model-compatible prompting is a precondition for valid measurement; as a result, comparisons between Afrique and non-Afrique models should be read as outcomes under matched evaluation conditions for each model family, not as a controlled estimate of the causal effect of continued pretraining in isolation.

To illustrate the two prompt formats concretely (with a constructed item, to avoid reproducing answer-sensitive content): instruction-tuned models receive a Swahili system message such as "Jibu kwa herufi moja tu (A, B, C, D, au E)", followed by the question and labeled options, and are expected to return a single letter. The Afrique completion-format prompt instead gives one worked Swahili demonstration question with its answer, followed by the target question ending in the bare cue `Jibu:`, so that the model's next generated token is the answer letter rather than a continuation of free-form chat.

Locally hosted models use greedy decoding; Cohere requests use temperature zero, matching the deterministic decoding used elsewhere in the protocol. The scorer strips `<think>` blocks, accepts direct letters and explicit answer prefixes, and rejects ambiguous outputs that reproduce the full option list without committing to an answer. An exact letter match to the validated key counts as correct; missing or unparseable outputs count as incorrect. Aggregate results are saved after each model completes, with item-level checkpoints every 50 questions to support interruption-safe resumption.

### Compute infrastructure

The six locally hosted open-weight models were run on a single rented GPU instance: one NVIDIA RTX A5000 (24 GB VRAM), driver version 535.309.01, CUDA 12.2. A single 24 GB consumer/workstation-class GPU is sufficient to serve every locally hosted checkpoint in this report sequentially — consistent with our framing of Level I as the locally feasible parameter range. It is not sufficient, on its own, for the larger checkpoints planned in Level II and beyond, which will require either a larger single device, multi-GPU sharding, or continued reliance on hosted APIs.

### Metrics

Our primary metric is exact-match accuracy: the fraction of items where the model's extracted answer letter matches the validated key exactly.

$$
\mathrm{Accuracy} = \frac{1}{N}\sum_{i=1}^{N} \mathbb{1}\left[\hat{y}_i = y_i\right].
$$

Here $\hat{y}_i$ is the model's answer on item $i$, $y_i$ is the correct answer, and $\mathbb{1}[\cdot]$ is the indicator function: 1 when the model's answer matches the key and 0 otherwise.

A single accuracy percentage does not say how much that percentage might shift if we had drawn a different, similarly difficult set of test items. For this we report a 95% Wilson score interval alongside each accuracy figure: a range of values likely to contain the model's true accuracy on the wider population of similar Swahili-subject questions, not just this particular sample of 2,569. Wilson intervals are the standard choice for proportions like accuracy because, unlike a simple ± margin, they stay within the valid 0–100% range and remain reliable even when accuracy is close to 0% or 100% or the sample is not very large.

Because all models answer the same 2,569 items, we do not treat each model's accuracy as fully independent of the others when comparing two models directly. Instead, for a chosen pair of models, we use a paired exact McNemar test: we look only at the items where the two models disagree (one got it right and the other wrong), and ask whether one model wins those disagreements more often than we would expect from a fair coin flip. This is a more targeted test than comparing two accuracy percentages in isolation, because it isolates exactly the items that could have gone either way. A small p-value means the observed imbalance is unlikely to be due to chance alone. These tests are descriptive: hypotheses were not preregistered, and we do not apply a correction for the full set of possible pairwise comparisons.

## Results

### Overall ranking

| Rank | Model             | Correct | Accuracy | 95% CI       |
| ---: | ----------------- | ------: | -------: | ------------ |
|    1 | Gemma 4 E4B       |   1,407 | **54.8** | [52.8, 56.7] |
|    2 | AfriqueQwen3.5-4B |   1,292 |     50.3 | [48.3, 52.2] |
|    3 | AfriqueGemma-4B   |   1,116 |     43.4 | [41.5, 45.3] |
|    4 | Tiny Aya Earth    |   1,063 |     41.4 | [39.5, 43.3] |
|    5 | Tiny Aya Global   |   1,045 |     40.7 | [38.8, 42.6] |
|    6 | Qwen3.5-4B        |     909 |     35.4 | [33.5, 37.2] |
|    7 | Qwen3.5-2B        |     748 |     29.1 | [27.4, 30.9] |
|    8 | Llama 3.2 3B      |     715 |     27.8 | [26.1, 29.6] |

{% include figure.liquid path="assets/img/2026-08-13-nileagi-sub-swahili-language-understanding/fig1_overall_accuracy.png" alt="Horizontal bar chart of overall exact-match accuracy for eight compact models, from Gemma 4 E4B at 54.8% down to Llama 3.2 3B at 27.8%, with a dashed line marking the 22.4% expected chance baseline and Tiny Aya Earth highlighted." caption="Overall exact-match accuracy. The dashed line marks the 22.4% expected accuracy of uniform random guessing over each item's observed number of choices. Tiny Aya Earth is highlighted as the West Asia/Africa regional variant." %}

Gemma 4 E4B attains the highest accuracy, 54.8%, 4.5 percentage points above AfriqueQwen3.5-4B (50.3%). Of the 2,569 items, Gemma 4 E4B is uniquely correct on 454 and AfriqueQwen3.5-4B is uniquely correct on 339; an exact McNemar test on these discordant outcomes rejects the null hypothesis of equal accuracy ($p < 0.001$), indicating that the gap reflects a systematic difference between the two models rather than sampling variance.

The spread across the full model set is larger than the gap between the top two models. All eight models exceed the 22.4% chance baseline, yet the highest- and lowest-scoring models differ by 26.9 percentage points<d-footnote>Computed from unrounded per-model accuracies; subtracting the one-decimal figures in the table directly (54.8 − 27.8) gives 27.0, a discrepancy of 0.1 points from rounding that does not affect any conclusion.</d-footnote> despite sharing a common 2–5B parameter budget. Selecting a model for Swahili deployment on the basis of reported size rather than measured accuracy is unreliable.

AfriqueQwen3.5-4B outperforms the similarly sized Qwen3.5-4B checkpoint by 14.9 percentage points. We do not attribute this gap solely to African-language CPT, because the two checkpoints also require different prompt formats; pretraining data and prompt format are confounded in this comparison. Isolating their individual contributions requires a controlled ablation over matched base, CPT, and instruction-tuned checkpoints, which we identify as a priority for Level II.

### Grade-level behavior

| Model             |  Std 3 |  Std 4 |  Std 5 |  Std 6 |  Std 7 | Form 2 | Form 3 | Form 4 |
| ----------------- | -----: | -----: | -----: | -----: | -----: | -----: | -----: | -----: |
| Gemma 4 E4B       |     65 | **68** |     55 | **50** | **55** | **62** | **55** | **50** |
| AfriqueQwen3.5-4B | **71** |     60 | **59** |     46 |     51 |     54 |     51 |     41 |
| AfriqueGemma-4B   |     65 |     49 |     48 |     40 |     43 |     49 |     45 |     35 |
| Tiny Aya Earth    |     48 |     42 |     46 |     34 |     42 |     46 |     51 |     40 |
| Tiny Aya Global   |     58 |     45 |     44 |     32 |     42 |     47 |     54 |     37 |
| Qwen3.5-4B        |     42 |     41 |     38 |     29 |     33 |     44 |     42 |     34 |
| Qwen3.5-2B        |     33 |     28 |     29 |     26 |     26 |     36 |     34 |     29 |
| Llama 3.2 3B      |     35 |     30 |     29 |     26 |     26 |     31 |     30 |     27 |

Accuracy (%) by school grade. Bold indicates the highest score in each column.

{% include figure.liquid path="assets/img/2026-08-13-nileagi-sub-swahili-language-understanding/fig2_category_heatmap.png" alt="Heatmap of accuracy by school grade (Standard 3 through Form 4) and model, with grade bands ordered from Standard 3 to Form 4." caption="Accuracy by school grade and model. Grade bands are ordered from Standard 3 to Form 4." %}

Aggregate accuracy can obscure grade-specific strengths. AfriqueQwen3.5-4B attains the highest accuracy on Standard 3 (71%) and Standard 5 (59%); Gemma 4 E4B leads on the remaining six bands, with the largest margins in Form 2 and Form 4. These per-band comparisons carry unequal statistical power: Standard 3 contains 66 items, roughly a tenth of the 651 items in Standard 6. Concretely, AfriqueQwen3.5-4B's 71%-vs-65% lead over Gemma 4 E4B on Standard 3 corresponds to a margin of roughly four items out of 66; a different sample of similarly difficult Standard 3 questions could plausibly reverse this particular ranking, even though the overall ranking is well powered.

### Regional specialization is not automatic

Tiny Aya Earth is one of three regional variants released alongside Tiny Aya Global, and is described by its publisher as tuned for West Asian and African languages together, not for African languages exclusively; readers should not assume Earth was optimized for Swahili specifically. Earth attains 41.4% accuracy and Global 40.7%; Earth is uniquely correct on 130 discordant items and Global on 112, and an exact McNemar test does not reject the null hypothesis of equal accuracy ($p = 0.274$). At this sample size, we find no evidence that the West Asia/Africa-tuned variant confers an overall advantage for Swahili specifically.

The two variants do diverge at the grade level: Global outperforms Earth on Standard 3, Standard 4, Form 2, and Form 3, while Earth outperforms Global on Standard 5, Standard 6, and Form 4; the two are tied on Standard 7. A model's stated regional tuning does not, by itself, predict its accuracy on one particular language within that region — claims of language-specific benefit from regional tuning warrant direct, language-specific evaluation.

### Parameter count is not a reliable predictor

{% include figure.liquid path="assets/img/2026-08-13-nileagi-sub-swahili-language-understanding/fig3_params_vs_accuracy.png" alt="Scatter plot of reported model size in billions of parameters against overall accuracy, showing similarly sized models with large performance differences within the 2–5B range." caption="Reported model size versus overall accuracy. Within this narrow parameter range, similarly sized models exhibit large performance differences." %}

Models with approximately 4B parameters span 35.4% to 50.3% accuracy — a 14.9-point range at a fixed nominal size — and the 4.5B Gemma checkpoint reaches 54.8%, exceeding several smaller and similarly sized models in the set. Architecture, pretraining mixture, instruction tuning, tokenization, and prompt compatibility are all plausible contributors to this variance, and we cannot isolate their individual effects from a fixed set of released checkpoints with heterogeneous training recipes. Because parameter counts are provider-reported and architectures differ across models, we treat this figure as descriptive evidence against a simple parameter-count heuristic, rather than as a controlled scaling-law analysis.

{% include figure.liquid path="assets/img/2026-08-13-nileagi-sub-swahili-language-understanding/fig5_radar_top_models.png" alt="Radar chart of per-grade accuracy profiles for the five highest-scoring models across Standard 3 to Form 4." caption="Per-grade profiles for the five highest-scoring models. The radar chart is descriptive; the heatmap should be preferred for precise comparisons." %}

No single model dominates every grade band by a uniform margin, but Gemma 4 E4B and AfriqueQwen3.5-4B maintain higher accuracy across most bands than the remaining three top-five models. The radar chart communicates overall shape; exact per-band values are in the grade table.

## What this means

**For model development, three implications follow.** First, African-language continued pretraining shows a clear empirical benefit in this comparison, but its contribution should be isolated with controlled ablations rather than assumed from training narratives. Second, prompt compatibility is a component of measured model quality, not incidental to it: a checkpoint evaluated under a mismatched interface will be systematically underestimated. Third, claims of regional specialization warrant evaluation on language-specific, task-specific benchmarks rather than inference from training data composition alone.

**What these scores do and do not tell us.** This is a model evaluation exercise, not a study of, or recommendation for, educational technology deployment, teacher replacement, or curriculum policy. The highest-accuracy model still answers approximately 45% of items incorrectly, so the results say only that current 2–5B Swahili models vary widely in Swahili-subject question-answering accuracy — not that any of them is ready for, or intended for, use in a classroom. SUB-MCQ EDUCATION supports model selection and error analysis for researchers and model developers; it does not certify any system for educational use.

**Contamination is a live threat to these rankings, not a footnote.** We have not established whether any evaluated model's training corpus contains the source questions or close paraphrases of them, and we did not have the resources at this stage to run a contamination detection pass. This matters more than a routine limitation: the central claim of this report is that architecture and adaptation strategy, not parameter count, explain the observed ranking. If, for example, Gemma 4 E4B's pretraining corpus happened to include more of these specific Tanzanian or Kenyan educational materials than the other checkpoints', part of its lead could reflect memorization rather than Swahili understanding. We flag this explicitly so that the ranking is read as provisional pending a private, held-out test set, rather than as a settled leaderboard.

## The road ahead

Comparing models across widely different parameter counts risks conflating raw capacity with language-specific ability, so NILEAGI-SUB organizes evaluation into five model-scale levels; comparative claims are made within, rather than across, peer classes. This report completes Level I for the education dataset.

| Level | Approx. class             | Example models (illustrative)                   | Status              | Purpose                                                        |
| ----- | ------------------------- | ----------------------------------------------- | ------------------- | -------------------------------------------------------------- |
| I     | Foundational (2–5B)       | Gemma 4 E4B, Qwen3.5-4B, Tiny Aya, Llama 3.2 3B | Completed           | Open baselines at locally feasible scale; focus of this report |
| II    | Mid-size (6–15B)          | Llama 3.1 8B, Gemma 4 12B, Qwen3 14B            | Scoped, not started | Test whether broader capacity improves grade robustness        |
| III   | Large (16–40B active)     | Qwen3 32B, small MoE models                     | Scoped, not started | Compare high-capability open multilingual systems              |
| IV    | Frontier (41–100B active) | Llama 3.1 70B class, large MoE                  | Not started         | Evaluate advanced reasoning under matched protocols            |
| V     | Ultra-scale (large MoE)   | Frontier-scale open releases as they emerge     | Not started         | Study frontier multilingual transfer and efficiency            |

Example models are illustrative of each size class at the time of writing, not a committed evaluation list. Beyond the roadmap, our near-term priorities are: strengthening SUB-MCQ EDUCATION (provenance metadata, duplicate detection, additional answer-key annotators, topic labels, difficulty estimates); creating a protected held-out test set to reduce contamination and leaderboard overfitting; robustness studies (option-order randomization, prompt paraphrases, repeated API runs, calibration); controlled adaptation ablations over matched base, CPT, and instruction-tuned checkpoints within one architecture; and human baselines from teachers, students, and subject experts. We also intend to apply the same construction and validation pipeline to other sectors — tentatively health, finance, sports, law, culture, and agriculture — and to additional African languages, with language-specific governance and community review. No work on those extensions has started; we name them only to indicate direction.

## Limitations (read before citing us)

1. **Single-annotator verification.** Items passed automated structural validation and one expert's grade review, not independent double annotation or answer-key adjudication.
2. **Potential contamination.** No contamination-detection pass has been run; a private held-out test set is needed for stronger claims.
3. **Dataset provenance and licensing.** A complete source and license audit is required before public redistribution.
4. **Grade imbalance.** Per-grade sample sizes vary from 66 to 651, weighting the overall score toward larger bands.
5. **Multiple-choice scope.** Exact-choice accuracy does not measure explanation quality, dialogue, generation, safety, or pedagogical usefulness.
6. **Prompt differences.** CPT base models and chat models require different prompt formats, limiting causal claims about adaptation.
7. **Single-run decoding.** Greedy decoding does not measure sensitivity to prompt wording, option order, or stochastic generation.
8. **Model access and versions.** Hosted APIs and model revisions can change; results apply to the identifiers and execution period reported.
9. **No human baseline.** Models are not yet compared against students, teachers, or subject experts.
10. **Single sector, single level.** Only education at Level I is completed; findings should not be generalized further without evaluation.
11. **Funder overlap with an evaluated model provider.** This work was funded through the Cohere Labs Catalyst Grant Program, and two of the eight evaluated systems (Tiny Aya Earth and Tiny Aya Global) are Cohere models accessed through Cohere's API using Cohere-funded credits. The other six, competing, open-weight models were run on GPU compute rented and paid for separately by NileAGI. Both Tiny Aya variants rank below the top two models on every reported metric, and evaluation code and item-level outputs are released for independent verification, but the funding relationship is a conflict of interest that readers should weigh when interpreting the ranking.

## Ethics and reproducibility

Educational benchmarks can encode curriculum bias, regional language variation, outdated facts, and annotation error, so a high model score should not be read as a general endorsement of a model's use in high-stakes educational settings. We recommend that dataset governance include Swahili educators, regional language experts, documented item sources, a correction channel, versioned releases, and procedures for removing copyrighted or harmful content. Before public release, the dataset should also be screened for names, sensitive narratives, and content unsuitable for minors.

The accompanying [code repository](https://github.com/nile-agi/nileagi-sub) provides the validated JSON loading pipeline, the model registry with exact identifiers, the Swahili chat and completion prompts, deterministic answer extraction and scoring code, item-level and aggregate results, interruption-safe checkpoints, publication figures, and the GPU specification — so that reported numbers can be independently verified rather than taken on trust. The education item set is released as [nileagi/nileagi-sub-edu](https://huggingface.co/datasets/nileagi/nileagi-sub-edu) on Hugging Face. A final archival release should add a tagged software version, a package lockfile, exact model revision hashes, execution dates, a dataset license, and a permanent repository DOI.

## Conclusion

NILEAGI-SUB provides a controlled evaluation framework for Swahili school-level understanding, fixing items, prompting, decoding, and scoring across models. Across 2,569 SUB-MCQ EDUCATION items, Gemma 4 E4B reaches 54.8% accuracy and AfriqueQwen3.5-4B reaches 50.3%, while models of similar nominal size differ by more than 14 percentage points. African-language adaptation can improve Swahili accuracy but is not sufficient on its own; regional branding requires empirical validation on a specific task; and parameter count alone does not explain the observed ranking. We caveat all of these findings with the single-annotator and contamination risks above, and note that they describe one sector at one model scale.

## Acknowledgments

This research was conducted by Zephania Reuben and Isack Odero at NileAGI. We thank the African NLP and open-model communities whose work motivates language-specific, reproducible evaluation, and Khalid Mwinge, who labeled and reviewed SUB-MCQ EDUCATION.

This research was supported by a combination of API credits provided through the Cohere Labs Catalyst Grant Program and compute and operating costs funded directly by NileAGI. Funding support does not imply endorsement of the analyses or conclusions; the authors are responsible for the content of this report.

_Dataset: [nileagi/nileagi-sub-edu](https://huggingface.co/datasets/nileagi/nileagi-sub-edu) · Code: [github.com/nile-agi/nileagi-sub](https://github.com/nile-agi/nileagi-sub)_

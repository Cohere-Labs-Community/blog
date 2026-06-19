---
layout: distill
title: "When AI Doctors \"See\" What Isn't There: Why Better Accuracy Doesn't Mean Better Vision"
date: 2026-06-19 00:00:00
description: "RLVR fine-tuning raises accuracy on medical VQA benchmarks while quietly degrading visual grounding: a new counterfactual evaluation framework identify the gap."
author: "Anas Zafar"
authors:
  - name: "Anas Zafar"
    image: "authors/anas-zafar.png"
    bio: "Anas Zafar is a researcher and member of the Cohere Labs Open Science Community. His work focuses on multimodal AI evaluation, visual grounding, and AI safety in clinical settings."
    affiliations:
      name: Cohere Labs Community
  - name: "Leema Krishna Murali"
    affiliations:
      name: Cohere Labs Community
  - name: "Ashish Vashist"
    affiliations:
      name: Cohere Labs Community
tags: community research medical-ai visual-grounding multimodal open-science
hero:
  type: contour
  motion: auto
  seed: visual-grounding-medical-vlms
  intensity: 0.72
  og_image: /assets/img/brand/cohere-labs-community-lockup.svg
toc: true
bibliography: 2026-06-19-visual-grounding-medical-vlms.bib
---

Imagine a radiology AI system that confidently tells you "the liver appears normal in this CT scan, with no signs of enlargement or abnormal density" — except the image it was looking at wasn't a CT scan of the liver at all. It was a chest X-ray. The model wasn't wrong in the usual sense; it was doing something more unsettling: sounding right while seeing nothing.

This is the central finding of our paper, "Beyond Accuracy: Evaluating Visual Grounding in Multimodal Medical Reasoning" <d-cite key="zafar2026beyond"></d-cite>, published at ICLR's CAO workshop. Our work highlights an important problem in a clinical setting: when a vision-language model gets the right answer, is it actually looking at the image — or simply relying on statistical patterns in the text?

{% include figure.liquid path="assets/img/2026-06-19-visual-grounding-medical-vlms/modality-skeptic-paradox.png" alt="Side-by-side comparison of two model responses to 'Is the liver normal?' under real (abdomen CT) and shuffled (chest X-ray) conditions. The image-text RLVR model correctly declines to answer with the wrong image; the text-only RLVR model acknowledges the mismatch in its reasoning but still confidently concludes the liver appears normal." caption="The Modality Skeptic Paradox: when shown a chest X-ray instead of the expected abdominal CT, the image-text model correctly flags the mismatch and declines to answer. The text-only model acknowledges the wrong modality in its reasoning — then confidently describes a normal liver anyway." %}

## Shortcut Learning in Medical VQA Benchmarks

Our work was motivated by a recurring pattern observed across prior medical visual question answering (VQA) benchmarks. Recent works have found that models trained with reinforcement learning on text-only medical reasoning data sometimes matched or beat models trained on image-text pairs, even on benchmarks that are supposed to require looking at images.

This raises a fundamental question: if a benchmark genuinely requires visual analysis, models trained without any image data should not be competitive with those trained on image-text pairs.

We hypothesized that the root cause lies in the structure of the benchmarks themselves. Many medical VQA datasets contain exploitable textual shortcuts — patterns in question phrasing, answer distributions, and dataset construction that allow models to arrive at correct answers without ever engaging with the image. Reinforcement learning with verifiable rewards (RLVR) <d-cite key="ouyang2022rlhf,guo2025deepseekr1"></d-cite>, which optimizes for answer correctness, provides no mechanism to distinguish a model that derived its answer from visual evidence from one that relied entirely on these textual priors.

## Methodology: A Counterfactual Evaluation Framework for Visual Grounding

To investigate, we built a counterfactual evaluation framework. For each question, we tested three Qwen2.5-VL-7B <d-cite key="bai2025qwen25vl"></d-cite> model variants — a baseline, one fine-tuned with text-only RLVR, and one fine-tuned with image-text RLVR — under three conditions:

- **Real:** the original, correctly-paired image and question
- **Blank:** the same question, but with a uniform gray image
- **Shuffled:** the same question, but with a random image swapped in from the same dataset

We ran this across four well-known medical VQA benchmarks — PathVQA <d-cite key="he2020pathvqa"></d-cite>, PMC-VQA, SLAKE, and VQA-RAD — covering pathology slides, radiology, and general medical imagery.

A model that genuinely relies on visual information should produce different answers when the image is swapped or removed, and accuracy should degrade when the image no longer corresponds to the question. Stable performance across all three conditions is therefore diagnostic of text-based shortcut exploitation rather than visual reasoning.

## New Metrics for an Old Problem

Accuracy alone can't catch this, so we introduced several new measurements:

**Visual Reliance Score (VRS):** the gap between accuracy on real vs. shuffled images. A model that's truly grounded should do worse with the wrong image.

**Image Sensitivity (IS):** how often a model's answer actually changes when the image is shuffled — regardless of whether the new answer is correct.

**Hallucinated Visual Reasoning Rate (HVRR):** captures a clinically consequential failure mode — cases in which a model's reasoning trace produces specific, confident visual descriptions (such as identifying anatomical findings or lesion characteristics), yet its final answer remains invariant to the image content. Unlike standard hallucination metrics that evaluate output correctness, HVRR specifically targets the disconnect between stated visual evidence and actual image dependence, exposing models that perform visual reasoning in language without grounding it in vision.

## What We Found

Across all benchmarks, our results point to a fundamental trade-off between accuracy optimization and genuine visual reasoning under RLVR.

**Accuracy went up. Grounding went down.** The image-text RLVR model achieved the highest overall accuracy (58.8%) of the three variants. But its image sensitivity dropped to 39.8%, compared to 48.2% for the untrained baseline — meaning roughly 60% of its answers stayed the same even when shown a completely different image.

**Text-only training produced "reverse" grounding on pathology images.** On PathVQA — a benchmark of pathology microscopy images that should be maximally dependent on visual analysis — the text-only RL model actually scored better with mismatched images (65% accuracy) than with the correct ones (56%), producing a negative VRS of −0.09. In other words, the model had learned question-answer patterns so strong that the actual image became a distraction.

**Two models, same accuracy, completely different reasoning.** On VQA-RAD, both RL variants reached identical 63% accuracy but through opposite mechanisms. The text-only model retained 81% of its performance even with a blank image, revealing it was largely guessing from the question. The image-text model, meanwhile, showed its image sensitivity collapse from 43% to 29%, meaning most of its predictions ignored the image despite having been trained on visual data.

**Visual claims without visual dependence.** Across the board, models generated specific visual claims — descriptions of what they supposedly saw — in 68 to 74% of responses. But 38 to 43% of these claims were "hallucinated" in the sense that the model's final answer would have been identical no matter what image it was shown. The image-text RL model was the worst offender: when it described visual findings, that description failed to influence its answer 61% of the time.

Our standout illustration of this is what we call the **Modality Skeptic Paradox** (shown above). When shown a chest X-ray instead of the expected abdominal CT and asked "is the liver normal?", the image-text model correctly recognized the modality mismatch and refused to give a confident answer. The text-only model, however, also noted in its reasoning that a chest X-ray isn't suited for evaluating the liver — and then went ahead and confidently described the liver as normal anyway. The reasoning and the answer were completely decoupled.

{% include figure.liquid path="assets/img/2026-06-19-visual-grounding-medical-vlms/results-tables.png" alt="Two tables showing overall model performance and benchmark-specific grounding metrics across PathVQA, PMC-VQA, SLAKE, and VQA-RAD. RL(image) achieves the highest accuracy at 58.8% but the lowest image sensitivity at 39.8% and lowest visual reliance score at 0.100. PathVQA shows a negative VRS of -0.09 for RL(text), indicating text-shortcut exploitation." caption="Overall performance (Table 1) and benchmark-specific grounding metrics (Table 2): accuracy goes up with RLVR fine-tuning, but VRS and IS go down. The negative VRS on PathVQA for the text-only model means the correct image actively hurt its performance." %}

## Why This Matters

These findings matter because reinforcement learning with verifiable rewards has become a go-to method for improving LLM and VLM performance on reasoning tasks, including in medicine. Our paper shows that optimizing purely for the final answer can actively erode the very capability — visual analysis — that makes these models useful for radiology, pathology, and other image-based specialties in the first place.

A model that produces fluent medical explanations referencing specific visual features, while its actual decision is driven by something else entirely, is a serious risk in any setting where clinicians might trust the stated reasoning as a window into how the AI reached its conclusion.

## What's Next

We argue that the field needs to move past accuracy-only evaluation. Our recommendations include:

- Reporting grounding-aware metrics like VRS, IS, and HVRR alongside accuracy
- Auditing benchmarks to ensure questions genuinely require visual information rather than being solvable from text alone
- Designing training objectives that explicitly reward genuine image dependence, not just correct final answers

This work was led by Anas Zafar, Leema Krishna Murali, and Ashish Vashist — all members of the Cohere Labs Open Science Community, another example of the kind of independent research collaboration the community helps make possible.

The paper is available at [arxiv.org/abs/2603.03437](https://arxiv.org/abs/2603.03437).

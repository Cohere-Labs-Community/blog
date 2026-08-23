---
layout: distill
title: "Tiny Aya Vision"
date: 2026-08-22 01:00:00
description: "Extending Tiny Aya, a 3.35B multilingual model in 70+ languages, with lightweight visual capabilities through parameter-efficient fusion."
author: "Michael Chang"
authors:
  - name: "Michael Chang"
    url: "https://engichang1467.github.io/"
    image: "michael-chang.jpeg"
    bio: "Michael Chang is the research lead of Tiny Aya Vision. He is a machine learning engineer working on computer vision and fascinated by multimodal research."
    affiliations:
      name: Cohere Labs Community
  - name: "Gusti Winata"
    url: "https://www.linkedin.com/in/sang-gusti/"
    image: "gusti-winata.jpeg"
    bio: "Gusti Winata is an AI engineer and a Cohere Labs RL Community Lead who loves to do simulations."
    affiliations:
      name: Cohere Labs Community
  - name: "Bhavesh Kalisetti"
    url: "https://www.linkedin.com/in/bhavesh-kalisetti/"
    bio: "Bhavesh Kalisetti is a software engineer who works on building multimodal AI products for the physical world."
    affiliations:
      name: Cohere Labs Community
  - name: "Trishanu Das"
    url: "https://www.linkedin.com/in/trishanu-das-4b603620b/"
    image: "trishanu-das.jpeg"
    bio: "Trishanu Das is a Research Engineer who works at the intersection of information retrieval and NLP."
    affiliations:
      name: Cohere Labs Community
  - name: "Tahseen Rayhan"
    url: "https://www.linkedin.com/in/tahseenr/"
    image: "tahseen-rayhan.jpeg"
    bio: "Tahseen Rayhan is a student at the University of Waterloo pursuing his bachelor's in Computer Science. He recently was an intern of technical staff at Cohere working on LLM evals."
    affiliations:
      name: Cohere Labs Community
  - name: "Suparnojit Sarkar"
    url: "https://www.linkedin.com/in/suparnojit/"
    image: "suparnojit-sarkar.jpeg"
    bio: "Suparnojit Sarkar is an applied scientist who works on multimodal research."
    affiliations:
      name: Cohere Labs Community
  - name: "Siddhant Bharadwaj"
    url: "https://www.linkedin.com/in/siddhant0701/"
    image: "siddhant-bharadwaj.jpeg"
    bio: "Siddhant Bharadwaj is an MS AI student at Columbia University. His research focuses on multimodal large language models."
    affiliations:
      name: Cohere Labs Community
tags: community research multilingual vision-language-models parameter-efficient-fine-tuning open-science
hero:
  type: contour
  motion: auto
  seed: cohere-labs-community-blog
  intensity: 0.72
  og_image: /assets/img/brand/cohere-labs-community-lockup.svg
toc: true
bibliography: 2026-08-22-tiny-aya-vision.bib
---

_Part of Expedition Tiny Aya. Code: [Cohere-Labs-Community/expedition-tayavision](https://github.com/Cohere-Labs-Community/expedition-tayavision). Results below reflect an in-progress v0 model, not a finished system._

## What's Tiny Aya Vision?

**Tiny Aya Vision** is an open-weight multilingual vision-language model (VLM) with fewer than 4B parameters, and it is the first of its kind. It extends **Tiny Aya** <d-cite key="cohere2025tinyayareport"></d-cite> (3.35B, 70+ languages) with lightweight visual capabilities through parameter-efficient fusion strategies.

**Core question:** Can a small (~3B) multilingual language model gain effective visual grounding through parameter-efficient fusion without sacrificing multilingual text performance or on-device deployability?

## Why This Matters

No existing sub-4B model combines vision capabilities with support for 70+ languages, particularly for low-resource languages.

|                        Model                         | Params |     Languages      | Vision  |
| :--------------------------------------------------: | :----: | :----------------: | :-----: |
|                   Tiny Aya Vision                    |  ~4B   |        70+         |   Yes   |
|                     Qwen3-VL-2GB                     |   2B   |        ~32         |   Yes   |
|                      Gemma 3-1B                      |   1B   |        140+        | Limited |
| SmolVLM <d-cite key="marafioti2025smolvlm"></d-cite> |  <4B   |  English-centric   |   Yes   |
|                    Ministral-3-3B                    |  3.4B  | Basic multilingual |   Yes   |

## Claim

Tiny Aya adds vision to a 3.35B multilingual (70+ languages) model using a frozen encoder, a small connector, and LoRA <d-cite key="hu2022lora"></d-cite>, then merges weights back to restore text performance. Aya Vision <d-cite key="dash2025ayavision"></d-cite> showed at 8B that this merging step does more than restore text performance. On AyaVisionBench, merging lifted multilingual vision win-rate against Pangea-7B from 58.1% to 70.0%, an 11.9 point gain over the unmerged checkpoint (Aya Vision, Fig. 12). The open question is whether the same gain appears at 3.35B, where there's less parameter slack.

## Evidence

### Architecture

Tiny Aya Vision uses a late-fusion design, following Aya Vision and LLaVA <d-cite key="liu2023llava"></d-cite>: a frozen vision encoder produces patch embeddings, a trainable connector projects them into the language model's embedding space, and the language model consumes them as ordinary input tokens.

|   Component    |                               Configurations                               | Params | Trained |
| :------------: | :------------------------------------------------------------------------: | :----: | :-----: |
| Vision Encoder | SigLIP2-so400m <d-cite key="tschannen2025siglip2"></d-cite>, 384x384 input | ~400M  | Frozen  |
|   Connector    |                  Pixel Shuffle (2x2) + 2-layer SwiGLU MLP                  |  ~12M  | Stage 1 |
|  LLM backbone  |                       Tiny Aya Global, 70+ languages                       | 3.35B  | Frozen  |
| LLM adaptation |                               LoRA, rank 256                               | ~280M  | Stage 2 |

An image enters SigLIP2 at 384×384 and comes out as 729 patch embeddings. Passing all of them to a 3.35B backbone is expensive relative to the model's total budget, so Pixel Shuffle stacks each 2×2 neighbourhood along the embedding dimension, trading spatial resolution for depth and cutting the sequence to 196 tokens. The SwiGLU MLP then projects those into the backbone's embedding space. Only the connector trains in Stage 1; LoRA is added in Stage 2 so the backbone can adapt to visual input without full fine-tuning.

{% include figure.liquid path="assets/img/2026-08-22-tiny-aya-vision/architecture.png" alt="Tiny Aya Vision architecture diagram" caption="Late-fusion architecture: frozen SigLIP2 encoder, Pixel Shuffle + SwiGLU connector, LoRA-adapted Tiny Aya backbone." %}

### Training Recipe

Training follows [LLaVA](https://arxiv.org/abs/2304.08485)'s two-stage recipe, previously validated by [Aya Vision](https://huggingface.co/CohereLabs/aya-vision-8b) and [Maya](https://huggingface.co/maya-multimodal/maya) <d-cite key="alam2024maya"></d-cite>. In Stage 1 (alignment), we train only the connector on ~558K image–caption pairs (LLaVA-Pretrain), keeping both the vision encoder and the LLM frozen. This teaches the connector to map visual features into Tiny Aya's embedding space. In Stage 2 (instruction tuning), we add LoRA (rank 256) to the LLM and move from English-only data (Milestone A) to a ~60/40 English/multilingual SFT mix (Milestone B), following the ratio Aya Vision found optimal at 8B.

We then add a training-free third step: cross-modal weight merging. The LLM weights are linearly interpolated between the fine-tuned multimodal checkpoint and the original text-only Tiny Aya Global,

`W_merged = (1 − α) · W_text + α · W_mm`

with the connector and vision encoder left unchanged. Aya Vision selected α = 0.4 at both 8B and 32B based on a sweep over interpolation weights (Fig. 9). At that setting, Aya Vision 8B limited text-only win-rate degradation on m-ArenaHard to 5.92% relative to the LLM it was initialized from, compared to 16.4% for Pangea-7B, 22.1% for Qwen2.5-VL-7B, and 44.1% for Molmo-7B (Fig. 5). Whether this behavior holds at 3.35B, where there is far less parameter redundancy to absorb the merge, remains an open question.

|                          Benchmark                           | Blind Score  |                       Notes                       |
| :----------------------------------------------------------: | :----------: | :-----------------------------------------------: |
|         CVQA <d-cite key="romero2024cvqa"></d-cite>          |    25.60%    |    Tiny Aya Global; chance ≈ 25% for 4-choice     |
| Kaleidoscope <d-cite key="salazar2025kaleidoscope"></d-cite> | 26.07% (avg) |     Range: 19% (Nepali) to 33.6% (Portuguese)     |
|                             MaXM                             |    ~0.0%     |    Generation task, impossible without images     |
|                            MTVQA                             |     0.0%     | Text reading in images, impossible without vision |

Tiny Aya Global scores 25.6% on CVQA in the blind setting, with no image at all. After English-only alignment, it jumps to 45.5%, an increase of nearly 20 points, confirming real visual grounding rather than just language priors.

{% include figure.liquid path="assets/img/2026-08-22-tiny-aya-vision/ckpt-cvqa.png" alt="CVQA score by checkpoint" caption="CVQA accuracy jumps from blind-guessing (25.6%) to 45.5% after English-only alignment." %}

By language, Portuguese and Spanish lead (~50%+), reflecting the strength of high-resource, Latin-script languages. Sinhala is lowest (~21%), with Kinyarwanda and Oromo close behind (the lowest-resource languages), showing that this isn't simply a script issue (Kinyarwanda and Oromo are Latin-script too). That gap is exactly what Milestone C's culturally diverse visual data is designed to close.

{% include figure.liquid path="assets/img/2026-08-22-tiny-aya-vision/per-lang-ckpt.png" alt="CVQA score by language" caption="Per-language CVQA accuracy: Portuguese and Spanish lead, Sinhala, Kinyarwanda, and Oromo trail." %}

## Limitations

These results are early. The CVQA blind baseline sits at 25.6%, near chance, so it confirms the model gets real signal from images. But CVQA is partly language-solvable too. The gap is wide enough to show vision helps. It's not wide enough to cleanly separate visual reasoning from language priors.

The per-language numbers here only cover Milestone A: English-only visual training. Milestone B (multilingual SFT) and Milestone C (culturally diverse visual data, a stretch goal) haven't happened yet. Low-resource-language scores will likely look better once those land.

Cross-modal merging is also untested at this scale. At 8B, it recovered text performance and pushed vision win-rate up 20.5%. We don't yet know if α=0.4 is still the right value at 3.35B, where the model has much less parameter redundancy to work with.

Two more open items: we haven't run the MoonViT ablation, and we haven't resolved the LoRA learning-rate discrepancy between Maya and Aya Vision at this scale.

## Next Steps

A few things are still in progress. We're running the merge ratio sweep (α = 0.3 to 0.7) at 3.35B to find whether the same Goldilocks zone from 8B holds here. We're finishing Milestone B (multilingual SFT) and comparing it against Milestone A to isolate what explicit multilingual data adds on top of cross-lingual transfer. Milestone C, culturally diverse visual data from XM3600 <d-cite key="thapliyal2022crossmodal3600"></d-cite>, is a stretch goal we'll pursue if time allows.

We also want to settle the LoRA learning-rate question left open by the Maya and Aya Vision comparison, and finish the MoonViT ablation to see if native-resolution encoding matters for script-heavy languages like Arabic or Thai.

Once results are final, we'll release model weights on Hugging Face, publish the code, and report on-device latency numbers.

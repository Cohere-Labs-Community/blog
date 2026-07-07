---
layout: distill
title: "Inside Tiny Aya: What an SAE Sees in a Model Built for 70+ Languages"
date: 2026-07-07 01:00:00
description: "We trained and released Sparse Autoencoders on all four Tiny Aya regional variants and asked what an SAE sees inside a model built for 70+ languages: a representational-density gap, a mostly-shared feature basis, and an identity-versus-quality null."
author: "Farseen Shaikh"
authors:
  - name: "Farseen Shaikh"
    url: "https://farseenshaikh.vercel.app/"
    bio: "Farseen Shaikh is an independent AI researcher working on mechanistic interpretability and representation engineering, with a focus on sparse autoencoders. His work includes SCAR, which introduces SAE-LoRA to adapt sparse-autoencoder features for retrieval, and SweeperLLM, which shows that how a task is represented to a model can matter more than how the model is trained. Two of his papers were accepted at the ACL 2026 SURGeLLM workshop."
    affiliations:
      name: Cohere Labs Community
tags: community research interpretability multilingual sparse-autoencoders open-science
hero:
  type: contour
  motion: auto
  seed: cohere-labs-community-blog
  intensity: 0.72
  og_image: /assets/img/brand/cohere-labs-community-lockup.svg
toc: true
bibliography: 2026-07-07-inside-tiny-aya-what-an-sae-sees.bib
---

<!-- markdownlint-disable MD033 -->

_Part of Expedition Tiny Aya, with teammates Matthew Nguyen and Tra My (Chiffon) Nguyen._

Ask Tiny Aya, Cohere Labs' purpose-built multilingual model, an open-ended question in Thai, and it will happily answer in fluent, grammatical Thai. Sometimes the answer is right; sometimes it invents the facts wholesale. Ask it about _Ayutthaya_, Thailand's former royal capital, and in one of our probes it confidently described "an Indian TV actress, born 21 May 1988 in Kolkata," complete with a fabricated Hindi series, made-up parents, and a fake alma mater — every sentence flawless, every fact invented. We wanted to know what the model's _internal representation_ of Thai looks like at a moment like that, and whether it looks any different from when the model gets the answer right.

That question is hard to ask of most language models, because most are multilingual only by accident: English-first, with the other languages along for the ride. Tiny Aya is multilingual _by design_: 70+ languages, and four regional variants that share a single base. That makes it a rare, controlled setting for a basic question. When one 3.35B-parameter model holds 70+ languages at once, does it build separate machinery for each, or one shared system that bends to fit?

To look inside, we trained Sparse Autoencoders, which decompose a model's internal activations into discrete, interpretable features <d-cite key="cunningham2023sparse,bricken2023monosemanticity"></d-cite>. We trained them on all four variants at layer 28 and released them openly. We expected to find mostly _shared_ features, since a balance-by-design model should generalize, and we did. But the size of one effect surprised us, a second result we hadn't gone looking for changed how we read the first, and the failure we set out to study turned out not to be the one we thought. What follows is all three, including the parts that didn't work.

## TL;DR

> _All numbers come from the four open SAEs run on the full FLORES-200 **devtest** split (~1,000 sentences × 61 languages × 4 variants) at layer 28; code and weights are linked below._

- We trained Sparse Autoencoders on **all four** Tiny Aya regional variants (Global, Fire, Earth, Water) at layer 28 and **released them openly**: [`Farseen0/tiny-aya-saes`](https://huggingface.co/Farseen0/tiny-aya-saes).
- **Headline measurement: a representational-density gap.** At layer 28 the model lights up **~645 features for an average Irish token but only ~90 for a Gujarati token and ~143 for English**. Two extreme Celtic outliers (Irish, Welsh) inflate that 7× spread, but a real **~2.4× gradient survives without them** (Yoruba/Malagasy ~218 vs Gujarati ~90), and it doesn't reduce to tokenization. What a denser code _means_ behaviorally is an open question.
- Of 16,384 features, the taxonomy is **~76% universal, ~6% script-specific, ~1.4% language-specific, ~16% mixed** (Global). Auto-interp names many cleanly: a Javanese relative-pronoun feature, a German particle feature, a Thai-script detector. The "language-specific" slice, though, is small and heavily Irish/Welsh-dominated.
- **Two negatives that sharpen the science:** (1) the four variants have _near-identical_ feature _inventories_, consistent with regional fine-tuning redistributing rather than inventing features, though separately-trained SAEs can't settle it; (2) Thai-feature _engagement_ doesn't track Thai _quality_ in our probe. Tiny Aya hallucinates fluent Thai while its Thai features fire normally, an underpowered but consistent null.
- A crosscoder model-diffing study (next) will settle _invent vs redistribute_ rigorously.

**What we expected vs what surprised us.** Our prior, shared with the team up front, was that a balance-_by-design_ model would mostly _share_ features across languages. The ~76% universal fraction confirms that, and echoes Deng et al. <d-cite key="deng2025unveiling"></d-cite> on multilingual SAEs. The two things that genuinely surprised us are the **size of the density gap** and the **engagement-vs-quality decoupling**. Those are where to look.

## Why Tiny Aya is a unique lens

Most multilingual interpretability runs on Gemma or Llama, models that are multilingual _by accident_. Tiny Aya (Cohere Labs, 3.35B) <d-cite key="salamanca2026tiny"></d-cite> is multilingual _by design_: 70+ languages, region-aware post-training, and four variants that share one base — **Global** (balanced), **Fire** (South Asian), **Earth** (Africa + West Asia), **Water** (SE/East Asia). Because the variants come from the same base, comparing their features is a controlled experiment in what specialization _does_ to a network.

Prior multilingual interpretability has mostly worked at the level of individual _neurons_: locating language-specific neurons <d-cite key="tang2024language"></d-cite>, probing how an Aya model represents languages internally <d-cite key="trinley2025what"></d-cite>, and tracing language confusion to a handful of final-layer neurons <d-cite key="nie2025mechanistic"></d-cite>. We take a _feature_-level view with SAEs, which can pull apart concepts that a single polysemantic neuron blurs together.

## What we built

|                  |                                          |
| ---------------- | ---------------------------------------- |
| SAE architecture | BatchTopK (k=64) → JumpReLU at inference |
| Width / input    | 16,384 (8×) / 2,048                      |
| Hook             | `model.layers.28` (final third of 36)    |
| Training         | balanced CulturaX, 61 languages          |
| Variants         | Global, Fire, Earth, Water               |

Why layer 28? It sits in the final third of the model's 36 layers, a late-middle depth where SAE features tend to be most abstract and monosemantic: past raw token identity, before the network commits to next-token logits. It is also the layer at which we trained and released the SAEs.

A word on SAE health, since good reconstruction is what makes the features trustworthy:

| variant | explained var | mean L0 | dead features |
| ------- | ------------- | ------- | ------------- |
| global  | 0.950         | 139.6   | 0.1%          |
| fire    | 0.943         | 153.9   | 0.0%          |
| earth   | 0.950         | 142.3   | 0.1%          |
| water   | 0.947         | 143.2   | 0.1%          |

> _A note on sparsity (it matters below):_ these SAEs were trained using BatchTopK <d-cite key="bussmann2024batchtopk"></d-cite> with k=64 but are saved as JumpReLU <d-cite key="rajamanoharan2024jumping"></d-cite>, whose learned thresholds run looser at inference, so a healthy SAE shows L0 ≈ 140, not 64. EV ≈ 0.95 and ~0% dead confirm reconstruction is sound, but the looser operating point means the _absolute_ "features per token" and the universal/specific split below are measured at L0 ≈ 140; cross-language _ratios_ (same SAE, same threshold) are the part to trust.

## The headline: a representational-density gap

Define a language's **activation density** as the mean number of SAE features that fire per token of that language, averaged over FLORES-200 <d-cite key="nllb2022"></d-cite> (the NLLB Team's 200-language parallel benchmark from 2022, the same sentences in every language). It is a base-rate-free quantity, and it varies enormously:

{% include figure.liquid path="assets/img/2026-07-07-inside-tiny-aya-what-an-sae-sees/fig_density_gap.png" alt="Bar chart of mean SAE features active per token across 61 languages, Global variant at layer 28, sorted high to low, with Irish highest and Indic-script languages lowest." caption="Mean SAE features active per token for each of 61 languages (Global variant, layer 28), sorted high to low. Irish is the extreme outlier and the Indic-script South-Asian languages sit lowest. Even dropping the two Celtic outliers, a ~2.4× gradient survives. An asterisk marks low-resource languages." %}

The model encodes some languages with a _far denser_ feature code than others:

| highest density (features/token) |      | lowest density |      |
| -------------------------------- | ---- | -------------- | ---- |
| Irish (ga)                       | ~645 | Gujarati (gu)  | ~90  |
| Welsh (cy)                       | ~398 | Marathi (mr)   | ~101 |
| Malagasy (mg), Yoruba (yo)       | ~218 | Hindi (hi)     | ~103 |
| Maltese (mt), Polish (pl)        | ~215 | Nepali (ne)    | ~105 |

**Is this just tokenization?** Mostly not, and we checked, because it's the obvious objection. Across the 61 languages, density is, if anything, _weakly anti_-correlated with how finely the tokenizer splits text (Spearman −0.16): the most fragmented languages, the Indic scripts, are among the _least_ dense. Two caveats keep us from over-claiming the rebuttal. First, if we instead count features per _character_, the ordering reshuffles: heavily-fragmented Gujarati climbs from last (~90/token) toward mid-pack (~74/char), while the European languages stay cheap (~30/char) and Irish stays high (~223/char). Second, Irish, our headline, is itself slightly _more_ fragmented per character than English, so for that one language tokenization isn't fully ruled out. The effect we'd actually stand behind is the **gradient across the other 59 languages**: even after dropping Irish and Welsh, density still spans **~2.4×** (Yoruba/Malagasy ~218 vs Gujarati ~90), and that gradient does not track tokenizer fragmentation.

{% include figure.liquid path="assets/img/2026-07-07-inside-tiny-aya-what-an-sae-sees/fig_tokenization.png" alt="Scatter plot of activation density versus tokenizer fragmentation across 61 languages, colored by script family, showing a weak negative slope." caption="Activation density vs tokenizer fragmentation across 61 languages, colored by script family. If tokenization drove the gap we would expect a positive slope; instead density is weakly anti-correlated with fragmentation (Spearman −0.16). The Indic scripts (green) are the most fragmented yet the least dense." %}

**What does it mean?** We don't yet know, and we're careful not to dress the measurement up as a verdict on the model. A denser code could reflect genuine representational effort, or redundancy, or simply that the SAE reconstructs some languages with more, weaker features. Our own vignette below shows that feature engagement does _not_ track output quality, so we explicitly do **not** claim that low-density languages are served worse. These numbers also come entirely from FLORES-200, parallel news-wire text that injects the same named entities and Latin technical tokens into every language, which is a domain confound worth naming. What's solid is the measurement, and that it isn't a tokenizer artifact. _Why_ the gradient exists, and whether closing it would change anything, is what we want to chase next.

## RQ1 — How does Tiny Aya divide its features?

We classify each feature from its per-language firing profile: **language-specific** if its firing concentrates in one language, **script-specific** if in one writing system, **universal** if it fires broadly (high cross-script entropy).

{% include figure.liquid path="assets/img/2026-07-07-inside-tiny-aya-what-an-sae-sees/fig_taxonomy.png" alt="Stacked bar chart of SAE feature taxonomy for the four variants at layer 28, with universal features dominating each ~16k-feature bar." caption="SAE feature taxonomy for the four variants (layer 28). Each bar totals ~16k features; universal features shared across scripts (~76–79%) dominate, and the four regional variants look nearly identical." %}

| variant | language | script | universal | mixed |
| ------- | -------- | ------ | --------- | ----- |
| global  | 226      | 975    | 12,504    | 2,640 |
| fire    | 233      | 717    | 12,909    | 2,504 |
| earth   | 197      | 844    | 12,631    | 2,680 |
| water   | 203      | 832    | 12,518    | 2,791 |

The overwhelming majority of features (~76%) are **universal**: shared machinery that fires across scripts and languages. Only ~1.4% are tied to a single language and ~6% to a single script. Multilinguality, at this layer, is mostly _shared_, which matches our expectations and prior work, so we treat it as confirmation rather than discovery. One caveat on the exact number: at L0 ≈ 140, looser than the trained k = 64, some low-activation features fire broadly and land in "universal," so the precise 76% is operating-point-dependent. The _dominance_ of shared features is the claim to trust.

> **Methods note: a reality check on "language-specific."** A naïve "≥60% of a feature's firing is in language L" rule is badly biased by activation density. Because Irish fires ~645 features per token, _Irish alone captured 80% of all "language-specific" features_ (752 of 941) before correction, an artifact rather than a finding. We give each language an equal firing budget before measuring selectivity, a base-rate correction in the spirit of LAPE <d-cite key="tang2024language"></d-cite>. Even **after** correction, Irish still accounts for **93 of Global's 226** language-specific features (41%), Irish + Welsh for **52%**, and **40 of 61 languages have ≤1**. So "language-specific," at this layer, largely means "a lot of Irish and Welsh." We therefore lean on the **script-level and aggregate** structure and read single-language counts with care. Thresholds (lang τ=0.60, script τ=0.50, entropy ≥0.70) are not swept here; that sensitivity analysis is for the paper.

## Naming features automatically

We ran a thin Cohere `command-a` auto-interpreter over each feature's top-activating FLORES sentences. Some features get a clean, concrete label. Here are four we hand-checked, each with a real top-activating example in the original script:

| feature | type          | what it detects                              | example (top-activating context)               |
| ------- | ------------- | -------------------------------------------- | ---------------------------------------------- |
| #100    | language · jv | Javanese relative pronoun _sing_             | …cara sing padha karo materi liyane sing katon |
| #10734  | language · de | German pronouns & particles (_sie, die, zu_) | …damit sie ihren Träumen…                      |
| #2529   | language · ne | Nepali verb-conjugation endings              | …थियो भनेर भन्नुभ…                             |
| #15     | script · Thai | Thai-script detection (fires on ~all Thai)   | …ระหว่างการพูดคุย…                             |

One caveat worth stating plainly: **auto-interp is noisy here.** It's a single quick pass, and for a meaningful fraction of features the top-activating example doesn't actually match the label (for example, a "Japanese politeness" feature whose strongest activation is on a Tamil token). So we only foreground labels we verified by hand, and treat the auto-labels as a starting point, not ground truth. The verified ones, at least, are discrete and nameable, not directions lost in a soup.

{% include figure.liquid path="assets/img/2026-07-07-inside-tiny-aya-what-an-sae-sees/feature_dashboards.png" alt="Anthropic-style feature dashboards showing top-activating examples with the firing token highlighted for four hand-verified language and script features plus one universal feature." caption="Feature dashboards, Anthropic-style: each feature's top-activating examples with the firing token highlighted. Top row, four hand-verified language/script features; bottom, a universal feature (#0) firing on ordinals across six scripts." %}

## Cross-variant — invent, or redistribute?

The most interesting question Tiny Aya enables: when you specialize a model for a region, does it **invent** new language features or **redistribute** existing ones? Our SAEs give a _suggestive_ answer, redistribution, but they cannot give a rigorous one, and it's worth being precise about why. After density correction, the four variants have _near-identical_ feature inventories (language counts 197–233; universal ~76% across the board). That's consistent with redistribution, but it's equally consistent with four separately-trained SAEs independently rediscovering similar structure; counting unaligned dictionaries can't tell those apart. The earlier impression that Global was far more "differentiated" turned out to be the Irish density artifact, and vanished once corrected. We also see no clean regional specialization in dedicated-feature counts, but that test is itself crippled here. Earth is the African/West-Asian variant, and **6 of its flagship African languages (ha, ig, sn, wo, xh, zu) were absent from the SAE training data**, so "Earth doesn't lead on its own languages" is provisional for exactly the region where it matters most.

> **Why this needs a follow-up.** Four _separately trained_ SAEs have unaligned dictionaries: feature #N in Global is unrelated to #N in Fire, so counting and comparing them is suggestive, not conclusive. We make **no** per-feature invent-vs-redistribute claim from this alone. The rigorous tool is a **crosscoder** trained base-vs-variant, a shared dictionary across models, which is the subject of our follow-up paper.

## Vignette — does the feature code see quality?

Tiny Aya Global's Thai is a useful stress test: prompt it with open-ended Thai instructions and it stays in Thai (29/30 of our probes) but its answers range from fluent to badly hallucinated. At one point it turned _Ayutthaya_, Thailand's former royal capital, into a fictional "Indian TV actress born in Kolkata," in perfectly grammatical Thai.

Do the SAE's **Thai features** expose this failure? We measured whether **Thai-feature engagement** tracks an independent quality score, using a single Cohere `command-a` judge (with the usual LLM-as-judge caveats) plus LaBSE, across 30 model-generated Thai outputs. **It doesn't.** Engagement is essentially flat across quality (Spearman 0.05, n = 30; 95% CI **[−0.31, 0.41]**). This is an _underpowered_ null: we can rule out a strong effect, not a weak one. Human FLORES Thai sits in the same engagement band. The features fire at full strength whether the Thai is fluent or hallucinated; they drop only when the model switches _out_ of Thai.

{% include figure.liquid path="assets/img/2026-07-07-inside-tiny-aya-what-an-sae-sees/fig_thai_identity.png" alt="Scatter plot of per-generation Thai-feature engagement against an independent quality judgment, showing a flat trend across quality with one low outlier that switched out of Thai." caption="Per-generation Thai-feature engagement against an independent quality judgment. In-Thai engagement is flat across quality (Spearman 0.05, n=30; 95% CI [−0.31, 0.41], an underpowered null), level with human FLORES Thai; the one point that drops is the single generation that switched out of Thai." %}

One readout _does_ catch something, though. The **diversity** of the feature code, its entropy, falls when the Thai degenerates into repetition: a **−0.41** correlation with an objective 4-gram repetition rate, no judge involved. So the SAE _does_ register the looping failure mode, just through the _dynamics_ of the code rather than the identity features' engagement, and not the factual errors at all.

{% include figure.liquid path="assets/img/2026-07-07-inside-tiny-aya-what-an-sae-sees/fig_thai_dynamics.png" alt="Scatter plot showing feature-code entropy falling as 4-gram repetition rises across 30 generations, Pearson minus 0.41, while identity-feature engagement stays flat." caption="The one quality signal the code exposes: feature-code entropy falls as the generation degenerates into 4-gram repetition (Pearson −0.41, n=30), a judge-free measure. The identity features' engagement, by contrast, stays flat." %}

In sum, at this layer, language-**identity** features encode _which_ language is produced, not _how well_; the code's **dynamics** partially expose one specific failure, repetition. Surface fluency hides the rest, and so does feature engagement. Pinning down where quality _lives_ needs causal, cross-variant tools, and more than n = 30.

> _We initially set out to reproduce a reported "Thai → Vietnamese collapse," an instance of the documented "language confusion" failure mode <d-cite key="marchisio2024understanding"></d-cite>, traced to final-layer neurons by Nie et al. <d-cite key="nie2025mechanistic"></d-cite>. It did not reproduce on GPU at either bf16 or fp16, and appears to have been a hardware/decoding artifact, so we don't report it. The question above turned out to be the better one._

## Limitations (read before citing us)

- **Single layer (28), single seed, single width.** A layer/seed/width sweep is future work.
- **6 languages (ha, ig, sn, wo, xh, zu, all African) were absent from training data**, so the SAEs can't represent them; low-resource analysis uses yo/jv/am. This most affects the Earth (African/West-Asian) cross-variant comparison.
- **Cross-variant counts use unaligned dictionaries**: treat as hypotheses, not findings; the crosscoder study is the rigorous version.
- **The taxonomy is measured at L0 ≈ 140 (looser than trained k=64) with unswept thresholds**, and "language-specific" is dominated by two Celtic outliers, so lean on script-level and aggregate structure over single-language counts.
- **Auto-interp labels are noisy** and only a hand-checked subset is reported as reliable.
- **Density's behavioral meaning is unestablished**: it is a measurement, not a quality verdict.

## Use the SAEs

```python
from sae_lens import SAE

sae = SAE.from_pretrained(release="Farseen0/tiny-aya-saes",
                          sae_id="tiny-aya-global/layer_28", device="cuda")
features = sae.encode(hidden_states)   # [batch, seq, 16384]
```

## What's next

Next up is a **crosscoder-based model-diffing** study (base vs each regional variant, a shared dictionary; see Lindsey et al. <d-cite key="lindsey2024sparse"></d-cite> and Minder et al. <d-cite key="minder2025overcoming"></d-cite>) to settle _invent vs redistribute_ rigorously, alongside a layer sweep and a causal probe of the engagement-vs-quality split. We're writing that up as a follow-up workshop paper. We'd also love to know _why_ the representational-density gradient is so large for some languages, and whether closing it predicts anything about downstream quality.

## Acknowledgments

This work is part of **Expedition Tiny Aya**, Cohere Labs' open-science program. We thank our Expedition mentors Tom Hosking and Marzieh Fadaee for their constant support and guidance, Alejandro Rodríguez Salamanca for his feedback on the visualizations, and Madeline Smith and Brittawnya P. for stewarding the Expedition and its community. We're grateful to the wider Cohere Labs Open Science Community for making this kind of open, collaborative research possible. We also build on our team's shared data-preparation and evaluation harness. Tiny Aya and its regional variants are the work of the Cohere Labs Tiny Aya team; this study is only possible because they built and released a model family designed for 70+ languages.

_SAEs: [Farseen0/tiny-aya-saes](https://huggingface.co/Farseen0/tiny-aya-saes) · Code: [github.com/FarseenSh/Inside-Tiny-Aya](https://github.com/FarseenSh/Inside-Tiny-Aya)_

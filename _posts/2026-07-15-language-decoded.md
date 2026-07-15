---
layout: distill
title: "Language, Decoded: What if you could code in your own language?"
date: 2026-07-15 00:00:00
description: "Quality data for under-resourced languages is hard to acquire. It is even harder to get code in these languages. Through research, it showed that introducing code in training a model has proved to be a well rounded data source to improve performance. How can we utilize non-English code to strengthen the performance of these multilingual models, especially where data scarcity exists?"
author: "Rafay Mustafa"
authors:
  - name: "Rafay Mustafa"
    url: "https://github.com/rafaym1"
    image: "rafay-mustafa.jpg"
    bio: "Rafay is an incoming PhD student at NUIG, AI Researcher, Content Creator and a Cohere Labs Edtech Community Lead."
    affiliations:
      name: "Cohere Labs Community"
  - name: "Madison Edgar"
    url: "https://www.linkedin.com/in/madiedgar/"
    image: "madison-edgar.jpg"
    bio: "Madi Edgar is a wife, mom to 3 young kids, + the Founder/CEO of Legesher, where she's rebuilding the foundation of programming so people can code in their native language. After studying Computer Science and Mathematical Decision Sciences at UNC Chapel Hill, she spent a decade leading AI/ML, R&D, and emerging-technology product initiatives at Nike + Comcast NBCUniversal."
    affiliations:
      name: "Cohere Labs Community"
tags: community research writing
toc: true
---

# **Language, Decoded: What if you could code in your own language?**

_Quality data for under-resourced languages is hard to acquire. It is even harder to get code in these languages. Through research,\[1\] it showed that introducing code in training a model has proved to be a well rounded data source to improve performance. How can we utilize non-English code to strengthen the performance of these multilingual models, especially where data scarcity exists?_

We started with the question: _what if the code you train a language model on was written in a language other than English?_

## **The Question Nobody Was Asking**

Here\'s something that gets taken for granted in AI research: code is English. Not just the programming language syntax (which is Latin-script by design), but everything around it; variable names, function names, comments, documentation.

This matters because code has become a kind of secret ingredient for making language models smarter. Prior work has shown that training on code, even for tasks that have nothing to do with programming, improves reasoning, instruction following, and world knowledge. The structure of code, with its explicit logic and step-by-step flow, seems to teach something transferable.

But all of that research used English code. [[The Stack]{.underline}](https://huggingface.co/datasets/bigcode/the-stack), one of the largest permissive code datasets ever assembled at 3TB and used in major research papers related to coding training data, has 94% English comments. What would happen if you introduced code written in non-English languages?

We chose Chinese, Spanish, and Urdu because they gave us a diverse multilingual testbed. Chinese is high-resource with real native-code ecosystems, Spanish is a widely spoken Latin-script language with good localization coverage, and Urdu is lower-resource and underrepresented, making it useful for testing whether multilingual code helps harder language settings and bonus point that we had native speakers of Urdu on the team.

## The Decoder

This experiment would have been nearly impossible to run a few years ago, because we needed a consistent way to create high-quality native-language code examples across languages. That\'s where [[Legesher]{.underline}](https://github.com/legesher/legesher) came in.

{% include figure.liquid path="assets/img/legesher-overview.png" alt="A diagram illustrating how Legesher lets developers write Python using keywords and syntax in their own language while the underlying code still runs unchanged" caption="Legesher provides a localization layer so code can be written in the developer's own language without changing how the program runs." %}

Legesher is an open-source project built on a striking premise: English shouldn\'t be a barrier to writing code. It provides tools and language packs that let developers write Python using keywords and syntax in their own language without changing how the program actually runs. An Urdu speaker can write out function logic using [اگر]{dir="rtl"} instead of if. The code runs exactly the same way underneath; Legesher provides the localization layer for code to be in the context of the developer's language.

We used Legesher as a transpiler to generate training data at scale across Chinese, Spanish, and Urdu using the same Python code originally in English from The Stack (v2 dedup). We also pulled from genuinely native programming languages in our target languages: [**[Wenyan]{.underline}**](https://wy-lang.org/) (a programming language written in classical Chinese, inspired by ancient literary style) and [**[Qi]{.underline}**](https://github.com/AnonymousAAArdvark/qi) (a lightweight language designed specifically to be written in Chinese). For Spanish, we incorporated [**[Latino]{.underline}**](https://www.lenguajelatino.org/), an open-source programming language built for Latin American and Spanish-speaking communities. Urdu was especially important because, unlike Chinese and Spanish, it does not have a mature native programming-language ecosystem we could pull from. That made it a useful test case for introducing something genuinely new to the model through localized code.

## The Experiment

For the experiment, we focused on one accessible multilingual model: Tiny Aya. We fine-tuned it on different versions of the same code corpus so we could isolate what changed when a more native-language signal was added. Starting from English Python files sampled from [[The Stack v2 dedup]{.underline}](https://huggingface.co/datasets/bigcode/the-stack-v2-dedup), we created dataset subsets of different sizes, including 5k and 20k examples. Condition 1 used the original English code, Condition 2 kept the same code structure but localized the reserved words through Legesher, and Condition 5 used the same base files again but translated identifiers, comments, docstrings, and strings as well. This experimental ladder could compare different levels of native-language code while keeping the underlying programming examples as consistent as possible.

{% include figure.liquid path="assets/img/experiment-conditions.png" alt="Diagram of the five experimental conditions used to test native-language code, from an English-only baseline through reserved-word localization, native-ecosystem code, and full-file translation" caption="The experimental ladder: from an English-only baseline up through full-file translation, isolating what changes as more native-language signal is added to the training code." %}

**Baseline**: We used the Tiny Aya base model with no fine-tuning as our control.

**Condition 1: English code**; Pulled original Python files from The Stack v2 dedup, removed duplicates, and created two subsets: 5,000 and 20,000 samples. This let us test how basic fine-tuning on English code alone affected Tiny Aya before adding any native-language signal.

**Condition 2: Reserved-word localization using Legesher**; Using the same subsets from Condition 1, we switched Python's programming reserved work syntax with the target language's language packs from Legesher. Keywords, exceptions and builtin functions like for, if, while, print become their equivalents in Chinese, Spanish, or Urdu, while the variable names and comments used within the coding files stay in English.

**Condition 3: Native-ecosystem code (Chinese only)**; This data set was sourced independently from repositories written with Chinese programming languages Wenyan and Qi to explore the differences in programming logic when coding first in non-English languages. (Only doable for Chinese; equivalent corpora for Spanish and Urdu couldn\'t be gathered at sufficient scale.)

**Condition 5: Full-file translation using Legesher + Aya Expanse**; Using the same subsets from Condition 2, we translated the rest of the file contents (identifiers, comments, docstrings, string literals) into the target language using [[Aya Expanse 32b]{.underline}](https://huggingface.co/CohereLabs/aya-expanse-32b) model.

We evaluated across four multilingual benchmarks covering commonsense reasoning (X-CSQA), natural language inference (XNLI), reading comprehension (Belebele), and topic classification (SIB-200) with the prompts presented in each experiment in English, Chinese, Spanish, and Urdu. We found the fine-tuned models often answered in a variety of ways in the target language, so we scored everything in two ways: a strict extractor that only accepts the benchmark's exact answer and a refined extractor that reads well-formed target language answers while also revoking credit for degenerate ones. The second ruler was important to understand the impact of the fine tuned models, even if the answer wasn't exactly the expected response.

**Our Initial Findings**

### **English code alone already helps**

Condition 1 with English only Python from [[The Stack v2 dedup]{.underline}](https://huggingface.co/datasets/bigcode/the-stack-v2-dedup) confirmed the existing intuition: code is a reasoning signal that crosses language boundaries. Prior work like [_[To Code or Not to Code]{.underline}_](https://arxiv.org/abs/2408.10914) showed that code can improve reasoning during pre-training. Some multilingual scores improved: aligned Chinese XNLI improved under Chinese prompts from 29.1% to 31.3% (5k subset) and Urdu Belebele under English prompts increased from 60.9% to 61.8% (20k subset, 61.6% at 5k). The gains were modest, but they supported the intuition that code can act as a reasoning signal across language boundaries.

Pushing from 5,000 to 20,000 English code samples didn\'t consistently keep improving things; Spanish instruction SIB-200 actually both _dropped_ below the baseline of 58.3% to 56.9% (5k subset) and 53.2% (20k subset). Small multilingual models seem to saturate on English code gains quickly, and scale is not monotonic here.

### **Reserved-word localization**

Condition 2 produced the strongest improvements of any translated condition, and the size of the lift tracked resource level in reverse. Urdu is the lowest resourced language of the four tested, yet it received the biggest gain.

{% include figure.liquid path="assets/img/reserved-word-results.png" alt="Bar chart showing benchmark score changes for Chinese, Spanish, and Urdu under reserved-word localization compared to baseline" caption="Reserved-word localization (Condition 2) produced the strongest gains of any translated condition, with Urdu — the lowest-resourced language tested — seeing the largest lift." %}

Chinese XNLI under Chinese prompts jumped from 29.1% to 35.3% (20k single seed; 34.6% at 5k across 3 seeds), and Urdu Belebele under English prompts improved reading comprehension improved from 60.9% to 63.4%. Under Urdu instruction prompts, Legesher's Urdu reserved words in code lifted SIB-200 by +12.0 points, Belebele by +5.9, and XNLI by +3.5 versus baseline.

The intuition here is structural: reserved-word localization keeps code _syntactically valid and clean_ while injecting native-language signals. The training signal stays coherent. The model gets exposure to the target language in a meaningful, executable context without changing the logic underneath it.

### **Native code strengthens cross-lingual transfer**

Condition 3 used Wenyan and Qi, real Chinese programming languages with their own design philosophies. The gains were not limited to Chinese evaluation, reaching 46.8% on English XNLI and 46.3% on Chinese XNLI under English prompts (baselines 43.9% and 42.8%), while English reasoning remained stable.

One caveat is that this condition was not directly comparable to the others, because the Wenyan and Qi data came from open-source native-code repositories rather than The Stack v2 Dedup files. So the result is suggestive, but corpus source and data quality may also have contributed.

### **The Impact of a Refined Localized Extractor**

Condition 5 tested full translation of identifiers, comments, docstrings, and strings using Cohere's c4ai-aya-expanse-32b model and reserved words using Legesher. Under the strict English-only extractor this condition seemed to have performed poorly: 15.5% on Urdu-instruction SIB-200 against Condition 2's 63.2%. Looking deeper into the answers from the model, they weren't incorrect but rather in _Urdu, Spanish,_ and _Chinese_.

Rescored with a refined extractor taking language into account, Condition 5 Urdu jumps to 51.8% (+36.3 points of recovered credit), Chinese to 44.1%, Spanish to 45.9%. The refined extractor also revoked credit for degenerate answer patterns, dropping Condition 2 Spanish slightly (63.2% to 59.1%).

{% include figure.liquid path="assets/img/refined-extractor-results.png" alt="Bar chart comparing Condition 5 scores under the strict English-only extractor versus the refined, language-aware extractor" caption="Rescoring Condition 5 with a language-aware extractor recovers most of the apparent drop — the model was answering correctly, just in the target language." %}

Translation quality was still a genuine limitation: out-of-the-box LLM translation introduced JSON wrapper artifacts and inconsistent identifiers, and only 87-89% of files per language survived validation. Each language needed its own prompting rules and clean up to produce usable training data. Though there are improvements to be made in data quality, the model learned to respond in the language it was trained on, and our original ruler couldn't read their responses.

### **Better Transfer, Messier Generation**

Urdu was one of the most interesting and unexpected localization cases. As a lower-resource language without a widely used native programming-language ecosystem, it behaved differently from Chinese and Spanish. In the 5k Urdu reserved-word condition, Chinese XNLI accuracy under English prompts rose from 42.8% to 45.1%, a +2.3 point gain (the same benchmark sits at 29.1% under Chinese prompts). The Condition 3 Chinese reached 46.3% and Condition 5 Urdu 45.5% on the same benchmark, displaying a model fine-tuned on Urdu Code improved Chinese XNLI. In other words, Urdu did not produce the highest absolute score, yet it produced one of the clearest and most surprising cross-lingual transfer effects.

{% include figure.liquid path="assets/img/urdu-transfer-results.png" alt="Bar chart showing Chinese XNLI accuracy gains under English prompts after fine-tuning on Urdu reserved-word code, compared to other conditions" caption="Fine-tuning on Urdu reserved-word code produced one of the clearest cross-lingual transfer effects, even though Urdu lacks a mature native programming-language ecosystem." %}

The qualitative outputs made this result even more interesting. Models fine-tuned on Urdu reserved words showed the highest degree of lexical variation, code-switching, and formatting instability, often answering in blended Urdu-code forms that mirror the fine-tuning data. There is a tradeoff suggested for Urdu: a more varied, more cross-lingually capable model that is less reliable at producing clean, well-formed output exactly where Urdu data meets Urdu instructions.

## **What\'s Next**

Big thank you to Cohere Labs' Open Science Initiative and the opportunity to bring together Team Languages Decoded (Captains: Madison Edgar, Saad Bazaz, Mentor: Tom Sherborne, Crew: Rafay Mustafa, Rashik Shahjahan, Khojasteh Mirza, Sarah Javed, Sohaib Bazaz) to explore this question. We're still curious to discover more about the impact of native code on multilingual models. Everything from the project is publicly available:

- **Dataset**: [[legesher/language-decoded-data]{.underline}](https://huggingface.co/datasets/legesher/language-decoded-data) --- the multilingual code corpus, including Legesher-transpiled samples and native-language code

- **Community dataset**: [[legesher/language-decoded-community]{.underline}](https://huggingface.co/datasets/legesher/language-decoded-community) --- the community-contributed native code collection, still growing

- Add the space info here ! We built a Hugging Face Space to crowdsource natively-written code samples from speakers of Spanish, Urdu, and other languages.

We're looking to expand our code corpus of natively-written code samples in a variety of languages. If you speak a language other than English, we'd love for you to use Legesher to contribute to our dataset for us to keep exploring.

\[1\] Aryabumi, Viraat, Yixuan Su, Raymond Ma, Adrien Morisot, Ivan Zhang, Acyr F. Locatelli, Marzieh Fadaee, A. Ustun and Sara Hooker. "To Code, or Not To Code? Exploring Impact of Code in Pre-training." ArXiv abs/2408.10914 (2024)

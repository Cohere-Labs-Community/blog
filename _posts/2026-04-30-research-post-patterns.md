---
layout: distill
title: Research Post Patterns
date: 2026-04-30 02:00:00
description: Copyable patterns for writing clear, reproducible research posts.
author: Cohere Labs Community
authors:
  - name: Cohere Labs Community
    bio: Cohere Labs Community members share research notes, technical essays, experiment reports, and practical perspectives on AI.
    affiliations:
      name: Cohere Labs
  - name: Community Editors
    bio: Editors help contributors make posts clearer, reproducible, and useful for readers across the Cohere Labs Community.
    affiliations:
      name: Cohere Labs Community
tags: community research writing reproducibility
toc:
  - name: How To Use This Guide
  - name: Abstract And TLDR
  - name: Reproducibility Box
  - name: Results Tables
  - name: Details And Appendices
  - name: Pseudocode
  - name: Code Diffs
  - name: Citations
  - name: Before You Publish
tabs: true
code_diff: true
pseudocode: true
pretty_table: true
---

Use these patterns when a post presents a claim, experiment, implementation detail, dataset, model behavior, or paper explanation. You do not need every section in every post. Pick the blocks that make the work easier to understand and verify.

## How To Use This Guide

Start with the simplest structure that makes the argument clear:

1. State the question.
2. Give the short answer.
3. Show the evidence.
4. Explain the limitations.
5. Link the artifacts readers need to reproduce or inspect the result.

For most posts, a TLDR, a small results table, and a reproducibility box are enough. Add pseudocode, diffs, or appendices only when they clarify the core idea.

## Abstract And TLDR

Use a short opening block when the post is longer than a few paragraphs. It should tell the reader what they will learn before they commit to the details.

```markdown
> **TLDR:** We compare two multilingual evaluation settings and find that prompt translation changes the ranking for low-resource languages. The result is strongest on generation tasks and weakest on classification tasks.
>
> **Key evidence:** A controlled ablation over four languages, one model family, and two prompt formats.
>
> **Main limitation:** The study uses a small benchmark slice, so treat it as a debugging signal rather than a leaderboard claim.
> {: .block-tip }
```

<!-- prettier-ignore-start -->

> **TLDR:** We compare two multilingual evaluation settings and find that prompt translation changes the ranking for low-resource languages. The result is strongest on generation tasks and weakest on classification tasks.
>
> **Key evidence:** A controlled ablation over four languages, one model family, and two prompt formats.
>
> **Main limitation:** The study uses a small benchmark slice, so treat it as a debugging signal rather than a leaderboard claim.
{: .block-tip }

<!-- prettier-ignore-end -->

## Reproducibility Box

Use a reproducibility box for experiment reports, benchmark notes, dataset writeups, or implementation posts. It should answer what someone would need to rerun or audit the result.

```markdown
{% raw %}{% details Reproducibility details %}

- **Code:** Link to the repository, commit, script, or notebook.
- **Data:** Name the dataset, split, filters, and any private data exclusions.
- **Model:** Name the model checkpoint, version, and decoding settings.
- **Environment:** Include hardware, dependency file, or container if relevant.
- **Evaluation:** Define metrics, prompts, judge model, and aggregation.
- **Limitations:** State what this setup does not test.

{% enddetails %}{% endraw %}
```

{% details Reproducibility details %}

- **Code:** Link to the repository, commit, script, or notebook.
- **Data:** Name the dataset, split, filters, and any private data exclusions.
- **Model:** Name the model checkpoint, version, and decoding settings.
- **Environment:** Include hardware, dependency file, or container if relevant.
- **Evaluation:** Define metrics, prompts, judge model, and aggregation.
- **Limitations:** State what this setup does not test.

{% enddetails %}

## Results Tables

Use simple Markdown tables for compact benchmark or ablation summaries. Include units in the header and keep table captions or surrounding text explicit about what changed.

```markdown
| Setting           | English | Spanish | Arabic | Hindi |
| ----------------- | ------: | ------: | -----: | ----: |
| Baseline prompts  |    68.0 |    54.0 |   49.0 |  46.0 |
| Localized prompts |    70.0 |    61.0 |   58.0 |  55.0 |
| Difference        |    +2.0 |    +7.0 |   +9.0 |  +9.0 |
```

| Setting           | English | Spanish | Arabic | Hindi |
| ----------------- | ------: | ------: | -----: | ----: |
| Baseline prompts  |    68.0 |    54.0 |   49.0 |  46.0 |
| Localized prompts |    70.0 |    61.0 |   58.0 |  55.0 |
| Difference        |    +2.0 |    +7.0 |   +9.0 |  +9.0 |

When a table needs sorting, search, or pagination, set `pretty_table: true` in front matter and use the Bootstrap Table pattern. Otherwise, prefer plain Markdown tables because they are easier to review.

## Details And Appendices

Details blocks are useful for extra prompts, hyperparameters, commands, derivations, or evaluation caveats that would interrupt the main post.

{% details Example prompt template %}

```text
You are evaluating whether the answer is supported by the passage.

Passage:
{{ passage }}

Answer:
{{ answer }}

Return one of: supported, unsupported, unclear.
```

{% enddetails %}

Use details blocks when the reader may want the information, but does not need it to follow the main argument.

## Pseudocode

Use pseudocode for algorithms, evaluation loops, reranking procedures, decoding strategies, or data filtering logic. Enable it with `pseudocode: true` in front matter.

Paste a fenced `pseudocode` block like this:

````markdown
```pseudocode
\begin{algorithm}
\caption{Evaluate a prompt variant}
\begin{algorithmic}
\PROCEDURE{EvaluateVariant}{$$D, M, P$$}
    \STATE $$total = 0$$
    \STATE $$count = 0$$
    \FOR{$$i = 1$$ \TO $$|D|$$}
        \STATE $$(x, y) = D[i]$$
        \STATE $$prediction = M(P(x))$$
        \STATE $$total = total + metric(prediction, y)$$
        \STATE $$count = count + 1$$
    \ENDFOR
    \STATE return $$total / count$$
\ENDPROCEDURE
\end{algorithmic}
\end{algorithm}
```
````

Rendered result:

```pseudocode
\begin{algorithm}
\caption{Evaluate a prompt variant}
\begin{algorithmic}
\PROCEDURE{EvaluateVariant}{$$D, M, P$$}
    \STATE $$total = 0$$
    \STATE $$count = 0$$
    \FOR{$$i = 1$$ \TO $$|D|$$}
        \STATE $$(x, y) = D[i]$$
        \STATE $$prediction = M(P(x))$$
        \STATE $$total = total + metric(prediction, y)$$
        \STATE $$count = count + 1$$
    \ENDFOR
    \STATE return $$total / count$$
\ENDPROCEDURE
\end{algorithmic}
\end{algorithm}
```

## Code Diffs

Use code diffs for implementation notes where the change itself is the result. Enable it with `code_diff: true` and use the `diff2html` code block language.

````markdown
```diff2html
diff --git a/eval.py b/eval.py
index 1111111..2222222 100644
--- a/eval.py
+++ b/eval.py
@@ -8,7 +8,7 @@ def normalize_score(raw_score, num_examples):
     if num_examples == 0:
         return 0.0

-    return raw_score / len(dataset)
+    return raw_score / num_examples
```
````

```diff2html
diff --git a/eval.py b/eval.py
index 1111111..2222222 100644
--- a/eval.py
+++ b/eval.py
@@ -8,7 +8,7 @@ def normalize_score(raw_score, num_examples):
     if num_examples == 0:
         return 0.0

-    return raw_score / len(dataset)
+    return raw_score / num_examples
```

Follow the diff with a short explanation of the behavioral impact. Do not make readers infer the result from the patch alone.

## Citations

Use inline links for ordinary references. Use Distill citations and a BibTeX file when the post depends on several papers or when the bibliography should appear in the appendix.

The main writing guide includes a live citation example and the front matter needed for `bibliography: my-post.bib`.

## Before You Publish

Before asking for review, check that the post has:

- A clear claim or question near the top.
- Enough context for readers outside the immediate project.
- A results table, figure, code snippet, or derivation that supports the claim.
- A limitations paragraph that says what the post does not prove.
- Reproducibility details for any experiment or benchmark.
- Links to papers, code, data, or model cards that readers need.

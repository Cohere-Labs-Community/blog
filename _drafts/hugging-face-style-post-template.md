---
layout: distill
title: Your Hugging Face-Style Article Title
date: 2026-05-01 09:00:00
description: A one-sentence deck that says what readers will learn or be able to do.
author: Cohere Labs Community
authors:
  - name: Your Name
    url: https://huggingface.co/your-handle
    bio: One short sentence about your work, role, or community contribution.
    affiliations:
      name: Cohere Labs Community
      url: https://cohere.com/research
  - name: Collaborator Name
    url: https://github.com/collaborator-handle
    bio: Optional short bio for the author card at the bottom of the article.
    affiliations:
      name: Cohere Labs Community
tags: community research tutorial
toc:
  - name: TLDR
  - name: Overview
  - name: Setup
  - name: Walkthrough
  - name: Results
  - name: Limitations
  - name: Resources
# Enable only the features the post actually uses.
# bibliography: your-post.bib
# chart: true
# mermaid: true
# tabs: true
# code_diff: true
# pseudocode: true
# pretty_table: true
---

> **TLDR:** State the core result, tutorial outcome, or argument in two or three sentences.
>
> **Why it matters:** Explain why a Hugging Face reader should keep going.
>
> **Best for:** Name the target reader, such as builders, researchers, educators, or contributors.
> {: .block-tip }

## TLDR

Use this section when the article is long or code-heavy. Give readers the conclusion before the details:

- What changed, shipped, or was tested.
- What evidence supports the claim.
- What readers can reproduce, try, or inspect.

## Overview

Open with context and a clear promise. Hugging Face-style posts usually work best when they answer one of these questions early:

- What can readers build or understand after reading?
- What model, dataset, Space, paper, benchmark, or repo is involved?
- What is surprising, useful, or reusable about the work?

## Setup

List the smallest set of requirements needed to follow along.

```bash
pip install package-name
```

If the post uses models, datasets, or Spaces, link them near the top so readers can inspect the artifacts.

<ul class="resource-links">
  <li><a class="resource-link" href="https://huggingface.co/cohere">Model or organization on Hugging Face</a></li>
  <li><a class="resource-link" href="https://github.com/Cohere-Labs-Community">Code repository</a></li>
  <li><a class="resource-link" href="https://huggingface.co/datasets">Dataset or benchmark</a></li>
</ul>

## Walkthrough

Break the article into short, scannable sections. Prefer runnable snippets over abstract descriptions.

```python
from dataclasses import dataclass


@dataclass
class Example:
    prompt: str
    expected_behavior: str


example = Example(
    prompt="Summarize the result in one sentence.",
    expected_behavior="The model should preserve the main claim and limitation.",
)
```

Explain what each important snippet demonstrates and where readers should adapt it.

## Results

Use this section for observations, measurements, examples, or qualitative findings. Keep the claim close to the evidence.

| Setting  | Outcome             | Notes                          |
| -------- | ------------------- | ------------------------------ |
| Baseline | Replace with result | Explain the control condition. |
| Variant  | Replace with result | Explain what changed.          |

## Limitations

State what the article does not prove. Good limitations make the post more credible:

- Dataset, language, or domain coverage.
- Model version or inference setting.
- Evaluation size or reviewer subjectivity.
- Known edge cases and failure modes.

## Resources

End with durable links readers can use after finishing the post.

- **Model:** Add a Hugging Face model URL when applicable.
- **Dataset:** Add a dataset URL when applicable.
- **Space or demo:** Add an interactive demo when applicable.
- **Code:** Link to the repo, notebook, or exact commit.
- **Paper:** Link to papers or citations used in the post.

## Citation

If readers should cite the article or underlying paper, add BibTeX in `assets/bibliography/` and set `bibliography:` in the front matter.

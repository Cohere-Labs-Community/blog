# Contributing

This blog publishes research notes, experiment reports, implementation writeups, and practical AI essays from the Cohere Labs Community.

## Propose or Edit a Post

1. Create or edit a dated Markdown file in `_posts/`.
2. Use `layout: distill` unless there is a specific reason to use another layout.
3. Keep the opening concise: state the question, claim, or result early.
4. Include enough evidence for readers to inspect the work: datasets, model versions, prompts, metrics, code links, or limitations where relevant.
5. Run formatting and a local build before review.

## Front Matter

Use clear metadata so the post index, archives, and social previews remain useful:

```yaml
---
layout: distill
title: Clear Research Post Title
date: 2026-05-01 09:00:00
description: One-sentence summary.
author: Cohere Labs Community
tags: research evaluation
toc:
  - name: Overview
  - name: Findings
---
```

Use `authors:` when a post should show linked Hugging Face, GitHub, or personal profiles in the article byline and author cards.

Add optional Distill flags only when the post uses the feature:

- `bibliography: file.bib` for a per-post BibTeX file in `assets/bibliography/`.
- `tabs: true` for tabbed content.
- `chart: true` for Chart.js figures.
- `mermaid: true` for Mermaid diagrams.
- `code_diff: true`, `pseudocode: true`, or `pretty_table: true` for the corresponding research-writing blocks.

## Editorial Checklist

- The title and description accurately describe the post.
- Claims are supported by links, tables, figures, examples, or reproducibility notes.
- Limitations and scope are stated plainly.
- Images and figures have useful captions or surrounding explanation.
- Citations are local to the post and resolve during the Jekyll build.
- Links are stable enough for publication.

## Verification

Run these before requesting review:

```bash
npx prettier . --write
docker compose run --rm -e JEKYLL_ENV=production jekyll bundle exec jekyll build
```

For large visual or layout changes, also run the dev server with `docker compose up` and inspect `http://localhost:8080`.

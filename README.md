# Cohere Labs Research Blog

This repository contains the Cohere Labs Community research blog. It is a trimmed Jekyll site focused on long-form research posts, technical notes, experiment reports, and practical AI writing.

The site started from the al-folio theme, but the active surface is intentionally small: posts live in `_posts/`, the home page lists posts, and optional Distill-style features support research writing.

## Local Development

Use Docker for the most consistent environment:

```bash
docker compose pull
docker compose up
```

The site is served at `http://localhost:8080`.

For a one-off production build, run:

```bash
docker compose run --rm -e JEKYLL_ENV=production jekyll bundle exec jekyll build
```

## Content Model

- `_posts/` contains dated research posts. Use `layout: distill` for the current post style.
- `_pages/blog.md` is the homepage and paginated post index.
- `_pages/about.md` describes the blog.
- `_pages/404.md` is the not-found page.
- `assets/bibliography/` contains optional per-post BibTeX files referenced from post front matter.
- `assets/img/` and `assets/video/` hold media used by posts and pages.

## Writing Posts

Create posts as `YYYY-MM-DD-title.md` files under `_posts/`. A typical research post starts with:

```yaml
---
layout: distill
title: Your Post Title
date: 2026-05-01 09:00:00
description: One-sentence summary for the index page and metadata.
author: Cohere Labs Community
tags: research evaluation
toc:
  - name: Overview
  - name: Results
bibliography: your-post.bib
---
```

Use `bibliography:` only when the post has a matching file in `assets/bibliography/`. Distill posts can also enable optional features such as `tabs: true`, `chart: true`, `mermaid: true`, `code_diff: true`, `pseudocode: true`, or `pretty_table: true` when the post actually uses them.

## Verification

Before opening a PR or publishing, run:

```bash
npx prettier . --write
docker compose run --rm -e JEKYLL_ENV=production jekyll bundle exec jekyll build
```

If you change dependencies or Docker configuration, rebuild with:

```bash
docker compose up --build
```

## Historical Template Docs

Original al-folio documentation is archived in `docs/upstream-al-folio/` for reference. Treat it as historical context, not active guidance for this trimmed blog.

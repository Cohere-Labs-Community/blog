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

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for topic guidance, the post workflow, the Markdown front matter template, and supported post options such as authors, citations, plots, Mermaid diagrams, tabs, and research-writing blocks.

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

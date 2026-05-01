# Copilot Instructions

This repository is a trimmed Jekyll research blog derived from al-folio. Optimize changes for a posts-first site, not a full academic profile theme.

## Active Stack

- Jekyll site built through Docker.
- Liquid layouts and includes in `_layouts/` and `_includes/`.
- Distill-style research posts in `_posts/`.
- Sass in `_sass/` and `assets/css/`.
- JavaScript in `assets/js/`.
- Per-post BibTeX files in `assets/bibliography/`.

The active Jekyll plugins are listed in `Gemfile`: archives, cache busting, feed, link attributes, minifier, pagination, regex replace, sitemap, tabs, terser, toc, jemoji, and third-party library URL expansion.

## Active Content

- `_posts/` is the primary content area.
- `_pages/blog.md` is the homepage and paginated post index.
- `_pages/about.md` and `_pages/404.md` are the other active pages.
- `docs/upstream-al-folio/` contains historical template docs and is excluded from the generated site.

Do not reintroduce removed collections or features unless explicitly asked: publications, CV, projects, teachings, news, books, repository cards, site search, Jupyter conversion, RenderCV, Google Scholar citation updates, or ImageMagick image generation.

## Development Commands

```bash
docker compose up
npx prettier . --write
docker compose run --rm -e JEKYLL_ENV=production jekyll bundle exec jekyll build
```

Use `docker compose up --build` after dependency, Dockerfile, or Gemfile changes.

## Implementation Guidance

- Follow existing Liquid and Sass patterns before adding abstractions.
- Keep docs and maintainer-only files in `_config.yml` `exclude:`.
- Preserve Distill features used by posts: `toc`, author metadata, per-post bibliography, tabs, charts, Mermaid, pseudocode, code diffs, and pretty tables.
- Add front matter flags only when content uses the corresponding feature.
- Keep external library loading conditional where possible.
- After substantive edits, run Prettier and a Docker Jekyll build.

## File-Type Instructions

- Markdown content: `.github/instructions/markdown-content.instructions.md`
- BibTeX citations: `.github/instructions/bibtex-bibliography.instructions.md`
- YAML config: `.github/instructions/yaml-configuration.instructions.md`
- Liquid templates: `.github/instructions/liquid-templates.instructions.md`
- JavaScript: `.github/instructions/javascript-scripts.instructions.md`

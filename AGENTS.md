# Agent Guidelines

This repository is the Cohere Labs Community research blog. It is a trimmed Jekyll site focused on posts, not the full upstream al-folio academic website.

## Start Here

- Read `README.md` for setup, content model, and verification commands.
- Read `CONTRIBUTING.md` before changing research posts.
- Read `.github/copilot-instructions.md` for the current stack and build expectations.
- Treat `docs/upstream-al-folio/` as historical reference only.

## Active Site Model

- Posts live in `_posts/` and normally use `layout: distill`.
- The homepage is `_pages/blog.md` and paginates `site.posts`.
- The only active pages are `_pages/blog.md`, `_pages/about.md`, and `_pages/404.md`.
- Per-post citations use BibTeX files in `assets/bibliography/` and `bibliography:` in post front matter.
- Do not reintroduce removed al-folio features such as sitewide publications, CV rendering, projects, teachings, news collections, repository cards, search UI, Jupyter conversion, or ImageMagick responsive image generation unless explicitly requested.

## Essential Commands

```bash
docker compose up
npx prettier . --write
docker compose run --rm -e JEKYLL_ENV=production jekyll bundle exec jekyll build
```

Use `docker compose up --build` after dependency or Docker changes.

## File-Specific Guidance

| Area                     | Instruction                                                |
| ------------------------ | ---------------------------------------------------------- |
| Markdown posts and pages | `.github/instructions/markdown-content.instructions.md`    |
| Per-post BibTeX          | `.github/instructions/bibtex-bibliography.instructions.md` |
| YAML and `_config.yml`   | `.github/instructions/yaml-configuration.instructions.md`  |
| Liquid layouts/includes  | `.github/instructions/liquid-templates.instructions.md`    |
| JavaScript assets        | `.github/instructions/javascript-scripts.instructions.md`  |
| Git workflow             | `.github/GIT_WORKFLOW.md`                                  |

## Working Rules

- Prefer small, focused changes that match the existing Jekyll and Liquid patterns.
- Preserve Distill post support, pagination, archives, RSS, sitemap, dark mode, and comments configuration.
- Keep maintainer docs excluded from Jekyll output through `_config.yml`.
- Run formatting and a Docker Jekyll build after substantive edits.

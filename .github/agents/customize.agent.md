# Customization Agent Guidance

Use this guidance when changing the blog's appearance, metadata, navigation, or content model.

## Scope

This repository is a research blog. Customizations should support posts, the homepage index, the about page, and the Distill reading experience.

## Common Changes

- Site metadata: edit `_config.yml`.
- Homepage copy and pagination: edit `_pages/blog.md`.
- About page copy: edit `_pages/about.md`.
- Post styling: edit `_sass/`, `assets/css/main.scss`, or the relevant Liquid layout.
- Post assets: use `assets/img/`, `assets/video/`, and `assets/bibliography/`.

## Guardrails

- Keep `docs/upstream-al-folio/` excluded from Jekyll output.
- Do not restore upstream al-folio profile features unless explicitly requested.
- Verify visual changes with `docker compose up` and a production build.

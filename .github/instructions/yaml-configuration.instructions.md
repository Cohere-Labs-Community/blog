---
applyTo: "_config.yml,_data/**/*.yml,.github/workflows/**/*.yml"
---

# YAML Configuration Instructions

Keep configuration scoped to the active research blog.

## `_config.yml`

- Preserve the posts-first model: `_pages` included, posts paginated, archives enabled for posts.
- Keep maintainer docs and archived upstream docs in `exclude:`.
- Update `url` and `baseurl` together when changing deployment targets.
- Keep analytics fields blank unless a real provider ID is available.
- Quote strings containing colons, hashes, braces, or other YAML-sensitive characters.

## Do Not Reintroduce

- Collections for projects, teachings, news, books, or publications.
- Jekyll Scholar configuration.
- RenderCV or Google Scholar citation update settings.
- ImageMagick responsive image configuration.
- Jupyter notebook conversion configuration.

## Workflows

- Keep workflows aligned with the reduced Docker/Gemfile stack.
- Do not add Python, ImageMagick, notebook, or RenderCV setup unless the corresponding feature is intentionally restored.

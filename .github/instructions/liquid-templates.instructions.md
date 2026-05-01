---
applyTo: "_includes/**/*.liquid,_layouts/**/*.liquid,_pages/**/*.md"
---

# Liquid Template Instructions

Liquid changes should preserve the trimmed research-blog surface.

## Active Layout Behavior

- `distill` posts are the primary content experience.
- `default`, `page`, and post-related layouts should stay focused on posts and simple pages.
- Keep Distill support for TOC, authors, bibliography, tabs, charts, Mermaid, pseudocode, code diffs, and pretty tables.
- Keep third-party libraries conditional so posts only load the scripts they need.

## Navigation

- Navigation should reflect the active pages only: blog/home, about, and any deliberate future page.
- Do not add links to removed collections such as publications, projects, teaching, repositories, CV, news, or books.

## Avoid

- Do not add `jekyll-scholar` Liquid tags.
- Do not recreate search UI includes.
- Do not add templates for removed academic collections unless explicitly requested.

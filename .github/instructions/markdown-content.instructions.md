---
applyTo: "_posts/**/*.md,_pages/blog.md,_pages/about.md,_pages/404.md"
---

# Markdown Content Instructions

This site is a research blog. Keep Markdown guidance scoped to posts and the small set of active pages.

## Posts

- Put posts in `_posts/` using `YYYY-MM-DD-title.md`.
- Prefer `layout: distill` for research posts.
- Include `title`, `date`, `description`, `author`, and useful `tags`.
- Use `toc:` entries for longer posts and ensure the names match section headings.
- Use optional feature flags only when needed: `bibliography`, `tabs`, `chart`, `mermaid`, `code_diff`, `pseudocode`, or `pretty_table`.
- Explain research claims with enough context to inspect them: setup, data, models, metrics, results, and limitations where relevant.

## Active Pages

- `_pages/blog.md` is the homepage and post index. Keep pagination settings intact unless changing the listing behavior deliberately.
- `_pages/about.md` should describe the blog, not an individual academic profile.
- `_pages/404.md` should stay minimal and resilient.

## Citations

Use Distill per-post citations only. A post with `bibliography: file.bib` must have a matching file in `assets/bibliography/`.

Do not use `_bibliography/papers.bib`, `{% bibliography %}`, or sitewide publication pages.

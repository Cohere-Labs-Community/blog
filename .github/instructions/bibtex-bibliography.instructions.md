---
applyTo: "assets/bibliography/**/*.bib,_posts/**/*.md"
---

# Per-Post Bibliography Instructions

The blog uses Distill-style per-post bibliographies. It does not use the removed sitewide publication stack.

## BibTeX Files

- Store BibTeX files in `assets/bibliography/`.
- Prefer one bibliography file per cited post.
- Name files after the post or topic, for example `2026-05-01-evaluation-notes.bib`.
- Keep keys short, stable, and readable.
- Include enough metadata for readers to identify the work: `title`, `author`, `year`, and `url` or `doi` when available.

## Post Front Matter

Reference the file from the post:

```yaml
bibliography: 2026-05-01-evaluation-notes.bib
```

Then cite entries in post content using the existing Distill citation style for the layout.

## Avoid

- Do not create `_bibliography/papers.bib`.
- Do not use `jekyll-scholar` tags such as `{% bibliography %}`.
- Do not add publication badges, citation counts, or sitewide publication metadata.

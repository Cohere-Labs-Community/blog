---
applyTo: "assets/js/**/*.js,_scripts/**/*.js"
---

# JavaScript Instructions

Keep JavaScript small and tied to active blog behavior.

## Active Uses

- Theme and dark-mode behavior.
- Distill post enhancements.
- Optional post features such as charts, Mermaid, tabs, code diffs, pseudocode, and tables.
- Build-time scripts only when they are part of the current asset pipeline.

## Guidance

- Prefer existing utilities and initialization patterns in `assets/js/`.
- Guard feature-specific code so it only runs when the matching markup exists.
- Avoid global side effects that affect all posts unnecessarily.
- Run Prettier after edits.

## Avoid

- Do not restore removed search scripts.
- Do not add Jupyter notebook helpers.
- Do not add JavaScript for removed academic collections or repository cards.

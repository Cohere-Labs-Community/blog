# Guide for Cohere Labs Open Science Community Blog

## Introduction

Welcome to the Cohere Labs Open Science Community Blog. This initiative showcases our community, celebrates successes, and highlights engaging projects and individuals. The blog is a place to amplify your voice, foster collaboration, and inspire others to join our open science journey.

## Content Types

We are excited to profile a variety of materials, including:

- **Deep Dives:** Explore recently published work supported by the community, such as Expeditions or collaborative projects.
- **Community Spotlights:** Highlight interesting work, people, or projects within our community.
- **Project Updates and Invitations:** Share accessible deep dives into ongoing projects and invite others to join.
- **Open Problems and Explorations:** Propose ideas for community members to explore after publication of Cohere Labs-owned projects.
- **Event and Program Recaps:** Summarize workshops, reading groups, or community initiatives.
- **Stories from the Community:** Share your research journey, advice, lessons learned, and personal experiences.
- **Other:** Let us know what you would like to write about.

## Instructions for Contributors

### Step 1: Propose Your Topic

Begin by reaching out to Madeline or Brittawnya to propose your topic. We will discuss the idea, audience, scope, timeline, and whether the piece should be a technical deep dive, community story, project update, or another format.

### Step 2: Draft Your Post

Once aligned, draft your blog in a Google Doc and tag Madeline or Brittawnya for feedback. Aim for roughly 500-1,200 words, but prioritize clarity and storytelling over word count.

Keep the opening concise. Readers should quickly understand the question, story, project, or result, and why it matters to the Cohere Labs community.

### Step 3: Include Key Elements

Your blog should include the following elements:

- **Focus:** Balance technical details with personal insight, advice, and your research journey. First person is welcome when the post is about your experience.
- **Evidence:** For research or project posts, include enough detail for readers to inspect the work: datasets, model versions, prompts, metrics, code links, examples, limitations, or open questions.
- **Images and illustrations:** Optional but encouraged. Add figures, screenshots, diagrams, or plots when they make the narrative easier to follow.
- **Author bio and photo:** Provide a brief third-person bio and, optionally, a headshot for the "About the author" section.
- **Links:** Include stable links to papers, repositories, datasets, demos, model cards, events, or community resources when relevant.

### Step 4: Review and Revise

Two Cohere Labs team members will review your draft and provide feedback. We want your blog to shine in your unique voice, so revisions will focus on clarity, structure, accessibility, and whether the evidence supports the main takeaway.

Before moving to Markdown, check that the post has:

- A clear title and one-sentence description.
- A strong opening that states the topic or takeaway.
- Enough context for readers outside the immediate project.
- Captions or surrounding explanation for images, figures, and plots.
- Plainly stated limitations, caveats, or next steps where relevant.

### Step 5: Prepare for Publication

After approval, build your post in the [Community GitHub Blog repo](https://github.com/Cohere-Labs-Community/blog/tree/main/_posts). Create a Markdown file named `YYYY-MM-DD-short-title.md` under `_posts/`.

Use this front matter template at the top of your post:

```yaml
---
layout: distill
title: "Your Title Here"
date: YYYY-MM-DD HH:MM:SS
description: "One-sentence description of your post."
author: "Your Name"
authors:
  - name: "Your Full Name"
    url: "https://example.com"
    image: "your-name.jpg"
    bio: "A short third-person bio for the About the author section."
    affiliations:
      name: "Cohere Labs Community"
tags: community research writing
toc:
  - name: Introduction
  - name: Main Section
---
```

Keep `author:` even when you add `authors:`. The short `author:` value is useful for previews and listings; the richer `authors:` list powers Distill bylines and author cards.

Only add optional post features when the post actually uses them. The next section explains the available options and plugins.

### Step 6: Submit via Pull Request

Once your post is ready in Markdown, submit it as a pull request. We will handle the final publication steps.

Before requesting review, run:

```bash
npx prettier . --write
docker compose run --rm -e JEKYLL_ENV=production jekyll bundle exec jekyll build
```

For large visual or layout changes, also run the dev server with `docker compose up` and inspect `http://localhost:8080`.

## Post Options and Plugins

The blog uses Jekyll with Distill-style post support. Most posts should stay simple: Markdown, headings, links, code fences, images, and a few well-chosen figures. Richer options are available when they make the post clearer.

### Authors

Use `authors:` when the post should show linked profiles, affiliations, and author cards. Each author can include:

- `name`: Required.
- `url`: Optional profile link, such as a personal site, Hugging Face profile, GitHub profile, or LinkedIn page.
- `image`: Optional author image. A bare filename like `your-name.jpg` resolves to `assets/img/authors/your-name.jpg`; paths such as `authors/your-name.jpg` resolve under `assets/img/`.
- `bio`: Optional third-person bio for the bottom "About the author" section.
- `affiliations.name` and `affiliations.url`: Optional organization metadata shown in the byline.

### Table of Contents

Use `toc:` for longer posts. Named entries give you precise control over what appears:

```yaml
toc:
  - name: Introduction
  - name: Results
  - name: What Comes Next
```

Or can also use `toc: true` to generate a table of contents from headings.

### Citations and Bibliographies

For ordinary references, inline links are enough. For citation-heavy research posts, add a BibTeX file under `assets/bibliography/`, point to it from front matter, and cite keys with Distill tags:

```yaml
bibliography: my-post.bib
```

```html
This follows prior work <d-cite key="example2026paper"></d-cite>.
```

The file named in `bibliography:` must exist in `assets/bibliography/`.

### Images, Figures, and Media

Put images under `assets/img/` and videos under `assets/video/`. Use alt text and captions so the figure is understandable outside the surrounding paragraph.

```liquid
{% include figure.liquid path="assets/img/my-figure.png" alt="Short accessible description" caption="The main result in one sentence." %}
```

Use wider layout classes only for content that needs more room, such as large diagrams, wide tables, or interactive plots.

### Plots and Charts

Interactive plots are supported through per-post chart flags:

```yaml
chart:
  chartjs: true
  plotly: true
  echarts: true
  vega_lite: true
```

- **Chart.js:** Enable with `chart.chartjs: true` and use fenced `chartjs` blocks containing a Chart.js JSON config.
- **Plotly.js:** Enable with `chart.plotly: true` and use fenced `plotly` blocks containing `data` and optional `layout`.
- **ECharts:** Enable with `chart.echarts: true` and use fenced `echarts` blocks containing an ECharts option object.
- **Vega-Lite:** Enable with `chart.vega_lite: true` and use fenced `vega_lite` blocks containing a Vega-Lite spec.

### Diagrams with Mermaid

Use Mermaid when a flowchart, sequence diagram, or state diagram is clearer than prose:

```yaml
mermaid:
  enabled: true
  zoomable: false
```

Set `zoomable: true` only for large diagrams that benefit from pan and zoom behavior. Then add fenced `mermaid` blocks in the post body.

### Tabs

Use tabs to compare prompts, configurations, outputs, or short alternatives without making the post long:

```yaml
tabs: true
```

```liquid
{% tabs example %}
{% tab example Prompt %}
Prompt text goes here.
{% endtab %}
{% tab example Evaluation %}
Evaluation notes go here.
{% endtab %}
{% endtabs %}
```

### Math

Distill posts support native math tags:

```html
Inline math: <d-math>p(y \mid x)</d-math>

<d-math block> \mathcal{L}(\theta) = -\sum_i \log p_\theta(y_i \mid x_i) </d-math>
```

Add `math: true` only when a post needs MathJax beyond Distill's native math handling.

### Research Writing Blocks

These options are useful for technical posts:

- `pseudocode: true` enables rendered algorithm blocks from fenced `pseudocode` code.
- `code_diff: true` enables rendered diffs from fenced `diff2html` code.
- `pretty_table: true` enables Bootstrap Table for searchable or sortable tables.

Prefer plain Markdown tables unless sorting, searching, or pagination is important.

## Promotion

When your blog goes live, we will:

1. **Share on social media:** Post on LinkedIn and Twitter with a graphic featuring a quote from your post. Share your social media handles so we can tag you.
2. **Discord announcement:** Post about your blog in the Cohere Labs Discord servers, tagging you when possible.
3. **Newsletter highlight:** Feature your post in our end-of-month email newsletter.

## Let's Get Started

We are excited to see your contributions and share your stories with the world. If you have any questions, reach out to Madeline or Brittawnya. Happy writing!

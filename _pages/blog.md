---
layout: default
permalink: /
title: articles
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 5
  sort_field: date
  sort_reverse: true
  trail:
    before: 1 # The number of links before the current page
    after: 3 # The number of links after the current page
---

<!-- markdownlint-disable MD033 -->

<div class="post blog-home">

{% assign blog_name_size = site.blog_name | size %}
{% assign blog_description_size = site.blog_description | size %}

{% if blog_name_size > 0 or blog_description_size > 0 %}

  <div class="blog-hero" role="region" aria-labelledby="blog-hero-title">
    <div class="blog-hero__inner">
      <div class="blog-hero__mark-wrap" aria-hidden="true">
        <img
          class="blog-hero__mark"
          src="{{ '/assets/img/brand/cohere-labs-community-mark.png' | relative_url }}"
          alt=""
          width="88"
          height="88"
          loading="eager"
        >
      </div>
      <div class="blog-hero__copy">
        <p class="blog-hero__eyebrow">Open Science Community</p>
        <h1 id="blog-hero-title" class="blog-hero__title">{{ site.blog_name }}</h1>
        {% if blog_description_size > 0 %}
          <p class="blog-hero__lead">{{ site.blog_description }}</p>
        {% endif %}
        <p class="blog-hero__mission">
          Research notes, stories, and ideas from people shaping AI together—transparent, collaborative, and community-led.
        </p>
        <div class="blog-hero__actions">
          <a class="blog-hero__btn blog-hero__btn--primary" href="#latest-posts">Read the latest</a>
          <a
            class="blog-hero__btn blog-hero__btn--secondary"
            href="https://cohere.com/research/open-science"
            rel="external nofollow noopener noreferrer"
            target="_blank"
          >Join the community</a>
        </div>
      </div>
    </div>
  </div>
{% endif %}

  <h2 id="latest-posts" class="blog-home__section-title">Latest posts</h2>

  <ul class="post-list post-list--cards">

    {% if page.pagination.enabled %}
      {% assign postlist = paginator.posts %}
    {% else %}
      {% assign postlist = site.posts %}
    {% endif %}

    {% for post in postlist %}
      {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
      {% assign tags = post.tags | join: "" %}

      <li class="post-list__item">
        <article class="post-card">
          <h3 class="post-card__title">
            <a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </h3>

          {% if post.description %}
            <p class="post-card__excerpt">{{ post.description }}</p>
          {% endif %}

          <p class="post-meta post-card__meta">
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%B %d, %Y' }}</time>
            {% if post.author %}
              <span class="post-card__meta-sep" aria-hidden="true">&middot;</span>
              <span>{{ post.author }}</span>
            {% endif %}
            <span class="post-card__meta-sep" aria-hidden="true">&middot;</span>
            <span>{{ read_time }} min read</span>
          </p>

          {% if tags != "" %}
            <p class="post-tags post-card__tags">
              {% for tag in post.tags %}
                <a class="post-card__tag" href="{{ tag | slugify | prepend: '/tag/' | relative_url }}">
                  <i class="fa-solid fa-hashtag fa-sm" aria-hidden="true"></i>{{ tag }}
                </a>
              {% endfor %}
            </p>
          {% endif %}
        </article>
      </li>

    {% endfor %}

  </ul>

{% if page.pagination.enabled %}
{% include pagination.liquid %}
{% endif %}

</div>

<!-- markdownlint-enable MD033 -->

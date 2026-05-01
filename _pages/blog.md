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

<div class="post">

{% assign blog_name_size = site.blog_name | size %}
{% assign blog_description_size = site.blog_description | size %}

{% if blog_name_size > 0 or blog_description_size > 0 %}

  <div class="header-bar">
    <h1>{{ site.blog_name }}</h1>
    <h2>{{ site.blog_description }}</h2>
  </div>
{% endif %}

  <ul class="post-list">

    {% if page.pagination.enabled %}
      {% assign postlist = paginator.posts %}
    {% else %}
      {% assign postlist = site.posts %}
    {% endif %}

    {% for post in postlist %}
      {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
      {% assign tags = post.tags | join: "" %}

      <li>
        <h3>
          <a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
        </h3>

        {% if post.description %}
          <p>{{ post.description }}</p>
        {% endif %}

        <p class="post-meta">
          {{ post.date | date: '%B %d, %Y' }}
          {% if post.author %}
            &nbsp; &middot; &nbsp; {{ post.author }}
          {% endif %}
          &nbsp; &middot; &nbsp; {{ read_time }} min read
        </p>

        {% if tags != "" %}
          <p class="post-tags">
            {% for tag in post.tags %}
              <a href="{{ tag | slugify | prepend: '/tag/' | relative_url }}"> <i class="fa-solid fa-hashtag fa-sm"></i> {{ tag }}</a>
              {% unless forloop.last %}
                &nbsp;
              {% endunless %}
            {% endfor %}
          </p>
        {% endif %}
      </li>

    {% endfor %}

  </ul>

{% if page.pagination.enabled %}
{% include pagination.liquid %}
{% endif %}

</div>

<!-- markdownlint-enable MD033 -->

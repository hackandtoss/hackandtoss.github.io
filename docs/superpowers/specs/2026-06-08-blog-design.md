# Blog Feature Design

**Date:** 2026-06-08
**Status:** Approved

## Overview

Add a blog section to hackandtoss.github.io for mixed content: CTF writeups, cybersecurity tutorials, and general tech notes. Articles are authored in Markdown with YAML front matter. Jekyll (GitHub Pages) renders them into individual post pages. A blog index page provides a card grid with category filtering and chronological ordering.

## Architecture

### File Structure

```
hackandtoss.github.io/
├── _config.yml                  ← add collection declaration
├── _blog/
│   └── slug.md                  ← articles (one file per post)
├── _layouts/
│   ├── default.html             ← unchanged
│   └── post.html                ← NEW: individual post layout
├── blog.html                    ← NEW: blog index (cards + filter)
└── js/
    └── blog.js                  ← NEW: tag filter + TOC logic
```

### `_config.yml` Addition

```yaml
collections:
  blog:
    output: true
    permalink: /blog/:name/
```

Articles live in `_blog/slug.md`. Jekyll generates pages at `/blog/slug/`. No date prefix required in filenames — date lives in front matter.

## Article Front Matter Schema

```yaml
---
layout: post
title: "HTB — Busqueda Writeup"
date: 2024-06-01
tags: [ctf, htb, linux, web]
category: ctf
excerpt: "One-sentence summary shown on the index card."
---
```

- `category`: single value from `ctf | tutorial | notes` — drives filter buttons and card button color
- `tags`: freeform array — shown as badge pills on cards and post pages
- `excerpt`: shown as card body text on the index; if omitted, Jekyll falls back to the first 200 characters of content

## Blog Index (`blog.html`)

**Front matter:**
```yaml
---
layout: default
title: hackandtoss - Blog
nav: blog
---
```

**Page structure (top to bottom):**

1. **Header** — `<h1><i class="fas fa-pencil-alt"></i> Blog</h1>` with subtitle
2. **Filter bar** — Bootstrap pill buttons with Font Awesome icons:
   - `<i class="fas fa-border-all"></i>` All
   - `<i class="fas fa-flag"></i>` CTF
   - `<i class="fas fa-graduation-cap"></i>` Tutorial
   - `<i class="fas fa-sticky-note"></i>` Notes
   - Active pill uses filled Bootstrap style; inactive uses outlined. JS toggles visibility of cards by matching `data-category` attribute.
3. **Card grid** — `row-cols-1 row-cols-md-2 row-cols-lg-3 g-4`, sorted newest-first via Liquid (`site.blog | sort: 'date' | reverse`).

**Card anatomy:**
- `card-title`: post title
- `<i class="fas fa-calendar-alt"></i>` date (MMM DD, YYYY, `text-secondary`)
- `card-text`: excerpt
- `<i class="fas fa-tag"></i>` tag badges (Bootstrap badge pills)
- `card-footer`: "Read Post" button — color by category:
  - `btn-danger` for CTF
  - `btn-primary` for Tutorial
  - `btn-secondary` for Notes

## Individual Post Layout (`_layouts/post.html`)

Uses `layout: default` in its own front matter so it inherits navbar/footer/theme.

**Structure (top to bottom):**

1. **Post header**
   - `<h1>` title
   - Metadata bar: `<i class="fas fa-calendar-alt"></i>` date · `<i class="fas fa-folder"></i>` category · estimated read time (word count ÷ 200, computed in Liquid)

2. **Tag badges** — `<i class="fas fa-tags"></i>` + Bootstrap badge pills

3. **Table of contents** — collapsible `<nav id="toc">` block. `blog.js` scans `h2`/`h3` tags in the rendered post body, injects anchor `id` attributes, and populates the TOC list. Hidden on mobile (`d-none d-md-block`), shown inline on `md+`.

4. **Article body** — `{{ content }}` rendered by Jekyll from Markdown, inherits existing typography (JetBrains Mono, dark mode via `.dark-mode` CSS class).

5. **Prev/Next navigation**
   - Left: `<i class="fas fa-arrow-left"></i>` + previous post title (link)
   - Right: next post title + `<i class="fas fa-arrow-right"></i>` (link)
   - Computed in Liquid by iterating `site.blog | sort: 'date'`

## `blog.js`

Two responsibilities:

**Tag filter:**
- On pill button click: set active style on clicked button, remove from others, show/hide cards by comparing `data-category` attribute to selected category (`all` shows everything).

**Table of contents:**
- On `DOMContentLoaded`: query all `h2`, `h3` within the post body container, assign an `id` derived from the heading text (slugified), build a nested `<ul>` and inject it into `#toc`. `h2` → top-level `<li>`, `h3` → nested `<li>`.

## Navbar Update

The navbar already has a Blog link (`href="#blog"`). Change it to `href="{{ '/blog.html' | relative_url }}"` and add the active state check:

```liquid
{% if page.nav == 'blog' %} active{% endif %}
```

## Dark Mode

No extra work required. The existing `.dark-mode` CSS already covers Bootstrap cards, badges, and nav components. The post body inherits `body` color and `background-color` from the theme toggle.

## Error Handling / Edge Cases

- Posts with no `excerpt` field: Liquid falls back to `post.content | truncatewords: 40` on the index card.
- Posts with no `tags`: tag section is conditionally rendered with `{% if post.tags.size > 0 %}`.
- Empty blog collection: index page shows a "No posts yet" message instead of an empty grid.
- TOC with no `h2`/`h3` headings: `blog.js` hides the TOC container rather than rendering an empty nav.

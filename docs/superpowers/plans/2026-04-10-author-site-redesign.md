# dylanreed.com Author Site Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Hugo pixel-art link hub with an 11ty-powered author website using a Writer's Notebook visual design, Buttondown newsletter signup, and dylan.blog RSS feed integration.

**Architecture:** Static site built with Eleventy 3.x, Nunjucks templates, vanilla CSS. Book catalog driven by `_data/books.json` with auto-generated individual pages. Blog feed pulled via `eleventy-fetch` at build time. Deployed to GitHub Pages via GitHub Actions with daily cron rebuild.

**Tech Stack:** Eleventy 3.x, Nunjucks, vanilla CSS, Google Fonts (Lora + IBM Plex Mono), Buttondown (newsletter), eleventy-fetch (RSS), GitHub Actions + GitHub Pages

**Spec:** `docs/superpowers/specs/2026-04-10-author-site-redesign-design.md`

---

## File Map

### New Files (create)

| File | Responsibility |
|------|---------------|
| `.eleventy.js` | 11ty config: input/output dirs, passthrough copies, custom filters, book page generation |
| `package.json` | Dependencies and scripts |
| `src/_data/site.json` | Global metadata (title, description, URLs, social links) |
| `src/_data/books.json` | Book catalog (title, genre, status, blurb, universe, etc.) |
| `src/_includes/layouts/base.njk` | HTML shell: head, Google Fonts, nav partial, footer partial |
| `src/_includes/layouts/page.njk` | Standard page layout extending base |
| `src/_includes/layouts/book.njk` | Individual book page layout extending base |
| `src/_includes/partials/nav.njk` | Navigation bar |
| `src/_includes/partials/footer.njk` | Footer with social links and copyright |
| `src/_includes/partials/newsletter.njk` | Buttondown signup form |
| `src/_includes/partials/book-card.njk` | Reusable book card component |
| `src/_includes/partials/blog-feed.njk` | Blog post list from RSS data |
| `src/assets/css/style.css` | Complete notebook theme stylesheet |
| `src/assets/images/dylan.jpeg` | Author headshot (copy from docs/) |
| `src/index.njk` | Home page |
| `src/about.njk` | About / bio page |
| `src/books/index.njk` | Books landing page |
| `src/blog.njk` | Blog feed page |
| `src/contact.njk` | Contact page |
| `src/404.njk` | 404 page |
| `.github/workflows/gh-pages.yml` | GitHub Pages deploy + daily cron |
| `CNAME` | Custom domain file |
| `.gitignore` | Ignore _site, node_modules, .superpowers |

### Modify Files

| File | Change |
|------|--------|
| `CLAUDE.md` | Update to reflect 11ty stack, new scripts, new conventions |

### Remove (after new site is working)

Old Hugo files: `config.toml`, `config/`, `layouts/`, `static/`, `content/`, `archetypes/`, `themes/`

---

## Task 1: Project Scaffold & 11ty Config

**Files:**
- Create: `package.json`
- Create: `.eleventy.js`
- Create: `.gitignore`
- Create: `CNAME`
- Create: `src/_data/site.json`

- [ ] **Step 1: Initialize package.json**

```json
{
  "name": "dylanreed.com",
  "version": "2.0.0",
  "description": "Dylan Reed — Fiction Writer",
  "private": true,
  "scripts": {
    "dev": "npx @11ty/eleventy --serve",
    "build": "npx @11ty/eleventy"
  },
  "dependencies": {
    "@11ty/eleventy": "^3.1.5",
    "@11ty/eleventy-fetch": "^4.0.0"
  }
}
```

- [ ] **Step 2: Create .eleventy.js config**

```js
// ABOUTME: Eleventy configuration for dylanreed.com author site.
// ABOUTME: Configures input/output dirs, passthrough copies, filters, and book page generation.

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");

  eleventyConfig.addFilter("genreColor", (genre) => {
    const colors = {
      "Cozy Fantasy": "#6b8e6b",
      "Sci-Fi": "#4a7a8b",
      "Romance": "#b5566a",
      "Steampunk": "#b8860b",
      "Urban Fantasy": "#7b68ae",
      "Noir": "#555555",
      "Space Western": "#c9784c"
    };
    return colors[genre] || "#8b7355";
  });

  eleventyConfig.addFilter("statusLabel", (status) => {
    const labels = {
      "published": "published",
      "submitted": "submitted",
      "available-soon": "available soon",
      "in-revision": "in revision",
      "in-progress": "in progress"
    };
    return labels[status] || status;
  });

  eleventyConfig.addCollection("bookPages", function(collectionApi) {
    const books = require("./src/_data/books.json");
    return books;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "html"],
    htmlTemplateEngine: "njk"
  };
};
```

- [ ] **Step 3: Create .gitignore**

```
_site/
node_modules/
.superpowers/
.DS_Store
```

- [ ] **Step 4: Create CNAME**

```
dylanreed.com
```

- [ ] **Step 5: Create src/_data/site.json**

```json
{
  "title": "Dylan Reed",
  "description": "Fiction writer. Speculative fiction, cozy fantasy, sci-fi, and stories about systems that fail the people inside them.",
  "url": "https://dylanreed.com",
  "blogUrl": "https://dylan.blog",
  "blogFeedUrl": "https://dylan.blog/index.xml",
  "email": "dylan@dylanreed.com",
  "social": {
    "blog": "https://dylan.blog",
    "instagram": "https://instagram.com/dylannotdylan",
    "github": "https://github.com/dylannotdylan",
    "linkedin": "https://linkedin.com/in/dylanreed"
  }
}
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` generated

- [ ] **Step 7: Verify 11ty builds (empty site)**

Run: `npx @11ty/eleventy`
Expected: Build succeeds with 0 files written (no templates yet)

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json .eleventy.js .gitignore CNAME src/_data/site.json
git commit -m "feat: scaffold 11ty project with config and site data"
```

---

## Task 2: Base Layout & CSS Notebook Theme

**Files:**
- Create: `src/_includes/layouts/base.njk`
- Create: `src/_includes/partials/nav.njk`
- Create: `src/_includes/partials/footer.njk`
- Create: `src/assets/css/style.css`
- Copy: `docs/dylan.jpeg` → `src/assets/images/dylan.jpeg`

- [ ] **Step 1: Copy headshot image**

```bash
cp docs/dylan.jpeg src/assets/images/dylan.jpeg
```

- [ ] **Step 2: Create nav partial**

Create `src/_includes/partials/nav.njk`:

```html
{# ABOUTME: Site navigation bar with monospace styling. #}
{# ABOUTME: Hamburger menu on mobile, inline links on desktop. #}

<nav class="site-nav" role="navigation" aria-label="Main navigation">
  <a href="/" class="nav-home">Dylan Reed</a>
  <button class="nav-toggle" aria-expanded="false" aria-controls="nav-links" aria-label="Toggle navigation">
    ☰
  </button>
  <ul id="nav-links" class="nav-links">
    <li><a href="/" {% if page.url == "/" %}aria-current="page"{% endif %}>Home</a></li>
    <li><a href="/books/" {% if page.url == "/books/" %}aria-current="page"{% endif %}>Books</a></li>
    <li><a href="/about/" {% if page.url == "/about/" %}aria-current="page"{% endif %}>About</a></li>
    <li><a href="/blog/" {% if page.url == "/blog/" %}aria-current="page"{% endif %}>Blog</a></li>
    <li><a href="/contact/" {% if page.url == "/contact/" %}aria-current="page"{% endif %}>Contact</a></li>
  </ul>
</nav>
```

- [ ] **Step 3: Create footer partial**

Create `src/_includes/partials/footer.njk`:

```html
{# ABOUTME: Site footer with social links and copyright. #}
{# ABOUTME: Monospace styled links matching notebook theme. #}

<footer class="site-footer">
  <div class="footer-links">
    <a href="{{ site.social.blog }}">blog</a>
    <span class="footer-sep">·</span>
    <a href="{{ site.social.instagram }}">instagram</a>
    <span class="footer-sep">·</span>
    <a href="{{ site.social.github }}">github</a>
    <span class="footer-sep">·</span>
    <a href="{{ site.social.linkedin }}">linkedin</a>
  </div>
  <p class="footer-copy">© {{ "" | date("Y") }} Dylan Reed</p>
</footer>
```

- [ ] **Step 4: Create base layout**

Create `src/_includes/layouts/base.njk`:

```html
{# ABOUTME: Base HTML layout for dylanreed.com author site. #}
{# ABOUTME: Loads Google Fonts, notebook theme CSS, nav, and footer. #}

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{% if title %}{{ title }} — {{ site.title }}{% else %}{{ site.title }}{% endif %}</title>
  <meta name="description" content="{{ description or site.description }}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
  {% include "partials/nav.njk" %}

  <main class="page-content">
    {{ content | safe }}
  </main>

  {% include "partials/footer.njk" %}

  <script>
    // ABOUTME: Hamburger nav toggle for mobile.
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !expanded);
        links.classList.toggle('nav-open');
      });
    }
  </script>
</body>
</html>
```

- [ ] **Step 5: Create page layout**

Create `src/_includes/layouts/page.njk`:

```html
{# ABOUTME: Standard page layout for dylanreed.com. #}
{# ABOUTME: Extends base layout, wraps content in notebook-styled container. #}

---
layout: layouts/base.njk
---

<div class="notebook-page">
  {{ content | safe }}
</div>
```

- [ ] **Step 6: Create notebook theme CSS**

Create `src/assets/css/style.css`:

```css
/* ABOUTME: Writer's Notebook theme for dylanreed.com author site. */
/* ABOUTME: Ruled paper background, margin notes, taped-in photo, genre tags. */

/* ========== Reset & Base ========== */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-bg: #f4efe4;
  --color-text: #2c2420;
  --color-text-light: #8b7355;
  --color-rule: rgba(204, 107, 107, 0.25);
  --color-accent: #cc6b6b;
  --color-link: #6b5040;
  --color-link-hover: #2c2420;
  --color-tape: rgba(255, 255, 240, 0.7);
  --font-serif: 'Lora', Georgia, serif;
  --font-mono: 'IBM Plex Mono', 'Courier New', monospace;
  --line-height: 1.8rem;
  --margin-left: 80px;
  --content-max: 680px;
}

html {
  font-size: 16px;
  line-height: 1.8;
}

body {
  font-family: var(--font-serif);
  color: var(--color-text);
  background-color: var(--color-bg);
  background-image:
    linear-gradient(var(--color-rule) 1px, transparent 1px);
  background-size: 100% var(--line-height);
  background-position: 0 0;
  min-height: 100vh;
}

/* ========== Margin Rule ========== */

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: var(--margin-left);
  width: 2px;
  height: 100vh;
  background: var(--color-rule);
  z-index: 0;
  pointer-events: none;
}

/* ========== Typography ========== */

h1, h2, h3 {
  font-family: var(--font-serif);
  font-weight: 600;
  line-height: 1.3;
}

h1 { font-size: 2rem; margin-bottom: 0.5rem; }
h2 { font-size: 1.5rem; margin-bottom: 0.5rem; }
h3 { font-size: 1.2rem; margin-bottom: 0.4rem; }

p {
  margin-bottom: var(--line-height);
}

a {
  color: var(--color-link);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  transition: color 0.2s;
}

a:hover {
  color: var(--color-link-hover);
}

/* ========== Navigation ========== */

.site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 2rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  border-bottom: 1px solid var(--color-rule);
  position: relative;
  z-index: 10;
}

.nav-home {
  font-weight: 500;
  text-decoration: none;
  color: var(--color-text);
  letter-spacing: 0.5px;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: var(--color-text);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  color: var(--color-text-light);
  letter-spacing: 0.5px;
}

.nav-links a:hover,
.nav-links a[aria-current="page"] {
  color: var(--color-text);
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* ========== Page Content ========== */

.page-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
  position: relative;
  z-index: 1;
}

.notebook-page {
  max-width: var(--content-max);
  margin: 0 auto;
}

/* ========== Margin Notes ========== */

.margin-note {
  font-family: var(--font-mono);
  font-style: italic;
  font-size: 0.75rem;
  color: var(--color-text-light);
  position: absolute;
  left: -180px;
  width: 150px;
  text-align: right;
}

/* ========== Taped Photo ========== */

.taped-photo {
  position: relative;
  display: inline-block;
  transform: rotate(-1.5deg);
  box-shadow: 2px 3px 8px rgba(0, 0, 0, 0.15);
}

.taped-photo img {
  display: block;
  width: 100%;
  height: auto;
}

.taped-photo::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(1deg);
  width: 80px;
  height: 24px;
  background: var(--color-tape);
  border: 1px solid rgba(200, 200, 180, 0.4);
  z-index: 2;
}

/* ========== Hero Section ========== */

.hero {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  margin-bottom: 4rem;
  position: relative;
}

.hero-photo {
  flex-shrink: 0;
  width: 240px;
}

.hero-text {
  flex: 1;
}

.hero-text h1 {
  font-size: 2.2rem;
  margin-bottom: 0.8rem;
}

.hero-intro {
  font-size: 1.1rem;
  color: var(--color-text);
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.hero-cta {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  padding: 0.6rem 1.4rem;
  border: 1px solid var(--color-text);
  color: var(--color-text);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.hero-cta:hover {
  background: var(--color-text);
  color: var(--color-bg);
}

.hero-cta-secondary {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  margin-left: 1rem;
  color: var(--color-text-light);
}

/* ========== Section Headers ========== */

.section-header {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  position: relative;
}

.section-header .margin-note {
  top: 0.2rem;
}

/* ========== Book Cards ========== */

.book-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.book-card {
  border: 1px solid rgba(139, 115, 85, 0.2);
  padding: 1.5rem;
  background: rgba(255, 255, 250, 0.4);
  transition: box-shadow 0.2s;
}

.book-card:hover {
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.08);
}

.book-card a {
  text-decoration: none;
  color: inherit;
  display: block;
}

.book-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
}

.genre-tag {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.5px;
  padding: 0.15rem 0.5rem;
  margin-bottom: 0.6rem;
  color: white;
  text-transform: uppercase;
}

.book-card .hook {
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.6;
}

.book-card .status {
  font-family: var(--font-mono);
  font-style: italic;
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-top: 0.6rem;
}

/* ========== Universe Sections ========== */

.universe-section {
  margin-bottom: 3rem;
  padding-left: 1rem;
  border-left: 2px solid rgba(139, 115, 85, 0.15);
}

.universe-section h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.universe-description {
  font-size: 0.95rem;
  color: var(--color-text-light);
  margin-bottom: 1rem;
}

.universe-works {
  list-style: none;
}

.universe-works li {
  font-size: 0.95rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
}

.universe-works li:last-child {
  border-bottom: none;
}

/* ========== Blog Feed ========== */

.blog-feed {
  margin-bottom: 3rem;
}

.blog-post-item {
  padding: 1rem 0;
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
}

.blog-post-item:last-child {
  border-bottom: none;
}

.blog-post-item h3 {
  font-size: 1rem;
  margin-bottom: 0.2rem;
}

.blog-post-item h3 a {
  color: var(--color-text);
}

.blog-post-date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.blog-post-excerpt {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-top: 0.3rem;
}

/* ========== Newsletter ========== */

.newsletter-section {
  padding: 2rem;
  border: 1px solid rgba(139, 115, 85, 0.2);
  background: rgba(255, 255, 250, 0.4);
  margin-bottom: 3rem;
}

.newsletter-section h2 {
  font-size: 1.2rem;
  margin-bottom: 0.4rem;
}

.newsletter-section p {
  font-size: 0.95rem;
  color: var(--color-text-light);
  margin-bottom: 1rem;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-form input[type="email"] {
  flex: 1;
  padding: 0.6rem 0.8rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  border: 1px solid rgba(139, 115, 85, 0.3);
  background: var(--color-bg);
  color: var(--color-text);
}

.newsletter-form input[type="email"]::placeholder {
  color: var(--color-text-light);
}

.newsletter-form button {
  padding: 0.6rem 1.2rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  border: 1px solid var(--color-text);
  background: var(--color-text);
  color: var(--color-bg);
  cursor: pointer;
  transition: opacity 0.2s;
}

.newsletter-form button:hover {
  opacity: 0.85;
}

/* ========== Contact ========== */

.contact-block {
  margin-bottom: 2rem;
}

.contact-block h2 {
  font-size: 1.2rem;
  margin-bottom: 0.4rem;
}

.contact-email {
  font-family: var(--font-mono);
  font-size: 0.95rem;
}

/* ========== Bio Blocks ========== */

.bio-formal {
  margin-top: 3rem;
  padding: 1.5rem;
  border: 1px dashed rgba(139, 115, 85, 0.3);
  background: rgba(255, 255, 250, 0.3);
  position: relative;
}

.bio-formal-label {
  font-family: var(--font-mono);
  font-style: italic;
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-bottom: 0.8rem;
}

.bio-formal p {
  font-size: 0.95rem;
}

/* ========== 404 ========== */

.page-404 {
  text-align: center;
  padding: 4rem 2rem;
}

/* ========== Footer ========== */

.site-footer {
  padding: 2rem;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-text-light);
  border-top: 1px solid var(--color-rule);
}

.footer-links {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: var(--color-text-light);
  text-decoration: none;
}

.footer-links a:hover {
  color: var(--color-text);
  text-decoration: underline;
}

.footer-sep {
  margin: 0 0.5rem;
}

.footer-copy {
  font-size: 0.75rem;
}

/* ========== Empty State ========== */

.empty-state {
  font-family: var(--font-mono);
  font-style: italic;
  font-size: 0.85rem;
  color: var(--color-text-light);
  padding: 1.5rem 0;
}

/* ========== Responsive ========== */

@media (max-width: 768px) {
  :root {
    --margin-left: 0px;
  }

  body::before {
    display: none;
  }

  .nav-toggle {
    display: block;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-bg);
    flex-direction: column;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--color-rule);
    gap: 0.8rem;
  }

  .nav-links.nav-open {
    display: flex;
  }

  .hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }

  .hero-photo {
    width: 180px;
  }

  .taped-photo {
    transform: rotate(-0.5deg);
  }

  .margin-note {
    position: static;
    width: auto;
    text-align: left;
    display: block;
    margin-bottom: 0.5rem;
  }

  .page-content {
    padding: 2rem 1.2rem;
  }

  .book-cards {
    grid-template-columns: 1fr;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .hero-cta-secondary {
    display: block;
    margin-left: 0;
    margin-top: 0.5rem;
  }
}

@media (max-width: 400px) {
  html {
    font-size: 15px;
  }

  .hero-text h1 {
    font-size: 1.8rem;
  }
}
```

- [ ] **Step 7: Run dev server and verify base renders**

Run: `npm run dev`
Expected: Server starts, navigating to localhost shows empty page with notebook background (ruled lines, cream color) and navigation bar.

- [ ] **Step 8: Commit**

```bash
git add src/_includes/ src/assets/ docs/dylan.jpeg
git commit -m "feat: add base layout, nav, footer, and notebook theme CSS"
```

---

## Task 3: Home Page

**Files:**
- Create: `src/index.njk`
- Create: `src/_includes/partials/newsletter.njk`
- Create: `src/_includes/partials/book-card.njk`

- [ ] **Step 1: Create newsletter partial**

Create `src/_includes/partials/newsletter.njk`:

```html
{# ABOUTME: Buttondown newsletter signup form. #}
{# ABOUTME: Embedded on Home, About, and Contact pages. #}

<div class="newsletter-section">
  <h2>Stay in the loop</h2>
  <p>Fiction updates, new stories, the occasional dispatch from whatever I'm working on.</p>
  <form
    action="https://buttondown.com/api/emails/embed-subscribe/dylanreed"
    method="post"
    class="newsletter-form"
    target="_popupwindow"
  >
    <input type="email" name="email" placeholder="your@email.com" required aria-label="Email address">
    <button type="submit">Subscribe</button>
  </form>
</div>
```

- [ ] **Step 2: Create book-card partial**

Create `src/_includes/partials/book-card.njk`:

```html
{# ABOUTME: Reusable book card component for featured works. #}
{# ABOUTME: Displays title, genre tag, hook, and status. #}

<div class="book-card">
  <a href="/books/{{ book.slug }}/">
    <span class="genre-tag" style="background-color: {{ book.genre | genreColor }}">{{ book.genre }}</span>
    <h3>{{ book.title }}</h3>
    <p class="hook">{{ book.hook }}</p>
    <p class="status">{{ book.status | statusLabel }}</p>
  </a>
</div>
```

- [ ] **Step 3: Create home page**

Create `src/index.njk`:

```html
---
layout: layouts/base.njk
title: ""
---

{# ABOUTME: Home page — hero with taped-in photo, featured works, blog feed, newsletter. #}
{# ABOUTME: First impression for readers and industry professionals. #}

<section class="hero">
  <div class="hero-photo">
    <div class="taped-photo">
      <img src="/assets/images/dylan.jpeg" alt="Dylan Reed — fiction writer" width="240" height="240">
    </div>
  </div>
  <div class="hero-text">
    <h1>Dylan Reed</h1>
    <p class="hero-intro">I write speculative fiction about systems that fail the people inside them — dragon licensing boards, dying deep-sea stations, cozy towns where slime runs the bakery.</p>
    <div>
      <a href="/books/" class="hero-cta">See the books</a>
      <a href="/about/" class="hero-cta-secondary">or read about me →</a>
    </div>
    <span class="margin-note" style="position: absolute; top: 0; right: -180px;">fiction writer, previously: clown</span>
  </div>
</section>

<section>
  <h2 class="section-header">Featured Works</h2>
  <div class="book-cards">
    {%- for book in books -%}
      {%- if book.featured -%}
        {% include "partials/book-card.njk" %}
      {%- endif -%}
    {%- endfor -%}
  </div>
</section>

{% include "partials/newsletter.njk" %}
```

- [ ] **Step 4: Create initial books.json with 3 featured works**

Create `src/_data/books.json`:

```json
[
  {
    "title": "Universal Basic Princess",
    "slug": "universal-basic-princess",
    "type": "novel",
    "genre": "Romance",
    "universe": null,
    "status": "available-soon",
    "featured": true,
    "hook": "A crown princess fakes a relationship with an economist after a photo leak. Then it stops being fake.",
    "blurb": "When a tabloid photo catches Crown Princess Maren holding hands with an economist at a state dinner, her press team does what press teams do — they run with it. The fake relationship is supposed to last six weeks. Long enough to bury the real story. But Dr. Elin Vargas doesn't read the brief, and Maren has never been good at staying in character.",
    "wordCount": 69000,
    "coverImage": null,
    "purchaseLink": null
  },
  {
    "title": "Pressure Rating",
    "slug": "pressure-rating",
    "type": "novella",
    "genre": "Sci-Fi",
    "universe": null,
    "status": "submitted",
    "featured": true,
    "hook": "The sole maintenance technician on a dying deep-sea station keeps it alive so the person she loves can stay at the only depth that slows their disease.",
    "blurb": "Wren is the last engineer on Bathyal Station, a research outpost three thousand meters under the Pacific. The station is failing — Loss of buoyancy. Corroding seals. Systems designed for twelve people maintained by one. She stays because Nico stays, and Nico stays because at this depth, the ambient pressure slows the nerve disease that is slowly taking their body apart. This is a story about what it costs to keep something alive, and what it means when the something is a person.",
    "wordCount": 27500,
    "coverImage": null,
    "purchaseLink": null
  },
  {
    "title": "Understudy",
    "slug": "understudy",
    "type": "novella",
    "genre": "Romance",
    "universe": null,
    "status": "available-soon",
    "featured": true,
    "hook": "A corps ballet dancer and a food truck operator, both stuck in inherited roles, learn to lead their own lives.",
    "blurb": "Margot dances in the corps — not because she chose it, but because her mother's name still opens doors at the company. Across the street, Jules runs a food truck she inherited when her father died, serving the same menu he served, in the same spot, to the same lunch crowd. They meet over a sprained ankle and a bowl of soup. Neither of them is living the life they'd have picked. This is a story about understudies — people standing in someone else's place — and what happens when they step out of the wings.",
    "wordCount": 35000,
    "coverImage": null,
    "purchaseLink": null
  }
]
```

- [ ] **Step 5: Run dev server and verify home page**

Run: `npm run dev`
Expected: Home page renders with taped-in photo, intro text, three featured book cards with genre tags, and newsletter signup form. Notebook ruled lines visible in background.

- [ ] **Step 6: Commit**

```bash
git add src/index.njk src/_includes/partials/newsletter.njk src/_includes/partials/book-card.njk src/_data/books.json
git commit -m "feat: add home page with hero, featured books, and newsletter signup"
```

---

## Task 4: About Page

**Files:**
- Create: `src/about.njk`

- [ ] **Step 1: Create about page**

Create `src/about.njk`:

```html
---
layout: layouts/page.njk
title: About
permalink: /about/
---

{# ABOUTME: Author bio page — first-person conversational bio plus copy-pasteable formal version. #}
{# ABOUTME: Dual-audience: readers get personality, agents get a clean bio block. #}

<section class="hero" style="margin-bottom: 3rem;">
  <div class="hero-photo">
    <div class="taped-photo">
      <img src="/assets/images/dylan.jpeg" alt="Dylan Reed" width="240" height="240">
    </div>
  </div>
  <div class="hero-text">
    <h1>About Dylan</h1>
    <span class="margin-note" style="position: absolute; top: 0; right: -180px;">author photo</span>
  </div>
</section>

<p>I write speculative fiction — the kind where dragons need permits, deep-sea stations are held together with duct tape and devotion, and a sentient slime mold runs the best bakery in town. My stories tend to circle the same questions: what happens when systems fail the people inside them, and what do those people build instead?</p>

<p>Before I was a writer, I was a clown. Literally — I started performing at sixteen, learned to juggle, twist balloons, walk on stilts, and fall down on purpose. I auditioned for Ringling Brothers. The clown thing matters because it taught me something I still use: the Auguste clown never stops trying. They fail absurdly, publicly, repeatedly — and they get back up. That's more or less my approach to writing fiction.</p>

<p>I live in Northern Colorado with my wife Sarah and our cats Ramona and Jeff. I have ADHD, which means I also sew, paint miniatures, play ukulele, build puppets, and maintain a rotating cast of hobbies that would alarm a less patient spouse. I wrote my first novel in a notebook during commercial diving school in California. I'm still revising it.</p>

<p>I'm currently submitting short fiction and novellas to markets. Two novels that were previously on Amazon are being re-edited and will return when they're ready. I write across genres — cozy fantasy, sci-fi, romance, noir, space westerns — but the through-line is always character-driven stories about people navigating imperfect systems with stubbornness and heart.</p>

<p>If you want to keep up with what I'm working on, the <a href="/blog/">blog feed</a> pulls from <a href="https://dylan.blog">dylan.blog</a>, where I write about everything from book recommendations to ADHD to healthcare to why Hallmark movies are genuinely great. It's chaotic over there. You've been warned.</p>

<div class="bio-formal">
  <p class="bio-formal-label">the professional version — for query letters, copy freely</p>
  <p>Dylan Reed writes speculative fiction from Northern Colorado. His work spans cozy fantasy, science fiction, and romance, exploring what happens when institutional systems fail the people inside them. A former professional clown and commercial diving school graduate, he brings an unusual perspective to stories about resilience, found family, and quiet love in extreme circumstances. He lives with his wife and two cats, and maintains more hobbies than any one person should. He is currently seeking representation.</p>
</div>

{% include "partials/newsletter.njk" %}
```

- [ ] **Step 2: Run dev server and verify about page**

Run: `npm run dev`
Navigate to `/about/`
Expected: Taped-in photo, conversational bio, dashed-border formal bio block with margin note, newsletter signup.

- [ ] **Step 3: Commit**

```bash
git add src/about.njk
git commit -m "feat: add about page with conversational and formal bio"
```

---

## Task 5: Books Page & Individual Book Pages

**Files:**
- Create: `src/books/index.njk`
- Create: `src/_includes/layouts/book.njk`
- Modify: `.eleventy.js` (add pagination for individual book pages)

- [ ] **Step 1: Create book layout**

Create `src/_includes/layouts/book.njk`:

```html
{# ABOUTME: Individual book page layout. #}
{# ABOUTME: Displays full blurb, genre, status, universe link, purchase link. #}

---
layout: layouts/base.njk
---

<div class="notebook-page">
  <span class="genre-tag" style="background-color: {{ genre | genreColor }}">{{ genre }}</span>
  <h1>{{ title }}</h1>
  <p class="status" style="margin-bottom: 1.5rem;">{{ status | statusLabel }}{% if wordCount %} · {{ (wordCount / 1000) | round }}k words{% endif %}</p>

  <div class="book-blurb">
    {{ blurb | safe }}
  </div>

  {% if universe %}
    <p style="margin-top: 2rem;">
      <a href="/books/#{{ universe }}">← Back to {{ universe | replace("-", " ") | title }} universe</a>
    </p>
  {% endif %}

  {% if purchaseLink %}
    <p style="margin-top: 1.5rem;">
      <a href="{{ purchaseLink }}" class="hero-cta">Get the book</a>
    </p>
  {% endif %}

  <p style="margin-top: 2rem;">
    <a href="/books/">← All books</a>
  </p>
</div>
```

- [ ] **Step 2: Update .eleventy.js to generate individual book pages**

Add to `.eleventy.js`, inside the `module.exports` function, before the `return` statement:

```js
  // Generate individual book pages from books.json
  const books = require("./src/_data/books.json");
  books.forEach(book => {
    eleventyConfig.addTemplate(`books/${book.slug}.njk`, `---
layout: layouts/book.njk
title: "${book.title}"
genre: "${book.genre}"
status: "${book.status}"
wordCount: ${book.wordCount || 0}
universe: ${book.universe ? '"' + book.universe + '"' : "null"}
purchaseLink: ${book.purchaseLink ? '"' + book.purchaseLink + '"' : "null"}
permalink: /books/${book.slug}/
---

${book.blurb}`);
  });
```

- [ ] **Step 3: Create books landing page**

Create `src/books/index.njk`:

```html
---
layout: layouts/page.njk
title: Books
permalink: /books/
---

{# ABOUTME: Books landing page — featured works, universe sections, short stories. #}
{# ABOUTME: Two-tier layout: featured cards up top, universe groupings below. #}

<h1>Books</h1>

<h2 class="section-header" style="margin-top: 2rem;">Featured Works</h2>
<div class="book-cards">
  {%- for book in books -%}
    {%- if book.featured -%}
      {% include "partials/book-card.njk" %}
    {%- endif -%}
  {%- endfor -%}
</div>

<h2 class="section-header">Universes</h2>

{% set universes = [
  { "id": "slow-light", "name": "Slow Light", "description": "Six generation ships named for cattail in indigenous languages, carrying the last of humanity on a 150-year journey. Four books spanning the voyage — from the engineers who designed the lie to the descendants who inherit it." },
  { "id": "thistlehollow", "name": "Thistlehollow", "description": "A crossroads craft town where potions are pharmacy, magic is infrastructure, and a sentient slime mold runs the best bakery in the valley. Cozy fantasy stories about community, commerce, and the small negotiations of living alongside people who aren't like you." },
  { "id": "compliance-territory", "name": "Compliance Territory", "description": "Dragons are licensed by the Dragon Council. Damsels are assigned by committee. Lairs are zoned. The paperwork is staggering. Standalone stories exploring what happens when bureaucracy meets mythology — and the people who fall through the cracks." },
  { "id": "frankensteins-daughter", "name": "Frankenstein's Daughter", "description": "A steampunk YA duology. Calliope, a fifteen-year-old clockwork inventor, ages out of a grim orphanage and attends a hero academy powered by reanimation science. Found family, queer romance, and the ethics of building people." }
] %}

{%- for universe in universes -%}
  <div class="universe-section" id="{{ universe.id }}">
    <h3>{{ universe.name }}</h3>
    <p class="universe-description">{{ universe.description }}</p>
    <ul class="universe-works">
      {%- for book in books -%}
        {%- if book.universe == universe.id -%}
          <li><a href="/books/{{ book.slug }}/">{{ book.title }}</a> — <span class="status">{{ book.status | statusLabel }}</span></li>
        {%- endif -%}
      {%- endfor -%}
    </ul>
  </div>
{%- endfor -%}

<div class="universe-section">
  <h3>Standalones</h3>
  <ul class="universe-works">
    {%- for book in books -%}
      {%- if not book.universe and book.type != "short" -%}
        <li><a href="/books/{{ book.slug }}/">{{ book.title }}</a> — <span class="status">{{ book.status | statusLabel }}</span></li>
      {%- endif -%}
    {%- endfor -%}
  </ul>
</div>

<h2 class="section-header" style="margin-top: 3rem;">Short Stories</h2>

{%- set shorts = [] -%}
{%- for book in books -%}
  {%- if book.type == "short" -%}
    {%- set shorts = (shorts.push(book), shorts) -%}
  {%- endif -%}
{%- endfor -%}

{%- if shorts.length > 0 -%}
  <ul class="universe-works">
    {%- for book in shorts -%}
      <li><a href="/books/{{ book.slug }}/">{{ book.title }}</a> — <span class="status">{{ book.status | statusLabel }}</span></li>
    {%- endfor -%}
  </ul>
{%- else -%}
  <p class="empty-state">coming soon — stories out on submission</p>
{%- endif -%}
```

- [ ] **Step 4: Run dev server and verify books page**

Run: `npm run dev`
Navigate to `/books/`
Expected: Featured book cards at top, four universe sections with descriptions, standalones section, empty short stories section with italic message. Click a book card → individual book page with full blurb.

- [ ] **Step 5: Commit**

```bash
git add src/books/ src/_includes/layouts/book.njk .eleventy.js
git commit -m "feat: add books page with universes, individual book pages"
```

---

## Task 6: Blog Feed Page

**Files:**
- Create: `src/blog.njk`
- Create: `src/_includes/partials/blog-feed.njk`
- Create: `src/_data/blogPosts.js` (11ty data file that fetches RSS)

- [ ] **Step 1: Create blog posts data file**

Create `src/_data/blogPosts.js`:

```js
// ABOUTME: Fetches blog posts from dylan.blog RSS feed at build time.
// ABOUTME: Uses eleventy-fetch for caching. Returns parsed post array.

const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function() {
  const feedUrl = "https://dylan.blog/index.xml";

  try {
    const feed = await EleventyFetch(feedUrl, {
      duration: "1d",
      type: "text"
    });

    // Parse RSS XML manually (no extra dependency needed)
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(feed)) !== null) {
      const itemXml = match[1];
      const getTag = (tag) => {
        const tagMatch = itemXml.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`));
        return tagMatch ? tagMatch[1].trim() : "";
      };

      const title = getTag("title");
      const link = getTag("link");
      const pubDate = getTag("pubDate");
      const description = getTag("description");

      // Truncate description to ~150 chars
      const excerpt = description
        .replace(/<[^>]*>/g, "")
        .substring(0, 150)
        .trim();

      items.push({
        title,
        link,
        date: pubDate ? new Date(pubDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }) : "",
        rawDate: pubDate,
        excerpt: excerpt + (description.length > 150 ? "…" : "")
      });
    }

    return items.slice(0, 10);
  } catch (error) {
    console.warn("Failed to fetch blog feed:", error.message);
    return [];
  }
};
```

- [ ] **Step 2: Create blog feed partial**

Create `src/_includes/partials/blog-feed.njk`:

```html
{# ABOUTME: Displays a list of blog posts from dylan.blog RSS feed. #}
{# ABOUTME: Used on both the home page (limited) and the full blog page. #}

<div class="blog-feed">
  {%- set postList = posts if posts else blogPosts -%}
  {%- set limit = feedLimit if feedLimit else 10 -%}
  {%- for post in postList -%}
    {%- if loop.index0 < limit -%}
      <div class="blog-post-item">
        <h3><a href="{{ post.link }}">{{ post.title }}</a></h3>
        <span class="blog-post-date">{{ post.date }}</span>
        {%- if post.excerpt -%}
          <p class="blog-post-excerpt">{{ post.excerpt }}</p>
        {%- endif -%}
      </div>
    {%- endif -%}
  {%- endfor -%}

  {%- if postList.length == 0 -%}
    <p class="empty-state">Couldn't fetch the feed — <a href="https://dylan.blog">visit dylan.blog directly</a>.</p>
  {%- endif -%}
</div>
```

- [ ] **Step 3: Create blog page**

Create `src/blog.njk`:

```html
---
layout: layouts/page.njk
title: Blog
permalink: /blog/
---

{# ABOUTME: Blog feed page — pulls latest posts from dylan.blog RSS. #}
{# ABOUTME: Links back to dylan.blog for full posts. #}

<h1 class="section-header">
  From the Blog
  <span class="margin-note">the unfiltered version lives at <a href="https://dylan.blog">dylan.blog</a></span>
</h1>

{% include "partials/blog-feed.njk" %}

<p style="margin-top: 2rem;">
  <a href="https://dylan.blog" class="hero-cta">Read more at dylan.blog →</a>
</p>
```

- [ ] **Step 4: Update home page to include blog feed (limited to 5)**

In `src/index.njk`, add the blog feed section between the Featured Works section and the newsletter section. Add this block:

```html
<section>
  <h2 class="section-header">From the Blog</h2>
  {% set feedLimit = 5 %}
  {% include "partials/blog-feed.njk" %}
  <p><a href="/blog/">See all posts →</a></p>
</section>
```

- [ ] **Step 5: Run dev server and verify blog feed**

Run: `npm run dev`
Navigate to `/blog/`
Expected: Page shows latest posts from dylan.blog with titles, dates, and excerpts. Home page shows 5 most recent.

- [ ] **Step 6: Commit**

```bash
git add src/blog.njk src/_data/blogPosts.js src/_includes/partials/blog-feed.njk src/index.njk
git commit -m "feat: add blog feed page with dylan.blog RSS integration"
```

---

## Task 7: Contact Page & 404

**Files:**
- Create: `src/contact.njk`
- Create: `src/404.njk`

- [ ] **Step 1: Create contact page**

Create `src/contact.njk`:

```html
---
layout: layouts/page.njk
title: Contact
permalink: /contact/
---

{# ABOUTME: Contact page — email links for readers and industry, newsletter signup, social links. #}
{# ABOUTME: No contact form; email links keep it simple with no backend needed. #}

<h1>Get in Touch</h1>

<div class="contact-block">
  <h2>Want to say hi?</h2>
  <p>I like hearing from readers. Whether it's about a story, a question, or just to tell me your cat's name — I'm here.</p>
  <p><a href="mailto:{{ site.email }}" class="contact-email">{{ site.email }}</a></p>
</div>

<div class="contact-block" style="position: relative;">
  <h2>For industry inquiries</h2>
  <span class="margin-note">queries, submissions, rights</span>
  <p>If you're an agent, editor, or publisher — same email works. Put something useful in the subject line and I'll prioritize it.</p>
  <p><a href="mailto:{{ site.email }}" class="contact-email">{{ site.email }}</a></p>
</div>

{% include "partials/newsletter.njk" %}

<div class="contact-block" style="margin-top: 2rem;">
  <h2>Elsewhere</h2>
  <ul style="list-style: none; font-family: var(--font-mono); font-size: 0.9rem;">
    <li><a href="{{ site.social.blog }}">dylan.blog</a> — the unfiltered version</li>
    <li><a href="{{ site.social.instagram }}">instagram</a></li>
    <li><a href="{{ site.social.github }}">github</a></li>
    <li><a href="{{ site.social.linkedin }}">linkedin</a></li>
  </ul>
</div>
```

- [ ] **Step 2: Create 404 page**

Create `src/404.njk`:

```html
---
layout: layouts/page.njk
title: Page Not Found
permalink: /404.html
---

{# ABOUTME: Custom 404 page for GitHub Pages. #}
{# ABOUTME: File must be named 404.html for GitHub Pages to serve it. #}

<div class="page-404">
  <h1>Page not found</h1>
  <p>This page doesn't exist. It might have been moved, or it might never have existed in the first place — like most of my early drafts.</p>
  <p style="margin-top: 1.5rem;"><a href="/">← Back to the notebook</a></p>
</div>
```

- [ ] **Step 3: Run dev server and verify both pages**

Run: `npm run dev`
Navigate to `/contact/` — expected: two contact blocks, newsletter signup, social links.
Navigate to `/404.html` — expected: friendly 404 message.

- [ ] **Step 4: Commit**

```bash
git add src/contact.njk src/404.njk
git commit -m "feat: add contact page and 404"
```

---

## Task 8: GitHub Actions Deployment

**Files:**
- Create: `.github/workflows/gh-pages.yml`

- [ ] **Step 1: Create GitHub Actions workflow**

Create `.github/workflows/gh-pages.yml`:

```yaml
# ABOUTME: Deploys dylanreed.com to GitHub Pages via 11ty build.
# ABOUTME: Triggers on push to main and daily cron for blog feed freshness.

name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'  # Daily at 6am UTC
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - run: npm ci

      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/gh-pages.yml
git commit -m "ci: add GitHub Actions workflow for GitHub Pages deploy with daily cron"
```

---

## Task 9: Update CLAUDE.md & Clean Up Old Hugo Files

**Files:**
- Modify: `CLAUDE.md`
- Remove: old Hugo files (config.toml, config/, layouts/, static/, content/, archetypes/)

- [ ] **Step 1: Update CLAUDE.md**

Replace the contents of `CLAUDE.md` with:

```markdown
# Dylanreed.com

Dylan Reed's author website — professional front door for fiction writing.

## Stack

Eleventy 3.x (static site), Nunjucks templates, vanilla CSS, GitHub Pages

## Running Locally

- `npm run dev` — development server with hot reload
- `npm run build` — production build to `_site/`

## Key Files

- `src/_data/books.json` — book catalog, drives the Books page and individual book pages
- `src/_data/site.json` — global metadata (title, URLs, social links)
- `src/_data/blogPosts.js` — fetches dylan.blog RSS feed at build time
- `src/assets/css/style.css` — Writer's Notebook theme

## Adding a Book

Add an entry to `src/_data/books.json`. The build auto-generates an individual page at `/books/<slug>/`. Set `featured: true` to show it on the home page.

## Newsletter

Buttondown. Signup form embedded on Home, About, and Contact pages. Update the Buttondown username in `src/_includes/partials/newsletter.njk` if it changes.

## Blog Feed

Pulls from `https://dylan.blog/index.xml` via eleventy-fetch. Cached for 1 day. GitHub Actions rebuilds daily to keep it fresh.

## Deployment

GitHub Pages via GitHub Actions. Pushes to `main` trigger a build. Daily cron rebuild at 6am UTC for blog feed freshness.

## Conventions

- All code files start with a 2-line ABOUTME comment
- Never use `--no-verify` on commits
- TDD: write tests before implementation
```

- [ ] **Step 2: Remove old Hugo files**

```bash
rm -f config.toml
rm -rf config/ layouts/ static/ content/ archetypes/ themes/ resources/
```

- [ ] **Step 3: Remove the old GitHub Actions workflow if it exists**

```bash
rm -f .github/workflows/hugo.yml
```

- [ ] **Step 4: Verify the site still builds**

Run: `npm run build`
Expected: Build succeeds, `_site/` directory contains the generated site.

- [ ] **Step 5: Verify dev server works**

Run: `npm run dev`
Expected: Site serves locally with all pages working.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: update CLAUDE.md for 11ty stack, remove old Hugo files"
```

---

## Task 10: Visual Polish & Final Review

**Files:**
- Modify: `src/assets/css/style.css` (any tweaks from visual review)
- Modify: any templates as needed

- [ ] **Step 1: Run dev server and review all pages**

Run: `npm run dev`

Check each page visually:
- `/` — hero photo taped-in correctly, book cards render, blog feed shows, newsletter form present
- `/about/` — photo, bio, formal block with dashed border, newsletter
- `/books/` — featured cards, universe sections, empty short stories state
- `/books/universal-basic-princess/` (and other individual book pages) — full blurb, genre tag, back link
- `/blog/` — posts from RSS feed, link to dylan.blog
- `/contact/` — contact blocks, newsletter, social links
- `/404.html` — friendly message

- [ ] **Step 2: Test responsive behavior**

Resize browser to mobile width:
- Nav collapses to hamburger, toggle works
- Hero stacks vertically
- Book cards stack single-column
- Margin notes appear inline
- Newsletter form stacks vertically

- [ ] **Step 3: Fix any visual issues found**

Apply CSS tweaks as needed. This step is for fine-tuning spacing, alignment, and any rendering issues discovered during review.

- [ ] **Step 4: Run a production build and spot-check output**

Run: `npm run build`
Check: `ls _site/` — should contain `index.html`, `about/`, `books/`, `blog/`, `contact/`, `404.html`, `assets/`, `CNAME`

- [ ] **Step 5: Commit any polish changes**

```bash
git add -A
git commit -m "style: visual polish and responsive tweaks"
```

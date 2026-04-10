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

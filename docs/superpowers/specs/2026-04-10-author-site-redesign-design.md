# dylanreed.com — Author Site Redesign

**Date:** 2026-04-10
**Status:** Approved

## Purpose

Transform dylanreed.com from a pixel-art link hub into a professional author website that serves two audiences:

1. **Readers** who want to discover Dylan's fiction and follow his work
2. **Industry** (agents, editors, publishers) who need a professional author presence

Currently unpublished, with two previously-Amazon books returning after edits. The site must work now and grow gracefully as publications land.

## Relationship to dylan.blog

Clean separation. dylanreed.com is the professional front door ("nicer shirt Dylan"). dylan.blog remains the chaos goblin kingdom. The author site pulls a blog feed via RSS but doesn't duplicate content.

## Tech Stack

- **Static site generator:** Eleventy (11ty) — familiar from RaaS project, better RSS/feed support than Hugo
- **Templating:** Nunjucks (.njk)
- **Styling:** Vanilla CSS (no framework)
- **Fonts:** Google Fonts (Lora/Literata for serif, IBM Plex Mono/JetBrains Mono for monospace)
- **Newsletter:** Buttondown (free tier, embedded signup form)
- **Blog feed:** eleventy-fetch pulling from dylan.blog RSS at build time
- **Deployment:** GitHub Pages via GitHub Actions (reuse existing pipeline pattern)
- **Domain:** dylanreed.com (already configured)

## Visual Design: Writer's Notebook

The site looks and feels like peeking into a working writer's notebook.

### Color Palette

- **Background:** Off-white / warm cream (`#f4efe4` range)
- **Text:** Dark brown (`#2c2420`)
- **Margin rule:** Red, subtle (`opacity: 0.2-0.4`)
- **Annotations/asides:** Muted brown (`#8b7355`)
- **Accents/struck-through:** Red-brown (`#cc6b6b`)
- **Genre tag colors:**
  - Cozy Fantasy: `#6b8e6b` (mossy green)
  - Sci-Fi: `#4a7a8b` (steel blue)
  - Romance: `#b5566a` (dusty rose)
  - Steampunk: `#b8860b` (dark goldenrod)
  - Urban Fantasy: `#7b68ae` (muted purple)
  - Noir: `#555555` (charcoal)
  - Space Western: `#c9784c` (terracotta)

### Typography

- **Headlines:** Serif with character — Lora or Literata (Google Fonts)
- **Body text:** Same serif
- **Margin notes / annotations / code-like asides:** Monospace — IBM Plex Mono or JetBrains Mono
- **No handwriting fonts.** Italic mono handles the "handwritten aside" feel without looking fake.

### Notebook Texture Details

- Faint ruled lines as repeating CSS background-image (no image asset needed)
- Left margin red rule line (subtle, low opacity)
- Margin notes positioned absolutely on wider screens, collapse inline on mobile
- Colored sticky-tab genre tags
- Off-white warm cream background, dark brown text

### Taped-In Photo Treatment

- Author headshot (`docs/dylan.jpeg`) styled as a photo taped onto the notebook page
- `transform: rotate(-1.5deg)` slight tilt
- Tape element rendered via CSS pseudo-element across top corner
- Subtle box-shadow for depth
- Rotation flattens on mobile for space

### Responsive Behavior

- Margin notes collapse inline on mobile (become parenthetical asides)
- Book cards stack single-column
- Nav becomes hamburger menu on small screens
- Taped photo stays but rotation reduces
- Mobile-first approach

### JavaScript

Minimal. Only:
- Hamburger nav toggle on mobile
- Buttondown embed script

No JS required for the core experience.

## Site Structure

```
dylanreed.com/
├── src/
│   ├── _data/
│   │   ├── site.json        # Site metadata (title, description, URLs)
│   │   └── books.json       # Book catalog (title, genre, status, blurb, universe, cover path)
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk     # HTML shell, head, nav, footer
│   │   │   ├── page.njk     # Standard page layout
│   │   │   └── book.njk     # Individual book page layout
│   │   └── partials/
│   │       ├── nav.njk      # Navigation bar
│   │       ├── footer.njk   # Footer with social links
│   │       ├── newsletter.njk  # Buttondown signup form
│   │       ├── blog-feed.njk   # Blog post list from RSS
│   │       └── book-card.njk   # Reusable book card component
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css    # Notebook theme styles
│   │   ├── fonts/           # Self-hosted if needed
│   │   └── images/
│   │       └── dylan.jpeg   # Author headshot
│   ├── index.njk            # Home page
│   ├── about.njk            # About / bio page
│   ├── books/
│   │   └── index.njk        # Books landing page (individual pages auto-generated)
│   ├── blog.njk             # Blog feed page
│   └── contact.njk          # Contact + newsletter
├── .github/
│   └── workflows/
│       └── gh-pages.yml     # GitHub Pages deploy + daily cron rebuild
├── .eleventy.js             # 11ty config
├── package.json
└── CNAME                    # dylanreed.com
```

## Pages

### Home Page

Top to bottom:

1. **Nav bar** — `Home · Books · About · Blog · Contact`. Monospace font, faint ruled-line underneath. Subtle, not heavy.

2. **Hero section** — Headshot (taped-in treatment) on one side, intro text on the other. Intro is short, in Dylan's voice — a hook, not a bio:
   > *Dylan Reed writes speculative fiction about systems that fail the people inside them — dragon licensing boards, dying deep-sea stations, cozy towns where slime runs the bakery.*
   
   Below: CTA button to Books, secondary link to About. Notebook-style margin annotation next to the hero (e.g., *"← this one stuck"* or *"fiction writer, previously: clown"*).

3. **Featured Works** — 2-3 book cards with title, genre tag, one-line hook. Links to individual book pages. When catalog is thin, show universe teasers instead.

4. **Blog Feed** — "From the blog" section, latest 3-5 posts from dylan.blog RSS. Title, date, first line. Links to dylan.blog for full posts.

5. **Newsletter signup** — Buttondown embed. Headline, one line of copy, email input, submit.

6. **Footer** — Social links (Instagram, GitHub, LinkedIn, dylan.blog), copyright.

### About Page

1. **Headshot** — taped-in treatment, margin note like *"author photo"*

2. **First-person bio** — Conversational, Medium personality dial. Covers:
   - What Dylan writes and why (speculative fiction, cozy fantasy, the themes)
   - The clown/performer background (unusual, memorable)
   - Northern Colorado, the cats, ADHD-driven hobby cycling
   - Currently submitting work, two books being re-edited for Amazon

3. **Third-person bio block** — Short, copy-pasteable formal bio at the bottom. Labeled with margin note: *"the professional version"* or *"for query letters, copy freely"*

4. **Newsletter signup** — Buttondown embed (repeated)

### Books Page

Two-tier layout:

1. **Featured Works** (top) — cards for strongest pieces:
   - Title
   - Genre tag (color-coded pill)
   - One-line hook/logline
   - Status as margin note (*"submitted"*, *"available soon"*, *"in revision"*)
   - Click through to individual book page

2. **Universes** (below) — sections for each shared world:
   - **Slow Light** — generation ship sci-fi, 4 planned books
   - **Thistlehollow** — cozy fantasy crossroads town
   - **Compliance Territory** — dragon bureaucracy
   - **Frankenstein's Daughter** — steampunk YA
   - **Standalones** — Understudy, Portal 5, etc.
   
   Each universe: short paragraph describing the world, then lists works within it.

3. **Short Stories** (subsection) — empty state for now. Margin note: *"coming soon — stories out on submission"*. When published: title, venue, link.

**Individual book pages** (auto-generated from `books.json`):
- Title, genre, status
- Full blurb/synopsis (2-3 paragraphs)
- Excerpt section (optional, for sample chapters later)
- "Part of the [Universe Name] series" link back
- Purchase link when applicable

Notebook aesthetic throughout — genre tags as colored sticky tabs, status notes in margin, universe sections feel like notebook chapters.

### Blog Feed Page

1. **Page header** — "From the Blog" with margin note: *"the unfiltered version lives at dylan.blog"*

2. **Post list** — latest 10 posts from dylan.blog RSS (via eleventy-fetch at build time):
   - Title (linked to dylan.blog)
   - Date
   - Excerpt (~150 characters or RSS description)
   - Category tag if available

3. **"Read more at dylan.blog"** link at bottom

**Rebuild cadence:** GitHub Actions daily cron schedule keeps the feed fresh without manual deploys.

### Contact Page

1. **For readers** — "Want to say hi?" with contact email

2. **For industry** — margin note or separate block: *"for query/submission inquiries"* with professional email (or same email if not splitting)

3. **Newsletter signup** — Buttondown embed (third placement)

4. **Social links** — Instagram, GitHub, LinkedIn, dylan.blog. Monospace text links, no icons.

No contact form. Email links only — simpler for everyone, no backend needed.

## Data Model: books.json

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
    "hook": "A crown princess fakes a relationship with an economist after a photo leak.",
    "blurb": "Full synopsis goes here...",
    "wordCount": 69000,
    "coverImage": null,
    "purchaseLink": null
  }
]
```

Fields:
- `type`: "novel", "novella", "short" — controls which section it appears in
- `genre`: string — maps to a genre tag color
- `universe`: null or "slow-light", "thistlehollow", "compliance-territory", "frankensteins-daughter"
- `status`: "published", "submitted", "available-soon", "in-revision", "in-progress"
- `featured`: boolean — appears in Featured Works section on home and books pages
- `purchaseLink`: null until available on Amazon/etc.

## Newsletter Integration

- **Service:** Buttondown (free tier, up to 100 subscribers)
- **Embed:** HTML form embedded as a partial, included on Home, About, and Contact pages
- **Signup copy:** Casual, Dylan's voice — not marketing-speak
- **No double opt-in configuration needed initially** — Buttondown handles compliance

## Blog Feed Integration

- **Plugin:** @11ty/eleventy-fetch
- **Source:** dylan.blog RSS feed URL
- **Cache duration:** 1 day (matched to cron rebuild)
- **Display:** 10 posts on blog page, 3-5 on home page
- **Fallback:** If feed fetch fails at build time, show a static link to dylan.blog

## Deployment

- **Host:** GitHub Pages (free, already configured for dylanreed.com)
- **CI/CD:** GitHub Actions workflow
  - Triggers: push to main, daily cron (for blog feed freshness)
  - Steps: checkout → install deps → 11ty build → deploy to gh-pages branch
- **Domain:** CNAME file for dylanreed.com (already set up)

## What's NOT in Scope

- Custom CMS or admin panel — edit JSON and Nunjucks files directly
- Contact form backend — email links only
- Analytics — can add later if wanted
- Search functionality
- Comments or reader interaction
- E-commerce / direct book sales
- Dark mode (the notebook is a notebook — it's cream paper)

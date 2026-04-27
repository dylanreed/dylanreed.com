# Coming Soon Sticky Note Cover — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain genre-colored placeholder cover with a genre-colored sticky note taped to the page, with per-book visual variation seeded from the title.

**Architecture:** Add a `titleHash` Eleventy filter that produces deterministic variation values from a book title. Update the two Nunjucks templates (book-card, book detail) to render the sticky note markup with CSS custom properties driven by the hash. Replace the existing placeholder CSS with sticky note styles.

**Tech Stack:** Eleventy 3.x, Nunjucks, vanilla CSS

---

### Task 1: Add `titleHash` filter to Eleventy config

**Files:**
- Modify: `.eleventy.js:31` (after the `genreColor` filter)

- [ ] **Step 1: Add the `titleHash` filter**

This filter takes a title string and returns an object with deterministic variation values. Add it after the `genreColor` filter (line 31) in `.eleventy.js`:

```javascript
eleventyConfig.addFilter("titleHash", (title) => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = ((hash << 5) - hash) + title.charCodeAt(i);
    hash = hash & hash;
  }
  hash = Math.abs(hash);

  const noteRotation = (hash % 60 - 30) / 10;          // -3 to +3 degrees
  const tape1Rotation = ((hash >> 4) % 50 - 25);        // -25 to +25 degrees
  const tape2Rotation = ((hash >> 8) % 50 - 25);        // -25 to +25 degrees
  const tape1Width = 42 + ((hash >> 12) % 13);           // 42-54px
  const tape2Width = 42 + ((hash >> 16) % 13);           // 42-54px
  const tape1Top = -3 - ((hash >> 3) % 4);               // -3 to -6px
  const tape1Side = -5 - ((hash >> 7) % 6);              // -5 to -10px
  const tape2Bottom = -3 - ((hash >> 11) % 4);           // -3 to -6px
  const tape2Side = -5 - ((hash >> 15) % 6);             // -5 to -10px
  const mirrorCorners = (hash % 2 === 0);                // which diagonal gets tape

  return {
    noteRotation,
    tape1Rotation: mirrorCorners ? tape1Rotation : -tape1Rotation,
    tape2Rotation: mirrorCorners ? tape2Rotation : -tape2Rotation,
    tape1Width,
    tape2Width,
    tape1Top,
    tape1Side: mirrorCorners ? `left: ${tape1Side}px` : `right: ${tape1Side}px`,
    tape2Bottom,
    tape2Side: mirrorCorners ? `right: ${tape2Side}px` : `left: ${tape2Side}px`
  };
});
```

- [ ] **Step 2: Verify the build still runs**

Run: `cd /Users/nervous/Dev/dylanreed.com && npm run build`
Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add .eleventy.js
git commit -m "feat: add titleHash filter for sticky note cover variation"
```

---

### Task 2: Replace placeholder CSS with sticky note styles

**Files:**
- Modify: `src/assets/css/style.css:312-361` (replace the entire "Placeholder Covers" section)

- [ ] **Step 1: Replace the placeholder CSS block**

Replace lines 312-361 (the entire `/* ========== Placeholder Covers ========== */` section) with:

```css
/* ========== Sticky Note Placeholder Covers ========== */

.cover-placeholder {
  aspect-ratio: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.sticky-note {
  position: relative;
  width: 85%;
  padding: 14px 10px 16px;
  border-radius: 1px;
  box-shadow: 2px 3px 6px rgba(0, 0, 0, 0.2);
  transform: rotate(var(--note-rotation, 0deg));
}

.sticky-tape {
  position: absolute;
  height: 14px;
  background: rgba(255, 255, 240, 0.55);
  border: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 2;
}

.sticky-note__title {
  position: relative;
  z-index: 1;
  font-family: var(--font-serif);
  font-size: 11px;
  font-weight: 700;
  color: white;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.sticky-note__divider {
  width: 24px;
  height: 1px;
  background: rgba(255, 255, 255, 0.35);
  margin: 7px 0;
  position: relative;
  z-index: 1;
}

.sticky-note__status {
  position: relative;
  z-index: 1;
  font-family: var(--font-mono);
  font-size: 7px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Detail page: larger sticky note */
.book-detail-cover.cover-placeholder {
  width: 200px;
}

.book-detail-cover .sticky-note {
  width: 75%;
  padding: 18px 14px 22px;
}

.book-detail-cover .sticky-note__title {
  font-size: 16px;
}

.book-detail-cover .sticky-note__divider {
  margin: 9px 0;
}

.book-detail-cover .sticky-note__status {
  font-size: 9px;
}
```

- [ ] **Step 2: Verify the build still runs**

Run: `cd /Users/nervous/Dev/dylanreed.com && npm run build`
Expected: Clean build, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/assets/css/style.css
git commit -m "feat: replace placeholder cover CSS with sticky note styles"
```

---

### Task 3: Update book-card.njk template

**Files:**
- Modify: `src/_includes/partials/book-card.njk:8-12` (the `{% else %}` block)

- [ ] **Step 1: Replace the else block**

Replace lines 8-12 (the existing placeholder markup):

```nunjucks
      <div class="book-card-cover book-card-placeholder" style="background-color: {{ book.genre | genreColor }}">
        <span class="placeholder-title">{{ book.title }}</span>
        <span class="placeholder-author">Dylan Reed</span>
      </div>
```

With:

```nunjucks
      {% set h = book.title | titleHash %}
      <div class="book-card-cover cover-placeholder">
        <div class="sticky-note" style="background-color: {{ book.genre | genreColor }}; --note-rotation: {{ h.noteRotation }}deg;">
          <div class="sticky-tape" style="top: {{ h.tape1Top }}px; {{ h.tape1Side }}; width: {{ h.tape1Width }}px; transform: rotate({{ h.tape1Rotation }}deg);"></div>
          <div class="sticky-tape" style="bottom: {{ h.tape2Bottom }}px; {{ h.tape2Side }}; width: {{ h.tape2Width }}px; transform: rotate({{ h.tape2Rotation }}deg);"></div>
          <div class="sticky-note__title">{{ book.title }}</div>
          <div class="sticky-note__divider"></div>
          <div class="sticky-note__status">{{ book.status | statusLabel }}</div>
        </div>
      </div>
```

- [ ] **Step 2: Verify build and check output**

Run: `cd /Users/nervous/Dev/dylanreed.com && npm run build`
Expected: Clean build. Check `_site/books/index.html` contains the sticky note markup for books without covers.

- [ ] **Step 3: Commit**

```bash
git add src/_includes/partials/book-card.njk
git commit -m "feat: sticky note placeholder in book cards"
```

---

### Task 4: Update book.njk detail layout

**Files:**
- Modify: `src/_includes/layouts/book.njk:11-15` (the `{% else %}` block)

- [ ] **Step 1: Replace the else block**

Replace lines 11-15 (the existing placeholder markup):

```nunjucks
      <div class="book-detail-cover book-card-placeholder" style="background-color: {{ genre | genreColor }}">
        <span class="placeholder-title">{{ title }}</span>
        <span class="placeholder-author">Dylan Reed</span>
      </div>
```

With:

```nunjucks
      {% set h = title | titleHash %}
      <div class="book-detail-cover cover-placeholder">
        <div class="sticky-note" style="background-color: {{ genre | genreColor }}; --note-rotation: {{ h.noteRotation }}deg;">
          <div class="sticky-tape" style="top: {{ h.tape1Top }}px; {{ h.tape1Side }}; width: {{ h.tape1Width }}px; transform: rotate({{ h.tape1Rotation }}deg);"></div>
          <div class="sticky-tape" style="bottom: {{ h.tape2Bottom }}px; {{ h.tape2Side }}; width: {{ h.tape2Width }}px; transform: rotate({{ h.tape2Rotation }}deg);"></div>
          <div class="sticky-note__title">{{ title }}</div>
          <div class="sticky-note__divider"></div>
          <div class="sticky-note__status">{{ status | statusLabel }}</div>
        </div>
      </div>
```

- [ ] **Step 2: Verify build and visual check**

Run: `cd /Users/nervous/Dev/dylanreed.com && npm run dev`
Expected: Dev server starts. Navigate to `/books/` and verify sticky notes appear for books without covers. Check an individual book page (e.g., `/books/portal-5/`) to verify the detail view.

- [ ] **Step 3: Commit**

```bash
git add src/_includes/layouts/book.njk
git commit -m "feat: sticky note placeholder on book detail pages"
```

---

### Task 5: Visual verification and push

- [ ] **Step 1: Run dev server and verify all affected pages**

Run: `cd /Users/nervous/Dev/dylanreed.com && npm run dev`

Check these pages in a browser:
- `/books/` — grid should show sticky notes for: Thermal Gradient, Closer on Paper, Damsel Protocol, Portal 5, The Rehearsal Dinner
- `/books/portal-5/` — detail page with Urban Fantasy purple sticky
- `/books/damsel-protocol/` — detail page with taupe sticky, "submitted" status
- `/books/the-rehearsal-dinner/` — detail page with Romance mauve sticky
- Verify books WITH covers still display their cover images normally

- [ ] **Step 2: Push to deploy**

```bash
git push origin main
```

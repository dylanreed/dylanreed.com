# Coming Soon Cover: Genre-Colored Sticky Note

**Date:** 2026-04-10
**Status:** Approved

## Summary

Replace the current plain colored-div fallback (shown when a book has no `coverImage`) with a genre-colored sticky note taped to the page. Pure CSS, no image files. Each book gets slight visual variation seeded from its title for a hand-placed feel.

## Design

### Visual Elements

1. **Sticky note** — A rectangular note colored with the book's genre color (from the existing `genreColor` Eleventy filter). Contains:
   - Book title in white, Lora serif, bold
   - A small horizontal divider line (white, ~24px, 35% opacity)
   - Book status text (from `book.status`) in IBM Plex Mono, uppercase, small, 70% white opacity

2. **Tape** — Two pieces of translucent cream-colored tape (`rgba(255,255,240,0.55)`) with a faint border (`rgba(0,0,0,0.06)`). One on a top corner, one on a bottom corner, angled as if placed by hand. Tape overlaps the sticky note edges.

3. **Background** — Transparent. The sticky note sits directly on whatever surface it's placed on (book grid, detail page, etc.).

4. **Shadow** — Subtle drop shadow on the sticky note (`2px 3px 6px rgba(0,0,0,0.2)`) to give it depth against the page.

### Per-Book Variation

All variation values are derived from a simple hash of the book title so they are deterministic (same every build) but different per book:

- **Sticky note rotation:** -3° to +3°
- **Tape rotation:** -25° to +25° (independent per tape piece)
- **Tape position offset:** slight variation in top/bottom and left/right placement
- **Tape width:** 42px to 54px
- **Tape corner assignment:** which corners get tape (top-left + bottom-right, or top-right + bottom-left)

### Status Text

The sticky note displays the book's actual `status` field value:
- `planning` → "Planning"
- `outlined` → "Outlined"
- `drafting` → "Drafting"
- `submitted` → "Submitted"
- `coming soon` → "Coming Soon"
- Any other value → displayed as-is, capitalized

## Files to Modify

### `src/_includes/partials/book-card.njk`
Replace the existing `{% else %}` block (the plain genre-colored div fallback) with the sticky note markup. The card view uses 120px wide covers.

### `src/_includes/layouts/book.njk`
Replace the existing `{% else %}` block with the sticky note markup. The detail page uses 200px wide covers.

### `src/assets/css/style.css`
Add CSS classes for the sticky note component:
- `.cover-placeholder` — the container (transparent, aspect-ratio 2/3, flex center)
- `.sticky-note` — the note itself (genre color via inline style, padding, shadow, rotation via CSS custom property)
- `.sticky-tape` — tape strips (translucent cream, positioned absolute, rotation via CSS custom property)
- `.sticky-note__title` — title text styling
- `.sticky-note__divider` — the small horizontal rule
- `.sticky-note__status` — status text styling

### `.eleventy.js`
Add a `titleHash` filter that takes a book title string and returns a simple numeric hash. This hash drives the CSS custom properties for variation. Something like a basic string hash modulo approach — no crypto needed, just needs to be deterministic and distribute reasonably.

## Sizing

- **Book card (120px wide):** Sticky note fills ~85% of the container width. Font sizes scale proportionally smaller.
- **Book detail page (200px wide):** Sticky note fills ~75% of the container width. Font sizes as shown in mockups (13px title, 8px status).

## Genre Colors (Existing)

From the `genreColor` filter in `.eleventy.js`:

| Genre | Color |
|-------|-------|
| Cozy Fantasy | `#6b8e6b` |
| Sci-Fi | `#4a7a8b` |
| Romance | `#b5566a` |
| Steampunk | `#b8860b` |
| Urban Fantasy | `#7b68ae` |
| Noir | `#555555` |
| Space Western | `#c9784c` |
| YA Superhero | `#e06040` |
| Default (unmapped) | `#8b7355` |

Note: Several genres in books.json don't have explicit mappings (Superhero, Bureaucratic Fantasy, Cozy Mystery, Noir Mystery, Self-Help) and fall through to the default taupe. Adding mappings for these is out of scope for this spec but would be a good follow-up.

## Books Currently Affected

Books with `coverImage: null` that will show the sticky note:

| Book | Genre | Status |
|------|-------|--------|
| Thermal Gradient | Sci-Fi | drafting |
| Closer on Paper | Romance | drafting |
| Damsel Protocol | Bureaucratic Fantasy | submitted |
| Portal 5 | Urban Fantasy | planning |
| The Rehearsal Dinner | Romance | outlined |

## Out of Scope

- Adding missing genre color mappings
- Generating actual cover image files
- Changing the `coverImage` field in books.json for these books
- Responsive breakpoint changes (existing responsive behavior is fine)
